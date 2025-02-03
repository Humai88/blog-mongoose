import { ObjectId } from "mongodb";
import { UserDBViewModel } from "../models/DBModel";
import { add } from "date-fns";
import { UserModel } from "../models/user-model";

export const usersDBRepository = {

  async createUser(user: UserDBViewModel): Promise<UserDBViewModel> {
    console.log('Creating user:', user);
    const newUser = await UserModel.create(user);
    console.log('Created user:', newUser);
    const verifiedUser = await UserModel.findById(newUser._id);
    console.log('Verified user:', verifiedUser);
    if (!verifiedUser) {
      console.error('Error creating user:');
      throw new Error('Failed to verify user creation');
    }
    
    return verifiedUser;
  },

  async findUserByLoginOrEmail(loginOrEmail: string): Promise<UserDBViewModel | null> {
    const user = await UserModel.findOne({ 
      $or: [
        { login: { $regex: new RegExp(`^${loginOrEmail}$`, 'i') } },
        { email: { $regex: new RegExp(`^${loginOrEmail}$`, 'i') } }
      ]
    })
    return  user
  },

  async doesExistByLoginOrEmail(login: string, email: string): Promise<UserDBViewModel | null> {
    const user = await UserModel.findOne({ 
      $or: [
        { login: { $regex: new RegExp(`^${login}$`, 'i') } },
        { email: { $regex: new RegExp(`^${email}$`, 'i') } }
      ]
    })
    return  user
  },

  async findUserByConfirmationCode(code: string): Promise<UserDBViewModel | null> {
    const user = await UserModel.findOne({ 'emailConfirmation.confirmationCode': code })
    return user
  },

  async findUserById(id: string): Promise<UserDBViewModel | null> {
    const objectUserId = new ObjectId(id);
    const user = await UserModel.findOne({ _id: objectUserId })
    return user
  },

  async updateEmailConfirmation(email: string, newConfirmationCode: string): Promise<boolean> {
    const result = await UserModel.updateOne(
      { email: email },
      {
        $set: {
          'emailConfirmation.confirmationCode': newConfirmationCode,
          'emailConfirmation.expirationDate': add(new Date(), { hours: 1, minutes: 30 }),
        }
      }
    );

    return result.modifiedCount === 1;
  },

  async confirmUser(id: string): Promise<UserDBViewModel | null> {
    const objectUserId = new ObjectId(id);
    const result = await UserModel.updateOne(
      { _id: objectUserId },    
      { $set: { 'emailConfirmation.isConfirmed': true } }
    )
    if (result.modifiedCount === 1) {
      const confirmedUser = await UserModel.findOne({ _id: objectUserId });
      return confirmedUser
    }
    return null
  },

  async deleteUser(id: string): Promise<boolean> {
    const objectBlogId = new ObjectId(id);
    const result = await UserModel.deleteOne({ _id: objectBlogId });
    return result.deletedCount === 1
  },

  async findUserByRecoveryCode(code: string): Promise<UserDBViewModel | null> {
    const user = await UserModel.findOne({ 'passwordRecovery.recoveryCode': code })
    return user
  },

  async updateUserPassword(id: string, newPasswordHash: string, newPasswordSalt: string): Promise<boolean> {
    const objectUserId = new ObjectId(id);
    const result = await UserModel.updateOne(
      { _id: objectUserId },  
      { 
        $set: {
          passwordHash: newPasswordHash,
          passwordSalt: newPasswordSalt,
          passwordRecovery: null
        }
      } 
    )
    return result.modifiedCount === 1
  },

  async updatePasswordRecovery(id: string, recoveryCode: string): Promise<boolean> {
    const objectUserId = new ObjectId(id);
    const result = await UserModel.updateOne(
      { _id: objectUserId },
      {
        $set: {
          'passwordRecovery.recoveryCode': recoveryCode,
          'passwordRecovery.expirationDate': add(new Date(), { hours: 1, minutes: 30 }),
        }
      }
    );
    return result.modifiedCount === 1;
  }


}

