import axios from 'axios';
import { Notification, Message} from 'element-ui';
import {refreshToken}  from './api/user'
import route from '../router/index'
import Cookies from "js-cookie";
import {hmacMD5} from "../utils/index"

//默认实例的拦截器
axios.interceptors.request.use(
  config => {
    let r = Date.now()+''+Math.random();
    let paramTokenKey = hmacMD5(r);
    let paramTokenValue = hmacMD5(paramTokenKey);
    config.headers['paramTokenKey'] = paramTokenKey;
    config.headers['paramTokenValue'] = paramTokenValue;
    return config;
  },
  error => {
    return Promise.reject(error)
  }
);

const service = axios.create({
    // withCredentials: true, // send cookies when cross-domain requests
    timeout: 200000 // request timeout
});
import store from '../store/index.js'
// request interceptor
service.interceptors.request.use(

    config => {
        if(Cookies.get('iv-user')){
            config.headers['iv-user'] = Cookies.get('iv-user');
        }
        const access_token = localStorage.getItem('access_token');
        config.headers.Authorization = 'Bearer ' + access_token;
        const newurl =config.url.substring(config.url.length-9);
        if (newurl == "importURL") {
            config.headers['Content-Type'] = 'multipart/form-data; boundary=<calculated when request is sent>';
        } else {
            config.headers['Content-Type'] = 'application/json';
        }
        let r = Date.now()+''+Math.random();
        let paramTokenKey = hmacMD5(r);
        let paramTokenValue = hmacMD5(paramTokenKey);
        config.headers['paramTokenKey'] = paramTokenKey;
        config.headers['paramTokenValue'] = paramTokenValue;
        return config;
    },
    error => {
        console.log(error)
        // do something with request error
        return Promise.reject(error)
    }
);

// response interceptor
service.interceptors.response.use(
    /**
     * If you want to get http information such as headers or status
     * Please return  response => response
    */

    /**
     * Determine the request status by custom code
     * Here is just an example
     * You can also judge the status by HTTP Status Code
     */
    response => {
        const res = response.data
        return res;
    },
    error => {
        window.error = error
        if(error.response){
          const responseData = error.response.data;
          if (error.response.status === 400) {
              Notification({
                  title: '错误',
                  message: responseData.error,
                  type: 'error'
              })
          }
          if (error.response.status === 401) {
              if(error.response.data.error == "对不起，您没有权限访问此资源！") {
                Notification({
                    title: '权限',
                    message: error.response.data.error,
                    type: 'warning'
                })
                return
              }
              console.log(error.response)
              Notification({
                  title: '',
                  message: "token过期，请重新登录",
                  type: 'warning'
              })
              route.push('/login')
            //   refreshToken()
          }else{
            Notification({
                title: responseData.error,
                message: responseData.message,
                type: 'warning'
            })

            store.commit('SET_UPLOADING',false)
          }

          return Promise.reject(responseData.error, error);
        }
    }
);

// 封装一个不带token的请求
{
    var serviceWithoutToken = axios.create({
        timeout: 200000
    });

    serviceWithoutToken.interceptors.request.use(
        config => {
            config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
            return config;
        },
        error => {
            return Promise.reject(error)
        }
    );
    serviceWithoutToken.interceptors.response.use(
        response => {
            const res = response.data
            return res;
        },
        error => {
            const responseData = error.response.data;
            if (error.response.status === 400) {
            }
            if (error.response.status === 401) {
            }
            return Promise.reject(responseData.error, error);
        }
    );
}

function request({ method, url, params, data = {}, restful }, myService = service) {
    const restfulUrl = restful ? `${url}/${restful}` : url;

    if (method === 'GET') {
        return myService({
            method,
            url: restfulUrl,
            params
        });
    } else {
        return myService({
            method,
            url: restfulUrl,
            data: data
        });
    };
};



export const GET = (params, url, restful) => request({ method: 'GET', url, params, restful });

export const POST = (data, url, restful) => request({ method: 'POST', url, data, restful });

export const PUT = (data, url, restful) => request({ method: 'PUT', url, data, restful });

export const PATCH = (data, url, restful) => request({ method: 'PATCH', url, data, restful });

export const DELETE = (data, url, restful) => request({ method: 'DELETE', url, data, restful });

export default service;

// 导出不带token的请求
const GET_WITHOUTTOKEN = (params, url, restful) => request({ method: 'GET', url, params, restful }, serviceWithoutToken);
const POST_WITHOUTTOKEN = (data, url, restful) => request({ method: 'POST', url, data, restful }, serviceWithoutToken);
export {
    GET_WITHOUTTOKEN,
    POST_WITHOUTTOKEN,
};
