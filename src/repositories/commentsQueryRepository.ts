import { ObjectId } from "mongodb";
import { commentsCollection } from "../db/mongo-db"
import { CommentDBViewModel } from "../models/DBModel";
import { CommentViewModel } from "../models/CommentModel";


export const commentsQueryRepository = {


  async findComment(id: string): Promise<CommentViewModel | null> {
    const objectId = new ObjectId(id);
    const comment = await commentsCollection.findOne({ _id: objectId })
    return comment && this.mapCommentResult(comment)
  },

  mapCommentResult(comment: CommentDBViewModel): CommentViewModel {
    const commentForOutput: CommentViewModel = {
      id: comment._id.toString(),
      content: comment.content,
      createdAt: comment.createdAt,  
      commentatorInfo: {  
        userId: comment.commentatorInfo.userId,
        userLogin: comment.commentatorInfo.userLogin
      }
    }
    return commentForOutput
  },

}

