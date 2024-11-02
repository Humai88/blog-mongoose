import { BlogInputModel, PostInBlogInputModel } from "../models/BlogModel"
import { ObjectId } from "mongodb";
import { blogsDBRepository } from "../repositories/blogsDBRepository"
import { BlogDBViewModel } from "../models/DBModel";

export const blogsService = {

  async createBlog(blog: BlogInputModel): Promise<string> {
    const objectId = new ObjectId();
    const newBlog: BlogDBViewModel = {
      ...blog,
      isMembership: false,
      createdAt: new Date().toISOString(),
      _id: objectId,
    }
    const blogMongoDbResult = await blogsDBRepository.createBlog(newBlog);
    return blogMongoDbResult._id.toString()
  },

  async createPostInBlog(id: string, post: PostInBlogInputModel): Promise<string> {
    const postMongoDbResult = await blogsDBRepository.createPostInBlog(id, post)
    return postMongoDbResult._id.toString()
  },

  async updateBlog(id: string, blog: BlogInputModel): Promise<boolean> {
    return blogsDBRepository.updateBlog(id, blog)
  },

  async deleteBlog(id: string): Promise<boolean> {
    return blogsDBRepository.deleteBlog(id)
  },


}

