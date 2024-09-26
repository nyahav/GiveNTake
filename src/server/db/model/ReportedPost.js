import mongoose from 'mongoose'
import { MODEL_KEY, REPORTS_KEYS } from './constants.js'
import mongooseUniqueValidator from 'mongoose-unique-validator'
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'

/**
 * @type {mongoose.SchemaDefinitionProperty}
 */

const reportedPostSchema = new mongoose.Schema(
  {
    post: { type: mongoose.Schema.ObjectId, required: true, ref: MODEL_KEY.Post, unique: true },
    reports: [
      {
        // _id: false,
        user: { type: mongoose.Schema.ObjectId, required: true, ref: MODEL_KEY.User },
        reasonKey: { type: String, enum: REPORTS_KEYS },
        description: String,
        date: Date,
        isSeen: Boolean
      }
    ]
  },
  { timestamps: true }
)

reportedPostSchema.plugin(mongooseUniqueValidator)
reportedPostSchema.plugin(aggregatePaginate)

export default mongoose.model(MODEL_KEY.ReportedPost, reportedPostSchema)
