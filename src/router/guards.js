// 路由守卫
import Cookies from 'js-cookie';
import {refreshToken}  from '../lib/api/user'
export const beforeEach = ((to, from, next)=>{
  let access_token = localStorage.getItem('access_token');
  if(Cookies.get('iv-user')){
    if(to.name === 'login'){
      next({name:'loading'})
    }else{
      next()
    }
  }else {
    if(access_token || to.name === 'login') {
      next()
    }else{
      next({name:'login'})
    }
  }
}) 
