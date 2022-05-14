import axios, { AxiosRequestHeaders } from 'axios'
import Qs from 'qs'

export default class HttpClient {
  static post(url: string, body: object | null, params: object = {}, headers: AxiosRequestHeaders = {}) {
    return axios({
      url: url,
      method: 'post',
      headers: headers,
      data: body,
      params: params,
      paramsSerializer: function (params) {
        return Qs.stringify(params, { encode: false })
      },
    })
  }

  static get(url: string, params: object = {}, headers: AxiosRequestHeaders = {}) {
    return axios({
      url: url,
      method: 'get',
      headers: headers,
      params: params,
      paramsSerializer: function (params) {
        return Qs.stringify(params, { encode: false })
      },
    })
  }

  static put(url: string, body: object | null, params: object = {}, headers: AxiosRequestHeaders = {}) {
    return axios({
      url: url,
      method: 'put',
      headers: headers,
      data: body,
      params: params,
      paramsSerializer: function (params) {
        return Qs.stringify(params, { encode: false })
      },
    })
  }

  static delete(url: string, body: object | null, params: object = {}, headers: AxiosRequestHeaders = {}) {
    return axios({
      url: url,
      method: 'delete',
      headers: headers,
      data: body,
      params: params,
      paramsSerializer: function (params) {
        return Qs.stringify(params, { encode: false })
      },
    })
  }
}
