<template>
  <div class="show-day" :style="{background: bg, color: textColor}">
    <div class="custom" :style="{height: customBarHeight}">
      <div class="back" :style="{height: customBarHeight, paddingTop: statusHeight}">
        <text class="icon-back" @click="onClickBack"></text>
      </div>
    </div>
    <div class="name">{{name}}</div>
    <div class="date">{{dateStr}}</div>
    <div class="notes">{{notes}}</div>
    <div class="count-down"><span v-if="cycleType != 'none'">剩余</span> 
                        <span v-else>已过</span><span class="count">{{dayCount}}</span><span>天</span></div>
    <div class="delete">
      <text class="icon-delete" @click="onClickDelete"></text>
      <text class="icon-edit" @click="onClickEdit"></text>
    </div>
  </div>
  
</template>

<script>
import CONFIG from '@/config/config.js'
import wxml2canvas from '@/utils/wxml2canvas.js'

export default {
  data: function(){
    return {
      dId: "",
      name: "",
      notes: "",
      bg: "",
      date: "",
      dateType: "solar",
      cycleType: "year",
      active: true,
      law: false,
      status: 1,
      dayCount: 0,
      createTime: new Date(),
      updateTime: new Date()
    }
  },

  computed: {
    textColor: function(){
      return CONFIG.colorMap[this.bg].textColor
    },
    starColor: function(){
      return CONFIG.colorMap[this.bg].starColor
    },
    dateStr: function(){
      return this.date.replace(/-/g, ' / ')
    },
    customBarHeight: function(){
      return `${this.globalData.CustomBar}px`
    },
    statusHeight: function(){
      return `${this.globalData.StatusBar}px`
    }
  },

  methods: {
    onClickEdit(){
      wx.navigateTo({
        url: `../add-day/main?_id=${this.dId}`
      })
    },

    onClickDelete(){
      const data = {
        _id: this.dId,
        name: this.name,
        notes: this.notes,
        bg: this.bg,
        date: this.date,
        dateType: this.dateType,
        cycleType: this.cycleType,
        active: false,
        status: this.status,
      }
      this.deleteDay(data)
    },

    async deleteDay(data){
      wx.showLoading({
        title: '正在删除'
      })

      const {result} = await wx.cloud.callFunction({
        name: 'updateSpDay',
        data: data
      })

      wx.hideLoading()

      if (result.code != CONFIG.code.success) {
        wx.showToast({
          title: '删除失败失败,请稍后再试',
          icon: 'none',
          duration: 2000
        })
        return
      }

      setTimeout(()=>{
        wx.navigateBack({
          delta: 1
        })
      }, 500)
    },

    init(){
      this.name = "" 
      this.date = ''
      this.bg = ''
      this.notes = ''
      this.status = 0
    },

    async getSpDay(){

      const {result} = await wx.cloud.callFunction({
        name: 'getSpDay',
        data: {
          _id: this.dId
        }
      })

      if (result.code !== CONFIG.code.success) {
        wx.showToast({
          title: '更新失败,请稍后再试',
          icon: 'none',
          duration: 2000
        })
      }
      console.log(result.data);
      
      Object.assign(this.$data, result.data)
    },
    onClickBack(){
      wx.navigateBack({
        delta: 1
      })
    }
  },
  onLoad(option){    
    this.dId = option._id
    this.bg = option.bg
    this.name = option.name
    this.getSpDay()
  },

  onUnload(){
    this.init()
  },

  onShow(){
    this.getSpDay()
  }
};
</script>

<style lang="less">
page{
  height: 100%;
}
.show-day{
  height: 100%;
  font-family: Adele, sans-serif, "宋体";

  .custom{
    width: 100%;
    .back{
      display: flex;
      align-items: center;
      font-size: 40rpx;
      margin-left: 20rpx;
      
    }
  }
  .name{
    margin-top: 60rpx;
    min-height: 40rpx;
    font-size: 38rpx;
    font-weight: 700;
    text-align: center;
  }

  .date{
    margin-top: 20rpx;
    min-height: 36rpx;
    font-size: 26rpx;
    text-align: center;
    line-height: 36rpx;
    
  }

  .notes{
    margin-top: 40rpx;
    font-size: 32rpx;
    text-align: center;
    padding: 0 100rpx;
    opacity: 0.8;
    height: 200rpx;
    overflow: scroll;
  }

  .count-down{
    margin: 120rpx auto 20rpx auto;
    position: relative;
    width: 450rpx;
    height: 450rpx;
    text-align: center;
    line-height: 450rpx;
    border-radius: 50%;
    font-size: 30rpx;
    box-shadow: 0 0 0 20rpx rgba(255, 255, 255, 0.5),
                0 0 0 50rpx rgba(255, 255, 255, 0.3),
                -400rpx 400rpx 0 0rpx rgba(255, 255, 255, 0.1),
                400rpx 500rpx 0 0rpx rgba(255, 255, 255, 0.1);
    span{
      opacity: 0.5;
    }
    .count{
      font-size: 52rpx;
      margin: 0 8rpx;
      opacity: 1;
      font-weight:300;
    }
  }
  .delete{
    padding: 20rpx 30rpx;
    position: fixed;
    bottom: 20rpx;
    left: 50%;
    transform: translate(-50%, 0);
    width: 200rpx;
    height:80rpx;
    background:rgba(255, 255, 255, 0.9);
    border-radius:40rpx;
    display: flex;
    justify-content: space-between;
    .icon-delete{
      font-size: 40rpx;
      flex: 1;
      text-align: left;
      color: #f69d9d;
    }

    .icon-edit{
      font-size: 40rpx;
      flex: 1;
      text-align: right;
      color: #a1c4fd;
    }
  }
}
</style>
