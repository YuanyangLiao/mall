<template>
  <div class='TabControl'>
    <div v-for="(item,index) in titles" 
        class="TabControl-item"
        :class="{active:index === currentIndex}"
        @click="itemClick(index)">
      <span>{{item}}</span>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'TabControl',
    props:{
      titles:{
        type:Array,
        default(){
          return []
        }
      }
    },
    data(){
      return {
        currentIndex:0
      }
    },
    components: {},
    created(){},
    mounted(){},
    methods: {
      itemClick(index){
        this.currentIndex = index
        this.$emit("tabCLick",index)
      }
    }
  }
</script>
<style scoped>
  .TabControl{
    display: flex;
    text-align: center;
    font-size: 16px;
    background-color: #fff;
  }
  .TabControl-item{
    flex: 1;
    height: 40px;
    line-height: 40px;
  }
  .TabControl-item span{
    padding: 5px;
  }
  .active{
    color: var(--color-high-text);
  }
  .active span{
    border-bottom: 3px solid var(--color-tint);
  }
</style>
