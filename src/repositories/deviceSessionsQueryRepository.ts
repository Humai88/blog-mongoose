
import {DeviceDBViewModel} from '../models/DBModel'
import { DeviceModel } from '../models/device-model';
import { DeviceViewModel } from '../models/DeviceModel';


export const deviceSessionsQueryRepository = {

  async getSessions(userId:string): Promise<DeviceViewModel[]> {
    const sessions = await DeviceModel.find({ userId: userId }).lean();
    return sessions.map(session => this.mapSessionResult(session))
  },

  mapSessionResult(session: DeviceDBViewModel): DeviceViewModel {
    const sessionForOutput: DeviceViewModel = {
      deviceId: session.deviceId,
      title: session.title,
      ip: session.ip,
      lastActiveDate: session.lastActiveDate.toISOString(),
    }
    return sessionForOutput
  },

}

