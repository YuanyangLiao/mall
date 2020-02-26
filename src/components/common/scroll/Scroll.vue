<template>
  <div class='wrapper' ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'
  export default {
    name: 'Scroll',
    data(){
      return {
        scroll:null
      }
    },
    components: {
      BScroll
    },
    created(){},
    mounted(){
      this.scroll = new BScroll(this.$refs.wrapper,{

      })
    },
    methods: {}
  }
</script>
<style scoped>
</style>
