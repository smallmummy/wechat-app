//index.js
//获取应用实例
var app = getApp()
Page({
    data: {
       /* navs: [{
            id: 0,
            type: '热销榜',
            url: '',
            unique: '1',
        }, {
            id: 1,
            type: '特惠套餐',
            url: '',
        }, {
            id: 2,
            type: '现烤披萨',
            url: '',
        }, {
            id: 3,
            type: '配料区',
            url: '',
        }],
        foods: [{
            id: 0,
            typeid: 2,
            name: '乐滋烤肠披萨',
            price: 10,
            sales: 17,
            imgUrl: '/images/item-1.jpg',
            quantity: 0,
        }, {
            id: 1,
            typeid: 2,
            name: '墨西哥肌肉披萨',
            price: 20,
            sales: 50,
            imgUrl: '/images/item-2.jpg',
            quantity: 0,
        }, {
            id: 2,
            typeid: 2,
            name: '海鲜芝士披萨',
            price: 30,
            sales: 50,
            imgUrl: '/images/item-3.jpg',
            quantity: 0,
        }, {
            id: 3,
            typeid: 0,
            name: '热销榜1',
            price: 12,
            sales: 58,
            imgUrl: '/images/item-4.jpg',
            quantity: 0,
        }, {
            id: 4,
            typeid: 0,
            name: '热销榜2',
            price: 67,
            sales: 54,
            imgUrl: '/images/item-4.jpg',
            quantity: 0,
        }, {
            id: 5,
            typeid: 0,
            name: '热销榜3',
            price: 45,
            sales: 12,
            imgUrl: '/images/item-4.jpg',
            quantity: 0,
        }, {
            id: 6,
            typeid: 1,
            name: '特惠套餐1',
            price: 45,
            sales: 12,
            imgUrl: '/images/item-5.jpg',
            quantity: 0,
        }, {
            id: 7,
            typeid: 1,
            name: '特惠套餐2',
            price: 45,
            sales: 12,
            imgUrl: '/images/item-5.jpg',
            quantity: 0,
        }, {
            id: 8,
            typeid: 1,
            name: '特惠套餐3',
            price: 45,
            sales: 12,
            imgUrl: '/images/item-5.jpg',
            quantity: 0,
        }, {
            id: 9,
            typeid: 3,
            name: '配料区1',
            price: 2,
            sales: 12,
            imgUrl: '/images/item-6.jpg',
            quantity: 0,
        }, {
            id: 10,
            typeid: 3,
            name: '配料区1',
            price: 2,
            sales: 12,
            imgUrl: '/images/item-6.jpg',
            quantity: 0,
        }, {
            id: 11,
            typeid: 3,
            name: '配料区1',
            price: 2,
            sales: 12,
            imgUrl: '/images/item-6.jpg',
            quantity: 0,
        }],*/
        totalPrice: 0,
        totalPrice_str:"0",
        currentTypeId: 0
    },
    //事件处理函数
    bindViewTap: function () {
        wx.navigateTo({
            url: '../logs/logs'
        })
    },
    changeType: function (e) {
        this.setData({
            currentTypeId: e.currentTarget.dataset.totypeid
        })
    },
    ctrlFood: function (e) {
        var foods = this.data.foods,
            totalPrice = this.data.totalPrice,
            dataset = e.currentTarget.dataset,
            key = dataset.key,
            action = dataset.action;
        if (action && action == 'add') {
            foods[key].quantity += 1;
            totalPrice += parseInt(foods[key].price);
        } else if (action && action == 'del') {
            foods[key].quantity -= 1;
            totalPrice -= parseInt(foods[key].price);
        }

        var totalPrice_str = totalPrice+"";
        totalPrice_str = totalPrice_str.replace(/\d{1,3}(?=(\d{3})+$)/g, function (s) {
          return s + ','
        })

        this.setData({
            foods: foods,
            totalPrice: totalPrice,
            totalPrice_str: totalPrice_str
        });
    },
    checkOrder: function(e){
        var foods = this.data.foods,
            orderLists = [];
        foods.forEach(function(food,idx){
            if(food.quantity) {
                var newOrder = {
                    foodId: food.id,
                    foodName: food.name,
                    foodQuantity: food.quantity,
                    foodPrice: food.price,
                    foodPrice_str: food.price_str

                };
                orderLists.push(newOrder);
            }
        })
        wx.removeStorageSync("orderLists");
        wx.setStorage({
            key: "orderLists",
            data: orderLists
        })
    },
    get_all_menu_info: function (e) {
      //清空数据
      var res_navs=[];
      var res_foods = [];
      var page = this

      wx.request({
        url: 'https://chongqingsby.applinzi.com/xa_get_menu.php',
        data: {
        },
        // header: {}, // 设置请求的 header
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          console.log('success')

          var res_food_kind = res.data.kind
          var res_food_info = res.data.food

          res_food_kind.forEach(function (food_kind, idx) {
            var new_food_kind = {
              id: food_kind.kind_id,
              type: food_kind.kind_name_c,
              url: ''
            };        
            res_navs.push(new_food_kind);                
          })

          res_food_info.forEach(function (food_info, idx) {
            if (food_info.in_use > 0) {
              var str = food_info.food_price;
              str=str.replace(/\d{1,3}(?=(\d{3})+$)/g, function (s) {
                return s + ','
              })

              var new_food_info = {
                id: food_info.food_id,
                typeid: food_info.food_kind,
                name: food_info.food_name_c,
                price: food_info.food_price,
                price_str: str,
                sales: 0,
                //imgUrl: '/images/item-'+food_info.food_id+'.png',
                imgUrl: food_info.url,
                quantity: 0,
              };

              res_foods.push(new_food_info);
            }
          })


          //console.log(res_food_kind)
          //console.log(res_food_info)

          console.log(res_navs)
          console.log(res_foods)

          page.setData({
            navs: res_navs,
            foods: res_foods
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
    onLoad: function () {
        var that = this
        //调用应用实例的方法获取全局数据
        app.getUserInfo(function (userInfo) {
            //更新数据
            that.setData({
                userInfo: userInfo
            })
            that.update()
        })
        this.get_all_menu_info()
    }
})
