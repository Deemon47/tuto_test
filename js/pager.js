/**
 *	Постраничная навигация DEEX CMF
 *
 *	20.05.2013
 *	@version 1
 *	@copyright BRANDER
 *	@author Deemon<a@dee13.ru>
 */

_.pager=
{

	'pagers':[],
	'_def_params':
	{
		'one_side_links_count':2,
		'on_change_func':false,//
		'func_data':false,

		'limit':10,
		'max_limit':1000,
		'prot':'pager',
		'total_count':0,
	},
	'_init_after':['page'],
	'_init':function()
	{

	},
	/*Получить jq объект pager для размещения в верстке*/
	'get':function(func,params)
	{
		params=$.extend({},this._def_params,params);
		params.on_change_func=func;
		var ind=this.pagers.push(params)-1;
		var obj=_.prot.get(params.prot).data('pager',ind);
		obj.on('click.pager','._prev,[data-prot=num],._next',function(){
			var obj=$(this);
			_.pager.calculate(obj,(obj.data('prot')=='num'?'num':(obj.hasClass('_next')?'next':'prev')));
			return false;
		}).on('change.pager','._current',function(){
			_.pager.calculate($(this),'current');

		}).on('change.pager','._limit',function(){
			_.pager.calculate($(this),'limit');
		});
		params.obj=
		{
			'pager':obj,
			'limit':obj.find('._limit'),
			'current':obj.find('._current'),
			'prev':obj.find('._prev'),
			'next':obj.find('._next'),
		};
		return obj;
	},
	'getLimit':function(obj)
	{
		var ind =obj.data('pager');
		var state=_.page.getState('pag',ind);
		var params = this.pagers[ind];
		if(state==null)
			state=[1,params.limit*1];
		this.validate(state,params);
		return {'page':(state[0]-1),'limit':state[1]};
	},
	'validate':function(state,params)
	{
		if(isNaN(state[0]*=1))
			state[0]=1;
		if(isNaN(state[1]*=1))
			state[1]=params.limit;
		if(state[1]>params.max_limit)
			state[1]=params.max_limit;
	},
	/*Переформирует навигацию, устанавливая значения из состояния в ссылке или при изменения параметров выбранной страницы, лимита*/
	'calculate':function(obj,type)
	{
		var ind=(arguments.length==1||type=='update')
			?obj.data('pager')
			:obj.parents('[data-pager]').data('pager');
		var params=_.pager.pagers[ind];
		var state=_.page.getState('pag',ind);
		if(state==null)
			state=[1,params.limit*1];
		var last_state=[state[0],state[1]];
		switch(type)
		{
			case 'num':
				state[0]=obj.text();
				break;
			case 'next':
				state[0]++;
				break;
			case 'prev':
				state[0]--;
				break;
			case 'current':
				state[0]=obj.val();
				break;
			case 'limit':
				state[1]=obj.val();
				break;
		}
		this.validate(state,params);
		var pages_count=(params.total_count)?Math.ceil(params.total_count/state[1]):1;
		if(state[0]<1)
			state[0]=1;
		if(state[0]>pages_count)
			state[0]=pages_count;
		_.page.setState((state[0]==1 && state[1]==params.limit)?null:state,'pag',ind);

		params.obj.limit.val(state[1]);
		params.obj.current.val(state[0]);
		/*Если инициализация или данные изменены запускается пользовательская функция*/
		if(type=='update' || last_state[0]!=state[0] || last_state[1]!=state[1])
		{
			if(type!='update' && typeof params.on_change_func=='function')
				params.on_change_func(params.func_data);
			params.obj.pager.find('[data-prot=num]').remove();
			var links=this.getLinks(pages_count,state[0],params.one_side_links_count);
			var data=$();
			for(var key in links)
			{
				if(isNaN(key))
					break;
				if(links[key])
				{
					params.obj.prev.after(data);
					data=$();
				}
				else
					data=data.add(_.prot.get('pager.num',{'text':key}));
			}
			if(data.length)
				params.obj.next.before(data);
			params.obj.next[links['next']]();
			params.obj.prev[links['prev']]();

		}

	},
	/*Расчитать массив ссылок*/
	'getLinks':function(pages_count,curr_num,one_side_links_count)
	{
		//Общее количество ссылок
		var links_count=one_side_links_count*2+1;
		//Индекс текущей страницы
		var current_index=curr_num-1;
		//Ссылки
		var links_arr={};
		if(pages_count>1)
		{
			//всех страниц меньше чем нужно ссылок
			if(pages_count<=links_count)
				for(var i=0;i<pages_count;i++)
					links_arr[(i+1)]=(current_index==i);
			else
			{
				//Ближайшие ссылки слева
				if(curr_num>one_side_links_count)
					for(i=current_index-one_side_links_count;i<current_index;i++)
						links_arr[i+1]=false;
				else
					for(i=0;i<current_index;i++)
						links_arr[i+1]=false;
				//Текущая страница
				links_arr[curr_num]=true;
				//Ближайшие ссылки справа
				if(pages_count>curr_num)
				{
					var c=(pages_count>current_index+one_side_links_count)
						?curr_num+one_side_links_count
						:pages_count;
					for(i=curr_num;i<c;i++)
						links_arr[i+1]=false;
				}
			}
			//Предыдущая страница
			links_arr['prev']=(current_index != 0)?'show':'hide';
			//Следующая страница
			links_arr['next']=(curr_num <pages_count)?'show':'hide';
		}
		//Ссылка на первую страницу в случае если не верна указан номер страницы
		else
		{
			links_arr={'prev':'hide','next':'hide'};
			if(curr_num!=1) links_arr[1]=false;
		}
		return links_arr;
	},

	/*Обновить объект*/
	'update':function(obj,total_count)
	{
		var params=this.pagers[obj.data('pager')];
		params.total_count=total_count;
		this.calculate(obj,'update');
	}

}