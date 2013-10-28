<?php
/**
 *	Обработка AJAX запросов DEEX CMF
 *
 *	23.10.2013
 *	@version 1
 *	@author Deemon<a@dee13.ru>
 */

$data=false;
if(empty($_GET['_a'])|| !isset ($_GET['_i'])|| !isset($_POST['_d']))
	elog('Ошибка AJAX запроса','','error');
else
{
	$D=$_POST['_d'];
	switch($_GET['_a'])
	{

		case 'get_section':
			$c=0;
			$p='';
			if($D!='false' )
			{
				if(!is_array($D))
					break;
				$p=getIdsStr($D);
				$c=count($D);
			}
			$data=conn::selectAll('id,name FROM sections where parents="'.$p.'" AND lvl='.$c);

			break;
		case '':
			break;
		case '':
			break;
		case '':
			break;
	}
}
die(getJSArr(['data'=>$data,'elog'=>elog('elog_return'),'a'=>$_GET['_a'],'i'=>$_GET['_i']]));
