<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <h1>{{ movieData.title }}</h1>
        <div class="separator mb-5"></div>
      </b-colxx>
    </b-row>
    <b-row>
      <b-colxx xxs="12" xl="8" class="col-left">
        <b-card class="mb-4" no-body>
          <b-card-body>
            <img :src="getPosterUrl(movieData.backdrop_path)" :alt="movieData.title" class="card-img-top"
                 style="border-radius: 40px !important;"/>
          </b-card-body>
        </b-card>

        <b-card class="mb-4" no-body>
          <b-tabs card no-fade>
            <b-tab title="Horarios" active>
              <b-row>
                
                <b-colxx>
                  <div class="horarios-pelicula">
                    <div class="row">
                            <div class="col-md-6">
                              
                              <div class="form-group">
                                  <label class="form-control-label">Fecha </label>
                                  <datepicker :bootstrap-styling="true"  @input="getSalasDisponiblesDate(fecha_inicio, fecha_fin),getHorariosDispo(movieID)"  placeholder="Seleccione fecha" :language="es" :format="customFormatter" v-model="fecha_inicio"></datepicker>
                              </div>
                            </div>
                            <!-- <div class="col-md-6">
                              <div class="form-group">
                                  <label class="form-control-label">Fecha fin intervalo</label>
                                  <datepicker :bootstrap-styling="true" @input="getSalasDisponiblesDate(fecha_inicio, fecha_fin)"  ref="myDatepicker" placeholder="Seleccione fecha" :disabledDates="disabledDates" :language="es" :format="customFormatter" v-model="fecha_fin"></datepicker>
                              </div>
                            </div> -->
                          </div>
                    <h2 class="titulo">Selección de Horarios</h2>
                    <div class="salas">
                      <div v-for="(sala) in arraySalasDips" :key="sala.id" class="sala">
                        <h3 class="sala-titulo">{{ sala.sala.nombre}}</h3>
                        <ul class="lista-horarios">
                           
                          <li
                            
                              v-for="(horario) in obtenerHorarios(sala.sala.id)"
                              :key="horario.id"
                              >
                            {{ (horario.hora) }}

                            <router-link
                              :to="{
                                name: 'select_acientos',
                                params: { idmovie: movieID, idsala: sala.sala.id, idhora:horario.hora, idprogramacion: horario.id },
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
                          </li>
                        </ul>
                        <!-- <p class="horario-seleccionado-text">
                          Horario seleccionado: {{ horariosSeleccionados[salaIndex] }}
                        </p> -->
                      </div>
                    </div>
                  </div>
                </b-colxx>
              </b-row>
            </b-tab>
          </b-tabs>
        </b-card>
      </b-colxx>
      <b-colxx xxs="12" xl="4" class="col-right">
        <b-card class="mb-4">
          <div class="mb-3">
            <div class="post-icon mr-3 d-inline-block">
              <i class="simple-icon-star mr-1"></i>
              <span>{{ movieData.vote_average }}</span>
            </div>

          </div>
          <p class="mb-3">
            {{ movieData.overview }}
          </p>
          <p class="text-muted text-small mb-2">Generos</p>
          <p class="mb-3">
            <b-badge variant="outline-secondary" class="mb-1 mr-1" pill v-for="genero in movieData.genres" :key="genero.id">
              {{ genero.name }}
            </b-badge>
          </p>
        </b-card>
        <b-card class="mb-4">
          <b-card-title>Compañias de producción</b-card-title>
          <div>
            <div class="row social-image-row gallery">
              <b-colxx xxs="4" v-for="companie in movieData.production_companies" :key="companie.id">
                <div v-if="companie.logo_path">
                  <img
                      class="img-fluid"
                      :src="getPosterUrl(companie.logo_path)"
                      :alt="companie.name"
                  />
                </div>
              </b-colxx>
            </div>
          </div>
        </b-card>

      </b-colxx>
    </b-row>
  </div>
</template>

<script>
import GlideComponentThumbs from '../../../../components/Carousel/GlideComponentThumbs'
import CommentWithLikes from '../../../../containers/pages/CommentWithLikes'
import QuestionAnswer from '../../../../containers/pages/QuestionAnswer'
import GalleryDetail from '../../../../containers/pages/GalleryDetail'
import moment from "moment";
import Datepicker from 'vuejs-datepicker';
import {en, es} from 'vuejs-datepicker/dist/locale';
import {
  detailImages,
  detailThumbs
} from "../../../../data/carouselItems";
import {
  commentWithLikesData
} from "../../../../data/comments"
import {
  detailsQuestionsData
} from "../../../../data/questions";
import {API_KEY, BASE_URL,BASE_IMG_URL,apiUrl} from "@/constants/config";
import axios from "axios";

