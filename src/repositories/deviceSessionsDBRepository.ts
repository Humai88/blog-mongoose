import { deviceSessionsCollection } from "../db/mongo-db"
import { DeviceDBViewModel } from "../models/DBModel"
import { jwtService } from '../application/jwtService';

export const deviceSessionsDBRepository = {

  async updateRefreshToken(newRefreshToken: string): Promise<boolean> {
    const verificationResult = await jwtService.verifyRefreshToken(newRefreshToken);
    const { payload } = verificationResult;

    const result = await deviceSessionsCollection.updateOne(
      { 
        deviceId: payload!.deviceId
      },
      { $set: { iat: payload!.iat, 
        exp: payload!.exp,
        lastActiveDate: new Date()} }
    )
   if (result.modifiedCount === 0) {
      console.warn(`Failed to update refresh token for device ${payload!.deviceId}`);
  }
    return result.modifiedCount === 1
  },
  
  async saveDeviceSession(session: DeviceDBViewModel ): Promise<boolean> {
    console.log('Attempting to save device session:', session);
    const result = await deviceSessionsCollection.insertOne(session)
    return result.acknowledged === true;
  },
  
  async findSessionByDeviceId(deviceId: string): Promise<DeviceDBViewModel | null> {
    const session = await deviceSessionsCollection.findOne({ 
      deviceId: deviceId
    });
    return session;
  },

  async findSessionByDeviceIdAndIat(deviceId: string, iat: number): Promise<DeviceDBViewModel | null> {
    const session = await deviceSessionsCollection.findOne({ 
      deviceId: deviceId,
      iat: iat
    });
    return session;
  },

  async removeOtherDeviceSessions(deviceId: string): Promise<void> {
    const result = await deviceSessionsCollection.deleteMany({ deviceId: { $ne: deviceId } });
    if (result.deletedCount === 0) {
      throw new Error('Failed to remove all device sessions');
    }
  },

  async removeSpecificDeviceSession(deviceId: string): Promise<void> {
    const result = await deviceSessionsCollection.deleteOne({ deviceId: deviceId });
    if (result.deletedCount !== 1) {
      throw new Error('Failed to remove device session');
    }
  },


}

