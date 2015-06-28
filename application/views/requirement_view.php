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
            <form class="form-horizontal" method="post" action="/provider/requirement">
                <fieldset>
				<div class="control-group">
					<label class="control-label">标题</label>
                    <div class="controls">
                        <input type="text" name="kw_title" class="inputbox" value=""/>
						<button type="submit" class="btn btn-primary">查询</button>
					</div>
				</div>
    			</fieldset>
		    </form>

			<table class="table table-bordered table-striped table-hover table-condensed">
				<thead style="background: #CCCCCC url(/asset/images/treetable/bg-table-thead.png) repeat-x;">
					<tr>
						<th><span>需求ID</span></th>
						<th><span>标题</span></th>
						<th><span>类型</span></th>
						<th><span>发布人</span></th>
						<th><span>发布时间</span></th>
						<th><span>店铺类型</span></th>
						<th><span>店铺城市</span></th>
						<th><span>预算</span></th>
						<th><span>状态</span></th>
						<th><span>服务商</span></th>
					</tr>
				</thead>
			<?php if(isset($requirements)): ?>
				<tbody>
            <?php foreach ($requirements as $requirement): ?>
                    <tr id="u<?php echo $requirement['requirement_id']; ?>">
                        <td><a href="/requirement/details?rid=<?php echo $requirement['requirement_id']; ?>"><?php echo $requirement['requirement_id']; ?></a></td>
                        <td><?php echo $requirement['requirement_title']; ?></td>
                        <td><?php echo $requirement['requirement_type']; ?></td>
                        <td><?php echo $requirement['requirement_ownername']; ?></td>
                        <td><?php echo $requirement['requirement_st']; ?></td>
                        <td><?php echo $requirement['requirement_shopcate']; ?></td>
                        <td><?php echo $requirement['requirement_shopcity']; ?></td>
                        <td><?php echo $requirement['requirement_budget']; ?></td>
                        <td><?php echo $requirement['requirement_status']; ?></td>
                        <td><?php echo $requirement['requirement_providerid']; ?></td>
                    </tr>
            <?php endforeach; ?>
                </tbody>
			<?php endif ?>
			</table>
        </div>
	
</body>
</html>
