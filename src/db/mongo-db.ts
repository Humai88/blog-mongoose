import { BlogDBViewModel, CommentDBViewModel, PostDBViewModel, UserDBViewModel, DeviceDBViewModel, ApiRequestDBViewModel } from "../models/DBModel";
import { SETTINGS } from "../settings";
import { Collection, MongoClient } from "mongodb"; 
import mongoose from "mongoose"

const client: MongoClient = new MongoClient(SETTINGS.MONGO_URL)
export const db = client.db(SETTINGS.DB_NAME);

export const postsCollection: Collection<PostDBViewModel> = db.collection<PostDBViewModel>(SETTINGS.POST_COLLECTION_NAME)
export const usersCollection: Collection<UserDBViewModel> = db.collection<UserDBViewModel>(SETTINGS.USER_COLLECTION_NAME)
export const commentsCollection: Collection<CommentDBViewModel> = db.collection<CommentDBViewModel>(SETTINGS.COMMENT_COLLECTION_NAME)
export const deviceSessionsCollection: Collection<DeviceDBViewModel> = db.collection<DeviceDBViewModel>(SETTINGS.DEVICE_SESSIONS_COLLECTION_NAME)
export const apiRequestsCollection: Collection<ApiRequestDBViewModel> = db.collection<ApiRequestDBViewModel>(SETTINGS.API_REQUESTS_COLLECTION_NAME)
 
export const runDB = async () => {
    try {
        await mongoose.connect(SETTINGS.MONGO_URL);
        console.log('connected to db')
    } catch (e) {
        console.log(e)
        await client.close()
        await mongoose.disconnect()
    }
}