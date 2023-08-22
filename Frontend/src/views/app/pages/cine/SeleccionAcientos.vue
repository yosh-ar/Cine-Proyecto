<template>
    <div class="seat-selection">
          <!--INICIO MODAL DETALLES
            -->
      <b-modal
          no-close-on-backdrop
          id="modalSave"
          ref="modalSave"
          title="Detalle selección"
          >
          <b-form>
          <div class="seat-selection">
          
            <div class="selection-summary">
              <div class="selected-count">
                Asientos seleccionados: {{ totalAcientos }}
              </div>
              <div class="total-amount">
                Total a Pagar: {{ formatQuetzales(TotalAPagar) }}
              </div>
            </div>
            <div v-if="showSummary" class="confirmation-summary">
              <h2>Resumen de la Película</h2>
              <p><strong>Película:</strong> {{ movieData.title }}</p>
              <p><strong>Sala:</strong> {{ salanombre }}</p>
              <p><strong>Horario:</strong> {{ horario }}</p>
              <p><strong>Asientos:</strong> {{ selectedSeatsText }}</p>
            </div>
          </div>
          </b-form>
          <template #modal-footer="{}">
             <div class="selection-summary">
              <b-form-group label="Correo" >
                <b-form-input        
                :class="{ 'form-group--error': $v.email.$error }"
                v-model.trim="email"
                type="email"
                class="form-control"
                placeholder="Correo electrónico"
                @input="$v.email.$touch()"
              ></b-form-input>
              <div v-if="$v.email.$error">
                    <div class="alert alert-warning" v-if="!$v.email.correo">Correo invalido.</div>
              </div>
            </b-form-group>
            
              
          </div>
          <button @click="storeVenta">Confirmar Selección</button>
              <b-button type="submit" hidden variant="primary" @click="onValidate('save')"
              >Guardar</b-button
              >
              <b-button variant="danger" hidden @click="closeModal('save')"
              >Cancelar</b-button
              >
          </template>
        </b-modal>

        <!-- Fin modal -->
      <b-colxx xxs="12">
        <h1>{{ movieData.title }}</h1>
        <div class="separator mb-5"></div>
        <div class="movie-info">
          <div class="info-left">
            <h2>Sala</h2>
            <h1 class="salanombre">{{ salanombre }}</h1>
          </div>
          <div class="info-center">
            <h2>Horario</h2>
            <h1 class="horario">{{ horario }}</h1>
          </div>
          <div class="info-right">
            <h2>Precio</h2>
            <p class="price-value">{{ formatQuetzales(moviePrice) }}</p>
          </div>
        </div>
      </b-colxx>
    <h1>Selección de Asientos - {{ movieTitle }}</h1>
      <div class="cinema">
        <div class="seats">
          <div v-for="(row, rowIndex) in seatRows" :key="rowIndex" class="seat-row">
            <div class="seat" v-for="(seat, seatIndex) in row.seats" :key="seatIndex" :class="{ 'selected': seat.selected, 'empty': !seat.selected, 'reserved' : seat.reserved }"  @click="seat.reserved ? null : toggleSeat(rowIndex, seatIndex)">
              {{ String.fromCharCode(65 + seatIndex) }}{{ rowIndex + 1 }}
            </div>
          </div>
        </div>
        <div class="screen">
          <div class="screen-content">Pantalla</div>
        </div>
      </div>
      <div class="selection-summary">
      <div class="selected-count">
        Asientos seleccionados: {{ totalAcientos }}
      </div>
      <div class="total-amount">
        Total a pagar: Q {{ TotalAPagar }}
      </div>
    </div>
      <button @click="confirmSelection" v-b-modal.modalSave>Confirmar Selección</button>
    </div>
  </template>
  
  <script>
  
  import axios from "axios";

import {API_KEY, BASE_URL,BASE_IMG_URL,apiUrl} from "@/constants/config";
import {helpers} from '../../../../helpers/helpers-validate';
import "vue-select/dist/vue-select.css";
import { validationMixin } from "vuelidate";

