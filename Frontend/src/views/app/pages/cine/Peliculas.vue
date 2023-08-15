<template>
  <div>
    <h1>Listado de Películas</h1>
    <div class="movie-list">
      <div v-for="movie in displayedMovies" :key="movie.id">
        <b-card no-body>
          <div >
            <router-link :to="{ name: 'detalle', params: { id: movie.id } }" class="w-40 w-sm-100">
              <img :src="getPosterUrl(movie.poster_path)" class="card-img-top" :alt="movie.title" />
            </router-link>
            <b-badge pill :variant="movie.adult == true ? 'danger' : 'primary'" class="position-absolute badge-top-left">{{ movie.adult == true ? '+18' : 'Todo público' }}</b-badge>
          </div>
          <b-card-body>
            <b-row>
              <b-colxx xxs="12">
                <h6 class="card-subtitle">{{movie.title}}</h6>
              </b-colxx>
            </b-row>
          </b-card-body>
        </b-card>

      </div>
    </div>
    <div class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1">Anterior</button>
      <span>Página {{ currentPage }} de {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">Siguiente</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      movies: [],
      currentPage: 1,
      moviesPerPage: 10
    };
  },
  created() {
    this.fetchMovies();
  },
  computed: {
    displayedMovies() {
      const startIndex = (this.currentPage - 1) * this.moviesPerPage;
      const endIndex = startIndex + this.moviesPerPage;
      return this.movies.slice(startIndex, endIndex);
    },
    totalPages() {
      return Math.ceil(this.movies.length / this.moviesPerPage);
    }
  },
  methods: {
    async fetchMovies() {
      try {
        const response = await fetch(
            'https://api.themoviedb.org/3/movie/popular?api_key=5cf334e4000552b1b4724eb6ad837eb7'
        );
        const data = await response.json();
        this.movies = data.results;
        console.log(this.movies)
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    },
    getPosterUrl(posterPath) {
      return `https://image.tmdb.org/t/p/w500${posterPath}`;
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    }
  }
};
</script>

<style>
.movie-list {
  display: flex;
  flex-wrap: wrap;
  gap: 100px;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.pagination button {
  margin: 0 10px;
  padding: 5px 10px;
  border: none;
  background-color: #007bff;
  color: white;
  cursor: pointer;
}

.pagination button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>