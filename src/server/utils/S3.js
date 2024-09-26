import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { S3_BUCKET } from "../config.js";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "../config/s3Client.js";
import { generateFileName } from "./lib.js";

const globalOptions = {
    client: s3Client,
    bucket: S3_BUCKET
};
export const getImageUrl = async (imageName, options = {}) => {
    // Assign default values using the global arguments
    const { client = s3Client, bucket = S3_BUCKET, expiresIn = 60 * 1000 } = options;

    const getObjectParams = {
        Bucket: bucket,
        Key: imageName
    };
    const command = new GetObjectCommand(getObjectParams);
    return await getSignedUrl(client, command, { expiresIn });
}

export const deleteImage = async (imageName, options = {}) => {
    // Assign default values using the global arguments
    const { client = s3Client, bucket = S3_BUCKET } = options;

    // delete post image from S3 bucket
    const deleteObjectParams = {
        Bucket: bucket,
        Key: imageName
    };
    const command = new DeleteObjectCommand(deleteObjectParams);
    await client.send(command);
};

export const putImage = async (file, options = {}) => {
    // Assign default values using the global arguments
    const { client = s3Client, bucket = S3_BUCKET, fileName = generateFileName() } = options;

    const params = {
        Bucket: bucket,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
    };

    const command = new PutObjectCommand(params);
    await client.send(command);
    console.log('File uploaded successfully');

    return fileName;
};