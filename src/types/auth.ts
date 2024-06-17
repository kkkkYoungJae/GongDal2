export interface ISocialLoginRequest {
  idToken: string;
  type: 'A' | 'K' | 'G';
  fcmToken: string;
}

export interface ILoginResponse {
  userId: number;
  nickName: string;
  accessToken: string;
  refreshToken: string;
}

export interface IEmailLoginRequest {
  loginId: string;
  password: string;
  fcmToken: string;
}

export interface ISignUpRequest {
  loginId: string;
  password: string;
}

export interface IRefreshAuthTokenRequest {
  refreshToken: string;
}

export interface IRefreshAuthTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface IAuthState {
  userId: number;
  nickname: string;
  notice: boolean;
  birth: string | null;
  loginId: string;
  profile: string | null;
}

export interface IUpdateUserInfoRequest {
  nickname?: string;
  birth?: string;
}
