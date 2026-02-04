import mongoose from 'mongoose'
import { WithId } from 'mongodb'
import { PostDBViewModel } from './DBModel'

export const PostSchema = new mongoose.Schema<WithId<PostDBViewModel>>({
  title: {type: String, required: true},
  shortDescription: {type: String, required: true},
  content: {type: String, required: true},
  blogId: {type: String, required: true},
  blogName: {type: String, required: true},
  createdAt: {type: String, default: new Date().toISOString()},
  extendedLikesInfo: {
    likesCount: {type: Number, default: 0},
    dislikesCount: {type: Number, default: 0},
  },
})

export const PostModel = mongoose.model<PostDBViewModel>('posts', PostSchema)