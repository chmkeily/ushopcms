<!Doctype html>
<html lang="zh-CN"><head>
    <meta charset="UTF-8">
    <meta name="keywords" content="店之宝,开店,我要开店,店管家,POST机,收银软件,店铺帮手">
    <meta name="description" content="店之宝，提供开店必备软硬件信息。">
    <title>服务商注册申请</title>
    <link rel="stylesheet" type="text/css" href="/html/css/pc.css" media="screen">
	<link rel="stylesheet" type="text/css" href="/asset/bootstrap/css/bootstrap.min.css" media="screen">
</head>
<body id="home">
    <div class="header_min">
        <div class="topnav">
            <h1><a class="logo" href="/html" title="店之宝">店之宝</a></h1>
            <strong class="subnav">个人中心</strong>
        </div>
    </div>
    <div class="manage_container">
        <div class="aside">
            <div class="menu">
                <a class="menu_item active">基本资料</a>
                <a class="menu_item" href="/provider/coupon">优惠劵</a>
                <a class="menu_item" href="/provider/case">案例管理</a>
            </div>
        </div>
        <div class="main">
     
		<form class="form-horizontal span8" method="post" action="/provider/register">
			<fieldset>
				<div class="control-group">
					<label class="control-label">名称</label>
                    <div class="controls">
                        <span><?php $userinfo['user_name']; ?></span>
					</div>
				</div>

				<div class="control-group">
					<label class="control-label">电话</label>
					<div class="controls">
                        <span><?php $userinfo['user_phone']; ?></span>
					</div>
				</div>
				
				<div class="control-group">
					<label class="control-label">邮箱</label>
					<div class="controls">
                        <span><?php $userinfo['user_email']; ?></span>
					</div>
				</div>
				
				<div class="control-group">
					<label class="control-label">联系人</label>
					<div class="controls">
                        <span><?php $userinfo['user_contact']; ?></span>
					</div>
				</div>
				
				<div class="control-group">
					<label class="control-label">地址</label>
					<div class="controls">
                        <span><?php $userinfo['user_address']; ?></span>
					</div>
				</div>
				
				<div class="control-group">
					<label class="control-label">简介</label>
					<div class="controls">
                        <span><?php $userinfo['user_brief']; ?></span>
					</div>
				</div>
            
			</fieldset>
		</form>
		
        </div>
    </div>
	
</body>
</html>
