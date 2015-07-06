<!Doctype html>
<html lang="zh-CN"><head>
    <meta charset="UTF-8">
    <meta name="keywords" content="店之宝,开店,我要开店,店管家,POST机,收银软件,店铺帮手">
    <meta name="description" content="店之宝，提供开店必备软硬件信息。">
    <title>服务商信息</title>
    <link rel="stylesheet" type="text/css" href="/html/css/pc.css" media="screen">
	<link rel="stylesheet" type="text/css" href="/asset/bootstrap/css/bootstrap.min.css" media="screen">
</head>
<body id="home">
    
	<div>
		<table class="table table-bordered table-striped table-hover table-condensed">
			<tbody>
				<tr>
					<td><span>名称</span></td>
					<td><span><?php echo $userinfo['user_name']; ?></span></td>
				</tr>
				<tr>
					<td><span>电话</span></td>
					<td><span><?php echo $userinfo['user_phone']; ?></span></td>
				</tr>
				<tr>
					<td><span>邮箱</span></td>
					<td><span><?php echo $userinfo['user_email']; ?></span></td>
				</tr>
				<tr>
					<td><span>联系人</span></td>
					<td><span><?php echo $userinfo['user_contact']; ?></span></td>
				</tr>
				<tr>
					<td><span>地址</span></td>
					<td><span><?php echo $userinfo['user_address']; ?></span></td>
				</tr>
				<tr>
					<td><span>简介</span></td>
					<td><span><?php echo $userinfo['user_brief']; ?></span></td>
				</tr>
				<tr>
					<td><span>详情</span></td>
					<td><span><?php echo $userinfo['user_intro']; ?></span></td>
				</tr>
				<tr>
					<td><span>营业执照</span></td>
					<td><a href="<?php echo $userinfo['user_license']; ?>"> <img style="width:80px;height:60px;" src="<?php echo $userinfo['user_license']; ?>"></img></a></td>
				</tr>
			</tbody>
		</table>
	</div>
	
</body>
</html>
