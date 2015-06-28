<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');


/**
* @brief 优惠券
*/
class Coupon extends CI_Controller {
	
	/**
	* constructor
	*/
	public function __construct()
	{
		parent::__construct();
		$this->load->model('coupon_model');
	}

	/**
	* @brief 优惠卷查询
	*  <pre>
	*	接受的表单数据：
	*		start_idx	列表开始下标
	*		length		页大小/列表长度
    *       kw_title    标题查询关键字(可选)
	*  </pre>
	* @return 操作结果
	*/
	public function index()
	{
		$offset		= trim($this->input->get_post('start_idx', TRUE));
		$length		= trim($this->input->get_post('length', TRUE));
        $kw_title   = trim($this->input->get_post('kw_title', TRUE));

		//检查&修正参数
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
        $userid = $this->auth->get_userid();
        if (null === $userid)
        {
            $_RSP['ret'] = ERR_NO_SESSION;
            $_RSP['msg'] = 'you have to login first';
            exit(json_encode($_RSP));
        }

        $conditions['provider_id'] = $userid;
        $coupons = $this->coupon_model->get_coupons($conditions, $length, $offset);
        $viewdata['coupons'] = $coupons;
        $this->load->view('coupon_view', $viewdata);
    }

    /**
     * @brief 详情查询
     * <pre>
     *  接受表单参数:
     *      coupon_id   优惠劵详情
     * </pre>
     * @return 优惠劵详情
     */
    function details()
    {
        $couponid   = trim($this->input->get_post('coupon_id', TRUE));

        $coupon = $this->coupon_model->get_coupon_by_id($couponid);
        if (empty($coupon))
        {
            $_RSP['ret'] = ERR_NO_OBJECT;
            $_RSP['msg'] = 'no such coupon';
            exit(json_encode($_RSP));
        }

        $_RSP['ret']    = SUCCEED;
        $_RSP['coupon'] = $coupon;
        exit(json_encode($_RSP));
    }

    /**
    * @brief 创建优惠劵
    * <pre>
    *	接受的表单数据:
    *		title 		优惠劵标题
    *		icon 		优惠劵图标
    *		begintime	开始/上线时间
    *		endtime		结束/下线时间
    *		content 	优惠劵内容(*)
    * </pre>
    */
    function create()
    {
    	$title   	= trim($this->input->get_post('title', TRUE));
    	$iconurl	= trim($this->input->get_post('icon', TRUE));
    	$begintime	= trim($this->input->get_post('begintime', TRUE));
    	$endtime	= trim($this->input->get_post('endtime', TRUE));
    	$content	= trim($this->input->get_post('content', TRUE));

    	//参数值校验
    	if (empty($content))
    	{
    		exit('优惠劵内容不能为空！');
    	}

    	$this->load->library('auth');
        $userid = $this->auth->get_userid();
        if (null === $userid)
        {
            $_RSP['ret'] = ERR_NO_SESSION;
            $_RSP['msg'] = 'you have to login first';
            exit(json_encode($_RSP));
        }

    	$coupon = array(
    		'coupon_providerid' => $userid,
    		'coupon_title'		=> $title,
    		'coupon_icon'		=> $iconurl,
    		'coupon_content'	=> $content,
    		'coupon_begintime'	=> $begintime,
    		'coupon_endtime'	=> $endtime,
    	);
    	$id = $this->coupon_model->add($coupon);
		if (FALSE == $id)
		{
			$_RSP['ret'] = 1000;
			$_RSP['msg'] = 'DB exception';
			exit(json_encode($_RSP));
		}

		$_RSP['ret'] = 0;
		$_RSP['msg'] = '提交成功！';
		exit(json_encode($_RSP)); 
    }

    /**
    * @brief 编辑
    * <pre>
    *	可修改字段：
    * </pre>
    */
    function edit()
    {

    }
}

/* End of file coupon.php */
