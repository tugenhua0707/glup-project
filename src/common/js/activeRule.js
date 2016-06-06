
var obj = {
	/*
	 * 活动规则调用
	 * @param {string} ruleId 活动规则id
	 * @param {string} ruleURL 活动规则的url 默认为 http://activity.tongbanjie.com/common/wap/getActivityRule
	 * @param {domElem} dom元素 需要把数据放在哪个容器里面去
	 依赖于HTML结构
	 <div class="active-rule J_Active">活动规则<i></i></div>
	 <div class="active-content hidden" id="J_ActContent"><div class = "active-inner"></div></div>
	 */
	var activeRule = function(ruleId,ruleURL){

		// 活动规则的url
		var activeRuleURL = "XX";

		var ruleId = ruleId,
			ruleURL = ruleURL;

		var domElem = $(domElem);
		// 没有规则id的话 直接return
		if(!ruleId) {
			return;
		}
		if(ruleURL) {
			activeRuleURL = ruleURL;
		}
		
		$.ajax({
	      url: activeRuleURL,
	      dataType: "json",
	      data:{
	        "ruleId": ruleId,
	      },
	      success: function(result){
	      	domElem.removeClass("hidden");
	        if(result.code == 0){
	          var dataList = result.data.ruleList;
	          var tpl = "";
	          for(var i = 0; i < dataList.length; i++){
					  tpl += '<div class="active-title"><span></span><i>'+result.data.ruleList[i].title+'</i></div><div class = "active-inner">';
					  for(var j = 0; j < result.data.ruleList[i].list.length; j++) {
					  	  tpl += "<p>" + result.data.ruleList[i].list[j] +"</p>";
					  }
					  tpl += "</div>";
	          } 
	          domElem.html(tpl);

			}else {
				var tpl = "<div class='load-failure'><div class='pcls'>数据加载失败</div><div class='refresh' id='refresh'>点击<span>刷新</span></div></div>";
		        domElem.find(".active-inner").html(tpl);
		        var refresh = document.getElementById("refresh");
		        refresh.onclick = function(){
		           refresh.parentNode.removeChild(refresh);
		           // 调用函数自身
		           arguments.callee();
		        }
			}
		  },
		  error: function(){
		  	var tpl = "<div class='load-failure'><div class='pcls'>数据加载失败</div><div class='refresh' id='refresh'>点击<span>刷新</span></div></div>";
	        domElem.find(".active-inner").html(tpl);
	        var refresh = document.getElementById("refresh");
	        refresh.onclick = function(){
	           refresh.parentNode.removeChild(refresh);
	           // 调用函数自身
	           arguments.callee();
	        }
		  }
		})
	};
	/*  
	 * 活动规则 滚动的js文件
	 * @param {e} 需要被点击的元素的事件
	*/
	var scrollBar = function(e) {
		e.preventDefault();
		var ruleDom = $(e.target);
		var isHeight = false;
	    var runNum = 0;
	    var oldScroll = 0;
	    if(isHeight){
	    	var newScroll = $(document.body).scrollTop();
	    	var scrollBottom = newScroll - oldScroll;

	    	var timeId = setInterval(function(){
	          newScroll -= scrollBottom / 25;
	          if(runNum < 25){
	            runNum++;
	            $(document.body).scrollTop(newScroll);

	          }else{
	            runNum = 0;
	            clearInterval(timeId);
	          }
	        },16);
	    	setTimeout(function(){
	          ruleDom.css("display","none");
	        },410);
	        isHeight = false;
	    }else {
	    	var scrollTop = e.y - 25;
	        oldScroll =  $(document.body).scrollTop();
	        ruleHeight = ruleDom.height();
	        ruleDom.css({"height":ruleDom.height() + "px","display":"block"});
	        var i = 0;
	        var timeId = setInterval(function(){
	          i += scrollTop / 25;
	          if(runNum < 25){
	            runNum++;
	            $(document.body).scrollTop(i + oldScroll);
	          }else{
	            runNum = 0;
	            clearInterval(timeId);
	          }
	        },16);
	        isHeight = true;
	    }
	};
	return {
		"activeRule" : activeRule,
		"scrollBar" : scrollBar
	}
};
exports.obj = obj;