<template>
  <b-modal
  :hide-footer="true"
    id="modalright"
    ref="modalright"
    :title="opcion"
    modal-class="modal-right"
  >
   <b-form @submit="onSubmit"  >

      <b-form-group id="input-group-2" label="Nombre tipo:" label-for="input-2">
        <b-form-input
          id="input-2"
          v-model="newItem.title"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-4" >
      
        <b-form-radio-group
            stacked
            class="pt-2"
            :options="statuses"
            v-model="newItem.status"
          />
      </b-form-group>

      <b-button type="submit"   variant="outline-primary">Guardar</b-button>
      <b-button  variant="outline-danger" @click="hideModal('modalright')">{{
        $t("pages.cancel")
      }}</b-button>
    </b-form>

  
  </b-modal>
</template>
<script>
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
export default {
  components: {
    "v-select": vSelect,
  },
  props: ["categories", "statuses","opcion","nombre"],
  data() {
    return {
      newItem: {
        title: "",
        status: true,
      },
    };
  },
  methods: {
    onSubmit(event) {
        event.preventDefault()
       if(event){
          console.log("guardado" ,this.newItem.title);
          this.hideModal('modalright');
       }
      },
    addNewItem() {
      console.log("adding item : ", this.newItem);
    },
    hideModal(refname) {
      this.$refs[refname].hide();
      this.newItem.title="";
      this.newItem.status=true;
    },
  },
};
</script>

