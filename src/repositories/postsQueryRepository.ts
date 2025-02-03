import { PostViewModel } from "../models/PostModel";
import { CommentDBViewModel, PostDBViewModel } from "../models/DBModel";
import {
  PaginatorCommentViewModel,
  PaginatorPostViewModel,
  QueryPostModel,
} from "../models/QueryModel";
import { ObjectId } from "mongodb";
import { commentsQueryRepository } from "./commentsQueryRepository";
import { PostModel } from "../models/post-model";
import { CommentModel } from "../models/comment-model";

export const postsQueryRepository = {
  async getPosts(
    query: QueryPostModel,
    blogId?: string
  ): Promise<PaginatorPostViewModel> {
    const postsMongoDbResult = await PostModel.find(this.setFilter(query))
      .lean()
      .sort({ [query.sortBy]: query.sortDirection })
      .skip((query.pageNumber - 1) * query.pageSize)
      .limit(query.pageSize);
    return this.mapBlogToPaginatorResult(postsMongoDbResult, query, blogId);
  },

  async findPost(id: string): Promise<PostViewModel | null> {
    const objectId = new ObjectId(id);
    const post = await PostModel.findOne({ _id: objectId });
    return post && this.mapPostResult(post);
  },

  setFilter(blogId?: string | QueryPostModel) {
    if (!blogId) {
      return {};
    }
    return { blogId: blogId };
  },

  async getComments(
    query: QueryPostModel,
    postId: string
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
      postId
    );
  },

  async setTotalCount(filter: any): Promise<number> {
    const totalCount = await PostModel.countDocuments(filter);
    return totalCount;
  },

  async mapBlogToPaginatorResult(
    posts: PostDBViewModel[],
    query: QueryPostModel,
    blogId?: string
  ): Promise<PaginatorPostViewModel> {
    const totalCount: number = await this.setTotalCount(this.setFilter(blogId));
    return {
      pagesCount: Math.ceil(totalCount / query.pageSize),
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount,
      items: posts.map((post) => this.mapPostResult(post)),
    };
  },

  mapPostResult(post: PostDBViewModel): PostViewModel {
    return {
      id: post._id.toString(),
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: post.blogName,
      createdAt: post.createdAt,
    };
  },

  async mapCommentToPaginatorResult(
    comments: CommentDBViewModel[],
    query: QueryPostModel,
    postId?: string
  ): Promise<PaginatorCommentViewModel> {
    const totalCount = await CommentModel.countDocuments({
      postId: postId,
    });
    return {
      pagesCount: Math.ceil(totalCount / query.pageSize),
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount,
      items: comments.map((comment) =>
        commentsQueryRepository.mapCommentResult(comment)
      ),
    };
  },
};
