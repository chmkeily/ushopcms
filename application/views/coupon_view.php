<!Doctype html>
<html lang="zh-CN"><head>
    <meta charset="UTF-8">
    <meta name="keywords" content="店之宝,开店,我要开店,店管家,POST机,收银软件,店铺帮手">
    <meta name="description" content="店之宝，提供开店必备软硬件信息。">
    <title>管理中心</title>
    <link rel="stylesheet" type="text/css" href="/html/css/pc.css" media="screen">
	<link rel="stylesheet" type="text/css" href="/asset/bootstrap/css/bootstrap.min.css" media="screen">
</head>
<body id="home">
    <div class="header_min">
        <div class="topnav">
            <h1><a class="logo" href="/html/index.html" title="店之宝">店之宝</a></h1>
            <strong class="subnav">个人中心</strong>
        </div>
    </div>
    <div class="manage_container">
        <div class="aside">
            <div class="menu">
                <a class="menu_item" href="/provider/index">基本资料</a>
                <a class="menu_item active" href="/provider/coupon">优惠劵</a>
                <a class="menu_item" href="/provider/requirement">订单管理</a>
                <a class="menu_item" href="/provider/shopcase">案例管理</a>
                <a class="menu_item">更多服务</a>
          </div>
        </div>
        <div class="main">
            <form class="form-horizontal" method="post" action="/provider/coupon">
                <fieldset>
				<div class="control-group">
					<label class="control-label">标题</label>
                    <div class="controls">
                        <input type="text" name="kw_title" class="inputbox" value=""/>
					</div>
                </div>

		        <div class="control-group">
					<div class="controls">
						<button type="submit" class="btn btn-primary">提交</button>
					</div>
				</div>
           
    			</fieldset>
		    </form>

			<table class="table table-bordered table-striped table-hover table-condensed">
				<thead style="background: #CCCCCC url(/asset/images/treetable/bg-table-thead.png) repeat-x;">
					<tr>
						<th><span>ID</span></th>
						<th><span>服务商</span></th>
						<th><span>标题</span></th>
						<th><span>图标</span></th>
						<th><span>内容</span></th>
						<th><span>开始时间</span></th>
						<th><span>过期时间</span></th>
						<th><span>状态</span></th>
					</tr>
				</thead>
			<?php if(isset($coupons)): ?>
				<tbody>
            <?php foreach ($coupons as $coupon): ?>
                    <tr id="u<?php echo $coupon['coupon_id']; ?>">
                        <td><?php echo $coupon['coupon_id']; ?></td>
                        <td><?php echo $coupon['coupon_providerid']; ?></td>
                        <td><?php echo $coupon['coupon_title']; ?></td>
                        <td><img style="width=20px;height=20px;" src="<?php echo $coupon['coupon_icon']; ?>"/></td>
                        <td><?php echo substr($coupon['coupon_content'], 0, 20); ?></td>
                        <td><?php echo $coupon['coupon_begintime']; ?></td>
                        <td><?php echo $coupon['coupon_endtime']; ?></td>
                        <td><?php echo $coupon['coupon_status']; ?></td>
                    </tr>
            <?php endforeach; ?>
                </tbody>
			<?php endif ?>
			</table>
        </div>
    </div>
	
</body>
</html>
