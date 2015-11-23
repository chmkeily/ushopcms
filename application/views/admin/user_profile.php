<!Doctype html>
<html lang="zh-CN"><head>
    <meta charset="UTF-8">
    <meta name="keywords" content="店之宝,开店,我要开店,店管家,POST机,收银软件,店铺帮手">
    <meta name="description" content="店之宝，提供开店必备软硬件信息。">
    <title>服务商信息</title>
    <link rel="stylesheet" type="text/css" href="/html/css/pc.css" media="screen">
	<link rel="stylesheet" type="text/css" href="/asset/bootstrap/css/bootstrap.min.css" media="screen">

	<style type="text/css">
		th {
			width: 80px;
		}
		.form-horizontal .controls span{padding-top:0;}
		select{width: auto;}
	</style>
</head>
<body class="iframe_body">
    
	<div>
		<table class="search_table table table-bordered table-striped table-hover table-condensed">
			<tbody>
				<tr>
					<th><span>名称</span></th>
					<td><span><?php echo $userinfo['user_name']; ?></span></td>
				</tr>
				<tr>
					<th><span>电话</span></th>
					<td><span><?php echo $userinfo['user_phone']; ?></span></td>
				</tr>
				<tr>
					<th><span>邮箱</span></th>
					<td><span><?php echo $userinfo['user_email']; ?></span></td>
				</tr>
				<tr>
					<th><span>联系人</span></th>
					<td><span><?php echo $userinfo['user_contact']; ?></span></td>
				</tr>
				<tr>
					<th><span>地址</span></th>
					<td><span><?php echo $userinfo['user_address']; ?></span></td>
				</tr>
				<tr>
					<th><span>简介</span></th>
					<td><span><?php echo $userinfo['user_brief']; ?></span></td>
				</tr>
				<tr>
					<th><span>详情</span></th>
					<td><span><?php echo $userinfo['user_intro']; ?></span></td>
				</tr>
				<tr>
					<th><span>营业执照</span></th>
					<td><a href="<?php echo $userinfo['user_license']; ?>" title="点击查看大图" target="_blank"> <img alt="图片无效" style="width:80px;height:60px;" src="<?php echo $userinfo['user_license']; ?>"></img></a></td>
				</tr>
				<tr>
					<th><span>状态</span></th>
					<td><span><?php echo $userinfo['user_status']; ?></span></td>
				</tr>
			</tbody>
		</table>
	</div>

    <div>
        <form id="review_form" class="form-horizontal" method="post" action="/">
            <table class="search_table table table-bordered table-striped table-hover table-condensed">
            	<thead style="background: #CCCCCC url(/asset/images/treetable/bg-table-thead.png) repeat-x;">
            		<tr>
            			<th colspan="2"><span>需求审批</span></th>
            		</tr>
            	</thead>
                <tbody>
                    <tr>
                        <td width="80px">操作：</td>
                        <td>
                        	<select name="action">
                        		<option value="1">通过</option>
                        		<option value="2">驳回</option>
                        	</select>
                        </td>
                    </tr>
                    <tr>
                        <td>备注：</td>
                        <td><textarea name="remark" style="width:300px;height:100px;" form="review_form"></textarea></td>
                    </tr> 
                </tbody>
            </table>
            	<button type="submit" class="btn btn-primary">提交</button>
        </form>
    </div>

</body>
</html>
