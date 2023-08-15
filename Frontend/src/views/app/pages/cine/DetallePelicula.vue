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
                    <h2 class="titulo">Selección de Horarios</h2>
                    <div class="salas">
                      <div v-for="(sala, salaIndex) in salas" :key="salaIndex" class="sala">
                        <h3 class="sala-titulo">Sala {{ salaIndex + 1 }}</h3>
                        <ul class="lista-horarios">
                          <li
                              v-for="(horario, horarioIndex) in sala.horarios"
                              :key="horarioIndex"
                              @click="seleccionarHorario(salaIndex, horarioIndex)"
                              :class="{
                                  'horario-seleccionado': horario === horariosSeleccionados[salaIndex][horarioIndex],
                                  'horario-desactivado': horariosSeleccionados[salaIndex][horarioIndex] !== ''
                                }"
                              >
                            {{ horario }}
                          </li>
                        </ul>
                        <p class="horario-seleccionado-text">
                          Horario seleccionado: {{ horariosSeleccionados[salaIndex] }}
                        </p>
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
            <b-badge variant="outline-secondary" class="mb-1 mr-1" pill v-for="genero in movieData.genres">
              {{ genero.name }}
            </b-badge>
          </p>
        </b-card>
        <b-card class="mb-4">
          <b-card-title>Compañias de producción</b-card-title>
          <div>
            <div class="row social-image-row gallery">
              <b-colxx xxs="4" v-for="companie in movieData.production_companies">
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
import {API_KEY, BASE_URL} from "@/constants/config";

export default {
  components: {
    'glide-component-thumbs': GlideComponentThumbs,
    'comment-with-likes': CommentWithLikes,
    'question-answer': QuestionAnswer,
    'gallery-detail': GalleryDetail,
  },
  data() {
    return {
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
      tableItems: [{
        id: 1,
        first_name: 'Mark',
        last_name: 'Otto',
        username: '@mdo'
      },
        {
          id: 2,
          first_name: 'Jacob',
          last_name: 'Thornton',
          username: '@fat'
        },
        {
          id: 3,
          first_name: 'Lary',
          last_name: 'the Bird',
          username: '@twitter'
        }
      ],
      commentWithLikesData,
      detailsQuestionsData,
    }
  },
  methods: {
    detallePelicula(movieId) {
      const url = `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`;

      fetch(url)
          .then(response => response.json())
          .then(data => {
            this.movieData = data;
            console.log("Detalles de la película:", data);
          })
          .catch(error => {
            console.error("Error al obtener los detalles de la película:", error);
          });
    },
    getPosterUrl(posterPath) {
      return `https://image.tmdb.org/t/p/w500${posterPath}`;
    },
    inicializarHorariosSeleccionados() {
      this.horariosSeleccionados = this.salas.map(sala => new Array(sala.horarios.length).fill(''));
    },
    seleccionarHorario(salaIndex, horarioIndex) {
      const horarioSeleccionado = this.salas[salaIndex].horarios[horarioIndex];
      this.$set(this.horariosSeleccionados[salaIndex], horarioIndex, horarioSeleccionado);
    }
  },
  mounted() {
    this.inicializarHorariosSeleccionados();
    setTimeout(() => {
      this.isLoad = true
    }, 50)

    this.detallePelicula(this.$route.params.id)
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