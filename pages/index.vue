<template>
  <section class="container mx-auto">
    <popular-categories />
    <latest-products />
  </section>
</template>

<script>
import { mapGetters } from 'vuex'
import PopularCategories from '~/components/categories/PopularCategories.vue'
import LatestProducts from '~/components/products/LatestProducts'

export default {
  components: {
    PopularCategories,
    LatestProducts,
  },
  computed: {
    ...mapGetters([
      'getAuthModel'
    ])
  }

}
</script>

<style>
body {
  background-color: #f6f6f6;
}
.title
{
  font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; /* 1 */
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}
.subtitle
{
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}
.links
{
  padding-top: 15px;
}
</style>
