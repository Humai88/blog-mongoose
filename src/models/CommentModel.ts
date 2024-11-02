export interface CommentInputModel {
  content: string
}

export interface CommentViewModel {
  id: string,
  content: string,
  createdAt: string,  
  commentatorInfo: CommentatorInfoModel
}

export interface CommentatorInfoModel {
  userId: string,
  userLogin: string,
}