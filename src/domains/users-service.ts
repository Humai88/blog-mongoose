import { ObjectId } from "mongodb";
import { UserDBViewModel } from "../models/DBModel";
import { UserInputModel } from "../models/UserModel";
import { usersDBRepository } from "../repositories/usersDBRepository";
import bcrypt from "bcrypt";

export const usersService = {

  async createUser(user: UserInputModel): Promise<string> {
    const objectId = new ObjectId();
    const passwordSalt = await bcrypt.genSalt(10)
    const passwordHash = await this.generateHash(user.password, passwordSalt)

    const newUser: UserDBViewModel = {
      login: user.login,
      email: user.email,
      createdAt: new Date().toISOString(),
      passwordHash,
      passwordSalt,
      _id: objectId,
      createdByAdmin: true,
    }
    const userMongoDbResult = await usersDBRepository.createUser(newUser);
    return userMongoDbResult._id.toString()
  },

  async deleteUser(id: string): Promise<boolean> {
    return usersDBRepository.deleteUser(id)
  },

  async generateHash(password: string, salt: string) {
    const hash = await bcrypt.hash(password, salt);
    return hash
  }

}

