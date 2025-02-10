import mongoose from 'mongoose'
import { WithId } from 'mongodb'
import { UserDBViewModel } from './DBModel'

export const UserSchema = new mongoose.Schema<WithId<UserDBViewModel>>({
  login: { 
    type: String, 
    required: true,
    unique: true
  },
  email: { 
    type: String, 
    required: true,
    unique: true,
  },
  createdAt: { 
    type: String,
    default: () => new Date().toISOString() 
  },
  passwordHash: { 
    type: String, 
    required: true 
  },
  passwordSalt: { 
    type: String, 
    required: true 
  },
  createdByAdmin: { 
    type: Boolean, 
    default: false 
  },
  emailConfirmation: {
    type: {
      confirmationCode: { type: String, required: true },
      isConfirmed: { type: Boolean, default: false },
      expirationDate: { type: Date, required: true }
    },
    required: false
  },
  passwordRecovery: {
    type: {
      recoveryCode: { type: String, required: true },
      expirationDate: { type: Date, required: true }
    },
    required: false,
    default: null
  }
})

export const UserModel = mongoose.model<UserDBViewModel>('users', UserSchema)