import jwt from 'jsonwebtoken';
import AppError from '../utils/AppError.js';

export function enforceAuth(req, res, next) {
    verifyAuth(req, res, next, true);
}

export function verifyAuth(req, res, next, enforceNotAuthenticated = false) {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        if(enforceNotAuthenticated){
            console.log('NOT AUTHENTICATED. AUTH HEADER INVALID.');
            throw new AppError('Not authenticated.', 400);    
        } else {
            return next();
        }
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) return res.sendStatus(403); //invalid token
            req.user = { ...decoded };

            // ## req.user structure should look like:
            // req.user = {
            //      _id: ObjectId,
            //      email: String,
            //      roles:{...}
            // }

            next();
        }
    );
}



