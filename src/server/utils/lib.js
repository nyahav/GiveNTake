import crypto from 'crypto';
export const generateFileName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex');

// mutable!!
export const removePropsMutable = (obj, propertiesToRemove) => {
    propertiesToRemove.forEach(prop => {
        delete obj[prop];
    });
}

// Example objects
// const obj1 = { a: null, b: undefined, c: null };    // true
// const obj2 = {};                                    // true
export function isObjectEmpty(obj) {
    return Object.keys(obj).length === 0 ? true : Object.values(obj).every(val => val == null);
}
