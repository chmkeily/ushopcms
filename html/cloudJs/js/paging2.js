$.fn.paging = function(options){
    console.log(this);
    var defaults = {
        first: '',
        prev: '上一页',
        next: '下一页',
        last: '',
        showDetails: true,
        showIcons: false,
        useSimple: false,
        totalCounts: 1000,
        pageSize: 20,
        pageNum: 1,
        visiblePages: 5,
        disableClass: 'disabled',
        activeClass: 'active',
        ajaxUrl: '',
        params: '',
        dataType: 'json',
        sizeKey: 'pageSize',
        numKey: 'pageNum',
        maskId: '',
        loadImg: '../../images/ajax-loading.gif',
        onPageChange: function(data){}
    };
    
    if($.isPlainObject(options) || !options){
        $.extend(defaults,options);
        $(this).data('initData', defaults);
    }else if(options == 'setData'){
        defaults = $.extend($(this).data('initData'), arguments[1]);
    }else if(options == 'getData'){
        return $(this).data('initData');
    };
    
    var self = this,
        first = defaults.first,
        prev = defaults.prev,
        next = defaults.next,
        last = defaults.last,
        showDetails = defaults.showDetails,
        showIcons = defaults.showIcons,
        useSimple = defaults.useSimple,
        totalCounts = Number(defaults.totalCounts),
        pageSize = Number(defaults.pageSize),
        pageNum = Number(defaults.pageNum),
        visiblePages = Number(defaults.visiblePages),
        disableClass = defaults.disableClass,
        activeClass = defaults.activeClass,
        ajaxUrl = defaults.ajaxUrl,
        params = defaults.params,
        sizeKey = defaults.sizeKey,
        numKey = defaults.numKey,
        maskId = defaults.maskId,
        pageChangeCallback = (defaults.onPageChange instanceof Function) ? defaults.onPageChange : new Function();

    if(totalCounts == 0){
        $(self).empty();
        return;
    }
    _init(pageSize, pageNum);
    
    /**
    * 初始化组件
    * @param {Number} s 每页展示的记录数
    * @param {Number} n 当前页码
    */
    function _init(s, n){
        n = _verify(s, n);
        if(n==0){
            alert("error：totalCounts|pageSize|pageNum|visiblePages参数设置错误");
            return;
        };
        _renderHtml(s, n);
        _autoAjax(s, n);
        
    };
    
    /**
    * 参数校验
    * @param {Number} s 每页展示的记录数
    * @param {Number} n 当前页码
    * @return {Number} 当前页码
    */
    function _verify(s, n){
        if(isNaN(totalCounts) || isNaN(s) || isNaN(n) || isNaN(visiblePages) || s < 1){
            return 0;
        };
        if(n < 1){
            n = 1;
        }else if(n > Math.ceil(totalCounts / s)){
            n = Math.ceil(totalCounts / s);
        };
        return n;
    };
    
    /**
    * ajax自动请求
    * @param {Number} s 每页展示的记录数
    * @param {Number} n 当前页码
    */
    function _autoAjax(s, n){
        if(ajaxUrl){
            var _params = params, _interface = ajaxUrl + '?', _mask = _createMask();
            if($.isPlainObject(_params)){
                var _obj = {}; _obj[sizeKey] = s; _obj[numKey] = n; 
                _params = $.extend(params, _obj);
                for( var key in _params){
                    _interface += key + '=' + _params[key] + '&';
                };
            }else{
                _params = sizeKey + '=' + s + '&' + numKey + '=' + n + '&' + params;
                _interface += _params;
            };
            if(_interface.charAt(_interface.length-1) == '&') _interface = _interface.substring(0, _interface.length - 1);
                            
            $.post(ajaxUrl, _params, function(data){
                pageChangeCallback({ totalCounts: totalCounts, pageSize: s, pageNum: n, params: params, data: data, url: _interface });
                if(_mask != null) _mask.remove();
            }, defaults.dataType);
            
            
        }else{
            pageChangeCallback({ totalCounts: totalCounts, pageSize: s, pageNum: n, params: params });
        };
    };
    
    /**
    * 添加蒙版效果
    * @return {Object} 蒙版的jquery对象
    */
    function _createMask(){
        if(!maskId) return null;
        var _mask = $('<div style="display:none;"><div class="paging_mask"></div><img class="paging_loading" src="' + defaults.loadImg + '"/></div>').appendTo('body'),
            _dataObj = $('#'+maskId),
            _imgObj = _mask.find('img'),
            _maskObj = { height: _dataObj.height() };
        if(_maskObj.height > 99){
            _mask.show();
            $.extend(_maskObj, { width:_dataObj.width() }, _dataObj.offset());
            if(!_dataObj.is("body")){
                var _winht = $(window).height(), _sctop = $(document).scrollTop(), _top, _pos = _maskObj.top - _sctop;
                //mask对象的top大于$(document).scrollTop()
                if(_pos > 0){
                    //mask对象bottom值超出屏幕
                    if(_pos + _maskObj.height > _winht){
                        _top = (_maskObj.top + _winht + _sctop) / 2;
                    }else{
                        _top = (_maskObj.top + _maskObj.height / 2);
                    }
                }else{
                    _top = (_maskObj.top + _maskObj.height + _sctop) / 2;
                };
                _imgObj.css({ top: _top + 'px', left: (_maskObj.left + _maskObj.width / 2) + 'px', position: 'absolute' })
                .prev().css({ width: _maskObj.width + 'px', height: _maskObj.height + 'px', top: _maskObj.top + 'px', left: _maskObj.left + 'px', position: 'absolute' });
            }
        }
        return _mask;
    };
    
    /**
    * 生成分页组件的html代码放入到当前对象中
    * @param {Number} s 每页展示的记录数
    * @param {Number} n 当前页码
    */
    function _renderHtml(s, n){
        var _htmlArr = [], _html = '';
        if(first){
            _htmlArr.push(_getBtnHtml([n, 1, 'first', first]));
        };
        if(prev){
            _htmlArr.push(_getBtnHtml([n, 1, 'prev', prev]));
        };
        if(useSimple){
            _htmlArr.push('<li class="ellipsis">' + n + '/' + Math.ceil(totalCounts / s) + '</li>');
        }else if(visiblePages > 0){
            _htmlArr.push(_getPagesHtml(n, _getPagesArr(s, n)));
        };
        if(next){
            _htmlArr.push(_getBtnHtml([n, Math.ceil(totalCounts / s), 'next', next]));
        };
        if(last){
            _htmlArr.push(_getBtnHtml([n, Math.ceil(totalCounts / s), 'last', last]));
        };
        _html = '<ul>' + _htmlArr.join('') + '</ul>';
        if(showDetails && !useSimple) _html += _getDetailsHtml(s, n);
        $(self).html('<div class="paging_div">' + _html + '</div>');
        _bindEvnet();
    };
    
    /**
    * 生成所有页号的html
    * @param {Number} n 当前页码
    * @param {Array} nArr 所有页号的数字
    * @return {String} html代码
    */
    function _getPagesHtml(n, nArr){
        var _html = '', _class = 'page';
        for(var i = 0; i < nArr.length; i ++){
            var _num = nArr[i];
            if(n == _num){
                _html += '<li class="page ' + activeClass + '"><a>' + _num + '</a></li>';
            }else if(_num == '...'){
                _html += '<li class="ellipsis">' + _num + '</li>';
            }else{
                _html += '<li class="page"><a>' + _num + '</a></li>';
            };
        };
        return _html;
    };
    
    /**
    * 生成所有页号后面那一串html
    * @param {Number} s 每页展示的记录数
    * @param {Number} n 当前页码
    * @return {String} html代码
    */
    function _getDetailsHtml(s, n){
        var _html = '<div><span>共' + Math.ceil(totalCounts / s) + '页 , </span>';
        _html += '<span>每页</span><input type="text" class="size" value="' + s + '"/><span>项 , </span>';
        _html += '<span>到第</span><input type="text" class="num" value="' + n + '"/><span>页</span> ';
        _html += '<input type="button" class="cloud_btn" value="确定"/></div>';
        return _html;
    };
    
    /**
    * 获取所有页号保存到数组中
    * @param {Number} s 每页展示的记录数
    * @param {Number} n 当前页码
    * @return {Array} 要展示的所有页号
    */
    function _getPagesArr(s, n){
        var _arr = [], _total = Math.ceil(totalCounts / s);
        if(visiblePages == 0) return [];
        if(visiblePages > _total){
            visiblePages = _total;
        };
        var _half = Math.floor(visiblePages / 2),
            _start = n - _half + 1 - visiblePages % 2,
            _end = n + _half;
        if(_start < 1) {
            _start = 1;
            _end = visiblePages;
        };
        if(_end > _total) {
            _end = _total;
            _start = 1 + _total - visiblePages;
        };
        var _index = _start;
        while(_index <= _end) {
            _arr.push(_index);
            _index ++;
        };
        if(_start > 1){
            if(_start > 2) _arr.unshift('...');
            _arr.unshift(1);
        };
        if(_end < _total){
            if(_end < _total - 1) _arr.push('...');
            _arr.push(_total);
        };
        return _arr;
    };
    
    /**
    * 生成(上/下/首/末)页按钮的html代码
    * @param {Array} arr [当前页码,当前按钮变灰时的页码,'当前按钮的class值','当前按钮的文本值']
    * @return {String} html代码
    */
    function _getBtnHtml(arr){
        var _class = arr[2], _aclass = '';
        if(showIcons) _aclass = ' class="cloud_icon"';
        if(arr[0] == arr[1]){
            _class += ' ' + disableClass;
        };
        return '<li class="' + _class + '"><a' + _aclass + '>' + arr[3] + '</a></li>';
    };
    
    /**
    * 绑定分页组件所有按钮的点击事件
    */
    function _bindEvnet(){
        $(self).find('li:not(.ellipsis)').bind('click', function(){
            var _num;
            if($(this).hasClass(disableClass) || $(this).hasClass(activeClass)) return;
            if($(this).hasClass('first')){
                _num = pageNum = 1;
            }else if($(this).hasClass('prev')){
                _num = -- pageNum;
            }else if($(this).hasClass('next')){
                _num = ++ pageNum;
            }else if($(this).hasClass('last')){
                _num = pageNum = Math.ceil(totalCounts / s);
            }else{
                _num = pageNum = Number($(this).text());
            };
            $.extend($(self).data('initData'), { pageNum: _num });
            _init(pageSize,_num);
        }).end().find('.cloud_btn').bind('click', function(){
            _reinit(Number($(this).prevAll('.size').val()), Number($(this).prevAll('.num').val()));
        }).end().find('input[type=text]').keyup(function(event){
            if(event.keyCode == 13){
                var _parent = $(this).parent();
                _reinit(Number(_parent.find('.size').val()), Number(_parent.find('.num').val()));
            };
        });
    };
    
    /**
    * 改变pageSize后重新赋值并初始化组件
    * @param {Number} s 每页展示的记录数
    * @param {Number} n 当前页码
    */
    function _reinit(s, n){
        pageSize = s;
        pageNum = n;
        $.extend($(self).data('initData'), { pageSize: s, pageNum: n });
        _init(s, n);
    };
};