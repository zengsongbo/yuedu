<template>
  <div>
    <div style="overflow:hidden">
      <div class="center">
        <div class="top">
          <p class="title">{{content.title}}</p>
          <p class="about">
            <span class="writer">
              <i class="el-icon-edit"></i>
              {{content.author}}
            </span>
            <span class="reader">
              <i class="el-icon-phone-outline"></i>
              {{content.podcast}}
            </span>
            <span class="time">
              <i class="el-icon-time"></i>
              {{content.duration}}
            </span>
            <span class="num">
              播放
              <span class="num_add">{{content.count}}</span> 次
            </span>
          </p>
          <div class="mp3">
            <audio src="../assets/I Wish - Tom MacDonald.mp3" controls></audio>
          </div>
        </div>

        <div class="content off" id="content">
          <div v-html="content.content">{{content.content}}</div>
        </div>
        <p class="open alert" @click="_open" v-if="this.open">
          展开全文
          <i class="el-icon-arrow-down"></i>
        </p>
        <p class="off alert" @click="_off" v-if="this.off">
          收起
          <i class="el-icon-arrow-up"></i>
        </p>
        <div class="bottom fl">
          <span class="fw">标签：</span>
          <span>{{content.labels}}</span>
          <span class="img fr">
            <img src="../assets/wx.svg" alt />
            <img src="../assets/db.svg" alt />
            <img src="../assets/qq.svg" alt />
            <img src="../assets/wb.svg" alt />
          </span>
        </div>
        <div class="bottom_2">
          <span class="fl hover_color">
            <router-link :to="'../detail/'+topNum">
              <i class="el-icon-arrow-left"></i> 上一篇
            </router-link>
          </span>
          <span class="fr hover_color">
            <router-link :to="'../detail/'+topNum2">
              下一篇
              <i class="el-icon-arrow-right"></i>
            </router-link>
          </span>
        </div>
        <div class="bottom_3">
          <p>
            <input type="text" placeholder="说点什么吧" v-model="text" />
            <button @click="sentText">评论</button>
          </p>
          <span class="new_talk">最新评论（{{list_length}}）</span>
          <ul class="talk_lists">
            <li
              class="talk_list"
              :class="{'_style':styleNum==0}"
              v-for="(list,index) in this.text_list"
              :key="index"
            >
              <span class="list_content">
                {{list.content}}
                <span
                  class="_del"
                  @click="_del(list.id)"
                  v-if="list.nikiname==userName"
                >删除</span>
              </span>
              <span class="list_time">{{list.reply_time}}</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="fr right">
        <div class="right_1">
          <div class="right_top">
            <img src="../assets/yellow.jpg" width="100px" />
            <div class="right_center">
              <p class="name">
                {{content.podcast}}
                <i class="el-icon-microphone"></i>
              </p>
              <p class="works">作品：7</p>
              <p class="fans">粉丝数：91</p>
              <p class="_red">关注</p>
            </div>
          </div>
          <p class="right_bottom">
            <span class="btn">
              <i class="iconfont icon-nice" @click="nice" :class="{'color':color==true}"></i>
            </span>
            {{length_nice}}
            <span class="btn">
              <i class="iconfont icon-zan"></i>
            </span>0
            <span class="btn">
              <i class="iconfont icon-dashang"></i>
            </span>0
          </p>
        </div>
        <div class="right_2">
          <p class="title_l">
            &nbsp; 其他相关节目
            <span class="el-icon-arrow-right fr jt" @click="_next"></span>
            <span class="el-icon-arrow-left fr jt" @click="_prev"></span>
          </p>
          <div class="right_about">
            <div class="box">
              <span class="left_title" v-for="(text,index) in aboutContent" :key="index">
                <router-link :to="'/detail/'+text.id">{{text.title}}</router-link>
              </span>
            </div>
          </div>
        </div>
        <div class="right_3 fr">
          <p class="title_l">
            &nbsp;{{type}} FM频道其他节目
            <span class="fr all_show">
              <router-link :to="'../'+this.navNum">查看全部</router-link>
              <i class="el-icon-arrow-right"></i>
            </span>
          </p>
          <div class="lists" v-for="(list,index) in right_list" :key="index">
            <router-link :to="'../detail/'+list.id">
              <p class="title_list">{{list.title}}</p>
              <p class="content_list">文：{{list.author}}</p>
            </router-link>
          </div>
        </div>
      </div>
    </div>
    <div class="bottom_last">
      <div class="fl">
        <p>关于我们|加入我们</p>
        <p class="little_font">&copy; 2010-2016 YueDu.fm All rights reserved 粤ICP备14076392号</p>
      </div>
      <div class="fr flex">
        <span class="bottom_o bottom_o_1">捐</span>
        <span class="bottom_o">
          <img src="../assets/wx2.svg" alt />
        </span>
        <span class="bottom_o">
          <img src="../assets/wb2.svg" alt />
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      Alert: true,
      content: {},
      open: null,
      off: null,
      aboutContent: null,
      num: 0,
      type: null,
      right_list: [],
      navNum: localStorage.navNum2,
      topNum: null,
      topNum2: null,
      text: "",
      text_list: [],
      styleNum: null,
      list_length: 0,
      userName: sessionStorage._userName,
      length_nice: 0,
      color: false
    };
  },
  created() {
    //获取点赞数
    this.axios
      .get("http://localhost:3000/api/articles/like", {
        headers: {
          Authorization: `Bearer ${localStorage._token}`
        }
      })
      .then(res => {
        var arr = res.data.res.filter(i => {
          return i.id == this.$route.params.id;
        });
        this.length_nice = arr.length;
        if (arr.length > 0) {
          this.color = true;
        } else {
          this.color = false;
        }
      });
    this.topNum = parseInt(this.$route.params.id) - 1;
    this.topNum2 = parseInt(this.$route.params.id) + 1;
    if (this.topNum < 1) {
      this.topNum = 1025;
    }
    if (this.topNum2 > 1025) {
      this.topNum2 = 1;
    }
    var num = parseInt(localStorage.navNum2);
    this.getList();
    this.axios
      .get("http://localhost:3000/api/articles/" + num + "/page/1")
      .then(res => {
        this.right_list = res.data.res.articles;
      });
    this.axios.get("http://localhost:3000/api/types").then(res => {
      this.type = res.data.res[num - 1].type;
    });
    this.axios
      .get("http://localhost:3000/api/article/" + this.$route.params.id)
      .then(res => {
        this.content = res.data.res;
      });
    this.axios.get("http://localhost:3000/api/articles/rand").then(res => {
      this.aboutContent = res.data.res;
    });
  },
  methods: {
    nice() {
      //点击执行获取点赞数
      this.axios
        .get("http://localhost:3000/api/articles/like", {
          headers: {
            Authorization: `Bearer ${localStorage._token}`
          }
        })
        .then(res => {
          console.log(res.data.res);
          var arr = res.data.res.filter(i => {
            return i.id == this.$route.params.id;
          });
          this.length_nice = arr.length;
          if (
            res.data.res.some(list => {
              return list.id == this.$route.params.id;
            })
          ) {
            //点过赞执行取消点赞
            this.axios
              .delete(
                "http://localhost:3000/api/article/" +
                  this.$route.params.id +
                  "/like",
                {
                  headers: {
                    Authorization: `Bearer ${localStorage._token}`
                  }
                }
              )
              .then(() => {
                this.$router.go(0);
              });
          } else {
            //点赞成功执行
            this.axios
              .post(
                "http://localhost:3000/api/article/" +
                  this.$route.params.id +
                  "/like",
                {},
                {
                  headers: {
                    Authorization: `Bearer ${localStorage._token}`
                  }
                }
              )
              .then(() => {
                this.length_nice = arr.length;
                if (arr.length > 0) {
                  this.color = true;
                  this.$router.go(0);
                } else {
                  this.color = false;
                  this.$router.go(0);
                }
              });
          }
        });
    },

    _del(e) {
      this.axios.delete("http://localhost:3000/api/comment/" + e, {
        headers: {
          Authorization: `Bearer ${localStorage._token}`
        }
      });
      setTimeout(() => {
        this.getList();
      }, 50);
    },
    getList() {
      setTimeout(() => {
        this.axios
          .get(
            "http://localhost:3000/api/comments/" +
              this.$route.params.id +
              "/page/1"
          )
          .then(res => {
            if (res.data.res_code == 400) {
              this.list_length = 0;
              this.text_list = [{ content: res.data.res_msg }];
              this.styleNum = 0;
            } else {
              this.list_length = res.data.res.length;
              this.text_list = res.data.res.reverse();
              this.styleNum = 1;
              this.userName = sessionStorage._userName;
            }
          });
      }, 500);
    },
    sentText() {
      if (sessionStorage._user == 1) {
        alert("请先登录");
      } else {
        if (this.text == "") {
          alert("请输入评论");
        } else {
          this.axios.post(
            "http://localhost:3000/api/comment",
            {
              article_id: this.$route.params.id,
              content: this.text
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage._token}`
              }
            }
          );
          this.getList();
          this.text = "";
        }
      }
    },
    _next() {
      this.num++;
      if (this.num == 5) {
        this.num = 0;
      }
      document.getElementsByClassName("box")[0].style.transform =
        "translateX(" + this.num * -350 + "px)";
    },
    _prev() {
      this.num--;
      if (this.num == -1) {
        this.num = 4;
      }
      document.getElementsByClassName("box")[0].style.transform =
        "translateX(" + this.num * -350 + "px)";
    },
    _open() {
      document.getElementById("content").classList.remove("off");
      this.open = false;
      this.off = true;
    },
    _off() {
      document.getElementById("content").classList.add("off");
      this.open = true;
      this.off = false;
    }
  },

  watch: {
    $route() {
      //获取点赞数
      this.axios
        .get("http://localhost:3000/api/articles/like", {
          headers: {
            Authorization: `Bearer ${localStorage._token}`
          }
        })
        .then(res => {
          var arr = res.data.res.filter(i => {
            return i.id == this.$route.params.id;
          });
          this.length_nice = arr.length;
          if (arr.length > 0) {
            this.color = true;
            this.$router.go(0);
          } else {
            this.color = false;
            this.$router.go(0);
          }
        });
      this.getList();
      this._off();
      this.topNum = parseInt(this.$route.params.id) - 1;
      this.topNum2 = parseInt(this.$route.params.id) + 1;
      if (this.topNum < 1) {
        this.topNum = 1025;
      }
      if (this.topNum2 > 1025) {
        this.topNum2 = 1;
      }
      this.axios
        .get("http://localhost:3000/api/article/" + this.$route.params.id)
        .then(res => {
          this.content = res.data.res;
        });
    }
  },
  mounted() {
    setTimeout(() => {
      if (document.getElementById("content").offsetHeight > 270) {
        this.open = true;
      }
    }, 500);
  }
};
</script>

<style scoped>
._del {
  font-size: 12px;
  margin-left: 20px;
  color: red;
  cursor: pointer;
}
.list_content {
  display: inline-block;
  width: 80%;
}
.list_time {
  position: absolute;
  vertical-align: bottom;
  float: right;
  font-size: 12px;
  bottom: 10px;
  right: 0;
}
.talk_lists {
  font-size: 14px;
  padding: 20px;
  list-style: none;
}
.talk_list {
  position: relative;
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #999;
  word-wrap: break-word;
}

.flex {
  display: flex;
  align-items: center;
}
._style {
  text-align: center !important;
  border: none !important;
}
.bottom_o {
  margin-right: 20px;
  width: 40px;
  height: 40px;
  text-align: center;
  line-height: 40px;
}
.bottom_o img {
  width: 100%;
  height: 100%;
  vertical-align: middle;
}
.bottom_o_1 {
  font-size: 25px;
  border: 2px solid #000;
  border-radius: 50%;
  width: 35px;
  height: 35px;
  line-height: 35px;
}
.little_font {
  font-size: 12px;
  color: #999;
  margin-top: 10px;
}
.bottom_last {
  font-size: 14px;
  overflow: hidden;
  margin: 100px 0 20px;
}
p.title_list {
  margin: 0;
}
.lists {
  font-size: 14px;
  margin-top: 10px;
}

.talk_lists {
  box-sizing: border-box;
  text-align: center;
  background-color: #fff;
  width: 600px;
}
.new_talk {
  display: inline-block;
  color: red;
  background-color: #fff;
  padding: 10px 10px 10px 20px;
  margin-top: 20px;
}
.img img {
  width: 20px;
  height: 20px;
  margin-left: 5px;
}
.bottom_2 i.el-icon-arrow-right {
  margin-right: 0;
}

.bottom_3 {
  margin-bottom: 20px;
  overflow: hidden;
  margin-top: 20px;
  width: 600px;
}
.bottom_3 input {
  padding-left: 20px;
  width: 85%;
  box-sizing: border-box;
}
.bottom_3 input,
.bottom_3 button {
  height: 50px;
  border: none;
  vertical-align: middle;
  outline: none;
}
.bottom_3 button {
  width: 15%;
  color: #fff;
  background-color: red;
}
.bottom_2,
.bottom {
  margin-bottom: 20px;
  overflow: hidden;
  background-color: #fff;
  margin-top: 20px;
  width: 560px;
  padding: 10px 20px;
}

.fw {
  font-weight: bolder;
}
.right {
  width: 350px;
}
.title_list {
  margin: 10px 0;
}
.all_show {
  font-size: 13px;
  font-weight: lighter;
}

a {
  color: #000;
  text-decoration: none;
}
.box {
  transition: all 0.5s;
  width: 1750px;
}
.color,
.hover_color:hover a,
.left_title a:hover,
.lists:hover p.title_list,
.all_show:hover,
.all_show:hover a,
.jt:hover {
  color: red;
}
.right_about {
  height: 77px;
  overflow: hidden;
}

.left_title {
  font-size: 14px;
  width: 150px;
  margin-right: 25px;
  line-height: 20px;
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 10px;
}

.el-icon-arrow-right {
  margin-right: 55px;
}
.fl {
  float: left;
}
.fr {
  float: right;
}
.right_bottom {
  color: #999;
}
.title_l {
  font-weight: bolder;
  margin-bottom: 20px;
}
.right_3,
.right_2 {
  margin-top: 20px;
  width: 350px;
  float: right;
  padding: 20px 0 20px 20px;
  background-color: #fff;
}
.title_l::before {
  content: "";
  display: inline-block;
  width: 5px;
  height: 20px;
  background-color: red;
  vertical-align: middle;
  border-radius: 2px;
}
.right_bottom {
  text-align: center;
}
.works,
.fans {
  font-size: 14px;
}
.name {
  font-size: 20px;
  margin-bottom: 10px;
}
._red {
  width: 70px;
  height: 30px;
  background-color: red;
  color: #fff;
  text-align: center;
  line-height: 30px;
  position: absolute;
  right: 50px;
  top: 40px;
}
.right_top {
  overflow: hidden;
  position: relative;
  padding-bottom: 10px;
}
img {
  width: 100px;
  height: 80px;
}
.right_center {
  width: 240px;
  margin-left: 10px;
}
img,
.right_center {
  float: left;
}
.btn {
  line-height: 40px;
  text-align: center;
  display: inline-block;
  color: #999;
  width: 40px;
  height: 40px;
  border: 1px solid #999;
  border-radius: 50%;
  margin: 20px 10px 0 20px;
}
.btn:first-child {
  margin-left: 0;
}
.iconfont {
  font-size: 25px;
}
.right_1 {
  padding: 20px 0 15px 20px;
  background-color: #fff;
  width: 350px;
  float: right;
  overflow: hidden;
}
.top {
  background-color: #fff;
  padding: 20px;
  padding-bottom: 0;
}

.alert {
  text-align: right;
  font-size: 14px;
  background-color: #fff;
  padding: 15px 15px 15px 0;
}
* {
  margin: 0;
  padding: 0;
}
.content {
  font-size: 14px;
  text-indent: 2em;
  line-height: 2em;
  letter-spacing: 1px;
  padding: 20px;
  background-color: #fff;
  margin-top: 20px;
}
.off {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 10;
  -webkit-box-orient: vertical;
}
audio {
  width: 100%;
  margin-bottom: 35px;
}
audio:focus {
  outline: none;
}
.center {
  float: left;
  width: 600px;
  box-sizing: border-box;
}
.title {
  font-size: 20px;
}
.about {
  font-size: 12px;
  margin: 10px 0 35px 0;
  overflow: hidden;
  line-height: 20px;
}
.num {
  float: right;
}
.num_add {
  font-size: 20px;
}
</style>