<template>
    <div>
    
      <!-- Heading -->
      <datatable-heading
        :title="'Información de programación'"
        :dataSelect2="dataSelect"
      ></datatable-heading>
      <!-- Tabla general -->
      <b-row>
        <b-colxx xxs="12">
          <!-- Contenido -->
          <vuetable
            ref="vuetable"
            class="table-divided order-with-arrow table-responsive"
            :api-mode="false"
            :fields="fields"
            :data="arrayData"
          >
             <template slot="Fecha" slot-scope="props">
              {{
               customFormatter(props.rowData.fecha )
              }}
            </template>
             <template slot="Hora" slot-scope="props">
              {{
               (props.rowData.hora )
              }}
            </template>
        
          </vuetable>
        </b-colxx>
      </b-row>
      
    </div>
  </template>
  <script>
  import Vuetable from "vuetable-2/src/components/Vuetable";
  import { apiUrl } from "../../../../../constants/config";
  import DatatableHeading from "../../../../../components/programacion/viewHeadingProgramacion.vue";
  import vSelect from "vue-select";
  import "vue-select/dist/vue-select.css";
  import { validationMixin } from "vuelidate";
  const { required, minValue } = require("vuelidate/lib/validators");
  import Multiselect from "vue-multiselect";
  import VueBarcode from "vue-barcode";
  import MaskedInput from "vue-text-mask";
  import createNumberMask from "text-mask-addons/dist/createNumberMask";
  import moment from "moment";
  
  import axios from "axios";
  
  export default {
    props: ["title"],
    components: {
      // SweetModal,
      // SweetModalTab,
      vuetable: Vuetable,
      Multiselect,
      "datatable-heading": DatatableHeading,
      "v-select": vSelect,
      "masked-input": MaskedInput,
      barcode: VueBarcode,
    },
    data() {
      return {
        type: "",
        total:0,
        headers: { "x-token": this.$store.state.token,
                      'Content-Type': 'application/json', 
                      'Access-Control-Allow-Origin':'*'
          },
          httpOptions: {
            headers: { "x-token": this.$store.state.token}
          }, 
        api: apiUrl,
        tituloModal2:'',
        spinner : false,
        error : false,
        isLoad: false,
        /* Datos para modal */
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
        dataSelect: [],
        /* Table heading & pagination */
        show: true,
        /* Nombres de los datos de la tabla */
        arrayData: [],
        fields: [
          
          {
            name: "nombre_pelicula",
            sortField: "nombre_pelicula",
            title: "Película",
            titleClass: "",
            dataClass: "list-item-heading",
            width: "15%",
          },
          {
            name: "sala.nombre",
            sortField: "sala.nombre",
            title: "Sala",
            titleClass: "",
            dataClass: "list-item-heading",
            width: "15%",
          },
          {
            name: "__slot:Fecha",
            title: "Fecha",
            titleClass: "",
            dataClass: "list-item-heading",
            width: "20%",
          },
          {
            name: "__slot:Hora",
            title: "Hora",
            titleClass: "",
            dataClass: "list-item-heading",
            width: "20%",
          },
          
        ],
       
      };
    },
    computed: {
    },
    mounted() {
      this.infoProgramacion();
       this.$root.$on('bv::popover::show', () => {
        this.$root.$emit('bv::hide::popover')
      })
      document.addEventListener('click', e => {
        if (e.target.id.indexOf('pop') === -1) {
          this.$root.$emit('bv::hide::popover')
        }
      })
    },
    methods: {
      // MODALES
      async infoProgramacion() {
          const me = this;
          try {
              const response = await axios.get(apiUrl + "/api/programin/view_programacion?id=" + this.$route.params.id,{headers: this.headers});
              me.dataSelect = response.data.programacion;
              me.arrayData = response.data.programacion.detalle_salas;
          } catch (error) {
              console.log(error);
          }
      },
     
      // FUNCIONES AUXILIARES
     
      customFormatter(date) {
        return moment(date).format("YYYY-MM-DD");
      },
      customFormatterHora(date) {
        return moment(date).format("YYYY-MM-DD h:mm:ss");
      },
      customHora(date) {
        return moment(date).format("h:mm:ss");
      },
    },
  };
  </script>