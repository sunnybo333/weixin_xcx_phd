var Api = require('../../utils/api.js');
var util = require('../../utils/util.js');
var navList = [
  {id:"all", title: "全部"},
  {id:"ok", title: "已看"},
  {id:"no_ok", title: "未看"},
  {id:"attention", title: "加急"},
  {id:"flesh", title: "刷新"},
];
var app = getApp();
Page({
  data: {
    list_type:2,//用于判断我的还是已派
    activeIndex: 0,
    navList: navList,
    title: '话题列表',
    postsList: [],
    hidden: false,
    page: 1,
    limit: 20,
    tab: 'all',
    nolrmal_Color: '#fff',
    attentionColor:'#ff6633',
    ok_color:'#66ff66',
    modalHidden: true,
    modalHidden2: true,
    modalFlag:true,
    call_modalFlag:true,
    remark_modalFlag:true,
    array: ['刁帅', '梁晨', '张兴', '高山惠', '房涛', '何磊', '康恩博','孙波','赵磊'],
    index: 0,
    workuser_old_index:-1,//修改执行人之前所在索引号
    new_workuser:'',//选择的执行人
    del_index:-1,//选择的执行人
    call_info:['','','',''],
    old_remake:'',
    remake_edit_id:-1,
    new_remake:'',

  },

  onLoad: function () {
    this.getData();
  },

  PullDownRefresh: function () {
    this.data.postsList=null;
    this.data.page=1;
    this.top();
    console.log('下拉刷新', new Date());
  },

  
  onReachBottom: function () {
    this.lower();
    console.log('上拉刷新', new Date());
  },

  // 点击获取对应分类的数据
  onTapTag: function(e) {
    if(e.currentTarget.id!='flesh'){
      var that = this;
      var tab = e.currentTarget.id;
      var index = e.target.dataset.index;
      this.setData({
        activeIndex: index,
        tab: tab,
        page: 1
      });
    }
    this.PullDownRefresh();
  },

  //获取文章列表数据
  getData: function() {
    var that = this;
    var tab = that.data.tab;
    var page = that.data.page;
    var limit = that.data.limit;
    that.setData({ hidden: false });
    var get_data={tab:tab,user_type:'creat_user',username: app.globalData.username,act: 'fetchGet',page:page};
    Api.fetchGet(get_data,(err,res)=>{
      console.log(res);
      if(res!=0&&res!=1){
        res.map(function (item) {
          item.date = util.getDateDiff(item.date);
          return item;
        });
        
        that.setData({
          postsList:that.data.postsList.concat(res)
        });
        setTimeout(function () {
          that.setData({ hidden: true });
        }, 300);
      }
      else{
        setTimeout(function () {
          that.setData({ hidden: true });
        }, 300);
        wx.showToast({
          title: "已经到底儿了！",
          duration: 2000
        })
      }
    })
  },
  //更新关注度
  edit_level:function(e){
    var that = this;
    var level=0;
    var id=e.currentTarget.dataset.id;
    var old_level=e.currentTarget.dataset.level;
    var color='';
    if(old_level==0){
      color=that.data.attentionColor;
      level=1;
    }
    else{
      color=that.data.nolrmal_Color;
      level=0;
    }
    var get_data={user_type:'creat_user',act_type:'edit',act: 'edit_attention',id:id,value:level,color:color};
    Api.fetchGet(get_data,(err,res)=>{
      var item=that.data.postsList;
      that.data.postsList.map(function (item) {
        if(item.id==id){
          if(item.ok_state==1&&level==0){
            item.color=that.data.ok_color;;
          }else{
            item.color=color;
          }
          item.attention_level=level;
          };
        return item;
      });
      that.setData({
        postsList:that.data.postsList
      });
    })
  },
  //更新ok进度
  edit_ok:function(e){
    var that = this;
    var ok=0;
    var id=e.currentTarget.dataset.id;
    var old_ok=e.currentTarget.dataset.ok;
    var color='';
    if(old_ok==0){
      color=that.data.ok_color;
      ok=1;
    }
    else{
      color=that.data.nolrmal_Color;
      ok=0;
    }
    var get_data={user_type:'creat_user',act_type:'edit',act: 'edit_ok',id:id,value:ok,color:color};
    Api.fetchGet(get_data,(err,res)=>{
      var item=that.data.postsList;
      that.data.postsList.map(function (item) {
        if(item.id==id){
          if(item.attention_level==1&&ok==0){
            item.color=that.data.attentionColor;;
          }else{
            item.color=color;
          }
          item.ok_state=ok;
          };
        return item;
      });
      that.setData({
        postsList:that.data.postsList
      });
    })
  },
  // 下拉刷新
  top: function() {
    console.log('顶部加载', new Date());
    this.setData({
      page: 1,
      postsList: []
    });
    var that = this;
    if (that.data.tab !== 'all') {
      this.getData({tab: that.data.tab, page: that.data.page});
    } else {
      this.getData({page: that.data.page});
    }
  },
  // 滑动底部加载
  lower: function() {
    console.log('滑动底部加载', new Date());
    var that = this;
    that.setData({
      page: that.data.page + 1
    });
    if (that.data.tab !== 'all') {
      this.getData({tab: that.data.tab, page: that.data.page});
    } else {
      this.getData({page: that.data.page});
    }
  },
  //弹出修改执行人遮罩层
  modal_edit_workuser_open: function(e) {
    this.setData({
        modalFlag:false,
        workuser_old_index:e.currentTarget.dataset.id
      });
      
  },
  //关闭修改执行人遮罩层
  modal_edit_workuser_cancel: function(e) {
    this.setData({
        modalFlag:true
      });
      
  },
  //选择执行人
  pickerChange:function(e){
    this.setData({
      index: e.detail.value,
    });
    this.data.new_workuser=this.data.array[e.detail.value];
    console.log(e.detail.value);
  },
  //提交执行人修改
  edit_workuser_submit:function(){
    var that = this;
    var id=that.data.workuser_old_index;
    var new_workuser=that.data.new_workuser;
    
    var get_data={user_type:'creat_user',act_type:'edit',act: 'work_user',id:id,value:new_workuser};
    Api.fetchGet(get_data,(err,res)=>{
      var item=that.data.postsList;
      for(var i=0;i<item.length;i++){
        if(item[i]['id']==id){
          that.data.postsList.splice(i,1)
          break;
        }
      }
      that.setData({
        postsList:that.data.postsList,
        modalFlag:true
      });
    })
  },
  //提交删除操作
  edit_del:function(e){
    var that = this;
    var id=e.currentTarget.dataset.id;  
    wx.showModal({
      title: '提示',
      content: '是否删除',
      success: function(res) {
        if (res.confirm) {
          var get_data={user_type:'creat_user',act_type:'edit',act: 'edit_del',id:id,value:1};
          Api.fetchGet(get_data,(err,res)=>{
            var item=that.data.postsList;
            for(var i=0;i<item.length;i++){
              if(item[i]['id']==id){
                that.data.postsList.splice(i,1)
                break;
              }
            }
            that.setData({
              postsList:that.data.postsList,
              modalFlag:true
            });
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    });
  },
  //打开打电话模态框
  modal_call_open: function(e) {
    var call_info=Array();//屏蔽报错
    this.setData({
        call_modalFlag:false,
        call_info:[
          e.currentTarget.dataset.fromname,
          e.currentTarget.dataset.fromtel,
          e.currentTarget.dataset.client,
          e.currentTarget.dataset.clienttel
        ]
      });
  },
  //关闭打电话模态框
  modal_call_cancel: function(e) {
    this.setData({
        call_modalFlag:true
      })
  },
  //打电话
  call_phone:function(e){
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.tel 
    })
  },
  //弹出修改备注遮罩层
  modal_remark_open: function(e) {
    this.setData({
        remark_modalFlag:false,
        remark_edit_id:e.currentTarget.dataset.id,
        old_remake:e.currentTarget.dataset.remark,
      });
  },
  //关闭修改备注遮罩层
  modal_edit_remark_cancel: function(e) {
    this.setData({
        remark_modalFlag:true
      });
      
  },
  //获取修改后信息
  reamrk_change:function(e){
    this.data.new_remake=e.detail.value;
  },
  //提交备注修改
  edit_remark_submit:function(){
    var that = this;
    var id=this.data.remark_edit_id;  
    var temp_remark=this.data.new_remake;
    var get_data={user_type:'creat_user',act_type:'edit',act: 'edit_remark',id:id,value:temp_remark};
    Api.fetchGet(get_data,(err,res)=>{
      var item=that.data.postsList;
      that.data.postsList.map(function (item) {
        if(item.id==id){item.remark=temp_remark;};
        return item;
      });
      that.setData({
        postsList:that.data.postsList,
        remark_modalFlag:true
      });
    })
  },

})
