<template>
<b-row class="h-100">
    <b-colxx xxs="12" md="10" class="mx-auto my-auto">
        <b-card class="auth-card" no-body>
            <!-- <div class="position-relative image-side"> -->
                <!-- <p class="text-white h2">{{ $t('dashboards.magic-is-in-the-details') }}</p> -->
                <p class="white mb-0">
                    Please use your credentials to login.
                    <br />If you are not a member, please
                    <!-- <router-link to="/user/register" class="white">register</router-link>. -->
                </p>
            <!-- </div> -->
            <div class="form-side">
                <router-link to="/">
                    <span class="logo-single" />
                </router-link>
                <h6 class="mb-4">{{ $t('user.login-title')}}</h6>

                <b-form @submit.prevent="formSubmit" class="av-tooltip tooltip-label-bottom">
                    <b-form-group :label="'usuario'" class="has-float-label mb-4">
                        <b-form-input type="text" v-model="$v.form.email.$model" :state="!$v.form.email.$error" />
                        <b-form-invalid-feedback v-if="!$v.form.email.required">Ingresa tu usuario</b-form-invalid-feedback>
                        <b-form-invalid-feedback v-else-if="!$v.form.email.email">Please enter a valid email address</b-form-invalid-feedback>
                        <b-form-invalid-feedback v-else-if="!$v.form.email.minLength">Your email must be minimum 4 characters</b-form-invalid-feedback>
                    </b-form-group>

                    <b-form-group :label="$t('user.password')" class="has-float-label mb-4">
                        <b-form-input type="password" v-model="$v.form.password.$model" :state="!$v.form.password.$error" />
                        <b-form-invalid-feedback v-if="!$v.form.password.required">Ingresa tu contraseña</b-form-invalid-feedback>
                        <b-form-invalid-feedback v-else-if="!$v.form.password.minLength || !$v.form.password.maxLength">Your password must be between 4 and 16 characters</b-form-invalid-feedback>
                    </b-form-group>
                    <div class="d-flex justify-content-between align-items-center">
                        <router-link to="/user/forgot-password">{{ $t('user.forgot-password-question')}}</router-link>
                        <b-button type="submit" variant="primary" size="lg" :disabled="processing" :class="{'btn-multiple-state btn-shadow': true,
                    'show-spinner': processing,
                    'show-success': !processing && loginError===false,
                    'show-fail': !processing && loginError }">
                            <span class="spinner d-inline-block">
                                <span class="bounce1"></span>
                                <span class="bounce2"></span>
                                <span class="bounce3"></span>
                            </span>
                            <span class="icon success">
                                <i class="simple-icon-check"></i>
                            </span>
                            <span class="icon fail">
                                <i class="simple-icon-exclamation"></i>
                            </span>
                            <span class="label">{{ $t('user.login-button') }}</span>
                        </b-button>
                    </div>
                </b-form>
            </div>
        </b-card>
    </b-colxx>
</b-row>
</template>

<script>

import { mapGetters, mapActions } from "vuex";
import { validationMixin } from "vuelidate";
import { adminRoot, currentUser, apiUrl } from "../../constants/config";
import axios from "axios";
import Roles from "../../services/roles";
import Auth from "../../services/auth";
import { getCurrentUser } from "../../utils";

const {
  required,
  maxLength,
  minLength,
  email,
} = require("vuelidate/lib/validators");

export default {
  data() {
    return {
      form: {
        email: "",
        password: "",
      },
    };
  },
  mixins: [validationMixin],
  validations: {
    form: {
      password: {
        required,
        minLength: minLength(4),
      },
      email: {
        required,
      },
    },
  },
  computed: {
    ...mapGetters(["currentUser", "processing", "loginError"]),
  },
  mounted() {
    // console.log('hola')
    //   console.log(this.$store.state.token)
    if (this.$store.state.token !== "") {
      // console.log(this.$store.state.token );
      axios({
        baseURL: apiUrl + "/api/auth/checkToken",
        method: "POST",
        headers: { "x-token": this.$store.state.token },
      })
        .then((res) => {

          if (res.data.success) {
            this.$store.commit("setToken", res.data.token);
            this.$store.commit("setUsuario", res.data.usuario.id);
            this.currentUser.title = res.data.usuario.usuario;
            this.currentUser.id = res.data.usuario.id;
            // console.log(this.currentUser.id);
            this.$router.push(adminRoot);
          } else {
            this.$store.commit("setToken", res.data.token);
          }
          // this.$vs.loading.close();
        })
        .catch(() => {
          // this.loading = false;
          // this.$vs.loading.close();
          this.$store.commit("clearToken");
        });
    } else {
      //   this.loading = false;
    }
  },
  methods: {
    ...mapActions(["login"]),
    onValidate() {
      this.$v.$touch();
      if (this.form.email != "" && this.form.password != "") {
        this.formSubmit();
      }
    },
    formSubmit() {
      axios
        .post(apiUrl + "/api/auth/login", {
          user: this.form.email,
          password: this.form.password,
        })
        .then((res) => {
          if (res.data.success) {
            // console.log(res.data);
            this.$store.commit("saveRol", res.data.usuario.roleId);
            this.$store.commit("setToken", res.data.token);
            this.currentUser.title = res.data.usuario.usuario;
            // this.currentUser.img = res.data.usuario.img;
            this.currentUser.id = res.data.usuario.id;
            this.$router.push(adminRoot);
          
            window.location.reload();
          }
        })
        .catch(({ response }) => {
          if (response.status === 401) {
            this.$notify(
              "error",
              "Error de inicio de sesión",
              "Usuario o contraseña incorrectos",
              {
                duration: 3000,
                permanent: false,
              }
            );
          }
          if (response.status === 400) {
            this.$notify(
              "error",
              "Error de inicio de sesión",
              `${response.data.errors[0].msg}`,
              {
                duration: 3000,
                permanent: false,
              }
            );
          }
        });
    },
  },
  watch: {
    currentUser(val) {
      if (val && val.uid && val.uid.length > 0) {
        this.$router.push(adminRoot);
      }
    },
    loginError(val) {
      if (val != null) {
        this.$notify(
          "error",
          "Error de inicio de sesión",
          "Usuario o contraseña incorrectos",
          {
            duration: 3000,
            permanent: false,
          }
        );
      }
    },
  },
};
</script>
