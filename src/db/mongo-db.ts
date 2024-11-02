import { BlogDBViewModel, CommentDBViewModel, PostDBViewModel, UserDBViewModel, DeviceDBViewModel, ApiRequestDBViewModel } from "../models/DBModel";
import { SETTINGS } from "../settings";
import { Collection, MongoClient } from "mongodb"; // Import the MongoClient class from the "mongodb" module

// получение доступа к бд
const client: MongoClient = new MongoClient(SETTINGS.MONGO_URL)
export const db = client.db(SETTINGS.DB_NAME);

// получение доступа к коллекциям
export const blogsCollection: Collection<BlogDBViewModel> = db.collection<BlogDBViewModel>(SETTINGS.BLOG_COLLECTION_NAME)
export const postsCollection: Collection<PostDBViewModel> = db.collection<PostDBViewModel>(SETTINGS.POST_COLLECTION_NAME)
export const usersCollection: Collection<UserDBViewModel> = db.collection<UserDBViewModel>(SETTINGS.USER_COLLECTION_NAME)
export const commentsCollection: Collection<CommentDBViewModel> = db.collection<CommentDBViewModel>(SETTINGS.COMMENT_COLLECTION_NAME)
export const deviceSessionsCollection: Collection<DeviceDBViewModel> = db.collection<DeviceDBViewModel>(SETTINGS.DEVICE_SESSIONS_COLLECTION_NAME)
export const apiRequestsCollection: Collection<ApiRequestDBViewModel> = db.collection<ApiRequestDBViewModel>(SETTINGS.API_REQUESTS_COLLECTION_NAME)
 
// проверка подключения к бд
export const runDB = async () => {
    try {
        await client.connect()
        console.log('connected to db')
    } catch (e) {
        console.log(e)
        await client.close()
    }
}