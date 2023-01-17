// 路由守卫
import Cookies from 'js-cookie';
import {refreshToken}  from '../lib/api/user'
export const beforeEach = ((to, from, next)=>{
  let access_token = localStorage.getItem('access_token');
  if(to.name === 'login' && Cookies.get('iv-user')){
    next({name:'home'})
  }else if(access_token || to.name === 'login') {
    next()
  }else{
    next({name:'login'})
  }
}) 
