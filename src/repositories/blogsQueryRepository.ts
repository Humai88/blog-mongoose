import { blogsCollection } from "../db/mongo-db"
import { BlogViewModel } from "../models/BlogModel";
import { BlogDBViewModel } from "../models/DBModel";
import { PaginatorBlogViewModel, QueryBlogModel } from "../models/QueryModel";
import { blogsDBRepository } from "./blogsDBRepository";

export const blogsQueryRepository = {
  
  async getBlogs(query: QueryBlogModel): Promise<PaginatorBlogViewModel> {
    const blogsMongoDbResult = await blogsCollection.find(this.setFilter(query))
      .sort(query.sortBy, query.sortDirection)
      .skip((query.pageNumber - 1) * query.pageSize)
      .limit(query.pageSize)
      .toArray()
    return this.mapBlogToPaginatorResult(blogsMongoDbResult, query)
  },

  async findBlog(id: string): Promise<BlogViewModel | null> {
    const blogMongoDbResult = await blogsDBRepository.findBlog(id)
    return blogMongoDbResult && this.mapBlogResult(blogMongoDbResult)
  },


  setFilter(query: QueryBlogModel) {
    const search = query.searchNameTerm
      ? { name: { $regex: query.searchNameTerm, $options: 'i' } }
      : {}
    return {
      ...search,
    }
  },

  async setTotalCount(filter: any): Promise<number> {
    const totalCount = await blogsCollection.countDocuments(filter)
    return totalCount
  },

  async mapBlogToPaginatorResult(items: BlogDBViewModel[], query: QueryBlogModel): Promise<PaginatorBlogViewModel> {
    const totalCount: number = await this.setTotalCount(this.setFilter(query))
    return {
      pagesCount: Math.ceil(totalCount / query.pageSize),
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount,
      items: items.map(blog => this.mapBlogResult(blog))
    }
  },

  mapBlogResult(blog: BlogDBViewModel): BlogViewModel {
    const blogForOutput: BlogViewModel = {
      id: blog._id.toString(),
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      createdAt: blog.createdAt,
      isMembership: blog.isMembership,
    }
    return blogForOutput
  },

}

