import { differenceInDays } from "date-fns";
import mongoose from "mongoose";

export function flattenObject(obj, parentKey = '') {
    return Object.keys(obj).reduce((acc, key) => {
        const fullKey = parentKey ? `${parentKey}.${key}` : key;
        if (typeof obj[key] === 'object' && obj[key] !== null) {
            Object.assign(acc, flattenObject(obj[key], fullKey));
        } else {
            acc[fullKey] = obj[key];
        }
        return acc;
    }, {});
}

export const pointSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['Point'],
        required: true
    },
    coordinates: {
        type: [Number],
        required: true
    }
});

export function convertToUpperCase(word) {
    // Split the word based on spaces or camel case
    const wordsArray = word.split(/(?=[A-Z])|\s/);

    // Convert each word to uppercase and join with underscore
    const result = wordsArray.map(w => w.toUpperCase()).join('_');

    return result;
}


export const calcRealtiveDay = (date1, date2) => {
    let x = differenceInDays(date1.toString(), date2.toString())
    if (x === 0)
        return date2.getHours() + ':' + (date2.getMinutes() < 10 ? '0' : '') + date2.getMinutes()
    else if (x === 1)
        return "Yesterday"
    else if (x < 7)
        return x + " day ago"
    // else 
    return date2.getDate().toString() + '/' + (date2.getMonth() + 1).toString()
}