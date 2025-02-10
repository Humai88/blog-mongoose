import { ObjectId} from "mongodb";
import { PostInputModel } from "../models/PostModel"
import { BlogDBViewModel, CommentDBViewModel, PostDBViewModel } from "../models/DBModel";
import { CommentInputModel } from "../models/CommentModel";
import { UserViewModel } from "../models/UserModel";
import { BlogModel } from "../models/blog-model";
import { PostModel } from "../models/post-model";
import { CommentModel } from "../models/comment-model";

export const postsDBRepository = {
    
  async createPost(post: PostInputModel): Promise<PostDBViewModel> {
    const objectPostId = new ObjectId(post.blogId);
    const blog: BlogDBViewModel | null = await BlogModel.findOne({ _id: objectPostId })
    const objectId = new ObjectId();
    const newPost: PostDBViewModel = {
      ...post,
      createdAt: new Date().toISOString(),
      blogName: blog?.name ? blog.name : '',
      _id: objectId,
    }
    await PostModel.create(newPost)
    return newPost
  },

  async updatePost(id: string, post: PostInputModel): Promise<boolean> {
    const objectId = new ObjectId(id);
    const result = await PostModel.updateOne({ _id: objectId }, { $set: { title: post.title, blogId: post.blogId, content: post.content, shortDescription: post.shortDescription } })
    return result.matchedCount === 1
  },

  async deletePost(id: string): Promise<boolean> {
    const objectId = new ObjectId(id);
    const result = await PostModel.deleteOne({ _id: objectId });
    return result.deletedCount === 1
  },

  async createCommentForPost(postId: string, comment: CommentInputModel, user: UserViewModel| null): Promise<CommentDBViewModel> {
    const objectId = new ObjectId();
    const newComment: CommentDBViewModel = {
      content: comment.content,
      createdAt: new Date().toISOString(),
      postId: postId,
      _id: objectId,
      commentatorInfo: {  
        userId: user!.id,
        userLogin: user!.login
      }
    }
    await CommentModel.create(newComment)
    return newComment
  },

}