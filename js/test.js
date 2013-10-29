/**
 *	JS часть Тестового задания
 *
 *	23.10.2013
 *	@version 1
 *	@author Deemon<a@dee13.ru>
 */

_.test=
{
	'timer':false,
	'field_list':[['id',''],['name','Название'],['img','Миниатюра'],['desc','Краткое содержание'],['сtr_count','Количество глав'],['status','Не отображать'],],
	'table_o':false,
	'pager':false,
	'sections_o':false,
	'selected_section_o':false,
	'book_o':false,
	'_init_after':['m_win'],
	'_init':function()
	{
		this.sections_o=$('._sections').on('change','select',function(){
			_.test.getSection($(this));
		});
		this.book_o=$('fieldset.book').find('form').submit(function(){
			return _.test.validBook($(this));
		}).end();
		this.selected_section_o=$('._section');
		_.m_win.add({'index':'confirm','click':'._show_remove','data':{'content':'<p>Вы уверены, что хотите удалить выбранные учебники?</p><div class="i button red"> <label ><button class="_close"><span class="awico-ok"> Да, удалить</span></button></label> </div><div class="i button green"> <label ><button class="_close"> <span class="awico-ban-circle"> Нет, не удалять</span></button></label> </div>'}, /* 'class':'', 'content_prot':'modal_win'*/});
		_.m_win.win_obj.on('click.remove','.button.red',this.removeSelected);
		$('._add._book').click(function(){
			_.test.setBook();
		});
		this.pager=_.pager.get(function(){

			var data=_.pager.getLimit(_.test.pager);
			_.test.getData(data.limit,data.page);
		},{}).appendTo('.table .bottom');

		this.table_o=$('._table').on('click','td._edit span',function(){
			_.test.editBook($(this).parents('tr').find('input[name]').val());
		});
		this.getSection();


	},
	'validBook':function()
	{
		if(this.selected_section_o.find(':hidden').val()=='')
		{
			_.mess.show('Прежде нужно выбрать раздел','error'/*,{'title':'','func':null,'c_delay':10}*/);
			return false;
		}
	},
	'editBook':function(id)
	{
		this._ajax(id,{'action':'edit_book','desc':'Загрузка данных учебника'/*,'sys':false,'params':false*/});
	},
	'removeSelected':function()
	{
		var data=[];
		_.test.table_o.find('input[name]:checked').each(function(){
			data.push($(this).val());
		});
		if(data.length==0)
			_.mess.show('Ничего не выбрано','warning'/*,{'title':'','func':null,'c_delay':10}*/);
		else
		_.test._ajax(data,{'action':'remove_books','desc':'Удаление учебников'/*,'sys':false,'params':false*/});
	},
	'setSection':function(obj)
	{
		var value='',name='-';
		if(obj !=false)
		{
			value=obj.val();
			name=obj.find(':selected').text();
		}
		this.selected_section_o
			.find('input:hidden').val(value).end()
			.find('input:text').val(name);
	},
	'getSection':function(obj)
	{
		var parents=false;
		if(arguments.length!=0)
		{
			var val=obj.val();
			parents=[];
			var p_o=obj.parents('.select:first')
				.nextAll().remove().end();
			if(val=='-')
			{
				p_o=p_o.prev();
				this.setSection(p_o.length>0?p_o.find('select'):false);

				this.getData(0,1);
				return;
			}
			else
			{
				p_o.prevAll().find('select').each(function(){
					parents.push($(this).val());
				});
				parents.push(val);
				this.setSection(obj);
			}
		}
		this._ajax(parents,{'action':'get_section','desc':'Идет загрузка разделов'/*,'sys':false,'params':false*/});
		this.getData(10,0);
	},
	'getData':function(limit,page)
	{
		this._ajax({'limit':limit,'page':page,'section':this.selected_section_o.find('input:hidden').val()},{'action':'get_data','desc':'Идет загрузка данных',/*,'sys':false,*/});

	},
	'setBook':function(data)
	{
		data=$.extend({
			'id':'new',
			'description':'',
			'name':'',
			'status':'hidden',
			'image_path':'',
		},data)
		this.book_o.show()
			.find('._id').val(data.id).end()
			.find('._desc').val(data.description).end()
			.find('._name').val(data.name).end()
			.find('._status').prop('checked',data.status=='hidden').end()
			.find('._image').html((data.image_path==''?'':'<img src="/images/site/'+data.image_path+'" />')).end()
			.find('input:file').replaceWith('<input type="file" name="image" />');
	},
	'_response':function(data,e)
	{

		if(e.action=='get_data')
		{
			if(typeof data !=='object'|| !('fields' in data))
				return;
			// elog(e.params.fields,'e.params.fields');
			var table='<table><thead><tr>';
				for(var key in this.field_list)
				{
					var field=this.field_list[key];
					if(field[0]=='status')
					table+='<th><span></span></th>'
					table+='<th><span>'+field[1]+'</span></th>';
				}

			table+='</tr></thead><tbody>';
			for(var key in data.fields)
			{
				var row=data.fields[key];
				table+='<tr>';
				for(var key in this.field_list)
				{
					var field=this.field_list[key];
					var d=row[key];
					if(field[0]=='id')
						d='<div class="i checkbox"> <label> <input type="checkbox" name="id[]" value="'+d+'"> <span> </span> </label> </div>';
					else if(field[0]=='status')
					{

						d='<div class="i checkbox"> <label> <input type="checkbox" '+(d=='hidden'?'checked=""':'')+'> <span> </span> </label> </div>';
						table+='<td class="_edit "><span class="awico-edit" title="Редактировать"></span></td>';
					}
					else if(field[0]=='img')
						d='<img src="/images/thumb/'+d+'" />';

					table+='<td data-name="'+field[0]+'">'+d+'</td>';
				}
				table=='</tr>';
			}
			table+='</tbody></table>';
			this.table_o.html(table);
			_.pager.update(this.pager,data.total);
		}
		else if (e.action=='get_section')
		{
			var options='<option>-</option>';
			for(var key in data)
			{
				var val=data[key];
				options+='<option value="'+val.id+'">'+val.name+'</option>'
			}
			this.sections_o.append('<div class="i select"> <label> <select >'+options+' </select> </label> </div>');
		}
		else if(e.action=='remove_books')
		{
			_.mess.show('Выбранные учебники удалены'/*,{'title':'','func':null,'c_delay':10}*/);
			this.getData(10,0);
		}
		else if(e.action=='save_book')
		{
			if(data===true)
				_.mess.show('Страница обновлена','success'/*,{'title':'','func':null,'c_delay':10}*/);
			else
			{
				this.setBook({'id':data});
				_.mess.show('Страница добавлена','success'/*,{'title':'','func':null,'c_delay':10}*/);
			}
			this.getData(10,0);
		}
		else if(e.action=='edit_book')
		{
			this.setBook(data);
		}
		elog([data,e],'data');
	}
}