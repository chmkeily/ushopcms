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
            <form class="form-horizontal" method="post" action="/admin/shopcases">
                <fieldset>
				<div class="control-group">
					<label class="control-label">标题</label>
                    <div class="controls">
                        <input type="text" name="kw_title" class="inputbox" value=""/>
						<button type="submit" class="btn btn-primary">查询</button>
						<!-- a class="btn btn-primary add_btn" tabTitle="添加案例" href="/html/pages/form/shopcase_create.html">添加</a -->
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
						<th><span>提交时间</span></th>
						<th><span>状态</span></th>
                        <th><span>操作</span></th>
					</tr>
				</thead>
			<?php if(isset($shopcases)): ?>
				<tbody>
            <?php foreach ($shopcases as $shopcase): ?>
                    <tr id="u<?php echo $shopcase['shopcase_id']; ?>">
                        <td><?php echo $shopcase['shopcase_id']; ?></td>
                        <td><a href="/shopcase/details?caseid=<?php echo $shopcase['shopcase_id']; ?>" class="js_url"><?php echo $shopcase['shopcase_name']; ?></a></td>
                        <td><?php echo mb_substr($shopcase['shopcase_intro'],0,50); ?></td>
                        <td><?php echo date('Y-m-d H:i:s', $shopcase['shopcase_ctime']); ?></td>
                        <td><?php echo $statuswordings[$shopcase['shopcase_status']]; ?></td>
                        <td>
						<?php if(10 != $shopcase['shopcase_status']): ?>
							<a onclick="publish(<?php echo $shopcase['shopcase_id']; ?>)" href="#">发布</a>
						<?php endif ?>
						</td>
                    </tr>
            <?php endforeach; ?>
                </tbody>
			<?php endif ?>
			</table>

			<?php if($count > $pagesize): ?>
            <div align="center">总共<?php echo ceil($count/$pagesize); ?>页[
            <?php for ($i = 1; $pagesize * $i < $count + $pagesize; $i ++): ?>
            <?php $offset = $pagesize * ($i - 1); ?>
            <?php if($i == $currpage): ?>
                <span><?php echo $i; ?></span>
            <?php else: ?>
                <a href="/admin/providers?offset=<?php echo $offset; ?>&length=<?php echo $pagesize; ?>"><span><?php echo $i; ?></span></a>
            <?php endif ?>
            <?php endfor ?>]
            </div>
            <?php endif?>

        </div>
	

    <script type="text/javascript" src="/html/js/jquery.min.js"></script>
	<script>
		$(document).ready(function(){
			$('.add_btn').bind('click',function(){
			    if( typeof(window.parent.addTab) === 'function' ){
			        window.parent.addTab($(this).attr('tabTitle'),$(this).attr('href'));
			        return false;
			    }
			});
		});

		function publish(caseid)
        {
            if (!confirm("确认要发布该服务？"))
            {
                return;
            }

            var url = '/admin/shopcase_publish?scid=' + caseid;
            $.getJSON(url, function(rsp){
                if (0 == rsp.ret)
                {
                    alert('发布成功！');
                    location.href = '';
                }
                else
                {
                    alert('发布失败, msg：' + rsp.msg);
                }
            });
        }
	</script>
</body>
</html>
