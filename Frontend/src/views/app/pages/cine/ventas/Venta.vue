<template>
    <div>
   
      <!-- CABECERA DE LA TABLA -->
      <datatable-heading
        :title="'Ventas'"
        :changeTypeSearch="changeTypeSearch"
        :changeTypeSearchEstado="changeTypeSearchEstado"
        :changeTypeDates ="changeTypeDates"
        :ReportGenerate = "ReportGenerate"
        :searchType="searchType"
        :searchLabel="searchLabel"
        :changePageSize="changePageSize"
        :searchChange="searchChange"
        :from="from"
        :to="to"
        :total="total"
        :perPage="perPage"
      ></datatable-heading>
       
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
import DatatableHeading from "../../../../../components/ventas/DataTableHeading.vue";
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
        total_ventas: 0,
        total_boletos:0,
        headers: { "x-token": this.$store.state.token,
                    'Content-Type': 'application/json', 
                    'Access-Control-Allow-Origin':'*'
        },
        httpOptions: {
          headers: { "x-token": this.$store.state.token}
        }, 
        es: es,
        fecha_inicio: '',
        fecha_fin :'',
        searchType: [
            { nombre: "Fecha venta", value: "fecha" },
        ],
        dataSelect: [],   
        searchLabel: { nombre: "Fecha venta", value: "fecha" },             

        isLoad: false,

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
       
       
    };
  },
  mixins: [validationMixin],

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
    setData(data) {
      // console.log(data)
      // this.form.state = data.persona.estado_persona;
      this.id_venta = data.id;
      this.no_venta = data.no_ducumento_v;
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
    //   this.$refs.vuetable.refresh();
    },
    changeTypeSearchEstado(type) {
      this.searchLabelEstado = type;
    //   this.$refs.vuetable.refresh();
    },
    async ReportGenerate(){
    await this.getReport();
        // return;
      if(this.fecha_inicio != "" && this.fecha_fin != "" ){
        let me = this
      var altura = 2 //Altura inicial para empezar a escribir
      var ahora = new Date()
      var doc = new JsPDF({
        unit: 'cm', //unidad de medida de la hojita
        format: [28, 21.5] //hoja tamaño carta, el primer número es el alto, el segundo es el ancho
      })
      var ingreso = moment(ahora).format('DD/MM/YYYY')
    //   var imgData = this.logo// Imagen que le meto al pdf, pero aqui no te sirve creo
    var image1 = new Image();
      image1.src = '../../../../../../assets/logos/cine_2.png';
      doc.text('Reporte de ganancias.', 7.5, 1) //Aqui empiezo con el texto, 10 es la posicion en x y la posicion en y es la variable "altura".
      altura = altura + 0.5 
      doc.addImage(image1, 'jpeg', 2, 2, 4, 4) // aqui meto la imagen a ciertas coordenadas

          
      doc.setFontSize(10).setFont(undefined, 'bold') //Tamaño 10, bold es letra en negrita
      doc.text('CineVerso.', 9, altura) //Aqui empiezo con el texto, 9 es la posicion en x y la posicion en y es la variable "altura".
      altura = altura + 0.5 //En estas lineas voy aumentando la altura para poner el resto del texto
      doc.text('Todo en estreno de peliculas ', 9, altura) //Aqui empiezo con el texto, 9 es la posicion en x y la posicion en y es la variable "altura".

      altura = altura + 0.5 //En estas lineas voy aumentando la altura para poner el resto del texto
      doc.text('Teléfono: 4033-8428', 9, altura)
      altura = altura + 0.5 //En estas lineas voy aumentando la altura para poner el resto del texto
      doc.text('Dirección: Calle Encantamiento, No. 123', 9, altura)
      altura = altura + 0.5 //En estas lineas voy aumentando la altura para poner el resto del texto
      doc.text('Barrio de la Ilusión, Ciudad Imaginaria', 9, altura)
      altura = altura + 1 //En estas lineas voy aumentando la altura para poner el resto del texto
      doc.text('Total vendido', 7, altura)
      doc.text('Total boletos', 11, altura)
      altura = altura + 1
     
      doc.setFontSize(10).setFont(undefined, 'normal')
      doc.text(this.money(this.total_ventas).toString(), 7, altura)
      doc.text(this.money(this.total_boletos).toString(), 11, altura)

     
          
            doc.save(`Ganancias desde.${this.fecha_inicio} hasta ${this.fecha_fin}.pdf`); //Aqui guardo el pdf
      }
      
            
    },
    async getReport(){
    
        const response = await axios.get(apiUrl + "/api/ventas/get_report_ventas?fecha_inicio="+this.customFormatter(this.fecha_inicio)+'&fecha_fin='+this.customFormatter(this.fecha_inicio),
        {headers: { "x-token": this.$store.state.token}});
        // console.log(response.data)
        this.total_ventas= response.data.tatalVentas[0].total_venta;
        this.total_boletos = response.data.tatalVentas[0].total_boletos;
        // console.log(this.total_boletos)    
     },
    changeTypeDates(type, type1){
      
      this.fecha_inicio = this.customFormatter(type);
      this.fecha_fin = this.customFormatter(type1);
      // console.log(this.fecha_inicio, this.fecha_fin);
    //   this.$refs.vuetable.refresh();


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
