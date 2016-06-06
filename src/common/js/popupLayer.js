/*  
 * 简单的弹出居中显示
 * @param {object,callback}
     object有如下参数
     @param {domElem} triggerElem  触发的元素  
     @param {domElem} popupElem  弹窗容器 元素
     @param {domElem} closeElem  关闭按钮元素

     callback是点击关闭按钮的回调函数 
	 renderCallBack: 页面渲染的回调函数

 * object中的所有传递参数的形式 以id形式 #id 或者class类名 如：.class 等
 * 调用方式如下：
 new PopupLayer({
	 "triggerElem" : '.xx',
	 "popupElem" : '.xx',
	 "closeElem" : '.xx'
 },function(){
	
 });
*/
function PopupLayer(cfg,callback){

	this.triggerElem = cfg.triggerElem;
	this.popupElem = cfg.popupElem;
	this.closeElem = cfg.closeElem;

	this.callback = callback;
	this.renderCallBack = cfg.renderCallBack;

	this.init();
}
PopupLayer.prototype.init = function() {
	var me = this;
	var triggerElem = $(this.triggerElem),
		popupElem = $(this.popupElem),
		closeElem = $(this.closeElem);
    
	if(triggerElem.length < 1) {
		return;
	}
	// 绑定事件
	triggerElem.on('click',function(e){
		e.preventDefault();
		me.show($(this));
	});
	closeElem.each(function(){
		$(this).on('click',function(e){
			e.preventDefault();
			me.hide();
			me.callback && $.isFunction(me.callback) && me.callback();
		});
	});
}
PopupLayer.prototype.show = function($this){
	var me = this;
	//以下部分使整个页面至灰不可点击
	var mybg = $("#mybg");
	if(mybg.length < 1) {
		var divBg = document.createElement("div"); //首先创建一个div
		divBg.setAttribute("id","mybg");

		divBg.style.background = "#000000";
		divBg.style.width = "100%";
		divBg.style.height = "100%";
		divBg.style.position = "fixed";
		divBg.style.top = "0";
		divBg.style.left = "0";
		divBg.style.zIndex = "500";
		divBg.style.opacity = "0.5";
		
		//背景层加入页面
		document.body.appendChild(divBg);
		document.body.style.overflow = "hidden"; //取消滚动条
	}else {
		mybg.removeClass("hidden");
	}
	var popupElem = $(this.popupElem);
	if(!popupElem.hasClass("hidden")) {
		return;
	}
	// 弹窗显示
	popupElem.removeClass("hidden");
	var left = (document.documentElement.clientWidth - popupElem.width())/2 + "px";
	var top = (document.documentElement.clientHeight - popupElem.height())/2 + $(window).scrollTop() - 20 + "px";
	// 给弹窗设置居中对齐
	popupElem.css({"left":left,"top":top,"zIndex":1000});
	me.renderCallBack && $.isFunction(me.renderCallBack) && me.renderCallBack($this);
}
PopupLayer.prototype.hide = function(){
	var popupElem = $(this.popupElem),
	    mybg = $("#mybg");

	if(popupElem.hasClass("hidden")) {
		return;
	}
	popupElem.addClass("hidden");
	mybg.addClass("hidden");
	//恢复页面滚动条
	$("body").css({"overflow":"hidden"});
}
PopupLayer.prototype.position = function(popupElem){
	var left = (document.documentElement.clientWidth - popupElem.width())/2 + "px";
	var top = (document.documentElement.clientHeight - popupElem.height())/2 + $(window).scrollTop() - 20 + "px";
	// 给弹窗设置居中对齐
	popupElem.css({"left":left,"top":top,"zIndex":1000});
}
module.exports = PopupLayer;