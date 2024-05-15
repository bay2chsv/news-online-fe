import APIConfig, { configAuth } from "./APIConfig";
import BaseAPI from "./BaseAPI";

class CommentAPI extends BaseAPI {
  constructor() {
    super();
    this.controller = "api/comments";
  }

  async getArticlesIdForUser(id: any, limit: any, sort: any) {
    let param = "";
    if (limit && sort) {
      param += `?limit=${limit}&sort=${sort}`;
    }
    return APIConfig.get(`api/v1/home/article/${id}/comments${param}`);
  }
  async findByCondition(filters = {}, token: any) {
    const defaultFilters = {
      limit: 5,
      email: "",
      text: "",
      status: "",
      f_date_from: "",
      f_date_to: "",
      f_reviewer_id: "",
    };

    const mergedFilters = { ...defaultFilters, ...filters };

    const queryString = Object.entries(mergedFilters)
      .map(([key, value]) => `${key}=${value}`)
      .join("&");
    //controller =api/comments
    return APIConfig.get(`${this.controller}/list-comments?${queryString}`, configAuth(token));
  }

  async comment(id: any, payload: any, token: any) {
    return APIConfig.post(`${this.controller}/article/${id}`, payload, configAuth(token));
  }
  async getallComment(limit?: any, page?: any, token?: any) {
    let param = "";
    if (limit && page) {
      param += `?limit=${limit}&page=${page}`;
    }
    return APIConfig.get(`${this.controller}/list-comments${param}`, configAuth(token));
  }
  async reviewComment(id: any, payload: any, token: any) {
    return APIConfig.patch(`${this.controller}/review/${id}`, payload, configAuth(token));
  }
  async getCommentId(id: any, token: any) {
    return APIConfig.get(`${this.controller}/detail/${id}`, configAuth(token));
  }
}
export default new CommentAPI();
