<template>
  <div class="nav_all">
    <div class="all_bg">
      <div class="top">
        <div class="nav fl">
          <div class="logo fl">
            <span class="s befor_h"></span>
            <span class="m befor_h"></span>
            <span class="s befor_h"></span>
            阅读FM
          </div>
          <div class="nav_list fr">
            <el-tag v-for="(types,index) in this.types" :key="index" @click="changeNavNum(index)">
              <router-link :to="'/'+types.id" :class="{'active':num==index}">{{types.type}}</router-link>
            </el-tag>
          </div>
        </div>
        <div class="serch fr" v-if="user==0">
          <input type="text" />
          <span>{{username}}</span>
          <span @click="_off_user">退出</span>
        </div>
        <div class="serch fr" v-if="user==1">
          <input type="text" />
          <span class="register1" @click="_show_sign1">登录</span>
          <span class="register2" @click="_show_sign2">注册</span>
        </div>
      </div>
    </div>
    <div class="sign_box" v-if="showNum1!=0">
      <transition
        enter-active-class="slide-in-left"
        enter-class="slide-in-left"
        enter-to-class="slide-in-left"
        leave-active-class="slide-out-right"
        leave-class="slide-out-right"
        leave-to-class="slide-out-right"
      >
        <div class="sign_in sign" v-if="showNum==1">
          <span class="off" @click="_off_sign">
            <i class="el-icon-close"></i>
          </span>
          <p class="title">注册</p>
          <input type="text" class="input" placeholder="昵称" v-model="signInData.username" />
          <input type="email" class="input" placeholder="邮箱" v-model="signInData.email" />
          <input type="password" class="input" placeholder="密码" v-model="signInData.password" />
          <input type="password" class="input" placeholder="确认密码" v-model="signInData.password2" />
          <p>
            <label for="sure">
              <input type="checkbox" id="sure" />我已认真阅读并同意悦读FM的
            </label>
            <span class="red">《使用协议》</span>
          </p>
          <button @click="_sign_in">注册</button>
        </div>
      </transition>
      <transition
        enter-active-class="slide-in-left"
        enter-class="slide-in-left"
        enter-to-class="slide-in-left"
        leave-active-class="slide-out-left"
        leave-class="slide-out-left"
        leave-to-class="slide-out-left"
      >
        <div class="sign_up sign" v-if="showNum==2">
          <span class="off" @click="_off_sign">
            <i class="el-icon-close"></i>
          </span>
          <p class="title">登录</p>
          <input type="text" class="input" placeholder="邮箱" v-model="signUpData.email" />
          <input type="password" class="input" placeholder="密码" v-model="signUpData.password" />
          <p>
            <span class="remember">
              <label for="remeber_password">
                <input type="checkbox" id="remeber_password" />下次自动登录
              </label>
            </span>
            <span class="fand_password red">找回密码</span>
          </p>
          <button @click="_sign_up">登录</button>
        </div>
      </transition>
    </div>
    <div class="_alert" v-if="Alert1==true">登录成功</div>
    <div class="_alert" v-if="Alert2==true">注册成功</div>
    <div class="_alert" v-if="Alert3==true">您已退出</div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      Alert1: false,
      Alert2: false,
      Alert3: false,
      types: [],
      num: this.$route.params.id - 1,
      navNum: localStorage.navNum,
      showNum: 0,
      showNum1: 0,
      signInData: {
        email: "",
        password: "",
        password2: "",
        username: ""
      },
      signUpData: {
        email: "",
        password: ""
      },
      user: sessionStorage._user,
      username: sessionStorage._userName
    };
  },
  watch: {
    $route() {
      if (this.$route.params.id < 7) {
        this.num = this.$route.params.id - 1;
      }
    }
  },

  methods: {
    _off_user() {
      sessionStorage._user = 1;
      this.user = sessionStorage._user;
      sessionStorage._userName = null;
      this.$router.go(0);
      this.Alert3 = true;
      setTimeout(() => {
        this.Alert3 = false;
      }, 1000);
    },
    _sign_up() {
      var reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
      if (reg.test(this.signUpData.email)) {
        var reg2 = /^[0-9a-zA-Z_]{1,}$/;
        if (reg2.test(this.signUpData.password)) {
          if (document.getElementById("remeber_password").checked) {
            localStorage.email = this.signUpData.email;
            localStorage.password = this.signUpData.password;
          } else {
            localStorage.email = "";
            localStorage.password = "";
          }
          this.axios
            .post("http://localhost:3000/api/user/login", {
              email: this.signUpData.email,
              password: this.signUpData.password
            })
            .then(res => {
              if (res.data.res_code == 200) {
                localStorage._token = res.data.res.token;
                sessionStorage._user = 0;
                sessionStorage._userName = res.data.res.user.nikiname;
                this.user = sessionStorage._user;
                this.username = sessionStorage._userName;
                this.Alert1 = true;
                setTimeout(() => {
                  this.Alert1 = false;
                }, 1000);
                this._off_sign();
                this.$router.go(0);
              } else {
                alert(res.data.res_msg);
              }
            });
        } else {
          alert("密码不能为空 不能有空格 只能是英文字母和数字");
        }
      } else {
        alert("请确认邮箱格式");
      }
    },
    _sign_in() {
      if (document.getElementById("sure").checked) {
        var reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
        if (reg.test(this.signInData.email)) {
          var reg2 = /^[0-9a-zA-Z_]{1,}$/;
          if (reg2.test(this.signInData.password)) {
            if (this.signInData.password == this.signInData.password2) {
              this.axios
                .post("http://localhost:3000/api/user", {
                  email: this.signInData.email,
                  password: this.signInData.password,
                  username: this.signInData.username,
                  nikiname: this.signInData.username
                })
                .then(res => {
                  if (res.data.res_code == 200) {
                    this.Alert2 = true;
                    setTimeout(() => {
                      this.Alert2 = false;
                    }, 1000);
                    this.showNum = 2;
                  } else {
                    alert(res.data.res_msg);
                  }
                });
            } else {
              alert("请确认两次密码一致");
            }
          } else {
            alert("密码不能为空 不能有空格  只能是英文字母和数字");
          }
        } else {
          alert("请确认邮箱格式");
        }
      } else {
        alert("请阅读协议");
      }
    },
    changeNavNum(i) {
      localStorage.navNum2 = i + 1;
    },
    _off_sign() {
      this.showNum = 0;
      setTimeout(() => {
        this.showNum1 = 0;
      }, 200);
    },
    _show_sign1() {
      this.signUpData.email = localStorage.email;
      this.signUpData.password = localStorage.password;
      setTimeout(() => {
        this.showNum = 2;
      }, 200);
      this.showNum1 = 1;
    },
    _show_sign2() {
      setTimeout(() => {
        this.showNum = 1;
      }, 200);
      this.showNum1 = 1;
    }
  },
  created() {
    this.$router.push('1')
    if (sessionStorage._user != 0) {
      sessionStorage._user = 1;
      this.user = sessionStorage._user;
    }
    if (this.$route.params.id < 7) {
      localStorage.navNum = this.$route.params.id - 1;
    } else {
      this.num = localStorage.navNum2 - 1;
    }
    this.axios.get("http://localhost:3000/api/types").then(res => {
      this.types.push(...res.data.res);
    });
  }
};
</script>
<style scoped>
._alert {
  width: 100px;
  height: 50px;
  background-color: rgba(0, 0, 0, 0.3);
  text-align: center;
  line-height: 50px;
  border-radius: 25px;
  color: #fff;
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 999;
}
#remeber_password,
#sure {
  vertical-align: middle;
  margin-right: 5px;
}
@-webkit-keyframes slide-out-right {
  0% {
    -webkit-transform: translateX(0);
    transform: translateX(0);
    opacity: 1;
  }
  100% {
    -webkit-transform: translateX(1000px);
    transform: translateX(1000px);
    opacity: 0;
  }
}
@keyframes slide-out-right {
  0% {
    -webkit-transform: translateX(0);
    transform: translateX(0);
    opacity: 1;
  }
  100% {
    -webkit-transform: translateX(1000px);
    transform: translateX(1000px);
    opacity: 0;
  }
}

