import mongoose from "mongoose";

export const runInTransaction = async (callback) => {
  const session = await mongoose.startSession();
  
  try {
    session.startTransaction();
    
    await callback(session);

    // Commit the changes
    await session.commitTransaction();
  } catch (error) {
    // Rollback any changes made in the database
    await session.abortTransaction();

    // Rethrow the error
    throw error;
  } finally {
    // Ending the session
    session.endSession();
  }
};