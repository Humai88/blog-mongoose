import { LikeStatus } from "./DBModel"

export interface PostViewModel {
    id: string
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string
    extendedLikesInfo: ExtendedLikesInfoViewModel
}

export interface PostInputModel {
    title: string,
    content: string,
    shortDescription: string,
    blogId: string,
}

export interface ExtendedLikesInfoViewModel {
    likesCount: number
    dislikesCount: number
    myStatus: LikeStatus
    newestLikes: NewestLikeViewModel[]
}

export interface NewestLikeViewModel {
    addedAt: string
    userId: string
    login: string
}