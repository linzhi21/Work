<template>
  <div id="app"  v-loading="user.uploadLoading" :element-loading-text="user.loadingText"  element-loading-background="rgba(0, 0, 0, 0.8)">
    <router-view/>
  </div>
</template>

<script>
  import {mapState,mapMutations} from 'vuex';
export default {
  name: 'App',
  computed:{
    ...mapState(['user'])
  }
}
</script>

<style>


</style>
