//app.js
App({
  onLaunch: function () {
    
  },
  getUserInfo:function(cb){
    var that = this
    //调用登录接口
    wx.login({
      success: function (res) {
        wx.request({
          url: 'https://www.ltzxjg.cn/tools/xcx.php',
          data: {
            code: res.code
          },
          header: { 'Content-Type': 'application/json' },
          success (res) {
            if(res.data.no_regist==1){
              that.globalData.user_openid=res.data.openid
              cb(null,null,that.globalData.user_openid,false)
            }else{
              that.globalData.username = res.data.username;
              console.log(res)
              wx.getUserInfo({
                success: function (res) {
                  res
                  that.globalData.userInfo = res.userInfo
                  cb(that.globalData.username,that.globalData.userInfo,null,true)
                }
              })
            }
          },
          fail (e) {
            console.error(e)
            callback(e)
          }
        });
        
      }
    })
  },
  globalData:{
    userInfo:[],
    username:null,
    user_openid:null,
    image_url:null,
    record_url:null
  }
})