import mongoose from 'mongoose'
import { WithId } from 'mongodb'
import { DeviceDBViewModel } from './DBModel'

export const DeviceSchema = new mongoose.Schema<WithId<DeviceDBViewModel>>({
  ip: {type: String, required: true},
  title: {type: String, required: true},
  iat: Number,
  exp: Number,
  userId: String,
  deviceId: {type: String, required: true},
  lastActiveDate: {type: Date, required: true},
})

export const DeviceModel = mongoose.model<DeviceDBViewModel>('devices', DeviceSchema)