@-webkit-keyframes slide-in-left {
  0% {
    -webkit-transform: translateX(-1000px);
    transform: translateX(-1000px);
    opacity: 0;
  }
  100% {
    -webkit-transform: translateX(0);
    transform: translateX(0);
    opacity: 1;
  }
}
@keyframes slide-in-left {
  0% {
    -webkit-transform: translateX(-1000px);
    transform: translateX(-1000px);
    opacity: 0;
  }
  100% {
    -webkit-transform: translateX(0);
    transform: translateX(0);
    opacity: 1;
  }
}

@-webkit-keyframes slide-out-left {
  0% {
    -webkit-transform: translateX(0);
    transform: translateX(0);
    opacity: 1;
  }
  100% {
    -webkit-transform: translateX(-1000px);
    transform: translateX(-1000px);
    opacity: 0;
  }
}
@keyframes slide-out-left {
  0% {
    -webkit-transform: translateX(0);
    transform: translateX(0);
    opacity: 1;
  }
  100% {
    -webkit-transform: translateX(-1000px);
    transform: translateX(-1000px);
    opacity: 0;
  }
}
.slide-out-right {
  -webkit-animation: slide-out-right 0.1s cubic-bezier(0.55, 0.085, 0.68, 0.53);
  animation: slide-out-right 0.1s cubic-bezier(0.55, 0.085, 0.68, 0.53);
}
.slide-out-left {
  -webkit-animation: slide-out-left 0.1s cubic-bezier(0.55, 0.085, 0.68, 0.53)
    both;
  animation: slide-out-left 0.1s cubic-bezier(0.55, 0.085, 0.68, 0.53) both;
}
.slide-in-left {
  -webkit-animation: slide-in-left 0.1s cubic-bezier(0.25, 0.46, 0.45, 0.94)
    both;
  animation: slide-in-left 0.1s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
}
.sign .off {
  display: inline-block;
  background-color: rgba(0, 0, 0, 0.3);
  font-size: 20px;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  text-align: center;
  line-height: 25px;
  position: absolute;
  right: -12px;
  top: -12px;
}
.fand_password {
  float: right;
}
.sign .red {
  color: red;
}
.sign button {
  width: 100%;
  background-color: red;
  color: #fff;
  height: 35px;
  border: none;
  margin-top: 10px;
  outline: none;
}
.sign .title {
  font-size: 25px;
}

