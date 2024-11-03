import { postsCollection } from "../db/mongo-db"
import { BlogInputModel, PostInBlogInputModel } from "../models/BlogModel"
import {  ObjectId } from "mongodb";
import { BlogDBViewModel, PostDBViewModel } from "../models/DBModel";
import { BlogModel } from "../models/blog-model";

export const blogsDBRepository = {

  async findBlog(id: string): Promise<BlogDBViewModel | null> {
    const objectId = new ObjectId(id);
    const blog: BlogDBViewModel| null = await BlogModel.findOne({ _id: objectId })
    return blog
  },

  async createBlog(blog: BlogDBViewModel): Promise<BlogDBViewModel> {
    const newBlog = await BlogModel.create(blog)
    const insertedBlog = await BlogModel.findOne({ _id: newBlog._id });
  
    if (!insertedBlog) {
      throw new Error('Failed to retrieve inserted blog');
    }
    return insertedBlog
  },

  async createPostInBlog(id: string, post: PostInBlogInputModel): Promise<PostDBViewModel> {
    const blog: BlogDBViewModel | null = await this.findBlog(id)
    const objectId = new ObjectId();
    const newPost = {
      ...post,
      createdAt: new Date().toISOString(),
      _id: objectId,
      blogName: blog?.name ? blog.name : '',
      blogId: id
    }
    await postsCollection.insertOne(newPost)
    return newPost
  },

  async updateBlog(id: string, blog: BlogInputModel): Promise<boolean> {
    const objectBlogId = new ObjectId(id);
    const result = await BlogModel.updateOne({ _id: objectBlogId }, { $set: { name: blog.name, websiteUrl: blog.websiteUrl, description: blog.description } })
    return result.matchedCount === 1
  },

  async deleteBlog(id: string): Promise<boolean> {
    const objectBlogId = new ObjectId(id);
    const result = await BlogModel.deleteOne({ _id: objectBlogId });
    return result.deletedCount === 1
  },

}

