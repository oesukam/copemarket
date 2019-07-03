<template>
  <div id="auth-container">
    <div class="auth-wrapper">
      <button class="float-right">
        <img @click.prevent="closeModel" class="btn-close" src="~/assets/svg/close.svg" alt="Close button">
      </button>
      <img class="auth-logo" src="~/assets/images/logo-grey.png" alt="logo">
      <login />
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'
import Login from './login'
export default {
  components: {
    Login
  },
  methods: {
    ...mapMutations([
      'SET_AUTH_MODEL',
    ]),
    closeModel() {
      this.SET_AUTH_MODEL()
    }
  }
}
</script>

<style scoped>
  #auth-container {
    position: fixed;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    background-color: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  .auth-wrapper {
    min-height: 500px;
    width: 400px;
    max-width: 80%;
    background-color: #fff;
    padding: 10px;
  }
  .auth-logo {
    height: 5rem;
    max-height: 120px;
    margin: 20px auto;
    position: relative;
    display: block;
  }
  .login {
    min-height: 400px;
    min-width: 400px;
  }
  .btn-close {
    padding: 5px;
    height: 40px;
    width: 40px;
  }

</style>
