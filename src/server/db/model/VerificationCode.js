import mongoose from "mongoose";
import { MODEL_KEY } from "./constants.js";

//const ObjectId = mongoose.Schema.ObjectId;

/**
* @type {mongoose.SchemaDefinitionProperty}
*/
const verificationCodeSchema = new mongoose.Schema({
	email: { type: String, required: true,},
    code: { type: String, required: true, minlength: 6, maxlength: 6 },
}, { timestamps: true });


export default mongoose.model(MODEL_KEY.VerificationCode, verificationCodeSchema);