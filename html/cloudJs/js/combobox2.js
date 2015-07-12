cloudjs.define({
    combobox: function(options){
        var defaults = {
            isMulti: false,    //是否多选
            width: null,    //下拉列表宽度
            height: 200,    //下拉列表高度
            seprate: '#',    //下拉数据分隔符
            defaultKey: '',    //默认选中选项
            checkKey: false,    //是否检查key值必须是data里面的key
            showIcon: true,
            showAll: true,    //是否显示全部下拉
            recordLen: 10,    //搜索时最多显示的记录数
            name: '',    //key隐藏域
            zIndex: 600,    //下拉列表的z-index值
            data: null,    //data数据
            comkey: 'key',    //key字段名
            comvalue: 'value',    //value字段名
            url: '',    //异步下拉数据url
            params: '',    //异步搜索下拉数据参数
            getValue:function(val){},
            onCreate: $.noop, //创建下拉回调
            onOpen: $.noop, //在对话框打开时创建，对于被close的对话框，在通过动作open打开时，该方法也会调用
        };

        if(!options || $.isPlainObject(options)){
            $.extend(defaults, options);    /**TODO: 其他情况 */
        }

        var _self = this,
            _isMulti = defaults.isMulti,
            _width = defaults.width,
            _height = defaults.height,
            _separate = defaults.separate,
            _defaultKey = defaults.defaultKey,
            _checkKey = defaults.checkKey,
            _showIcon = defaults.showIcon,
            _showAll = defaults.showAll,
            _recordLen = defaults.recordLen,
            _hideName = defaults.name,
            _zIndex = defaults.zIndex,
            _jsonData = defaults.data,
            _comkey = defaults.comkey,
            _comvalue = defaults.comvalue,
            _url = defaults.url,
            _params = defaults.params,
            _getValue = defaults.getValue,
            _comboEle = null,
            _showEle = null,    //显示value的表单元素
            _hideEle = null,    //显示key的隐藏表单元素
            _panelEle = null,    //下拉面板元素
            _isFirst = true,
            _defaultValue = '',
            _strData = '',    //数据字符串
            _ajaxIng = false;

        _init();

        /**
         * 初始化
         */
        function _init(){
            var keyArr;

            $(_self).wrap('<span class="combo_container"></span>');

            if($(_self)[0].tagName.toLowerCase() === 'select'){
                $(_self).hide();

                $(_self).parent().append('<input type="text" class="combo_text" />');

                _showEle = $(_self).siblings('.combo_text');
            }else{
                !$(_self).hasClass('combo_text') && $(_self).addClass('combo_text');

                _showEle = $(_self);
            }
            _comboEle = _showEle.parent();

            if(_showIcon){
                $(_self).parent().append('<input type="hidden" class="combo_value" name="' + _hideName + '" /><span class="combo_arrow"><span></span></span>');
            }else{
                $(_self).parent().append('<input type="hidden" class="combo_value" name="' + _hideName + '" />');
            }
            _hideEle = $(_self).siblings('.combo_value');

            if(_defaultKey){
                _setDefaultValue();    //设置默认值对应的value
            }
        }

        /**
         * 设置默认值
         */
        function _setDefaultValue(){
            if(_jsonData){
                if(_isMulti && _defaultKey.indexOf(';') !== -1){
                    _defaultValue = _getMultiValue(_jsonData, _defaultKey);
                }else{
                    if(_jsonData instanceof Array){
                        for(var i = 0; i < _jsonData.length; i ++){
                            if(_defaultKey === _jsonData[i][_comkey]){
                                _defaultValue = _jsonData[i][_comvalue];
                            }
                        }
                    }else{
                        _defaultValue = _jsonData[_defaultKey];
                    }
                }
                _defaultKey = _checkKey && _defaultValue === '' ? '' : _defaultKey;

                _showEle.val(_defaultValue);
                _hideEle.val(_defaultKey);

                return;
            }

            if(_url){
                _comboEle.addClass('combo_disabled');
                _getAjaxData(_setDefaultValue);
            }
        }

        /**
         * 获取默认key对于的value [多选的时候]
         * @param  {Json/Array} data 数据
         * @param  {String} key  key字符串
         * @return {String}      返回key对应的value字符串
         */
        function _getMultiValue(data, key){
            var keyArr = key.split(';'),
                valueStr = '';

            _defaultKey = '';

            if(data instanceof Array){
                for(var i = 0; i < data.length; i ++){
                    for(var j = 0; j < keyArr.length; j ++){
                        if((';' + _defaultKey).indexOf(';' + keyArr[j] + ';') === -1 && keyArr[j] === data[i][_comkey]){
                            _defaultKey += data[i][_comkey] + ';';
                            valueStr += data[i][_comvalue] + ';';
                        }
                    }
                }
            }else{
                for(var k = 0; k < keyArr.length; k ++){
                    valueStr += data[keyArr[k]] + ';';
                }
            }
            return valueStr;
        }

        /**
         * 通过ajax获取数据
         * @param  {Function} callback 回调函数
         */
        function _getAjaxData(callback){
            _ajaxIng = true;

            $.ajax({
                url: _url,
                dataType: 'json',
                success: function(data){
                    _ajaxIng = false;
                    _jsonData = data;
                    _comboEle.removeClass('combo_disabled');
                    callback();
                }
            });
        }

        /**
         * 阻止事件冒泡
         * @param  {Object} e 当前事件
         */
        function _stopBubble(e){
            if(window.ActiveXObject){
                if(window.event){
                    window.event.cancelBubble = true;
                }
            }else{
                e.stopPropagation();
            }
        }


        function _getData(data){
            var panelHtml = '',
                key,
                value,
                disabledClass = '',
                selectedClass = '',
                dataLen = 0;

            if(data instanceof Array){
                for (var i = 0; i < data.length; i++) {
                    key = data[i][_comkey];
                    value = data[i][_comvalue];
                    disabledClass = data[i]['disabled'] ? 'combo_item_disabled' : '';    //可以在数据里加disabled属性
                    selectedClass = _defaultKey

                    _strData += encodeURIComponent(value) + _separate + encodeURIComponent(key) + ',';

                    if(!(!_showAll && i >= _recordLen)){
                        panelHtml += '<div class="combo_item ' + disabledClass + '" combo-key="' + key + '">' + value + '</div>';
                    }
                }
            }else{
                for (var property in data) {
                    key = property;
                    value = data[property];

                    _strData += encodeURIComponent(value) + _separate + encodeURIComponent(key) + ',';

                    if(!(!_showAll && dataLen >= _recordLen)){
                        panelHtml += '<div class="combo_item" combo-key="' + key + '">' + value + '</div>';
                    }

                    dataLen ++;
                }
            }

            return panelHtml;
        }

        /**
         * 插入搜索html
         * @param  {[type]} data [description]
         */
        function _insetSearchHtml(data){

        }

        /**
         * 创建下拉列表面板，并确定位置
         */
        function _createComboPamel(){
            _width = _width || _comboEle.innerWidth();

            var top = _comboEle.outerHeight() - parseInt(_comboEle.css('border-bottom-width'), 10),
                left = parseInt(_comboEle.css('border-left-width'), 10);

            _panelEle = $('<div></div>').addClass('combo_panel').css({'z-index': _zIndex, 'width': _width, 'max-height': _height, 'top': top, 'left': -left});

            _comboEle.append(_panelEle);
        }


        /**
         * 初始化下拉面板
         */
        function _initSearchPanel(){
            if(_comboEle.hasClass('combo_disabled') || _showEle.attr('disabled')){
                return;
            }

            if(_isFirst){
                _createComboPamel();
            }
            _isFirst = false;

            if(_jsonData){
                _panelEle.show().html(_getData(_jsonData)).unbind('click').bind('click', function(e){
                    e = e || window.event;

                    var target =  e.target || e.srcElement;

                    if($(target).hasClass('combo_item')){
                        !_isMulti && _panelEle.hide();

                        _showEle.val($(target).text());

                        if(_hideEle.val() !== $(target).attr('combo-key')){    //key值真正改变才触发_getValue
                            _getValue($(target).attr('combo-key'));
                        }
                        _hideEle.val($(target).attr('combo-key'));
                    }

                    _stopBubble(e);
                });
                return;    //如果有本地数据，则即使有url，也不会去请求，所以return;
            }

            if(_url){
                _panelEle.show().html('Loading...');
                _getAjaxData(_initSearchPanel);
            }

        }


        _comboEle.unbind('click').bind('click', function(e){
            _initSearchPanel();

            _stopBubble(e);
        });

        _showEle.unbind().bind('focus', function(e){
            _initSearchPanel();
        }).bind('click', function(e){
            _stopBubble(e);
        }).bind('keyup', function(e){
            if(e.keyCode==37 || e.keyCode==38 || e.keyCode==39 || e.keyCode==40 || e.keyCode==46 || e.keyCode==13){
                return;
            }

            var value = $(this).val(),
                search_timeout = null,
                exg = "var exg = /[^,]*"+val+"[^,]*"+seprate+"[^,]*/gi";
                macth_data;
            
                eval(exg);
                /**TODO: 嘿嘿！！ */
                clearTimeout(g_data.search_timeout);    //防止输入太快，做了点延迟
                var search_fun = function(){
                    if(g_data.appname_str.toLowerCase().indexOf(val.toLowerCase()) === -1){
                        macth_data = [];
                    }else{
                        val = val.replace(/\./g, '\\\.');
                        macth_data = g_data.appname_str.match(exg);
                    }
                    

                };

            search_timeout = setTimeout(search_fun, 1000);
        }).bind('blur', function(e){
            if(!_checkKey){
                return;
            }

            var value = $(this).val(), key = _hideEle.val(), curKey;
            if(!value){
                _hideEle.val('');
                return;
            }

            var valueIndex = (',' + _strData).indexOf(',' + encodeURIComponent(value) + _separate);
            if(valueIndex !== -1){
                curKey = decodeURIComponent(_strData.split(encodeURIComponent(value) + _separate)[1].split(',')[0]);

                if(curKey !== key){
                    _hideEle.val(curKey);
                    _getValue(curKey);
                }
            }else{
                _hideEle.val('');
                $(this).val('');
            }
        });


        $('.combo_item').live('mouseenter', function(){
            $(this).addClass('combo_item_hover').siblings().removeClass('combo_item_hover');
        }).live('mouseleave', function(){
            $(this).removeClass('combo_item_hover');
        });




        $('html').bind('click', function(){
            _panelEle && _panelEle.hide();
        });
    },
    require: ['../css/blue/combobox.css']
});