/**
 *	Генератор страницы DEEX CMF
 *
 *	29.04.2013
 *	@version 1
 *	@copyright BRANDER
 *	@author Deemon<a@dee13.ru>
 */
//////////////////////////
// todo Добавить в ядро //
//////////////////////////
_.page=
{
	'_init_after':['hot_keys'],
	/*Часть урл без состояния элементов*/
	'url':false,
	/*Данные для формирования текущей страницы*/
	'_data':null,
	/*Текущая страница администрирования*/
	'admin_page':false,
	/*состояние элементов*/
	'_state':{},
	/*Функции реагирования на изменение*/
	'_callbacks':{},
	/*Символы для преобразования массивов в строки и наоборот*/
	'lvl_symb':[[':',';'],['^',','],['/','|'],['[',']'],['{','}'],['\\','$']],
	'_init':function(first)
	{

		/**/
		this._state={};
		this.url=location.pathname;
		var links=location.search.substr(1).split('&');
		if(links.length)
		{
			this.url+='?';
			for(var key in links)
			{
				var val=links[key];
				var s=val.split('=');
					if(s.length==2)
						this._state=this.toArr(s[1]);
					if(typeof this._state!='object')
						this._state={};
			}
		}




	},
	'onUpdate':function(func)
	{
		var name='.';
		for (var i=1; i<arguments.length; i++)
			name+=arguments[i]+'.';
		if(!(name in this._callbacks))
			this._callbacks[name]=[];
		this._callbacks[name].push(func);
	},

	/*Получить состояние*/
	'getState':function()
	{
		var obj,args;
		if(arguments.length==0)
			return $.extend({},this._state);
		if(arguments.length!=2 || !$.isArray(arguments[1]))
		{
			obj=this._state;
			args=[];
			for(var i=0;i<arguments.length;i++)
				args.push(arguments[i]);
		}
		else
		{
			obj=arguments[0];
			args=arguments[1];
		}
		if(args.length==0)
			return null;
		var name=args.shift();
		if(!(name in obj))
			return null;
		if(args.length==0)
		{
			var val=obj[name];
			if(typeof val=='object')
				return $.extend(($.isArray(val)?[]:{}),val);
			return val;
		}
		return this.getState(obj[name],args);
	},
	/*Установить состояние*/
	'setState':function()
	{
		var val,args,obj,f_name,funcs;
		var f=false;
		if(arguments.length!=5 || !$.isArray(arguments[1]))
		{
			if(arguments.length<2)
				return false;
			args=[];
			for(var i=0;i<arguments.length;i++)
				args.push(arguments[i]);
			val=args.shift();
			if(typeof val!='object')
				val+='';
			obj=this._state;
			funcs=[];
			f_name='.';
			f=true;
		}
		else
		{
			val=arguments[0];
			args=arguments[1];
			obj=arguments[2];
			f_name=arguments[3];
			funcs=arguments[4];
		}
		var name=args.shift();
		if(f_name in this._callbacks)
			funcs=funcs.concat(this._callbacks[f_name]);
		f_name+=name+'.';
		if(args.length>0)
		{

			if((!(name in obj) && val != null))
				obj[name]={};
			if(name in obj)
			{
				if(typeof obj[name] !='object')
						obj[name]={};
				this.setState(val,args,obj[name],f_name,funcs);
			}
		}
		else
		{
			if(val == null)
				delete obj[name];
			else
				obj[name]=val;
			if(f_name in this._callbacks)
				funcs=funcs.concat(this._callbacks[f_name]);
			for(var key in funcs)
				funcs[key]();
		}
		if($.isEmptyObject(obj[name]))
			delete obj[name];
		if(f)this.updateState();
		return true;
	},
	/*Обновить состояние в ссылке*/
	'updateState':function()
	{
		window.history.replaceState(this._data,document.title,this.url+'_='+this.toStr(this._state));
	},
	/*Преобразование массива в строку*/
	'toStr':function(obj,lvl)
	{
		if(typeof lvl=='undefined')
			lvl=0;
		if(!(lvl in this.lvl_symb))
			obj=obj+'';
		var s=this.lvl_symb[lvl];

		if (typeof obj !='object')
			return encodeURIComponent(obj+'');

		var res='';
		var ind=0;
		for(var key in obj)
		{
			if(key!=ind++)
				res+=key.replace('/[^\\._\\w\\d]+/g','')+s[0];
			res+=this.toStr(obj[key],lvl+1)+s[1];
		}
		return res;
	},
	/*Преобразование строки в массив*/
	'toArr':function(str,lvl)
	{
		if(typeof lvl=='undefined')
			lvl=0;
		if(!(lvl in this.lvl_symb))
			return decodeURIComponent(str+'');

		var s=this.lvl_symb[lvl];

		var data=str.split(s[1]);
		if(data.length==1)
		{
			var s= decodeURIComponent(data[0]+'');
			return s;
		}
		var arr=[];
		var obj={};
		var ind=0;
		for(var key in data)
		{
			var val=data[key];
			if(++ind==data.length)
				break;
			val=val.split(s[0]);
			if(val.length==2)
			{
				arr=false;
				obj[val[0]]=this.toArr(val[1],lvl+1);
			}
			else
			{
				var d=this.toArr(val[0],lvl+1);
				if(arr!== false)
					arr.push(d);
				else
					arr=false;
				obj[key]=d;
			}
		}
		return (arr==false)? obj:arr;
	}
};
// Для состояния :
// 	в именах звена убираются все знаки кроме [._] цифр и букв;
// 	все конечные данные возвращаются ввиде строк, вне зависимости от переданного типа.