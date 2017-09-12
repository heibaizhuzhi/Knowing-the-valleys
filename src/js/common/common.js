/**
 * 导航三个功能点：
 * 1、用户信息展示
 * 2、点击标题子列表显示隐藏
 * 3、根据访问的页面添加对应的焦点
 * */
var userinfoStr = localStorage.getItem("userinfo");
var userinfo =JSON.parse(userinfoStr);
$(".aside img").attr("src",userinfo.tc_avatar);
$(".aside h4").text(userinfo.tc_name);


$('.navs ul').prev('a').on('click', function () {
	$(this).next().slideToggle();
});

// 根据访问的页面给对应的标题添加焦点：
var path =location.pathname;
$(".navs a").removeClass("active");
$('.navs a[href="' + path + '"]').addClass('active').parents("ul").show();