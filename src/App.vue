<template>
  <div class="main">
    <transition name="fade">
      <login-window style="width: 70%; height: 80%; z-index: 1" v-show="!is_login"
                    @on-login="on_login"/>
    </transition>
    <home-page ref="home_page" style="z-index: 0;"/>
  </div>
</template>

<script>

import LoginWindow from "@/components/Login/LoginWindow";
import HomePage from "@/components/Home/HomePage";

export default {
  name: 'App',
  components: {
    LoginWindow, HomePage
  },
  computed: {
    is_login() {
      return this.$store.state.user !== null
    }
  },
  methods: {
    on_login() {
      this.$refs.home_page.on_login()
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
.main {
  width: 100%;
  height: 100%;
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  inset: 0;
  background: #f1f1f1;
  background-size: cover;
}

.fade-enter-active {
  opacity: 0;
  transition: opacity 0.3s;
}

.fade-enter-to {
  opacity: 1;
}

.fade-leave-active {
  opacity: 1;
  transition: opacity 0.3s;
}

.fade-leave-to {
  opacity: 0
}

</style>
