<template>
  <div class="w-full w-full xl:w-1/4 lg:w-1/3 md:w-1/2 p-2 block">
    <div class="bg-white p-3 w-full h-full">
      <div class="w-full text-xl">{{item.name}}</div>
      <div class="w-full">
        <ul>
          <li v-for="(cat, index) in item.subs" :key="index">{{cat.name}}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      item: ''
    }

  }
</script>

<style scoped>
  ul {
    list-style: none;
    padding-left: 15px;
  }
  li {
    margin-top: 5px;
  }
</style>
