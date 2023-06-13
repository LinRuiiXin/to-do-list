<template>
  <div class="HomePage">
    <side-bar :options="side_bar_options"
              v-model="selected_option"
              @on-add-classify="on_add_classify"
              @on-change-classify="on_change_classify"
              class="side-bar"/>
    <main-content class="main-content"
                  :attributes="main_attributes"
                  @add-item="add_item"
                  @update-item="update_item"
                  @item-done="item_done"
    />
  </div>
</template>

<script>

import SideBar from "@/components/Home/SideBar";
import MainContent from "@/components/Home/MainContent";
import api from "@/components/Http/http";

export default {
  name: "HomePage",
  components: {
    MainContent,
    SideBar
  },
  mounted() {
    let fake_classifies = [
      { id: -1, name: '提醒事项', built_in: false, user_id: 0 },
      { id: -2, name: '生活用品', built_in: false, user_id: 0 }
    ]
    fake_classifies.forEach(classify => {
      this.classifies.push(classify);
      this.side_bar_options.push({ selected: false, classify_id: classify.id, icon_name: "list", background_color: "dodgerblue", to_do_numb: 0, tag: classify.name, filter: (item) => { return item.classify_id === classify.id }})
    })
    this.tags = this.tags.concat([
      { id: -1, name: '购物清单' },
      { id: -2, name: '派对' }
    ])
    this.items = this.items.concat([
      { id: -1, content: '清理庭院的椅子', time: null, done: 0, classify_id: 3},
      { id: -2, content: '在庭院里挂灯', time: this.today_str(), done: 0, classify_id: 3},
      { id: -3, content: '搅碎的牛肉', time: this.today_str(), tags: [ -1, -2 ], done: 0, classify_id: -2},
      { id: -4, content: '汉堡面包', time: null, tags: [ -1, -2 ], done: 0, classify_id: -2}
    ])
    this.on_option_selected(this.selected_option);
    this.$watch('selected_option', (new_value) => {
      this.on_option_selected(new_value)
    })
    this.calculate_side_bar_option_numbs()
  },
  methods: {
    on_login() {
      api.get("/index").then(response => {
        this.clear_expired_data();
        let data = response.body
        data.classifies.forEach(classify => {
          this.classifies.push(classify);
          this.side_bar_options.push({ selected: false, classify_id: classify.id, icon_name: "list", background_color: "dodgerblue", to_do_numb: 0, tag: classify.name, filter: (item) => { return item.classify_id === classify.id }})
        })
        this.tags = data.tags
        this.items = data.items
        console.log(this.items)
        this.on_option_selected(2)
        this.calculate_side_bar_option_numbs()
      }).catch(error => {
        console.log(error)
      })
    },
    add_item() {
      console.log(this.selected_option)
      let temp_classify_id = this.selected_option === 0 || this.selected_option === 2 ? 1 : this.side_bar_options[this.selected_option].classify_id
      this.items.push({
        id: null,
        content: '',
        time: this.selected_option === 0 ? this.today_str() : null,
        done: 0 ,
        classify_id: temp_classify_id
      })
      this.on_option_selected(this.selected_option)
    },
    update_item(item) {
      if(item.id === null) {
        if(!this.is_empty(item.content.trim())) {
          api.post("/item", item).then(response => {
            this.tags = response.body.tags
            for (let i = 0; i < this.items.length; i++) {
              if(this.items[i].id === null) {
                this.items[i] = response.body.item
              }
            }
            this.clear_temp_items()
            this.calculate_side_bar_option_numbs()
            this.on_option_selected(this.selected_option)
          })
        } else {
          this.clear_temp_items()
          this.on_option_selected(this.selected_option)
        }
      } else {
        if(!this.is_empty(item.content.trim())) {
          api.put("/item", item).then(response => {
            this.tags = response.body.tags
            for (let i = 0; i < this.items.length; i++) {
              if(this.items[i].id === item.id) {
                this.items[i] = response.body.item
              }
            }
            this.clear_temp_items()
            this.calculate_side_bar_option_numbs()
            this.on_option_selected(this.selected_option)
          })
        } else {
          api.delete("/item/" + item.id).then(() => {
            for (let i = 0; i < this.items.length; i++) {
              if(this.items[i].id === item.id) {
                this.items.splice(i,1)
              }
            }

          })
        }
      }
    },
    item_done(item_id) {
      for (let i = 0; i < this.items.length; i++) {
        if(this.items[i].id === item_id) {
          this.items.splice(i,1)
        }
        this.clear_temp_items()
        this.calculate_side_bar_option_numbs()
        this.on_option_selected(this.selected_option)
      }
    },
    on_option_selected(index) {
      for (let i = 0; i < this.side_bar_options.length; i++) {
        this.side_bar_options[i].selected = i === index
      }
      this.show_items = []
      this.items.forEach(item => {
        if(!item.done)
          if(this.side_bar_options[index].filter !== null && this.side_bar_options[index].filter(item)) this.show_items.push(item)
      })
    },
    on_add_classify() {
      this.side_bar_options.push({ selected: false, classify_id: null, icon_name: "list", background_color: "dodgerblue", to_do_numb: 0, tag: '', filter: null });
    },
    on_change_classify(change_classify) {
      if(change_classify.id === null) {
        if(this.is_empty(change_classify.name)){ // 什么也不做，把临时的删掉
          this.side_bar_options = this.side_bar_options.filter(option => option.classify_id !== null)
          this.selected_option = 2
        }
        else { // 添加一个类目
          api.post("/classify", change_classify).then(response => {
            let option = this.side_bar_options.find(option => option.classify_id === null)
            option.classify_id = response.body.id
            option.tag = response.body.name
            option.filter = (item) => { return item.classify_id === response.body.id }
            this.classifies.push(response.body)
          }).catch((error) => {
            console.log(error.message)
            this.clear_temp_options()
          })
        }
      } else {
        if(this.is_empty(change_classify.name)) { // 删除一个类目
          api.delete("/classify/" + change_classify.id).then(() => {
            this.side_bar_options = this.side_bar_options.filter(option => option.classify_id !== change_classify.id)
            this.classifies = this.classifies.filter(classify => classify.id !== change_classify.id)
            this.selected_option = 2
          })
        } else { // 更新
          api.put("/classify", change_classify).then(() => {
            this.classifies.find(classify => classify.id === change_classify.id).name = change_classify.name
            this.side_bar_options.find(option => option.classify_id === change_classify.id).tag = change_classify.name
          })
        }
      }
    },
    clear_expired_data() { // 清除所有过期数据(假数据，上一个用户的数据)
      this.side_bar_options = this.side_bar_options.slice(0, 4)
      this.side_bar_options.forEach(option => option.to_do_numb = 0)
      this.classifies = this.classifies.filter(classify => classify.built_in === 1)
      this.tags = []
      this.items = []
    },
    clear_temp_options() {
      this.side_bar_options = this.side_bar_options.filter(option => option.classify_id !== null)
    },
    clear_temp_items() {
      this.items = this.items.filter(item => item!== null)
    },
    calculate_side_bar_option_numbs() { // 计算边栏选项数目
      this.side_bar_options.forEach(option => option.to_do_numb = 0)
      this.items.forEach(item => {
        if(!item.done) {
          this.side_bar_options.forEach(option => {
            if(option.filter != null && option.filter(item)) option.to_do_numb++
          })
        }
      })
    },
    filter_today(item) {
      return item.time === this.today_str()
    },
    filter_plan(item) {
      return item.classify_id === 3
    },
    filter_flag(item) {
      return item.classify_id === 2
    },
    is_empty(str) {
      return str === null || str.trim().length === 0
    },
    today_str() {
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const today = `${year}/${month}/${day}`;
      return today;
    }
  }
  ,
  computed: {
    main_attributes() {
      return {
        title: this.side_bar_options[this.selected_option].tag,
        color: this.side_bar_options[this.selected_option].background_color,
        classifies: this.classifies,
        tags: this.tags,
        items: this.show_items
      }
    }
  },
  data() {
    return {
      selected_option: 2,
      side_bar_options: [
        { selected: false, classify_id: 0, icon_name: "today", background_color: "dodgerblue", to_do_numb: 0, tag: "今天", filter: this.filter_today },
        { selected: false, classify_id: 3, icon_name: "date_range", background_color: "red", to_do_numb: 0, tag: "计划", filter: this.filter_plan },
        { selected: false, classify_id: 0, icon_name: "list", background_color: "gray", to_do_numb: 0, tag: "全部", filter: () => { return true } },
        { selected: false, classify_id: 2, icon_name: "flag", background_color: "orange", to_do_numb: 0, tag: "旗标", filter: this.filter_flag }
      ],
      classifies: [
        { id: 1, name: '无', built_in: 1 },
        { id: 2, name: '旗标', built_in: 1 },
        { id: 3, name: '计划', built_in: 1 }
      ],
      tags: [],
      items: [],
      show_items: [],
    }
  }
}
</script>

<style scoped>

.HomePage {
  position: fixed;
  width: 100%;
  height: 100%;
  display: flex;
}

.side-bar {
  width: 30%;
  height: 100%;
  display: inline-block;
}

.main-content {
  width: 70%;
  height: 100%;
  display: inline-block;
}

</style>