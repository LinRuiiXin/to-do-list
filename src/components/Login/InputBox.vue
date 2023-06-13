<template>
  <div class="InputBox">
    <p class="name"> {{ attributes.name }} </p>
    <input v-show="attributes.type !== 'avatar'" class="input"
           :type="attributes.type"
           :placeholder="attributes.hint"
           v-model="value" />
    <input class="input-file"
           type="file"
           style="display: none"
           id="input-file"
           v-on:change="upload_file"/>
    <i v-show="attributes.type === 'avatar' && is_empty(value)"
       class="material-icons"
       style="font-size: 3vw; align-items: center; justify-content: center; display: flex; border-radius: 50%; cursor: pointer; position: relative; left: 5%"
       @click="select_file">account_circle</i>
    <img v-if="attributes.type === 'avatar' && !is_empty(value)"
         style="width: 3vw; height: 3vw; border-radius: 50%; position: relative; left: 4%; object-fit: cover"
         @click="select_file"
         :src="is_empty(value) ? '' : 'http://localhost:8000/Images/' + value">
  </div>
</template>

<script>

import api from "@/components/Http/http";

export default {
  name: "InputBox",
  computed: {
    value: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      }
    }
  },
  methods: {
    is_empty(str) {
      return str.trim().length === 0
    },
    select_file() {
      document.getElementById("input-file").click()
    },
    upload_file(e) {
      let formData = new FormData()
      formData.append('file', e.target.files[0])
      api.post("/file/avatar", formData, {
        headers: {'Content-Type': 'multipart/form-data'}
      }).then(response => {
        this.value = response.message
      }).catch(error => {
        console.log(error)
      })
    }
  },
  emits: ['update:modelValue'],
  props: {
    attributes: {
      type: Object,
      required: true
    },
    modelValue: {
      type: String,
      default: '',
    }
  },
  data() {
    return {
    }
  }
}
</script>

<style scoped>

.InputBox {
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: row;
  padding: 0 20px;
  /*justify-content: center;*/
  align-items: center;
  animation: fade-in 0.3s ease-in-out;
}

@keyframes fade-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.name {
  height: min-content;
  margin: 0;
  font-size: 1.1vw;
  font-weight: bold;
}

.input {
  width: 70%;
  margin-left: 10px;
  border: none;
  font-size: 1vw;
}

.input:focus {
  outline: none;
}

.input-file {

}

</style>