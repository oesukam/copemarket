<template>
  <div
    v-swiper:mySwiper="swiperOption || swiperOptionDefault"
    class="gallery-container"
    :style="styles"
    >
    <div
      class="swiper-wrapper">
      <div
        class="swiper-slide"
        v-for="(item, index) in items"
        :key="index"
        @click.prevent="slideClicked(index)"
        :style="'width:' + width +';height: ' + height +';max-width:' + maxWidth +';max-height: ' + maxHeight +';'+';border: ' + border +';'">

        <img :src="item" class="poster">
      </div>
    </div>
    <div v-if="nav" class="swiper-button-next swiper-button-white" slot="button-next"></div>
    <div v-if="nav" class="swiper-button-prev swiper-button-white" slot="button-prev"></div>
  </div>
</template>

<script>
  export default {
    props: {
      index: {
        type: [String, Number],
        default: '0'
      },
      swiperOption: {
        type: Object,
      },
      items: {
        type: Array,
      },
      nav: {
        type: Boolean,
        default: false
      },
      styles: {
        type: String,
        default: 'background-color: #fff;'
      },
      width: {
        type: String,
        default: 'auto'
      },
      border: {
        type: String,
        default: ''
      },
      height: {
        type: String,
        default: 'auto'
      },
      maxWidth: {
        type: String,
        default: 'auto'
      },
      maxHeight: {
        type: String,
        default: 'auto'
      },
    },
    data() {
      return {
        swiperOptionDefault: {
          effect: 'fade',
          fadeEffect: {
            crossFade: true
          },
          zoom: {
            maxRatio: 5,
          },
          spaceBetween: 10,
          // loop: true,
          loopedSlides: 5, //looped slides should be the same
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
          }
        },
      }
    },
    watch: {
      index(newVal, oldVal) {
        console.log(newVal, 'old', oldVal)
        this.mySwiper.slideTo(newVal)
      }
    },
    methods: {
      slideClicked(index = 0) {
        this.$emit('clicked', index)
      }
    }
  }
</script>

<style scoped>
 .poster {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
</style>
