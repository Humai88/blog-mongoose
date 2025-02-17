import { SETTINGS } from "../settings";
import mongoose from "mongoose"

export const runDB = async () => {
    try {
        await mongoose.connect(SETTINGS.MONGO_URL, {
            dbName: SETTINGS.DB_NAME
        });
        console.log('connected to db')
    } catch (e) {
        console.log(e)
        await mongoose.disconnect()
    }
}