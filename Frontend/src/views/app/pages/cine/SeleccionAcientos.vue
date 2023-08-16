<template>
    <div class="seat-selection">
      <h1>Selección de Asientos - {{ movieTitle }}</h1>
      <div class="cinema">
        <div class="seats">
          <div v-for="(row, rowIndex) in seatRows" :key="rowIndex" class="seat-row">
            <div class="seat" v-for="(seat, seatIndex) in row.seats" :key="seatIndex" :class="{ 'selected': seat.selected, 'empty': !seat.selected }" @click="toggleSeat(rowIndex, seatIndex)">
              {{ String.fromCharCode(65 + rowIndex) }}{{ seatIndex + 1 }}
            </div>
          </div>
        </div>
        <div class="screen">
          <div class="screen-content">Pantalla</div>
        </div>
      </div>
      <button @click="confirmSelection">Confirmar Selección</button>
    </div>
  </template>
  
  <script>
  export default {
    props: ['movieTitle'],
    data() {
      return {
        totalRows: 11, // cantidad de filas
        seatsPerRow: 13, // cantidad de hacientos x fila
        seatRows: []
      };
    },
    created() {
      // Generar disposición inicial de los asientos
      this.generateSeats();
    },
    methods: {
      generateSeats() {
        for (let row = 0; row < this.totalRows; row++) {
          const seats = [];
          for (let seat = 0; seat < this.seatsPerRow; seat++) {
            seats.push({ selected: false });
          }
          this.seatRows.push({ rowNumber: row, seats });
        }
      },
      toggleSeat(rowIndex, seatIndex) {
        this.seatRows[rowIndex].seats[seatIndex].selected = !this.seatRows[rowIndex].seats[seatIndex].selected;
      },
      confirmSelection() {
              // Confirmar selección y mostrar asientos seleccionados en la consola
        const selectedSeats = [];
  
        this.seatRows.forEach(row => {
          row.seats.forEach((seat, seatIndex) => {
            if (seat.selected) {
              selectedSeats.push({ row: String.fromCharCode(65 + row.rowNumber), seat: seatIndex + 1 });
            }
          });
        });
  
        console.log('Asientos seleccionados:', selectedSeats);
      }
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
  </style>
  