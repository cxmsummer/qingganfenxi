//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    inputValue1:'',
    result1:' ',
    result2:' '
  },
  input1:function(e){
    var value=e.detail.value;
  this.setData({
  inputValue1:value,
})
  },
  
  send:function(){
    var text=this.data.inputValue1;
    var positive_prob;
    var confidence;
    var negative_prob;
    var sentiment;
    var that=this;
    wx.request({
    url:'https://aip.baidubce.com/rpc/2.0/nlp/v1/sentiment_classify?charset=UTF-8&access_token="自己的token"',
    method:'POST',
    header:{
      'Content-Type':'application/json'
    },
    data:{
      text: text
    },
    success: function (e) {
      console.log(e);
      positive_prob= e.data.items[0].positive_prob;
      confidence=e.data.items[0].confidence;
      negative_prob=e.data.items[0].negative_prob;
      sentiment=e.data.items[0].sentiment;
      //console.log(positive_prob,confidence,negative_prob,sentiment)
      console.log(positive_prob)
      console.log(negative_prob)
      that.setData({
        result1:positive_prob,
        result2:negative_prob
      })


    
      var data={"datastreams": [
              {"id": "positive","datapoints":[{"value":positive_prob}]},
              {"id": "negative","datapoints":[{"value":negative_prob}]},
              {"id": "text","datapoints":[{"value":text}]}

            ]}


      //console.log(data)
      wx.request({
        url: "https://api.heclouds.com/devices/" +自己的deviceid + "/datapoints",
        method:'POST',
        header:{
          "content-type": 'application/json',
          "api-key": "自己的key",
        },
    
        data:JSON.stringify(data),
        success(res){
          console.log(res)
        },
    
        fail: function(res){
          wx.showToast({ title: '系统错误' })
        },
    
        complete:function(res){
          wx.hideLoading()
    
        }
    
      })
    
    }
  })
  //console.log(positive_prob)
  // this.setData({
  //   result1:positive_prob,
  //   result2:negative_prob
  // })
  
},
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () 
   {
  

if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
