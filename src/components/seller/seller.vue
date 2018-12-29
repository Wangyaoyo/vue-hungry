<template>
	<div class="seller" ref="sellerWrapper">
    <div class="seller-content">
      <div class="overview">
        <h1 class="title">{{seller.name}}</h1>
        <div class="desc border-1px">
          <star :size="36" :score="seller.score" class="star"></star>
          <span class="text">({{seller.ratingCount}})</span>
          <span class="text">月售{{seller.sellCount}}单</span>
        </div>
        <ul class="remark">
          <li class="block">
            <h2>起送价</h2>
            <div class="content">
              <span class="stress">{{seller.minPrice}}</span>元
            </div>
          </li>
          <li class="block">
            <h2>商家配送</h2>
            <div class="content">
              <span class="stress">{{seller.deliveryPrice}}</span>元
            </div>
          </li>
          <li class="block">
            <h2>平均配送时间</h2>
            <div class="content">
              <span class="stress">{{seller.deliveryTime}}</span>分钟
            </div>
          </li>
        </ul>
        <div class="favorite" @click="toggleFavorite($event)">
          <span class="icon-favorite" :class="{'active':favorite}"></span>
          <span class="favorite-text">{{favoriteText}}</span>
        </div>
      </div>
      <split></split>
      <div class="bulletin">
        <h1 class="title">公告与活动</h1>
        <div class="content-wrapper">
          <p class="content">{{seller.bulletin}}</p>
        </div>
        <ul v-if="seller.supports" class="supports">
          <li class="support-item" v-for="(item,index) in seller.supports">
            <span class="icon" :class="classMap[seller.supports[index].type]"></span>
            <span class="txt">{{seller.supports[index].description}}</span>
          </li>
        </ul>
      </div>
      <split></split>
      <div class="place">
        <h1 class="title">商家实景</h1>
        <div class="pic-wrapper" ref="picWrapper">
          <ul class="pic-list" ref="piclist">
            <li class="pic-item" v-for="item in seller.pics">
              <img :src="item" class="pic" width="120" height="90"/>
            </li>
          </ul>
        </div>
      </div>
      <split></split>
      <div class="info">
        <h1 class="title">商家信息</h1>
        <ul>
          <li class="info-item" v-for="info in seller.infos">{{info}}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
    /*  格外注意初始化时机 ：样式不准确也会影响滚动  */
    import BScroll from 'better-scroll';
    import star from 'components/star/star';
    import split from 'components/split/split';
    import {urlParse} from "../../common/js/util";

    export default {
      props:{
        seller:{
          /* 一个立即执行函数 */
          /*id:(() => {
            let queryParam = urlParse();
            console.log(queryParam);
          })()*/
        }
      },
      data(){
        return{
          favorite:false
        }
      },
      created() {
        this.classMap = ['decrease','discount','special','invoice','guarantee'];
      },
      mounted(){
        this.$nextTick(() => {
          this._initScroll();
          this._initPics();
        })
      },
      watch:{
        'seller'(){
          this.$nextTick(() => {
            this._initScroll();
            this._initPics();
          })
        }
      },
      computed:{
        favoriteText(){
          return this.favorite ? '已收藏':'收藏';
        }
      },
      methods:{
        _initScroll(){
          if(!this.scroll){
            this.scroll = new BScroll(this.$refs.sellerWrapper,{
              click:true
            });
          }else{
            this.scroll.refresh();
          }
        },
        _initPics(){
          if(this.seller.pics){
            let picWidth = 120;
            let margin = 6;
            let width = (picWidth+margin)*this.seller.pics.length;
            this.$refs.piclist.style.width = width+'px';
            this.$nextTick(() => {
              if(!this.picScroll){
                this.picScroll = new BScroll(this.$refs.picWrapper,{
                  scrollX:true,
                  eventPassthrough:'vertical'
                });
              }else{
                this.picScroll.refresh();
              }
            })
          }
        },
        toggleFavorite(event){
          if(!event._constructed){
            return;
          }else{
            this.favorite = !this.favorite;
          }
        }
      },
      components:{
        star,
        split
      }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"
  @import "../../../static/css/reset.css"

  .seller
    position absolute
    top 174px
    bottom 0
    left 0
    width 100%
    overflow hidden
    .seller-content
      .overview
        position relative
        padding 18px
        .title
          font-size 14px
          color rgb(7,17,27)
          line-height 14px
          margin-bottom 8px
        .desc
          padding-bottom 18px
          font-size 0
          border-1px(rgba(7,17,27,0.1))
          .star
            vertical-align top
            line-height 18px
            display inline-block
            margin-right 8px
          .text
            vertical-align top
            margin-right 12px
            font-size 10px
            line-height 18px
            color rgb(77,85,93)
        .remark
          display flex
          padding-top 18px
          .block
            text-align center
            flex 1
            border-right solid 1px rgba(7,17,27,0.1)
            &:last-child
              border none
            h2
              margin-bottom 4px
              color rgb(147,153,159)
              line-height 10px
              font-size 10px
            .content
              line-height 24px
              font-size 10px
              color rgb(7,17,27)
              .stress
                font-size 24px
        .favorite
          position absolute
          right 11px
          top 18px
          width 50
          .icon-favorite
            display block
            color #d4d6d9
            font-size 24px
            line-height 24px
            &.active
              color rgb(240,20,20)
              margin-bottom 4px
          .favorite-text
            width 40px
            font-size 10px
            line-height 10px
            color rgb(77,85,93)
      .bulletin
        padding 18px 18px 0 18px
        .title
          font-size 14px
          color rgb(7,17,27)
          line-height 14px
          margin-bottom 8px
        .content-wrapper
          padding 0 12px 16px 12px
          border-1px(rgba(7,17,27,0.1))
          .content
            font-size 12px
            font-weight 200
            line-height 24px
            color rgb(240,20,20)
        .supports
          .support-item
            padding 16px 12px
            font-size 0
            border-1px(rgba(7,17,27,0.1))
            &:last-child
              border-none()
            .icon
              display inline-block
              width 16px
              height 16px
              margin-right 6px
              background-size 16px 16px
              background-repeat no-repeat
              &.decrease
                bg-image('decrease_4')
              &.discount
                bg-image('discount_4')
              &.guarantee
                bg-image('guarantee_4')
              &.invoice
                bg-image('invoice_4')
              &.special
                bg-image('special_4')
            .txt
              line-height 16px
              font-size 12px
              vertical-align top
              color rgb(7,17,27)
      .place
        padding 18px 0 18px 18px
        .title
          font-size 14px
          color rgb(7,17,27)
          line-height 14px
          margin-bottom 12px
        .pic-wrapper
          width 100%
          overflow hidden
          /* 不折行 */
          white-space nowrap
          .pic-list
            font-size 0
            .pic-item
              display inline-block
              margin-right 6px
              width 120px
              height 90px
              &:last-child
                margin 0
      .info
        padding 18px 18px 0 18px
        .title
          font-size 14px
          color rgb(7,17,27)
          line-height 16px
          padding-bottom 12px
          border-1px(rgba(7,17,27,0.1))
        .info-item
          border-1px(rgba(7,17,27,0.1))
          padding 16px 12px
          font-size 12px
          line-height 16px
          color rgb(7,17,27)
          font-weight 200
          &:last-child
            border-none()
</style>
