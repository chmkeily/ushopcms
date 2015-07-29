/**
 * 表格组件
 * author: amixu@tencent.com
 * date: 2015-07-08
 */
 
cloudjs.define({
    table: function(options){
        var defaults = {
            first: '',                //首页文字，留空则不显示首页
            prev: '上一页',           //上一页文字，留空则不显示上一页
            next: '下一页',           //下一页文字，留空则不显示下一页
            last: '',                 //末页文字，留空则不显示末页
            showDetails: true,        //是否显示详细的分页即分页后面那一串内容
            showIcons: false,         //首末上下页是否用图标
            useSimple: false,         //是否采用简单的分页
            totalCounts: 1000,        //总记录数
            pageSize: 20,             //每页展示的记录数
            pageNum: 1,               //当前页码
            visiblePages: 5,          //显示的页码数量
            disableClass: 'disabled', //不可点击时的样式
            activeClass: 'active',    //当前页码的样式
            ajaxUrl: '',              //请求的url，留空则需要在onBodyChange事件中发起ajax请求，不留空则组件自动请求ajaxUrl，直接在onBodyChange事件中通过data.data获取数据
            params: '',               //请求的参数，查询操作时通过setData方法设置，在onBodyChange事件中用data.params获取
            dataType: 'json',         //请求ajaxUrl返回的数据类型，如果ajaxUrl为空，这个参数也没有意义
            sizeKey: 'pageSize',      //组件向外传递参数pageSize的key值
            numKey: 'pageNum',        //组件向外传递参数pageNum的key值
            loadImg: 'http://3gimg.qq.com/mig_op/cloudJs/images/paging_loading.gif',  //蒙版层加载图片的路径
            pagingFlag: 0,            //是否分页，0表示静态分页，负数不分页，正数动态分页
            tableData: [],            //每一列的数据
            maskId: null,             //要加蒙版层的id，如果不为空，ajax请求返回数据前会在此id区域加一层蒙版效果
            emptyData: '没有数据',
            onBodyChange: $.noop,                         //重构tbody和tfoot后触发的事件
            onHeadChange: $.noop,                         //重构thead后触发的事件
            onAjax: function(data){                       //返回数据列表
                if($.isPlainObject(data)){
                    return data.data;
                }else{
                    return data;
                }
            },
        };
        
        if($.isPlainObject(options) || !options){
            $.extend(defaults,options);
            $(this).data('initData', defaults);
        }else if(options === 'setData'){
            defaults = $.extend($(this).data('initData'), arguments[1]);
        }else if(options === 'getData'){
            cloudjs.callback($(this).data('initData'));
            return;
        }
        
        var _self = this,
            _first = defaults.first,
            _prev = defaults.prev,
            _next = defaults.next,
            _last = defaults.last,
            _showDetails = defaults.showDetails,
            _showIcons = defaults.showIcons,
            _useSimple = defaults.useSimple,
            _totalCounts = defaults.totalCounts,
            _pageSize = Number(defaults.pageSize),
            _pageNum = Number(defaults.pageNum),
            _visiblePages = Number(defaults.visiblePages),
            _disableClass = defaults.disableClass,
            _activeClass = defaults.activeClass,
            _ajaxUrl = defaults.ajaxUrl,
            _params = defaults.params,
            _sizeKey = defaults.sizeKey,
            _numKey = defaults.numKey,
            _maskId = defaults.maskId,
            _pagingFlag = defaults.pagingFlag,
            _tableData = defaults.tableData,
            _onBodyChange = defaults.onBodyChange,
            _onHeadChange = defaults.onHeadChange,
            _onAjax = defaults.onAjax,
            _dataList = null,
            _thead = [];

        if(_totalCounts === 0){
            _self.html(defaults.emptyData);
            return;
        }
        
        _init(_pageSize, _pageNum);
        
        /**
        * 初始化组件
        * @param {Number} s 每页展示的记录数
        * @param {Number} n 当前页码
        */
        function _init(s, n){
            n = _verify(s, n);
            if(n == 0){
                alert("error：totalCounts|pageSize|pageNum|visiblePages参数设置错误");
                return;
            }
            _ajaxFunc(s, n, _renderHtml)
        }
        
        /**
        * 参数校验
        * @param {Number} s 每页展示的记录数
        * @param {Number} n 当前页码
        * @return {Number} 当前页码
        */
        function _verify(s, n){
            if(isNaN(s) || isNaN(n) || isNaN(_visiblePages) || s < 1) return 0;
            if(n < 1) n = 1;
            return n;
        }
        
        /**
        * 加载组件
        * @param {Number} s 每页展示的记录数
        * @param {Number} n 当前页码
        * @param {Function} func ajax请求完成后要加载的函数
        */
        function _ajaxFunc(s, n, func){
            if(_pagingFlag <= 0 && _dataList){
                func(s, n);
            }else{
                var params = _params, url = _ajaxUrl + '?', mask = _createMask();
                if(_pagingFlag >= 0){
                    if($.isPlainObject(params)){
                        var obj = {}; obj[_sizeKey] = s; obj[_numKey] = n;
                        params = $.extend(_params, obj);
                        for( var key in params){
                            url += key + '=' + params[key] + '&';
                        }
                    }else{
                        params = _sizeKey + '=' + s + '&' + _numKey + '=' + n + '&' + _params;
                        url += params;
                    }
                }
                if(url.charAt(url.length-1) === '&') url = url.substring(0, url.length - 1);             
                $.post(_ajaxUrl, params, function(data){
                    _dataList = _onAjax(data);
                    if(_pagingFlag <= 0){
                        _totalCounts = _dataList.length;
                    }else if($.isFunction(_totalCounts)){
                        _totalCounts = Number(_totalCounts(data));
                    }
                    if(_totalCounts === 0){
                        _self.html(defaults.emptyData);
                    }else{
                        func(s, n);
                    }
                    if(mask != null) mask.remove();
                }, defaults.dataType);
            }
        }
        
        /**
        * 添加蒙版效果
        * @return {Object} 蒙版的jquery对象
        */
        function _createMask(){
            if(_maskId === '') return null;
            var mask = $('<div style="display:none;"><div class="paging_mask"></div><img class="paging_loading" src="' + defaults.loadImg + '"/></div>').appendTo('body'),
                dataObj = _maskId ? $('#' + _maskId) : _self,
                imgObj = mask.find('img'),
                maskObj = { height: dataObj.height() };
            if(maskObj.height > 99){
                mask.show();
                $.extend(maskObj, { width:dataObj.width() }, dataObj.offset());
                if(!dataObj.is("body")){
                    var _winht = $(window).height(), _sctop = $(document).scrollTop(), _top, _pos = maskObj.top - _sctop;
                    //mask对象的top大于$(document).scrollTop()
                    if(_pos > 0){
                        //mask对象bottom值超出屏幕
                        if(_pos + maskObj.height > _winht){
                            _top = (maskObj.top + _winht + _sctop) / 2;
                        }else{
                            _top = (maskObj.top + maskObj.height / 2);
                        }
                    }else{
                        _top = (maskObj.top + maskObj.height + _sctop) / 2;
                    }
                    imgObj.css({ top: _top + 'px', left: (maskObj.left + maskObj.width / 2) + 'px', position: 'absolute' })
                    .prev().css({ width: maskObj.width + 'px', height: maskObj.height + 'px', top: maskObj.top + 'px', left: maskObj.left + 'px', position: 'absolute' });
                }
            }
            return mask;
        }
        
        /**
        * 生成分页组件的html代码放入到当前对象中
        * @param {Number} s 每页展示的记录数
        * @param {Number} n 当前页码
        * @param {JSONArray} arr 表格的数据列表
        */
        function _renderHtml(s, n){
            var htmlArr = [], pageHtml = '', tbody = [], tfoot = '', start = 0, limit = _pageSize, len = _dataList.length;
            if(_pagingFlag >= 0){
                if(_first){
                    htmlArr.push(_getBtnHtml([n, 1, 'first', _first]));
                }
                if(_prev){
                    htmlArr.push(_getBtnHtml([n, 1, 'prev', _prev]));
                }
                if(_useSimple){
                    htmlArr.push('<li class="ellipsis">' + n + '/' + Math.ceil(_totalCounts / s) + '</li>');
                }else if(_visiblePages > 0){
                    htmlArr.push(_getPagesHtml(n, _getPagesArr(s, n)));
                }
                if(_next){
                    htmlArr.push(_getBtnHtml([n, Math.ceil(_totalCounts / s), 'next', _next]));
                }
                if(_last){
                    htmlArr.push(_getBtnHtml([n, Math.ceil(_totalCounts / s), 'last', _last]));
                }
                pageHtml = '<ul>' + htmlArr.join('') + '</ul>';
                if(_showDetails && !_useSimple) pageHtml += _getDetailsHtml(s, n);
                tfoot = '<tfoot><tr><td class="tpage" colspan="' + _tableData.length + '"><div class="paging_div">' + pageHtml + '</div></td></tfoot>';
            }
            
            if(_pagingFlag === 0){
                start = (_pageNum - 1) * _pageSize;
                (len < _pageNum * _pageSize) && (limit = len % _pageSize);
            }else if(len < limit || _pagingFlag < 0){
                limit = len;
            }
            
            if(_thead.length === 0){
                _thead = _getTheadArray();
                tbody = _getTbodyArray(start, limit);
                _self.html('<table class="paging_table"><thead>' + _thead.join('') + '</thead><tbody>' + tbody.join('') + '</tbody>' + tfoot + '</table>');
                _onHeadChange(_self.find('thead'));
                _onBodyChange(_self.find('tbody'));
                _bindSortEvent();
            }else{
                tbody = _getTbodyArray(start, limit);
                _self.find('tbody').html(tbody.join(''));
                if(_pagingFlag >= 0){
                    _self.find('tfoot .paging_div').html(pageHtml);
                }
                _onBodyChange(_self.find('tbody'));
            }
            _bindEvent();
        }
        
        /**
        * 生成table中的thead数组代码
        * @return {Array} thead的html数组代码
        */
        function _getTheadArray(){
            var theadArr = ['<tr>'];
            for(var i = 0; i < _tableData.length; i++){
                var obj = _tableData[i], css = '', st = obj.sort ? 'sort_' + obj.sort : '', flag = true, sk;
                if(obj.width) css += ' style="width:' + obj.width + '"';
                if(obj.className) st = obj.className + ' ' + st;
                if(st) css += ' class="' + st + '"';
                if(obj.defaultSort && flag){
                    flag = false;
                    _dataList.sort(_sort(obj.key, obj.sort, obj.defaultSort));
                    if(st){
                        sk = obj.defaultSort > 0 ? ' sort_up' : ' sort_down';
                        css = css.replace(/\"$/, sk + '"');
                    }
                }
                theadArr.push('<th' + css + '>' + obj.title + '</th>');
            }
            theadArr.push('</tr>');
            return theadArr;
        }
        
        /**
        * 生成table中的tbody数组代码
        * @param {Number} start 开始记录数
        * @param {Number} limit 显示的记录数
        * @return {Array} tbody的html数组代码
        */
        function _getTbodyArray(start, limit){
            var tbodyArr = [];
            for(var j = start; j < start + limit; j++){
                var dataObj = _dataList[j], tr = '';
                for(var i = 0; i < _tableData.length; i++){
                    var obj = _tableData[i], css = '', key = obj.key, txt, temp, cname = obj.className, result = [], rex;
                    if(cname) css += ' class="' + cname + '"';
                    
                    if(typeof key === 'string'){
                        txt = dataObj[key];
                        if(/integer/.test(cname) && txt >= 1000) txt = (txt + '').replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, '$1,'); 
                        if(/percent/.test(cname)) txt += '%';
                    }else if($.isFunction(key)){
                        txt = temp = key();
                        rex = /\{(\w+)\}/;
                        while(rex.test(temp)){
                            result.push(RegExp.$1);
                            temp = temp.replace(rex, '');
                        }
                        for(var k = 0; k < result.length; k++){
                            txt = txt.replace(rex, dataObj[result[k]]);
                        }
                    }
                    tr += '<td' + css + '>' + txt + '</td>';
                }
                tbodyArr.push('<tr>' + tr + '</tr>');
            }
            return tbodyArr;
        }
        
        /**
        * 生成所有页号的html
        * @param {Number} n 当前页码
        * @param {Array} nArr 所有页号的数字
        * @return {String} html代码
        */
        function _getPagesHtml(n, nArr){
            var html = '';
            for(var i = 0; i < nArr.length; i++){
                var _num = nArr[i];
                if(n == _num){
                    html += '<li class="page ' + _activeClass + '"><a>' + _num + '</a></li>';
                }else if(_num == '...'){
                    html += '<li class="ellipsis">' + _num + '</li>';
                }else{
                    html += '<li class="page"><a>' + _num + '</a></li>';
                }
            }
            return html;
        }
        
        /**
        * 生成所有页号后面那一串html
        * @param {Number} s 每页展示的记录数
        * @param {Number} n 当前页码
        * @return {String} html代码
        */
        function _getDetailsHtml(s, n){
            var html = '<div class="paging_div_right"><span>共' + _totalCounts + '条记录 , </span>';
            html += '<span>每页</span><input type="text" class="size cloudjs_input" value="' + s + '"/><span>条 , </span>';
            html += '<span>到第</span><input type="text" class="num cloudjs_input" value="' + n + '"/><span>页</span> ';
            html += '<span class="cloudjs_btn">确定</span>';
            return html;
        }
        
        /**
        * 获取所有页号保存到数组中
        * @param {Number} s 每页展示的记录数
        * @param {Number} n 当前页码
        * @return {Array} 要展示的所有页号
        */
        function _getPagesArr(s, n){
            var arr = [], total = Math.ceil(_totalCounts / s);
            if(_visiblePages == 0) return [];
            if(_visiblePages > total){
                _visiblePages = total;
            }
            var _half = Math.floor(_visiblePages / 2),
                _start = n - _half + 1 - _visiblePages % 2,
                _end = n + _half;
            if(_start < 1) {
                _start = 1;
                _end = _visiblePages;
            }
            if(_end > total) {
                _end = total;
                _start = 1 + total - _visiblePages;
            }
            var _index = _start;
            while(_index <= _end) {
                arr.push(_index);
                _index++;
            }
            if(_start > 1){
                if(_start > 2) arr.unshift('...');
                arr.unshift(1);
            }
            if(_end < total){
                if(_end < total - 1) arr.push('...');
                arr.push(total);
            }
            return arr;
        }
        
        /**
        * 生成(上/下/首/末)页按钮的html代码
        * @param {Array} arr [当前页码,当前按钮变灰时的页码,'当前按钮的class值','当前按钮的文本值']
        * @return {String} html代码
        */
        function _getBtnHtml(arr){
            var pclass = arr[2], aclass = '';
            if(_showIcons){
                aclass = ' class="paging_icons"';
                arr[3] = '<i class="cloudjs_icon"></i>';
            }
            if(arr[0] == arr[1]){
                pclass += ' ' + _disableClass;
            }
            return '<li class="' + pclass + '"><a' + aclass + '>' + arr[3] + '</a></li>';
        }
        
        /**
        * 绑定分页组件所有按钮的点击事件
        */
        function _bindEvent(){
            _self.find('li:not(.ellipsis)').bind('click', function(){
                var num;
                if($(this).hasClass(_disableClass) || $(this).hasClass(_activeClass)) return;
                if($(this).hasClass('first')){
                    num = _pageNum = 1;
                }else if($(this).hasClass('prev')){
                    num = --_pageNum;
                }else if($(this).hasClass('next')){
                    num = ++_pageNum;
                }else if($(this).hasClass('last')){
                    num = _pageNum = Math.ceil(_totalCounts / s);
                }else{
                    num = _pageNum = Number($(this).text());
                }
                $.extend(_self.data('initData'), { pageNum: num });
                _init(_pageSize, num);
            }).end().find('.cloudjs_btn').bind('click', function(){
                _reinit(Number($(this).prevAll('.size').val()), Number($(this).prevAll('.num').val()));
            }).end().find('input[type=text]').keyup(function(event){
                if(event.keyCode === 13){
                    var _parent = $(this).parent();
                    _reinit(Number(_parent.find('.size').val()), Number(_parent.find('.num').val()));
                }
            });
        }
        
        /**
        * 绑定排序的点击事件
        */
        function _bindSortEvent(){
            _self.find('.sort_number,.sort_string').bind('click', function(){
                var cl = 'string', index = $(this).index(), key = _tableData[index].key, v;
                if($(this).hasClass('sort_number')) cl = 'number';
                if($(this).hasClass('sort_down')){
                    v = 1;
                    $(this).removeClass('sort_down').addClass('sort_up');
                }else{
                    v = -1;
                    $(this).removeClass('sort_up').addClass('sort_down');
                }
                if($.isFunction(key)){
                    key = key();
                    if(/\>.*\{(\w+)/.test(key) || /\{(\w+)\}/.test(key)){ 
                        key = RegExp.$1;
                    }
                }
                _dataList.sort(_sort(key, cl, v));
                _renderHtml(_pageSize, _pageNum);
            });
        }        
            
        /**
        * 改变pageSize后重新赋值并初始化组件
        * @param {Number} s 每页展示的记录数
        * @param {Number} n 当前页码
        */
        function _reinit(s, n){
            _pageSize = s;
            _pageNum = n;
            $.extend(_self.data('initData'), { pageSize: s, pageNum: n });
            _init(s, n);
        }
        
        /**
        * 排序
        * @param {String} key 排序对象的key值
        * @param {String} cl 排序类型，字符串或数字
        * @param {Number} v 升降排序
        */
        function _sort(key, cl, v){
            return function(a, b){
                if(cl === 'number'){
                    return (Number(a[key]) > Number(b[key])) ? v : -v;
                }else{
                    return (a[key] > b[key]) ? v : -v;
                }
            }
        }
    },
    require: ['../css/' + cloudjs.themes() + '/paging.css']
});