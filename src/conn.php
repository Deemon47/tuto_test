<?php
/**
 *	Упрощенный MYSQL коннектор DeeX
 *
 *	15.02.2013
 *	@version 4.3
 *	@copyright BRANDER
 *	@author Deemon<a@dee13.ru>
 */

/*Основной класс со статическими методами*/
class conn
{
	private static
		$host='localhost',//адрес mysql сервера
		$user=false,//Имя пользователя
		$pass=false,//Пароль
		$db_name=false,//Имя базы данных
		$charset='utf8',//Кодировка базы данных
		$conn=false,//Идентификатор соединения
		$results=array(),//Результаты выполнения запросов
		$rowCnt=array(),//Количество полученных записей
		$elog=false,//Выводить сообщения в системный лог
		$log_query=false;//Выводить все запросы
/**
 * Инициализация подключения
 * @param string $user  Имя пользователя
 * @param string $pass  Пароль
 * @param string $db_name  Название базы данных
 * @param array $params  Дополнительные параметры
 */
	static function init($user,$pass,$db_name,$params=array())
    {
		foreach($params as $name=>$val)
			if(isset(self::$$name))
				self::$$name=$val;
		self::$user=$user;
		self::$pass=$pass;
		self::$db_name=$db_name;
	}
/**
 * Отчет
 * @param string $err  Описание события
 * @param string $type Тип события
 */
	private static function addLog($err,$type)
	{
		if(self::$elog)
			elog($err,'mysql',$type,'mysql');
	}
/**
 * Соединить с базой
 * @param  slink $conn Ссылка на параметры соединения
 * @return boolean       Успешность соединения
 */
	static function connect()
	{

		//Пробую подключиться
		if(false == (self::$conn=mysql_connect(self::$host,self::$user,self::$pass)))
		{
			self::addLog('Соединение с mysql-серверром неудалось ','error');
			return false;
		}
		if(false == mysql_select_db(self::$db_name,self::$conn))
		{
			self::addLog('Соединение с базой не удалось - возможно такой базы не существует','error');
			return false;
		}
		//Явно объявляю кодировки
		mysql_query("SET NAMES '".self::$charset."'");
		mysql_query("SET CHARACTER SET '".self::$charset."'");
		return true;
	}
/**
 * Выполнить запрос
 * @param  string  $sql    Запрос
 * @param  boolean $get_id Выдать индекс идентификатор добавленной записи
 * @param  integer $ind    Индекс запроса
 * @param  slink  $conn   Ссылка на параметры соединения
 * @return mixed
 */
	static function query($sql,$get_id=false,$ind=0)
	{

		if(self::$log_query)
			self::addLog(htmlspecialchars($sql),'notice');
		self::$rowCnt[$ind]=false;//Очищаю количество строк
		self::$results[$ind]=false;
		if(false==self::$conn)//Если нет подключения, подключаю
		{
			if(!self::connect(self::$conn))
			{
				self::addLog('Отсутствует соединение','notice');
				return false;
			}
		}
		$result=mysql_query($sql,self::$conn);
		if(false==$result)
		{
			self::addLog( 'Ошибка запроса :'. htmlspecialchars(mysql_error(self::$conn))." <br>\r\n \"$sql\"",'error');
			return false;
		}
		else
		{
			self::$results[$ind]=$result;
			if($get_id)
				return mysql_insert_id(self::$conn);
			elseif(!is_bool(self::$results[$ind]))
				self::$rowCnt[$ind]=mysql_num_rows($result);
		}
		return true;
	}
	/**
	 * Выбрать чать записей
	 * @param  stiring  $q     Запрос без "select" и "limit"
	 * @param  integer $limit
	 * @param  integer $page  Смещение
	 * @param  integer $ind   Индекс запроса
	 * @return mixed
	 */
	static function selectLimited($q,$limit=10,$page=0,$ind=0)
	{
		return conn::query('SELECT SQL_CALC_FOUND_ROWS '.$q.' limit '.$limit*$page.','.$limit,false,$ind);
	}
/**
 * Выдать все данные запроса
 * @param  mixed $ind      Индекс запроса
 * @param  boolean $arr_type Тип выдачи
 * @return mixed
 */
	static function selectAll($q,$ind=0,$arr_type=false)
	{
		self::query('SELECT '.$q,false,$ind);
		return self::fetchAll($ind,$arr_type);
	}
/**
 * Выбрать одну запись запроса
 * @param  string  $sql      Запрос без "select" и "limit"
 * @param  constant $arr_type Тип выдачи записи
 * @param  slink  $conn     Ссылка на параметры соединения
 * @return mixed            Объект выдачи
 */
	static function selectOneRow($sql,$ind=0,$arr_type=false)
	{
		self::query('select '.$sql.' limit 1',false,$ind);
		return self::fetch($ind,$arr_type);
	}
/**
 * Выдает результат выполнения mysql функции found_rows()
 * @param  integer $ind  Индекс запроса
 * @param  slink  $conn Ссылка на параметры подключения
 * @return int        Количество найденных записей
 */
	static function foundRows($ind=0)
	{
		self::query('select found_rows() as n',false,$ind);
		if(true == $n=self::fetch($ind))
			return $n->n;
		return false;
	}
/**
 * Получить значение первой ячейки первой записи запроса
 * @param  string $sql  Запрос без "select" и "limit"
 * @param  slink $conn Ссылка на параметры подключения
 * @return mixed       Значение
 */
	static function selectOneCell($sql,$ind=0)
	{
		self::query('select '.$sql.' limit 1',false,$ind);
		if(true == $data=self::fetch($ind,MYSQL_NUM))
		{
			mysql_free_result(self::$results[$ind]);
			return $data[0];
		}
		return false;
	}

/**
 * Количество строк выдачи
 * @param  integer $ind  Индекс запроса
 * @param  slink  $conn Ссылка на параметры подключения
 * @return integer        Количество
 */
	static function rowCount($ind=0)
	{
		return self::$rowCnt[$ind];
	}
/**
 * Количество строк затронутых при модификации таблицы
 * @param  integer $ind  Индекс запроса
 * @param  slink  $conn Ссылка на параметры соединения
 * @return integer        Количество
 */
	static function affected($ind=0)
	{
		return  mysql_affected_rows(self::$conn);
	}
/**
 * Выдать следующую строку запроса
 * @param  mixed $ind      Индекс запроса
 * @param  constant $arr_type Тип выдачи массив
 * @param  slink  $conn     Ссылка на соединение
 * @return mixed
 */
	static function fetch($ind=0,$arr_type=false)
	{
		if(true == self::$conn)
		{
			if(false == self::$results[$ind])
			{
				self::addLog('Нет выдачи - возможно ошибка запроса','notice');
				return false;
			}
			else
			{
				$row=$arr_type
					?mysql_fetch_array(self::$results[$ind],$arr_type)
					:mysql_fetch_object(self::$results[$ind]);
				if(false != $row)
					return $row;
				elseif(0 == self::$rowCnt[$ind])
				{
					self::addLog('Запрос выдал пустой результат','notice');
					return false;
				}
				else
				{
					elog($row,'result_clear');
					mysql_free_result(self::$results[$ind]);
				}
			}
		}
		else
		{
			self::addLog('Отсутствует соединение','notice');
			return false;
		}
		return false;
	}
	static function fetchAll($ind=0,$arr_type=false)
	{
		$data=[];
		while($row=self::fetch($ind,$arr_type))
			$data[]=$row;
		return $data;
	}
/**
 * Закрыть все соединения с базой
 * @param  boolean $err Выводить ошибку отсутствия соединения
 * @return boolean       Успех
 */
	static function close($err=true)
	{
		if(true ==self::$conn)
		{
			if(mysql_close(self::$conn))
				return true;
			else
				self::addLog('Ошибка разъединения - возможно соединение уже разорвано','notice');
		}
		elseif($err)
			self::addLog('Отсутствует соединение с базой '.self::$host.'.'.self::$db_name,'notice');
		return false;
	}
	/**
	 * Создать объект подключения к другой базе
	 * @param string $user  Имя пользователя
	 * @param string $pass  Пароль
	 * @param string $db_name  Название базы данных
	 * @param array $params  Дополнительные параметры
	 * @var object ссылка на параметры подключения
	 */
	static function getMultyConn($user,$pass,$db_name,$params=array())
	{
		return new MultyConn($user,$pass,$db_name,$params);
	}
}
