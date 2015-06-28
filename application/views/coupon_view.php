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
		<div>
            <form class="form-horizontal" method="post" action="/coupon/index">
                <fieldset>
				<div class="control-group">
					<label class="control-label">标题</label>
                    <div class="controls">
                        <input type="text" name="kw_title" class="inputbox" value=""/>
						<button type="submit" class="btn btn-primary">查询</button>
						<a class="btn btn-primary" href="/html/pages/form/coupon_create.html">添加</a>
					</div>
				</div>
           
    			</fieldset>
		    </form>

			<table class="table table-bordered table-striped table-hover table-condensed">
				<thead style="background: #CCCCCC url(/asset/images/treetable/bg-table-thead.png) repeat-x;">
					<tr>
						<th><span>ID</span></th>
						<th><span>标题</span></th>
						<th><span>图标</span></th>
						<th><span>内容</span></th>
						<th><span>开始时间</span></th>
						<th><span>过期时间</span></th>
						<th><span>领取数量</span></th>
						<!-- th><span>状态</span></th -->
					</tr>
				</thead>
			<?php if(isset($coupons)): ?>
				<tbody>
            <?php foreach ($coupons as $coupon): ?>
                    <tr id="u<?php echo $coupon['coupon_id']; ?>">
                        <td><a href="/coupon/details?coupon_id=<?php echo $coupon['coupon_id']; ?>"><?php echo $coupon['coupon_id']; ?></a>
                        </td>
                        <td><?php echo $coupon['coupon_title']; ?></td>
                        <td><img style="width:20px;height:20px;" src="<?php echo $coupon['coupon_icon']; ?>"/></td>
                        <td><?php echo substr($coupon['coupon_content'], 0, 50); ?></td>
                        <td><?php echo date('Y-m-d H:i:s', $coupon['coupon_begintime']); ?></td>
                        <td><?php echo date('Y-m-d H:i:s', $coupon['coupon_endtime']); ?></td>
                        <td><?php echo $coupon['coupon_takencnt']; ?></td>
                        <!-- td><?php echo $coupon['coupon_status']; ?></td -->
                    </tr>
            <?php endforeach; ?>
                </tbody>
			<?php endif ?>
			</table>
        </div>
	
</body>
</html>
