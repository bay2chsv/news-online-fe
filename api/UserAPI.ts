import APIConfig, { configAuth, configImage } from "./APIConfig";
import BaseAPI from "./BaseAPI";

class UserAPI extends BaseAPI {
  constructor() {
    super();
    this.controller = "api/users";
  }

  getByID(id: any, token?: any) {
    return APIConfig.get(`${this.controller}/detail/${id}`, configAuth(token));
  }
  update(id: any, payload: any, token: any) {
    return APIConfig.put(`${this.controller}/${id}/update`, payload, configAuth(token));
  }
  getSearchUserList(limit?: any, email?: any, enable_query?: any, fullName?: any, role_code?: any, token?: any) {
    let param = `limit=${limit}&email=${email ?? ""}&enable_query=${enable_query ?? ""}&fullName=${fullName ?? ""}&role_id=${
      role_code ?? ""
    }`;
    console.log(param);
    return APIConfig.get(`${this.controller}?${param}`, configAuth(token));
  }

  profile(token: any) {
    return APIConfig.get(`api/my-account/profile`, configAuth(token));
  }
  updateProfile(token: any, body: any) {
    return APIConfig.put(
      `api/my-account/update-profile
    `,
      body,
      configAuth(token)
    );
  }
  async upload(data: any, token: any) {
    const formData = new FormData();
    formData.set("file", data);
    return await APIConfig.patch(`api/my-account/upload-avatar`, formData, configImage(token ?? ""));
  }
}
export default new UserAPI();
