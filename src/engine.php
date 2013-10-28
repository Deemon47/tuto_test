<?php
/**
 *	Основа
 *
 *	07.02.2013
 *	@version 4.1.2
 *	@author Deemon<a@dee13.ru>
 */
date_default_timezone_set('Europe/Moscow');//Формат даты
$CFG=
[
	'mysql_host'=>'localhost',
	'mysql_user'=>'',
	'mysql_pass'=>'',
	'mysql_base'=>'',
	'show_debug'=>false,
	'watch_actions'=>[],

];
/**
 * Системный лог
 * @param  mixed $text значение
 * @param  string $desc Описание
 * @param  string $type Тип сообщения
 * @return mixed
 */
function elog($text='DEE_NULL',$desc='DEE_NULL',$type='test',$group='DEE_NULL')
{

	static
		$watch=array(),/*Отслеживаемые типы*/
		$data=array();/*Записи лога*/

	if($desc==='elog_watch')/*Установить типы отслеживаемых сообщений*/
		$watch=$text;
	elseif($desc==='elog_position')/*Установить текущее положения скрипта deep*/
		$pos=$text;
	elseif($text==='elog_echo' || $text==='elog_return')
	{
		/*Добавить к выводу системные переменные*/
		foreach(array('_GET','_POST','_SESSION') as $var)
			if(in_array($var,$watch))
				array_unshift($data,array(
					print_r(isset($GLOBALS[$var])?$GLOBALS[$var]:'Undefined',true),/*text*/
					"$var arr",/*type*/
					$var,/*desc*/
					' blue',
				));
		if(in_array('_INCLUDED', $watch))
		{
			$arr=[];
			foreach(get_included_files() as $val)
				$arr[]=str_replace(array('\\',$_SERVER['DOCUMENT_ROOT']),array('/',''),$val);
			array_unshift($data,array(
					print_r($arr,true),/*text*/
					"_INCLUDED arr",/*type*/
					'_INCLUDED',/*desc*/
					' blue',
				));
		}
		if($text==='elog_echo')/*Вывести лог*/
		{
			echo '<ul class="_elog list num">';
			foreach($data as &$val)
			{
				echo '<li class="',$val[1],$val[3],'">',($val[2]==='DEE_NULL'?'- ':$val[2].' :: '),$val[0],'</li>';
			}
			echo '</ul>';
			return;
		}
		else
			return $data;
	}
	elseif(in_array($type,$watch))
	{
		$t=$text;
		if(is_array($t)|| is_object($t))
		{
			$t=print_r($t,true);
			$type.=' arr';
		}
		elseif(is_bool($t))
			$t=$t?'TRUE':'FALSE';
		if($type==='test')
			$t=htmlspecialchars(print_r($t,true));
		$group=$group==='DEE_NULL'?'':' '.$group;
		$data[]=array($t,$type,$desc,$group);
	}
	return $text;
}
//Перенаправление  ошибок PHP на elog
function DeeXErrorHandler ($ncode,$text,$file,$line,$vars)
{
	static $names=array( 1 => 'ERROR', 2 => 'WARNING', 4 => 'PARSING ERROR', 8 => 'NOTICE', 16 => 'CORE ERROR', 32 => 'CORE WARNING', 64 => 'COMPILE ERROR', 128 => 'COMPILE WARNING', 256 => 'MYSQL ERROR', 512 => 'WARNING', 1024 => 'NOTICE' );
	$type=isset($names[$ncode])?$names[$ncode]:'UNKOWN';
	$text="<b>$type</b> [$ncode] { $text } в фале $file($line)";
	if($ncode===E_USER_ERROR)
		$text.='PHP '.PHP_VERSION.' ('.PHP_OS.')';
	elog($text,'!ОШИБКА PHP','error');
	if($ncode===E_USER_ERROR)
	{
		conn::close(true);
		elog('elog_echo');
		exit;
	}
}
//Автоподключение классов
function __autoload($class_name=false)
{
	if(file_exists($p='src/'.$class_name.'.php'))
		require($p);
	else elog('Используется, отсутствующий в библиотеке класс '.$class_name,'error');
}

set_error_handler('DeeXErrorHandler');

/**
 * Преобразовать в JSON объект без перекодирования символов
 * @param  array $arr данные
 * @return string
 */
function getJSArr($arr,$save_spaces=false)
{
	$res='';
	$end=count((array)$arr)-1;
	$count=0;
	foreach($arr as $i=>$val)
	{
		if(is_bool($val))
			$val=$val?'true':'false';
		elseif(is_array($val) || is_object($val))
			$val=getJSArr($val,$save_spaces);
		else
		{
			$val=is_numeric($val)?$val:'\''.str_replace(['\\','\''], ['\\\\','\\\''], $val).'\'';
			if(!$save_spaces)
				$val=preg_replace('#\s+#s', ' ', $val);
			else
				$val=str_replace(["\r\n","\n","\r"],'\n', $val);
		}
		$i=str_replace(['\\','\''], ['\\\\','\\\''], $i);
		$res.="'$i':$val";
		if($count++!=$end)
			$res.=',';
	}
	return '{'.$res.'}';
}
/**
 * Строку идентификаторов в массив
 * @param  string $str
 * @param  string $d
 * @return array      Массив идентификаторов
 */
function getIdsArr($str,$d='#')
{
	$str=preg_replace(array('/^'.$d.'/','/'.$d.'$/'),'',$str);
	return ($str=='')?array(): explode($d.$d,$str);
}
/**
 * Массив идентификаторов в строку
 * @param  array $arr
 * @param  string $d
 * @return string
 */
function getIdsStr($arr,$d='#')
{
	if(!empty($arr))
	{
		sort($arr);
		$str=implode($d.$d,array_unique(array_diff($arr,array(''))));
		return ($str=='' ? '' : $d.$str.$d);
	}
	return '';

}