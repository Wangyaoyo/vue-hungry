<template>
  <div>
    <div class="shopcart">
      <!-- 购物车底栏 -->
      <div class="content" @click="toggleList">
        <div class="content-left">
          <div class="logo-wrapper">
            <div class="logo" :class="{'highlight':totalCount>0}">
              <i class="icon-shopping_cart" :class="{'highlight':totalCount>0}"></i>
            </div>
            <div v-show="totalCount>0" class="num">{{totalCount}}</div>
          </div>
          <div class="price" :class="{'highlight':totalPrice>0}">
            ￥{{totalPrice}}
          </div>
          <div class="desc">
            另需配送费￥{{deliveryPrice}}元
          </div>
        </div>
        <div class="content-right">
          <div class="pay" :class="payClass" @click.stop.prevent="pay">{{payDesc}}</div>
        </div>
      </div>
      <!-- 小球 -->
      <div class="ball-container">
        <transition-group name="drop">
          <div class="ball" v-for="(ball,index) in balls" :key="index" v-show="ball.show">
            <div class="inner inner-hook"></div>
          </div>
        </transition-group>
      </div>
      <!-- 购物车详情页 -->
      <transition name="fold">
        <div class="shopcart-list" v-show="listShow">
          <div class="list-header">
            <h1 class="title">购物车</h1>
            <span class="empty" @click="empty">清空</span>
          </div>
          <div class="list-content" ref="listContent">
            <ul>
              <li class="food border-1px" v-for="food in selectFoods">
                <span class="name">{{food.name}}</span>
                <div class="price">
                  <span>￥{{food.price*food.count}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <cartcontrol :food="food"></cartcontrol>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </transition>
    </div>
    <!-- 购物车详情弹出时的遮罩 -->
    <transition name="fade">
      <div class="list-mask" v-show="listShow" @click="toggleList"></div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  import Cartcontrol from "../cartcontrol/cartcontrol";
  import BScroll from "better-scroll";

  export default {
    components: {
      Cartcontrol
    },
    /* 传过来的属性 */
    props: {
      selectFoods: {
        type: Array,
        /* 如果type是数组或者对象，默认值就是一个函数 */
        default() {
          return [];
        }
      },
      minPrice: {
        type: Number,
        default: 0
      },
      deliveryPrice: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        /* 数组的元素用来维护当前小球的状态 */
        balls: [{
          show: false
        }, {
          show: false
        }, {
          show: false
        }, {
          show: false
        }, {
          show: false
        }],
        dropBalls: [],
        /* 购物车详情页 折叠变量*/
        fold: false
      }
    },
    computed: {
      totalPrice() {
        let total = 0;
        this.selectFoods.forEach((food) => {
          total += food.price * food.count;
        });
        return total;
      },
      totalCount() {
        let count = 0;
        this.selectFoods.forEach((food) => {
          count += food.count;
        });
        return count;
      },
      payDesc() {
        /* JS中建议用全等，两等时可能会转化导致坑 */
        if (this.totalPrice === 0) {
          return `￥${this.minPrice}元起送`;
        } else if (this.totalPrice < this.minPrice) {
          let diff = this.minPrice - this.totalPrice;
          return `还差￥${diff}元起送`;
        } else {
          return '去结算';
        }
      },
      payClass() {
        if (this.totalPrice < this.minPrice) {
          return 'not-enough';
        } else {
          return 'enough';
        }
      },
      listShow() {
        if (!this.totalCount) {
          this.fold = true;
          return false;
        }
        let show = !this.fold;
        /* 为better-scroll做初始化 */
        if(show){
          this.$nextTick(() => {
            if(!this.scroll){
              this.scroll = new BScroll(this.$refs.listContent,{
                click:true
              });
            }else {
              /* 重新计算better-scroll */
             this.scroll.refresh();
            }
          });
        }
        return show;
      }
    },
    methods: {
      drop(elm) {
        // console.log(elm);
        for (let i = 0; i < this.balls.length; i++) {
          let ball = this.balls[i];
          if (!ball.show) {
            ball.show = true;
            ball.el = elm;
            this.dropBalls.push(ball);
            //找到 跳出循环
            return;
          }
        }
      },
      beforeEnter(el) {
        /*console.log(window.innerHeight);
		console.log(window.innerWidth);
		let count = this.balls.length;
		while(count--){
		  let ball = this.balls[count];
		  if(ball.show){
			// ??？
			let rect = ball.el.getBoundingClientRect();
			let x = rect.left - 32;
			let y = -(window.innerHeight - rect.top - 22);
			el.style.display = '';
			el.style.webkitTransform = `translate3d(0,$(y)px,0)`;
			el.style.transform = `translate3d(0,$(y)px,0)`;
			let inner = el.getElementsByClassName('inner-hook')[0];
			inner.style.webkitTransform = `translate3d(0,$(y)px,0)`;
			inner.style.transform = `translate3d(0,$(y)px,0)`;
		  }
		}*/
      },
      enter(el) {

      },
      afterEnter(el) {

      },
      toggleList() {
        if (!this.totalCount) {
          return;
        }
        this.fold = !this.fold;
      },
      empty(){
        /* 置零selectFood没有用 */
        this.selectFoods.forEach((food) => {
          food.count = 0;
        });
      },
      pay(){
        if(this.totalPrice<this.minPrice){
          return;
        }
        window.alert(`支付${this.totalPrice}元`);
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"
  .shopcart
    /* 定位于相对浏览器窗口的指定坐标 */
    position fixed
    left 0
    bottom 0
    z-index 50
    width 100%
    height 48px
    .content
      display flex
      background-color #141d27
      color rgba(255, 255, 255, 0.4)
      .content-left
        flex 1
        font-size 0
        .logo-wrapper
          display inline-block
          position relative
          top -10px
          margin 0 12px
          padding 6px
          width 56px
          height 56px
          box-sizing border-box
          vertical-align top
          /*  画一个圆  */
          border-radius 50%
          background-color #141d27
          .logo
            width 100%
            height 100%
            border-radius 50%
            background #2b343c
            text-align center
            &.highlight
              background rgb(0, 160, 220)
            .icon-shopping_cart
              font-size 24px
              line-height 44px
              color #80858a
              &.highlight
                color #fff
          .num
            position absolute
            top 0
            right 0
            height 16px
            width 24px
            line-height 16px
            text-align center
            border-radius 16px
            font-size 9px
            font-weight 700
            color #fff
            background-color red
            /* 阴影*/
            box-shadow 0 4px 8px 0 rgba(0, 0, 0, 0.4)
        .price
          display inline-block
          vertical-align top
          line-height 24px
          margin-top 12px
          padding-right 12px
          box-sizing border-box
          border-right 1px solid rgba(255, 255, 255, 0.1)
          font-weight 700
          font-size 16px
          &.highlight
            color #fff
        .desc
          font-size 10px
          display inline-block
          vertical-align top
          margin 12px 0 0 12px
          line-height 24px
      .content-right
        flex 0 0 105px
        width 105px
        background #2b333c
        .pay
          font-size 12px
          height 48px
          line-height 48px
          text-align center
          font-weight 700
          &.not-enough
            background #2b333c
          &.enough
            background #00b43c
            color #fff
    .ball-container
      .ball
        position fixed
        left 32px
        bottom 22px
        z-index 200
        &.drop-transition
          transition all 0.4s
          .inner
            width 16px
            height 16px
            border-radius 50%
            background rgb(0, 160, 220)
            transition all 0.4s
    .shopcart-list
      position absolute
      top 0
      left 0
      z-index -1
      width 100%
      /* 是为了让子元素以自身内容，往上撑开自己的文本内容*/
      transform translate3d(0, -100%, 0)
      &.fold-enter-active, &.fold-leave-active
        transition all 0.5s ease
        transform translate3d(0, -100%, 0)
      &.fold-enter, &.fold-leave-to
        transform translate3d(0, 0, 0)
      .list-header
        height 40px
        background-color #f3f5f7
        padding 0 18px
        line-height 40px
        overflow hidden
        border-bottom 1px solid rgba(7,17,27,0.1)
        .title
          font-size 14px
          font-weight 200px
          color rgb(7,17,27)
          display inline-block
          float left
        .empty
          font-size 12px
          color rgb(0,160,220)
          float right
      .list-content
        background-color #fff
        max-height 217px
        padding 0 18px
        /* 没有它滚动时会超出该区域 */
        overflow hidden
        .food
          position relative
          padding 12px 0
          box-sizing border-box
          line-height 24px
          border-1px(rgba(7,17,27,0.1))
          .name
            color rgb(7,17,27)
          .price
            position absolute
            right 90px
            bottom 12px
            color rgb(240,20,20)
            font-weight 700
          .cartcontrol-wrapper
            position absolute
            right 0
            bottom 2px

  .list-mask
    position fixed
    top 0
    left 0
    height 100%
    width 100%
    z-index 40
    opacity 1
    background rgba(7,17,27,0.6)
    /* 设置透明的效果 */
    backdrop-filter blur(10px)
    &.fade-enter-active, &.fade-leave-active
      opacity 1
      background rgba(7,17,27,0.6)
      transition opacity 0.5s
    &.fade-enter, &.fade-leave-to
      opacity 0
      background rgba(7,17,27,0)
</style>
