import { CommentInputModel } from "../models/CommentModel"
import { PostInputModel } from "../models/PostModel"
import { UserViewModel } from "../models/UserModel"
import { postsDBRepository } from "../repositories/postsDBRepository"

export const postsService = {

  async createPost(post: PostInputModel): Promise<string> {
    const postMongoDbResult = await postsDBRepository.createPost(post)
    return postMongoDbResult._id.toString()
  },

  async updatePost(id: string, post: PostInputModel): Promise<boolean> {
    return postsDBRepository.updatePost(id, post)
  },

  async deletePost(id: string): Promise<boolean> {
    return postsDBRepository.deletePost(id)
  },

  async createCommentForPost(postId: string, comment: CommentInputModel, user: UserViewModel | null): Promise<string> {
    const commentMongoDbResult = await postsDBRepository.createCommentForPost(postId, comment, user)
    return commentMongoDbResult._id.toString()
  },

}
