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

		case 'save_book':
			if(!isset($D['section'])||!isset($D['desc'])||!isset($D['id']))
				die('Пусто');

			$image_name='';
			$data='true';
			if(isset($_FILES['image']) && $_FILES['image']['error']==0 )
			{
				include('src/resizeImage.php');
				$image_name=uniqid().preg_replace('#^.*(\.[^\.]+)$#', '\1', $_FILES['image']['name']);
				foreach($CFG['image_size'] as $d_name=>$val)
				{
					 resizeImage($_FILES['image']['tmp_name'],$val[0],$val[1],array('save_path'=>"images/$d_name/$image_name"));/*save_path, return_img, water_mark_path, proportions, bg*/
				}
			}
			if($D['id']=='new')
			{
				$data=conn::query('INSERT INTO `books`(`section_id`,`name`,`image_path`,`desc`)
					VALUES('.$D['section'].',"'.$D['name'].'","'.$image_name.'","'.$D['desc'].'")',true);
			}
			else
			{

				conn::query('UPDATE`books` SET `section_id`='.$D['section']
					.',`name`="'.$D['name']
					.($image_name==''?'':'",`image_path`="'.$image_name)
					.'",`desc`="'.$D['desc']
					.'",`section_id`='.$D['section']
					.', `status` ="'.(isset($D['hidden'])?'hidden':'public').'" WHERE id='.$D['id']);
				if(isset($D['chapters']))
				{
					conn::query('set @a=0;');
					conn::query("UPDATE book_chapters SET `order` = (SELECT @a := @a + 1) WHERE book_id={$D['id']} ORDER BY FIELD(id,".implode(', ',array_reverse($D['chapters'])).") DESC LIMIT ".count($D['chapters']));
				}
			}
			die(print_r([$_POST,$_FILES,elog('elog_return'),$data]).//tmp
				'<script>window.parent._.test._response('.$data.',{action:"save_book"})</script>'
			);
			break;

		case 'get_data':
			if(!isset($D['page'])||!isset($D['limit'])||!isset($D['section']) || !is_numeric($D['section']))
				break;
			conn::selectLimited(' b.id,b.`name`,b.image_path,b.`desc`,(SELECT count(c.id) FROM book_chapters c WHERE c.book_id=b.id),status FROM books b where b.section_id='.$D['section'],$D['limit'],$D['page']);
			$data=['fields'=>conn::fetchAll(0,MYSQL_NUM),'total'=>conn::foundRows()];
			break;

		case 'edit_book':
			if(!is_numeric($D))
				break;
			$data=conn::selectOneRow(' b.*, s.name as section_name FROM books b, sections s WHERE b.id='.$D.' AND b.section_id=s.id');
			$data->chapters=conn::selectAll('id,name from book_chapters where book_id='.$data->id.' ORDER by `order`');

			break;
		case 'remove_chapter':
			if(!is_numeric($D))
				break;
			conn::query('DELETE FROM book_chapters WHERE id='.$D);
			break;
		case 'remove_books':
			if(!is_array($D))
				break;
			$ids=implode(',', $D);
			conn::query('DELETE FROM `book_chapters` WHERE book_id  IN('.$ids.')');
			conn::query('DELETE FROM `books` WHERE id  IN('.$ids.')');
			break;
		case 'save_chapter':
			if(!isset($D['book_id'])||!isset($D['name'])||!isset($D['desc'])||!isset($D['content'])|| !isset($D['video_link'])||!isset($D['tags'])||!isset($D['id']))
				break;
			$data=true;
			if($D['id']=='new')
				$data=conn::query('INSERT INTO book_chapters (`name`,video_link,`desc`,`content`,`tags`,book_id)VALUES("'.$D['name'].'","'.$D['video_link'].'","'.$D['desc'].'","'.$D['content'].'","'.$D['tags'].'",'.$D['book_id'].')',true);
			else
				conn::query('UPDATE book_chapters SET `name`="'.$D['name']
					.'", video_link="'.$D['video_link']
					.'",`desc`="'.$D['desc']
					.'",`content`="'.$D['content']
					.'",`tags`="'.$D['tags'].'" WHERE id='.$D['id']);

			// $tags=array_map('mb_strtoupper',array_map('trim',explode(',', $tags)));
			// if(count($tags)>0)
			// {
			// 	conn::query('INSERT IGNORE INTO meta_tags (tag)VALUES("'.implode('"),("',$tags).'")');
			// 	conn::selectAll('id from meta_tags where ')
			// }
			break;
		case 'load_chapter':
			if(!is_numeric($D))
				break;
			$data=conn::selectOneRow('* FROM book_chapters WHERE id='.$D);
			break;
	}
}
die(getJSArr(['data'=>$data,'elog'=>elog('elog_return'),'a'=>$_GET['_a'],'i'=>$_GET['_i']]));
