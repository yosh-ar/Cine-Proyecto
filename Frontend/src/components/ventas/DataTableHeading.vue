<template>
    <b-row>
      <b-colxx xxs="12">
        <h1>{{ title }}</h1>
       
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
      
             
            </div>
          
            <!-- <br>
            <br> -->
            <div class="container-fluid" >
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
            <div class="container-fluid">
              <template >
                <b-button
                  @click="ReportGenerate()"
                    variant="primary"
                    size="lg"
                    >Generar reporte</b-button
                  >
              </template>
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
        this.bandera = (index == 3) ? true : false;
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
  