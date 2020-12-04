import merge from "lodash/merge.js";
import { cleanOptions, compose, normalizeUrl, timeout } from "./utils/index.js";

export default class Yici {
  constructor(options = {}) {
    this.options = options;
    this.middleware = [];
    this.fetch = options.fetch || fetch;
    this.timeout = options.timeout || 0;
    this.retry = false;
    this.limit = 1;
    this.ResponseType = options.ResponseType || "json";
    /**
     * List of initial options supported by Fetch
     * Reference: https://developer.mozilla.org/zh-CN/docs/Web/API/WindowOrWorkerGlobalScope/fetch
     */
    this.optionsList = [
      "method",
      "headers",
      "body",
      "mode",
      "credentials",
      "cache",
      "redirect",
      "referrer",
      "referrerPolicy",
      "integrity",
    ];
  }

  use(...args) {
    this.middleware = [...this.middleware, ...args];
    return this;
  }

  async adapter([url, options]) {
    options.url && (url = normalizeUrl(options.baseURL + options.url));
    options = cleanOptions(this.optionsList, merge(this.options, options));
    const res = await timeout(this.fetch(url, options), this.timeout, url);
    return res[this.ResponseType]();
  }

  request(...args) {
    const dispatch = compose(this.middleware);
    return dispatch(this.adapter.bind(this))(args);
  }

  get(url, params, options = {}) {
    return this.request(url, { body: params, ...options, method: "GET" });
  }

  post(url, body, options = {}) {
    return this.request(url, { body, ...options, method: "POST" });
  }
}
