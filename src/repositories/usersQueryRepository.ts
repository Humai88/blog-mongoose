import { ObjectId } from "mongodb";
import { usersCollection } from "../db/mongo-db"
import { UserDBViewModel } from "../models/DBModel";
import { PaginatorUserViewModel, QueryUserModel } from "../models/QueryModel";
import { MeViewModel, UserViewModel } from "../models/UserModel";


export const usersQueryRepository = {

  async getUsers(query: QueryUserModel): Promise<PaginatorUserViewModel> {
    const usersMongoDbResult = await usersCollection.find(this.setFilter(query))
      .sort(query.sortBy, query.sortDirection)
      .skip((query.pageNumber - 1) * query.pageSize)
      .limit(query.pageSize)
      .toArray()
    return this.mapUserToPaginatorResult(usersMongoDbResult, query)
  },

  async findUser(id: string): Promise<UserViewModel | null> {
    const objectId = new ObjectId(id);
    const user = await usersCollection.findOne({ _id: objectId })
    return user && this.mapUserResult(user)
  },

  async getMeInfo(user: UserViewModel | null): Promise<MeViewModel | null> {
    if (!user) {
      return null
    }
    const me = {
      userId: user.id,
      login: user.login,
      email: user.email,
    }
    return me
  },

  setFilter(query: QueryUserModel) {
    return {
      $or: [
        query.searchLoginTerm
          ? { login: { $regex: query.searchLoginTerm, $options: 'i' } }
          : {},
        query.searchEmailTerm
          ? { email: { $regex: query.searchEmailTerm, $options: 'i' } }
          : {}
      ]
    };
  },

  async setTotalCount(filter: any): Promise<number> {
    const totalCount = await usersCollection.countDocuments(filter)
    return totalCount
  },

  async mapUserToPaginatorResult(items: UserDBViewModel[], query: QueryUserModel): Promise<PaginatorUserViewModel> {
    const totalCount: number = await this.setTotalCount(this.setFilter(query))
    return {
      pagesCount: Math.ceil(totalCount / query.pageSize),
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount,
      items: items.map(user => this.mapUserResult(user))
    }
  },

  mapUserResult(user: UserDBViewModel): UserViewModel {
    const userForOutput: UserViewModel = {
      id: user._id.toString(),
      createdAt: user.createdAt,
      login: user.login,
      email: user.email,
    }
    return userForOutput
  },

}

