import { Types } from 'mongoose'
import { Friends, Post, ReportedPost, User } from '../model/index.js'
const ObjectId = Types.ObjectId

const getPopulatePipeline = selfUserId_OI => [
  {
    $lookup: {
      from: User.collection.name,
      localField: 'user',
      foreignField: '_id',
      as: 'user',
      pipeline: [{ $project: { _id: 1, firstName: 1, lastName: 1, imgName: 1 } }]
    }
  },
  { $unwind: '$user' },
  {
    $project: {
      _id: 1,
      user: 1,
      category: 1,
      location: 1,
      helpDate: 1,
      isRemoteHelp: 1,
      imgName: 1,
      title: 1,
      description: 1,
      usersSaved: 1,
      createdAt: 1,
      updatedAt: 1,
      usersInterested: 1,
      usersReported: 1,
      ...(selfUserId_OI && {
        isSavedByUser: { $in: [selfUserId_OI, '$usersSaved'] },
        isUserInterested: { $in: [selfUserId_OI, '$usersInterested'] },
        isUserReported: { $in: [selfUserId_OI, '$usersReported'] }
      }),
      bumpDate: 1
    }
  },
  {
    $lookup: {
      from: User.collection.name,
      localField: 'usersSaved',
      foreignField: '_id',
      as: 'usersSaved',
      pipeline: [{ $project: { firstName: 1, lastName: 1 } }]
    }
  },
  {
    $lookup: {
      from: User.collection.name,
      localField: 'usersInterested',
      foreignField: '_id',
      as: 'usersInterested',
      pipeline: [{ $project: { firstName: 1, lastName: 1 } }]
    }
  },
  {
    $lookup: {
      from: User.collection.name,
      localField: 'usersReported',
      foreignField: '_id',
      as: 'usersReported',
      pipeline: [{ $project: { firstName: 1, lastName: 1 } }]
    }
  },
  {
    $addFields: {
      isSelf: { $eq: ['$user._id', selfUserId_OI] }
    }
  },
  {
    $sort: { createdAt: -1 } // Sort by createdAt field in descending order (newest first)
  }
]

const sortByBumpDateFirstPipeline = [
  {
    $addFields: {
      sortField: { $ifNull: ['$bumpDate', '$createdAt'] }
    }
  },
  {
    $sort: {
      sortField: -1 // Sort by the conditional sortField in descending order
    }
  },
  {
    $project: {
      sortField: 0 // Optionally remove sortDate from the output
    }
  }
]

export const getForYouPostsQuery = async (selfUserId_OI, options) => {
  const multiply = 2
  const ratio = 4 // 4:1 ratio // for every 4 posts of followedPosts show a post from interests posts
  const limitFollowedPosts = ratio * multiply

  let followedPosts = Friends.aggregate([
    {
      $match: {
        user: selfUserId_OI
      }
    },
    {
      $group: {
        _id: '$user',
        following: {
          $addToSet: '$toUser'
        }
      }
    },
    {
      $lookup: {
        from: Post.collection.name,
        as: 'posts',
        localField: 'following',
        foreignField: 'user'
      }
    },
    {
      $unwind: '$posts'
    },
    {
      $replaceRoot: {
        newRoot: '$posts'
      }
    },
    ...getPopulatePipeline(selfUserId_OI),
    ...sortByBumpDateFirstPipeline
  ])
  followedPosts = await Friends.aggregatePaginate(followedPosts, { ...options, limit: limitFollowedPosts })
  console.log('followedPosts', followedPosts)

  const limitInterestPosts = 1 * multiply + (limitFollowedPosts - followedPosts.docs.length)
  const userInterests = (await User.findById(selfUserId_OI)).interests || []
  let interestPosts = Post.aggregate([
    { $match: { category: { $in: userInterests } } },
    ...getPopulatePipeline(selfUserId_OI)
  ])
  interestPosts = await Post.aggregatePaginate(interestPosts, { ...options, limit: limitInterestPosts })
  console.log('interestPosts', interestPosts)

  // Mark interest posts
  interestPosts.docs.forEach(post => (post.isInterestPost = true))

  // Combine posts while maintaining the ratio
  const combinedPosts = []
  let followedIndex = 0
  let interestIndex = 0

  while (followedIndex < followedPosts.docs.length) {
    // Add up to 4 followed posts
    for (let i = 0; i < ratio && followedIndex < followedPosts.docs.length; i++) {
      combinedPosts.push(followedPosts.docs[followedIndex])
      followedIndex++
    }
    // Add 1 interest post
    if (interestIndex < interestPosts.docs.length) {
      combinedPosts.push(interestPosts.docs[interestIndex])
      interestIndex++
    }
  }

  // Add any remaining interest posts
  while (interestIndex < interestPosts.docs.length) {
    combinedPosts.push(interestPosts.docs[interestIndex])
    interestIndex++
  }

  // Ensure no duplicates
  const seen = new Set()
  const uniquePosts = combinedPosts.filter(post => {
    const postId = post._id.toString()
    if (seen.has(postId)) {
      return false
    } else {
      seen.add(postId)
      return true
    }
  })

  const result = {
    docs: uniquePosts,
    totalDocs: followedPosts.totalDocs + interestPosts.totalDocs,
    limit: followedPosts.docs.length + limitInterestPosts,
    page: followedPosts.page,
    totalPages: Math.max(interestPosts.totalPages, followedPosts.totalPages),
    pagingCounter: Math.max(interestPosts.pagingCounter, followedPosts.pagingCounter),
    hasPrevPage: followedPosts.hasPrevPage || interestPosts.hasPrevPage,
    hasNextPage: followedPosts.hasNextPage || interestPosts.hasNextPage,
    prevPage: followedPosts.prevPage,
    nextPage: Math.max(interestPosts.nextPage, followedPosts.nextPage)
  }
  console.log(result)
  return result
}

