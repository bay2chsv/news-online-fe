import APIConfig, { configAuth } from "./APIConfig";

export default class BaseAPI {
  // Biến khởi tạo controller API
  controller: null | string = "api/v1";
  /**
   * Hàm get by ID
   * @param {*} payload
   * @returns
   */
  getByID(id: any, token?: any) {
    return APIConfig.get(`${this.controller}/${id}`, configAuth(token));
  }
  getSearch(limit?: any, keyword?: any, sort?: any) {
    let param = "";
    if (limit && keyword) {
      param += `?limit=${limit}&q=${keyword}`;
    }

    return APIConfig.get(`${this.controller}${param}`);
  }
  getAll(limit?: any, page?: any, token?: any, sort?: any) {
    let param = "";
    if (limit && page) {
      param += `?limit=${limit}&page=${page}`;
    }
    if (sort) {
      param += `&sort=${sort}`;
    }
    return APIConfig.get(`${this.controller}${param}`, configAuth(token));
  }
  deleteByID(id: any, token: any) {
    return APIConfig.delete(`${this.controller}/${id}`, configAuth(token));
  }
  save(payload: any, token: any) {
    return APIConfig.post(`${this.controller}`, payload, configAuth(token));
  }
  update(id: any, payload: any, token: any) {
    return APIConfig.patch(`${this.controller}/${id}`, payload, configAuth(token));
  }
}
