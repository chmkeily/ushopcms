<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

/*
* business wordings are defined here
*/

//审批操作提示语
$config['wordings_commands'] = array(
	CMD_SUBMIT		=> '提交审核',
	CMD_APPROVE		=> '批准通过',
	CMD_REJECT		=> '驳回',
	CMD_CANCEL		=> '撤销'
);

//服务商状态提示语
$config['wordings_provider_statuses'] = array(
	STATE_CREATED		=> '新注册',
	STATE_INREVIEW		=> '审核中',
	STATE_ONLINE		=> '运营中',
	STATE_OFFLINE 		=> '已停运',
);

//服务案例提示语
$config['wordings_shopcase_statuses'] = array(
	STATE_CREATED		=> '新创建',
	STATE_INREVIEW		=> '审核中',
	STATE_ONLINE		=> '已发布',
	STATE_OFFLINE 		=> '已下线',
);

/* End of file wordings.php */
