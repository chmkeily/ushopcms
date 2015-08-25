<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

/**
 * @author: hemingchen
 *
 */
class Workflow
{
	/**
	* 角色定义
	*/
	const ROLE_ADMIN 	= 1;
	const ROLE_PROVIDER = 2;
	const ROLE_USER		= 3;

	/**
	* 操作定义
	*/
	const CMD_APPROVE 	= 1;
	const CMD_REJECT	= 2;
	const CMD_PASSTO	= 3;

	/**
	* 流程状态定义
	*/
	const STATE_CREATED 	= 0;
	const STATE_FINISHED	= 1;
	const STATE_CLOSED		= 2;

	/**
	* 提示语定义
	*/
	static WORDING_STATES = array(
		STATE_CREATED 	=> '新创建',
		STATE_CLOSED	=> '已关闭',
		STATE_FINISHED	=> '已完成');


	/**
	* 状态转换图
	*/
	protected $_transitions = null;
	
	private create_transitions()
	{
		$this->_transitions = array(
			STATE_CREATED	=> array(
				array(
					'role'	=> ROLE_ADMIN,
					'cmd'	=> CMD_APPROVE,
					'next'	=> STATE_FINISHED,
				),

				array(
					'role'	=> ROLE_ADMIN,
					'cmd'	=> CMD_REJECT,
					'next'	=> STATE_CLOSED,
				),
			),

			STATE_CLOSED	=> array(
				
			),
		);
	}
}
