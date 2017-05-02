// pages/detial/detial.js
var Api = require('../../utils/api.js');
var util = require('../../utils/util.js');

var app = getApp();
Page({
  data:{
    worknum:'',
    detial:[],
    hidden: true,
    img_modalFlag:true,
    scaleWidth:'100%',
    scaleHeight:'100%',
  },
  onLoad:function(options){
    
    this.setData({
      worknum:options.worknum
    });
    var that=this
    that.setData({
       hidden: false,
       img_modalFlag:true 
    });
    var get_data={act: 'detial',worknum:options.worknum};
    Api.fetchGet(get_data,(err,res)=>{
      console.log(res);
      if(res[0]){
        res[0].date = util.getDateDiff(res[0].date);
        if(res[0].attention_level==1){
          res[0].attention_level='加急'
        }else{res[0].attention_level='正常'}
        if(res[0].ok_state==1){
          res[0].attention_level='已看'
        }else{res[0].ok_state='未看'}
        that.setData({
          detial:res[0]
        });
      }else{
        wx.showModal({
          title: '提示',
          content: '派活单不存在！',
        })
      }
      setTimeout(function () {
        that.setData({ hidden: true });
      }, 300);
    })
  },
  onShareAppMessage: function () {
    return {
      title: '派活单：'+this.data.worknum,
      path: 'pages/detial/detial?worknum='+this.data.worknum,
      success: function(res) {
        // 分享成功
      },
      fail: function(res) {
        // 分享失败
      }
    }
  },
  lookimg:function(e){
    this.setData({
      img_modalFlag:false
    })
  },
  playvoice:function(e){
    console.log(e.currentTarget.dataset.url)
    wx.downloadFile({
      url: e.currentTarget.dataset.url,
      success: function(res) {
        wx.playVoice({
          filePath: res.tempFilePath
        })
      }
    })
  },
  hidden_img:function(e){
    this.setData({
      img_modalFlag:true
    })
  },
  call_phone:function(e){
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.tel 
    })
  },
})