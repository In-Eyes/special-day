<template>
  <div class="home">
    <div class="empty-state" v-if="realDayList.length === 0">
      <div class="dayicon di-empty4"></div>
      <div class="content">我的过去空空如也</div>
    </div>
    
    <div class="day-list cu-list">
      <div class="timeline" v-if="realDayList.length > 3"> <span class="dayicon di-timeline"></span> 时间轴</div>
      <dayCard v-for="(day, index) in realDayList" 
      :data="day" 
      :key="index" 
      :cId="index"
      @touchEnd="onTouchCardEnd" 
      :isShowOp="shownCardIndex == index"></dayCard>
    </div>
    <div class="add-button" @click="jumpToAddDay"><div class="dayicon di-add"></div></div>
  </div>
</template>

<script>
import dayCard from '@/components/day-card'
import CONFIG from '@/config/config.js'

export default {
  data () {
    return {
      shownCardIndex: -1,
      dayList: []
    }
  },

  components: {
    dayCard
  },

  methods: {
    jumpToAddDay(){
      wx.navigateTo({
        url: '../add-day/main'
      })
    },

    async getDayList(){  // get the day list
      const {result} = await wx.cloud.callFunction({
        name: 'getSpDayList'
      })
      console.log(result);
      

      if (result.code != CONFIG.code.success) {
        wx.showToast({
          title: '获取列表失败,请稍后再试',
          icon: 'none',
          duration: 2000
        })

        console.error(result.msg);
        
        return
      }

      this.dayList = result.data
    },

    onTouchCardEnd({cId, direction}){
      if (direction == 'right') {
        this.shownCardIndex = -1
      }else if(direction == 'left'){
        this.shownCardIndex = cId        
      }else{
        this.shownCardIndex = -1
      }
      
    }
  },

  created () {
  },
  computed: {
    realDayList(){
      let topDays = this.dayList.filter(d=>d.status)
      let otherDays = this.dayList.filter(d=>!d.status)

      topDays.sort((a, b)=> a.dayCount > b.dayCount)
      otherDays.sort((a, b)=> a.dayCount > b.dayCount)

      return topDays.concat(otherDays)
    }
  },
  onShow() {
    this.getDayList()
  }
}
</script>

<style lang="less">
.home{
  position: relative;
  padding-bottom: 150rpx;
  font-family: Adele, sans-serif, "宋体";
  .empty-state{
    position: fixed;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
    color:#a1c4fd;

    .di-empty4{

      font-size: 150px;
    }

    .content{
      font-size: 36rpx;
      text-align: center;
    }
  }
  .day-list{
    overflow-y: scroll;
    overflow-x: hidden;
    height: 100%;
    
    .timeline{
      position: relative;
      height: 80rpx;
      line-height: 80rpx;
      background-image: linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%);
      color: white;
      padding-right: 60rpx;
      width: 600rpx;
      text-align: right;
      border-radius: 50rpx;
      margin: 10rpx auto 20rpx auto;
      font-size: 32rpx;

      .dayicon{
        position: absolute;
        top: 50%;
        transform: translate(0, -50%);
        left: 40rpx;
        font-size: 28px; 
      }
      &::after{
        content: ">";
        position: absolute;
        top: 50%;
        transform: translate(0, -50%);
        right: 20rpx;
      }
    }
  }
  .add-button{
    position: fixed;
    bottom: 50rpx;
    right: 50rpx;
    border-radius: 50%;
    height: 100rpx;
    width: 100rpx;
    background: #a1c4fd;
    box-shadow: 0 10rpx 30rpx 5rpx rgba(0, 0, 0, 0.2);
    text-align: center;
    line-height: 100rpx;
    color: white;
    &:active{
      opacity: 0.8;
      transition: all 250ms;
      box-shadow: 0 5rpx 20rpx 5rpx rgba(0, 0, 0, 0.2);

    }
  }
}
</style>
