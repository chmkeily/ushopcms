	function changeLangage(txt)
	{
		var h1 = new Array("mh0","mh1","mh2");
		for(i=0;i<h1.length;i++)
		{
			_lan = document.getElementsByName("language");
			var _sar="_";
			if(null!=_lan)
			{
				var j;
				for(j=0;j<_lan.length;j++)
				{
					if(_lan[j].checked)
					{
						_sar = txt==null?_lan[j].value:"_";
					}
				}
			}
			h = document.getElementById(h1[i]);
			h.innerHTML = _sar;
		}
	}

