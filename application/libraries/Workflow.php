<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

/**
 * @author: hemingchen
 *
 */
class Workflow
{
	const ERROR_SYSTEM_FAILED			= -1000;
	const ERROR_NO_EXPECTED_TRANSIT		= -1001;

	/**
	* 工作流类型
	*/
	protected $_TYPE = 0;

	/**
	* 状态转换图
	*/
	protected $_DFA = null;

	/**
	* constructor
	*/
	public function __construct()
	{
		$this->create_dfa();
	}
	
	/**
	* 构造状态转换图
	*/
	private function create_dfa()
	{
		$this->_DFA = array(
			STATE_CREATED	=> array(
				array(
					'role'		=> ROLE_USER,
					'transits'	=> array(CMD_SUBMIT	=> STATE_INREVIEW),
				),
			),

			STATE_INREVIEW	=> array(
				array(
					'role'		=> ROLE_ADMIN,
					'transits'	=> array(
						CMD_APPROVE		=> STATE_ONLINE,
						CMD_REJECT		=> STATE_CREATED,
					),
				),

				array(
					'role'		=> ROLE_USER,
					'transits'	=> array(CMD_CANCEL => STATE_CREATED),
				),
			),

			STATE_ONLINE	=> array(
				array(
					'role'		=> ROLE_ADMIN,
					'transits'	=> array(CMD_CANCEL => STATE_OFFLINE),
				),
			),

			//more statuses
		);
	}

	/**
	* @breif 执行事务
	* @param 流程事务：$trans : {type,id,state}
	* @param 操作信息：$action : {role,cmd,role_id,comment}
	* @return 
	*/
	function transit($trans, $action)
	{
		$curr_state = $trans['state'];
		$act_role	= $action['role'];
		$act_cmd	= $action['cmd'];

		$transits = &$this->_DFA[$curr_state];
		if (!isset($transits))
		{
			return self::ERROR_NO_EXPECTED_TRANSIT;
		}
		
		foreach ($transits as $transit)
		{
			
		}
		return null;
	}

	/**
	* 根据用户角色和流程状态获取用户可执行的操作
	*/
	function get_commands($role, $state)
	{
		return null;
	}
}
