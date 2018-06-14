"use strict";

// 顶部下拉菜单
$(".app_jd, .service").hover(function () {
  $(this).children("[id$='_items']").toggle()
    .prev().toggleClass("hover");
});

// 全部商品分类
$("#category").hover(function () {
  $("#cate_box").toggle();
});
// 子分类
$("#cate_box").on("mouseenter", "li", showSub).on("mouseleave", "li", showSub);

function showSub() {
  $(this).children("#sub_cate_box").toggle()
    .prev().toggleClass("hover");
}

// 选择地址
$("#store_select").hover(function () {
  $(this).children("#address").toggle()
    .prev().toggleClass("hover");
  // 地址标签
  $("#address > ul.tabs").on("mouseover", "li", function (e) {
    $(this).addClass("current").siblings().removeClass("current");
  });
});
// 商品介绍 页签
$("#product_details>.main_tabs").on("click", "li", function () {
  // 切换页签
  $(this).addClass("current").siblings().removeClass("current");
  // 切换内容
  var i = $(this).index();
  $("#product_details>[id^=product]").eq(i).addClass("show").siblings().removeClass("show");
});

// 商品放大镜
var preview = {
  LIWIDTH: 62, // 保存li的宽度
  $ul: null,  // 保存小图列表ul
  moved: 0, // 保存已经左移li的个数
  $mask: null, // 保存半透明遮罩
  MSIZE: 175, // 保存mask的大小
  SMSIZE: 350, // 保存superMask的大小
  MAX: 0, // 保存mask可用的最大top和left
  $lage: null, // 保存大图
  init() { // 初始化功能
    // mask可用的最大left和top
    this.MAX = this.SMSIZE - this.MSIZE;
    // 获取小图列表ul
    this.$ul = $("#icon_list");
    // 获取mask
    this.$mask = $("#mask");
    // 获取largeDiv
    this.$lage = $("#largeDiv");

    // 为两个a绑定事件
    this.moveIconList();

    // 显示中图(#mImg)
    this.showMiddleImg();

    // 显示放大镜
    this.moveMask();
  },
  checkA() { // 每次左移之后, 检查两个a的状态
    if (this.moved === 0) { // 如果moved == 0
      // 禁用left
      $("[class^='left']").attr("class", "left_disabled");
    } else if (this.$ul.children().size() - this.moved === 5) {// 否则, 如果li个数-moved=5
      // 禁用right
      $("[class^='right']").attr("class", "right_disabled");
    } else { // 否则
      //两个都启用
      $("[class^='left']").attr("class", "left");
      $("[class^='right']").attr("class", "right");
    }
  },
  moveMask() {
    // 为superMask绑定hover事件
    $("#superMask")
      .hover(function () {
        this.$mask.toggle();
        this.$lage.toggle();
        // 获得mImg的src
        var src = $("#mImg").attr("src");
        var i = src.lastIndexOf(".");
        // 大图的src
        src = src.slice(0, i - 1) + "l" + src.slice(i);
        // 设置$lage的背景图片为src
        this.$lage.css("background", "url(" + src + ") no-repeat");
      }.bind(this))
      // 为mask绑定mousemove事件
      .mousemove(function (e) {
        // 获得鼠标的x y坐标
        var x = e.offsetX, y = e.offsetY;
        // 计算mask的top和left
        var top = y - this.MSIZE / 2, left = x - this.MSIZE / 2;
        // 如果top<0，就改回0, top>MAX，改回MAX
        if ( top < 0) top = 0;
        else if (top > this.MAX) top = this.MAX;
        // 如果left<0，就改回0, left>MAX，改回MAX
        if (left < 0) left = 0;
        else if (left > this.MAX) left = this.MAX;

        // 设置mask的top和left
        this.$mask.css({top, left});

        // 修改$lage的背景位置
        this.$lage.css(
          "background-position",
          `${- 16 / 7 * left}px ${- 16 / 7 * top}px`
        );

      }.bind(this));
  },
  moveIconList() {
    $("#preview>div>a").click(function (e) { // this -> a
      // 事件处理函数中尽量使用e.target, 而不用this, this还有其他用处
      // a的class不是以_disabled结尾
      if (!$(e.target).is("[class$='_disabled']")) {
        // 如果a是right
        if ($(e.target).is(".right")) {
          // 让ul的left-LIWIDTH
          this.$ul.css("left", parseFloat(this.$ul.css("left")) - this.LIWIDTH);

          this.moved++; // 左移
          this.checkA();

        } else {
          this.$ul.css("left", parseFloat(this.$ul.css("left")) + this.LIWIDTH);

          this.moved--; // 右移
          this.checkA();
        }
      }
    }.bind(this));
  },
  showMiddleImg() {
    // 鼠标移入小图，显示对应的中图(#mImg)
    this.$ul.on("mouseover", "li > img", function (e) {
      // 获得当前img的src
      var src = $(e.target).attr("src");
      // 查找src中最后一个.的位置
      var i = src.lastIndexOf(".");
      // 生成新的大图的src(小图src中拼接上-m)
      src = src.slice(0, i) + "-m" + src.slice(i);
      // 设置大图的src
      $("#mImg").attr("src", src);
    });
  }
}
preview.init();