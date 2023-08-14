import Vue from 'vue'
import Vuex from 'vuex'

import app from '../main'
import menu from './modules/menu'
import user from './modules/user'
import chat from './modules/chat'
import todo from './modules/todo'
import survey from './modules/survey'
import { setCurrentLanguage } from '../utils'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: localStorage.getItem('auth.token') || '',
    usuario: localStorage.getItem('usuario') || ''
  },
  mutations: {
    changeLang (state, payload) {
      app.$i18n.locale = payload
      setCurrentLanguage(payload);
    },
    setToken(state, token){
      localStorage.setItem('auth.token', token);
      state.token = token;
    },
    setUsuario(state, usuario){
      localStorage.setItem('usuario', usuario);
      state.usuario = usuario;
    },

    saveRol(state, rol){
      localStorage.setItem('rol', rol);
      state.rol = rol;
    },
    clearToken(state){
      localStorage.removeItem('auth.token');
      localStorage.removeItem('rol');
      localStorage.removeItem('usuario');
      state.token = '';
    },

  },
  actions: {
    setLang ({ commit }, payload) {
      commit('changeLang', payload)
    }
  },
  modules: {
    menu,
    user,
    chat,
    todo,
    survey
  }
})