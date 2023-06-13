<template>
    <div class="ItemCard">
    <span class="material-icons"
          style="display: flex; font-size: 2.8vw; cursor:pointer; transition: 0.3s ease-in-out"
          @click="on_done"
          :style="{ color: !done ? 'gray' : 'darkgray' }">
      {{ item.done ? 'check_circle' : 'panorama_fish_eye' }}
    </span>
      <div class="info" :style=" { borderBottom: show_divider ? '1px #d7d7d7 solid' : 'none' } ">
        <input class="info-title"
               v-model="content"
               :style="{textDecoration: done ? 'line-through' : 'none', color: done ? 'darkgray' : 'black'}"
               v-on:focus="original_content"
               v-on:blur="update_item(); this.content = this.item.content"
               @keyup.enter="on_enter($event)"
        />
        <p class="info-description" :style="{color: done ? 'darkgray' : 'black'}">
          {{ item.classify_id !== 1 ? classify_name : '' }}
          {{ item.time }}
          <span class="info-description-tag"
                v-for="tag_id in item.tags"
                :key="tag_id">
          {{ '#' + tag_name(tag_id) + ' ' }}
        </span>
        </p>
      </div>
    </div>
</template>

<script>

import api from "@/components/Http/http";

export default {
  name: "ItemCard",
  props: {
    classifies: {
      type: [Object],
      required: true
    },
    tags: {
      type: [Object],
      required: true
    },
    item: {
      type: Object,
      required: true
    },
    show_divider: {
      type: Boolean,
      required: false
    }
  },
  computed: {
    classify_name() {
      let classifies = this.classifies.filter(classify => {return classify.id === this.item.classify_id})
      return classifies.length === 0 ? '' : classifies[0].name
    }
  },
  methods : {
    tag_name(id) {
      let tags = this.tags.filter(tag => { return tag.id === id })
      return tags.length === 0 ? '' : tags[0].name
    },
    original_content() {
      this.item.tags?.forEach(tag_id => {
        this.content += (' #' + this.tag_name(tag_id))
      })
    },
    on_enter(event) {
      event.target.blur()
    },
    on_done() {
      if(this.item.id !== null) {
        api.put("/item/done/" + this.item.id).then(() => {
          this.done = true
          setTimeout(() => {
            this.$emit('item-done', this.item.id)
          }, 3000)
        })
      }
    },
    update_item() {
      this.$emit('update-item', {id: this.item.id, content: this.content, time: this.item.time, classify_id: this.item.classify_id})
    }
  },
  data() {
    return {
      content: this.item.content,
      done: this.item.done
    }
  }
}
</script>

<style scoped>

.ItemCard {
  display: flex;
  width: 100%;
  padding-left: 3%;
  padding-top: 5px;
  padding-bottom: 5px;
  justify-content: center;
  align-items: center;
}

.info {
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-left: 10px;
  padding-bottom: 3px;
}

.info-title {
  width: 100%;
  font-size: 1.1vw;
  padding: 0;
  font-weight: bold;
  border: none;
  background: none;
  margin: 0;
  transition: 0.3s ease-in-out;
}

.info-title:focus {
  outline: none;
}

.info-description {
  width: fit-content;
  margin: 3px 0 0;
  font-size: 1.1vw;
  transition: 0.3s ease-in-out;
}

.info-description-tag {
  color: dodgerblue;
}

</style>