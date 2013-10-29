<?php
/**
 *	Точка входа DEEX
 *
 *	23.10.2013
 *	@version 1
 *	@author Deemon<a@dee13.ru>
 */
/*Разбор URL */
	$URL=strtolower(str_replace(['\'','?'.$_SERVER['QUERY_STRING']],'',$_SERVER['REQUEST_URI']));
	$LINKS=explode('/',substr($URL,1));
function save($data)
{
	file_put_contents('data', $data);
}
require('src/engine.php');
require('config.php');
elog($CFG['watch_actions'],'elog_watch');
/*инициализация MYSQL соединения */
conn::init(
	$CFG['mysql_user'],
	$CFG['mysql_pass'],
	$CFG['mysql_base'],
	array(
		'elog'=>true,
		'log_query'=>true,
		)
);
$CONTENT='<a href="/admin">перейти к администрированию</a>';
if(count($LINKS)>0 && $LINKS[0]=='ajax')
{
	include('src/ajax.php');
	die(' ');
}
if(count($LINKS)>0 && $LINKS[0]=='admin')
{
	include('src/admin.php');
}
?><!doctype html>
<html lang="en">
<head>
	<title>Тестовое задание</title>

	<link rel="stylesheet" href="/css/dee_v.css">
	<link rel="stylesheet" href="/css/font.css">
	<script src="/js/jquery.js"></script>
	<script src="/js/jquery-ui.js"></script>
	<script src="/js/engine.js"></script>
	<script src="/js/prot_sys.js"></script>
	<script src="/js/mess.js"></script>
	<script src="/js/page.js"></script>
	<script src="/js/hot_keys.js"></script>
	<script src="/js/pager.js"></script>
	<script src="/js/m_win.js"></script>
	<script src="/js/test.js"></script>
</head>
<body>
<div class="m-wrap admin">
	<div class="m-wrap-inner">
		<div class="m-wrap-cont _ac _position">
		<!-- view -->
		<?=$CONTENT?>
		</div>
	</div>
</div>
<?if($CFG['show_debug']){?>
	<div class="m-wrap elog">
		<div class="m-wrap-inner">
			<div class="m-wrap-cont">
				<h2>Лог</h2>

				<?php elog('elog_echo');?>
			</div>
		</div>
	</div>
<?}?>

<!-- Invisible Part-->
<script>$(function(){
	_.initAll(true);
});</script>
<div class="m-wrap loading _loading">
	<div class="m-wrap-inner">
		<div class="m-wrap-cont">
			<div class="title _text">Идет загрузка контента...</div>
		</div>
	</div>
</div>
<div class="_modal_win">
	<div class="_wrapper" >&nbsp;</div>
	<div class="_win">
		<div class="_inner"></div>
	</div>
</div>
<iframe name="ajax" src=""></iframe>
</body>
</html>