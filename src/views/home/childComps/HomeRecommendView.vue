<template>
  <div class='HomeRecmmendView'>
    <div v-for="item in recommends" class="HomeRecmmendView-item">
      <a :href="item.link">
        <img :src="item.image" alt="">
        <div>{{item.title}}</div>
      </a>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'HomeRecmmendView',
    props:{
      recommends:{
        type:Array,
        default(){
          return []
        }
      }
    },
    data(){
      return {}
    },
    components: {},
    created(){},
    mounted(){},
    methods: {}
  }
</script>
<style scoped>
  .HomeRecmmendView{
    display: flex;
    width: 100%;
    text-align: center;
    font-style: 12px;
    padding: 10px 0 15px;
    border-bottom: 8px solid #eee;
  }
  .HomeRecmmendView-item{
    flex: 1;
  }
  .HomeRecmmendView-item img{
    width: 70px;
    height: 70px;
    margin-bottom: 10px;
  }
</style>
