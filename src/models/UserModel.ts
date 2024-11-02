export interface UserInputModel {
  login: string,
  email: string,
  password: string,
}

export interface LoginInputModel {
  loginOrEmail: string,
  password: string,
}

export interface UserViewModel {
  id: string,
  login: string,
  email: string,
  createdAt: string,
}

export interface LoginSuccessViewModel {
  accessToken: string,
}

export interface MeViewModel {
  userId: string,
  login: string,
  email: string,
}

export interface RegistrationConfirmationCodeModel {
  code: string,
}

export interface RegistrationEmailResendingModel {
  email: string,
}

export interface EmailConfirmationType {
  subject: string,
  body: string,
}

export interface PasswordRecoveryInputModel {
  email: string,
}

export interface NewPasswordRecoveryInputModel {
  newPassword: string,
  recoveryCode: string
}