<template>
  <div class="day-card cu-item" 
  :style="{background: data.bg, color: textColor}" 
  :class="{'move-cur': isShowOp}"
  @touchstart="onTouchStart"
  @touchmove="onTouchMove"
  @touchend="onTouchEnd"
  @click="onClickCard">
    <div class="title">{{data.name}}</div>
    <div class="date">{{dateStr}}</div>
    <div class="count-down"><span v-if="data.cycleType != 'none'">剩余</span> 
                            <span v-else>已过</span><span class="count">{{data.dayCount}}</span><span>天</span></div>
    <div class="star" :style="{background: starColor}" v-if="data.status"></div>
    <div class="move">
      <div class="bg-blue light" @click.stop="onClickEdit"><text class="icon-edit" style="font-size: 40rpx;"></text></div>
    </div>
  </div>
</template>

<script>
import CONFIG from '@/config/config.js'

export default {
  props: {
    data: {
      required: true,
    },
    cId: {
      required: true,
    },
    isShowOp: {
      required: true
    }
  },
  data: function(){
    return {
      touchStart: 0,
      touchDirection: '',
    }
  },
  methods: {
    onClickEdit(){
      wx.navigateTo({
        url: `../add-day/main?_id=${this.data._id}`
      })
    },
    onTouchStart(e){
      this.touchStart = e.mp.touches[0].pageX
    },
    onTouchMove(e){
      this.touchDirection = e.mp.touches[0].pageX - this.touchStart > -30 ? 'right': 'left'

    },
    onTouchEnd(e){

      this.$emit('touchEnd', {
        cId: this.cId,
        direction: this.touchDirection
      })

    },
    onClickCard(){
      wx.navigateTo({
        url: `../show-day/main?_id=${this.data._id}&bg=${this.data.bg}&name=${this.data.name}`,
      })
      this.$emit('click', this.data._id)
    }
  },
  computed: {
    textColor: function(){
      return CONFIG.colorMap[this.data.bg].textColor
    },
    starColor: function(){
      return CONFIG.colorMap[this.data.bg].starColor
    },
    dateStr: function(){
      return this.data.date.replace(/-/g, ' / ')
    }
  },
}
</script>

<style lang="less">
.day-card{
  width: 100%;
  height: 150rpx;
  position: relative;
  font-family: Adele, sans-serif, "宋体";

  &:active{
    opacity: 0.8;
    transition: all 250ms;
  }
  .title{
    position: absolute;
    top: 20rpx;
    left: 20rpx;
    font-size: 32rpx;
    font-weight: 700;

  }

  .date{
    position: absolute;
    bottom: 20rpx;
    left: 20rpx;
    font-size: 28rpx;
    opacity: 0.5;
  }

  .count-down{
    position: absolute;
    top: 50%;
    transform: translate(0, -50%);
    right: 30rpx;
    font-size: 30rpx;
    span{
      opacity: 0.5;
    }
    .count{
      font-size: 42rpx;
      margin: 0 8rpx;
      opacity: 1;
    }
  }

  .star{
    position:absolute;
    right: 10rpx;
    top: 10rpx;
    height: 20rpx;
    width: 20rpx;
    border-radius: 50%;
  }

}
</style>
