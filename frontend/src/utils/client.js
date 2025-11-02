import axios from "axios";
import { generateSignature } from "./signature";



/**
 *
 *
 *
 *
 *  @return Axios
 *
 * */
export const client = () => {
  const http = axios.create({
    baseURL: '/api'
  })

  http.interceptors.request.use(config => {
    const { ts } = generateSignature()

    config.headers['ts'] = ts

    return {
      ...config,
    }
  })


  return http
};


export const apiClient = client()
