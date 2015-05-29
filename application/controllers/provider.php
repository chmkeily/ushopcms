<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

/**
* @brief 服务商
*/
class Provider extends CI_Controller {
	
	/**
	* constructor
	*/
	public function __construct()
	{
        parent::__construct();
        $this->load->model('user_model');
	}
	
	/**
	* @brief 服务商注册申请
	*  <pre>
	*	接受的表单数据：
	*		name				服务商名称
	*		phone				电话
	*		email				邮箱
	*		contact 			联系人
	*		address				地址
    *		brief				简介
    *		...
    *  </pre>
	*/
	function register()
	{
		$name		= trim($this->input->get_post('name', TRUE));
		$phone		= trim($this->input->get_post('phone', TRUE));
		$email		= trim($this->input->get_post('email', TRUE));
		$contact 	= trim($this->input->get_post('contact', TRUE));
		$address	= trim($this->input->get_post('address', TRUE));
		$brief		= trim($this->input->get_post('brief', TRUE));

		if (empty($name))
		{
			$_RSP['ret'] = 101;
			$_RSP['msg'] = 'mising name';
			exit(json_encode($_RSP));
		}
		
		if (empty($phone))
		{
			$_RSP['ret'] = 102;
			$_RSP['msg'] = 'missing phone';
			exit(json_encode($_RSP));
		}
		
		if (!preg_match('/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/', $email))
		{
			$_RSP['ret'] = 103;
			$_RSP['msg'] = 'missing/invalid E-mail';
			exit(json_encode($_RSP));
		}
		
		$user = array(
			'user_email' 	=> $email,
			'user_phone'	=> $phone,
			'user_name'		=> $name,
			'user_contact'	=> $contact,
			'user_type'		=> 0,
			'user_address'	=> $address,
			'user_brief'	=> $brief
			);

		$this->load->model('user_model');
		$id = $this->user_model->add($user);
		if (FALSE == $id)
		{
			$_RSP['ret'] = 1000;
			$_RSP['msg'] = 'DB exception';
			exit(json_encode($_RSP));
		}

		unset($user['user_secret']);
		$_RSP['ret'] = 0;
		$_RSP['user'] = array(
			'userr_id'	=> $id,
			'user_name'	=> $name,
			);
		exit(json_encode($_RSP));
    }

    /**
     * @brief 修改帐号信息
     * <pre>
     *  接受的表单参数:
     *      name        用户昵称
     *      phone       联系方式(手机/电话)
     *      contact     联系人
     *      city        所在城市编码 (optional)
     * </pre>
     * @return 操作结果
     */
    function update()
    {
		$name 		= trim($this->input->get_post('name', TRUE));
		$phone 		= trim($this->input->get_post('phone', TRUE));
		$contact	= trim($this->input->get_post('contact', TRUE));
		$city	    = trim($this->input->get_post('city', TRUE));
        
        $this->load->library('auth');
        $userid = $this->auth->get_userid();
        if (null === $userid)
        {
            $_RSP['ret'] = ERR_NO_SESSION;
            $_RSP['msg'] = 'not logined yet';
            exit(json_encode($_RSP));
        }

        $updates = array();
        if (!empty($name))
        {
            $updates['user_name'] = $name;
        }
        if (!empty($phone))
        {
            $updates['use_phone'] = $phone;
        }
        if (!empty($contact))
        {
            $updates['user_contact'] = $contact;
        }
        if (!empty($city))
        {
            $updates['user_location'] = $city;
        }

        if (empty($updates))
        {
            $_RSP['ret'] = ERR_MISSING_PARM;
            $_RSP['msg'] = 'missing params';
            exit(json_encode($_RSP));
        }

        $ret = $this->user_model->update($userid, $updates);
        if (false === $ret)
        {
            $_RSP['ret'] = ERR_DB_OPERATION_FAILED;
            $_RSP['msg'] = 'database exception';
            exit(json_encode($_RSP));
        }

        $_RSP['ret'] = 0;
        exit(json_encode($_RSP));
    }

    /**
     * @brief 查询/编辑服务商资料
     * <pre>
     *  接受的表单参数:
     *      userid      用户id (optional)
     *      isedit      是否是编辑(optional, 非空表示编辑)
     * </pre>
     * @return 操作结果
     */
    function index()
    {
        $userid 	= trim($this->input->get_post('userid', TRUE));
        $isedit 	= trim($this->input->get_post('isedit', TRUE));

        if (empty($userid) || !is_numeric($userid))
        {
            $this->load->library('auth');
            $userid = $this->auth->get_userid();
            if (null === $userid)
            {
                $_RSP['ret'] = -1;
                $_RSP['msg'] = 'missing userid, or please login';
                exit(json_encode($_RSP));
            }
        }

        $userinfo = $this->user_model->get_user_by_id($userid);
        if (!empty($userinfo))
        {
            unset($userinfo['user_secret']);
            $viewdata['userinfo'] = $userinfo;
        }

        if (empty($isedit))
        {
            $this->load->view('provider_info', $viewdata);
        }
        else
        {
            $this->load->view('provider_edit', $viewdata);
        }
    }
}

/* End of file provider.php */
/* Location: ./application/controllers/provider.php */
