<template>
  <transition name="move">
    <div v-show="showFlag" class="food" ref="Food">
      <div class="food-content">
        <div class="img-header">
          <img :src="food.image"/>
          <div class="back" @click="hide">
            <i class="icon-arrow_lift"></i>
          </div>
        </div>
        <div class="content">
          <h1 class="title">{{food.name}}</h1>
          <div class="detail">
            <span class="sell-count">月售{{food.sellCount}}</span>
            <span class="rating">好评率{{food.rating}}%</span>
          </div>
          <div class="price">
            <span class="now">￥{{food.price}}</span><span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
          </div>
          <div class="cartcontrol-wrapper">
            <cartcontrol :food="food"></cartcontrol>
          </div>
          <div class="buy" @click.stop.prevent="addFirst($event)" v-show="!food.count || food.count == 0">加入购物车</div>
        </div>
        <split v-show="food.info"></split>
        <div class="info" v-show="food.info">
          <h1 class="title">商品信息</h1>
          <p class="text">{{food.info}}</p>
        </div>
        <split v-show="food.ratings"></split>
        <div class="rating">
          <h1 class="title">商品评价</h1>
          <ratingselect @typeselected="changeType" @onlyconchanged="changeonlycontent" :ratings="food.ratings" :select-type="selectType" :only-content="onlyContent" :desc="desc"></ratingselect>
        </div>
        <div class="rating-wrapper">
          <ul v-show="food.ratings && food.ratings.length">
            <li v-show="needShow(rating.rateType,rating.text)" v-for="rating in food.ratings" class="rating-item border-1px">
              <div class="time">{{rating.rateTime | formatDate}}</div>
              <div class="user">
                <span class="name">{{rating.username}}</span>
                <img class="avatar" width="12" height="12" :src="rating.avatar">
              </div>
              <p class="txt">
                <span :class="{'icon-thumb_up':rating.rateType===0,'icon-thumb_down':rating.rateType===1}"></span>
                <span class="">{{rating.text}}</span>
              </p>
            </li>
          </ul>
          <div class="no-rating" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
    import BScroll from 'better-scroll';
    import cartcontrol from 'components/cartcontrol/cartcontrol';
    import Vue from 'vue';
    import split from 'components/split/split';
    import ratingselect from 'components/ratingselect/ratingselect'
    import {formatDate} from 'common/js/date';

    const POSITIVE = 0;
    const NEGATIVE = 1;
    const ALL = 2;

    export default {
      props:{
        food:{
          type:Object
        }
      },
      data(){
        return{
          showFlag:false,
          selectType:ALL,
          onlyContent:true,
          desc:{
            all:'全部',
            positive:'推荐',
            negative:'吐槽'
          }
        }
      },
      filters:{
        formatDate(time){
          let date = new Date(time);
          return formatDate(date,'yyyy-MM-dd hh:mm');
        }
      },
      methods:{
        show(){
          this.showFlag = true;
          this.selectType = ALL;
          this.onlyContent = true;
          /* 添加better scroll一定要用nextTick*/
          this.$nextTick(() => {
            if(!this.scroll){
              this.scroll = new BScroll(this.$refs.Food,{
                click:true
              });
            }else{
              this.scroll.refresh();
            }
          });
        },
        hide(){
          this.showFlag = false;
        },
        addFirst(event){
          /* 防止PC多次点击 */
          if(!event._constructed){
            return;
          }
          /* 引入vue 添加商品 */
          Vue.set(this.food,'count',1);
        },
        /* 子组件的改变通知父组件 */
        changeType(type){
          this.selectType = type;
          /* 数据长度的改变better-scroll dom没有更新，vue的dom更新时异步的，刷新要在异步更新之后 */
          this.$nextTick(() => {
            this.scroll.refresh();
          });
        },
        changeonlycontent(flag){
          this.onlyContent = flag;
          this.$nextTick(() => {
            this.scroll.refresh();
          });
        },
        /* ？？？v-show 绑定的函数：给每一个li绑定当前选择的类型和li中的类型一致时才显示 */
        needShow(type,text){
          /* 只显示有内容的 且 内容为空*/
          if(this.onlyContent && !text){
            return false;
          }
          if(this.selectType === ALL){
            return true;
          }else{
            /*当前类型要和评价类型一致才能被显示 */
            return type === this.selectType;
          }
        }
      },
      components:{
        cartcontrol,
        split,
        ratingselect
      }
    };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"
  .food
    position fixed
    left 0
    top 0
    bottom 48px
    z-index 30
    width 100%
    background-color #fff
    &.move-enter-active,&.move-leave-active
      transition all 0.5s
      transform translate3d(0,0,0)
    &.move-enter,&.move-leave-to
      transform translate3d(100%,0,0)
    .food-content
      .img-header
        position relative
        width 100%
        height 0
        /* ?????  此时相对于盒子的宽度计算 使之成为宽高相等的容器*/
        padding-top 100%
        img
          position absolute
          top 0
          left 0
          width 100%
          height 100%
        .back
          position absolute
          top 10px
          left 0
          .icon-arrow_lift
            display block
            padding 10px
            font-size 20px
            color #fff

      .content
        position relative
        padding 18px
        .title
          line-height 14px
          margin-bottom 8px
          font-size 14px
          font-weight 700
          color rgb(7,17,27)
        .detail
          font-size 0
          line-height 10px
          margin-bottom 18px
          height 10px
          .sell-count,.rating
            font-size 10px
            color rgb(147,153,159)
          .sell-count
            margin-right 12px
        .price
          line-height 24px
          padding-top 4px
          .now
            font-weight 700
            margin-right 8px
            font-size 14px
            color rgb(240,20,20)
          .old
            font-weight 700
            text-decoration line-through
            font-size 10px
            color rgb(147,153,159)

        .cartcontrol-wrapper
          position absolute
          right 12px
          bottom 12px
        .buy
          position absolute
          right 18px
          bottom 18px
          z-index 10
          line-height 24px
          padding 0 12px
          box-sizing border-box
          font-size 10px
          border-radius 12px
          color #fff
          background-color rgb(0,160,220)

      .info
        padding 18px
        .title
          margin-bottom 16px
          font-size 14px
          color rgb(7,17,27)
        .text
          line-height 24px
          font-size 12px
          padding 0 8px
          color rgb(77,85,93)

      .rating
        padding-top 18px
        .title
          line-height 14px
          margin-left 18px
          font-size 14px
          color rgb(7,17,27)
      .rating-wrapper
        padding 0 18px
        .rating-item
          position relative
          padding 16px 0
          border-1px(rgba(7,17,27,0.1))
          .user
            position absolute
            right 0
            top 16px
            font-size 0
            line-height 12px
            .name
              font-size 10px
              color rgb(147,153,159)
              display inline-block
              vertical-align top
              margin-right 6px
            .avatar
              border-radius 50%
          .time
            margin-bottom 6px
            font-size 10px
            line-height 12px
            color rgb(147,153,159)
          .txt
            line-height 16px
            font-size 12px
            color rgb(7,17,27)
            .icon-thumb_up, .icon-thumb_down
              margin-right 4px
              line-height 16px
              font-size 12px
            .icon-thumb_up
              color rgb(0,160,220)
            .icon-thumb_down
              color rgb(147,153,159)
        .no-rating
          font-size 12px
          padding 16px 0
          color rgb(147,153,159)
</style>
