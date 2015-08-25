<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

/*
* business constants are defined here
*/

// 收藏类型
define('FAVORITE_PROVIDER',				1);
define('FAVORITE_SHOPCASE',				2);
define('FAVORITE_PRODUCT',				3);
define('FAVORITE_COUPON',				4);


//角色类型
define('ROLE_ADMIN', 			99);
define('ROLE_PROVIDER',			11);
define('ROLE_USER', 			1);

//审批操作类型
define('CMD_APPROVE', 			1);
define('CMD_REJECT', 			2);

//服务商状态
define('STATE_CREATED', 		0);
define('STATE_MODIFIED',		1);
define('STATE_FINISHED',		10);
define('STATE_CLOSED', 			11);

/* End of file constants.php */
