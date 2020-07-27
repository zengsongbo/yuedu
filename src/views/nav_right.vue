<template>
  <div class="aside">
    <p class="title">&nbsp; {{title}}频道TOP10</p>
    <ul>
      <li v-for="(list,index) in this.text" :key="index">
        <router-link :to="'detail/'+list.id">
          <p class="p_title">{{list.title}}</p>
          <p class="little">
            <span>文：{{list.author}}</span>
            <span>主播：{{list.podcast}}</span>
          </p>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      text: [],
      title: null
    };
  },
  created() {
    this.getData(this.$route.params.id);
  },
  methods: {
    getData(i) {
      this.text = [];
      this.axios
        .get("http://localhost:3000/api/articles/" + i + "/top10")
        .then(res => {
          this.text.push(...res.data.res.articles);
          this.title = res.data.res.type;
        });
    }
  },
  watch: {
    $route() {
      this.getData(this.$route.params.id);
    }
  }
};
</script>

<style scoped>
.little {
  font-size: 12px;
  margin-top: 5px;
}
.little span {
  margin-right: 20px;
}
.aside {
  width: 380px;
  background-color: #fff;
  float: right;
  box-sizing: border-box;
  padding: 20px;
}
li a{
  text-decoration: none;
  color: #000;
}
li {
  list-style: none;
  padding: 10px;
  border-bottom: 1px solid rgb(196, 194, 194);
}
li:hover .p_title {
  color: red;
}
.title {
  font-weight: bolder;
  margin-bottom: 20px;
}
.title::before {
  content: "";
  display: inline-block;
  width: 5px;
  height: 20px;
  background-color: red;
  vertical-align: middle;
  border-radius: 2px;
}
</style>