export default class PageError extends Error {
    constructor(title, message) {
      super(message);
  
      this.isOperational = true;
      this.title = title;
      
      Error.captureStackTrace(this, this.constructor);
    }
  }