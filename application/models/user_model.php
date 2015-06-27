<?php

class User_model extends CI_Model
{
	var $TableName = 'tb_cms_user';
    var $FieldMatrix = array(
            'user_id'       => 'ID',
            'user_email'    => 'Email',
            'user_secret'   => 'Secret',
            'user_type'     => 'Type',
            'user_name'     => 'Name',
            'user_icon'     => 'Icon',
            'user_phone'    => 'Phone',
            'user_contact'  => 'Contact',
            'user_address'  => 'Address',
            'user_location' => 'Location',
            'user_status'   => 'Status',
            'user_brief'    => 'Brief',
            'user_intro'    => 'Intro',
            'user_license'  => 'License',
            'user_pid'      => 'ProviderID',
            'user_verified' => 'Verified',
            'user_warranted'  => 'Warranted',
            'user_fieldtag'   => 'FieldTag',
            'user_permission' => 'Permission',
        );

    public function __construct()
    {
        parent::__construct();
        $this->load->database('ushopcms');
    }

    //增加
    function add($user)
    {
        $row = XFORMAT($user, $this->FieldMatrix);
        if(FALSE == $this->db->insert($this->TableName, $row))
        {   
            return FALSE;
        }
        
        return $this->db->insert_id();
    }
    
    function remove($userid)
    {
		$this->db->where('ID', $userid)->delete($this->TableName);
    }
    
    ///查询
    /**
    * @return array or FALSE
    */
    function get_user_by_email($email)
    {
        $row = $this->db->where('Email', $email)->get($this->TableName)->row_array();
        if (empty($row))
        {
            return FALSE;
        }

        return XFORMAT($row, $this->FieldMatrix, FALSE);
    }
	
    /**
    * @return array or FALSE
    */
	function get_user_by_id($userid)
	{
		$row = $this->db->where('ID', $userid)->get($this->TableName)->row_array();
        if (empty($row))
        {
            return FALSE;
        }

        return XFORMAT($row, $this->FieldMatrix, FALSE);
    }

    /**
    * @return 获取用户基本信息
    */
    function get_profile_by_id($userid)
    {
        $this->db->select('ID,Type,Email,Name,Phone,Contact');
        $row = $this->db->where('ID', $userid)->get($this->TableName)->row_array();
        if (empty($row))
        {
            return FALSE;
        }

        return XFORMAT($row, $this->FieldMatrix, FALSE);
    }

    /**
     * 
     */
    function create_query($conditions)
    {
        if (!empty($conditions['userid']))
        {
            $this->db->where('ID', $conditions['userid']);
            return $this->db;
        }

        if (!empty($conditions['status']))
        {
            $this->db->where('Status', $conditions['status']);
        }

        return $this->db;
    }

    /**
     * 
     */
    function get_users($conditions = array(), $limit = 10, $offset = 0)
    {
        $this->db->select('ID,Type,Email,Name,Phone,Contact,Address,Status,Brief,License,FieldTag');
        $rows = $this->create_query($conditions)->get($this->TableName, $limit, $offset)->result_array();
        $items = array();
        foreach ($rows as $row)
        {
            $items[] = XFORMAT($row, $this->FieldMatrix, FALSE);
        }

        return $items;
    }

    /**
     * @brief 更新信息
     */
    function update($userid, $updates = array())
    {
        $ufields = XFORMAT($updates, $this->FieldMatrix);
        if (empty($ufields))
        {
            return false;
        }

        $this->db->where('ID', $userid)->update($this->TableName, $ufields);
        return $this->db->affected_rows();
    }
}
