<template>
  <div class="w-full xl:w-1/4 lg:w-1/3 md:w-1/2 p-2 block">
    <div class="item-block">
      <img class="item-poster" :src="defaultImg">
      <div class="item-content p-4">
        <nuxt-link :id="item._id" :to="'/products/' +item._id" class="item-title">{{item.title}}</nuxt-link>
        <div class="item-price">{{item.price}} {{item.currency}}</div>
        <div class="item-city" v-if="item.city">
          <i class="fa fa-map-marker pr-2"></i>{{item.city.name}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      item: ''
    },
    data() {
      return {
        defaultImg: require('~/assets/svg/product.svg') || 'https://picsum.photos/200/300/?random'
      }
    }
  }
</script>

<style scoped>
  .item-block {
    background-color: #fff;
    border-radius: 5px;
    overflow: hidden;
  }
  .item-poster, .item-title, .item-price {
    cursor: pointer;
    text-decoration: none;
  }
  .item-poster {
    object-fit: cover;
    width: 100%;
    height: 30vh;
    min-height: 200px;
  }
  .item-title {
    line-height: 1rem;
    font-size: 1.2rem;
    height: 2rem;
    overflow: hidden;
    text-overflow: ellipsis;
    color: rgba(0,0,0,0.8);
  }
  .item-price {
    color: #da0303;
    padding: 5px 0px;
    font-size: 1.3rem;
  }
  .item-city {
    font-size: 1rem;
    color: rgba(0,0,0,0.8);
  }
</style>
