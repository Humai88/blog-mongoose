import {deviceSessionsCollection} from '../db/mongo-db'
import {DeviceViewModel} from '../models/DeviceModel'
import {DeviceDBViewModel} from '../models/DBModel'


export const deviceSessionsQueryRepository = {

  async getSessions(userId:string): Promise<DeviceViewModel[]> {
    const sessions = await deviceSessionsCollection.find({ userId: userId }).toArray();
    return sessions.map(session => this.mapCommentResult(session))
  },

  mapCommentResult(session: DeviceDBViewModel): DeviceViewModel {
    const sessionForOutput: DeviceViewModel = {
      deviceId: session.deviceId,
      title: session.title,
      ip: session.ip,
      lastActiveDate: session.lastActiveDate.toISOString(),
    }
    return sessionForOutput
  },

}

