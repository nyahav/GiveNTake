import mongoose from 'mongoose'
import { Conversation, Message, Post, User } from '../model/index.js'
const ObjectId = mongoose.Types.ObjectId

// const contacts = [{
//     conversationId: '',
//     otherUsers: [{ // without the selfUser
//         userId: '',
//         firstName: '',
//         lastName: '',
//         imgUrl: ''
//     }],
//     lastMessage:
//         {
//             sender: {
//                 userId: '',
//                 firstName: '',
//                 lastName: '',
//                 imgUrl: ''
//             },
//             fromSelf: boolean,
//             message: {
//                 text: ''
//             },
//             createdAt: '',
//         }
//     },
//     post?: {
//         _id: '',
//         imgUrl: '',
//         title: ''
//     }
// }]

export const getContactsQuery = async userId => {
  const userConversations = await Conversation.aggregate([
    { $match: { users: new ObjectId(userId) } },
    {
      // get only the other pariticipants not incl. the selfUser
      $addFields: {
        otherUsers: {
          $filter: {
            input: '$users',
            as: 'user',
            cond: { $ne: ['$$user', new ObjectId(userId)] }
          }
        }
      }
    },
    {
      // populate users
      $lookup: {
        from: User.collection.name,
        localField: 'otherUsers',
        foreignField: '_id',
        as: 'otherUsers',
        pipeline: [
          {
            $project: {
              firstName: 1,
              lastName: 1,
              imgName: 1
            }
          }
        ]
      }
    },
    {
      $lookup: {
        from: Message.collection.name,
        localField: '_id',
        foreignField: 'conversation',
        as: 'lastMessage',
        pipeline: [
          { $sort: { _id: -1 } }, // Sort documents by _id in descending order
          { $limit: 1 }, // Limit the result to the last document
          {
            $lookup: {
              from: User.collection.name,
              localField: 'sender',
              foreignField: '_id',
              as: 'sender',
              pipeline: [
                {
                  $project: {
                    firstName: 1,
                    lastName: 1,
                    imgName: 1
                  }
                }
              ]
            }
          },
          { $unwind: '$sender' },
          {
            $addFields: {
              fromSelf: { $eq: ['$sender._id', new ObjectId(userId)] }
            }
          },
          {
            $project: {
              sender: 1,
              body: 1,
              createdAt: 1,
              fromSelf: 1
            }
          }
        ]
      }
    },
    { $unwind: '$lastMessage' },
    {
      $lookup: {
        from: Post.collection.name,
        localField: 'post',
        foreignField: '_id',
        as: 'post',
        pipeline: [
          {
            $project: {
              _id: 1,
              title: 1,
              imgName: 1
            }
          }
        ]
      }
    },
    {
      $unwind: {
        path: '$post',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $addFields: {
        isSelfRead: { $in: [new ObjectId(userId), '$readByUsers'] }
      }
    },
    {
      $project: {
        _id: 0,
        conversationId: '$_id',
        otherUsers: 1,
        lastMessage: 1,
        post: 1,
        isSelfRead: 1
      }
    },
    {
      $sort: { 'lastMessage.createdAt': -1 }
    }
  ])

  return userConversations
}

export const getConversationMessagesQuery = async (selfUser, conversationId) => {
  const userConversationMessages = await Message.aggregate([
    {
      $match: {
        conversation: new ObjectId(conversationId)
      }
    },
    {
      $addFields: {
        fromSelf: { $eq: ['$sender', new ObjectId(selfUser)] }
      }
    }
  ])

  return userConversationMessages
}

export const getConversationParticipantsQuery = async (selfUser, conversationId) => {
  const conversationParticipants = await Conversation.aggregate([
    {
      $match: {
        _id: new ObjectId(conversationId)
      }
    },
    {
      // populate users
      $lookup: {
        from: User.collection.name,
        localField: 'users',
        foreignField: '_id',
        as: 'users',
        pipeline: [
          {
            $addFields: {
              isSelf: { $eq: ['$_id', new ObjectId(selfUser)] }
            }
          },
          {
            $project: {
              firstName: 1,
              lastName: 1,
              imgName: 1,
              isSelf: 1
            }
          }
        ]
      }
    },
    {
      $project: {
        users: 1
      }
    }
  ])

  return conversationParticipants?.[0]?.users ?? []
}

export const getConversationPostQuery = async (selfUser, conversationId) => {
  const conversationParticipants = await Conversation.aggregate([
    {
      $match: {
        _id: new ObjectId(conversationId)
      }
    },
    {
      // populate users
      $lookup: {
        from: Post.collection.name,
        localField: 'post',
        foreignField: '_id',
        as: 'post'
      }
    },
    {
      $unwind: {
        path: '$post',
        preserveNullAndEmptyArrays: true
      }
    }
  ])

  return conversationParticipants?.[0]?.post
}
