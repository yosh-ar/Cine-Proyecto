<template>
    <div>
           <!-- Modal desactivar -->
    <b-modal id="modal-des" title="Desactivar">
      <p class="my-4">¿Desea desactivar al usuario: {{ form.usuario }} ?</p>
      <template #modal-footer="{}">
        <b-button
          size="sm"
          variant="success"
          @click="
            onState();
            $bvModal.hide('modal-des');
          "
        >
          Desactivar
        </b-button>
        <b-button
          size="sm"
          variant="danger"
          @click="$bvModal.hide('modal-des')"
        >
          Cancelar
        </b-button>
      </template>
    </b-modal>
    <!-- Modal activar -->
    <b-modal id="modal-react" title="Activar">
      <p class="my-4">¿Desea activar al usuario: {{ form.usuario }} ?</p>
      <template #modal-footer="{}">
        <b-button
          size="sm"
          variant="success"
          @click="
            onState();
            $bvModal.hide('modal-react');
          "
        >
          Activar
        </b-button>
        <b-button
          size="sm"
          variant="danger"
          @click="$bvModal.hide('modal-react')"
        >
          Cancelar
        </b-button>
      </template>
    </b-modal>
      <!-- MODAL PARA REGISTRAR -->
    <b-modal
    no-close-on-backdrop
    @show="openModal('save')"
    @hidden="openModal('save')"
    id="modalSave"
    ref="modalSave"
    title="Registro de usuario"
    >
    <b-form>
        <b-form-group label="Usuario empleado:" >
            <b-form-input
        
            :class="{ 'form-group--error': $v.form.usuario.$error }"
            @input="$v.form.usuario.$touch()"
            v-model.trim="$v.form.usuario.$model"
            :state="!$v.form.usuario.$error"
          ></b-form-input>
          <b-form-invalid-feedback
            >Debe ingresar el usuario del empleado</b-form-invalid-feedback
          >
        </b-form-group>
        <b-form-group label="Contraseña empleado:" >
            <b-form-input
            type= "password"
            :class="{ 'form-group--error': $v.form.password.$error }"
            @input="$v.form.password.$touch()"
            v-model.trim="$v.form.password.$model"
            :state="!$v.form.password.$error"
          ></b-form-input>
          <b-form-invalid-feedback
            >Debe ingresar la contraseña del empleado</b-form-invalid-feedback
          >
        </b-form-group>
        
        <b-form-group :label="'Empleado:'">
          <v-select
            v-model.trim="$v.form.empleado.$model"
            :state="!$v.form.empleado.$error"
            :options="dataSelect"
            label="nombre"
          />
          <div
            :class="{
              'invalid-feedback': true,
              'd-block':
                $v.form.empleado.$error && !$v.form.empleado.required,
            }"
          >
            Debe seleccionar un empleado
          </div>
        </b-form-group>
        <b-form-group :label="'Roles:'">
          <v-select
            v-model.trim="$v.form.role.$model"
            :state="!$v.form.role.$error"
            :options="dataSelect1"
            label="rol"
          />
          <div
            :class="{
              'invalid-feedback': true,
              'd-block':
                $v.form.role.$error && !$v.form.role.required,
            }"
          >
            Debe seleccionar un rol
          </div>
        </b-form-group>
    </b-form>
    <template #modal-footer="{}">
        <b-button type="submit" variant="primary" @click="onValidate('save')"
        >Guardar</b-button
        >
        <b-button variant="danger" @click="closeModal('save')"
        >Cancelar</b-button
        >
    </template>
    </b-modal>
      <!-- MODAL PARA ACTUALIZAR -->
    <b-modal
      no-close-on-backdrop
      ref="modaled"
      id="modal-edit"
      scrollable
      title="Editar Usuario"
    >
         <b-form-group label="Usuario empleado:" >
            <b-form-input
        
            :class="{ 'form-group--error': $v.form.usuario.$error }"
            @input="$v.form.usuario.$touch()"
            v-model.trim="$v.form.usuario.$model"
            :state="!$v.form.usuario.$error"
          ></b-form-input>
          <b-form-invalid-feedback
            >Debe ingresar el usuario del empleado</b-form-invalid-feedback
          >
        </b-form-group>
        <b-form-group label="Contraseña empleado:" >
            <b-form-input
              type= "password"
            :class="{ 'form-group--error': $v.form.password.$error }"
            @input="$v.form.password.$touch()"
            v-model.trim="$v.form.password.$model"
            :state="!$v.form.password.$error"
          ></b-form-input>
          <b-form-invalid-feedback
            >Debe ingresar la contraseña del empleado</b-form-invalid-feedback
          >
        </b-form-group>
             <b-form-group :label="'Empleado:'">
          <v-select
            v-model.trim="$v.form.empleado.$model"
            :state="!$v.form.empleado.$error"
            :options="dataSelect"
            label="nombre"
          />
          <div
            :class="{
              'invalid-feedback': true,
              'd-block':
                $v.form.empleado.$error && !$v.form.empleado.required,
            }"
          >
            Debe seleccionar un empleado
          </div>
        </b-form-group>
        <b-form-group :label="'Roles:'">
          <v-select
            v-model.trim="$v.form.role.$model"
            :state="!$v.form.role.$error"
            :options="dataSelect1"
            label="rol"
          />
          <div
            :class="{
              'invalid-feedback': true,
              'd-block':
                $v.form.role.$error && !$v.form.role.required,
            }"
          >
            Debe seleccionar un rol
          </div>
        </b-form-group>
    
      <template #modal-footer="{}">
        <b-button type="submit" variant="primary" @click="onValidate('update')"
          >Actualizar</b-button
        >
        <b-button @click="$bvModal.hide('modal-edit')" variant="danger"
          >Cancelar</b-button
        >
      </template>
    </b-modal>
      <!-- CABECERA DE LA TABLA -->
      <datatable-heading
        :title="'Usuarios'"
        :changeTypeSearch="changeTypeSearch"
        :searchType="searchType"
        :searchLabel="searchLabel"
        :changePageSize="changePageSize"
        :searchChange="searchChange"
        :from="from"
        :to="to"
        :total="total"
        :perPage="perPage"
      ></datatable-heading>
          <!-- Tabla general -->  
      <b-row>
        <b-colxx xxs="12">
          <!-- Contenido -->

          <vuetable
            responsive
            ref="vuetable"
            class="table-divided order-with-arrow table-responsive"
            :api-url="apiBase"
            :query-params="makeQueryParams"
            :per-page="perPage"
            :http-options="httpOptions"
            :reactive-api-url="true"
            :fields="fields"
            pagination-path
            @vuetable:pagination-data="onPaginationData"
          >
            <!-- Span para estado (por el momento es category debido a la API) -->
            <template slot="estado" slot-scope="props">
              <h5 v-if="props.rowData.estado_user == true">
                <b-badge variant="success">ACTIVO</b-badge>
              </h5>
              <h5 v-else>
                <b-badge variant="danger">INACTIVO</b-badge>
              </h5>
            </template>

            <!-- Botones -->
            <template slot="actions" slot-scope="props">
              <b-button-group>
                <router-link
                    :to="{
                      name: 'view_user',
                      params: { id: props.rowData.id },
                    }"
                  >
                    <b-button
                      squared
                      class="mb-2"
                      size="sm"
                      variant="outline-success"
                    >
                      <i :class="'simple-icon-eye'" />
                    </b-button>
                  </router-link>
                <b-button v-if="props.rowData.estado_user == true"
                  @click="setData(props.rowData)"
                  v-b-modal.modal-edit
                  class="mb-2"
                  size="sm"
                  variant="outline-warning"
                  ><i :class="'simple-icon-pencil'"
                /></b-button>
                <b-button
                  @click="
                    setData(props.rowData);
                    props.rowData.estado_user == true
                      ? $bvModal.show('modal-des')
                      : $bvModal.show('modal-react');
                  "
                  class="mb-2"
                  size="sm"
                  :variant="
                    props.rowData.estado_user == true
                      ? 'outline-danger'
                      : 'outline-info'
                  "
                >
                  <i
                    :class="
                      props.rowData.estado_user == true
                        ? 'simple-icon-trash'
                        : 'simple-icon-check'
                    "
                /></b-button>
              </b-button-group>
            </template>
          </vuetable>
          <!-- Paginacion -->
          <vuetable-pagination-bootstrap
            class="mt-4"
            ref="pagination"
            @vuetable-pagination:change-page="onChangePage"
          />
        </b-colxx>
      </b-row>
    </div>
