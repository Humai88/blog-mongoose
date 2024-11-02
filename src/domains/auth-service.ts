import { ObjectId } from "mongodb";
import { UserDBViewModel } from "../models/DBModel";
import { LoginInputModel, UserInputModel } from "../models/UserModel";
import { usersDBRepository } from "../repositories/usersDBRepository";
import { deviceSessionsDBRepository } from "../repositories/deviceSessionsDBRepository";
import bcrypt from "bcrypt";
import { randomUUID } from "crypto";
import { add } from "date-fns";
import { nodemailerAdapter, emailManager } from "../adapters/nodemailerAdapter";
import { Request } from 'express';
import { parseUserAgent } from "../helpers/authHelper";


export const authService = {

  async registerUser(user: UserInputModel): Promise<UserDBViewModel | null> {
    const newUser = await this.createUserObject(user);

    try {
      const createdUser = await usersDBRepository.createUser(newUser);

      if (!createdUser) {
        throw new Error('Failed to create user in database');
      }

      await this.sendConfirmationEmail(createdUser);
      return createdUser;
    } catch (error) {
      console.error('User registration error:', error);
      return null;
    }
  },

  async createUserObject(user: UserInputModel): Promise<UserDBViewModel> {
    const objectId = new ObjectId();
    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await this.generateHash(user.password, passwordSalt);

    return {
      login: user.login,
      email: user.email,
      createdAt: new Date().toISOString(),
      passwordHash,
      passwordSalt,
      _id: objectId,
      createdByAdmin: false,
      emailConfirmation: {
        confirmationCode: randomUUID(),
        expirationDate: add(new Date(), { hours: 1, minutes: 30 }),
        isConfirmed: false
      }
    };
  },

  async sendConfirmationEmail(user: UserDBViewModel): Promise<void> {
    if (!user.emailConfirmation) {
      throw new Error('User email confirmation data is missing');
    }

    await nodemailerAdapter.sendEmail(
      user.email,
      emailManager.registrationEmail,
      {your_confirmation_code: user.emailConfirmation.confirmationCode}
    );
  },

  async confirmRegistration(code: string): Promise<boolean> {
    const user = await usersDBRepository.findUserByConfirmationCode(code);
    if (!user) {
      return false
    }
    if (user.emailConfirmation!.isConfirmed) {
      return false
    }
    if (user.emailConfirmation!.expirationDate < new Date()) {
      return false
    }
    const confirmedUser = await usersDBRepository.confirmUser(user._id.toString());
    return confirmedUser !== null
  },

  async checkCredentials(login: LoginInputModel): Promise<UserDBViewModel | null> {
    const user = await usersDBRepository.findUserByLoginOrEmail(login.loginOrEmail);
    if (!user) {
      return null
    }
    if (!user.createdByAdmin && !user.emailConfirmation!.isConfirmed) {
      return null
    }
    const passwordHash = await this.generateHash(login.password, user.passwordSalt);
    if (user.passwordHash !== passwordHash) {
      return null
    }
    return user
  },

  async resendRegistrationEmail(email: string): Promise<boolean> {
    const user = await usersDBRepository.findUserByLoginOrEmail(email);
    try {
      if (!user || user.emailConfirmation?.isConfirmed) {
        return false;
      }
      const newConfirmationCode = randomUUID();
      await usersDBRepository.updateEmailConfirmation(user.email, newConfirmationCode);
      await nodemailerAdapter.sendEmail(
        user.email,
        emailManager.registrationEmail,
        {your_confirmation_code: newConfirmationCode}
      );

      return true;
    } catch (error) {
      console.error('Resend email error:', error);
      throw error;
    }
  },

  async updateRefreshToken(newRefreshToken: string): Promise<boolean> {
    return await deviceSessionsDBRepository.updateRefreshToken(newRefreshToken);
  },

  async saveDeviceSession(userId: string, req: Request, deviceId: string, tokenExp: number, tokenIat: number): Promise<boolean> {
    try {
      const userAgent = req.get('User-Agent') || 'Unknown Device';
      const ip = req.ip || req.socket.remoteAddress || 'Unknown IP';
      const title = parseUserAgent(userAgent);

      const newSession = {
        userId: userId,
        ip: ip,
        title: title,
        deviceId: deviceId,
        exp: tokenExp,
        iat: tokenIat,
        lastActiveDate: new Date()
      };

      return await deviceSessionsDBRepository.saveDeviceSession(newSession);
    } catch (error) {
      console.error('Error in authService.saveDeviceSession:', error);
      return false;
    }
  },

  async removeOtherDeviceSessions(deviceId: string): Promise<void> {
    await deviceSessionsDBRepository.removeOtherDeviceSessions(deviceId);
  },

  async generateHash(password: string, salt: string) {
    const hash = await bcrypt.hash(password, salt);
    return hash
  },

  async removeSpecificDeviceSession(deviceId: string): Promise<void> {
    await deviceSessionsDBRepository.removeSpecificDeviceSession(deviceId);
  },

  async createNewPassword(recoveryCode: string, newPassword: string): Promise<boolean> {
    const user = await usersDBRepository.findUserByRecoveryCode(recoveryCode);
    if (!user) {
      return false
    }
    if (user.passwordRecovery!.expirationDate < new Date()) {
      return false
    }

    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await this.generateHash(newPassword, passwordSalt);
    const updatedUser = await usersDBRepository.updateUserPassword(user._id.toString(), passwordHash, passwordSalt);
    if (!updatedUser) {
      return false
    }
    await nodemailerAdapter.sendEmail(
      user.email,
      emailManager.passwordRecoveryEmail,
      {your_recovery_code: recoveryCode}
    );
    return true
  },

  async passwordRecovery(email: string): Promise<boolean> {
    const user = await usersDBRepository.findUserByLoginOrEmail(email);
    const recoveryCode = randomUUID();
    user && await usersDBRepository.updatePasswordRecovery(user._id.toString(), recoveryCode);
    await nodemailerAdapter.sendEmail(
      email,
      emailManager.passwordRecoveryEmail,
      {your_recovery_code: recoveryCode}
    );
    return true
  }

}

