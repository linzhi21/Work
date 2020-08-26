// 路由守卫
import {refreshToken}  from '../lib/api/user'
export const beforeEach = ((to, from, next)=>{
  let access_token = localStorage.getItem('access_token');
   if(access_token || to.name === 'login' ) {
    next()
  }else{
    next({name:'login'})
  }
})
