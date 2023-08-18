<template>
    <div>
           <!-- Modal desactivar -->
    <b-modal id="modal-des" title="Desactivar">
      <p class="my-4">¿Desea desactivar la venta ?</p>
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


      <!-- CABECERA DE LA TABLA -->
      <datatable-heading
        :title="'Programacion'"
        :validateArqueo="validateArqueo"
        :changeTypeSearch="changeTypeSearch"
        :changeTypeSearchEstado="changeTypeSearchEstado"
        :changeTypeDates ="changeTypeDates"
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
            :reactive-api-url="true"
            :fields="fields"
            :http-options="httpOptions"
            pagination-path
            @vuetable:pagination-data="onPaginationData"
          >
            <!-- Span para estado (por el momento es category debido a la API) -->
            <template slot="estado" slot-scope="props">
              <h5 v-if="props.rowData.estado == true">
                <b-badge variant="success">ACTIVO</b-badge>
              </h5>
              <h5 v-else>
                <b-badge variant="danger">INACTIVO</b-badge>
              </h5>
            </template>
          
        
            <template slot="empleado" slot-scope="props">
                {{`${props.rowData.user.usuario}`}}
            </template>
      
            <template slot="fecha" slot-scope="props">
                {{`${formatoPresentacion(props.rowData.fecha)}`}}
            </template>
            <!-- Botones -->
            <template slot="actions" slot-scope="props">
              <b-button-group>
                  <router-link
                    :to="{
                      name: 'view_programacion',
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
                
                <b-button
                  v-if=" props.rowData.estado == true"
                  @click="
                    setData(props.rowData);
                    props.rowData.estado == true
                      ? $bvModal.show('modal-des')
                      : $bvModal.show('modal-des');
                  "
                  class="mb-2"
                  size="sm"
                  :variant="
                    props.rowData.estado == true
                      ? 'outline-danger'
                      : 'outline-danger'
                  "
                >
                  <i
                    :class="
                      props.rowData.estado == true
                        ? 'simple-icon-trash'
                        : 'simple-icon-trash'
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
import VuetablePaginationBootstrap from "../../../../../components/Common/VuetablePaginationBootstrap";
import { apiUrl } from "../../../../../constants/config";

import createNumberMask from "text-mask-addons/dist/createNumberMask";
import MaskedInput from "vue-text-mask";
import moment from 'moment';
import {en, es} from 'vuejs-datepicker/dist/locale';
import DatatableHeading from "../../../../../components/programacion/DataTableHeading";
import axios from "axios";
import { mapGetters } from "vuex";
import { validationMixin } from "vuelidate";
const { required } = require("vuelidate/lib/validators");

