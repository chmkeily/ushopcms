<!Doctype html>
<html lang="zh-CN"><head>
    <meta charset="UTF-8">
    <meta name="keywords" content="店之宝,开店,我要开店,店管家,POST机,收银软件,店铺帮手">
    <meta name="description" content="店之宝，提供开店必备软硬件信息。">
    <title>管理中心</title>
    <link rel="stylesheet" type="text/css" href="/html/css/pc.css" media="screen">
	<link rel="stylesheet" type="text/css" href="/asset/bootstrap/css/bootstrap.min.css" media="screen">
</head>
<body class="iframe_body">
		<div>
            <form class="form-horizontal" method="post" action="/shopcase/index">
                <fieldset>
				<div class="control-group">
					<label class="control-label">标题</label>
                    <div class="controls">
                        <input type="text" name="kw_title" class="inputbox" value=""/>
						<button type="submit" class="btn btn-primary">查询</button>
						<a class="btn btn-primary" href="/html/pages/form/shopcase_create.html">添加</a>
					</div>
				</div>
           
    			</fieldset>
		    </form>

			<table class="search_table table table-bordered table-striped table-hover table-condensed">
				<thead style="background: #CCCCCC url(/asset/images/treetable/bg-table-thead.png) repeat-x;">
					<tr>
						<th><span>ID</span></th>
						<th><span>名称</span></th>
						<th><span>简介</span></th>
						<th><span>服务商ID</span></th>
						<th><span>提交时间</span></th>
						<th><span>状态</span></th>
					</tr>
				</thead>
			<?php if(isset($shopcases)): ?>
				<tbody>
            <?php foreach ($shopcases as $shopcase): ?>
                    <tr id="u<?php echo $shopcase['shopcase_id']; ?>">
                        <td><a href="/shopcase/details?caseid=<?php echo $shopcase['shopcase_id']; ?>"><?php echo $shopcase['shopcase_id']; ?></a></td>
                        <td><?php echo $shopcase['shopcase_name']; ?></td>
                        <td><?php echo mb_substr($shopcase['shopcase_intro'],0,50); ?></td>
                        <td><?php echo $shopcase['shopcase_providerid']; ?></td>
                        <td><?php echo date('Y-m-d H:i:s', $shopcase['shopcase_ctime']); ?></td>
                        <td><?php echo $shopcase['shopcase_status']; ?></td>
                    </tr>
            <?php endforeach; ?>
                </tbody>
			<?php endif ?>
			</table>
        </div>
	
</body>
</html>
