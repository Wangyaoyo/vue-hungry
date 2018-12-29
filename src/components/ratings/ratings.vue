<template>
	<div class="ratings"  ref="ratingsWrapper">
    <div class="ratings-content">
      <div class="overview">
        <div class="overview-left">
          <h1 class="score">{{seller.score}}</h1>
          <div class="title">综合评分</div>
          <div class="rank">高于周边商家{{seller.rankRate}}%</div>
        </div>
        <div class="overview-right">
          <div class="score-wrapper">
            <span class="title">服务态度</span>
            <star :size="36" :score="seller.serviceScore"></star>
            <span class="score">{{seller.serviceScore}}</span>
          </div>
          <div class="score-wrapper">
            <span class="title">商品评分</span>
            <star :size="36" :score="seller.foodScore"></star>
            <span class="score">{{seller.foodScore}}</span>
          </div>
          <div class="delevery-wrapper">
            <span class="title">送达时间</span>
            <span class="time">{{seller.deliveryTime}}分钟</span>
          </div>
        </div>
      </div>
      <split></split>
      <ratingselect @typeselected="changeType" @onlyconchanged="changeonlycontent"
      :ratings="ratings" :select-type="selectType" :only-content="onlyContent" :desc="desc"></ratingselect>
      <div class="rating-wrapper">
        <ul>
          <li  v-for="rating in ratings" v-show="needShow(rating.rateType,rating.text)" class="rating-item">
            <div class="avatar">
              <img width="28" height="28" :src="rating.avatar"/>
            </div>
            <div class="content">
              <h1 class="name">{{rating.username}}</h1>
              <div class="star-wrapper">
                <star :size="24" :score="rating.score"></star>
                <span class="delivary" v-show="rating.deliveryTime">{{rating.deliveryTime}}分钟送达</span>
              </div>
              <p class="text">{{rating.text}}</p>
              <div class="recommond" v-show="rating.recommend && rating.recommend.length>0">
                <span class="icon-thumb_up"></span>
                <span v-for="item in rating.recommend" class="item">{{item}}</span>
              </div>
              <div class="time">{{rating.rateTime | formatDate}}</div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
    import BScroll from 'better-scroll';
    import star from 'components/star/star';
    import ratingselect from 'components/ratingselect/ratingselect';
    import split from 'components/split/split';
    import {formatDate} from 'common/js/date';

    const POSITIVE = 0;
    const NEGATIVE = 1;
    const ALL = 2;
    const ERR_OK = 0;
    export default {
      props:{
        seller:{
          type:Object
        }
      },
      created(){
        this.$http.get('/api/ratings').then((response) => {
          response = response.body;
          if(response.errno === ERR_OK){
            this.ratings = response.data;
            console.log(this.ratings);
            this.$nextTick(() => {
              /* 在nextTick中调用以防内容还未加载完就执行，获取不到元素导致无法滑动*/
              this.scroll = new BScroll(this.$refs.ratingsWrapper,{
                click : true
              });
            });
          }
        })
      },
      filters:{
        formatDate(time){
          let date = new Date(time);
          return formatDate(date,'yyyy-MM-dd hh:mm');
        }
      },
      data(){
        return {
          ratings:[],
          showFlag:false,
          selectType:ALL,
          onlyContent:true,
          desc:{
            all:'全部',
            positive:'满意',
            negative:'不满意'
          }
        }
      },
      components:{
        star,
        ratingselect,
        split
      },
      methods:{
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
      }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"
  @import "../../../static/css/reset.css"

  .ratings
    position absolute
    top 174px
    bottom 0
    width 100%
    left 0
    overflow hidden
    .overview
      display flex
      padding 18px 0
      .overview-left
        /* 解决适配问题:适配iphone5 */
        @media only screen and (max-width:320px)
          flex 0 0 120px
          width 120px
        flex 0 0 130px
        width 130px
        border-right 1px solid rgba(7,17,27,0.1)
        text-align center
        padding 6px 0
        .score
          margin-bottom 6px
          line-height 28px
          font-size 24px
          color rgb(255,153,0)
        .title
          margin-bottom 8px
          line-height 12px
          font-size 12px
          color rgb(7,17,27)
        .rank
          font-size 10px
          line-height 10px
          color rgb(147,153,159)
      .overview-right
        flex 1
        padding 6px 0 6px 24px
        /* 适配iphone5 */
        @media only screen and (max-width:320px)
          padding-left 6px
        .score-wrapper
          margin-bottom 8px
          font-size 0
          .title
            line-height 18px
            /* 图片与文字是不一样的结构，要加对齐方式 */
            vertical-align top
            color rgb(7,17,27)
            font-size 12px
          .star
            vertical-align top
            display inline-block
            margin 0 12px
          .score
            vertical-align top
            display inline-block
            line-height 18px
            font-size 12px
            color rgb(255,153,0)
        .delevery-wrapper
          font-size 0
          .title
            line-height 18px
            vertical-align top
            color rgb(7,17,27)
            font-size 12px
          .time
            font-size 12px
            line-height 18px
            color rgb(147,153,159)
            margin-left 12px
    .rating-wrapper
      padding 0 18px
      .rating-item
        display flex
        border-1px(rgba(7,17,27,0.1))
        padding 18px 0
        .avatar
          flex 0 0 28px
          width 28px
          margin-right 12px
          img
            border-radius 50%
        .content
          position relative
          flex 1
          .name
            line-height 12px
            font-size 10px
            color rgb(7,17,27)
            margin-bottom 4px
          .star-wrapper
            margin-bottom 6px
            font-size 0
            .delivary
              font-size 10px
              line-height 12px
              color rgb(147,153,159)
              font-weight 200
              vertical-align top
              display inline-block
            .star
              display inline-block
              margin-right 6px
          .text
            font-size 12px
            line-height 18px
            color rgb(7,17,27)
            margin-bottom 8px
          .recommond
            font-size 0
            line-height 16px
            .icon-thumb_up, .item
              display inline-block
              margin 0 8px 4px 0
              font-size 9px
            .icon-thumb_up
              font-size 12px
              line-height 16px
              color rgb(0,160,220)
            .item
              padding 0 6px
              border solid 1px rgba(7,17,27,0.1)
              border-radius 1px
              color rgb(147,153,159)
              background-color #fff
          .time
            position absolute
            top 0
            right 0
            font-size 10px
            line-height 12px
            font-weight 200
            color rgb(147,153,159)
</style>
