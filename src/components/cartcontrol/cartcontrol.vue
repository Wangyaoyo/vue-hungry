<template>
	<div class="cartcontrol">
    <!-- 待优化：按钮的动画 -->
    <div class="cart-decrease icon-remove_circle_outline" v-show="food.count>0" @click.stop.prevent="decreaseCart($event)"></div>
    <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
    <div class="cart-add icon-add_circle" @click.stop.prevent="addCart($event)"></div>
  </div>
</template>

<script type="text/ecmascript-6">
    import Vue from 'vue';

    export default {
      /* 从父级传入 */
       props:{
         food:{
           type:Object
         }
       },
       methods:{
        addCart(event){
          /* event._constructed 为true表示自定义派发的事件 否则就返回，避免浏览器原生事件 */
          if(!event._constructed){
            return;
          }
          if(!this.food.count){
            /* 添加对象不存在的字段时，用vue的set方法 */
            Vue.set(this.food,'count',1);
          }else{
            this.food.count++;
          }
          /* 向父级传送事件 */
          this.$emit('cartadd',event.target);
        },
         decreaseCart(event){
           /* event._constructed 为true表示自定义派发的事件 否则就返回，避免浏览器原生事件 */
           if(!event._constructed){
             return;
           }
           if(this.food.count > 0){
             this.food.count--;
           }
         }
      }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .cartcontrol
    font-size 0
    .cart-decrease, .cart-add
      display inline-block
      padding 6px
      font-size 24px
      line-height 24px
      color rgb(0,160,220)
    .cart-count
      font-size 10px
      color rgb(147,153,159)
      line-height 24px
      vertical-align top
      padding-top 6px
      text-align center
      width 12px
      height 24px
      display inline-block
  .cart-add
      display inline-block
</style>
