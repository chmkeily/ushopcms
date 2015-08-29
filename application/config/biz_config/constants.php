<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

/*
* business constants are defined here
*/

//角色类型
define('ROLE_ADMIN', 			99);
define('ROLE_PROVIDER',			11);
define('ROLE_USER', 			1);

//审批操作类型
define('CMD_SUBMIT', 			1);	//提交审核
define('CMD_APPROVE', 			2);	//通过
define('CMD_REJECT', 			3);	//拒绝
define('CMD_CANCEL',			4);	//撤销

//服务商和服务案例的状态
define('STATE_CREATED', 		0);		//创建
define('STATE_INREVIEW',		1);		//审核中
define('STATE_ONLINE',			10);	//在线运营中
define('STATE_OFFLINE', 		11);	//已停止运营（撤销或者已被封禁）


/* End of file constants.php */
