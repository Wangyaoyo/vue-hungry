<template>
  <div>
    <div class="goods">
      <div class="menu-wrapper" ref="menuWrapper">
        <ul>
          <li v-for="(item,index) in goods" class="menu-item" :class="{'current':currentIndex === index}" @click="selectMenu(index,$event)">
            <span class="text border-1px">
              <span v-show="item.type > 0" class="icon" :class="classMap[item.type]"></span>
              {{item.name}}
            </span>
          </li>
        </ul>
      </div>

      <div class="foods-wrapper" ref="foodsWrapper">
        <ul>
          <li v-for="item in goods" class="food-list food-list-hook">
            <h1 class="title">{{item.name}}</h1>
            <ul>
              <li v-for="food in item.foods" @click="selectfood(food,$event)" class="food-item border-1px">
                <div class="icon">
                  <img height="57px" width="57px" :src="food.icon"/>
                </div>
                <div class="content">
                  <h2 class="name">{{food.name}}</h2>
                  <p class="desc">{{food.description}}</p>
                  <div class="extra">
                    <span class="cnt">月售{{food.sellCount}}份</span>
                    <span>好评率{{food.rating}}%</span>
                  </div>

                  <div class="price">
                    <span class="now">￥{{food.price}}</span>
                    <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                  </div>
                  <div class="cartcontrol-wrapper">
                    <cartcontrol :food="food" @cartadd="testadd"></cartcontrol>
                  </div>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>

      <shopcart ref="shopcart" :select-foods="selectFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></shopcart>
    </div>
    <food :food="selectedFood" ref="Food"></food>
  </div>
</template>

<script type="text/ecmascript-6">
    import BScroll from 'better-scroll';
    import shopcart from 'components/shopcart/shopcart'
    import cartcontrol from 'components/cartcontrol/cartcontrol'
    import food from 'components/food/food'

    const ERR_OK = 0;

    export default {
      props:{
        seller:{
          type:Object
        }
      },
      data(){
        return{
          goods:[],
          listHeight:[],
          scrollY: 0,
          selectedFood:{}
        }
      },
      computed:{
        /* 计算滚动的位置 */
        currentIndex(){
          for(let i=0; i<this.listHeight.length; i++){
            let heightPre = this.listHeight[i];
            let heightNex = this.listHeight[i+1];
            if(!heightNex || (this.scrollY >= heightPre && this.scrollY < heightNex)){
              return i;
            }
          }
          return 0;
        },
        selectFoods(){
          let foods = [];
          this.goods.forEach((good) => {
            good.foods.forEach((food) => {
              if(food.count){
                foods.push(food);
              }
            });
          });
          return foods;
        }
      },
      created(){
        this.classMap = ['decrease','discount','special','invoice','guarantee'];
        this.$http.get('/api/goods').then((response) => {
          response = response.body;
          if(response.errno === ERR_OK){
            this.goods = response.data;
            /* 等待DOM渲染完毕执行的函数 */
            this.$nextTick(() => {
              /* 在nextTick中调用以防内容还未加载完就执行，获取不到元素导致无法滑动*/
              this._initScroll();
              this._calculateHeigth();
            });
          }
        });
      },
      methods:{
        _initScroll(){
          /*this.$refs：方便操作dom,获得dom对象传参*/
          this.menuScroll = new BScroll(this.$refs.menuWrapper,{
            click: true
          });
          this.foodsScroll = new BScroll(this.$refs.foodsWrapper,{
            click: true,
            /* 希望scroll在滚动时实时告诉我们位置 ：探针 */
            probeType: 3
          });

          this.foodsScroll.on('scroll',(pos)=>{
            /* 获得scrollY */
            this.scrollY = Math.abs(Math.round(pos.y));
          });
        },
        _calculateHeigth(){
          let foodList = this.$refs.foodsWrapper.getElementsByClassName
          ('food-list-hook');
          let height = 0;
          this.listHeight.push(height);
          for(let i = 0; i<foodList.length; i++){
            let item = foodList[i];
            height+=item.clientHeight;
            this.listHeight.push(height);
          }
        },
        selectMenu(index,event){
          /* 在PC页面时会派发两次点击事件：浏览器原生的点击事件没有该属性，自定义派发时该属性为true*/
          if(!event._constructed){
            return;
          }
          let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
          let el = foodList[index];
          /* scrollToElement ：滑动到某个元素 ，速度*/
          this.foodsScroll.scrollToElement(el,300);
        },
        testadd(tag){
          /* 用refs访问子组件1并接收到子组件2发来的元素tag传递给111 */
          this.$refs.shopcart.drop(tag);
        },
        selectfood(food,event){
          /* 在PC页面时会派发两次点击事件：浏览器原生的点击事件没有该属性，自定义派发时该属性为true*/
          if(!event._constructed){
            return;
          }
          this.selectedFood = food;
          /* 调用子组件的show方法 */
          this.$refs.Food.show();
        }
      },
      /* 注册购物车组件 */
      components:{
        shopcart,
        cartcontrol,
        food
      }
    };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"
  @import "../../../static/css/reset.css"

  .goods
    display flex
    /* 原因：绝对定位 距上面174px 距下面46px*/
    position absolute
    width 100%
    top 174px
    /*底栏的高度*/
    bottom 48px
    overflow hidden
    .menu-wrapper
      flex 0 0 80px
      width 80px
      background-color #f3f5f7
      overflow hidden
      .menu-item
        /* 该属性可以做到多行垂直居中 */
        display table
        height 56px
        line-height 14px
        font-weight 200
        width 56px
        padding 0 12px
        /* 这里存在图片无法显示的问题 */
        .icon
          display inline-block
          width 12px
          height 12px
          margin-right 2px
          background-size 12px 12px
          background-repeat no-repeat
          &.decrease
            bg-image('decrease_3')
          &.discount
            bg-image('discount_3')
          &.guarantee
            bg-image('guarantee_3')
          &.invoice
            bg-image('invoice_3')
          &.special
            bg-image('special_3')
        &.current
          background-color #fff
          font-weight 700
          z-index 10
          /* 向上偏移1px */
          margin-top -1px
          .text
            border-none()
        .text
          display table-cell
          width 56px
          vertical-align middle
          border-1px(rgba(7,17,27,0.1))
          font-size 12px
    .foods-wrapper
      flex 1
      overflow hidden
      .title
        padding-left 14px
        height:26px
        line-height 26px
        font-size 12px
        color rgb(147,153,159)
        background-color #f3f5f7
        border-left solid 2px #d9dde1
      .food-item
        display flex
        overflow hidden
        margin 18px
        padding-bottom 18px
        border-1px(rgba(7,17,27,0.1))
        &:last-child
          border-none()
          margin-bottom 0
        .icon
          flex 0 0 57px
          margin-right 10px
        .content
          flex 1
          .name
            height 14px
            line-height 14px
            margin 2px 0 8px 0
            font-size 14px
            color: rgb(7,17,27)
          .desc, .extra
            font-size 10px
            line-height 10px
            color rgb(147,153,159)
          .desc
            margin-bottom 8px
          .extra
            font-size 12px
            &.cnt
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
            right 0
            bottom 12px

</style>
