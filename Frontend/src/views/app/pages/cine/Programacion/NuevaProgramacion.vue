<template>
    <div>
    
      <b-row >
        <b-colxx xxs="12">
          <h1>Nueva Programacion</h1>
          <div class="top-right-button-container">
            <router-link
              :to="{
                name: 'programin',
              }"
            >
              <b-button variant="success" size="lg" class="top-right-button"
                >REGRESAR</b-button
              >
            </router-link>
          </div>
          <!-- CABECERA -->
          <b-card class="mb-4">
            <b-row>
              <b-colxx>
                <h3 class="textolead">Película</h3>
                <br />
                <b-form-group>
                  <v-select
                    ref="buscadorMovies"
                    v-model.trim="$v.movieExist.$model"
                    :state="!$v.movieExist.$error"
                    @search="selectMovies"
                    label="title"
                    :options="arrayMovies"
                    placeholder="Buscar Películas..."
                    @input="getDatosMovie"
                  >

                    <!-- <template v-slot:option="option">
                      {{
                        `${option.persona.nombre_persona} ${option.persona.apellido_persona} ::  ${option.nit}`
                      }}
                    </template>
                    <template slot="selected-option" slot-scope="option">
                      {{
                        `${option.persona.nombre_persona} ${option.persona.apellido_persona} ::  ${option.nit}`
                      }}
                    </template> -->
                  </v-select>
                  <div
                    :class="{
                      'invalid-feedback': true,
                      'd-block':
                        $v.movieExist.$error && !$v.movieExist.required,
                    }"
                  >
                    Debe seleccionar una película
                  </div>
                </b-form-group>
              </b-colxx>
         
              
              <b-colxx>
                <h3 class="textolead">Salas</h3>
                <br />
                <b-form-group >
                  <v-select
                    v-model.trim="$v.SalaModel.$model"
                    :state="!$v.SalaModel.$error"
                    :options="dataSelect1"
                    label="nombre"
                  />
                  <div
                    :class="{
                      'invalid-feedback': true,
                      'd-block':
                        $v.SalaModel.$error && !$v.SalaModel.required,
                    }"
                  >
                    Debe seleccionar una sala
                  </div>
                </b-form-group>
              </b-colxx>
              <b-colxx>
                <h3 class="textolead">Fecha programación</h3>
                <br />
                <b-form-group>
              
                  <b-form-invalid-feedback
                    >Debe ingresar la fecha</b-form-invalid-feedback
                  >
                  <datepicker :bootstrap-styling="true" ref="myDatepicker"  :selected="updateDisableDates()" placeholder="Seleccione fecha" :disabledDates="disabledDates" :language="es" :format="customFormatter" v-model="fecha"></datepicker>
                  
                  <b-form-invalid-feedback
                    >Debe ingresar la fecha</b-form-invalid-feedback
                  >
                </b-form-group>
             
              </b-colxx>
              <b-colxx>
                <br />
                <br />
                <b-form-group>
              
              <b-form-invalid-feedback
                >Debe ingresar la hora</b-form-invalid-feedback
              >
              <b-form-input
              type="time" id="appt" name="appt" min="09:00" max="18:00" v-model="hora_movie"
              ></b-form-input>

              <b-form-invalid-feedback
                >Debe ingresar la fecha</b-form-invalid-feedback
              >
            </b-form-group>
                <b-form-group>
                    <b-button-group>
                      <b-button
                        @click="agregarDetalle()"
                        size="sm"
                        variant="outline-success"
                        ><i :class="'simple-icon-check'"
                      /></b-button>
                    </b-button-group>
                </b-form-group>
              </b-colxx>
            </b-row>
               
              
       
          </b-card>
          <!-- FIN CABECERA -->
          <!-- INICIO DETALLE -->
    
  
          <br />
  
          <b-card>
            <h3 class="textolead">Programación asignada</h3>
            <br />
            <b-card no-body>
              <div class="table-responsive">
                <table class="table">
                  <thead>
                    <th>Opciones</th>
                    <th>Pelicula</th>
                    <th>Sala</th>
                    <th>Fecha</th>
                    <th>Hora</th>
                  </thead>
                  <tbody v-if="arrayDetalle.length">
                    <tr
                      v-for="(detalle, index) in arrayDetalle"
                      :key="index"
                    >
                      <td>
                        <b-button-group>
                          <b-button
                            @click="eliminarDetalle(index, detalle)"
                            class="mb-2"
                            size="sm"
                            variant="outline-danger"
                            ><i :class="'simple-icon-minus'"
                          /></b-button>
                      
                        </b-button-group>
                      </td>
                      <td v-text="detalle.nombre"></td>
                      <td v-text="detalle.sala"></td>
                      <td v-text="detalle.fecha"></td>
                      <td v-text="detalle.hora"></td>
  
                    </tr>
                  </tbody>
  
                  <tbody v-else>
                    <tr style="background-color: #ceecf5">
                      <td colspan="7">No se han ingresado programación.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </b-card>
            <div
              :class="{
                'invalid-feedback': true,
                'd-block': $v.arrayDetalle.$error && !$v.arrayDetalle.required,
              }"
            >
              Debe ingresar detalles
            </div>
            <br />
            <!-- FOOTER DE DETALLES -->
        
          </b-card>
          <br />
          <div class="row">
            <div class="col">
              <b-button
                block
                id="registrar"
                size="lg"
                type="submit"
                variant="primary"
                @click="storeProgramin()"
                >REGISTRAR</b-button
              >
            </div>
          </div>
        </b-colxx>
      </b-row>

    </div>
  </template>
  <script>
  import Vuetable from "vuetable-2/src/components/Vuetable";
  import { apiUrl } from "../../../../../constants/config";
  import VuetablePaginationBootstrap from "../../../../../components/Common/VuetablePaginationBootstrap";
  // scss
