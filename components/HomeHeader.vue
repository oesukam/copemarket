<template>
<div class="top-header">
  <nav class="flex items-center justify-between flex-wrap p-6">
    <div class="container flex mx-auto">
      <nuxt-link to="/" class="flex items-center flex-no-shrink text-white mr-6">
        <img class="fill-current h-8 w-8 mr-2" width="54" height="54" src="~/assets/images/logo-white.png" />
        <span class="font-semibold text-xl tracking-tight">Annonces gratuites</span>
      </nuxt-link>
      <div class="block lg:hidden">
        <button class="flex items-center px-3 py-2 border rounded text-teal-lighter border-teal-light hover:text-white hover:border-white">
          <svg class="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Menu</title><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/></svg>
        </button>
      </div>
      <div class="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
        <div class="text-sm lg:flex-grow" />
        <div class="float-right">
          <button v-if="isAuth" @click.prevent="auth" class="btn-login">Mon Compte</button>
          <nuxt-link v-else class="btn-login" to="/compte">Se Connecter</nuxt-link>
        </div>
      </div>
    </div>
  </nav>
  <div class="container mx-auto">
    <div class="flex flex-wrap justify-center">
      <div class="lg:w-5/6 p-8">
        <p class="text-4xl text-white py-4">Trouvez ce que vous cherchez, au prix que vous voulez</p>
        <div class="search-container">
          <div class="input-container">
            <i class="fa fa-map-marker input-icon"></i>
            <input id="location" class="transition " type="text" placeholder="Ville ou Province" spellcheck="false" >
          </div>
          <div class="input-container flex-1" >
            <input id="search" class="transition " type="text" placeholder="Que cherchez-vous?" spellcheck="false" role="combobox" >
            <button class=""><i class="fa fa-search input-icon"></i></button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
  import { mapGetters } from 'vuex'
  export default {
    computed: {
      ...mapGetters([
        'isAuth'
      ])
    },
    methods: {
      auth() {
        this.$store.commit('SET_AUTH_MODEL', true)
      }
    }
  }
</script>

<style scoped>
  .top-header {
    background-origin: center bottom;
    background-size: cover;
    background-image: linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0.3), rgba(0,0,0,0.7)),url('~/assets/images/bg-header.jpg');
  }
  .btn-login {
    color: #fff;
    text-transform: none;
    text-decoration: #fff;
    font-size: 1.3rem;
    font-weight: 600;
  }
  .intro-text {

  }
  .search-container {
    display: flex;
  }
  .input-container {
    display: flex;
    align-items: center;
    background-color: #fff;
    border: 1px solid rgba(0,0,0,0.2);
  }

  #search, #location {
    height: 100%;
  }
  #search {
    padding: 10px;
    width: 100%;
  }
  input {
    outline: none;
    border: none;
  }
  .input-icon {
    color: #555;
    font-size: 1.4rem;
    padding: 10px;
  }
</style>
