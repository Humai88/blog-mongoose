import { QueryBlogModel, QueryPostModel, QueryUserModel, SortDirection } from "../models/QueryModel"

export const setBlogQueryDefaultValues = (query: QueryBlogModel) => {
  return {
    pageNumber: query.pageNumber ? +query.pageNumber : 1,
    pageSize: query.pageSize !== undefined ? +query.pageSize : 10,
    sortBy: query.sortBy ? query.sortBy : 'createdAt',
    sortDirection: query.sortDirection ? query.sortDirection as SortDirection : 'desc',
    searchNameTerm: query.searchNameTerm ? query.searchNameTerm : "",
  }
}

export const setPostQueryDefaultValues = (query:  QueryPostModel) => {
  return {
    pageNumber: query.pageNumber ? +query.pageNumber : 1,
    pageSize: query.pageSize !== undefined ? +query.pageSize : 10,
    sortBy: query.sortBy ? query.sortBy : 'createdAt',
    sortDirection: query.sortDirection ? query.sortDirection as SortDirection : 'desc',
  }
}

export const setUserQueryDefaultValues = (query:  QueryUserModel) => {
  return {
    pageNumber: query.pageNumber ? +query.pageNumber : 1,
    pageSize: query.pageSize !== undefined ? +query.pageSize : 10,
    sortBy: query.sortBy ? query.sortBy : 'createdAt',
    sortDirection: query.sortDirection ? query.sortDirection as SortDirection : 'desc',
    searchLoginTerm: query.searchLoginTerm ? query.searchLoginTerm : "",
    searchEmailTerm: query.searchEmailTerm ? query.searchEmailTerm : "",
  }
}