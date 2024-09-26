import mongoose from 'mongoose'
import { MODEL_KEY } from './constants.js'
const ObjectId = mongoose.Schema.ObjectId
import paginate from 'mongoose-paginate-v2'
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'

/**
 * @type {mongoose.SchemaDefinitionProperty}
 */
const friendsSchema = new mongoose.Schema(
  {
    user: { type: ObjectId, required: true, ref: MODEL_KEY.User }, // <- this user
    toUser: { type: ObjectId, required: true, ref: MODEL_KEY.User } // <- is following this user
  },
  { timestamps: true }
)
friendsSchema.plugin(paginate)
friendsSchema.plugin(aggregatePaginate)

export default mongoose.model(MODEL_KEY.Friends, friendsSchema)
