import { BlogViewModel } from "./BlogModel"
import { CommentViewModel } from "./CommentModel"
import { PostViewModel } from "./PostModel"
import { UserViewModel } from "./UserModel"


export type SortDirection = 'asc' | 'desc'


interface PaginatorModel {
  pagesCount: number
  pageSize: number
  totalCount: number
  page: number
}

export interface PaginatorBlogViewModel extends PaginatorModel {
  items: BlogViewModel[]
}
export interface PaginatorPostViewModel extends PaginatorModel {
  items: PostViewModel[]
}

export interface PaginatorUserViewModel extends PaginatorModel {
  items: UserViewModel[]
}

export interface PaginatorCommentViewModel extends PaginatorModel {
  items: CommentViewModel[]
}


 interface QueryModel {
  pageSize: number
  pageNumber: number
  sortDirection: SortDirection
}
export interface QueryBlogModel extends QueryModel {
  sortBy: keyof BlogViewModel
  searchNameTerm: string | null
}

export interface QueryUserModel extends QueryModel {  
  sortBy: keyof UserViewModel
  searchLoginTerm: string | null
  searchEmailTerm: string | null
}
export interface QueryPostModel extends QueryModel {
  sortBy: keyof PostViewModel
}

export type ParamModel = {
  id: string
}