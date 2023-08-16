<template>
    <b-row>
      <b-colxx xxs="12">
        <h1>Información</h1>
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
            
          </b-collapse>
        </div>
        <br />
         <div class="icon-cards-row" v-if="dataSelect2.user ">
          <!-- <div class="row"> -->
          <glide-component :settings="glideIconsOption">
              <icon-card
                :title="'Usuario a cargo'"
                icon="simple-icon-user-follow"
                :value="
                  dataSelect2.user.usuario"
              />
               <icon-card
                :title="'Fecha registro'"
                icon="simple-icon-calendar"
                :value="dataSelect2.fecha == ''?'': formatoPresentacion(dataSelect2.fecha)"
              />
            <!-- </div> -->
          </glide-component>
          <!-- </div> -->
          <!-- <div class="row">
            <div class="col"> -->
   
            <!-- </div> -->
              <!-- <div class="col">
              
            </div>
            <div class="col">
             
            </div>
          </div> -->
        </div>
        <div class="separator mb-5" />
      </b-colxx>
      
    </b-row>
    
  </template>
  <script>
  import IconCard from "../../components/Cards/IconCard";
  import GlideComponent from "../../components/Carousel/GlideComponent";
  import { apiUrl } from "../../constants/config";
  
  import moment from 'moment';
  export default {
    props: [
      "changeTypeSearch",
      "searchLabel",
      "searchType",
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
      "dataSelect2",
    ],
    components: { "icon-card": IconCard, "glide-component": GlideComponent },
    created() {
    },
    data() {
      return {
           glideIconsOption: {
          gap: 3,
          perView: 3,
          type: "carousel",
          breakpoints: {
            320: {
              perView: 1,
            },
            576: {
              perView: 2,
            },
            1600: {
              perView: 3,
            },
          },
          hideNav: true,
        },
        api: apiUrl,
        glideNoControlsSettings: {
          gap: 5,
          perView: 1,
          type: "carousel",
         
          hideNav: true,
        },
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
        pageSizes: [3, 5, 8],
      };
    },
    methods: {
      formatoPresentacion(date){
          return moment(date).locale('es').format('LL'); 
      },
     
      
    },
  };
  </script>
  