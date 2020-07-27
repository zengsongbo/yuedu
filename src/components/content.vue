<template>
  <div class="content">
    <router-view name="lists"></router-view>
    <router-view name="navRight"></router-view>
    <router-view name="detail"></router-view>
  </div>
</template>
<style scoped>
* {
  margin: 0;
  padding: 0;
}
.content {
  width: 1000px;
  margin: auto;
  overflow: hidden;
}
</style>