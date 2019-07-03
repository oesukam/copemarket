<template>
  <div class="flex flex-col items-center">
    <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <div class="mb-4">
        <label class="block text-grey-darker text-sm font-bold mb-2" for="username">
          Numéro de Téléphone
        </label>
        <div class="flex">
          <div class="flex items-center text-grey-darker pr-2">(+243)</div>
          <the-mask
            mask="##-###-#####"
            :value="phone"
            @input="handeInput"
            type="tel"
            placeholder="##-###-####"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker leading-tight"
            >
          </the-mask>
        </div>
      </div>
      <div class="mb-6">
        <label class="block text-grey-darker text-sm font-bold mb-2" for="password">
          Mot de Passe
        </label>
         <input
            v-model="password"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker leading-tight"
            id="password"
            type="password"
            placeholder="*************">
        <p class="text-red text-xs italic mt-4 text-center">Veuillez choisir un mot de passe</p>
      </div>
      <div class="flex flex-col justify-center items-center justify-between">
        <button class="bg-blue hover:bg-blue-dark w-full text-white font-bold py-2 px-4 rounded" type="button">
          Se connecter
        </button>
        <a class="inline-block mt-4 text-center align-baseline w-full font-bold text-sm text-blue hover:text-blue-darker" href="#">
          Mot de passe oublié?
        </a>
      </div>
    </form>
    <p class="text-center text-grey text-xs">
      ©2018 Cope.
    </p>
  </div>
</template>

<script>
  import inputCode from '~/components/inputCode'
  import {TheMask} from 'vue-the-mask'
  export default {
    components: {
      inputCode,
      TheMask
    },
    data() {
      return {
        errors: [],
        phone: null,
        password: null,
        date: ''
      }
    },
    methods: {
      handeInput(val) {
        console.log(val, 'olivier')
        this.phone = val
      },
      maskCheck: function (field){
        if (field.target.inputmask.isComplete()) {
          console.log('is Complete');
        } else {
          console.log('is Incomplete');
        }
      },
      phoneInput(event) {
        // this.phone = data.replace(/^[^0[80|81|82|84|85|89|97|99]\d{7}]/, '')
        console.log(event, 'pppp')
        // return this.data
      },
      checkForm: function (e) {
        if (this.validPhone(this.phone) && this.password) {
          return true
        }

        this.errors = []

        if (!this.phone) {
          this.errors.push('Numéro de Téléphone obligatoire.')
        }
        if (!this.password) {
          this.errors.push('Mot de Passe obligatoire.')
        }

        e.preventDefault();
      },
      validPhone: function (phone) {
        var re = /^0[80|81|82|84|85|89|97|99]\d{7}/g
        return re.test(phone)
      }
    }
  }
</script>

<style scoped>

</style>
