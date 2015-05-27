<!Doctype html>
<html lang="zh-CN"><head>
    <meta charset="UTF-8">
    <meta name="keywords" content="店之宝,开店,我要开店,店管家,POST机,收银软件,店铺帮手">
    <meta name="description" content="店之宝，提供开店必备软硬件信息。">
    <title>管理中心</title>
   <!--  <link rel="shortcut icon" href="images/fav.ico">
    <link rel="bookmark" href="images/fav.ico"> -->
    <link rel="stylesheet" type="text/css" href="/html/css/pc.css" media="screen">
	<link rel="stylesheet" type="text/css" href="/asset/bootstrap/css/bootstrap.min.css" media="screen">
	<!-- link rel="stylesheet" type="text/css" href="/asset/bootstrap/css/bootstrap-custom.css" media="screen" -->
</head>
<body id="home">
    <div class="header_min">
        <div class="topnav">
            <h1><a class="logo" href="/html/index.html" title="店之宝">店之宝</a></h1>
            <strong class="subnav">管理中心</strong>
        </div>
    </div>
    <div class="manage_container">
        <div class="aside">
            <div class="menu">
                <a class="menu_item active">服务商管理</a>
                <a class="menu_item">需求管理</a>
                <a class="menu_item">案例管理</a>
            </div>
        </div>
        <div class="main">
     
			<table class="table table-bordered table-striped table-hover table-condensed">
				<thead style="background: #CCCCCC url(/asset/images/treetable/bg-table-thead.png) repeat-x;">
					<tr>
						<th><span>选择</span></th>
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
			<?php if(isset($userinfos)): ?>
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
                        <td><?php echo substr($userinfo['user_brief'], 0, 20); ?></td>
                        <td><a href="<?php echo $userinfo['user_license']; ?>">查看</a></td>
                    </tr>
            <?php endforeach; ?>
                </tbody>
			<?php endif ?>
			</table>
        </div>
    </div>
	
</body>
</html>
