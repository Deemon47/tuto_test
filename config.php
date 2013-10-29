<?php
//MYSQL Settings
//host name
$CFG['mysql_host']='loaclhost';
//mysql user name
$CFG['mysql_user']='root';
//mysql user password
$CFG['mysql_pass']='root';
//mysql base name
$CFG['mysql_base']='tuto_test';
//show debug block
$CFG['show_debug']=true;
//show debug messages of type
$CFG['watch_actions']=
[
	'test',
	'error',
	'message',
	'notice',
	//'_GET',
	'_POST',
	'_SESSION',
	'_INCLUDED'
];
//Sizes
$CFG['image_size']=
[
	'site'=>[120,120],//120px X 120px
	'thumb'=>[50,50],//50px X 50px
];