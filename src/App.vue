<template>
  <div id="app">
    <navTop></navTop>
    <Content></Content>
  </div>
</template>
<style>
* {
  margin: 0;
  padding: 0;
}


</style>

<script>
import navTop from './components/nav_top'
import Content from './components/content'
export default {
  components:{
    navTop,
    Content
    }
}
</script>


