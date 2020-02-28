<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>

    <scroll class="content" 
            ref="scroll" 
            :probe-type="3" 
            @scroll="contentScroll"
            :pull-up-load="true"
            @pullingUp='loadMore'>
      <home-swiper :banners="banners"/>
      <home-recommend-view :recommends="recommends"/>
      <feature-view/>
      <tab-control class="tab-control" 
                  :titles="['流行','新款','精选']"
                  @tabCLick="tabCLick"/>
      <goods-list :goods="showGoods"/>
    </scroll>

    <back-top @click.native="backClick" v-show="isShowBackTop"/>
  </div>
</template>

<script>
  // 导航栏
  import NavBar from 'components/common/navbar/NavBar'
  // 轮播图
  import HomeSwiper from './childComps/HomeSwiper'
  // 推荐
  import HomeRecommendView from './childComps/HomeRecommendView'
  // 特色
  import FeatureView from './childComps/FeatureView'
  // 控制栏
  import TabControl from 'components/content/tabControl/TabControl'
  // 商品列表
  import GoodsList from 'components/content/goodsList/GoodsList'
  // 滚动插件
  import Scroll from 'components/common/scroll/Scroll'
  // 回到顶部
  import BackTop from 'components/content/backTop/BackTop'
  // 网络请求
  import {getHomeMultidata,getHomeGoods} from 'network/home'
  export default {
    name: 'Home',
    data(){
      return {
        banners:[],
        recommends:[],
        goods:{
          'pop':{page:0,list:[]},
          'new':{page:0,list:[]},
          'sell':{page:0,list:[]}
        },
        currentType:'pop',
        isShowBackTop:false
      }
    },
    components: {
      NavBar,
      HomeSwiper,
      HomeRecommendView,
      FeatureView,
      TabControl,
      GoodsList,
      Scroll,
      BackTop
    },
    created(){
      // 1. 请求多个数据
      this.getHomeMultidata()
      // 2. 请求商品数据
      this.getHomeGoods('pop')
      this.getHomeGoods('new')
      this.getHomeGoods('sell')
    },
    computed:{
      showGoods(){
        return this.goods[this.currentType].list
      }
    },
    mounted(){
      // 监听item中图片加载完成
      const refresh = this.debounce(this.$refs.scroll.refresh,50) // 调用防抖动方法，降低刷新频率
      this.$bus.$on('itemImageLoad',()=>{   // 通过事件总线监听事件
        refresh()
      })
    },
    methods: {
      /**
       * 事件监听相关方法
       */
      // 防抖动的方法
      debounce(func,delay){
        let timer = null
        return function(...args){
          if(timer) clearTimeout(timer)
          timer = setTimeout(()=>{
            func.apply(this,args)
          },delay)
        }
      },
      tabCLick(index){
        switch(index){
          case 0:
            this.currentType = 'pop'
            break
          case 1:
            this.currentType = 'new'
            break
          case 2:
            this.currentType = 'sell'
            break
        }
      },
      backClick(){
        this.$refs.scroll.scrollTo(0,0)
      },
      contentScroll(position){
        this.isShowBackTop = (-position.y) > 1000
      },
      loadMore(){
        this.getHomeGoods(this.currentType)
        this.$refs.scroll.scroll.refresh()
      },

      /**
       * 网络请求相关方法
       */
      getHomeMultidata(){
        getHomeMultidata().then(res => {
        this.banners = res.data.data.banner.list
        this.recommends = res.data.data.recommend.list
      })},
      getHomeGoods(type){
        const page = this.goods[type].page + 1
        getHomeGoods(type,page).then(res => {
          this.goods[type].list.push(...res.data.data.list)
          this.goods[type].page += 1
          this.$refs.scroll.finishPullUp()
      })}
    }
  }
</script>
<style scoped>
  #home{
    padding-top: 44px;
    height: 100vh;
    position: relative;
  }
  #home .home-nav{
    background-color: var(--color-tint);
    color: #fff;
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    z-index: 7;
  }
  .tab-control{
    position: sticky;
    top: 44px;
    z-index: 7;
  }
  .content{
    position: absolute;
    overflow: hidden;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }
</style>
