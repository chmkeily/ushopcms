cloudjs.define({
    monthpicker: function(options){
        var defaults = {
            width: 220,             // 单个月时日历控件的宽度
            zIndex: cloudjs.zIndex(),// 日历控件的层级
            beginYear: -40,         // 开始年份
            endYear: +10,           // 结束年份
            placeholder: '',        // 输入框中显示的placeholder信息
            timeFormat: 'yyyy-mm',  // 输出到输入框的日期格式
            showIcon: true,         // 是否显示图标
            multiSelect: false,     // 范围选择
            startMonth: '',         // 默认开始月份
            endMonth: '',           // 默认结束月份
            minDate: null,          // 可选的最小月份，用于范围选择
            maxDate: null,          // 可选的最大月份，用于范围选择
            onSelect: $.noop,       // 选择日期后触发的事件
            onClose: $.noop         // 关闭日历控件后触发的事件
        };
       
        if ($.isPlainObject(options) || !options){
            $.extend(defaults, options);
        } else if(typeof options === 'string'){
            if (options === 'update' && $.isPlainObject(arguments[1])){
                var obj = this.data('monthpicker');
                if(!obj) return;
                $.extend(obj.dfts, arguments[1]);
                return;
            }else if(options === 'destroy'){
                _destroy(this);
                return true;
            }
        }
       
        var _self = this,
            _defaults = defaults,
            _months = new Date().getFullYear() * 12 + new Date().getMonth(),
            _panel = null,
            _monthWarpper = null,
            _monthObj = null,
            _beginYear = new Date().getFullYear() + parseInt(_defaults.beginYear),
            _endYear = new Date().getFullYear() + parseInt(_defaults.endYear),
            _timeFormat = _defaults.timeFormat;
            // 绑定到输入框和document的三个事件侦听器
            _handleEvent = {
                showCalendar: function(e){
                    e.stopPropagation();
                    _monthObj.show();
                    _monthObj.shown = true;
                },
                hideCalendar: function(e){
                    if(!_monthObj.mouseover){
                        _monthObj.hide();
                        _monthObj.shown = false;
                    }
                },
                documentHandle: function(e){
                    if(_monthObj.shown){
                        _monthObj.hide();
                        _monthObj.shown = false;
                    }
                }
            };
        if(!_beginYear){
            _beginYear = 1940;
        }
        if(!_endYear){
            _endYear = 2020;
        }
       
        _init();
        /**
         * 初始化组件
         */
        function _init(){
            var calendarIcon, startMonthHidden, endMonthHidden;
            if(_defaults.showIcon){
                calendarIcon = document.createElement('span');
                calendarIcon.className = 'calendar_icon cloudjs_icon';
                _self.wrap('<span class="calendar_inputs_wrap"></span>');
                _self.after(calendarIcon);
            }
            if(_defaults.multiSelect){
                _self.attr('readonly', 'readonly');
                startMonthHidden = document.createElement('input');
                startMonthHidden.type = 'hidden';
                startMonthHidden.value = _defaults.startMonth;
                startMonthHidden.className = 'startMonth';
                _self.after(startMonthHidden);
                endMonthHidden = document.createElement('input');
                endMonthHidden.type = 'hidden';
                endMonthHidden.value = _defaults.endMonth;
                endMonthHidden.className = 'endMonth';
                _self.after(endMonthHidden);
                _self.data('startMonthHd' , startMonthHidden);
                _self.data('endMonthHd' , endMonthHidden);
                if(_defaults.startMonth && _defaults.endMonth){
                    _self.val(_defaults.startMonth + ' 至 ' + _defaults.endMonth);
                }
            }
            _self.data('monthpicker', _getMonthObj());
            _monthObj = _self.data('monthpicker');
            _monthObj.calendarIcon = $(calendarIcon);
            _listen();
            _monthObj.createMonthBox();
            _self.attr('placeholder', _defaults.placeholder);
            _self.removeData('month');
            _self.data('handler', _handleEvent);
        }
       
        /**
         * 给输入框绑定事件
         */
        function _listen(){
            $(document).bind('click', _handleEvent.documentHandle);
            $(window).bind('resize', _handleEvent.documentHandle);
            _self.bind('click', _handleEvent.showCalendar);
            _self.bind('blur', _handleEvent.hideCalendar);
            _monthObj.calendarIcon.bind('click', _handleEvent.showCalendar);
        }
        
        /**
         * 销毁事件
         */
        function _destroy(tar){
            _handleEvent = tar.data('handler');
            if(!_handleEvent) return;
            $(document).unbind('click', _handleEvent.documentHandle);
            $(window).unbind('resize', _handleEvent.documentHandle);
            tar.unbind('click', _handleEvent.showCalendar);
            tar.unbind('blur', _handleEvent.hideCalendar);
            tar.removeData('monthpicker');
            tar.removeData('month');
            tar.removeData('handler');
        }
        
        /**
         * 获取月组件对象
         */
        function _getMonthObj(){
            var monthObj = {
                dfts: _defaults,
                rangeArr: [],
                /**
                 * 绘制单个日历面板
                 */
                draw: function(){
                    var self = this,
                        monthCon = document.createElement('div'),
                        tmpMons = '',
                        currTime = _months,
                        i = 1,
                        $panel = $(_panel),
                        currYear = parseInt(currTime / 12),
                        yearSelect, monthTitle, monthBox;
                    for (; i <= 12; i++){
                        tmpMons += '<a class="disabled calendar_mon" data-value="' + currYear + ',' + _formatDate(i) + '" href="javascript:;">' + i + '</a>';
                    }
                    for(i = _endYear; i >= _beginYear; i--){
                        if(i === currYear){
                            yearSelect += '<option value="' + i + '" selected="selected">' + i + '</option>';
                        }else {
                            yearSelect += '<option value="' + i + '">' + i + '</option>';
                        }
                    }
                    monthTitle = '<div class="calendar_title"><div class="select_box"><select class="year_select">' + yearSelect + '</select></div></div>';
                    monthBox = '<div class="months">' + tmpMons + '</div>';
                    monthCon.className = 'calendar_form';
                    monthCon.innerHTML += monthTitle + monthBox;
                    $panel.append(monthCon);
                    monthCon.style.width = self.dfts.width + 'px';
                    self.bindData(monthCon, currYear);
                },
                /**
                 * 绑定数据
                 * @param {Element} box
                 */
                bindData: function(box){
                    var self = this,
                        currMonth = new Date().getFullYear() * 12 + new Date().getMonth(),
                        selectedMonth = _formatToStr(_formatToMonth(_self.val()), 'yyyy,mm'),
                        selectedMonthArr = _self.val() ? _self.val().split(' 至 ') : [],
                        $box = $(box), startMonth, endMonth,
                        tds = $box.find('.calendar_mon'), currDate, i = 0, $tds;
                    $box.find('.currMonth').removeClass('currMonth').find('.calendar_current').removeClass('calendar_current');
                    for (; i < tds.length; i++){
                        $tds = tds.eq(i);
                        currDate = $tds.attr('data-value');
                        if(_formatToMonth(currDate) === currMonth){
                            $tds.addClass('currMonth');
                        }
                        if(selectedMonth && selectedMonth === currDate){
                            $tds.addClass('calendar_current');
                        }
                        if(self.dfts.multiSelect){
                            startMonth = _self.data('startMonthHd').value;
                            endMonth = _self.data('endMonthHd').value;
                            if(_formatToMonth(currDate) > _formatToMonth(startMonth) && _formatToMonth(currDate) < _formatToMonth(endMonth)){
                                $tds.addClass('calendar_range');
                            }
                            if(_formatToMonth(currDate) === _formatToMonth(startMonth) || _formatToMonth(currDate) === _formatToMonth(endMonth)){
                                $tds.addClass('calendar_current');
                            }
                       }
                       self.setEnable(tds[i]);
                    }
                },
                /**
                 * 设置时间范围
                 * @param {Element} tds  面板中的每一个日期元素
                 */
                setEnable: function(tds){
                    var self = this,
                        $tds = $(tds),
                        dateValue = tds.getAttribute('data-value'),
                        dateCount = _formatToMonth(dateValue),
                        start,end;
                    // 处理开始月
                    start = self.getRangeDate(self.dfts.minDate);
                    if (typeof start === 'undefined'){
                        start = _formatToMonth(_beginYear + ',01');
                    }
                    // 处理结束月
                    end = self.getRangeDate(self.dfts.maxDate);
                    if (typeof end === 'undefined'){
                        end = _formatToMonth(_endYear + ',12');
                    }
                    if (dateCount >= start && dateCount <= end){
                        $tds.removeClass('disabled');
                    }
                },
                /**
                 * 获得所设置最大值或最小值的时间对象
                 * @param {String} str  设置的最大值或最小值
                 */
                getRangeDate: function(str){
                    if (!str){
                        return;
                    } else if(/^\d{4}[,-/]?\d{1,2}$/g.test(str)){
                        return _formatToMonth(str);
                    } else {
                        str = str.toLowerCase();
                        var arrStr = str.split(','),
                            now = new Date(),
                            nowYear = now.getFullYear() * 12,
                            nowMonth = nowYear + now.getMonth(),
                            i = 0;
                        for (; i < arrStr.length; i++){
                            if (/([-+]?\d+)([ym]?)/g.test(arrStr[i])){
                                switch (RegExp.$2){
                                    case 'y' :
                                        nowMonth += Number(RegExp.$1) * 12;
                                        break;
                                    case 'm' :
                                        nowMonth += Number(RegExp.$1);
                                        break;
                                }
                            }
                        }
                        return nowMonth;
                    }
                },
                /**
                 * 创建日历容器
                 */
                createMonthBox: function(){
                    var calendarWarpper, calendarBox, calendarVal;
                    if(cloudjs._calendarHasDraw){
                        _panel = $('.calendar_panel')[0];
                        _monthWarpper = $('.calendar_warpper')[0];
                        return;
                    };
                    cloudjs._calendarHasDraw = true;
                    calendarWarpper = document.createElement('div');
                    calendarBox = document.createElement('div');
                    calendarWarpper.id = 'calendar_warpper';
                    calendarWarpper.className = 'calendar_warpper';
                    calendarWarpper.style.display = 'none';
                    _monthWarpper = calendarWarpper;
                    calendarBox.className = 'calendar_panel';
                    _panel = calendarBox;
                    calendarWarpper.appendChild(calendarBox);
                    document.body.appendChild(calendarWarpper);
                },
                /**
                 * 填充日历面板
                 */
                fillPanel: function(){
                    var self = this,
                        tmpStr = '<a class="calendar_pre_mon"><i class="cloudjs_icon"></i></a><a class="calendar_next_mon"><i class="cloudjs_icon"></i></a>',
                        i = 0;
                    _panel.innerHTML = tmpStr;
                    self.draw();
                    if(_defaults.multiSelect){
                        self.drawRangeBox();
                    }
                    self.bindEvent();
                },
                
                /**
                 * 绘制范围面板
                 */
                drawRangeBox: function(){
                    var self = this,
                        selectedMonthArr = _self.val().split(' 至 '),
                        d = _formatToMonth(_self.val()),
                        minSelectMonth = '',
                        maxSelectMonth = '',
                        startMonth, endMonth, timeCon;
                    timeCon = document.createElement('div');
                    _panel.appendChild(timeCon);
                    timeCon.className = 'calendar_time_box';
                    if(_defaults.multiSelect){
                        startMonth = _self.data('startMonthHd').value;
                        endMonth = _self.data('endMonthHd').value;
                        if(startMonth){
                            self.rangeArr.push(startMonth);
                        }
                        if(endMonth){
                            self.rangeArr.push(endMonth);
                        }
                        minSelectMonth = _formatToStr(_formatToMonth(startMonth), _defaults.timeFormat) || '';
                        maxSelectMonth = _formatToStr(_formatToMonth(endMonth), _defaults.timeFormat) || '';
                        timeTpl = '<div style="float:left"><input class="min_date multi_input" value="' + minSelectMonth + '" type="text" readonly="readonly">-';
                        timeTpl += '<input class="max_date multi_input" type="text" value="' + maxSelectMonth + '" readonly="readonly"></div>';
                        timeCon.innerHTML = timeTpl;
                    }
                },
                
                /**
                 * 显示日历面板
                 */
                show: function(){
                    var self = this;
                    self.fillPanel();
                    $(_monthWarpper).show();
                    self.setPosition();
                    self.shown = true;
                },
                /**
                 * 隐藏日历面板
                 */
                hide: function(){
                    var self = this,startMonth, endMonth,
                        $monthWarpper = $(_monthWarpper),
                        _selfVal = _self.val();
                    self.shown = false;
                    $monthWarpper.hide();
                    $monthWarpper.undelegate('click');
                    $monthWarpper.unbind('click');
                    $monthWarpper.unbind('mouseenter');
                    $monthWarpper.unbind('mouseleave');
                    if(_defaults.multiSelect && self.rangeArr.length === 1){
                        self.rangeArr[1] = new Date().getFullYear() * 12 + new Date().getMonth();
                        self.rangeArr.sort(function(a, b){
                            return a - b;
                        })
                        startMonth = self.rangeArr[0];
                        endMonth = self.rangeArr[1];
                        _self.val(_formatToStr(startMonth, _defaults.timeFormat) + ' 至 ' + _formatToStr(endMonth, _defaults.timeFormat));
                        _self.data('startMonthHd').value = _formatToStr(startMonth, _defaults.timeFormat);
                        _self.data('endMonthHd').value = _formatToStr(endMonth, _defaults.timeFormat);
                    }
                    if(_selfVal !== ''){
                        _selfVal = _selfVal.split(' 至 ')[0];
                        _months = _formatToMonth(_selfVal);
                    }
                    self.dfts.onClose.call(_self[0]);
                },
                /**
                 * 设置位置
                 */
                setPosition: function(){
                    var self = this,
                        $monthWarpper = $(_monthWarpper),
                        $panel = $(_panel),
                        offset = _self.offset(),
                        h = _self.outerHeight(),
                        t;
                    $panel.width(self.dfts.width);
                    if(offset.top + h + $panel.outerHeight() > $(window).height() + $(window).scrollTop()){
                        t = offset.top - $panel.outerHeight();
                    }else{
                        t = offset.top + h;
                    }
                    $monthWarpper.css({
                        width: self.dfts.width,
                        zIndex: (cloudjs.zIndex() > self.dfts.zIndex ? cloudjs.zIndex() : self.dfts.zIndex),
                        left: offset.left,
                        top:t
                    });
                   
                },
                /**
                 * 显示前一月
                 */
                goPrevYear: function(){
                    var self = this;
                    if (_months <= _beginYear * 12){
                        return;
                    }
                    _months -= 12;
                    self.fillPanel();
                },
                /**
                 * 显示后一月
                 */
                goNextYear: function(){
                    var self = this;
                    if (_months >= _endYear * 12 + 11){
                        return;
                    }
                    _months += 12;
                    self.fillPanel();
                },
                /**
                 * 绑定事件
                 */
                bindEvent: function(){
                    var $monthWarpper = $(_monthWarpper),
                        $yearSelect = $monthWarpper.find('.year_select'),
                        self = this;
                    $monthWarpper.undelegate('click');
                    $monthWarpper.unbind('click');
                    $yearSelect.unbind('change');
                    $monthWarpper.unbind('mouseenter');
                    $monthWarpper.bind('click', function(e){
                        e.stopPropagation();
                    })
                    $monthWarpper.bind('mouseenter', function(){
                        self.mouseover = true;
                    })
                    $monthWarpper.bind('mouseleave', function(){
                        self.mouseover = false;
                    })
                    // IE6,7,8,9不支持表单事件冒泡，所以delegate事件委托会失效
                    $yearSelect.bind('change', function(){
                        _months = $(this).val() * 12;
                        self.fillPanel();
                    })
                    $monthWarpper.delegate('.calendar_pre_mon', 'click', function(){
                        self.goPrevYear();
                    })
                    $monthWarpper.delegate('.calendar_next_mon', 'click', function(){
                        self.goNextYear();
                    })
                    $monthWarpper.delegate('.calendar_mon', 'click', function(){
                        var $this = $(this), startMonth, endMonth, dateCount,
                            multiInputs = $('.calendar_time_box').find('.multi_input'),
                            $tds = $monthWarpper.find('.calendar_mon'),
                            i = 0, len = $tds.length, 
                            val1, val2;
                        if ($this.hasClass('disabled')){
                            return;
                        }
                        if(_defaults.multiSelect){
                            if(self.rangeArr.length >= 2){
                                self.rangeArr = [];
                                $monthWarpper.find('.calendar_current').removeClass('calendar_current');
                                $monthWarpper.find('.calendar_range').removeClass('calendar_range');
                                multiInputs.val('');
                                _self.val('');
                            }
                            if(self.rangeArr.length === 0){
                                self.rangeArr.push(_formatToMonth($this.attr('data-value')));
                                startMonth = self.rangeArr[0];
                                val1 = _formatToStr(startMonth, _defaults.timeFormat);
                                multiInputs.eq(0).val(val1);
                                _self.val(val1);
                            }else if(self.rangeArr.length === 1){
                                self.rangeArr.push(_formatToMonth($this.attr('data-value')));
                                self.rangeArr.sort(function(a, b){
                                    return a - b;
                                })
                                startMonth = self.rangeArr[0];
                                endMonth = self.rangeArr[1];
                                val1 = _formatToStr(startMonth, _defaults.timeFormat);
                                val2 = _formatToStr(endMonth, _defaults.timeFormat);
                                multiInputs.eq(0).val(val1);
                                multiInputs.eq(1).val(val2);
                                for(; i < len; i++){
                                    dateCount = _formatToMonth($tds.eq(i).attr('data-value'));
                                    if(dateCount > startMonth && dateCount < endMonth){
                                        $tds.eq(i).addClass('calendar_range');
                                    }
                                }
                                _self.val(val1 + ' 至 ' + val2);
                                _self.data('startMonthHd').value = val1;
                                _self.data('endMonthHd').value = val2;
                            }
                        }else{
                            _self.val(_formatToStr(_formatToMonth($this.attr('data-value')), _defaults.timeFormat));
                            _self.data('month', $this.attr('data-value'));
                            $monthWarpper.find('.calendar_current').removeClass('calendar_current');
                            $this.addClass('calendar_current');
                        }
                        $this.addClass('calendar_current');
                        self.dfts.onSelect.call(_self[0]);
                        if(_defaults.multiSelect && !self.rangeArr[1]){
                            return;
                        }
                        self.hide();
                        self.shown = false;
                    })
                }
            };
            return monthObj;
        }
       
        /**
         * 处理输出到input框中的时间格式
         * @param {Number} date
         * @param {String} format
         */
        function _formatToStr(date, format){
            if(!date) return;
            return format.replace(/yyyy/gi, parseInt(date/12))
                  .replace(/MM/i, _formatDate(date % 12 + 1));
        }
       
        /**
         * 格式化日期
         * @param {Number} n 日期或月数
         */
        function _formatDate(n){
            return (n < 10 ? '0' + n : n).toString();
        }
       
        /**
         * 将字符串变成月份数字
         * @param {String} date  字符串
         */
        function _formatToMonth(date){
            var tmpDate = date.split(/[,-/]/g);
            // IE7在这里有个BUG,既会把以0开头的数字字符串解析为八进制数字: parseInt('08')==0
            return (parseInt(tmpDate[0] , 10) * 12 + (parseInt(tmpDate[1] , 10) - 1));
        }
    },
    require: ['../css/' + cloudjs.themes() + '/calendar.css']
})
