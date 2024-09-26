import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'
import { MODEL_KEY } from './constants.js'
import { pointSchema } from '../utils/lib.js'
const ObjectId = mongoose.Schema.ObjectId
import paginate from 'mongoose-paginate-v2'
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'

/**
 * @type {mongoose.SchemaDefinitionProperty}
 */
const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 5 },
    imgName: String,
    interests: [String],
    location: {
      geometry: { type: pointSchema },
      country: String,
      city: String,
      address: String
    },

    bio: String,
    roles: {
      User: {
        type: Number,
        default: 2001
      },
      Editor: Number,
      Admin: Number
    },
    refreshToken: String,
    savedPosts: [{ type: ObjectId, ref: MODEL_KEY.Post }],
    interestedPosts: [{ type: ObjectId, ref: MODEL_KEY.Post }],
    reportedPosts: [{ type: ObjectId, ref: MODEL_KEY.Post }],
    reviews: [
      {
        postId: { type: ObjectId, ref: MODEL_KEY.Post },
        fromUser: { type: ObjectId, ref: MODEL_KEY.User },
        rating: {
          type: Number,
          required: true,
          min: 1,
          max: 5
        },
        description: { type: String },
        createdAt: { type: Date }
      }
    ],
    flags: {
      hideWelcomeModal: { type: Boolean }
    }
  },
  { timestamps: true }
)

userSchema.plugin(uniqueValidator)
userSchema.plugin(paginate)
userSchema.plugin(aggregatePaginate)

export default mongoose.model(MODEL_KEY.User, userSchema)
