import { DeviceDBViewModel } from "../models/DBModel";
import { jwtService } from "../application/jwtService";
import { DeviceModel } from "../models/device-model";

export const deviceSessionsDBRepository = {
  async updateRefreshToken(newRefreshToken: string): Promise<boolean> {
    const verificationResult = await jwtService.verifyRefreshToken(
      newRefreshToken
    );
    const { payload } = verificationResult;

    const result = await DeviceModel.updateOne(
      {
        deviceId: payload!.deviceId,
      },
      {
        $set: {
          iat: payload!.iat,
          exp: payload!.exp,
          lastActiveDate: new Date(),
        },
      }
    );
    if (result.modifiedCount === 0) {
      console.warn(
        `Failed to update refresh token for device ${payload!.deviceId}`
      );
    }
    return result.modifiedCount === 1;
  },

  async saveDeviceSession(session: DeviceDBViewModel): Promise<boolean> {
    console.log("Attempting to save device session:", session);
    const savedDevice = await DeviceModel.create(session);
    return !!savedDevice._id;
  },

  async findSessionByDeviceId(
    deviceId: string
  ): Promise<DeviceDBViewModel | null> {
    const session = await DeviceModel.findOne({
      deviceId: deviceId,
    });
    return session;
  },

  async findSessionByDeviceIdAndIat(
    deviceId: string,
    iat: number
  ): Promise<DeviceDBViewModel | null> {
    const session = await DeviceModel.findOne({
      deviceId: deviceId,
      iat: iat,
    });
    return session;
  },

  async removeOtherDeviceSessions(deviceId: string): Promise<void> {
    await DeviceModel.deleteMany({
      deviceId: { $ne: deviceId },
    });
  },

  async removeSpecificDeviceSession(deviceId: string): Promise<boolean> {
    const result = await DeviceModel.deleteOne({ deviceId: deviceId });
    return result.deletedCount === 1;
  },
};