import JsPDF from 'jspdf'
const options = {
  name: "_blank",
  specs: ["fullscreen=yes", "titlebar=no", "scrollbars=no"],
  styles: ["/hola.css"]
};
export default {
  props: ["title"],
  components: {
    MaskedInput,
    vuetable: Vuetable,
    "vuetable-pagination-bootstrap": VuetablePaginationBootstrap,
    "datatable-heading": DatatableHeading,
  },
  data() {
    return {
      arrayDetalles:[],
        headers: { "x-token": this.$store.state.token,
                    'Content-Type': 'application/json', 
                    'Access-Control-Allow-Origin':'*'
        },
        httpOptions: {
          headers: { "x-token": this.$store.state.token}
        }, 
        validateArqueo: true,
        es: es,
        fecha_inicio: '',
        fecha_fin :'',
        searchType: [
            { nombre: "Empleado", value: "usuario" },
            { nombre: "Fecha", value: "fecha" },
        ],
        dataSelect: [],   
        searchLabel: { nombre: "Empleado", value: "usuario" },            
        repit : true,
        isLoad: false,
        apiBase: apiUrl + "/api/programin/get",
        page: 1,
        perPage: 5,
        form: {
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
            dataClass: "list-item-heading",
            width: "10%",
            },
            {
            name: "__slot:empleado",
            title: "Empleado",
            titleClass: "",
            dataClass: "list-item-heading",
            width: "10%",
            },
          
           {
            name: "__slot:fecha",
            title: "Fecha",
            titleClass: "",
            dataClass: "list-item-heading",
            width: "20%",
            },
        
            {
            name: "__slot:estado",
            title: "Estado",
            titleClass: "",
            dataClass: "text-muted",
            width: "10%",
            },
        ],
    };
  },
  mixins: [validationMixin],
  validations:{
        form1:{
          cierre_caja : {
            required
          }
        },
        egreso:{
          required
        },
        razon : {
          required
        }
  },
  async mounted() {
  },
  computed: {
     ...mapGetters({
      currentUser: "currentUser",
    }),
  },
  methods: {
    showDate(date) {
        return moment(date)
          .locale("es")
          .utc()
          .format("MMMM DD [de] YYYY");
      },
        // FUNCIONES FECHAS 
    customFormatter(date) {
      return moment(date).format('YYYY-MM-DD');
    },
 
  

    onState() {
      //desactivar tipo
      const me = this;
        axios
          .put(apiUrl + "/api/programin/desactivate", {
            id: this.id_venta,
          },{headers: this.headers})
          .then((response) => {
            me.$notify(
              "warning",
              "Desactivado",
              "La programación a sido desactivada con éxito",
              { duration: 3000, permanent: false }
            );
            me.$refs.vuetable.refresh();
          })
          .catch((error) => {
            this.errorMessage = error.message;
            console.error("There was an error!", error);
          });
      
    },

    setData(data) {
      this.id_venta = data.id;
    },


    // FUNCIONES DE AYUDA
    formatQuetzales (amount) {
        let num = parseFloat(amount), formatted
        formatted =  num.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
        return amount = 'Q ' + formatted
    },
    converMaskToNumberxd (number) {
        let myNumber = ''
        for (let i = 0; i < number.length; i += 1) {
        if (number.charAt(i) === 'Q' || number.charAt(i) === ',' || number.charAt(i) === ' ') {
            continue
        } else {
            myNumber += number.charAt(i)
        }
        }
        return parseFloat(myNumber).toFixed(2)
    },
    customFormatter(date) {
        return moment(date).format('YYYY-MM-DD');
    },
    formatoPresentacion(date){
        return moment(date).locale('es').format('LL'); 
    },
    // DATOS PARA PAGINACION

    changeTypeSearch(type) {
      console.log(type)
      this.fecha_inicio = (type.value == "fecha") ? '' : ''
      this.fecha_fin = (type.value == "fecha") ? '' : '';
      this.searchLabel = type;
      this.$refs.vuetable.refresh();
    },
    changeTypeSearchEstado(type) {
      this.searchLabelEstado = type;
      this.$refs.vuetable.refresh();
    },


    changeTypeDates(type, type1){
      
      this.fecha_inicio = this.customFormatter(type);
      this.fecha_fin = this.customFormatter(type1);
      // console.log(this.fecha_inicio, this.fecha_fin);
      this.$refs.vuetable.refresh();

    },
    money(value) {
        return (
          "Q " +
          parseFloat(value)
            .toFixed(2)
            .replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
        );
      },    // Para buscar
    searchChange(val) {
      this.search = val.toLowerCase();
      this.$refs.vuetable.refresh();
    },
    makeQueryParams(sortOrder, currentPage, perPage) {
      this.selectedItems = [];
      return sortOrder[0]
        ? {
            fecha_inicio: this.fecha_inicio,
            fecha_fin: this.fecha_fin,
            criterio: this.searchLabel.value,
            page: currentPage,
            limite: this.perPage,
            search: this.search,
          }
        : {
            fecha_inicio: this.fecha_inicio,
            fecha_fin: this.fecha_fin,
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
