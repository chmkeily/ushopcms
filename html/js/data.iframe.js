
function setDefaultTab(obj,tit,url){
 	obj.tabs('add',{
 		title:tit,
 		width:50,
 		content:"<iframe class='" + navId + "' frameborder='0'  src='" + url + "'></iframe>",
 		fit:true,
 		border:false,
 		iconCls:'icon-reload',
 		closable:true
 	});	
 }

function addTab(tit,url){
	var dtit = tit,
		tflag = true;
	if($ttbox.tabs('exists',tit)){
		var tabs = $ttbox.tabs('tabs');
		for(var i=0;i<tabs.length;i++){
			var furl = tabs[i].find(">iframe").attr("src");
			if(furl==url){
				tflag = false;
				$ttbox.tabs('select',i);
				break;
			}
		}
	}
	if(tflag){
		$ttbox.tabs('add',{
			title:tit,
			content:"<iframe class='" + navId + "' frameborder='0'  src='" + url + "'></iframe>",
			fit:true,
			border:false,
			iconCls:'icon-reload',
			closable:true
		});
	}
	window.location.hash = "#navId=" + navId + "#tabUrl=" + url + "#tabTitle=" + dtit;
}


function reloadTab(){
	var tab = $ttbox.tabs('getSelected'),
		html = tab.html();
	tab.html(html);
}

function createTree(arr){
	var resultHtml = "";
	for(var i=0;i<arr.length;i++){
		var obj = arr[i],subObj = obj.children;
		if(obj.ishide){
		    continue;
		}
		if(!subObj || subObj.length==0){
			resultHtml += "<div class='pmenu "+obj.id+"'><a v='"+obj.title+"' href='"+obj.url+"'>"+obj.name+"</a></div>"
		}else{
			if(obj.isOpen){
				resultHtml += "<div class='pmenu smenu "+obj.id+"'><span>"+obj.name+"</span></div><ul>";
			}else{
				resultHtml += "<div class='pmenu "+obj.id+"'><span>"+obj.name+"</span></div><ul style='display:none;'>";
			}
			for(var j=0;j<subObj.length;j++){
				var obj2 = subObj[j];
				if(obj2.ishide){
		            continue;
		        }
				resultHtml += "<li class='"+obj2.id+"'><a v='"+obj2.title+"' href='"+obj2.url+"'>"+obj2.name+"</a></li>";
			}
			resultHtml += "</ul>";
		}
	}
	return resultHtml;
}

$(function(){
	navId = "data1";
	$ttbox = $("#ttbox");
	var $tree = $("#commonMenu");
	var winurl = window.location.href;
	if(winurl.indexOf("#navId=")!=-1){
		var barr = winurl.split("#navId=")[1].split("#tabUrl="),
			arr = barr[1].split("#tabTitle="),
			url = arr[0];
		navId = barr[0];
		if(navId.match(/\W/) !== null) navId = 'data1';
		$('#'+navId).addClass("selector").siblings().removeClass("selector");
		try{
			var tit = decodeURIComponent(arr[1]);
			var trr = tit.match(/[<>&]/);
			if(trr!=null){
				alert("非法参数!");
				tit = "";
			}
		}catch(e){
			alert("非法参数");
			tit = "";
		}
		setDefaultTab($ttbox,tit,url);
	}else{
		setDefaultValue($ttbox);
	}
	
	$tree.html(createTree(ushopTreeData[navId]));

	$ttbox.tabs({
	    onSelect:function(title){
			var $iframe = $("div.panel:visible>.panel-body>iframe",$ttbox),
				url = $iframe.attr("src"),
				menu = $iframe.attr("class");
			window.location.hash = "#navId=" + menu + "#tabUrl=" + url + "#tabTitle=" + title;
	    }  
	});

	
	$("li .icon-reload",$ttbox).die().live('click',function(){
		reloadTab();	
	});
	
	
	$("#tab-tools>a").click(function(){
		var $li = $(".tabs-wrap li",$ttbox),
			len = $li.length,
			index = 0;
		$li.each(function(){
			if($(this).hasClass("tabs-selected")){
				index = 1;
			}
			$ttbox.tabs('close',index);
		});
	});
	
	$tree.find(".pmenu").die().live('click',function(){
		if($(this).hasClass("smenu")){
			$(this).removeClass("smenu").next().hide();
		}else{
			$(this).addClass("smenu").siblings(".pmenu").removeClass("smenu").end().siblings("ul").hide().end().next().show();
		}
	});
	
	
	$tree.find("a").die().live('click',function(){
		if($(this).hasClass("newWindow")){
			return true;
		}
		var tit = $(this).attr("v");
		var url = $(this).attr("href");
		addTab(tit,url);
		return false;	
	});
	
	$("#bartitle a").click(function(){
		var key = $(this).attr("id");
		$(this).addClass("selector").siblings().removeClass("selector");
		navId = key;
		$tree.html(createTree(ushopTreeData[navId]));
		return false;
	});
});