Page({
  data: {
    tableNum: ['01', '02', '03', '04'],
    tableIdx: 0,
    discountItems: [{
      key: '优惠金额',
      data: '0'
    },{
      key: "会员折扣",
      data: '0'
    }],
    orderPrice: 0,
    orderPrice_str: 0,
    orderTax:0,
    orderTax_str: 0,
    TaxValue:0.1,
    //用户的电话号码
    in_user_hp:"",
    //用户的送餐地址
    in_user_addr: "",
    //用户的菜品备注
    in_user_remark: "",
    

  },
  bindPickerChange: function(e) {
    console.log(e, e.detail.value)
    this.setData({
      tableIdx: e.detail.value
    })
  },
  
  //绑定用户输入号码的input
  hp_input:function (e) {
    this.setData({
      in_user_hp: e.detail.value
  })
  },

  //绑定送餐地址的input
  addr_input: function (e) {
    this.setData({
      in_user_addr: e.detail.value
    })
  },

  //绑定菜品备注的input
  remark_input: function (e) {
    this.setData({
      in_user_remark: e.detail.value
    })
  },


  submitOrder: function (e) {
    var orderLists = wx.getStorageSync('orderLists')
    console.log(this.data.in_user_hp)
    console.log(this.data.in_user_addr)
    console.log(this.data.in_user_remark)
    //
    wx.request({
      url: 'https://chongqingsby.applinzi.com/xa_process_order.php',
      data: {
        order_list: orderLists,
        in_user_hp: this.data.in_user_hp,
        in_user_addr: this.data.in_user_addr,
        in_user_remark: this.data.in_user_remark
      },
      // header: {}, // 设置请求的 header
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log('success')

        var res_re = res.data.re
        console.log(res_re)
        wx.removeStorageSync("res_re");
        wx.setStorage({
          key: "res_re",
          data: res_re
        })

        // success
      },
      fail: function (res) {
        console.log('fail')
        console.log(res)
        // fail
      },
      complete: function (res) {
        console.log('complete')
        console.log(res)
        // complete
      }
    })


  },

  onLoad: function() {
    var orderLists = wx.getStorageSync('orderLists'),
        orderPrice = this.data.orderPrice,
        discountItems = this.data.discountItems;
    orderLists.forEach(function(orderList){
      orderPrice += orderList.foodPrice * orderList.foodQuantity;
    })




    //优惠金额和折扣，先不处理，注销
    /*discountItems.forEach(function(discountItem){
      orderPrice -= discountItem.data;
    })*/
    
    var tmp_tax = Math.floor(orderPrice * this.data.TaxValue/1000)*1000
    console.log(tmp_tax)
    //转化Tax的数字格式
    var tmp_tax_str = tmp_tax + ""
    tmp_tax_str = tmp_tax_str.replace(/\d{1,3}(?=(\d{3})+$)/g, function (s) {
      return s + ','
    })


    //加上Tax
    orderPrice += tmp_tax
    //转换最后金额的数字格式
    var tmp_orer_price_str = orderPrice+""
    tmp_orer_price_str = tmp_orer_price_str.replace(/\d{1,3}(?=(\d{3})+$)/g, function (s) {
      return s + ','
    })
    console.log(tmp_orer_price_str)


    console.log(tmp_tax_str)

    this.setData({
      orderLists: orderLists,
      orderPrice: orderPrice,
      orderPrice_str: tmp_orer_price_str,
      orderTax: tmp_tax,
      orderTax_str: tmp_tax_str
    })
  }
})