</template>
<script>
import Vuetable from "vuetable-2/src/components/Vuetable";
import VuetablePaginationBootstrap from "../../../../components/Common/VuetablePaginationBootstrap";
import { apiUrl } from "../../../../constants/config";
import {helpers} from '../../../../helpers/helpers-validate';
import MaskedInput from 'vue-text-mask'
import "vue-select/dist/vue-select.css";
import DatatableHeading from "../../../../containers/datatable/DatatableHeading";
import axios from "axios";
import { validationMixin } from "vuelidate";
import vSelect from "vue-select";
const { required, numeric } = require("vuelidate/lib/validators");


let nit = (value) => helpers.nitIsValid(value)
let correo = (value) => helpers.correo(value)

export default {
  props: ["title"],
  components: {
    vuetable: Vuetable,
    "vuetable-pagination-bootstrap": VuetablePaginationBootstrap,
    "datatable-heading": DatatableHeading,
    'masked-input': MaskedInput,
     "v-select": vSelect,
  },
  data() {
    return {
        searchType: [
            { nombre: "Nombre", value: "nombre_persona" },
            { nombre: "Apellido", value: "apellido_persona" },
        ],
        httpOptions: {
          headers: { "x-token": this.$store.state.token}
        },
        dataSelect: [],   
        dataSelect1: [],   
        searchLabel: { nombre: "Nombre", value: "nombre_persona" },          
        repit : true,
        isLoad: false,
        apiBase: apiUrl + "/api/users/get",
        page: 1,
        perPage: 5,
        form: {
            usuario: "",
            password: "",
            empleado: {},
            role: "",
            state: true,
            id: 0,
        },
        show: true,
        search: "",
        from: 0,
        to: 0,
        total: 0,
        lastPage: 0,
        items: [],
        selectedItems: [],
        statuses: [
            {
            text: "ACTIVO",
            value: true,
            },
            {
            text: "INACTIVO",
            value: false,
            },
        ],
        /* Nombres de los datos de la tabla */
        fields: [
            {
            name: "__slot:actions",
            title: "Acciones",
            titleClass: "",
            dataClass: "text-muted",
            width: "15%",
            },
            {
            name: "usuario",
            sortField: "usuario",
            title: "Usuario",
            titleClass: "",
            dataClass: "list-item-heading",
            width: "20%",
            },
            {
            name: "empleado.persona.nombre_persona",
            sortField: "empleado.persona.nombre_persona",
            title: "Nombre",
            titleClass: "",
            dataClass: "list-item-heading",
            width: "20%",
            },
            {
            name: "empleado.persona.apellido_persona",
            sortField: "empleado.persona.apellido_persona",
            title: "Apellido",
            titleClass: "",
            dataClass: "list-item-heading",
            width: "20%",
            },
            {
            name: "role.rol",
            sortField: "role.rol",
            title: "Rol",
            titleClass: "",
            dataClass: "list-item-heading",
            width: "20%",
            },
          
            {
            name: "__slot:estado",
            title: "Estado",
            titleClass: "",
            dataClass: "text-muted",
            width: "25%",
            },
        ],
    };
  },
  mixins: [validationMixin],
  validations: {
    form: {
      usuario: {
        required,
      },
      password: {
        required,
      },
      role: {
        required,
      },
      empleado: {
          required,
      }
    },
  },
  methods: {
    // SELECT Empleado
    async selectEmpleado() {
      let me = this;
      this.dataSelect = [];
      const response = await axios.get(apiUrl + "/api/users/empleados",{headers: { "x-token": this.$store.state.token}});
      me.dataSelect = response.data.data;
    //   console.log(response)
    },
    // SELECT Role
    async selectRol() {
      let me = this;
      this.dataSelect1 = [];
      const response = await axios.get(apiUrl + "/api/users/rol",{headers: { "x-token": this.$store.state.token}});
      me.dataSelect1 = response.data.data;

    },
    openModal(model) {
      switch (model) {
        case "save": {
          this.$v.$reset();
          this.selectEmpleado();
          this.selectRol();
          this.form.id= 0;
          this.form.usuario = "";
          this.form.password = "";
          this.form.empleado = {};
          this.form.role = "";
          this.form.state = true;
          break;
        }
      }
    },
    closeModal(model) {
      switch (model) {
        case "save": {
          this.$v.$reset();
          this.$refs["modalSave"].hide();
          this.form.id= 0;
          this.form.usuario = "";
          this.form.password = "";
          this.form.empleado = {};
          this.form.role = "";
          this.form.state = true;
          break;
        }
      }
    },
    onValidate(action) {
      this.$v.$touch();
      const {usuario, password, empleado, role } = this.form;
   
      if (usuario !='' && password !='' && empleado !='' && role != '' )  {
     
        if (action == "save") {
            this.onSave();
        }
        if (action == "update") {
            this.onUpdate();
        }
      }
    },
      /* Guardar */
    onSave() {
      const me = this;
      this.$refs["modalSave"].hide();
        const {usuario, password, empleado, role } = this.form;
        // console.log(TiendaId)
        // return 
      axios
        .post(apiUrl + "/api/users/store", {
            usuario, password, empleado: empleado.id, rol: role.id
        },{headers: { "x-token": this.$store.state.token}})
        .then((response) => {
          me.$notify(
            "primary filled",
            "Guardado",
            "Usuario " + usuario + " se guardo con éxito",
            { duration: 3000, permanent: false }
          );
          me.$refs.vuetable.refresh();
          me.closeModal('save');
        })
        .catch((error) => {
          this.errorMessage = error.message;
          console.error("Error!", error);
        });
    },
      /* Actualizar */
    onUpdate() {
      const me = this;
      this.$refs.modaled.hide();
      const {usuario, password, empleado, role, id } = this.form;
      // console.log(empleado);
      axios
        .put(apiUrl + "/api/users/update", {
              usuario, password, empleado: empleado.id, rol: role.id, id
        },{headers: { "x-token": this.$store.state.token}})
        .then((response) => {
          me.$notify(
            "secondary filled",
            "Actualizado",
            "Usuario " + usuario + " se actualizo con éxito",
            { duration: 3000, permanent: false }
          );
          me.$refs.vuetable.refresh();
          me.closeModal('save');
        })
        .catch((error) => {
          this.errorMessage = error.message;
          console.error("Error!", error);
        });
    },
    onState() {
      //desactivar tipo
      const me = this;
      if (this.form.state == true) {
        axios
          .put(apiUrl + "/api/users/desactivate", {
            id: this.form.id,
          },{headers: { "x-token": this.$store.state.token}})
          .then((response) => {
            me.$notify(
              "warning",
              "Desactivado",
              "Usuario " + this.form.usuario + " desactivada",
              { duration: 3000, permanent: false }
            );
            me.$refs.vuetable.refresh();
          })
          .catch((error) => {
            this.errorMessage = error.message;
            console.error("There was an error!", error);
          });
      } else {
        axios
          .put(apiUrl + "/api/users/activate", {
            id: this.form.id,
          },{headers: { "x-token": this.$store.state.token}})
          .then((response) => {
            me.$notify(
              "success",
              "Activado",
              "Usuario " + this.form.usuario + " activada",
              { duration: 3000, permanent: false }
            );
            me.$refs.vuetable.refresh();
          })
          .catch((error) => {
            this.errorMessage = error.message;
            console.error("There was an error!", error);
          });
      }
    },
    setData(data) {
      this.selectEmpleado();
      this.selectRol();
    //   this.form.nombre = data.persona.nombre_persona;
      this.form.state = data.estado_user;
      this.form.empleado.nombre = data.empleado.persona.nombre_persona + ' ' +data.empleado.persona.apellido_persona; 
      this.form.empleado.id = data.empleado.id; 
      this.form.role = data.role;
      this.form.usuario = data.usuario;
      this.form.state = data.estado_user;
      this.form.id = data.id;
    },

    // DATOS PARA PAGINACION

   changeTypeSearch(type) {
      this.searchLabel = type;
      this.$refs.vuetable.refresh();
    },
    // Para buscar
    searchChange(val) {
      this.search = val.toLowerCase();
      this.$refs.vuetable.refresh();
    },
    makeQueryParams(sortOrder, currentPage, perPage) {
      this.selectedItems = [];
      return sortOrder[0]
        ? {
            criterio: this.searchLabel.value,
            page: currentPage,
            limite: this.perPage,
            search: this.search,
          }
        : {
            criterio: this.searchLabel.value,
            page: currentPage,
            limite: this.perPage,
            search: this.search,
          };
    },
    onPaginationData(paginationData) {
      this.from = paginationData.from;
      this.to = paginationData.to;
      this.total = paginationData.total;
      this.lastPage = paginationData.last_page;
      this.items = paginationData.data;
      this.$refs.pagination.setPaginationData(paginationData);
    },
    onChangePage(page) {
      this.$refs.vuetable.changePage(page);
    },

    changePageSize(perPage) {
      this.perPage = perPage;
      this.$refs.vuetable.refresh();
    },

  }
}

</script>
