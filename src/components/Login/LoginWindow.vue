<template>
    <div class="LoginWindow">
      <div class="form-box">
        <p v-if="current_status === STATUS_LOGIN" class="title-login">
          登录到「待办」
          <a class="register-button" @click="to_register">注册</a>
        </p>
        <p v-else-if="current_status === STATUS_REGISTER" class="title-register">
        <span class="material-icons" @click="to_login"
              style="position:absolute; left: 1%; cursor: pointer; color: cornflowerblue; font-size: 2vw">
          arrow_back
        </span>
          注册
        </p>
        <form class="form" :style="{ height: form_height }">
          <div class="form-container" ref="form_container" v-if="current_status === STATUS_LOGIN">
            <input-box class="form-input" :attributes="{ name: '邮箱', hint: '输入邮箱', type: 'email' }" v-model = "login_email"/>
            <div class="divider"/>
            <input-box class="form-input" :attributes="{ name: '密码', hint: '输入密码', type: 'password' }" v-model="login_password"/>
          </div>
          <div class="form-container" ref="form_container" v-else-if="current_status === STATUS_REGISTER">
            <input-box class="form-input" :attributes="{ name: '头像', hint: '上传头像', type: 'avatar' }" v-model="register_avatar"/>
            <div class="divider"/>
            <input-box class="form-input" :attributes="{ name: '邮箱', hint: '输入邮箱', type: 'email' }" v-model="register_email"/>
            <div class="divider"/>
            <input-box class="form-input" :attributes="{ name: '密码', hint: '输入密码', type: 'password' } " v-model="register_password"/>
          </div>
        </form>
        <div class="login-submit-button" @click="on_login" v-if="current_status === STATUS_LOGIN" :style="{ backgroundColor: login_has_error ? 'darkorange' : 'white' }">
          <span v-show="!login_has_error" class="material-icons">arrow_forward</span>
          <p class="login-err-msg" v-show="login_has_error"> {{ login_error_msg }} </p>
        </div>
        <div class="register-submit-button" @click="on_register" v-else-if="current_status === STATUS_REGISTER" :style="{ backgroundColor: register_btn_color}">
          <p class="register-submit-msg" :style="{color: register_btn_text_color}">
            {{ register_btn_msg }} </p>
        </div>
      </div>
    </div>

</template>

<script>

import InputBox from "@/components/Login/InputBox";
import api from "@/components/Http/http";
import store from "@/main";

const STATUS_LOGIN    = 0
const STATUS_REGISTER = 1

export default {
  name: "LoginWindow",
  components: {InputBox},
  computed: {
    form_height(){
      return this.current_status === STATUS_LOGIN ? '30%' : '50%'
    }
  },
  methods: {
    to_login(){
      this.current_status = STATUS_LOGIN
    },
    to_register() {
      this.current_status = STATUS_REGISTER
    },
    on_regex_email(email) {
      return this.regex_email.test(email) ? { valid: true } : { valid: false, message: '邮箱格式错误' }
    },
    on_regex_password(password) {
      return this.regex_password.test(password) ? { valid: true } : { valid: false, message: '密码长度8-15且包含数字英文字母' }
    },
    on_login() {
      if(this.on_regex_email(this.login_email).valid
      && this.on_regex_password(this.login_password).valid) {
        api.post("/user/login", { email: this.login_email, password: this.login_password }).then(response => {
          store.state.user = response.body
          this.$emit('on-login')
        }).catch(error => {
          this.login_button_error(error.message)
        })
      } else this.login_button_error("邮箱或密码错误")
    },
    login_button_error(message) {
      this.login_has_error = true
      this.login_error_msg = message
      setTimeout(() => {
        this.login_button_default()
      }, 1500)
    },
    login_button_default() {
      this.login_has_error = false
      this.login_error_msg = ''
    },
    on_register() {
      let email_res = this.on_regex_email(this.register_email)
      if(email_res.valid) {
        let psw_res = this.on_regex_password(this.register_password)
        if(psw_res.valid) {
          api.post("/user", {
              avatar_file_name: this.register_avatar,
            email: this.register_email,
            password: this.register_password
          }).then(response => {
            this.register_button_success("注册成功!")
            setTimeout(()=>{
              this.login_email = response.body.email
              this.login_password = response.body.password
              this.current_status = STATUS_LOGIN
            }, 1500)
          }).catch(error => {
            this.register_button_error(error.message)
          })
        } else this.register_button_error(psw_res.message)
      } else this.register_button_error(email_res.message)
    },
    register_button_success(message) {
      this.register_button_set('green', 'white', message)
      setTimeout(() => {
        this.register_button_default()
      }, 1500)
    },
    register_button_error(message) {
      this.register_button_set('darkorange', 'white', message)
      setTimeout(() => {
        this.register_button_default()
      }, 1500)
    },
    register_button_default() {
      this.register_button_set('white', 'black', '提交')
    },
    register_button_set(color, text_color, text) {
      this.register_btn_color = color
      this.register_btn_text_color = text_color
      this.register_btn_msg = text
    }
  },
  data() {
    return {
      STATUS_LOGIN: STATUS_LOGIN,
      STATUS_REGISTER: STATUS_REGISTER,
      current_status: STATUS_LOGIN,
      regex_email: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
      regex_password: /^[a-zA-Z0-9]{8,15}$/,
      login_email: '',
      login_password: '',
      login_has_error: false,
      login_error_msg: '',
      register_avatar: '',
      register_email: '',
      register_password: '',
      register_btn_color: 'white',
      register_btn_text_color: 'black',
      register_btn_msg: '提交'
    }
  }
}

</script>

<style scoped>

@keyframes fade-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.LoginWindow {
  position: fixed;
  border: 1px #e7e7e7 solid;
  box-shadow: 0 0 20px #e3e3e3;
  border-radius: 8px;
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.form-box {
  width: 40%;
  height: 70%;
  position: relative;
}

.title-login {
  font-weight: bold;
  font-size: 2.3vw;
  position: relative;
  margin: 0;
  animation: fade-in 0.3s ease-in-out;
}

.title-register {
  font-weight: bold;
  font-size: 2.3vw;
  margin: 0;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: fade-in 0.3s ease-in-out;
}

.title-register span:hover {
  color: dodgerblue;
}

.register-button {
  color: cornflowerblue;
  font-weight: normal;
  font-size: 2vw;
  cursor: pointer;
}

.register-button:hover {
  color: dodgerblue;
}

.form {
  width: 100%;
  height: 30%;
  border-radius: 12px;
  display: flex;
  position: relative;
  top: 20px;
  background-color: white;
  transition: height 0.3s ease-in-out;
}

.form-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-around;
  flex-direction: column;
}

.form-input {

}

.divider {
  width: 100%;
  height: 1px;
  background-color: #e1e1e1;
}

.login-submit-button {
  width: 100%;
  height: 10%;
  margin-top: 40px;
  display: flex;
  border-radius: 12px;
  position: relative;
  background-color: white;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: ease-in-out 0.3s;
}

.login-err-msg {
  color: white;
  font-weight: bold;
  font-size: 1vw;
}

.register-submit-button {
  width: 100%;
  height: 10%;
  margin-top: 40px;
  display: flex;
  border-radius: 12px;
  position: relative;
  background-color: white;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: ease-in-out 0.3s;
}

.register-submit-msg {
  color: white;
  font-weight: bold;
  font-size: 1vw;
}


</style>