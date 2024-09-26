// middleware - parse body json data - this is good for cases when we use FormData to pass files
// at frontend just append an attribute to FormData called jsonData and it will parse it
export const bodyParse = (req, res, next) => {
    if (req?.body?.json) {
        const parsedJsonData = JSON.parse(req.body.json);
        delete req.body.json;
        req.body = { ...req.body, ...parsedJsonData };
    }
    next();
}