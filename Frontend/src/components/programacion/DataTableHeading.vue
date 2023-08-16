<template>
    <b-row>
      <b-colxx xxs="12">
        <h1>{{ title }}</h1>
        <div class="top-right-button-container" >
          <!-- ACA EL BOTON DE NUEVO -->
          <router-link
            :to="{
              name: 'new_programacion',
            }"
          >
            <b-button
        
              variant="primary"
              size="lg"
              class="top-right-button"
              >{{ 'Nueva programación'}}</b-button
            >
          </router-link>
          <!-- <b-button
            v-if="validateArqueo == true"
            v-b-modal.modalSave
            variant="danger"
            size="sm"
            class="top-right-button"
            >{{'Cierre caja'}}</b-button
          > -->
         
        </div>
        <piaf-breadcrumb />
        <div class="mb-2 mt-2">
          <b-button
            variant="empty"
            class="pt-0 pl-0 d-inline-block d-md-none"
            v-b-toggle.displayOptions
          >
            {{ $t("pages.display-options") }}
            <i class="simple-icon-arrow-down align-middle" />
          </b-button>
          <b-collapse id="displayOptions" class="d-md-block">
            <div class="d-block d-md-inline-block pt-1" >
              <b-dropdown
                v-if="searchType"
                id="ddown1"
                :text="searchLabel.nombre"
                variant="outline-dark"
                class="mr-1 float-md-left btn-group"
                size="xs"
              >
                <b-dropdown-item
                  v-for="(search, index) in searchType"
                  :key="index"
                  @click="changeTypeSearch(search); activarBuscadorFechas(search, index); limpiarfiltro()"
                  >{{ search.nombre  }}</b-dropdown-item
                >
              </b-dropdown>
              <div v-if="bandera == false" class="search-sm d-inline-block float-md-left mr-1 align-top">
                <b-input
                  :placeholder="'Busqueda'"
                  @input="(val) => searchChange(val)"
                />
              </div>
             
            </div>
            <!-- <br>
            <br> -->
            <div class="container-fluid" v-if="bandera">
              <template >
                  <div class="form-group row">
                      <div class="col-md-6">
                          <div class="input-group">
                            <div class="col-md-6">
                              <div class="form-group">
                                  <label class="form-control-label">Fecha inicio intervalo</label>
                                  <datepicker :bootstrap-styling="true" @input="updateDisableDates()" placeholder="Seleccione fecha" :language="es" :format="customFormatter" v-model="fecha_inicio"></datepicker>
                              </div>
                            </div>
                            <div class="col-md-6">
                              <div class="form-group">
                                  <label class="form-control-label">Fecha fin intervalo</label>
                                  <datepicker :bootstrap-styling="true" @input="changeTypeDates(fecha_inicio, fecha_fin)"  ref="myDatepicker" placeholder="Seleccione fecha" :disabledDates="disabledDates" :language="es" :format="customFormatter" v-model="fecha_fin"></datepicker>
                              </div>
                            </div>
                          </div>
                      </div>
                  </div>
              </template>
            </div>
       
            <div class="float-md-right pt-1">
              <span class="text-muted text-small mr-1 mb-2"
                >{{ from }}-{{ to }} of {{ total }}</span
              >
              <b-dropdown
                id="ddown2"
                right
                :text="`${perPage}`"
                variant="outline-dark"
                class="d-inline-block"
                size="xs"
              >
                <b-dropdown-item
                  v-for="(size, index) in pageSizes"
                  :key="index"
                  @click="changePageSize(size)"
                  >{{ size }}</b-dropdown-item
                >
              </b-dropdown>
            </div>
          </b-collapse>
        </div>
        <div class="separator mb-5" />
      </b-colxx>
    </b-row>
  </template>
  <script>
  let user = parseInt(localStorage.getItem("rol"));
  import Datepicker from 'vuejs-datepicker';
  import moment from 'moment';
  import {en, es} from 'vuejs-datepicker/dist/locale';
  export default {
    props: [
      "changeTypeSearchEstado",
      "changeTypeSearch",
      "changeTypeDates",
      "ReportGenerate",
      "searchLabel",
      "searchLabelEstado",
      "searchType",
      "searchTypeEstado",
      "title",
      "selectAll",
      "isSelectedAll",
      "isAnyItemSelected",
      "keymap",
      "changePageSize",
      "searchChange",
      "from",
      "to",
      "total",
      "perPage",
      "componente",
      "validateArqueo"
    ],
    created() {
    },
    data() {
      return {
        es :es,
        bandera : false,
        fecha_inicio :'',
        fecha_fin:'',
        disabledDates: {
            to: '',
        },
        categories: [
          {
            label: "Cakes",
            value: "Cakes",
          },
          {
            label: "Cupcakes",
            value: "Cupcakes",
          },
          {
            label: "Desserts",
            value: "Desserts",
          },
        ],
        statuses: [
          {
            text: "Activo",
            value: true,
          },
          {
            text: "Inactivo",
            value: false,
          },
        ],
        sortOptions: [
          {
            column: "title",
            label: "Product Name",
          },
          {
            column: "category",
            label: "Category",
          },
          {
            column: "status",
            label: "Status",
          },
        ],
        pageSizes: [5, 8, 12],
      };
    },
    computed: {
      user() {
        return JSON.parse(user);
      },
    },
    components: {
        datepicker: Datepicker,
    },
    methods:{
      activarBuscadorFechas(search ,index){
        // console.log(index)
        this.bandera = (index ==1) ? true : false;
        // console.log(this.bandera)
      },
      updateDisableDates(){
        let me = this;
        if(new Date(me.customFormatter(me.fecha_inicio)).getTime() > new Date(me.customFormatter(me.fecha_fin))){
            me.$refs.myDatepicker.clearDate();
            me.fecha_fin = '';
        }
        me.disabledDates.to = new Date(me.fecha_inicio);
      },
      customFormatter(date) {
        return moment(date).format('YYYY-MM-DD');
      },
      limpiarfiltro(){
          let me = this;
          me.fecha_inicio = "";
          me.fecha_fin = "";
      },
    },
  };
  </script>
  