<?php
/**
 *	Масштабирование изображения DEEX CMF
 *
 *	13.10.2012
 *	@version 1.2
 *	@copyright BRANDER
 *	@author Deemon<a@dee13.ru>
 *
 *  @param  string $source_path Путь к исходнику
 *  @param  int $w           Ширина
 *  @param  int $h           Высота
 *  @param  array  $params      Дополнительные параметры
 *  @return mixed              true если всё ОК
 */
function resizeImage($source_path,$w,$h,$params=array())
{
	elog($params);
	$save_path=isset($params['save_path'])?$params['save_path']:false;
	$return_img=isset($params['return_img'])?$params['return_img']:false;
	if(!$save_path && !$return_img)
		return 'Нет смысла масштабировать без сохранения или вывода изображения';
	$water_mark=isset($params['water_mark_path'])?$params['water_mark_path']:false;
	$proportions=isset($params['proportions'])?$params['proportions']:true;
	$bg=isset($params['bg'])?$params['bg']:false;
	$fmt=false;
	$type=array('jpg' =>'jpeg','jpeg' =>'jpeg','gif'=>'gif','png'=>'png');

	if(file_exists($source_path))//Проверка существования исходного файла
	{
		//Определяю тип файла
		$info=getimagesize($source_path);
		if(!$info) return 'Не поддерживаемый формат файла';
		if(preg_match('#/(\w+)$#',$info['mime'],$res))
			$fmt=$res[1];
		else return 'Не поддерживаемый формат файла';

		// Создаю изображение...

		if(!$image = (($bg===false && $fmt=='png')
				?imagecreate($w,$h) /*Прозрачное*/
				:imagecreatetruecolor($w,$h)/*С фоном*/
			))
			return 'Не возможно создать изображение';
		//Если формат не png заливаю фон белым
		if($bg!==false || $fmt!='png')
		{
			elog($bg,'bg1');
			if($bg===false)
				$bg=0xFFFFFF;
			elog($bg,'bg2');
			imagefill($image, 10, 10,$bg);
		}

		//В зависимости от типа выбираю функцию
		$func='imagecreatefrom'.$type[$fmt];
		//Создаю изображение-донор
		if(!$source = $func($source_path))
			return 'Неправильный формат';


		$x=$y=0;
		$massW=$w;
		$massH=$h;
		if($proportions)
		{
			//Выбираю масштаб изображения
			$procW=$info[0] / $w;
			$procH=$info[1] / $h;
			$procent=($procW > $procH)? $procW : $procH;
			//Масштабирую размеры
			$massW=floor($info[0] / $procent);
			$massH=floor($info[1] / $procent);

			//Определяю координаты с учетом центрирования
			$x=floor(($w - $massW)/2);
			$y=floor(($h - $massH)/2);
		}
		// Копирую существующее изображение в новое с изменением размера:
		imagecopyresampled(
			$image,  // Идентификатор нового изображения
			$source,  // Идентификатор исходного изображения
			$x,$y,      // Координаты (x,y) верхнего левого угла в новом изображении
			0,0,      // Координаты (x,y) верхнего левого угла копируемого блока существующего изображения
			$massW,     // Новая ширина копируемого блока
			$massH,     // Новая высота копируемого блока
			$info[0], // Ширина исходного копируемого блока
			$info[1]  // Высота исходного копируемого блока
		);
		if($water_mark)//Если нужно наложить водяной знак
		{
			if(file_exists($water_mark))
			{
				//Определяю тип файла
				$info=getimagesize($water_mark);
				if(!$info) return 'Не поддерживаемый формат файла водяного знака';
				if(preg_match('#/(\w+)$#',$info['mime'],$res))
					$fmt=$res[1];
				else return 'Не поддерживаемый формат файла водяного знака';
				//В зависимости от типа выбираю функцию
				$func='imagecreatefrom'.$type[$fmt];
				//Создаю изображение водяного знака
				if(!$water_i = $func($water_mark))
					return 'Неправильный формат водяного знака';
				if($w < $info[0] && $h < $info[1])
				{
					//Выбираю масштаб изображения
					$procW=$info[0] / $w;
					$procH=$info[1] / $h;
					$procent=($procW > $procH)? $procW : $procH;

					//Масштабирую размеры
					$massW=floor($info[0] / $procent);
					$massH=floor($info[1] / $procent);
				}
				else
				{
					$massW=$info[0];
					$massH=$info[1];
				}
				//Определяю координаты с учетом центрирования
				$x=floor(($w - $massW)/2);
				$y=floor(($h - $massH)/2);

				// Копирую существующее изображение в новое с изменением размера:
				imagecopyresampled(
					$image,  // Идентификатор нового изображения
					$water_i,  // Идентификатор исходного изображения
					$x,$y,      // Координаты (x,y) верхнего левого угла в новом изображении
					0,0,      // Координаты (x,y) верхнего левого угла копируемого блока существующего изображения
					$massW,     // Новая ширина копируемого блока
					$massH,     // Новая высота копируемого блока
					$info[0], // Ширина исходного копируемого блока
					$info[1]  // Высота исходного копируемого блока
				);
				imagedestroy($water_i);
			}
			else
				return 'Файл водяного знака отсутствует';
		}
		if(preg_match('#\.(\w+)$#',$save_path,$res))
			$fmt=$res[1];
		//В зависимости от типа выбираем функцию
		$func='image'.$type[$fmt];
		//Сохраняю картинку
		if($save_path)
		{
			if($type[$fmt]=='jpeg')//Если сжатая картинка то доп. параметр качество
					$func($image, $save_path, 100);
			else
				$func($image, $save_path);
		}
		if($return_img)//Если выдавать картинку
		{
			//Обозначаю тип в заголовке
			header('Content-type: image/' . $type[$fmt]);
			$func($image);
		}
		// Удаляю временные файлы
		imagedestroy($image);
		imagedestroy($source);
	}
	else return 'Отсутствует исходный файл';
	return true;
}
