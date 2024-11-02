import { BlogViewModel } from '../src/models/BlogViewModel';
import { DBModel } from '../src/models/DBModel';
import { PostViewModel } from '../src/models/PostViewModel';

export const blog1: BlogViewModel = {
  id: "1",
  name: "Blog 1",
  description: "Description for Blog 1",
  websiteUrl: "https://www.blog1.com",
  isMembership: false,
  createdAt: "011-10-05T14:48:00.000Z",
}

export const blog2: BlogViewModel = {
  id: "2",
  name: "Blog 2",
  description: "Description for Blog 2",
  websiteUrl: "https://www.blog2.com",
  isMembership: false,
  createdAt: "011-10-05T14:48:00.000Z",
}

export const blog3: BlogViewModel = {
  id: "3",
  name: "Blog 3",
  description: "Description for Blog 3",
  websiteUrl: "https://www.blog2.com",
  isMembership: false,
  createdAt: "011-10-05T14:48:00.000Z",
}

export const post1: PostViewModel = {
  id: "1",
  title: "Post 1",
  content: "Content for Post 1",
  blogId: "1",
  shortDescription: "Short description for Post 1",
  blogName: "Blog 1",
  createdAt: "011-10-05T14:48:00.000Z",
}

export const post2: PostViewModel = {
  id: "2",
  title: "Post 2",
  content: "Content for Post 2",
  blogId: "2",
  shortDescription: "Short description for Post 2",
  blogName: "Blog 2",
  createdAt: "011-10-05T14:48:00.000Z",
}

export const post3: PostViewModel = {
  id: "3",
  title: "Post 3",
  content: "Content for Post 3",
  blogId: "3",
  shortDescription: "Short description for Post 3",
  blogName: "Blog 3",
  createdAt: "011-10-05T14:48:00.000Z",
}

export const dataset1: DBModel = {
  posts: [post1, post2, post3],
  blogs: [blog1, blog2, blog3],
}