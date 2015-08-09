<!Doctype html>
<html lang="zh-CN"><head>
    <meta charset="UTF-8">
    <meta name="keywords" content="店之宝,开店,我要开店,店管家,POST机,收银软件,店铺帮手">
    <meta name="description" content="店之宝，提供开店必备软硬件信息。">
    <title>个人信息中心</title>
    <link rel="stylesheet" type="text/css" href="/html/css/pc.css" media="screen">
	<link rel="stylesheet" type="text/css" href="/asset/bootstrap/css/bootstrap.min.css" media="screen">
	<!-- link rel="stylesheet" type="text/css" href="/asset/bootstrap/css/bootstrap-custom.css" media="screen" -->
</head>
<body class="iframe_body">
    
	<div>
		<div class="form-horizontal span12">
			<fieldset>
				<div class="control-group">
					<label class="control-label">名称</label>
                    <div class="controls">
                        <span><?php echo $userinfo['user_name']; ?></span>
					</div>
				</div>

				<div class="control-group">
					<label class="control-label">电话</label>
					<div class="controls">
                        <span><?php echo $userinfo['user_phone']; ?></span>
					</div>
				</div>
				
				<div class="control-group">
					<label class="control-label">邮箱</label>
					<div class="controls">
                        <span><?php echo $userinfo['user_email']; ?></span>
					</div>
				</div>
				
				<div class="control-group">
					<label class="control-label">联系人</label>
					<div class="controls">
                        <span><?php echo $userinfo['user_contact']; ?></span>
					</div>
				</div>
				
				<div class="control-group">
					<label class="control-label">地址</label>
					<div class="controls">
                        <span><?php echo $userinfo['user_address']; ?></span>
					</div>
				</div>

				<div class="control-group">
					<label class="control-label">图标</label>
                    <div class="controls">
                        <img style="width:50px;height:50px;" src="<?php echo $userinfo['user_icon']; ?>"></img>
					</div>
                </div>
				
				<div class="control-group">
					<label class="control-label">简介</label>
					<div class="controls">
                        <span><?php echo $userinfo['user_brief']; ?></span>
					</div>
                </div>
                
        		<div class="control-group">
					<label class="control-label">详情</label>
					<div class="controls">
                        <span><?php echo $userinfo['user_intro']; ?></span>
					</div>
				</div>
 
                <div class="control-group">
					<label class="control-label">营业执照</label>
                    <div class="controls">
                        <a href="<?php echo $userinfo['user_license']; ?>" target="_blank" class="tips" style="display: inline-block;" title="点击查看大图"> <img style="width:160px;height:120px;" src="<?php echo $userinfo['user_license']; ?>"></img> </a>
					</div>
                </div>
          
        		<div class="control-group">
					<div class="controls">
                        <a class="btn btn-primary modify_btn" href="/provider/index?isedit=true" tabTitle="修改基本信息">修改</a>
                    </div>
                </div>
			</fieldset>
		</div>
		
	</div>
	
	<script src="/html/js/jquery.min.js"></script>
    <script src="/html/cloudJs/js/cloudjs.js"></script>

    <script>
        $(document).ready(function(){
            cloudjs('.tips').tips();

            $('.modify_btn').bind('click',function(){
			    if( typeof(window.parent.addTab) === 'function' ){
			        window.parent.addTab($(this).attr('tabTitle'),$(this).attr('href'));
			        return false;
			    }
			});
        });
    </script>
</body>
</html>