let correo = (value) => helpers.correo(value)


  export default {
    props: ['movieTitle'],
    data() {
      return {
        arrayString : '',
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
        showSummary: false,
        moviePrice: 0,
        TotalAPagar: 0,
        totalAcientos : 0,
        totalRows: 11, // cantidad de filas
        seatsPerRow: 13, // cantidad de hacientos x fila
        seatRows: [],
        movieData: {},
        salanombre: null,
        horario: null,
        salaId: null,
        arrayReservados: [],
        detalleSalaId  : 0,
        arrayDetalle : [],
        email : "",
      };
    },
    mixins: [validationMixin],
  validations: {
    
     
      email: {
          correo
      
    },
  },
    created() {
      // Generar disposición inicial de los asientos
 
      this.getByReservados(this.$route.params.idprogramacion); 
      this.detalleSalaId = this.$route.params.idprogramacion;
    },
    mounted(){
      this.detallePelicula(this.$route.params.idmovie,this.$route.params.idsala,this.$route.params.idhora) 
    },  
    methods: {
      
      updateDisableDates(){
          let me = this;
          // if(new Date(me.customFormatter(new Date())).getTime() > new Date(me.customFormatter(new Date()))){
          //     me.$refs.myDatepicker.clearDate();
          //     // me.fecha_fin = '';
          // }
          me.disabledDates.to = this.sumarDias(new Date());
      },
      confirmSelection() {
  
        this.showSummary = true;
      },
      formatQuetzales (amount) {
        let num = parseFloat(amount), formatted
        formatted =  num.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
        return amount = 'Q ' + formatted
    },
      async getByReservados(id){
    
        const response = await axios.get(apiUrl + "/api/ventas/get_reservas?id="+id,
        {headers: { "x-token": this.$store.state.token}});
        // console.log(response.data)
        this.arrayReservados = response.data.reservas;

      },
      async getSalaById(salaId){
    
          const response = await axios.get(apiUrl + "/api/programin/get_salabyid?id="+salaId,
          {headers: { "x-token": this.$store.state.token}});
        // console.log(response.data);
        this.totalRows = response.data.data.capacidad/response.data.data.cantidad_filas;
        this.seatsPerRow = response.data.data.cantidad_filas;
        this.salanombre = response.data.data.nombre + ' '+ response.data.data.tipo_sala.nombre;
        this.moviePrice = parseInt(response.data.data.tipo_sala.valor);
        this.generateSeats();

        },
      async detallePelicula(movieId,sala,hora) {

      try {
        const url = `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`;
        const response = await axios.get(url);
        this.movieData = response.data;

        this.horario =hora;
        this.salaId = sala;
        this.getSalaById(this.salaId)
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
      },
      generateSeats() {
        for (let row = 0; row < this.totalRows; row++) {
          const seats = [];
          for (let seat = 0; seat < this.seatsPerRow; seat++) {
            
            const seatNumber = String.fromCharCode(65 + seat);
            const isReserved = this.arrayReservados.find(reservedSeat => reservedSeat.fila === seatNumber && reservedSeat.no_asiento === row + 1);
            const isSeatReserved = !!isReserved; 
            // console.log(isSeatReserved)
            seats.push({ 
              selected: isSeatReserved,
              reserved: !!isReserved,
            });
          }
          this.seatRows.push({ rowNumber: row, seats });
          // console.log(this.seatRows);
        }
      },
      calcularPrecioAsiento(seat) {
          return seat.selected ? this.moviePrice : 0;
        },
      toggleSeat(rowIndex, seatIndex) {
        const seat = this.seatRows[rowIndex].seats[seatIndex];      
          if (!seat.reserved) {
            seat.selected = !seat.selected;
        
            if (seat.selected) {
              this.totalAcientos++;
              this.TotalAPagar += this.calcularPrecioAsiento(seat); // Ajusta la función según el cálculo de precio
              
            } else {
              this.totalAcientos--;
              this.TotalAPagar -= this.calcularPrecioAsiento(seat); // Ajusta la función según el cálculo de precio
            }
          }
      },
      confirmSelection() {
              // Confirmar selección y mostrar asientos seleccionados en la consola
        const selectedSeats = [];
  
        this.seatRows.forEach(row => {
          row.seats.forEach((seat, seatIndex) => {
            if (seat.selected && !seat.reserved ) {
              selectedSeats.push({ row: String.fromCharCode(65 + seatIndex), seat: row.rowNumber + 1 });
            }
          });
        });
        this.showSummary = true;
        console.log('Asientos seleccionados:', selectedSeats);
      },
      limpiarArray(detalle,detalleSalaId, moviePrice){
        const arregloObjetos = detalle.map(cadena => {
          const letra = cadena.charAt(0);
          const numero = parseInt(cadena.slice(1));
          
          return { fila: letra, asiento: numero, detalleSalaId, precio : moviePrice };
        });
        return arregloObjetos;
      },
      storeVenta(){
        const me = this;
        let usuario = parseInt(localStorage.getItem("usuario"));  
        let newArr = this.limpiarArray(this.arrayDetalle,parseInt(this.detalleSalaId), this.moviePrice);
        if(newArr.length <=0 || this.email == ''){
          return this.$notify(
            "error filled",
            "ERROR",
            "Debes seleccionar al menos un asiento y ingrese un correo",
            { duration: 4000, permanent: false }
          );
        }
        // console.log(this.$route.params.idhora,  this.salanombre, this.movieData.title , this.arrayString);
        // return ;
        axios
          .post(apiUrl + "/api/ventas/store", {
            'sala' : this.salanombre,
            'movie' : this.movieData.title,
            'asientos' : this.arrayString,
            'hora'  : this.$route.params.idhora,
            'fecha' : this.$route.params.fecha,
            usuario,
            email : this.email,
            'total_boletos' :this.totalAcientos,
            'total':this.TotalAPagar,
            'detalleSalaId' :parseInt( this.detalleSalaId ),
            data :  newArr,
          },{headers: this.headers})
          .then((response) => {
            me.$notify("primary filled", "Guardado", `Venta realizada con éxito`, {
              duration: 7000,
              permanent: false,
            });
            
            this.$router.push({ name: "movie" });
          })
          .catch((error) => {
            this.errorMessage = error.message;
            console.error("Error!", error);
          });
      },  
    },
    computed : {
      selectedSeatsText() {
        const selectedSeatsArray = [];
          //seatRows todos los asientos
        for (let rowIndex = 0; rowIndex < this.seatRows.length; rowIndex++) { // fila
          const row = this.seatRows[rowIndex];
          for (let seatIndex = 0; seatIndex < row.seats.length; seatIndex++) { // asientos
            const seat = row.seats[seatIndex];
            if (seat.selected && !seat.reserved) {
              selectedSeatsArray.push(`${String.fromCharCode(65 + seatIndex)}${rowIndex + 1}`); // asignamos al array la fila y asiento
            }
          }
        }
      this.arrayDetalle = selectedSeatsArray;
      this.arrayString = selectedSeatsArray.join(', ');
      return selectedSeatsArray.join(', ');
      },
    }
  };
  </script>
  
  <style scoped>
  .seat-selection {
    text-align: center;
    padding: 20px;
  }
  
  .cinema {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .screen {
    background-color: #333;
    color: white;
    padding: 10px;
    text-align: center;
    width: 400px;
    margin-top: 20px;
    border-radius: 15px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    position: relative;
  }
  
  .screen-content {
    width: 100%;
    height: 60px;
    background-color: #000;
    border-radius: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .seats {
    display: flex;
    flex-direction: row;
  }
  
  .seat-row {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-right: 10px;
  }
  
  .seat {
    width: 30px;
    height: 30px;
    background-color: #ccc;
    margin: 2px 0;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .seat.selected {
    background-color: #007bff;
    color: white;
  }
  .seat.reserved {
    background-color: #ffa300;
    color: white;
  }
  
  .seat.empty {
    background-color: #e1e1e1;
  }
  
  button {
    margin-top: 20px;
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #0056b3;
  }
.selection-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding: 10px;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.selected-count,
.total-amount {
  font-size: 18px;
  font-weight: bold;
}

.total-amount {
  color: #e74c3c; /* Color rojo para resaltar el total a pagar */
}

.movie-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .info-left,
  .info-center,
  .info-right {
    text-align: center;
  }
  
  .salanombre,
  .horario {
    margin: 0;
    font-size: 36px;
  }
  
  .price-value {
    font-size: 24px;
    font-weight: bold;
    color: #e74c3c; /* Color rojo para resaltar el precio */
    margin-top: 10px;
  
  }


  /* CSS PARA MODAL */
  .confirmation-summary {
    margin-top: 30px;
    padding: 20px;
    background-color: #f5f5f5;
    border: 1px solid #ddd;
    border-radius: 5px;
  }
  
  .confirmation-summary h2 {
    font-size: 24px;
    margin-bottom: 10px;
  }
  
  .confirmation-summary p {
    font-size: 18px;
    margin-bottom: 8px;
  }
</style>
  