.sign .input {
  outline: none;
  width: 100%;
  height: 30px;
  margin-top: 10px;
  padding-left: 20px;
  box-sizing: border-box;
}
.sign .input:last-of-type {
  margin-bottom: 10px;
}
.sign_box {
  z-index: 999;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.3);
}

.sign {
  position: relative;
  margin: 150px auto;
  font-size: 12px;
  width: 300px;
  padding: 30px;
  background-color: #fff;
}
.color,
.active {
  color: red;
}
a {
  color: #000;
  text-decoration: none;
}
* {
  margin: 0;
  padding: 0;
}
.all_bg {
  width: 100%;
  background-color: #fff;
  margin-bottom: 30px;
}
.top {
  overflow: hidden;
  width: 1000px;
  margin: auto;
  height: 100px;
  line-height: 100px;
  font-size: 15px;
}
.befor_h {
  display: inline-block;
  width: 4px;
  height: 25px;
  background-color: red;
  margin-left: 2px;
  border-radius: 2px;
  vertical-align: middle;
}
.s {
  height: 15px;
}
.nav {
  overflow: hidden;
  width: 600px;
}
.fl {
  float: left;
}
.fr {
  float: right;
}
.el-tag {
  font-size: 15px;
  border: none;
  background-color: #fff;
  color: #000000;
}
.serch span {
  margin-left: 15px;
}
.serch span:hover {
  color: red;
}
</style>
