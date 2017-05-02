//index.js
//获取应用实例
var Api = require('../../utils/api.js');
var qiniuUploader = require("../../utils/qiniuUploader.js");
var app = getApp();
Page({
  data: {
    array: ['刁帅', '梁晨', '张兴', '高山惠', '房涛', '何磊', '康恩博', '孙波'],
    index: -1,
    attention_level:0,
    work_user:"",
    color:"#fff",
    uploadimg_path:'',
    uploadrecord_path:'',
    domain: 'http://oo3ansbrz.bkt.clouddn.com/',
    worknum:'',
    address:'',
    from:'',
    from_name:'',
    from_tel:'',
    cilent_name:'',
    client_tel:'',
    remark:'',
  },
  onLand:function(option){
  },
  bindPickerChange: function(e) {
    //console.log(this.randomChar())
    this.setData({
      index: e.detail.value,
      work_user:this.data.array[ e.detail.value]
    })
  },
  //提交新增
  formSubmit:function(e){
    var that=this;
    var data=e.detail.value;
    //console.log(data);
    if((data['address']==''&&data['from']==''&&data['from_name']==''&&data['from_tel']==''&&data['cilent_name']==''&&data['client_tel']==''&&data['remark']=='')||data['work_user']=='')
    {
      wx.showModal({
        title: '提示',
        content: '不能全为空啊！',
        showCancel:false
      })
    }
    else{
      if(that.data.uploadimg_path!=''){
        qiniuUploader.upload(that.data.uploadimg_path, (res) => {
            console.log(res.imageURL);
          }, 
          (error) => {
            console.log('error: ' + error);
          }, 
          {
            uploadURL: 'https://upload-z1.qbox.me',
            domain: 'oo3ansbrz.bkt.clouddn.com',
            //key: uploadName,
            uptokenURL: 'https://www.ltzxjg.cn/tools/xcx.php?get_qiniu_token=true',
          });
      }
      if(that.data.uploadrecord_path!=''){
        qiniuUploader.upload(that.data.uploadrecord_path, (res) => {
            console.log(res.imageURL);//1111111111111
            that.data.record_url=res.imageURL
          }, 
          (error) => {
            console.log('error: ' + error);
            that.data.record_url=0;
          }, 
          {
            uploadURL: 'https://upload-z1.qbox.me',
            domain: 'oo3ansbrz.bkt.clouddn.com',
            //key: uploadName,
            uptokenURL: 'https://www.ltzxjg.cn/tools/xcx.php?get_qiniu_token=true',
          });
      }
      if(that.data.uploadimg_path!=''){
        data['imageURL']=that.data.domain+that.data.uploadimg_path.split('//')[1]
      }else{data['imageURL']=0}
      if(that.data.uploadrecord_path!=''){
        data['recordURL']=that.data.domain+that.data.uploadrecord_path.split('//')[1]
      }else{data['recordURL']=0}
      data['worknum']=this.randomChar();
      this.data.worknum=data['worknum'];
      var get_data={username: app.globalData.username,act_type: 'insert',data:data};
      console.log(get_data);
      Api.fetchGet(get_data,(err,res)=>{
        console.log(res);
        if(res==1){

          that.setData({
            address:'',
            from:'',
            from_name:'',
            from_tel:'',
            cilent_name:'',
            client_tel:'',
            remark:'',
            index: -1,
            work_user:"",
            uploadimg_path:'',
            uploadrecord_path:'',
            worknum:'',
          })
          wx.clearStorage()
          wx.clearStorageSync()
          wx.showModal({
            title: '提示',
            content: '提交成功！',
            showCancel:false
          })
        }else{
          wx.showModal({
            title: '提示',
            content: '提交失败！',
            showCancel:false
          })
        }
      })
      


        


    }
    //发送模板消息
    // var formid=e.detail.formId;
    // console.log(e.detail);
    // wx.request({
    //   url: 'https://www.ltzxjg.cn/tools/xcx.php',
    //   data: {
    //     send_message: 'true' ,
    //     username:'孙波',
    //     formid:formid,
    //     address:data['address'],
    //     from:data['from'],
    //     remark:data['remark'],
    //     work_user:data['work_user']
    //   },
    //   header: {
    //       'content-type': 'application/json'
    //   },
    //   success: function(res) {
    //     console.log(res)
    //   }
    // })
  },
  switchChange: function (e){
    if(e.detail.value){
      this.setData({
        attention_level: 1,
        color:"#ff6633"
      })
    }else{
      this.setData({
        attention_level: 0,
        color:"#fff"
      })
    }
  },
  //选择图片
  chooseimg:function(e){
    var that=this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        that.setData({
          uploadimg_path:tempFilePaths[0],
        })
      }
    })
  },
  //录音
  startrecord:function(e){
    wx.showLoading({
      title: '正在录音....',
    })
    var that=this;
    wx.startRecord({
      success: function(res) {
        var tempFilePath = res.tempFilePath
        that.setData({
          uploadrecord_path:tempFilePath,
        }) 
        //console.log(tempFilePath)
      },
      fail: function(res) {
        //录音失败
      }
    })
  },
  touch_leave:function(e){
    wx.hideToast();
    setTimeout(function(){
      wx.stopRecord();
    },1000)
  },
  //录音结束，判断触摸时间
  // endrecord:function(res){
  //   wx.stopRecord();
  //   this.setData({
  //     uploadrecord_path:this.data.temp_uploadrecord_path
  //   }) 
  //   console.log(this.data.uploadrecord_path)
  // },
  randomChar:function(){
    var  x="0123456789qwertyuioplkjhgfdsazxcvbnm";
    var  tmp="";
    var timestamp = new Date().getTime();
    for(var  i=0;i<4;i++)  {
    tmp  +=  x.charAt(Math.ceil(Math.random()*100000000)%x.length);
    }
    return  timestamp+tmp;
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
  hide_message_modal:function(){
    this.setData({
      message_modalFlag:true
    })
  }
})
