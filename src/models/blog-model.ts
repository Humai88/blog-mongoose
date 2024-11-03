import mongoose from 'mongoose'
import { WithId } from 'mongodb'
import { BlogDBViewModel } from './DBModel'

export const BlogSchema = new mongoose.Schema<WithId<BlogDBViewModel>>({
  name: {type: String, required: true},
  description: String,
  websiteUrl: String,
  createdAt: {type: String, default: new Date().toISOString()},
  isMembership: Boolean,
})

export const BlogModel = mongoose.model<BlogDBViewModel>('blogs', BlogSchema)