import { BASE_URL,API_KEY,BASE_IMG_URL } from "../../../../../constants/config";
  import { es } from "vuejs-datepicker/dist/locale";
  import vSelect from "vue-select";
  import Tab from "../../../../../components/Form/Wizard/Tab";
  import "vue-select/dist/vue-select.css";
  import Switches from "vue-switches";
  import { validationMixin } from "vuelidate";
  import axios from "axios";
  import createNumberMask from "text-mask-addons/dist/createNumberMask";
  import MaskedInput from "vue-text-mask";
  import moment from "moment";
  import { mapGetters } from "vuex";
  import DatePiker from "vuejs-datepicker";
  // import DatetimePicker from "vuejs-datepicker";

  // import DatePicker from 'vue2-datepicker';
  import 'vue2-datepicker/index.css';

  
  const { required } = require("vuelidate/lib/validators");
  
  export default {
    components: {
      vSelect,
      vuetable: Vuetable,
      MaskedInput,
      "vuetable-pagination-bootstrap": VuetablePaginationBootstrap,
      // datepicker  : DatePicker,
      datepicker  : DatePiker,
      tab: Tab,
      switches: Switches,
    },
    data() {
      return {
        hora_movie: null,
        dataSelect1: [],  
        SalaModel: null,
      url : BASE_URL,
      key : API_KEY,
      img_url : BASE_IMG_URL,
      disabledDates: {
                    to: '',
                },

        headers: { "x-token": this.$store.state.token,
                      'Content-Type': 'application/json', 
                      'Access-Control-Allow-Origin':'*'
          },
          httpOptions: {
            headers: { "x-token": this.$store.state.token}
          }, 
     
        es: es,
        arrayDetalle: [],
        fecha:new Date(),
        movieExist: "",
        arrayMovies: [],
        idpelicula: 0,
       
        isLoad: false,
        page: 1,
        perPage: 5,
        show: true,
        search: "",
        from: 0,
        to: 0,
        lastPage: 0,
        items: [],
        selectedItems: [],
        api: apiUrl,
        activador : false,
      };
    },
    mixins: [validationMixin],
  
    validations: {
      hora_movie: {
        required
      },
      SalaModel : {
        required
      },
    
      movieExist: {
        required,
      },
      idpelicula: {
        required,
      },
      
      fecha: {
        required,
      },
   
      arrayDetalle: {
        required,
        // $each: {
        //   cantidad: {
        //     required,
        //   },
        //   precio_compra: {
        //     required,
        //   },
        // },
      },
    },
    computed: {
      ...mapGetters({
        currentUser: "currentUser",
      }),
    
    },
    methods: {
      sumarDias(fecha){
        fecha.setDate(fecha.getDate() -1);
        return fecha;
      },

      updateDisableDates(){
          let me = this;
          me.disabledDates.to = this.sumarDias(new Date());
      },
     async validaSala() {
      let me = this;
      const response = await axios.get(apiUrl + "/api/programin/valida_programacion?idSala="+this.SalaModel.id+'&fecha_recibe='+ this.customFormatter(this.fecha)+'&hora_entra='+this.customHora(this.fecha),
      {headers: { "x-token": this.$store.state.token}});
      this.activador = response.data.bandera;
    },
    async SelectSala() {
      let me = this;
      this.dataSelect1 = [];
      const response = await axios.get(apiUrl + "/api/programin/get_salas",{headers: { "x-token": this.$store.state.token}});
      me.dataSelect1 = response.data.data;

    },

      storeProgramin() {
        const me = this;
        let usuario = parseInt(localStorage.getItem("usuario"));      
        const btnRegistrar = document.querySelector('#registrar');
        btnRegistrar.disabled = true;

        axios
          .post(apiUrl + "/api/programin/store", {
            usuario,
            data :  this.arrayDetalle,
          },{headers: this.headers})
          .then((response) => {
            me.$notify("primary filled", "Guardado", `Programación Registrada`, {
              duration: 7000,
              permanent: false,
            });
            me.limpiarVariables();
            btnRegistrar.disabled = false;
            this.$router.push({ name: "programin" });
          })
          .catch((error) => {
            this.errorMessage = error.message;
            console.error("Error!", error);
          });
      },
   
    
      // FUNCIONES DE BUSQUEDA
      async selectMovies(search, loading) {
        let me = this;
        loading(true);
        try {
          const response = await axios.get(`${this.url}/movie/popular?api_key=${this.key}&query=${search}`);
          let respuesta = response.data.results;
          a: search;
          me.arrayMovies = respuesta;
          loading(false);
        } catch (err) {
          console.log(err);
        }
      },
      // Función que recuperar el cliente buscado
      getDatosMovie(val1) {
        let me = this;
        me.loading = true;
        if (val1 == null || val1 == "") {
          me.movieExist = "";
          me.idpelicula = -1;
        } else {
          me.idpelicula = val1.id;
        }
      },
     
      // REINICIO DE Variables
      limpiarVariables() {
        const me = this;
        this.idpelicula = -1;
        this.SalaModel = null;
        this.fecha = null;
        this.movieExist = null;
        this.hora_movie = null;
      },
      // FUNCIONES PARA MONEDAS
      les(amount) {
        let num = parseFloat(amount),
          formatted;
        formatted = num.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
        return (amount = "Q " + formatted);
      },
      converMaskToNumberxd(number) {
        let myNumber = "";
        for (let i = 0; i < number.length; i += 1) {
          if (
            number.charAt(i) === "Q" ||
            number.charAt(i) === "," ||
            number.charAt(i) === " "
          ) {
            continue;
          } else {
            myNumber += number.charAt(i);
          }
        }
        return parseFloat(myNumber).toFixed(2);
      },
      // FUNCIONES FECHAS
      customFormatter(date) {
        return moment(date).format("YYYY-MM-DD");
      },
      customFormatterHora(date) {
        return moment(date).format("YYYY-MM-DD HH:mm:ss");
      },
      customHora(date) {
        return  moment(date).format('HH:mm:ss a');
      },
      formatoPresentacion(date) {
        return moment(date)
          .locale("es")
          .format("LL");
        //    return moment(date).format("YYYY-MM-DD");
      },

      eliminarDetalle(index) {
        let me = this;
        me.arrayDetalle.splice(index, 1);
      },
      async agregarDetalle() {
          const idmovie = this.idpelicula;
        const idsala = this.SalaModel;
        const fecha = this.customFormatter(this.fecha);
        const fecha_hora = this.customFormatterHora(this.fecha);
    
        
       
        if(idsala == null || idmovie <=0  ||fecha == 'Invalid date'){
          this.$notify(
            "error filled",
            "Vacío",
            "Debes seleccionar todos los datos",
            { duration: 1000, permanent: false }
          );
          return;
        }else{
          await this.validaSala();
           if(!this.activador){
          this.$notify(
            "error filled",
            "Vacío",
            "La " +idsala.nombre+" Ya se encuentra reservada para esta fecha y horario",
            { duration: 3000, permanent: false }
          );
          return;
        }
        else{
          this.arrayDetalle.push({
            nombre : this.movieExist.title,
            sala :idsala.nombre,
            fecha,
            fecha_hora,
            salaId: idsala.id,
            idmovie,
            hora: this.hora_movie,
          })
        }
        }
        
        this.limpiarVariables();
       
      },
  
  
      // DATOS PARA PAGINACION
  
      changeTypeSearch(type) {
        // console.log(type);
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
        
        this.asignarProducto();
        // console.log(this.searchLabel.value, this.search);
        return sortOrder[0]
          ? {
              // fecha_inicio: this.fecha_inicio,
              // fecha_fin: this.fecha_fin,
              criterio: this.searchLabel.value,
              page: currentPage,
              limite: this.perPage,
              search: this.search,
            }
          : {
              // fecha_inicio: this.fecha_inicio,
              // fecha_fin: this.fecha_fin,
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
    },
    
    async mounted() {
      this.SelectSala();
    },
  };
  </script>
  