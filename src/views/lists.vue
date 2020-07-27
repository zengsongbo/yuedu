<template>
  <div class="lists">
    <router-link v-for="(text,index) in text" :key="index" :to="'detail/'+text.id">
      <div class="list">
        <img src="../assets/yellow.jpg" alt />
        <div class="text">
          <p class="title">{{text.title}}</p>
          <p class="about">
            <span class="writer">
              <i class="el-icon-edit"></i>
              {{text.author}}
            </span>
            <span class="reader">
              <i class="el-icon-microphone"></i>
              {{text.podcast}}
            </span>
            <span class="time">
              <i class="el-icon-time"></i>
              {{text.created_time}}
            </span>
            <span class="num">
              <i class="el-icon-headset"></i>
              {{text.play_time}}
            </span>
          </p>
          <div class="txt" v-html="text.content"></div>
        </div>
      </div>
    </router-link>
    <ul class="page">
      <li v-for="i in 7" :key="i" @click="tabPage(i)" :class="{active:num==i}">{{i}}</li>
      <li class="next">下一页</li>
    </ul>
  </div>
</template>
<script>
export default {
  data() {
    return {
      text: [],
      num: 1
    };
  },
  created() {
    this.getData(this.$route.params.id);
  },

  methods: {
    getData(i) {
      this.num = 1;
      this.text = [];
      this.axios
        .get("http://localhost:3000/api/articles/" + i + "/page/1")
        .then(res => {
          this.text.push(...res.data.res.articles);
        });
    },
    tabPage(i) {
      this.num = i;
      this.text = [];
      this.axios
        .get(
          "http://localhost:3000/api/articles/" +
            this.$route.params.id +
            "/page/" +
            i
        )
        .then(res => {
          this.text.push(...res.data.res.articles);
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
.active {
  color: red;
}
.page {
  width: 400px;
  margin: auto;
}
.page li {
  list-style: none;
  float: left;
  width: 20px;
  height: 20px;
  line-height: 20px;
  margin-bottom: 20px;
  border: 1px solid #999;
  text-align: center;
  padding: 10px;
  border-right: none;
}
li.next {
  width: 60px;
  border-right: 1px solid #999;
}
* {
  margin: 0;
  padding: 0;
}
.lists {
  float: left;
}
.list {
  width: 600px;
  height: 180px;
  margin-bottom: 20px;
  background-color: #fff;
  color: #000;
}
.list:hover .title {
  color: red;
}
img {
  width: 40%;
  height: 100%;
  float: left;
}
.txt {
  overflow: hidden;
  height: 40px;
  line-height: 20px;
}
.title {
  font-size: 20px;
}
.text {
  width: 60%;
  float: right;
  padding-top: 20px;
  padding-left: 10px;
  box-sizing: border-box;
}
.about {
  margin: 10px 0;
}
.about span {
  margin-right: 15px;
  font-size: 13px;
}
</style>