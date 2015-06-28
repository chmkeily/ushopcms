<?php

class Coupon_model extends CI_Model
{
	var $TableName = 'tb_coupon';
    var $FieldMatrix = array(
            'coupon_id'         => 'ID',
            'coupon_providerid' => 'ProviderID',
            'coupon_title'      => 'Title',
            'coupon_icon'       => 'Icon',
            'coupon_content'    => 'Content',
            'coupon_begintime'  => 'BeginTime',
            'coupon_endtime'    => 'EndTime',
            'coupon_status'     => 'Status',
            'coupon_limitcnt'   => 'LimitCnt',
            'coupon_takencnt'   => 'TakenCnt',
            'coupon_ctime'      => 'CreatedTime',
        );

    public function __construct()
    {
        parent::__construct();
        $this->load->database('ushopcms');
    }

    //增加
    function add($coupon)
    {
        $row = XFORMAT($coupon, $this->FieldMatrix);
        if(FALSE == $this->db->insert($this->TableName, $row))
        {   
            return FALSE;
        }
        
        return $this->db->insert_id();
    }
    
    function remove($coupon_id)
    {
		$this->db->where('ID',$coupon_id)->delete($this->TableName);
    }
    
    ///查询
    /**
    * @return array or FALSE
    */
	function get_coupon_by_id($coupon_id)
	{
		$row = $this->db->where('ID', $coupon_id)->get($this->TableName)->row_array();
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
        if (!empty($conditions['provider_id']))
        {
            $this->db->where('ProviderID', $conditions['provider_id']);
        }

        if (!empty($conditions['status']))
        {
            $this->db->where('Status', $conditions['status']);
        }

        return $this->db;
    }

    /**
     * @brief 查询优惠劵
     */
    function get_coupons($conditions = array(), $limit = 10, $offset = 0)
    {
        $this->db->select('ID,ProviderID,Title,Icon,Content,Status,BeginTime,EndTime,TakenCnt,CreatedTime');
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
    function update($couponid, $updates = array())
    {
        $ufields = XFORMAT($updates, $this->FieldMatrix);
        if (empty($ufields))
        {
            return false;
        }

        $this->db->where('ID', $couponid)->update($this->TableName, $ufields);
        return $this->db->affected_rows();
    }
}
