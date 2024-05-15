import APIConfig, { configAuth } from "./APIConfig";

class AuthAPI {
  controller: string = "api/auth";

  signin(payload: any) {
    return APIConfig.post(`${this.controller}/login`, payload);
  }
  signup(payload: any) {
    return APIConfig.post(`${this.controller}/register`, payload);
  }
  resetPassword(payload: any, resetToken: any) {
    return APIConfig.post(
      `${this.controller}/reset-password?token=${resetToken}`,
      payload
    );
  }
  forgotPassword(payload: any) {
    return APIConfig.post(`${this.controller}/forgot-password`, payload);
  }
  Logout(token: any) {
    return APIConfig.post(`${this.controller}/logout`, {}, configAuth(token));
  }
  refreshToken(refresh: any) {
    return APIConfig.post(`${this.controller}/refresh-token`, refresh);
  }
}

export default new AuthAPI();
