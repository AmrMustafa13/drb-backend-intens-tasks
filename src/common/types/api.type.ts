export type APIResponse = {
  statusCode?: number;
  size?: number;
  message?: string;
  data?: object;
  accessToken?: string;
  refreshToken?: string;
};

export type AccessTokenPayload = {
  _id: string;
  email: string;
  name: string;
};
