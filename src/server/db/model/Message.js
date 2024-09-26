import mongoose from "mongoose";
import { MODEL_KEY } from "./constants.js";
const ObjectId = mongoose.Schema.ObjectId;

/**
* @type {mongoose.SchemaDefinitionProperty}
*/
const messageSchema = new mongoose.Schema({
    conversation: { type: ObjectId, ref: MODEL_KEY.Conversation, required: true },
    sender: { type: ObjectId, required: true, ref: MODEL_KEY.User },
    body: {
        text: String
    },
}, { timestamps: true });

export default mongoose.model(MODEL_KEY.Message, messageSchema);