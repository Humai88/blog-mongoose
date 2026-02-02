import { LikeStatus } from "./DBModel"

export interface CommentInputModel {
  content: string
}

export interface LikeStatusInputModel {
  likeStatus: LikeStatus
}

export interface CommentViewModel {
  id: string,
  content: string,
  createdAt: string,  
  commentatorInfo: CommentatorInfoModel,
  likesInfo: LikesInfoViewModel
}

export interface CommentatorInfoModel {
  userId: string,
  userLogin: string,
}

export interface LikesInfoViewModel {
  likesCount: number,
  dislikesCount: number,
  myStatus: LikeStatus
}