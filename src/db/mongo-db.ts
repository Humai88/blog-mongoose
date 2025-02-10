
import { SETTINGS } from "../settings";
import mongoose from "mongoose"

export const runDB = async () => {
    try {
        const uri = `${SETTINGS.MONGO_URL}/${SETTINGS.DB_NAME}`;
        await mongoose.connect(uri);
        console.log('connected to db')
    } catch (e) {
        console.log(e)
        await mongoose.disconnect()
    }
}