<template>
  <div class="SideBarOption" :style="{ backgroundColor: option.selected ? option.background_color : 'white' }">
    <span class="material-icons"
          :style="{
            backgroundColor: option.selected ? 'white' : option.background_color,
            color: option.selected ? option.background_color : 'white'
          }"> {{option.icon_name}} </span>
    <p :style="{color: option.selected ? 'white' : 'gray'}" class="tag"> {{option.tag}} </p>
    <p :style="{color: option.selected ? 'white' : 'black'}" class="numb"> {{option.to_do_numb}} </p>
  </div>
</template>

<script>

import 'material-design-icons/iconfont/material-icons.css'

export default {
  name: "SideBarOption",
  props: {
    option: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>

.SideBarOption {
  border-radius: 14px;
  border: 0;
  display: flex;
  justify-content: flex-start;
  /*flex-grow: 1;*/
  position: relative;
  transition: background-color 0.3s ease-in-out;
}

.SideBarOption span {
  padding: 7px;
  border-radius: 50%;
  color: white;
  display: flex;
  position: absolute;
  left: 7%;
  top: 12%;
  justify-content: center;
  align-items: center;
  font-size: 1.8vw;
}

.tag {
  height: min-content;
  margin: 0;
  position: absolute;
  bottom: 8%;
  left: 9.4%;
  display: flex;
  font-weight: bold;
  font-size: 1.1vw;
  color: gray;
}

.numb {
  height: min-content;
  margin: 0;
  position: absolute;
  right: 10%;
  top: 13%;
  font-size: 2vw;
  font-weight: bold;
}

</style>