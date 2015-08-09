<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

/**
 * @author: hemingchen
 *
 */
class Workflow
{
	protected $_state_graph = null;
	
	private create_state_graph()
	{
		//这里所有数字以后换成宏定义,包括状态(state),角色类型(role),操作类型(cmd)
		$this->_state_graph = array(
			STATE_CREATED	=> array(
								'roles'		=> array(ROLE_ADMIN),
								'rules'		=> array(
												CMD_APPROVE	=> STATE_APPROVED,
												CMD_REJECT	=> STATE_FINISHED,
											),
				),
				
			STATE_APPROVED	=> array(
								'roles'		=> array(ROLE_ADMIN, ROLE_USER),
								'rules'		=> array(
												CMD_FIN	=> STATE_FINISHED,
											),
				),
		);
	}
}
