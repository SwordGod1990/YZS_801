/**
 * Created by Administrator on 2018-3-21.
 * author sxx
 */
//获取当前窗口高度  mounted里需要用到
var wH = window.innerHeight;

//窗口改变重新计算 drug_list高度
$(window).resize(function() {
  //获取当前窗口高度
  var wH = window.innerHeight;
  //页面加载完后成直接获取address_content 高度
  if( !that.isIptFlag ){
    var address_content = $(".address_content").height()
    $(".drug_list").css({"height":wH-address_content-130+"px"})
  }
});

//计算弹窗的left值
window.onload = function(){
  var wW = window.innerWidth;// 当前窗口的宽度
  $(".dialogue_alert").css({"left":(wW-175)/2+"px"})
}

var that = null
new Vue({
  el: '#content',
  data: {
    consigneeName: '',//用户名
    consigneePhone: '',//电话
    addressList: [
      { addressName:'收货地址',addressMsg:'' },
      { addressName:'留言',addressMsg:'' }
    ],
    list: [],
    titleList: [{titleName:'药品'},{titleName:'规格*包装'},{titleName:'有效期'},{titleName:'单价'},{titleName:'数量'}], //药品列表的title名
    data:{}, //点击确认采购 传给后台参数
    isMsgFlag: false, //确认按钮成功或失败提示显示或隐藏
    layerMsg: '',//成功或失败提示文案
    isDelFlag: false, //是否显示二次确认弹窗
    isIptFlag: false //点击数量和运费  是否允许改变 drug_list高度  防止安卓设备调用键盘触发resize事件  改变drug_list高度后  input框会被遮盖
  },
  mounted: function(){
    that = this
    that.getParams() //初始化加载的数据
    //保证数据渲染完成  计算drug_list高度
    setTimeout(function(){
      //获取address_content高度
      var address_content = $(".address_content").height()
      $(".drug_list").css({"height":wH-address_content-130+"px"})
    },100)
  },
  methods: {
    //数量 点击减号 -1
    clickJian: function(item){
      if( item.amount <= 1 ){ //数量最少不可少于1
        item.amount = 1
        getToast('数量至少为1')
      }else{
        item.amount = (parseInt(item.amount)-1).toString()  //统一数据类型 string  -1
      }
    },
    //数量 点击加号 +5
    clickJia: function(item){
      if( item.amount == 9999 ){ //限制9999提示
        getToast('最多只能采购9999件')
      }else if( item.amount > 9994 ){  //数量大于9994时 amount为9999
        item.amount = 9999
      }else{
        item.amount = (parseInt(item.amount)+5).toString()  //统一数据类型 string  +5
      }
    },
    //输入数量  value>0
    changeAmount:  function(item){
      //输入数量为空或0时默认且不能以0开始 为1
      if( item.amount == '' || /^0\d*$/.test(item.amount) ){
        item.amount = 1
        getToast('数量至少为1')
      }
    },
    //输入运费  value>=0
    changeFreight:  function(item){
      //防止输入 000 类似数字
      if( item.freight == 0 ){
        item.freight = 0
      //输入运费为空默认为0  验证不能以0开始
      }else if( item.freight == '' || /^0\d*$/.test(item.freight) ){
        item.freight = 0
        getToast('运费至少为0')
      }
    },
    getFocus: function(){
      that.isIptFlag = true;
    },
     getFocus1:function(item){
         that.isIptFlag = true;
         var freight_val=item.freight;
         item.freight='';
         $(".freight_em").focus();
         item.freight=freight_val;
         /*  var freight_val=$(this).val();
          $(this).val("").focus().val(freight_val);*/
      },
    resTest:function(item){
//        校验只能输入4位小数，2位整数
        var v=amount(item.freight);
        var reg=/^\d+$/;
        if(reg.test(v)==true){
            var reg = /^\d{1,4}$/;
            if(reg.test(v)==false){
                v=item.freight.substring(0,4);
                console.log(item.freight)
                console.log(v)
                item.freight=v;
            }
            return true;
        }else{
            console.log(2)
            item.freight=v;
            return false;
        }
    },
    getBlur: function(){
      that.isIptFlag = false
    },
    //获取页面数据
    getParams: function(){
      $.ajax({
        url:commonUrl+'saveStorage/queryOfferOrderInfo',
        type:'get',
        dataType:'json',
        data:{ offerOrderIds:'['+params.offerOrderIds+']',enquiryId:params.enquiryId }, //offerOrderIds 报价单ids  enquiryId 询价单id
        //data:{ offerOrderIds:'[40289f8b626b2fe901626b548bfe0004,40289f8b626b2fe901626b548c080005]',enquiryId:'40289fab626200470162621090120003' }, //offerOrderIds 报价单ids  enquiryId 询价单id
        success: function(res){
          //console.log(res.data)

          //ajax请求成功抛出异常
          if( res.code != 0000 ){
            getAjax(res.msg)
          }
          //用户信息 法人  电话
          that.consigneeName = res.data.consigneeName
          that.consigneePhone = res.data.consigneePhone

          //收货地址  留言  留言为空时只显示收货地址
          if( res.data.words == '' ){
            //只显示收货地址
            that.addressList = [{ addressName:'收货地址',addressMsg:res.data.consigneeAddress }]
          }else{
            //显示收货地址和留言
            that.addressList[0].addressMsg = res.data.consigneeAddress
            that.addressList[1].addressMsg = res.data.words
          }

          //药品列表
          that.list = res.data.dataList

          //重新封装数据  clinicId   enquiryId
          that.data.clinicId = res.data.clinicId //诊所id
          that.data.enquiryId = res.data.enquiryId  //询价单id
        }
      })
    },
    //点击返回 返回上一级
    clickBack: function(){
      window.history.go(-1)
    },
    //点击确认采购按钮  显示提示弹窗
    clickBtn: function(){
      that.isDelFlag = true
    },
    //点击弹窗的取消  关闭弹窗
    clickCancel:function(){
      that.isDelFlag = false
    },
    //点击弹窗的确认 传给后台参数
    clickConfirm: function(){
      //console.log(that.list)
      that.isDelFlag = false
      //重新封装数据传给后台
      that.data.dataList = []
      for( var i=0;i<that.list.length;i++ ){
        var dataJson = {} //第一个dataList的json数据
        dataJson.busId = that.list[i].busId   //商家id
        dataJson.sysUserId = that.list[i].sysUserId   //用户id
        dataJson.freight = that.list[i].freight   //运费
        dataJson.busList = []
        for( var j=0;j<that.list[i].dataList.length;j++ ){
          //每条药品列表信息
          var busJson = {}
          busJson.num = that.list[i].dataList[j].amount  //数量
          busJson.offerOrderInfoId = that.list[i].dataList[j].offerOrderInfoId //报价的药品id
          dataJson.busList.push(busJson)
        }
          console.log(111+dataJson)
        that.data.dataList.push(dataJson)
      }
      //console.log(JSON.stringify(that.data))
        console.log(that.data.clinicId)
      $.ajax({
        url:commonUrl+'orders/createOrderAlsoSplit',
        type:'get',
        dataType:'json',
        data:{ data:JSON.stringify(that.data) },
        success: function(res){
          //console.log(res)
          //ajax请求提示信息
          getAjax(res.msg)
          // code为0000  成功跳转代发货详情
          if( res.code == 0000 ){
            location.href = 'purchaseList.html?clinicId='+that.data.clinicId
          }
        }
      })
    }
  }
})

