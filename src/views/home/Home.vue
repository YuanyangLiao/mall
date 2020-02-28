<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
    <tab-control :titles="['流行','新款','精选']"
                   @tabCLick="tabCLick"
                   ref="tabControl1"
                   class="tab-control"
                   v-show="isTabFixed"/>
    <scroll class="content" 
            ref="scroll" 
            :probe-type="3" 
            @scroll="contentScroll"
            :pull-up-load="true"
            @pullingUp='loadMore'>
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"/>
      <home-recommend-view :recommends="recommends"/>
      <feature-view/>
      <tab-control :titles="['流行','新款','精选']"
                   @tabCLick="tabCLick"
                   ref="tabControl2"/>
      <goods-list :goods="showGoods"/>
    </scroll>

    <back-top @click.native="backClick" v-show="isShowBackTop"/>
  </div>
</template>

<script>
  /**
   * 组件
   */
  import NavBar from 'components/common/navbar/NavBar'  // 导航栏
  import HomeSwiper from './childComps/HomeSwiper'  // 轮播图
  import HomeRecommendView from './childComps/HomeRecommendView'  // 推荐
  import FeatureView from './childComps/FeatureView'  // 特色
  import TabControl from 'components/content/tabControl/TabControl' // 控制栏
  import GoodsList from 'components/content/goodsList/GoodsList'  // 商品列表
  import Scroll from 'components/common/scroll/Scroll'  // 滚动插件
  import BackTop from 'components/content/backTop/BackTop'  // 回到顶部
  /**
   * 函数
   */
  import {debounce} from 'common/utils' // 防抖动
  import {getHomeMultidata,getHomeGoods} from 'network/home'  // 网络请求
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
        isShowBackTop:false,
        tabOffsetTop:0,
        isTabFixed:false
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
      const refresh = debounce(this.$refs.scroll.refresh,50) // 调用防抖动方法，降低刷新频率
      this.$bus.$on('itemImageLoad',()=>{   // 通过事件总线监听事件
        refresh()
      })
      
    },
    methods: {
      /**
       * 事件监听相关方法
       */
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
        this.$refs.tabControl1.currentIndex = index
        this.$refs.tabControl2.currentIndex = index
      },
      backClick(){
        this.$refs.scroll.scrollTo(0,0)
      },
      contentScroll(position){
        // 判断BackTop是否显示
        this.isShowBackTop = (-position.y) > 1000

        // 决定tabControl是否吸顶（position:fixed）
        this.isTabFixed = (-position.y) > this.tabOffsetTop
      },
      loadMore(){
        this.getHomeGoods(this.currentType)
        this.$refs.scroll.scroll.refresh()
      },
      swiperImageLoad(){
        // 获取tabControl的offsetTop
        // 获取组件中的元素需要通过：$el
        this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop
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
          this.$refs.scroll.finishPullUp()  // 完成上拉加载更多
      })}
    }
  }
</script>
<style scoped>
  #home{
    /* padding-top: 44px; */
    height: 100vh;
    position: relative;
  }
  #home .home-nav{
    background-color: var(--color-tint);
    color: #fff;
    /* position: fixed;
    top: 0;
    right: 0;
    left: 0;
    z-index: 7; */
  }
  .content{
    position: absolute;
    overflow: hidden;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }
  .tab-control{
    position: relative;
    z-index: 9;
  }
</style>
