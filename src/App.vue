<template>
  <div>
    <v-header :seller="seller"></v-header>
    <div class="tab border-1px">
      <div class="tab-item">
        <router-link :to="{path:'/goods'}">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link :to="{path:'/ratings'}">评论</router-link>
      </div>
      <div class="tab-item">
        <router-link :to="{path:'/seller'}">商家</router-link>
      </div>
    </div>
    <!-- 在组件切换过程中，能够将状态保存，无需重新渲染DOM
      实现原理：将状态缓存到内存
    -->
    <keep-alive><router-view :seller="seller"></router-view></keep-alive>
  </div>
</template>

<script type="text/ecmascript-6">
  import header from 'components/header/header.vue';
  const ERR_OK = 0;
  const debug = process.env.NODE_ENV !== 'production'
  export default {
    data() {
      return {
        seller: {}
      };
    },
    created() {
      const url = debug ? '/api/seller' : 'http://39.105.52.64/sell/api/seller'
      this.$http.get(url).then((response) => {
        response = response.body;
        if(response.errno === ERR_OK){
          this.seller = response.data;
        }
    });
    },
    components: {
      'v-header':header
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "./common/stylus/mixin.styl"
    .tab
      display:flex
      width: 100%
      height:40px
      line-height :40px
      border-1px:(rgba(7,17,27,0.1))
      .tab-item
        flex :1
        text-align:center
        /* tab 下面的链接a */
        & > a
          display : block
          text-decoration : none
          font-size : 14px
          color : rgb(77,85,93)
          &.active
            color : rgb(240,20,20)

</style>