//请求ajax抛出提示信息
function getAjax(msg){
  if(msg){
    getToast(msg)
  }
}

//toast提示
function getToast(msg){
  that.isMsgFlag = true
  that.layerMsg = msg //成功或失败提示
  //3秒提示框隐藏
  setTimeout(function () {
    that.isMsgFlag = false
  },3000)
}
//禁止ios设备弹性滑动
if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
  $('body').css({"position":"fixed","left":"0","top":"0"})
} else if (/(Android)/i.test(navigator.userAgent)) {
  //安卓设备
  $('body').css({"position":"absolute","left":"0","top":"0"})
}else{
  //pc 去掉浏览器默认滚动条
  $('body').css({"overflow-y":"hidden"})
}




//点击运费光标始终定位在最后
$.fn.textFocus=function(v){
    var range,len,v=v===undefined?0:parseInt(v);
    this.each(function(){
        if($.browser.msie){
            range=this.createTextRange();
            v===0?range.collapse(false):range.move("character",v);
            range.select();
        }else{
            len=this.value.length;
            v===0?this.setSelectionRange(len,len):this.setSelectionRange(v,v);
        }
        this.focus();
    });
    return this;
}

/*  var freight_val=$(".aa").val();
 $(".aa").val("").focus().val(freight_val);*/
 //在线支付
 $(".PaymentMethod").on("click",function(){
      $(".PaymentMethods").show()
 })
$(".Onlinepaymentbtn").on("click",function(){
  $(".PaymentMethods").hide()
  $(".OPT i").text("在线支付")
})
$(".CODbtn").on("click",function(){
  $(".PaymentMethods").hide()
  $(".OPT i").text("货到付款")
})


