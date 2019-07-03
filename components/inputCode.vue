<template>
  <div class="input-container">
    incput code
    <input ref="input_code" type="text" @keydown="keyDown" v-model="number">
  </div>
</template>

<script>
  export default {
    data() {
      return {
        number: ''
      }
    },
    methods: {
      keyDown({ key = ''}) {
        var reg = /^0[89]{0,1}[0124579]{0,1}\d{0,7}/
        let text = this.number + key
        if (reg.test(text)) {
          console.log('olivier', text)
          this.phone = text
        } else {
          console.log('ooooo')
          this.phone
          return this.phone
        }
      },
      blurInput() {
        this.zIndex = -10;
      },
      /** 获得焦点 */
      focusInput() {
        this.zIndex = 10;
        this.$refs.input_code.focus();
      }
    },
    mounted() {
      console.log('yeahd')
    },
  }
</script>

<style scoped>
  .input-container {
    background-color: red;
    width: 100%;
  }
</style>
