<template>
  <div class="add-day">
    <div class="preset">
      <picker :range="presetList" @change="onSelectPreset">预设节日 ▼</picker>
    </div>
    <div class="form-group name">
      <span class="title">事件名称</span>
      <input type="text" placeholder="事件名称" :value="name" @input="onInputName">
    </div>
    <div class="form-group date">
      <span class="title">发生日期</span>
      <picker mode="date" :value="date" @change="onSelectDate">
        <span>{{date}}</span>
      </picker>
    </div>
    <div class="form-group cycle">
      <span class="title">提醒周期</span>
      <picker :range="cycleTypeRange" @change="onSelectCycleType" v-if="!isOvertime" :disabled="isPreset">
        <span>{{cycleTypeStr}}</span>
      </picker>
      <span class="content" v-else>倒计时</span>
    </div>
    <div class="form-group bg" @click="showBgSelector">
      <span class="title">背景颜色</span>
      
      <span class="bgshow" :style="{background: bg}" ></span>
    </div>
    <div class="form-group ">
      <span class="title">是否置顶</span>
      <switch @change="switchTopUp"></switch>
    </div>
    <div class="form-group notes">
      <span class="title">备注</span>
      <textarea v-if="!isShowBgSelector" id="notes" cols="30" rows="10" placeholder="备注信息" @change="onInputNotes" :value='notes'></textarea>
      <span class="showTextarea" v-else>{{notes}}</span>
    </div>
    <div class="cu-modal drawer-modal justify-end" :class="{show: isShowBgSelector}" @click="hideBgSelector">
      <div class="cu-dialog basis-lg" style="overflow-y: scroll;">
        <div class="color-card" 
        v-for="(color, index) in colorList" 
        :style="{background: color}" 
        :key="index"
        :class="{select: color == bg}"
        @click.stop="onSelectBackground(color)"></div>
      </div>
    </div>

    <button class="finish cu-btn block lg" @click="commitDay">
      完成
    </button>
  </div>
</template>

<script>
import CONFIG from "@/config/config.js";
import moment from "moment";

export default {
  data: function() {
    return {
      dId: '',
      name: "",
      date: "",
      cycleType: "year",
      bg: '#f69d9d',
      dateType: 'solar',
      notes: '',
      status: 0,
      isShowBgSelector: false,
      updating: false,
      low: false,
    };
  },
  methods: {
    switchTopUp(e){  // whether top up the day
      this.status = e.mp.detail.value
    },
    async getSpDayInfo(dId){
      this.updating = true

      const {result} = await wx.cloud.callFunction({
        name: 'getSpDay',
        data: {
          _id: this.dId
        }
      })

      if (result.code != CONFIG.code.success) {
        console.error(result.msg)
        this.updating = false

        return
      }

      const data = result.data

      Object.assign(this.$data, data)

      this.updating = false

    },
    commitDay(){  // create a new day
      const data = {
        name: this.name,
        notes: this.notes,
        bg: this.bg,
        date: this.date,
        dateType: this.dateType,
        cycleType: this.cycleType,
        active: true,
        status: this.status,
      }
      if(this.updating) return

      if (this.dId) {
        this.updateDay(data)
      }else{
        this.insertDay(data)
      }
    },
    async updateDay(data){
      data['_id'] = this.dId

      this.updating = true
      wx.showLoading({
        title: '更新日子ing'
      })

      const {result} = await wx.cloud.callFunction({
        name: 'updateSpDay',
        data: data
      })
      wx.hideLoading()

      if (result.code != CONFIG.code.success) {
        console.error(result.msg)
        wx.showToast({
          title: '更新失败,请稍后再试',
          icon: 'none',
          duration: 2000
        })
        this.updating = false

        return 
      }
      wx.showToast({
        title: '成功',
        icon: 'success',
        duration: 1000
      })

      setTimeout(()=>{
        wx.navigateBack({
          delta: 1
        })
      }, 500)
      
      this.updating = false
    },
    async insertDay(data){
      this.updating = true
      wx.showLoading({
        title: '添加日子ing',
      })
      const {result} = await wx.cloud.callFunction({
        name: 'createSpDay',
        data: data
      })

      if (result.code != CONFIG.code.success) {
        console.error(result.msg)
        wx.showToast({
          title: '添加失败,请稍后再试',
          icon: 'none',
          duration: 2000
        })
        this.updating = false
        wx.hideLoading()

        return 
      }
      wx.hideLoading()
      wx.showToast({
        title: '成功',
        icon: 'success',
        duration: 1000
      })

      setTimeout(()=>{
        wx.navigateBack({
          delta: 1
        })
      }, 1000)
      
      this.updating = false
    },
    onInputNotes(e){
      this.notes = e.mp.detail.value
    },
    onInputName(e) {
      this.name = e.mp.detail.value
    },
    onSelectPreset(e) {
      Object.assign(this.$data, CONFIG.holiday[e.mp.detail.value])

    },

    onSelectDate(e) {
      this.date = e.mp.detail.value
    },

    onSelectCycleType(e) {
      this.cycleType = CONFIG.cycleType[e.mp.detail.value].value
    },

    onSelectBackground(color){
      this.bg = color;
      this.isShowBgSelector = false
    },

    showBgSelector(){
      this.isShowBgSelector = true
    },
    hideBgSelector(){
      this.isShowBgSelector = false
    },
    init(){
      this.name = "" 
      this.date = moment().format("YYYY-MM-DD");
      this.cycleType = "year"
      this.bg = Object.keys(CONFIG.colorMap)[0]
      this.dateType = 'solar'
      this.notes = ''
      this.status = 0

      this.updating = false
    }
  },
  computed: {

    isPreset: function(){
      return this.date.length < 6
    },
    isOvertime: function(){  // over current time 
      
      return moment(this.date) > moment()
    },
    cycleTypeStr: function(){
      return CONFIG.cycleTypeMap[this.cycleType]
    },
    presetList: function() {
      return CONFIG.holiday.map(d => {
        return `${d.name}(${d.date})`;
      });
    },

    cycleTypeRange: function() {
      return CONFIG.cycleType.map(d => d.name);
    },

    colorList: function(){
      return Object.keys(CONFIG.colorMap)
    }
  },

  onLoad: function(option){
    console.log(option);
    
    if (option._id && option._id.length) {  // if give the dId of day, get the info from cloud
      this.dId = option._id
      this.getSpDayInfo(this.dId) 
    }else{
      this.init()
    }
  },
  onUnload: function() {
    this.init()
  }
};
</script>

