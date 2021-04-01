// export default (context) => {
//   if (!context.app.context.app.$cookies.get('token')) {
//       return context.redirect('/login')
//   }
// }
import API from '~/api/index';
import axios from 'axios';

export default ({ app }) => {
  const token = app.$cookies.get('token')
  if(!token){
    return app.context.redirect('/login')
  }else{
    return axios.post(API.testToken, {token})
    .then(res => {
      if(!res.data.isSuccess){
        return app.context.redirect('/login')
      }
    })
    .catch(err => {
      console.log(err);
      app.context.redirect('/login');
    })
  }
}
