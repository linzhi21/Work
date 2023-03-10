import axios from 'axios';
import buildURL from 'axios/lib/helpers/buildURL'
import { Notification, Message} from 'element-ui';
import {refreshToken}  from './api/user'
import route from '../router/index'
import Cookies from "js-cookie";
import {hmacMD5} from "../utils/index"
import dev from "../../environment.dev";
import prod from "../../environment.prod";

const urls = process.env.NODE_ENV === 'development' ? dev : prod;
const systemUrls = [urls.oauth2, urls.system, urls.device, urls.spare, urls.business, urls.approval, urls.accessory, urls.database, urls.expert, urls.log, urls.systemUrl]

//默认实例的拦截器
axios.interceptors.request.use(
  config => {
    addTokenToHead(config)
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
      addTokenToHead(config)
      return config;
    },
    error => {
        console.log(error)
        // do something with request error
        return Promise.reject(error)
    }
);


function addTokenToHead(config){
  let uri = config.url
  let qs = '';
  let method = config.method.toUpperCase();
  for (let systemUrl of systemUrls) {
    if(uri.startsWith(systemUrl)){
      uri = uri.substring(systemUrl.length);
      break;
    }
  }
  uri = uri.startsWith('/') ? uri : '/'+uri;
  uri = uri.indexOf('?') >=0 ? uri.substring(0,uri.indexOf('?')) : uri;

  if(method === 'GET' && config.params){
    qs = buildURL("",config.params)
    if(qs && qs.startsWith('?')){
      qs = qs.substring(1);
    }
  } else if(config.data){
    qs = typeof config.data == 'string' ? config.data : JSON.stringify(config.data);
  } else if(config.url.indexOf('?') >= 0){
    qs = config.url.substring(config.url.indexOf('?')+1);
  }
  qs = qs ? qs : '';
  let r = Date.now()+''+Math.random();
  let paramTokenKey = hmacMD5(r);
  let paramTokenValue = hmacMD5(paramTokenKey+':'+method+':'+uri+':'+qs);
  config.headers['paramTokenKey'] = paramTokenKey;
  config.headers['paramTokenValue'] = paramTokenValue;
}

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
