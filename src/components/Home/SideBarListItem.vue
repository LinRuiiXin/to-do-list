<template>
  <div class="SideBarListItem"
       :style="{backgroundColor: option.selected ? option.background_color : 'white', borderBottom: divider ? '1px #efefef solid' : 'none'}">
    <span class="material-icons"
          style="display: flex; align-items: center; width: 3vw; height: 3vw; font-size: 2vw; border-radius: 50%; justify-content: center; position:relative; left: 3%"
          :style="{
            backgroundColor: option.selected ? 'white' : option.background_color,
            color: option.selected ? option.background_color : 'white'
          }">
      {{ option.icon_name }}
    </span>
    <input class="name"
           :style="{color: option.selected ? 'white' : 'black'}"
           v-model="input"
           v-on:blur="on_enter"
           @keyup.enter="on_enter"/>
    <p class="numb" :style="{color: option.selected ? 'white' : 'black'}"> {{ option.to_do_numb }} </p>
    <span class="material-icons" :style="{color: option.selected ? 'white' : 'black'}" style="position:absolute; right: 2%;">
      chevron_right
    </span>
  </div>
</template>

<script>

import store from "@/main";

export default {
  name: "SideBarListItem",
  props: {
    option: {
      type: Object,
      required: true
    },
    divider: {
      type: Boolean,
      required: false
    }
  },
  data() {
    return {
      input: this.option.tag
    }
  },
  methods: {
    on_enter() {
      this.$emit("on-change-classify", { id: this.option.classify_id, name: this.input, built_in: 0, user_id: store.state.user.id })
    }
  }
}
</script>

<style scoped>

.SideBarListItem {
  width: 100%;
  cursor: pointer;
  display: flex;
  position: relative;
  align-items: center;
  padding: 5px 0;
  border-radius: 0;
  transition: background-color 0.3s ease-in-out;
}

.name {
  border: none;
  background: none;
  display: inline-block;
  position: relative;
  left: 6%;
  font-weight: bold;
  font-size: 1.1vw;
}

.name:focus {
  outline: none;
}

.numb {
  position: absolute;
  right: 10%;
  font-weight: bold;
  font-size: 1.7vw;
}

</style>