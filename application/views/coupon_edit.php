<!Doctype html>
<html lang="zh-CN"><head>
    <meta charset="UTF-8">
    <meta name="keywords" content="店之宝,开店,我要开店,店管家,POST机,收银软件,店铺帮手">
    <meta name="description" content="店之宝，提供开店必备软硬件信息。">
    <title>修改资料</title>
    <link rel="stylesheet" type="text/css" href="/html/css/pc.css" media="screen">
	<link rel="stylesheet" type="text/css" href="/asset/bootstrap/css/bootstrap.min.css" media="screen">
</head>
<body class="iframe_body">
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
                <a class="menu_item" href="/provider/shopcase">案例管理</a>
            </div>
        </div>
        <div class="main">
     
		<form class="form-horizontal span8" method="post" action="/provider/update">
            <fieldset>
				<div class="control-group">
					<label class="control-label">名称</label>
                    <div class="controls">
                        <input type="text" name="name" class="inputbox" value="<?php echo $userinfo['user_name']; ?>"/>
					</div>
				</div>

				<div class="control-group">
					<label class="control-label">电话</label>
					<div class="controls">
                        <input type="text" name="phone" class="inputbox" value="<?php echo $userinfo['user_phone']; ?>"/>
					</div>
				</div>
				
				<!-- div class="control-group">
					<label class="control-label">邮箱</label>
					<div class="controls">
                        <input type="text" name="email" class="inputbox" value="<?php echo $userinfo['user_email']; ?>"/>
					</div>
				</div -->
				
				<div class="control-group">
					<label class="control-label">联系人</label>
					<div class="controls">
                        <input type="text" name="contact" class="inputbox" value="<?php echo $userinfo['user_contact']; ?>"/>
					</div>
				</div>
				
				<div class="control-group">
					<label class="control-label">地址</label>
					<div class="controls">
                        <input type="text" name="address" class="inputbox" value="<?php echo $userinfo['user_address']; ?>"/>
					</div>
				</div>
				
				<div class="control-group">
					<label class="control-label">营业执照</label>
					<div class="controls">
                        <input type="text" name="license" class="inputbox" value="<?php echo $userinfo['user_license']; ?>"/>
					</div>
                </div>

                <div class="control-group">
					<label class="control-label">简介</label>
					<div class="controls">
                        <input type="text" name="brief" class="inputbox" value="<?php echo $userinfo['user_brief']; ?>"/>
					</div>
                </div>

				<div class="control-group">
					<label class="control-label">详情</label>
					<div class="controls">
                        <input type="text" name="intro" class="inputbox" value="<?php echo $userinfo['user_intro']; ?>"/>
					</div>
				</div>

 				<div class="control-group">
					<div class="controls">
						<button type="reset" class="btn">重置</button>
						<button type="submit" class="btn btn-primary">提交</button>
					</div>
				</div>
           
			</fieldset>
		</form>
		
        </div>
    </div>
	
</body>
</html>