import { mapGetters } from "vuex";
export default {
  components: {
    'glide-component-thumbs': GlideComponentThumbs,
    'comment-with-likes': CommentWithLikes,
    'question-answer': QuestionAnswer,
    'gallery-detail': GalleryDetail,
    datepicker: Datepicker,
  },
  data() {
    return {
      es :es,
      disabledDates: {
            to: '',
        },
      api : apiUrl,
      headers: { "x-token": this.$store.state.token,
                      'Content-Type': 'application/json', 
                      'Access-Control-Allow-Origin':'*'
          },
      httpOptions: {
        headers: { "x-token": this.$store.state.token}
      }, 
      salas: [
        {
          horarios: ['10:00 AM', '2:00 PM', '6:00 PM', '10:00 PM']
        },
        {
          horarios: ['11:00 AM', '3:00 PM', '7:00 PM', '11:00 PM']
        },
        {
          horarios: ['12:00 PM', '4:00 PM', '8:00 PM', '12:00 AM']
        }
      ],
      horariosSeleccionados: [],
      movieData: {},
      isLoad: false,
      detailImages,
      detailThumbs,
      fecha_inicio : new Date(),
      fecha_fin : new Date(),
      commentWithLikesData,
      detailsQuestionsData,
      arraySalasDips:[],
      movieID: 0,
      arrayHorariosDisponibles: []
    }
  },
  methods: {
  
    updateDisableDates(){
        let me = this;
        if(new Date(me.customFormatter(me.fecha_inicio)).getTime() > new Date(me.customFormatter(me.fecha_fin))){
            me.$refs.myDatepicker.clearDate();
            me.fecha_fin = '';
        }
        me.disabledDates.to = new Date(me.fecha_inicio);
      },
      customHora(date) {
        return  moment.utc(date).add(24, 'hours').format('HH:mm:ss a');
      },
    customFormatter(date) {
        return moment(date).format("YYYY-MM-DD");
    },
    async getSalasDisponiblesDate(){
    
      const response = await axios.get(apiUrl + "/api/programin/salas_movie?idmovie="+this.movieID+'&fecha_inicio='+ this.customFormatter(this.fecha_inicio)+'&fecha_fin='+this.customFormatter(this.fecha_inicio),
      {headers: { "x-token": this.$store.state.token}});

      this.arraySalasDips = response.data.salasDispo;
      // console.log(this.arraySalasDips)


      
    },
      obtenerHorarios(salaId) {
      
      return this.arrayHorariosDisponibles.filter(horario => horario.salaId === salaId);
    },
    async getHorariosDispo(id){
    
      const response = await axios.get(apiUrl + "/api/programin/salas_horarios?idmovie="+id+'&fecha_inicio='+ this.customFormatter(this.fecha_inicio)+'&fecha_fin='+this.customFormatter(this.fecha_inicio),
      {headers: { "x-token": this.$store.state.token}});
      this.arrayHorariosDisponibles = response.data.newArr;
      // console.log(this.arrayHorariosDisponibles);
      
    },
    async detallePelicula(movieId) {

      try {
        const url = `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`;
        const response = await axios.get(url);
        this.movieData = response.data;
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    },
    getPosterUrl(posterPath) {
      return `${BASE_IMG_URL}${posterPath}`;
    },
    inicializarHorariosSeleccionados() {
      this.horariosSeleccionados = this.salas.map(sala => new Array(sala.horarios.length).fill(''));
    },
    seleccionarHorario(salaIndex, horarioIndex) {
      // console.log('dieron click')
      // const horarioSeleccionado = this.salas[salaIndex].horarios[horarioIndex];
      // this.$set(this.horariosSeleccionados[salaIndex], horarioIndex, horarioSeleccionado);
    }
  },
  mounted() {
    this.inicializarHorariosSeleccionados();
    setTimeout(() => {
      this.isLoad = true
    }, 50)
    this.movieID=this.$route.params.id;
    this.detallePelicula(this.$route.params.id) 
    this.getSalasDisponiblesDate(this.$route.params.id) 
    this.getHorariosDispo(this.$route.params.id) 
  }
}
</script>
<style scoped>
.horarios-pelicula {
  text-align: center;
  margin: 20px;
}

.titulo {
  font-size: 24px;
  margin-bottom: 10px;
}

.salas {
  display: flex;
  justify-content: space-around;
}

.sala {
  background-color: #f7f7f7;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin: 10px;
  width: calc(33.33% - 20px);
  transition: background-color 0.3s;
}

.sala:hover {
  background-color: #e0e0e0;
}

.sala-titulo {
  font-size: 18px;
  margin-bottom: 10px;
}

.lista-horarios {
  list-style: none;
  padding: 0;
}

.horario-item {
  cursor: pointer;
  padding: 8px;
  border: 1px solid #ccc;
  margin: 5px;
  transition: background-color 0.3s, color 0.3s;
}

.horario-item:hover {
  background-color: #f0f0f0;
}

.horario-seleccionado {
  background-color: #007bff;
  color: white;
}

.horario-seleccionado-text {
  font-weight: bold;
  margin-top: 10px;
}
</style>