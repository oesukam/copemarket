<template>
  <div>
    <Header />
    <div class="container mx-auto bg-red">

      <div class="flex">
        <div class="w-2/3 bg-blue">
          <Swiper
            @clicked="posterClicked"
            :items="posters"
            :index.sync="posterIndex"
            styles="background-color: red;" maxHeight="80vh"
          />
          <Swiper
            @clicked="thumbClicked"
            :items="posters"
            :index.sync="thumbIndex"
            :swiperOption="swiperOptionThumbs"
            maxHeight="20vh"
            styles="padding: 10px 0px;"
            border="2px solid rgba(0,0,0,0.4);"
          />
        </div>
        <div class="w-1/3 bg-orange">
        ooo
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapActions } from 'vuex'
  import Header from '~/components/PageHeader.vue'
  import Swiper from '~/components/Swiper.vue'
  export default {
    validate ({ params }) {
      return /^\S+$/.test(params.id)
    },
    components: {
      Header,
      Swiper
    },
    data() {
      return {
        poster: require('~/assets/svg/product.svg'),
        posterIndex: 0,
        thumbIndex: 0,
        posters: [
          require('~/assets/svg/product.svg'),
          require('~/assets/images/animals.jpg'),
          require('~/assets/images/animals.jpg'),
          require('~/assets/images/logo-grey.png'),
          require('~/assets/images/animals.jpg'),
          require('~/assets/images/logo-white.png'),
          require('~/assets/images/animals.jpg'),
        ],
        swiperOptionTop: {
          zoom: {
            maxRatio: 5,
          },
          spaceBetween: 10,
          loop: true,
          loopedSlides: 5, //looped slides should be the same
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
          }
        },
        swiperOptionThumbs: {
          spaceBetween: 10,
          slidesPerView: 4,
          touchRatio: 0.2,
          // direction: 'vertical',
          // loop: true,
          loopedSlides: 5, //looped slides should be the same
          slideToClickedSlide: true,

        }
      }
    },
    methods: {
      ...mapActions([
        'getProduct'
      ]),
      posterClicked(index) {
        this.thumbIndex = index
      },
      thumbClicked(index) {
        this.posterIndex = index
      }
    },
    mounted() {
      this.$nextTick(() => {
        // const swiperPoster = this.swiperPoster
        // const swiperThumbs = this.swiperThumbs
        // console.log(this.swiperPoster.controller)
        // swiperPoster.controller.control = swiperThumbs
        // swiperThumbs.controller.control = swiperPoster
      })
    },
    created() {
      console.log('yeah', this.$route, this.id)
    }
  }
</script>

<style scoped>
  .poster {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .gallery-top {
    max-height: 80vh;
    width: 100%;
  }
  .gallery-thumbs {
    height: 20%!important;
    box-sizing: border-box;
    padding: 10px 0;
    display: flex;
  }
   .swiper-slide {
    background-size: cover;
    background-position: center;
    position: relative;
    overflow: hidden;
    height: 100%;
   }
   .gallery-thumbs {
     background-color: #fff;
     border: 1px solid rgba(0,0,0,0.2);
     overflow-y: scroll; /* has to be scroll, not auto */
    -webkit-overflow-scrolling: touch;
   }
  .gallery-thumbs .swiper-slide {
    width: 25%;
    height: 100%;
    opacity: 0.4;
  }
  .gallery-thumbs .swiper-slide-active {
    opacity: 1;
  }
  .thumb {
    width: 100%;
  }
</style>
