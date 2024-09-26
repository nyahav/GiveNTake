import { Post, User } from '../db/model/index.js'
import mongoose from 'mongoose'
import { getImageUrl } from '../utils/S3.js'

const ObjectId = mongoose.Types.ObjectId

export const createReview = async (req, res) => {
  const { rating, description, toUser, postId } = req.body
  const fromUser = req.user._id

  const newReview = {
    postId,
    fromUser,
    rating,
    description,
    createdAt: new Date()
  }
  console.log(newReview)

  let filter, query

  filter = { _id: toUser, 'reviews.postId': { $ne: postId } }
  query = { $addToSet: { reviews: newReview } }
  await User.updateOne(filter, query)

  // update post with the review was written to the user
  filter = { _id: postId }
  query = { reviewToUser: toUser }
  await Post.updateOne(filter, query)

  res.sendStatus(201)
}

export const getReviews = async (req, res) => {
  const { filters } = req.query

  const user = await User.aggregate([
    { $match: { _id: new ObjectId(filters.userId) } },
    { $project: { reviews: 1 } },
    { $unwind: { path: '$reviews' } },
    {
      $lookup: {
        from: User.collection.name,
        localField: 'reviews.fromUser',
        foreignField: '_id',
        as: 'reviews.fromUser',
        pipeline: [{ $project: { firstName: 1, lastName: 1, imgName: 1 } }]
      }
    },
    { $unwind: { path: '$reviews.fromUser' } },
    {
      $group: {
        _id: '$_id',
        reviews: {
          $push: '$reviews'
        }
      }
    },
    {
      $lookup: {
        from: User.collection.name,
        localField: '_id',
        foreignField: '_id',
        as: 'userDetails'
      }
    },
    { $unwind: { path: '$userDetails' } },
    {
      $addFields: {
        'userDetails.reviews': '$reviews'
      }
    },
    {
      $replaceRoot: {
        newRoot: '$userDetails'
      }
    }
  ])

  const reviews = user[0]?.reviews || []

  // get profile image from S3 bucket
  for (const review of reviews) {
    // For each review, generate a signed URL and save it to the review object
    const imgName = review.fromUser?.imgName
    const url = imgName ? await getImageUrl(imgName) : ''
    review.fromUser.imgUrl = url
  }

  res.status(200).json(reviews)
}
