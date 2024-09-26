import { format } from 'date-fns';
import { v4 as uuid } from 'uuid';

import { existsSync } from 'fs';
import { promises as fsPromises } from 'fs';
import { join } from 'path';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const logEvents = async (message, logName) => {
    const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`;
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`;

    try {
        if (!existsSync(join(__dirname, '..', 'logs'))) {
            await fsPromises.mkdir(join(__dirname, '..', 'logs'));
        }

        await fsPromises.appendFile(join(__dirname, '..', 'logs', logName), logItem);
    } catch (err) {
        console.log(err);
    }
}

export const logger = (req, res, next) => {
    // Define an array of words to filter out
    const wordsToFilterOut = ['/src', '/node_modules', '/@', '/vite', '/auth']; // Add more words as needed

    // Check if the request method is "GET" and the request path starts with any of the words to filter out
    if (req.method === 'GET' && wordsToFilterOut.some(word => req.path.startsWith(word))) {
        // Skip logging the event
        next();
        return;
    }

    // Log the event
    logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, 'reqLog.txt');
    console.log(`${req.method} ${req.path}`);
    next();
}