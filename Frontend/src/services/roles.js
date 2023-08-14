import Ls from './ls'
import axios from 'axios'

export default {
  async login(loginData) {
    try {
      let response = await axios.post('https://afternoon-citadel-52453.herokuapp.com/login', {
        user: loginData.email,
        password: loginData.password,
      })
      //Ls.set('auth.roles', JSON.stringify(response.data.u[0].role.role_detail))
      return response.data.token
    } catch (error) {
      if (error.response.status === 401) {
        console.log(error)
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message)
      }
    }
  },

  async logout() {
    try {
      //await axios.get('/api/auth/logout')

      Ls.remove('auth.roles')
      //toastr['success']('Sesión finalizada', 'Éxito')
    } catch (error) {
      console.log('Error', error.message)
    }
  }
}
