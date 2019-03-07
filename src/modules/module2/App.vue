<template>
  <div id="app" class="">
    <router-view />
  </div>
</template>

<script>
  export default {
    name: "app",
    components: {

    },
    data() {
      return {

      };
    },
    methods: {

    },
    watch: {

    }
  }

</script>

<style lang="less">
  body {
    overflow-y: auto;
    font-family: Roboto !important;
  }

  html {
    padding: 0;
  }

  ::-webkit-scrollbar {
    width: 10px;
  }

  ::-webkit-scrollbar-track {
    background: #EEEEEE;
  }

  ::-webkit-scrollbar-thumb {
    background: #ddd;
    border: 1px solid #ccc;
    box-shadow: inset 1px 0 0 rgba(AA, 0, 0, 0.4);
  }

  #app {
    min-height: ~"calc(100vh - 10px)";
    background-color: white;
  }

  .section {
    width: 100%;
    margin-bottom: 10px !important;
    background: white;
  }

</style>
