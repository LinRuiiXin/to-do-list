<template>
  <div class="MainContent">
    <p class="list-title" :style="{ color: attributes.color }"> {{ attributes.title }} </p>
    <div class="items">
      <item-card v-for="item in attributes.items"
                 :key="item.id"
                 :item="item"
                 :classifies="attributes.classifies"
                 :tags="attributes.tags"
                 :show_divider="true"
                 @update-item="update_item"
                 @item-done="item_done"
      />
    </div>
    <div class="add-item"
         @click="add_item"
    >
        <span class="material-icons"
              style="display: inline-flex; justify-content: center; align-items: center"
              :style="{color: attributes.color}"
        >
        add_circle
        </span>
        <p class="add-item-text" :style="{color: attributes.color}">添加事项</p>
    </div>
  </div>
</template>

<script>
import ItemCard from "@/components/Home/ItemCard";
export default {
  name: "MainContent",
  components: {ItemCard},
  props: {
    attributes: {
      type: Object,
      required: false
    }
  },
  methods: {
    add_item() {
      this.$emit('add-item')
    },
    update_item(item) {
      this.$emit('update-item', item)
    },
    item_done(item_id) {
      this.$emit('item-done', item_id)
    }
  }
}
</script>

<style scoped>

.MainContent {
  display: flex;
  height: 100%;
  position: relative;
}

.list-title {
  width: fit-content;
  font-size: 2.8vw;
  font-weight: bold;
  position: relative;
  left: 4%;
}

.items {
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: auto;
}

.items::-webkit-scrollbar {
  display: none;
}

.add-item {
  width: fit-content;
  display: flex;
  position: relative;
  top: 1%;
  left: 3%;
  cursor: pointer;
}

.add-item-text {
  margin: 0;
  font-size: 1.2vw;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
}

</style>