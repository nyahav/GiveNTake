import mongoose from "mongoose";
import { Friends, Post, User } from "../model/index.js";
const ObjectId = mongoose.Types.ObjectId;

//it is giving a list of user ids as strings instead of object ids
export const getFollowingUsersIdQuery = async (userId) => {
    const following = (await Friends.aggregate([
        { $match: { user: new ObjectId(userId) } },
        { $group: { _id: "$user", following: { $addToSet: "$toUser" } } },
        {
            $project: {
                _id: 0, following: {
                    $map: {
                        input: "$following",
                        as: "followingVal",
                        in: { $toString: "$$followingVal" }
                    }
                }
            }
        }
    ]))[0]?.following || [];

    return following;
};

//populated
export const getFollowingListQuery = async (userId) => {
    const following = (await Friends.aggregate([
        { $match: { user: new ObjectId(userId) } },
        { $group: { _id: "$user", following: { $addToSet: "$toUser" } } },
        { $lookup: { from: User.collection.name, localField: "following", foreignField: "_id", as: "followingDetails", pipeline: [{ $project: { firstName: 1, lastName: 1, imgName: 1 } }] } },
        { $project: { _id: 0, following: "$followingDetails" } }
    ]))[0]?.following || [];

    return following;
};

export const getFollowersListQuery = async (userId) => {
    const followers = (await Friends.aggregate([
        { $match: { toUser: new ObjectId(userId) } },
        { $group: { _id: "$toUser", followers: { $addToSet: "$user" } } },
        { $lookup: { from: User.collection.name, localField: "followers", foreignField: "_id", as: "followersDetails", pipeline: [{ $project: { firstName: 1, lastName: 1, imgName: 1 } }] } },
        { $project: { _id: 0, followers: "$followersDetails" } }
    ]))[0]?.followers || [];

    return followers;
};