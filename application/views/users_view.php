<!Doctype html>
<html lang="zh-CN"><head>
    <meta charset="UTF-8">
    <meta name="keywords" content="店之宝,开店,我要开店,店管家,POST机,收银软件,店铺帮手">
    <meta name="description" content="店之宝，提供开店必备软硬件信息。">
    <title>管理中心</title>
   <!--  <link rel="shortcut icon" href="images/fav.ico">
    <link rel="bookmark" href="images/fav.ico"> -->
    <link rel="stylesheet" type="text/css" href="/html/css/pc.css" media="screen">
</head>
<body id="home">
    <div class="header_min">
        <div class="topnav">
            <h1><a class="logo" href="#" title="店之宝">店之宝</a></h1>
            <strong class="subnav">管理中心</strong>
        </div>
    </div>
    <div class="manage_container">
        <div class="aside">
            <div class="menu">
                <a class="menu_item active">需求管理</a>
                <a class="menu_item">案例管理</a>
            </div>
        </div>
        <div class="main">
            <table class="tc-table tc-table-headcolor">
                <colgroup><col class="tc-table-col1" style="width:3%">
                    <col class="tc-table-col2" style="width:22%">
                    <col class="tc-table-col3" style="width:10%">
                    <col class="tc-table-col4" style="width:10%">
                    <col class="tc-table-col5" style="width:10%">
                    <col class="tc-table-col6" style="width:13%">
                    <col class="tc-table-col7" style="width:13%">
                    <col class="tc-table-col8" style="width:9%">
                    <col class="tc-table-col9" style="width:10%">
                </colgroup>
                <thead>
                    <tr>
                        <th><input type="checkbox" class="tc-checkbox check-all"></th>
                        <th><span>邮箱</span></th>
                        <th><span>名称</span></th>
                        <th><span>类型</span></th>
                        <th><span>电话</span></th>
                        <th><span>联系人</span></th>
                        <th><span>地址</span></th>
                        <th><span>状态</span></th>
                        <th><span>简介</span></th>
                        <th><span>执照</span></th>
                    </tr>
                </thead>
                <tbody>
                <?php foreach ($userinfos as $userinfo): ?>
                    <tr id="u<?php echo $userinfo['user_id']; ?>">
                        <td><input type="checkbox" class="tc-checkbox"></td>
                        <td><?php echo $userinfo['user_email']; ?></td>
                        <td><?php echo $userinfo['user_name']; ?></td>
                        <td><?php echo $userinfo['user_type']; ?></td>
                        <td><?php echo $userinfo['user_phone']; ?></td>
                        <td><?php echo $userinfo['user_contact']; ?></td>
                        <td><?php echo $userinfo['user_address']; ?></td>
                        <td><?php echo $userinfo['user_status']; ?></td>
                        <td><?php echo $userinfo['user_brief']; ?></td>
                        <td><?php echo $userinfo['user_license']; ?></td>
                    </tr>
                <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    </div>
    

    <script src="/html/js/jquery-1.6.1.min.js"></script>
</body>
</html>
