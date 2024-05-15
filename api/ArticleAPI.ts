import { id, role } from "@/utils/auth";
import { BaseConfig } from "@/utils/config";
import APIConfig, { configAuth, configImage } from "./APIConfig";
import BaseAPI from "./BaseAPI";

class ArticleAPi extends BaseAPI {
  constructor() {
    super();
    this.controller += "/articles";
  }

  async upload(data: any, token: any) {
    const formData = new FormData();
    formData.set("file", data);
    return await APIConfig.post(`api/media/upload`, formData, configImage(token ?? ""));
  }
  async getAll(limit?: number, page?: number) {
    let param = "";
    if (limit && page) {
      param += `?limit=${limit}&page=${page}`;
    }
    if (role === "ROLE_JOURNALIST") {
      param += `&f_created_by=${id}`;
    }
    return APIConfig.get(`${this.controller}${param}`);
  }
  async findByCondition(filters = {}) {
    const defaultFilters = {
      limit: 0,
      page: 1,
      f_category_id: "",
      f_date_from: "",
      f_date_to: "",
      f_tag_ids: "",
      f_title: "",
      f_created_by: "",
      s_status: "",
      f_reviewer_id: "",
    };
    const mergedFilters = { ...defaultFilters, ...filters };

    const queryString = Object.entries(mergedFilters)
      .map(([key, value]) => `${key}=${value}`)
      .join("&");

    return APIConfig.get(`${this.controller}?${queryString}`);
  }
  async handleAprrove(id: any, body: any, token: any) {
    return APIConfig.patch(`${this.controller}/review/${id}`, body, configAuth(token));
  }

  async displayArticleUserParentAndSub(limit: any, page: any, code: any) {
    let param = "";
    if (limit && page) {
      param += `?limit=${limit}&page=${page}`;
    }
    if (code) {
      param += `&c_code=${code}`;
    }
    return APIConfig.get(`/api/v1/home/search-by-tag${param}`);
  }
  async displayArticlesUser(limit: any, search?: any) {
    let url = `api/v1/home/articles?s_status=APPROVED&limit=${limit}`;
    if (search) url += `&f_title=${search}`;
    return APIConfig.get(url);
  }
  async findByTag(nameTag: any) {
    return APIConfig.get(`/api/v1/home/search-by-tag?code=${nameTag}`);
  }

  async updateArticleById(id: any, payload: any, token: any) {
    return APIConfig.put(`${this.controller}/${id}`, payload, configAuth(token));
  }
  async saveAricle(id: any, token: any) {
    return APIConfig.post(`${this.controller}/save/${id}`, {}, configAuth(token));
  }

  async checkSave(id: any, token: any) {
    return APIConfig.post(`api/v1/home/check-article-saved/${id}`, {}, configAuth(token));
  }
  async articleSave(limit: any, page: any, token: any) {
    let param = "";
    if (limit && page) {
      param += `?limit=${limit}&page=${page}`;
    }
    return APIConfig.get(`/api/my-account/article-saved${param}`, configAuth(token));
  }
  async articleComment(limit: any, page: any, token: any) {
    let param = "";
    if (limit && page) {
      param += `?limit=${limit}&page=${page}`;
    }
    return APIConfig.get(`/api/my-account/my-comments${param}`, configAuth(token));
  }
}
export default new ArticleAPi();
