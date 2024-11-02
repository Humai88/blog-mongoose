import { PostViewModel } from "../models/PostModel"
import { CommentDBViewModel, PostDBViewModel } from "../models/DBModel";
import { commentsCollection, postsCollection } from "../db/mongo-db";
import { PaginatorCommentViewModel, PaginatorPostViewModel, QueryPostModel } from "../models/QueryModel";
import { ObjectId } from "mongodb";
import { commentsQueryRepository } from "./commentsQueryRepository";

export const postsQueryRepository = {

  async getPosts(query: QueryPostModel, blogId?: string): Promise<PaginatorPostViewModel> {
    const postsMongoDbResult = await postsCollection.find(this.setFilter(blogId))
      .sort(query.sortBy, query.sortDirection)
      .skip((query.pageNumber - 1) * query.pageSize)
      .limit(query.pageSize)
      .toArray()
    return this.mapBlogToPaginatorResult(postsMongoDbResult, query, blogId)
  },

  async findPost(id: string): Promise<PostViewModel | null> {
    const objectId = new ObjectId(id);
    const post = await postsCollection.findOne({ _id: objectId })
    return post && this.mapPostResult(post)
  },

  setFilter(blogId?: string) {
    if (!blogId) {
      return {};
    }
    return { blogId: blogId }
  },


  async getComments(query: QueryPostModel, postId: string): Promise<PaginatorCommentViewModel> {
    const commentsMongoDbResult = await commentsCollection.find({ postId: postId })
      .sort(query.sortBy, query.sortDirection)
      .skip((query.pageNumber - 1) * query.pageSize)
      .limit(query.pageSize)
      .toArray()
    return this.mapCommentToPaginatorResult(commentsMongoDbResult, query, postId)
  },

  async setTotalCount(filter: any): Promise<number> {
    const totalCount = await postsCollection.countDocuments(filter)
    return totalCount
  },

  async mapBlogToPaginatorResult(posts: PostDBViewModel[], query: QueryPostModel, blogId?: string,): Promise<PaginatorPostViewModel> {
    const totalCount: number = await this.setTotalCount(this.setFilter(blogId))
    return {
      pagesCount: Math.ceil(totalCount / query.pageSize),
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount,
      items: posts.map(post => this.mapPostResult(post))
    }
  },

  mapPostResult(post: PostDBViewModel): PostViewModel {
    return {
      id: post._id.toString(),
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: post.blogName,
      createdAt: post.createdAt
    };
  },

  async mapCommentToPaginatorResult(comments: CommentDBViewModel[], query: QueryPostModel, postId?: string,): Promise<PaginatorCommentViewModel> {
    const totalCount = await commentsCollection.countDocuments({ postId: postId })
    return {
      pagesCount: Math.ceil(totalCount / query.pageSize),
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount,
      items: comments.map(comment => commentsQueryRepository.mapCommentResult(comment))
    }
  },

}