<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

/**
* @brief 文件上传
*/
class Upload {

    private var $_ufile_dir = '/data/ussd/';
    private var $_ufile_internet_dir = '/cdn/';
	
	/**
	* constructor
	*/
	public function __construct()
	{
		parent::__construct();
	}

	/**
	* @brief 文件/图片上传接口
	*/
	public function save($_fname = '_ufile')
	{
		$userfile =& $_FILES[$_fname];
		if (empty($userfile) || 0 != $userfile['error'])
		{
			return array(
				'ret' => -1,
				'msg' => $userfile['error']
				);
		}

		$fileinfos = pathinfo($userfile['name']);
		$ldir = $this->_ufile_dir . '/' . date('Y-m-d');
		$lfname = date('YmdHis') . '_' . (rand() % 100);
		if (!empty($fileinfos['extension']))
		{
			$lfname .= '.' . $fileinfos['extension'];
		}
		$lfile = $ldir . '/' . $lfname;

		if (!is_dir($ldir) && mkdir($ldir, 0755, true))
		{
			return array(
				'ret' => -2,
				'msg' => 'failed to mkdir'
				);
		}

		if (false == move_uploaded_file($userfile['tmp_name'], $lfile))
		{
			return array(
				'ret' => -3,
				'msg' => "failed to move_uploaded_file to '{$lfile}'",
				);
		}
		
		return array(
			'ret'	=> 0,
			'path'	=> $lfile,
			);
	}
}

/* End of file upload.php */
/* Location: ./application/controllers/upload.php */