export const getSavedPostsQuery = async (selfUserId_OI, options) => {
  const posts = User.aggregate([
    {
      $match: {
        _id: selfUserId_OI
      }
    },
    {
      $lookup: {
        from: Post.collection.name,
        as: 'posts',
        localField: 'savedPosts',
        foreignField: '_id'
      }
    },
    {
      $unwind: '$posts'
    },
    {
      $replaceRoot: {
        newRoot: '$posts'
      }
    },
    ...getPopulatePipeline(selfUserId_OI)
  ])
  return await User.aggregatePaginate(posts, options)
}

export const getPostsQuery = async (selfUserId_OI, filters, options) => {
  const posts = Post.aggregate([
    ...(filters?.featuredPosts
      ? [
          {
            $match: {
              imgName: { $ne: null, $ne: '' } // imgName is required
            }
          },
          {
            $limit: 20
          }
        ]
      : []),
    ...(filters?.userId
      ? [
          {
            // get ONLY posts that the user with userId created.
            $match: { user: new ObjectId(filters.userId) }
          }
        ]
      : []),
    ...(filters?.category
      ? [
          {
            // get ONLY posts from a specific category only if asked
            $match: { category: filters.category }
          }
        ]
      : []),
    ...(filters?.location && +filters?.radius > 0
      ? [
          {
            $match: {
              $or: [
                { remoteHelp: true }, // Include documents without location
                {
                  'location.geometry': {
                    $geoWithin: {
                      $centerSphere: [
                        [+filters.location.lat || 0, +filters.location.long || 0],
                        +filters?.radius / 6371
                      ]
                    }
                  }
                } // Perform geospatial query only if location exists
              ]
            }
          }
        ]
      : []),
    ...getPopulatePipeline(selfUserId_OI),
    ...sortByBumpDateFirstPipeline
  ])

  return await Post.aggregatePaginate(posts, options)
}

export const getReportedPostsQuery = async (selfUserId_OI, options) => {
  const reportedPosts = ReportedPost.aggregate([
    {
      $lookup: {
        localField: 'post',
        foreignField: '_id',
        as: 'post',
        from: Post.collection.name
      }
    },
    { $unwind: '$post' },
    {
      $lookup: {
        from: User.collection.name,
        localField: 'post.user',
        foreignField: '_id',
        as: 'post.user',
        pipeline: [{ $project: { _id: 1, firstName: 1, lastName: 1, imgName: 1 } }]
      }
    },
    { $unwind: '$post.user' },
    {
      $addFields: {
        reportReasons: {
          $setUnion: [[]].concat([
            {
              $map: {
                input: '$reports',
                as: 'report',
                in: '$$report.reasonKey'
              }
            }
          ])
        },
        totalSeenReports: {
          $sum: {
            $map: {
              input: '$reports',
              as: 'report',
              in: { $cond: [{ $eq: ['$$report.isSeen', true] }, 1, 0] }
            }
          }
        },
        totalReports: { $size: '$reports' }
      }
    },
    {
      $addFields: {
        totalUnseenReports: {
          $subtract: ['$totalReports', '$totalSeenReports']
        }
      }
    },
    {
      $sort: {
        totalUnseenReports: -1
      }
    },
    {
      $match: {
        totalUnseenReports: { $gt: 0 }
      }
    }
  ])
  return await ReportedPost.aggregatePaginate(reportedPosts, options)
}

export const getPostReportsQuery = async (postId, options) => {
  const reportedPosts = ReportedPost.aggregate([
    {
      $match: {
        post: new ObjectId(postId)
      }
    },
    {
      $unwind: '$reports'
    },
    {
      $replaceRoot: {
        newRoot: {
          $mergeObjects: [{ _id: '$_id', name: '$name' }, '$reports']
        }
      }
    }
  ])
  return await ReportedPost.aggregatePaginate(reportedPosts, options)
}

getPostReportsQuery
