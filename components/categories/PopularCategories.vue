<template>
  <div class="">
    <div class="p-2">
      <h2 class="text-3xl text-grey">Catégories populaires</h2>
    </div>
    <div class="flex flex-wrap content-strecth">
      <cat-card v-for="(item, index) in categories" :key="index" :item="item"></cat-card>
    </div>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import { request } from 'graphql-request'
  import catCard from './categoryCard.vue'
  export default {
    components: {
      catCard,
    },
    computed: {
      ...mapGetters({
        cities: 'getCities',
        categories: 'getCategories'
      })
    },
    methods: {
      ...mapActions([
        'fetchMocks'
      ])
    },
    mounted() {
      this.$store.dispatch('fetchMocks')
    },
  }
</script>

<style scoped>

</style>
