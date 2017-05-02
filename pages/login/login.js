//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    userInfo:[],
    registed:null,
    creat_username:'',
    username:'',
    openid:'',
  },
  onLoad: function () {
    var that=this;
    app.getUserInfo(function(username,userinfo,openid,bool){
      if(bool){
        that.setData({
          userInfo:userinfo,
          registed:1,
          username:username
        })
      }
      else{
        
        that.setData({
          registed:0,
          openid:openid
        })
      }
    });
    app.globalData.username=this.data.username
  },
  input_name:function(e){
    this.setData({
      creat_username:e.detail.value
    })
  },
  goto_topics:function(){
    wx.switchTab({
      url: '../topics/topics'
    })
  },
  goto_myassign:function(){
    wx.switchTab({
      url: '../myassign/myassign'
    })
  },
  goto_add:function(){
    wx.switchTab({
      url: '../add/add'
    })
  },
  regist:function(){
    console.log(app.globalData.userInfo);
    var that=this;
    wx.request({
      url: 'https://www.ltzxjg.cn/tools/xcx.php',
      data: {
        register:1,
        openid:this.data.openid,
        username:this.data.creat_username
      },
      header: { 'Content-Type': 'application/json' },
      success (res) {
        if(res.data==1){
          that.setData({
            registed:1
          });
          that.onLoad();
        }else{
          wx.showModal({
            title: '提示',
            content: '提交失败！',
            showCancel:false
          })
        }
        
      },
      fail (e) {
        console.error(e)
        callback(e)
      }
    })
  }
})
