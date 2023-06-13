<template>
  <div class="SideBar">
    <div class="search">
      <span class="material-icons" style="display:flex; align-items: center; font-size: 1.3vw; color: gray; margin-left: 5px; margin-top: 2px">search</span>
      <p style="height: 100%; margin: 0; font-size: 1vw; display: flex; align-items: center; justify-content: center; color: gray">搜索</p>
    </div>
    <div class="options">
      <side-bar-option style="width: 42%; height: 38%; margin: 10px"
                       v-for="(option, index) in options.slice(0, BUILT_IN_COUNT)"
                       @click="on_selected(index)"
                       :key="option.id"
                       :option="option"/>
    </div>
    <div class="list">
      <p class="list-title">列表</p>
      <div class="list-container">
        <side-bar-list-item style="width: 100%; min-height: 50px;"
                         v-for="(option, index) in options.slice(BUILT_IN_COUNT, options.length)"
                         @click="on_selected(BUILT_IN_COUNT + index)"
                         @on-change-classify="on_change_classify"
                         :key="option.id"
                         :divider="index !== options.length - BUILT_IN_COUNT - 1"
                         :option="option"/>
      </div>

      <div class="list-add" @click="this.$emit('on-add-classify')">
        <div class="list-add-container">
          <span class="material-icons" style="display: inline-flex; justify-content: center; align-items: center" >add_circle</span>
          <p style="width: fit-content; display: inline-flex; margin: 0; justify-content: center; align-items: center; font-weight: bold">添加列表</p>
        </div>

      </div>
    </div>
  </div>
</template>

<script>

import SideBarOption from "@/components/Home/SideBarOption";
import SideBarListItem from "@/components/Home/SideBarListItem";

export default {
  name: "SideBar",
  props: {
    options: {
      type: Object,
      required: true
    },
    modelValue: {
      type: String,
      default: '',
    }
  },
  methods: {
    on_selected(index) {
      this.$emit('update:modelValue', index)
    },
    on_change_classify(classify) {
      this.$emit("on-change-classify", classify)
    }
  },
  data() {
    return {
      BUILT_IN_COUNT: 4
    }
  },
  components: {
    SideBarListItem,
    SideBarOption
  }
}
</script>

<style scoped>

.SideBar {
  padding-top: 0;
  background: #e8e7eb;
  display: flex;
  flex-direction: column;
}

.search {
  width: 90%;
  height: 30px;
  display: flex;
  background-color: #d0cece;
  margin: 30px auto 0;
  border-radius: 10px;
}

.options {
  width: 100%;
  height: 240px;
  display: flex;
  flex-wrap: wrap;
  align-content: center;
  justify-content: center;
  padding: 0;
  margin-top: 15px;
  /*overflow: scroll;*/
}

.options::-webkit-scrollbar {
  display: none;
}

.list {
  width: 100%;
  display: flex;
  position: relative;
  flex-direction: column;
}

.list-title {
  width: fit-content;
  display: flex;
  position: relative;
  left: 6%;
  font-weight: bold;
  font-size: 2vw;
}

.list-container {
  width: 90%;
  margin: 0 auto;
  display: flex;
  border-radius: 10px;
  flex-direction: column;
  overflow: hidden;
}

.list-add {
  width: 90%;
  height: auto;
  display: flex;
  flex-direction: column;
  margin: 10px auto 0;
  position: relative;
}

.list-add-container {
  position: absolute;
  right: 0;
  display: flex;
  color: dodgerblue;
  cursor: pointer;
}

</style>