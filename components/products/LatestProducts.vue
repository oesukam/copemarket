<template>
  <div class="">
    <div class="p-2">
      <h2 class="text-3xl text-grey">Produits à Vendre</h2>
    </div>
    <div class="flex flex-wrap content-strecth">
      <product-card v-for="(item, index) in products.data" :key="index" :item="item"></product-card>
    </div>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import { request } from 'graphql-request'
  import productCard from './productCard.vue'
  export default {
    components: {
      productCard,
    },
    computed: {
      ...mapGetters({
        products: 'getProductsLatest',
      })
    },
    methods: {
      ...mapActions([
        'fetchProductsLatest'
      ])
    },
    mounted() {
      this.fetchProductsLatest()
    },
  }
</script>

<style scoped>

</style>
