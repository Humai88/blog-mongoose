export interface BlogInputModel {
  name: string,
  description: string,
  websiteUrl: string,
}

export interface PostInBlogInputModel {
  title: string,
  content: string,
  shortDescription: string,
}

export interface BlogViewModel {
  id: string,
  name: string,
  description: string,
  websiteUrl: string,
  createdAt: string,
  isMembership: boolean,
}


