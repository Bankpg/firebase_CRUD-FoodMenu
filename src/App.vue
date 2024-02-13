<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Footer from './components/Footer.vue'
</script>

<template>
  <v-parallax
    src='https://m.media-amazon.com/images/I/91RctUDDqML.png' cover>
    <v-container class="rounded-xl mx-auto"  style="background-color: rgba(78, 78, 78, 0.415); backdrop-filter: blur(20px); height: fit-content; display: flex;">
      <router-view></router-view>
    </v-container>
    <Footer></Footer>
  </v-parallax>
</template>

