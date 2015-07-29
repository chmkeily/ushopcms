
//数组内完整的对象为{"text": "", "className": "", "href": "", target: "", children: []} text必要属性，其他都为非必要
//每个对象通过组件解析都会生成一行这样的html代码<li><a>xxx</a></li>
//text：显示的文本
//className：li的class值
//href：a元素的href值
//target：a元素的target值
//children：子菜单
var dataArr1 = [
    [
        {"className": "paging1", "text": "分页组件1", "children": [
            {"text": "每页展示数量1", "children": [
                {"text": "模态1", "href": "http://test.cloudjs.wsd.com/cloudJs/api/example/paging.html", "target": "_blank"},
                {"text": "标题1", "href": "http://www.qq.com", "target": "_blank"},
                {"text": "宽度1", "href": "http://www.qq.com", "target": "_blank"},
                {"text": "高度1", "href": "http://www.qq.com", "target": "_blank"},
                {"text": "按钮1", "href": "http://www.qq.com", "target": "_blank"}
            ]},
            {"text": "每页展示数量2", "children": [
                {"text": "模态2"},
                {"text": "标题2"},
                {"text": "宽度2"},
                {"text": "高度2"},
                {"text": "按钮2"}
            ]},
            {"text": "每页展示数量3", "children": [
                {"text": "模态3"},
                {"text": "标题3"},
                {"text": "宽度3"},
                {"text": "高度3"},
                {"text": "按钮3"}
            ]}
        ]},
        {"className": "paging2", "text": "分页组件2"},
        {"className": "paging3", "text": "分页组件3", "children": [
            {"text": "每页展示数量32", "children": [
                {"text": "模态31"},
                {"text": "标题31"},
                {"text": "宽度31"},
                {"text": "高度31"},
                {"text": "按钮31"}
            ]},
            {"text": "每页展示数量32"},
            {"text": "每页展示数量33", "children": [
                {"text": "模态13"},
                {"text": "标题13"},
                {"text": "宽度13"},
                {"text": "高度13"},
                {"text": "按钮13"}
            ]}
        ]}
    ],
    [
        {"text": "弹出框组件2"},
        {"text": "分页组件2"},
        {"text": "消息提示组件2"},
        {"text": "tips组件2"}
    ],
    [
        {"text": "弹出框组件3"},
        {"text": "分页组件3"},
        {"text": "消息提示组件3"},
        {"text": "tips组件3"}
    ],
    [
        {"text": "弹出框组件4"},
        {"text": "分页组件4"},
        {"text": "消息提示组件4"},
        {"text": "tips组件4"}
    ]
];

var dataArr2 = [];
dataArr2[0] = [
    {"text": "弹出框组件4", "href": "http://www.qq.com", "target": "_blank"},
    {"text": "分页组件4"},
    {"text": "消息提示组件4"},
    {"text": "tips组件4"}
];
dataArr2[1] = [
    {"text": "弹出框组件2", "href": "http://www.qq.com"},
    {"text": "分页组件2"},
    {"text": "消息提示组件2"},
    {"text": "tips组件2"}
];
dataArr2[2] = [
    {"className": "paging1", "text": "分页组件1", "href": "http://test.cloudjs.wsd.com/cloudJs/api/example/paging.html", "target": "_blank", "children": [
        {"text": "每页展示数量1", "children": [
            {"text": "模态1"},
            {"text": "标题1"},
            {"text": "宽度1"},
            {"text": "高度1"},
            {"text": "按钮1"}
        ]},
        {"text": "每页展示数量2", "children": [
            {"text": "模态2"},
            {"text": "标题2"},
            {"text": "宽度2"},
            {"text": "高度2"},
            {"text": "按钮2"}
        ]},
        {"text": "每页展示数量3", "children": [
            {"text": "模态3"},
            {"text": "标题3"},
            {"text": "宽度3"},
            {"text": "高度3"},
            {"text": "按钮3"}
        ]}
    ]},
    {"className": "paging2", "text": "分页组件2", "href": "http://test.cloudjs.wsd.com/cloudJs/api/example/paging.html", "target": "_blank", "children": [
        {"text": "每页展示数量21", "children": [
            {"text": "模态21"},
            {"text": "标题21"},
            {"text": "宽度21"},
            {"text": "高度21"},
            {"text": "按钮21"}
        ]},
        {"text": "每页展示数量22", "children": [
            {"text": "模态22"},
            {"text": "标题22"},
            {"text": "宽度22"},
            {"text": "高度22"},
            {"text": "按钮22"}
        ]},
        {"text": "每页展示数量23", "children": [
            {"text": "模态23"},
            {"text": "标题23"},
            {"text": "宽度23"},
            {"text": "高度23"},
            {"text": "按钮23"}
        ]}
    ]},
    {"className": "paging3", "text": "分页组件3", "href": "http://test.cloudjs.wsd.com/cloudJs/api/example/paging.html", "target": "_blank", "children": [
        {"text": "每页展示数量32", "children": [
            {"text": "模态31"},
            {"text": "标题31"},
            {"text": "宽度31"},
            {"text": "高度31"},
            {"text": "按钮31"}
        ]},
        {"text": "每页展示数量32", "children": [
            {"text": "模态12"},
            {"text": "标题12"},
            {"text": "宽度12"},
            {"text": "高度12"},
            {"text": "按钮12"}
        ]},
        {"text": "每页展示数量33", "children": [
            {"text": "模态13"},
            {"text": "标题13"},
            {"text": "宽度13"},
            {"text": "高度13"},
            {"text": "按钮13"}
        ]}
    ]}
];

