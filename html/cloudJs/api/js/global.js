var plugin_data = [
        { className: "level0", text: "CloudJs", isOpen: true, children: [
               { href: "paging.html", text: "分页组件" },
               { href: "tips.html", text: "tips组件" },
               { href: "calendar.html", text: "日历组件" },
               { href: "monthpicker.html", text: "月组件" },
               { href: "dialog.html", text: "弹出框组件" },
               { href: "message.html", text: "message组件" },
               { href: "tab.html", text: "简单tab组件" },
               { href: "ctab.html", text: "复杂tab组件" },
               { href: "clip.html", text: "复制到粘贴板组件" },
               { href: "combobox.html", text: "下拉框组件" },
               { href: "cascade.html", text: "级联组件" },
               { href: "menu.html", text: "菜单组件" },
               
               { href: "mask.html", text: "蒙版组件" },
               { href: "totop.html", text: "返回到顶部组件" },
               { href: "slide.html", text: "图片轮播组件" },
               { href: "validate.html", text: "格式校验组件" },
               { href: "progressbar.html", text: "进度条组件" },
               { href: "cookie.html", text: "cookie组件" },
               { href: "draggable.html", text: "拖动组件" },
               { href: "resizable.html", text: "缩放组件" }
       ]}
    ],
    themesArr = [
        { text: "蓝色", value: "blue", color: "#199fff" },
        { text: "紫色", value: "purple", color: "#8058a5" },
        { text: "绿色", value: "green", color: "#5eb95e" },
        { text: "红色", value: "red", color: "#dd514c" },
        { text: "橘色", value: "orange", color: "#f37b1d" },
        { text: "黑色", value: "black", color: "#2d2d2d" }
                 
    ],
    themesHtml = '',
    headHtml = '', 
    indexHtml = '';

headHtml += '<!DOCTYPE html>\n';
headHtml += '<html>\n';
headHtml += '<head>\n';
headHtml += '<meta http-equiv="x-ua-compatible" content="IE=edge">\n';
headHtml += '<meta http-equiv="Content-Type" content="text/html; charset=utf-8">\n';
headHtml += '<title>cloudJs</title>\n';
headHtml += '<script src="http://cloudjs.wsd.com/cloudJs/js/jquery.min.js"></script>\n';
headHtml += '<script src="http://cloudjs.wsd.com/cloudJs/js/cloudjs.js"></script>\n';
headHtml += '</head>\n';
headHtml += '<body>\n';

for(var i = 0; i < themesArr.length; i++){
    var obj = themesArr[i];
    themesHtml += '<a class="' + obj.value + '" v="' + obj.value + '" style="background:' + obj.color + '"></a>';
}
themesHtml = '<div id="themes_a" class="themes">' + themesHtml + '</div>';


$(document).ready(function(){
    var this_url = location.href.split('example/')[1], htmlObj = {};
    $('body').prepend('<div id="menu_nav_div" class="menu_box"></div>').append(themesHtml);
    cloudjs('#menu_nav_div').menu({
        data: plugin_data,
        type: 'tree',
        selectedValue: this_url
    });
    
    
    $('.primary').before('<div class="header"><div class="header_con"><a class="logo" href="../../index.html">cloudjs</a><ul class="main_nav"><li><a href="../start_use.html">开始使用</a></li><li class="current"><a href="paging.html">组件文档</a></li><li><a href="../download.html">下载</a></li></ul></div></div>');
    $('body').removeClass('body_bg');
    renderSide();
    $('.detail_content h5').each(function(index){
        var self = $(this), num = index + 1, id = self.attr('id');
        $(this).prepend('<a name="eg' + num + '"></a>');
        indexHtml += '<li><a href="#eg' + num + '">' + $(this).text() + '</a></li>';
        var ht = self.nextAll('div');
        htmlObj[ht.attr('class')] = ht.html();
    });
    $('.comps_header').after('<ul class="comps_index_ul">' + indexHtml + '</ul>');
    $('.detail_content h5').append('<a class="btn copy_eg">复制示例源码</a>');
    prettyPrint();
    cloudjs.cookie('getCookie', 'themes', function(v){
        $('.' + v).css({width:'25px',height:'25px'});
        cloudjs.themes(v);
    });
    
    cloudjs('.copy_eg').clip({
        swfPath: '../../js/Clipboard.swf', 
        onCopy: function(){
            var jqObj = $(this).parent().nextAll('div'), k = jqObj.attr('class');
            return headHtml + htmlObj[k] + '<script>' + jqObj.nextAll('script').html() + '</script>\n</body>\n</html>';
        },
        afterCopy: function(){
            cloudjs.message({ content: '复制成功', relative: this, position: 'right', duration: 1000 });
        } 
    });
    
    $('#themes_a a').bind('click', function(){
        var v = $(this).attr('v');
        cloudjs.cookie('setCookie', { name: 'themes', value: v });
        $('.' + v).css({width:'25px',height:'25px'}).siblings().css({width:'20px',height:'20px'});
        cloudjs.themes(v);
        cloudjs.message({content: '已成功换肤', duration: 1000});
    });
    
    
    if(location.href.indexOf('totop.html') === -1){
        cloudjs.totop();
    }
    
    var $menu=$('#menu_nav_div'),topVal;
    $(window).scroll(function(){
        topVal=$(this).scrollTop();
        if(topVal>=100){
            $menu.css({'top':topVal});
        }else{
            $menu.css({'top':80});
        }
    });
    
});

function renderSide(){
    var pluginHtml = [],
        hash=location.hash;
    for(var i = 0; i < plugin_data.length; i++ ){
        var plugin = plugin_data[i];
        if(i == 0 && hash==''){
            pluginHtml.push('<li class="current"><a href="../example/' + plugin.name + '.html">' + plugin.title + '</a></li>');
        }else{
            pluginHtml.push('<li><a class="'+plugin.name+'" href="../example/' + plugin.name + '.html">' + plugin.title + '</a></li>');
        };
    };
    $('#comp_list').html(pluginHtml.join(''));
}

function writeCode(example, type){
    var code = '', $this = $(example), ele,
        html=$this.html();
        if(!html) return;
    if(!-[1,]){
        html=html.replace(/<\/?([A-Z]+)/gm,function($1){return $1.toLowerCase()}).replace(/>\s?</gm,'>\n<');
    }
    html=html.replace(/</gm,'&lt;').replace(/>/gim,'&gt;');
    code += '<pre class="prettyprint linenums"';
    code += '>';
    code += $.trim(html);
    code += '</pre>';
    $this.after(code);
};
