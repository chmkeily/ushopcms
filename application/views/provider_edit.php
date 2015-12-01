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
    <div class="form-horizontal"> 
		<!-- <form class="form-horizontal span8" method="post" action="/provider/update"> -->
            <fieldset>
				<div class="control-group">
					<label class="control-label">名称</label>
                    <div class="controls">
                        <input type="text" name="name" class="inputbox" value="<?php echo $userinfo['user_name']; ?>"/>
                        <span class="red">*</span>
					</div>
				</div>

				<div class="control-group">
					<label class="control-label">手机/电话</label>
					<div class="controls">
                        <input type="text" name="phone" class="inputbox" value="<?php echo $userinfo['user_phone']; ?>"/>
                        <span class="red">*</span>
					</div>
				</div>
				
				<div class="control-group">
					<label class="control-label">邮箱</label>
					<div class="controls">
                        <input type="text" name="email" class="inputbox" value="<?php echo $userinfo['user_email']; ?>"/>
					</div>
				</div>
				
				<div class="control-group">
					<label class="control-label">联系人</label>
					<div class="controls">
                        <input type="text" name="contact" class="inputbox" value="<?php echo $userinfo['user_contact']; ?>"/>
                        <span class="red">*</span>
					</div>
				</div>
				
				<div class="control-group">
					<label class="control-label">地址</label>
					<div class="controls">
                        <input type="text" name="address" class="inputbox" value="<?php echo $userinfo['user_address']; ?>"/>
                        <span class="red">*</span>
					</div>
				</div>

                <div class="control-group">
                    <label class="control-label">图标</label>
                    <div class="controls">
                        <form class="update_image" method="post" action="http://www.dianzhibao.com.cn/upload">
                            <span class="file" style="padding-top: 0;" title="在店之宝APP上展示服务商列表时使用"><input type="file" name="_ufile" /></span>
                            <input type="button" value="上传图标" class="up_btn" />&nbsp;&nbsp;
                            <span class="result" style="padding-top: 0;"><a href="<?php echo $userinfo['user_icon']; ?>" target="_blank">查看</a></span>
                            <input type="hidden" class="file_url" name="icon" value="<?php echo $userinfo['user_icon']; ?>" />
                        </form>
                    </div>
                </div>
				
				<div class="control-group">
					<label class="control-label">营业执照</label>
					<div class="controls">
						<form class="update_image" method="post" action="http://www.dianzhibao.com.cn/upload">
                            <span class="file" style="padding-top: 0;"><input type="file" class="license_file" name="_ufile" /></span>
                            <input type="button" value="上传营业执照" class="up_btn" />&nbsp;&nbsp;
                            <span class="result" style="padding-top: 0;"><a href="<?php echo $userinfo['user_license']; ?>" target="_blank">查看</a></span>
                            <input type="hidden" class="file_url" name="license" value="<?php echo $userinfo['user_license']; ?>" />
                        </form>
					</div>
                </div>

                <div class="control-group">
					<label class="control-label">简介</label>
					<div class="controls">
                        <textarea name="brief" class="inputbox" style="width: 500px; height: 70px;"><?php echo $userinfo['user_brief']; ?></textarea>
                        <span class="red">*</span>
					</div>
                </div>

				<div class="control-group">
					<label class="control-label">详细描述</label>
					<div class="controls">
                        <textarea name="intro" class="inputbox" style="width: 500px; height: 200px;"><?php echo $userinfo['user_intro']; ?></textarea>
                        <span class="red">*</span>
					</div>
				</div>

 				<div class="control-group">
					<div class="controls">
						<button type="button" id="save_btn" class="btn btn-primary">提交</button>
					</div>
				</div>
           
			</fieldset>
		
	</div>
	

	<script src="/html/js/jquery.min.js"></script>
    <script src="/html/js/jquery.form.js"></script>
    <script src="/html/cloudJs/js/cloudjs.js"></script>

    <script>
        function saveShopCase(){
            var data = {};
            data.name = $.trim($('[name="name"]').val());
            data.phone = $.trim($('[name="phone"]').val());
            data.contact = $.trim($('[name="contact"]').val());
            data.address = $.trim($('[name="address"]').val());
            data.license = $.trim($('[name="license"]').val());
            data.brief = $.trim($('[name="brief"]').val());
            data.intro = $.trim($('[name="intro"]').val());
            data.icon = $.trim($('[name="icon"]').val());

            $('#save_btn').attr('disabled', 'disabled');
            $.ajax({
                url: '/provider/update',
                data: data,
                type: 'post',
                dataType: 'json',
                success: function(response){
                    cloudjs.message({content: '提交成功，请等待审核！', type: 'success'});
                    setTimeout(function(){
			        	try{
			                parent.$('#ttbox').tabs('close', parent.$('#ttbox').tabs('getSelected').panel('options').title);
			            }catch(err){};
		            }, 2000);
                }
            });
        }

        $(document).ready(function(){
            cloudjs('.tips').tips();

            $('[name="_ufile"]').live('change', function(){
            	if(!$(this).val()){
            		return;
            	}

                var scope = $(this),
                    str = '';
                if(scope.hasClass('license_file')){
                    str = '营业执照上传成功！';
                }else{
                    str = '图标上传成功！';
                }
                var options = {
                    dataType: 'json',
                    success: function(response){
                        scope.parent().siblings('.file_url').val(response.url);
                        scope.parent().siblings('.result').html(str + '<a href="' + response.url + '" target="_blank">查看</a>').addClass('green');
                    }
                };
                scope.parents('.update_image').ajaxSubmit(options);
            });

            $('#save_btn').bind('click', function(){
                var reg_email = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

                if(!$.trim($('[name="name"]').val())){
                    cloudjs.message({content: '请输入名称', type: 'error'});
                    return;
                }

                if(!$.trim($('[name="phone"]').val())){
                    cloudjs.message({content: '请输入手机号或者电话号码', type: 'error'});
                    return;
                }

                if(!$.trim($('[name="contact"]').val())){
                    cloudjs.message({content: '请输入联系人', type: 'error'});
                    return;
                }

                if($.trim($('[name="email"]').val()) && !reg_email.test($.trim($('[name="email"]').val()))){
                    cloudjs.message({content: '请输入正确的邮箱地址', type: 'error'});
                    return;
                }

                if(!$.trim($('[name="address"]').val())){
                    cloudjs.message({content: '请输入地址', type: 'error'});
                    return;
                }

                if(!$.trim($('[name="icon"]').val())){
                    cloudjs.message({content: '请上传图标', type: 'error'});
                    return;
                }

                if(!$.trim($('[name="license"]').val())){
                    cloudjs.message({content: '请上传营业执照', type: 'error'});
                    return;
                }

                if(!$.trim($('[name="brief"]').val())){
                    cloudjs.message({content: '请输入简介', type: 'error'});
                    return;
                }

                if(!$.trim($('[name="intro"]').val())){
                    cloudjs.message({content: '请输入详细描述', type: 'error'});
                    return;
                }

                saveShopCase();
            });
        });
    </script>
</body>
</html>
