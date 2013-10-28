/**
 *	Всплывающие сообщения DEEX CMF
 *
 *	26.04.2013
 *	@version 1
 *	@copyright BRANDER
 *	@author Deemon<a@dee13.ru>
 *	@coder Maksud Nishanov
 */

_.mess =
{
	'def_params':
	{
		'c_delay':10,/*Время показа*/
		'type':'notice',/*notice, error, warning, success*/
		'text':'',/*Текст сообщения*/
		'title':false,/*Заголовок сообщения*/
		'func':null/*Функция которая будет вызвана при скрытии сообщения*/
	},
	'mess_arr':[],
	'messages_obj':false,
	'_init':function()
	{
		this.messages_obj=_.prot.get('messages').appendTo('body');
		this.show();
	},
	'type_modifer':
	{
		'error':'Ошибка',
		'notice':'Уведомление',
		'success':'Успех',
		'warning':'Предупреждение',
	},
	/*Показать добавленный ряд сообщений*/
	'show':function(message,type,params)
	{
		if(typeof message!='undefined')
			this.add(message,type,params);
		if(this.messages_obj.outerHeight()>$(window).height())
			return;
		if (!this.mess_arr.length) return false;
		message = this.mess_arr.shift();
		if (typeof message!='undefined')
		{
		   var mbox = _.prot.get(
		   		'messages.'+message.type,
			   	{'text':message.text,'title':message.title!=false?message.title:this.type_modifer[message.type]});
			mbox
				.find('._close').click(function(){
					_.mess.close(mbox,message);
				}).end()
				.appendTo(_.mess.messages_obj)
				.delay(300).css({'opacity': 0,'marginTop':'100px'}).animate({'opacity':'100','marginTop':'2px'}, 600, function(){_.mess.show();})
			;
			if(message.c_delay>0)
				setTimeout(function(){
					_.mess.close(mbox,message);
				},message.c_delay*1000);
		}
		return false;
	},
	'close':function (item,message)
	{
		item.animate({'opacity': '0'}, 600).delay(600)
			.animate({'height': '0px'}, 300).delay(300).remove();
		if (typeof message != 'undefined' && message.func != null)
			message.func();
		_.mess.show();
	},
	/*Добавить ряд сообщений к выводу*/
	'add':function(message,type,params)
	{
		if(typeof message !='object')
			message=[{'message':message,'type':type,'params':params}];
		for(var key in message)
		{
			var val=message[key];
			if (typeof val.message != 'string'|| val.message=='')
				continue;
			var defaults = $.extend({},this.def_params,val.params);
			if(typeof val.message !='undefined')
			defaults.text = val.message;
			if(typeof val.type !='undefined')
			defaults.type = val.type;
			if (defaults.type=='error' &&(typeof val.params == 'undefined' || typeof val.params.c_delay=='undefined'))
				defaults.c_delay=0;
			var m_index = this.mess_arr.push(defaults)-1;
			this.mess_arr[m_index]['m_index'] = m_index;
		}

	}
}





