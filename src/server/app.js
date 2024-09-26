import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import corsOptions from './config/corsOptions.js';
import { logger } from './middleware/logEvents.js';
import credentials from './middleware/credentials.js';
import errorHandler from './middleware/errorHandler.js';
import apiRoutes from './routes/api.js';
import { API_VERSION } from "./config.js";
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default function createApp() {
	const app = express();

	// custom middleware logger
	app.use(logger);

	// Handle options credentials check - before CORS!
	// and fetch cookies credentials requirement
	app.use(credentials);

	// Cross Origin Resource Sharing
	app.use(cors(corsOptions)); 

	// built-in middleware to handle urlencoded form data
	app.use(express.urlencoded({ extended: false }));

	// parse to json format
	app.use(express.json());

	//middleware for cookies
	app.use(cookieParser());

	// api routes
	app.use(`/api/v${API_VERSION}`, apiRoutes);

	// handle errors
	app.use(errorHandler);  

	return app;
}