var dataArr3 = [
   [
        {"className": "paging1", "text": "分页组件1", "href": "http://test.cloudjs.wsd.com/cloudJs/api/example/paging.html", "target": "_blank", "children": [
            {"text": "每页展示数量1", "children": [
                {"text": "模态1"},
                {"text": "标题1"},
                {"text": "宽度1"},
                {"text": "高度1"},
                {"text": "按钮1"}
            ]},
            {"text": "每页展示数量2", "children": [
                {"text": "模态2"},
                {"text": "标题2"},
                {"text": "宽度2"},
                {"text": "高度2"},
                {"text": "按钮2"}
            ]},
            {"text": "每页展示数量3", "children": [
                {"text": "模态3"},
                {"text": "标题3"},
                {"text": "宽度3"},
                {"text": "高度3"},
                {"text": "按钮3"}
            ]}
        ]},
        {"className": "paging2", "text": "分页组件2", "href": "http://test.cloudjs.wsd.com/cloudJs/api/example/paging.html", "target": "_blank"},
        {"className": "paging3", "text": "分页组件3", "href": "http://test.cloudjs.wsd.com/cloudJs/api/example/paging.html", "target": "_blank", "children": [
            {"text": "每页展示数量32", "children": [
                {"text": "模态31"},
                {"text": "标题31"},
                {"text": "宽度31"},
                {"text": "高度31"},
                {"text": "按钮31"}
            ]},
            {"text": "每页展示数量32"},
            {"text": "每页展示数量33", "children": [
                {"text": "模态13"},
                {"text": "标题13"},
                {"text": "宽度13"},
                {"text": "高度13"},
                {"text": "按钮13"}
            ]}
        ]}
    ],
    [
        {"text": "弹出框组件3", "href": "http://www.qq.com", "target": "_blank"},
        {"text": "分页组件3"},
        {"text": "消息提示组件3"},
        {"text": "tips组件3"}
    ]
];

var dataArr4 = [
 
    {"className": "paging1", "text": "分页组件1", "children": [
    {"text": "每页展示数量1", "children": [
        {"text": "模态1", "href": "http://test.cloudjs.wsd.com/cloudJs/api/example/paging.html", "target": "_blank"},
        {"text": "标题1", "href": "http://www.qq.com", "target": "_blank"},
        {"text": "宽度1", "href": "http://www.qq.com", "target": "_blank"},
        {"text": "高度1", "href": "http://www.qq.com", "target": "_blank"},
        {"text": "按钮1", "href": "http://www.qq.com", "target": "_blank"}
    ]},
    {"text": "每页展示数量2", "children": [
        {"text": "模态2"},
        {"text": "标题2"},
        {"text": "宽度2"},
        {"text": "高度2"},
        {"text": "按钮2"}
    ]},
    {"text": "每页展示数量3", "children": [
        {"text": "模态3"},
        {"text": "标题3"},
        {"text": "宽度3"},
        {"text": "高度3"},
        {"text": "按钮3"}
        ]}
    ]},
    {"className": "paging3", "text": "分页组件3", "children": [
    {"text": "每页展示数量32", "children": [
        {"text": "模态31"},
        {"text": "标题31"},
        {"text": "宽度31"},
        {"text": "高度31"},
        {"text": "按钮31"}
    ]},
    {"text": "每页展示数量32"},
    {"text": "每页展示数量33", "children": [
        {"text": "模态13"},
        {"text": "标题13"},
        {"text": "宽度13"},
        {"text": "高度13"},
        {"text": "按钮13"}
        ]}
    ]}
];