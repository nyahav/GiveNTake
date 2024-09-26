import mongoose from 'mongoose';
import { Friends, User } from '../db/model/index.js';
import AppError from '../utils/AppError.js';
import { getImageUrl } from '../utils/S3.js';
import { getFollowersListQuery, getFollowingListQuery, getFollowingUsersIdQuery } from '../db/queries/friends.js';

const ObjectId = mongoose.Types.ObjectId;


export const getFriends = async (req, res) => {
    const { userId } = req.query;

    const following = await getFollowingListQuery(userId);
    // attach a image url to each user I am following
    for (const item of following) {
        const imgName = item?.imgName;
        const url = imgName ? await getImageUrl(imgName) : '';
        item.imgUrl = url;
    }

    const auth_userId = req.user?._id; // undefined if the user is unauthenticated
    let isAuthUserIsFollowing;
    if (auth_userId && auth_userId !== userId) {
        const authUser_following = await getFollowingUsersIdQuery(auth_userId);

        isAuthUserIsFollowing = authUser_following.includes(userId);
    }

    const followers = await getFollowersListQuery(userId);
    // attach a image url to each follower of mine
    for (const follower of followers) {
        const imgName = follower?.imgName;
        const url = imgName ? await getImageUrl(imgName) : '';
        follower.imgUrl = url;
    }

    const friends = { user: userId, following, followers, isAuthUserIsFollowing };

    res.status(200).json(friends);
};

export const friendAction = async (req, res) => {
    const { toUser, actions } = req.body;
    if (!toUser || !actions) throw new AppError('Please specify the action and the user.', 400);

    const authUser = req.user._id;

    let filter, query;
    filter = { user: authUser, toUser };

    if (actions.follow) {
        query = { user: authUser, toUser }
        await Friends.updateOne(filter, query, { upsert: true })
    } else if (actions.unfollow) {
        await Friends.deleteOne(filter)
    }
    res.sendStatus(200);
};