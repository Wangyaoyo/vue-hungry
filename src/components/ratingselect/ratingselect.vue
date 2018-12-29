<template>
  <div class="ratingselect">
    <div class="rating-type border-1px">
      <span class="block positive" @click="select(2,$event)" :class="{'active':selectedType===2}">{{desc.all}}<span class="count">{{ratings.length}}</span></span>
      <span class="block positive" @click="select(0,$event)" :class="{'active':selectedType===0}">{{desc.positive}}<span class="count">{{positives.length}}</span></span>
      <span class="block negative" @click="select(1,$event)" :class="{'active':selectedType===1}">{{desc.negative}}<span class="count">{{ratings.length-positives.length}}</span></span>
    </div>
    <div class="switch" @click="toggleContent" :class="{'on':onlyedContent}">
      <span class="icon-check_circle"></span>
      <span class="text">只看有内容的评价</span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
    const POSITIVE = 0;
    const NEGATIVE = 1;
    const ALL = 2;

    export default {
      props:{
        ratings:{
          type:Array,
          default(){
            return [];
          }
        },
        selectType:{
          type:Number,
        },
        onlyContent:{
          type:Boolean,
          default:false
        },
        desc:{
          type:Object,
          default(){
            return {
              all:'全部',
              positive:'满意',
              negative:'不满意'
            }
          }
        }
      },
      computed:{
        positives(){
          /* 这个过滤器不是很懂 */
          return this.ratings.filter((rating) => {
            return rating.rateType === POSITIVE;
          })
        }
      },
      data(){
        return{
          /* 在VUE2.0中，子组件不得修改父组件传过来的值，如果需要修改，需要经过新变量重新传递 */
          selectedType:this.selectType,
          onlyedContent:this.onlyContent
        }
      },
      methods:{
        select(type,event){
          if(!event._constructed){
            return;
          }
          this.selectedType = type;
          this.$emit('typeselected',this.selectedType);
        },
        toggleContent(){
          this.onlyedContent = !this.onlyedContent;
          this.$emit('onlyconchanged',this.onlyedContent);
        }
      }
    };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"

  .ratingselect
    .rating-type
      padding 18px 0
      margin 0 18px
      border-1px(rgba(7,17,27,0.1))
      font-size 0
      .block
        /* inline-block会有间隙问题*/
        display inline-block
        padding 8px 12px
        border-radius 1px
        margin-right 8px
        font-size 12px
        line-height 16px
        color rgb(77,85,93)
        .count
          font-size 8px
          margin-left 2px
        &.active
          color #fff
        &.positive
          background-color rgba(0,160,220,0.2)
          &.active
            background-color rgb(0,160,220)
        &.negative
          background-color rgba(77,85,93,0.2)
          &.active
            background-color rgb(77,85,93)
    .switch
      padding 12px 18px
      line-height 24px
      border-bottom 1px solid rgba(7,17,27,0.1)
      color rgb(147,153,159)
      font-size 0
      &.on
        .icon-check_circle
          color #00c850
      .icon-check_circle
        font-size 24px
        margin-right 4px
      .text
        display inline-block
        vertical-align top
        font-size 12px
</style>
