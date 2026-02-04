import { ObjectId} from "mongodb";
import { PostInputModel } from "../models/PostModel"
import { BlogDBViewModel, CommentDBViewModel, LikeStatus, PostDBViewModel } from "../models/DBModel";
import { CommentInputModel } from "../models/CommentModel";
import { UserViewModel } from "../models/UserModel";
import { BlogModel } from "../models/blog-model";
import { PostModel } from "../models/post-model";
import { CommentModel } from "../models/comment-model";
import { PostLikeModel } from "../models/post-like-model";

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
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
      }
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
      },
      likesInfo: {
        likesCount: 0,
        dislikesCount: 0
      }
    }
    await CommentModel.create(newComment)
    return newComment
  },

  async getUserLikeStatus(postId: string, userId: string): Promise<LikeStatus> {
    const existingLike = await PostLikeModel.findOne({ postId, userId });
    return existingLike ? existingLike.status : "None";
  },

  async updateLikeStatus(postId: string, userId: string, login: string, newStatus: LikeStatus): Promise<boolean> {
    const objectPostId = new ObjectId(postId);
    
    // Get current status
    const currentStatus = await this.getUserLikeStatus(postId, userId);
    
    // If same status, do nothing
    if (currentStatus === newStatus) {
      return true;
    }

    // Calculate count changes
    const likesChange = this.calculateLikesChange(currentStatus, newStatus);
    const dislikesChange = this.calculateDislikesChange(currentStatus, newStatus);

    // Update the like record
    if (newStatus === "None") {
      // Remove the like record
      await PostLikeModel.deleteOne({ postId, userId });
    } else {
      // Upsert the like record
      await PostLikeModel.updateOne(
        { postId, userId },
        { $set: { status: newStatus, login: login, addedAt: new Date().toISOString() } },
        { upsert: true }
      );
    }

    // Update the post's like counts
    await PostModel.updateOne(
      { _id: objectPostId },
      {
        $inc: {
          "extendedLikesInfo.likesCount": likesChange,
          "extendedLikesInfo.dislikesCount": dislikesChange
        }
      }
    );

    return true;
  },

  calculateLikesChange(currentStatus: LikeStatus, newStatus: LikeStatus): number {
    if (currentStatus === "Like" && newStatus !== "Like") return -1;
    if (currentStatus !== "Like" && newStatus === "Like") return 1;
    return 0;
  },

  calculateDislikesChange(currentStatus: LikeStatus, newStatus: LikeStatus): number {
    if (currentStatus === "Dislike" && newStatus !== "Dislike") return -1;
    if (currentStatus !== "Dislike" && newStatus === "Dislike") return 1;
    return 0;
  },

}