<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

/**
* @brief 管理员
*/
class Admin extends CI_Controller {
	
	/**
	* constructor
	*/
	public function __construct()
	{
        parent::__construct();
        $this->load->model('user_model');
	}

	/**
	* @brief 登录
	*  <pre>
	*	接受的表单数据：
	*		email				登录邮箱
	*		secret				玩家秘钥+timestamp的MD5
	*		timestamp			当前时间戳(可能需要对时)
	*		version				API版本(可选)
	*  </pre>
	*  <pre>
	*	测试账号: 
	*		Email: admin@ushop.com
    *		密 码: abc123
	*  </pre>
	* @return 操作结果
	*/
	function login()
	{
		$email		= trim($this->input->get_post('email', TRUE));
		$secret		= trim($this->input->get_post('secret', TRUE));
		$timestamp	= trim($this->input->get_post('timestamp', TRUE));
		$version	= trim($this->input->get_post('version', TRUE));

		if (empty($email) || empty($secret) || empty($timestamp))
		{
			$_RSP['ret'] = 101;
			$_RSP['msg'] = 'missing param(s)';
			exit(json_encode($_RSP));
		}

		$this->load->library('auth');
		$ru = $this->auth->login($email, $secret, $timestamp);
		if (FALSE === $ru)
		{
			$_RSP['ret'] = 500;
			$_RSP['msg'] = 'authentication failed';
			exit(json_encode($_RSP));
		}

		$_RSP['ret'] = 0;
		$_RSP['user'] = array(
			'user_id' 	=> $ru['user_id'],
			'user_name'	=> $ru['user_name']
			);
		exit(json_encode($_RSP));
	}

	/**
	* @brief Logout
	*/
	function logout()
	{
		$this->load->library('auth');
		$this->auth->destroy_session();
	}



    ///////以下主要为业务内容
    /**
     * @brief 查询服务商/用户列表
     * <pre>
     *  接受的表单参数:
     *      offset      开始下标
     *      length      列表长度
     *      userid      用户id
     *      status      用户状态(注册中,修改/资料审核中,运营中等)
     *      format      返回格式(json)
     * </pre>
     * @return 操作结果
     */
    function providers()
    {
        $offset     = trim($this->input->get_post('offset', TRUE));
        $length     = trim($this->input->get_post('length', TRUE));
		$userid 	= trim($this->input->get_post('userid', TRUE));
        $status 	= trim($this->input->get_post('status', TRUE));
        $format     = trim($this->input->get_post('format', TRUE));

        //检查参数
        if (empty($offset) || !is_numeric($offset) || $offset < 0)
        {
            $offset = 0;
        }
        if (empty($length) || !is_numeric($length) || $length < 1 || $length > 100)
        {
            $length = 10;
        }

        $conditions = array();
        if (!empty($userid))
        {
            $conditions['userid'] = $userid;
        }
        if (!empty($status))
        {
            $conditions['status'] = $status;
        }

        $count = $this->user_model->count();
        $userinfos = $this->user_model->get_users($conditions, $length, $offset);
        $viewdata['count']     = $count;
        $viewdata['pagesize']  = $length;
        $viewdata['currpage']  = ceil($offset / $length) + 1;
        $viewdata['userinfos'] = $userinfos;
        $viewdata['statuswordings'] = $this->config->item('wordings_provider_status');

        if ('json' == $format)
        {
            exit(json_encode($viewdata));
        }
        else
        {
            $this->load->view('admin/users_view', $viewdata);
        }
    }

    /**
     * @brief 查询服务商用户信息
     * <pre>
     *  接受的表单参数:
     *      userid       用户id
     * </pre>
     * @return 操作结果
     */
    function profile()
    {
        $userid 	= trim($this->input->get_post('userid', TRUE));
        if (empty($userid) || !is_numeric($userid))
        {
            $_RSP['ret'] = ERR_INVALID_VALUE;
            $_RSP['msg'] = 'A valid user id is required.';
            exit(json_encode($_RSP));
        }

        $userinfo = $this->user_model->get_user_by_id($userid);
        if (empty($userinfo))
        {
            $_RSP['ret'] = ERR_NO_OBJECT;
            $_RSP['msg'] = 'no such provider!';
            exit(json_encode($_RSP));
        }

        $viewdata['userinfo'] = $userinfo;
        $this->load->view('admin/user_profile', $viewdata);
    }

    /// after 2015-06-28
    /**
    * @brief 发布/同步服务商到生产环境(正式表)
    * <pre>
    *   接受表单数据:
    *       providerid  服务商ID
    * </pre>
    */
    function publish()
    {
        $providerid = trim($this->input->get_post('providerid', TRUE));

        $user = $this->user_model->get_user_by_id($providerid);
        if (false === $user)
        {
            $_RSP['ret'] = -1;
            $_RSP['msg'] = '获取服务商数据失败';
            exit(json_encode($_RSP));
        }
        $userid = $user['user_id'];

        if (10 == $user['user_status'])
        {
            $_RSP['ret'] = -2;
            $_RSP['msg'] = '此状态下不能发布';
            exit(json_encode($_RSP));
        }

        $provider = array(
                'provider_id'        => $user['user_id'],
                'provider_name'      => $user['user_name'],
                'provider_icon'      => $user['user_icon'],
                'provider_license'   => $user['user_license'],
                'provider_location'  => $user['user_location'],
                'provider_contact'   => $user['user_contact'],
                'provider_address'   => $user['user_address'],
                'provider_brief'     => $user['user_brief'],
                'provider_intro'     => $user['user_intro'],
            );

        $this->load->model('provider_model');
        if (0 == $user['user_status'])
        {
            //初次发布
            $id = $this->provider_model->add($provider);
            if (false === $id)
            {
                $_RSP['ret'] = -3;
                $_RSP['msg'] = '发布到生产环境失败';
                exit(json_encode($_RSP));
            }
        }
        else
        {
            //发布更新
            $this->provider_model->update($userid, $provider);
        }

        //更新状态
        $updates = array('user_status'=>10);
        $this->user_model->update($userid, $updates);

        $_RSP['ret'] = 0;
        $_RSP['msg'] = '发布成功';
        exit(json_encode($_RSP));
    }


    ///需求类接口
    /**
    * @brief 查询需求列表
    * <pre>
    *   参数列表：
    *       offset      开始索引下标
    *       length      列表最大长度
    * </pre>
    */
    function requirements()
    {
        $offset     = trim($this->input->get_post('offset', TRUE));
        $length     = trim($this->input->get_post('length', TRUE));

        if (!is_numeric($offset))
        {
            $offset = 0;
        }

        if (!is_numeric($length)
            || 1 > $length || 20 < $length)
        {
            $length = 10;
        }

        $this->load->model('requirement_model');
        $conditions = array();
        $requirements = $this->requirement_model->get_requirements($conditions, $length, $offset);
        $viewdata['requirements'] = $requirements;
        $this->load->view('requirement_view', $viewdata);
    }
}

/* End of file admin.php */
/* Location: ./application/controllers/admin.php */
