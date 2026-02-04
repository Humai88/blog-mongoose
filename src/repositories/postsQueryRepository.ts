import { NewestLikeViewModel, PostViewModel } from "../models/PostModel";
import { CommentDBViewModel, LikeStatus, PostDBViewModel } from "../models/DBModel";
import {
  PaginatorCommentViewModel,
  PaginatorPostViewModel,
  QueryPostModel,
} from "../models/QueryModel";
import { ObjectId } from "mongodb";
import { commentsQueryRepository } from "./commentsQueryRepository";
import { PostModel } from "../models/post-model";
import { CommentModel } from "../models/comment-model";
import { PostLikeModel } from "../models/post-like-model";

export const postsQueryRepository = {
  async getPosts(
    query: QueryPostModel,
    blogId?: string,
    userId?: string
  ): Promise<PaginatorPostViewModel> {
    const postsMongoDbResult = await PostModel.find(this.setFilter(blogId))
      .lean()
      .sort({ [query.sortBy]: query.sortDirection })
      .skip((query.pageNumber - 1) * query.pageSize)
      .limit(query.pageSize);
    return this.mapBlogToPaginatorResult(postsMongoDbResult, query, blogId, userId);
  },

  async findPost(id: string, userId?: string): Promise<PostViewModel | null> {
    const objectId = new ObjectId(id);
    const post = await PostModel.findOne({ _id: objectId });
    if (!post) return null;
    
    const myStatus = userId 
      ? await this.getUserLikeStatus(id, userId) 
      : "None" as LikeStatus;
    const newestLikes = await this.getNewestLikes(id);
    
    return this.mapPostResult(post, myStatus, newestLikes);
  },

  setFilter(blogId?: string | QueryPostModel) {
    if (!blogId) {
      return {};
    }
    return { blogId: blogId };
  },

  async getComments(
    query: QueryPostModel,
    postId: string,
    userId?: string
  ): Promise<PaginatorCommentViewModel> {
    const commentsMongoDbResult = await CommentModel
      .find({ postId: postId })
      .lean()
      .sort({ [query.sortBy]: query.sortDirection })
      .skip((query.pageNumber - 1) * query.pageSize)
      .limit(query.pageSize)
    return this.mapCommentToPaginatorResult(
      commentsMongoDbResult,
      query,
      postId,
      userId
    );
  },

  async setTotalCount(filter: any): Promise<number> {
    const totalCount = await PostModel.countDocuments(filter);
    return totalCount;
  },

  async mapBlogToPaginatorResult(
    posts: PostDBViewModel[],
    query: QueryPostModel,
    blogId?: string,
    userId?: string
  ): Promise<PaginatorPostViewModel> {
    const totalCount: number = await this.setTotalCount(this.setFilter(blogId));
    
    // Get myStatus and newestLikes for each post
    const postsWithLikesInfo = await Promise.all(
      posts.map(async (post) => {
        const postId = post._id.toString();
        const myStatus = userId 
          ? await this.getUserLikeStatus(postId, userId)
          : "None" as LikeStatus;
        const newestLikes = await this.getNewestLikes(postId);
        return this.mapPostResult(post, myStatus, newestLikes);
      })
    );
    
    return {
      pagesCount: Math.ceil(totalCount / query.pageSize),
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount,
      items: postsWithLikesInfo,
    };
  },

  mapPostResult(post: PostDBViewModel, myStatus: LikeStatus = "None", newestLikes: NewestLikeViewModel[] = []): PostViewModel {
    return {
      id: post._id.toString(),
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: post.blogName,
      createdAt: post.createdAt,
      extendedLikesInfo: {
        likesCount: post.extendedLikesInfo?.likesCount || 0,
        dislikesCount: post.extendedLikesInfo?.dislikesCount || 0,
        myStatus: myStatus,
        newestLikes: newestLikes
      }
    };
  },

  async getUserLikeStatus(postId: string, userId: string): Promise<LikeStatus> {
    const existingLike = await PostLikeModel.findOne({ postId, userId });
    return existingLike ? existingLike.status : "None";
  },

  async getNewestLikes(postId: string): Promise<NewestLikeViewModel[]> {
    const newestLikes = await PostLikeModel.find({ postId, status: "Like" })
      .sort({ addedAt: -1 })
      .limit(3)
      .lean();
    
    return newestLikes.map(like => ({
      addedAt: like.addedAt,
      userId: like.userId,
      login: like.login
    }));
  },

  async mapCommentToPaginatorResult(
    comments: CommentDBViewModel[],
    query: QueryPostModel,
    postId?: string,
    userId?: string
  ): Promise<PaginatorCommentViewModel> {
    const totalCount = await CommentModel.countDocuments({
      postId: postId,
    });
    
    // Get myStatus for each comment if userId is provided
    const commentsWithStatus = await Promise.all(
      comments.map(async (comment) => {
        const myStatus = userId 
          ? await commentsQueryRepository.getUserLikeStatus(comment._id.toString(), userId)
          : "None" as const;
        return commentsQueryRepository.mapCommentResult(comment, myStatus);
      })
    );
    
    return {
      pagesCount: Math.ceil(totalCount / query.pageSize),
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount,
      items: commentsWithStatus,
    };
  },
};