<style lang="less">
.add-day {
  font-family: Adele, sans-serif, "宋体";
  padding-top: 20rpx;
  .preset {
    text-align: center;
    font-size: 24rpx;
    color: #9e9e9e;
    margin-bottom: 30rpx;
  }

  .color-card{
    height: 100rpx;
    width: 100%;
    z-index: 10000;
  }

  .select{
    transition: all 250ms;
    position: relative;
    &::after{
      content: "✔";
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: #52616b;
    }
  }

  .notes{
    .title{
      align-self:flex-start;
      margin-top:16px;
    }
  }

  .finish{
    width: 90%;
    position: fixed;
    bottom: 100rpx;
    left: 50%;
    transform: translate(-50%, 0);
    color: white;
    background: #a1c4fd;

    &::active{
      opacity: 0.8;
      transition: all 250ms;
    }
  }
}
.form-group {
  background-color: #fff;
  padding: 1rpx 50rpx;
  display: flex;
  align-items: center;
  min-height: 100rpx;

  .title {
    color: #52616b;
    min-width: calc(4em + 30rpx);
    padding-right: 30rpx;
    line-height:1;
    font-weight: 700;
  }
  .content{
    flex: 1;
    font-size: 30rpx;
    color: #555;
    padding-right: 20rpx;

  }
  input {
    flex: 1;
    font-size: 30rpx;
    color: #555;
    padding-right: 20rpx;
  }

  picker {
    flex: 1;
    font-size: 30rpx;
    color: #555;
    padding-right: 20rpx;
  }

  .bgshow{
    width: 50rpx;
    height: 50rpx;
    border-radius: 25rpx;
    box-shadow: 0 0 1px 1px rgba(0, 0, 0, 0.1);
  }


  textarea{
    margin:32rpx 0 30rpx;
    height:4.6em;
    width:100%;
    line-height:1.2em;
    flex:1;
    font-size:28rpx;
    padding:0;
    box-sizing:content-box;
    vertical-align:top;
  }

  .showTextarea{
    margin:32rpx 0 30rpx;
    height:4.6em;
    width:100%;
    line-height:1.2em;
    flex:1;
    font-size:28rpx;
    padding:0;
    box-sizing:content-box;
    display:inline-block;
    vertical-align:top;
  }

}


</style>
