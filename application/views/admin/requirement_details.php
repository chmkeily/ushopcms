<!Doctype html>
<html lang="zh-CN"><head>
    <meta charset="UTF-8">
    <meta name="keywords" content="店之宝,开店,我要开店,店管家,POST机,收银软件,店铺帮手">
    <meta name="description" content="店之宝，提供开店必备软硬件信息。">
    <title>需求详情</title>
    <link rel="stylesheet" type="text/css" href="/html/css/pc.css" media="screen">
	<link rel="stylesheet" type="text/css" href="/asset/bootstrap/css/bootstrap.min.css" media="screen">

	<style type="text/css">
		th {
			width: 120px;
		}
	</style>
</head>
<body id="home">
    <?php if(isset($requirement)): ?>
	<div>
		<table class="table table-bordered table-striped table-hover table-condensed">
			<tbody>
				<tr>
					<th><span>需求ID</span></th>
					<td><span><?php echo $requirement['requirement_id']; ?></span></td>
				</tr>
				<tr>
					<th><span>标题</span></th>
					<td><span><?php echo $requirement['requirement_title']; ?></span></td>
				</tr>
				<tr>
					<th><span>发布人</span></th>
					<td><span><?php echo $requirement['requirement_ownername']; ?></span></td>
				</tr>
				<tr>
					<th><span>联系电话</span></th>
					<td><span><?php echo $requirement['requirement_ownerphone']; ?></span></td>
				</tr>
				<tr>
					<th><span>需求类型</span></th>
					<td><span><?php echo $requirement['requirement_type']; ?></span></td>
				</tr>
				<tr>
					<th><span>店铺类型</span></th>
					<td><span><?php echo $requirement['requirement_shopcate']; ?></span></td>
				</tr>
				<tr>
					<th><span>店铺面积(平方米)</span></th>
					<td><span><?php echo $requirement['requirement_shoparea']; ?></span></td>
				</tr>
				<tr>
					<th><span>所在城市</span></th>
					<td><span><?php echo XGETVAL($locations[$requirement['requirement_shopcity']]['desc']); ?></span></td>
				</tr>
				<tr>
					<th><span>预算(元)</span></th>
					<td><span><?php echo $requirement['requirement_budget']; ?></span></td>
				</tr>
				<tr>
					<th><span>需求详情</span></th>
					<td><span><?php echo $requirement['requirement_detail']; ?></span></td>
				</tr>
				<tr>
					<th><span>需求提交时间</span></th>
					<td><span><?php echo date('Y-m-d H:i:s', $requirement['requirement_st']); ?></span></td>
				</tr>
				<tr>
					<th><span>需求有效时间至</span></th>
					<td><span><?php echo ((0 == $requirement['requirement_et']) ? '无' : date('Y-m-d H:i:s', $requirement['requirement_et'])); ?></span></td>
				</tr>
				<tr>
					<th><span>状态</span></th>
					<td><span><?php echo $requirement['requirement_status']; ?></span></td>
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
                        		<option value="1">分配需求</option>
                        		<option value="2">驳回需求</option>
                        	</select>
                        </td>
                    </tr>
                    <tr>
                        <td>参数：</td>
                        <td><input type="text" name="para" class="inputbox" value="" placeholder="分配需求时填入服务商ID"/></td>
                    </tr>
                    <tr>
                        <td>备注：</td>
                        <td><textarea name="remark" style="width:300px;height:100px;"></textarea></td>
                    </tr> 
                </tbody>
            </table>
            	<button type="submit" class="btn btn-primary">提交</button>
        </form>
    </div>

	<?php endif ?>
</body>
</html>
