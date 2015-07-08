<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

/**
* @brief 用户需求
*/
class Requirement extends CI_Controller {
	
	/**
	* constructor
	*/
	public function __construct()
	{
		parent::__construct();
		$this->load->model('requirement_model');
	}
	
	/**
	* @brief 需求查询
	*  <pre>
	*	接受的表单数据：
	*		start_idx	列表开始下标
	*		length		页大小/列表长度
	*		type		需求类型
	*  </pre>
	* @return 操作结果
	*/
	public function index()
	{
		$offset		= trim($this->input->get_post('start_idx', TRUE));
		$length		= trim($this->input->get_post('length', TRUE));
		$type		= trim($this->input->get_post('type', TRUE));

		if (!is_numeric($offset))
		{
			$offset = 0;
		}

		if (!is_numeric($length)
			|| 1 > $length || 20 < $length)
		{
			$length = 10;
        }
        
		$this->load->library('auth');
		$providerid = $this->auth->get_userid();
		if (null === $providerid)
		{
			$_RSP['ret'] = ERR_NO_SESSION;
			$_RSP['msg'] = 'you have to login first';
			exit(json_encode($_RSP));
		}

        $conditions = array();
        $conditions['requirement_providerid'] = $providerid;
        if (!empty($type))
        {
            $conditions['requirement_type'] = $type;
        }

		$requirements = $this->requirement_model->get_requirements($conditions, $length, $offset);
        $viewdata['requirements'] = $requirements;
        $viewdata['locations'] = $this->config->item('locations');
        $this->load->view('requirement_view', $viewdata);
    }

    /**
     * @brief 需求详情
     * <pre>
     *      rid     需求id
     * </pre>
     */
    function details()
    {
        $rid	= trim($this->input->get_post('rid', TRUE));

        if (!is_numeric($rid))
        {
            $_RSP['ret'] = -1;
            $_RSP['msg'] = '不合法的需求id';
            exit(json_encode($_RSP));
        }

        $requirement = $this->requirement_model->get_requirement_by_id($rid);
        if (false === $requirement)
        {
            $_RSP['ret'] = -1;
            $_RSP['msg'] = 'no such requirement';
            exit(json_encode($_RSP));
        }

        $viewdata['requirement'] = $requirement;
        $viewdata['locations'] = $this->config->item('locations');
        $this->load->view('requirement_details', $viewdata);
    }
    
    /**
     * @brief 流程处理（重要）
     * <pre>
     *  接受的表单数据:
     *      rid     需求id
     *      action  操作(接单, 拒绝, 结束, 补充备注等)
     *      comment 操作备注
     * </pre>
     */
    function process()
    {
		$rid	= trim($this->input->get_post('rid', TRUE));

    }

}

/* End of file requirement.php */
/* Location: ./application/controllers/requirement.php */
