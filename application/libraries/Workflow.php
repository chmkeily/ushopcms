<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

/**
 * @author: hemingchen
 *
 */
class Workflow
{
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

		var_dump($this->_DFA);
	}
}
