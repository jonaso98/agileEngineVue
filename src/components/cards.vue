/* eslint-disable prettier/prettier */
<template>
  <v-card class="my-v-card" @click="emitThis(datoshere.row.id)">
    <v-card-text class="text-center">
      <img :src="datoshere.row.cropped_picture" />
    </v-card-text>
    <separator />
  </v-card>
</template>
<script>
export default {
  props: ["datoshere"],
  data() {
    return {
      slide: 1,
      fullHeight: false,
    };
  },
  mounted() {
    console.log(" entro mounted ", this.datoshere);
  },
  methods: {
    emitThis(val) {
      this.$emit("openCarrusel", val);
    },
  },
};
</script>
