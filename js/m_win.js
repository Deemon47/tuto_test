/**
 *	Скрипт модального окна DEEX CMF
 *
 *	08.04.2013
 *	@version 3.2
 *	@copyright BRANDER
 *	@author Deemon<a@dee13.ru>
 */
_.m_win=
{
	'_init_after':['hot_keys'],
	'win_obj':false,
	'shown':false,
	'time_out':300,
	'params_arr':{},
	'last_ind':0,
	'def_param':
	{
		'class':'',/*Название окна*/
		'content_prot':'modal_win',/*Название прототипа контента*/
		'click':false,/*Повесить событие клика на */
		'data':[],/*Данные для заполнения*/
		'index':false,/*Показывать окно по индексу (show(my_modal_win))*/
		'_tmp_data':{},
		'on_close':false,/*вызовет функцию при закрытии окна*/
	},
	'visible':false,
	'response_indexes':[],
	'win':false,
	/*Инициализация модуля*/
	'_init':function(first)
	{
		_.hot_keys.bind('ESC',this.close,'modal_win');
		this.win_obj=$('._modal_win').on('click.mw_close','._wrapper,._close',_.m_win.close);
		this.win=$(window).resize(_.m_win.resize);
		this.last_ind=0;
		/*tmp*/

		// _.m_win.add({'index':'dee','class':'dee'});_.m_win.show('dee',{'class':'deee','title':'asd','cont':'ololor'});
	},
	/*Показать окно*/
	'show':function(index,data)
	{
		if(_.m_win.visible)
			return;
		if(typeof data=='undefined')
			data={};
		if(typeof index!='string' && typeof index!='number' )
			index=$(this).data('mw_show');
		if(typeof index=='undefined' || typeof _.m_win.params_arr[index] =='undefined')
			return false;
		params=_.m_win.params_arr[index];
		data=$.extend({},params.data,data,params._tmp_data);
		var c=false;
		if('content' in data);
		{
			c=data.content;
			data.content='<i class="_content"></i>';
		}
		var prot=_.prot.get(params.content_prot,data);
		if(c!=false)
			prot.find('._content').after(c).remove();

		params._tmp_data={};
		var win=_.m_win.win_obj.attr('class','_modal_win '+params.class).show()
			.find('._win').hide()
				.find('._inner').empty().append(prot).end()
			.fadeIn(_.m_win.time_out);
		_.m_win.visible=index;
		if('scroller' in _)
			_.scroller.add(win);
		_.m_win.resize();
	},
	/*Выравнивание окна*/
	'resize':function()
	{
		if(!_.m_win.visible)
			return;
		var win=_.m_win.win_obj.find('._win');
		// var scroller=('scroller' in _)?win.find('>._scroller,._srl_padd').removeAttr('style').end().find('>._scroller'):false;
		var w={'w':win.outerWidth(),'h':win.outerHeight()};
		var css=
		{
			'maxWidth':_.m_win.win.width()-w.w+win.width(),
			'maxHeight':_.m_win.win.height()-w.h+win.height(),
			// 'marginLeft':'-'+Math.round(w.w/2)+'px',
			'marginTop':'-'+Math.round(w.h/2)+'px',
		};
		if(w.h==css.maxHeight)
			css['marginTop']=0;

		win.css(css);
		// if(false &&scroller&& scroller.length)
		// {
		// 	scroller.css({'maxWidth':win.width(),'maxHeight':win.height()-(win.find('>:not(._scroller)').outerHeight())});
		// 	_.scroller.resize(scroller);
		// }

	},
	/*Инициализация конкретного модального окна*/
	'add':function(params)
	{
		// elog(params,'params');
		params=$.extend({},this.def_param,params);
		// elog(params,'params1');
		if(false === params.index)
			params.index=this.last_ind++;
		if(false != params.click)
		{
			// elog($(params.click),'obj');
			$(params.click).data('mw_show',params.index).click(_.m_win.show);
		}
		delete(params.click);
		this.params_arr[params.index]=params;
		delete(params.index);
	},
	/*Закрыть окно */
	'close':function()
	{
		if(_.m_win.visible===false)
			return ;
		var index=_.m_win.visible;
		_.m_win.win_obj
			.find('._win').fadeOut(_.m_win.time_out).delay(_.m_win.time_out).end()
			.hide();
		if(typeof _.m_win.params_arr[index].on_close=='function')
			_.m_win.params_arr[index].on_close(index);
		_.m_win.visible=false;
	}
};
