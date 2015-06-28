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

	/**
	* @brief 用户注册
	*  <pre>
	*	接受的表单数据：
	*		email				登录邮箱
	*		secret				秘钥约定(算法待定)
	*		name 				昵称
	*		contact 			联系方式
	*		version				API版本(可选)
    *  </pre>
    *  <pre>
    *		@ 2015-04-19
    *		可设置version为2启用openssl_rsa公钥对secret进行加密 (公钥另行获取)
    *  </pre>
	*/
	function register()
	{
		$email		= trim($this->input->get_post('email', TRUE));
		$secret		= trim($this->input->get_post('secret', TRUE));
		$name 		= trim($this->input->get_post('name', TRUE));
		$contact	= trim($this->input->get_post('contact', TRUE));
		$version	= trim($this->input->get_post('version', TRUE));

		if (empty($email))
		{
			$_RSP['ret'] = 101;
			$_RSP['msg'] = 'mising param(s)';
			exit(json_encode($_RSP));
		}

		if (!preg_match('/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/', $email))
		{
			$_RSP['ret'] = 100;
			$_RSP['msg'] = 'invalid email';
			exit(json_encode($_RSP));
        }

        if ($version == 2)
        {
            $this->load->library('encrypt');
            $this->encrypt->private_decrypt(base64_decode($secret), $secret);
        }

		if (empty($name))
		{
			$name="user_" . time() % 9999;
		}

		$user = array(
			'user_email' 	=> $email,
			'user_secret'	=> $secret,
			'user_name'		=> $name,
			'user_contact'	=> $contact,
			'user_type'		=> 99,
			'user_location'	=> 0
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

    ///////以下主要为业务内容
    /**
     * @brief 查询用户列表
     * <pre>
     *  接受的表单参数:
     *      userid       用户id
     *      status       用户状态(注册中,修改/资料审核中,运营中等)
     * </pre>
     * @return 操作结果
     */
    function userinfos()
    {
		$userid 	= trim($this->input->get_post('userid', TRUE));
        $status 	= trim($this->input->get_post('status', TRUE));

        $conditions = array();
        if (!empty($userid))
        {
            $conditions['userid'] = $userid;
        }
        if (!empty($status))
        {
            $conditions['status'] = $status;
        }

        $userinfos = $this->user_model->get_users($conditions);
        $viewdata['userinfos'] = $userinfos;
        $this->load->view('users_view', $viewdata);
    }

    /**
     * @brief 查询用户信息
     * <pre>
     *  接受的表单参数:
     *      userid       用户id
     * </pre>
     * @return 操作结果
     */
    function userprofile()
    {
        $userid 	= trim($this->input->get_post('userid', TRUE));
        if (!empty($userid) && is_numeric($userid))
        {
            $viewdata['ret'] = ERR_INVALID_VALUE;
            $viewdata['err_msg'] = 'A valid user id is reguired.';
        }

        $_RSP['ret'] = -1;
        $userinfo = $this->user_model->get_user_by_id($userid);
        if (!empty($userinfo))
        {
            $_RSP['ret'] = 0;
            $_RSP['userinfo'] = $userinfo;
        }

        exit(json_encode($_RSP));
    }

    /// after 2016-06-28

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
        if (0 === $user['user_status'])
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
        $updates = array('user_status', 10);
        $this->user_model->update($userid, $updates);

        $_RSP['ret'] = 0;
        $_RSP['msg'] = '发布成功';
        exit(json_encode($_RSP));
    }
}

/* End of file admin.php */
/* Location: ./application/controllers/admin.php */
