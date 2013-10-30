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
	'selected_section_o':false,
	'book_o':false,
	'chapters_o':false,
	'section_o':false,
	'chapter_o':false,
	'chapter':false,
	'_init_after':['m_win'],
	'_init':function()
	{

		$('._show_file_manager').click(function(){
			window.open('/fu/elfinder.html','pmw','scrollbars=0,top=0,left=0,resizable=1,width=1000,height=400');return false;
		});
		$( 'textarea._content' ).ckeditor();
		this.section_o=$('._sections').on('change','select',function(){
			_.test.getSection($(this));
		});
		this.book_o=$('fieldset.book').find('form').submit(function(){
			return _.test.validBook($(this));
		}).end();
		this.chapters_o=this.book_o
			.find('._chapters').find('ul').on('dblclick','li',function(){
				_.test._ajax($(this).data('id'),{'action':'load_chapter','desc':'Загрузка главы'/*,'sys':false,'params':false*/});
			}).sortable({'axis':'y'}).end();
		this.chapter_o=$('fieldset.chapter')
			.find('._save_chapter').click(this.saveChapter).end()
			.find('._remove_chapter').click(function(){
				_.test._ajax(_.test.chapter.id,{'action':'remove_chapter','desc':'Удаление главы'/*,'sys':false,'params':false*/});
			}).end();
		this.selected_section_o=$('._sections:first input:hidden');
		_.m_win.add({'index':'confirm','click':'._show_remove','data':{'content':'<p>Вы уверены, что хотите удалить выбранные учебники?</p><div class="i button red"> <label ><button class="_close"><span class="awico-ok"> Да, удалить</span></button></label> </div><div class="i button green"> <label ><button class="_close"> <span class="awico-ban-circle"> Нет, не удалять</span></button></label> </div>'}, /* 'class':'', 'content_prot':'modal_win'*/});
		_.m_win.win_obj.on('click.remove','.button.red',this.removeSelected);
		$('._add._book').click(function(){
			_.test.setBook();
		});
		$('._add_chapter').click(function(){
			_.test.setChapter();
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
		if(this.book_o.find('._sections input:hidden').val()=='')
		{
			_.mess.show('Прежде нужно выбрать раздел','error'/*,{'title':'','func':null,'c_delay':10}*/);
			return false;
		}
		_.loading.start('save_book','Идет сохранение учебника');
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
	'getSection':function(obj)
	{
		var parents=false;
		var p;
		var ajax=true;
		if(arguments.length!=0)
		{
			var val=obj.val();
			parents=[];
			var p_o=obj.parents('.select:first')
				.nextAll().remove().end();
			p=obj.parents('._sections');
			if(val=='-')
			{
				p_o=p_o.prev();
				val=p_o.length>0?p_o.find('select').val():'';
				ajax=false;
			}
			else
			{
				p_o.prevAll().find('select').each(function(){
					parents.push($(this).val());
				});
				parents.push(val);
			}
			p.find('input:hidden').val(val);
			if(p.hasClass('_book'))
			{
				this.book_o.find('._section_name').val(p_o.find('select :selected').text());
			}
			this.getData(10,0);
		}
		else
			p=this.section_o;
		if(ajax)
			this._ajax(parents,{'action':'get_section','desc':'Идет загрузка разделов','params':p/*,'sys':false*/});
		// this.book_o.hide();
		// this.chapter_o.hide();
	},
	'getData':function(limit,page)
	{
		this._ajax({'limit':limit,'page':page,'section':this.selected_section_o.val()},{'action':'get_data','desc':'Идет загрузка данных',/*,'sys':false,*/});

	},
	'setBook':function(data)
	{
		data=$.extend({
			'id':'new',
			'desc':'',
			'name':'',
			'status':'hidden',
			'image_path':'',
			'chapters':[],
		},data);

		;
		var c=this.chapters_o[(arguments.length==0)?'hide':'show']().find('ul').empty();
		for(var key in data.chapters)
		{
			var val=data.chapters[key];
			c.append('<li data-id="'+val.id+'"> <input type="hidden" name="_d[chapters][]" value="'+val.id+'"/><span>'+val.name+'</span></li>');

		}
		this.book_o.show()
			.find('._id').val(data.id).end()
			.find('._desc').val(data.desc).end()
			.find('._sections select:first').val('-').parents('.select').nextAll().remove().end().end().end()
			.find('._section').val(data.section).end()
			.find('._section_name').val(data.section_name).end()
			.find('._name').val(data.name).end()
			.find('._status').prop('checked',data.status=='hidden').end()
			.find('._image').html((data.image_path==''?'':'<img src="/images/site/'+data.image_path+'" />')).end()
			.find('input:file').replaceWith('<input type="file" name="image" />');
		this.chapter_o.hide();
	},
	'saveChapter':function()
	{
		for(var key in _.test.chapter)
		{
			if(key!=='id')
			_.test.chapter[key]=
				_.test.chapter_o.find('._'+key).val();
		}
		_.test.chapter.book_id=_.test.book_o.find('._id').val();
		_.test._ajax(_.test.chapter,{'action':'save_chapter','desc':'Сохранение главы'/*,'sys':false,'params':false*/});

	},
	'setChapter':function(data)
	{
		data=$.extend({
			'id':'new',
			'desc':'',
			'name':'',
			'video_link':'',
			'content':'',
			'tags':'',
		},data);
		this.chapter=data;
		this.chapter_o.show()
			.find('._desc').val(data.desc).end()
			.find('._name').val(data.name).end()
			.find('._video_link').val(data.video_link).end()
			.find('._tags').val(data.tags).end()
			.find('._content').val(data.content);
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
			e.params.append('<div class="i select"> <label> <select >'+options+' </select> </label> </div>');
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
			_.loading.stop('save_book');
			this.getData(10,0);
		}
		else if(e.action=='edit_book')
		{
			this.setBook(data);
		}
		else if(e.action=='load_chapter')
		{
			this.setChapter(data);
		}
		else if(e.action=='remove_chapter')
		{
			_.mess.show('Глава удалена','success'/*,{'title':'','func':null,'c_delay':10}*/);
			this.chapter_o.hide();
			this.chapters_o.find('[data-id='+this.chapter.id+']').remove();

		}
		else if(e.action=='save_chapter')
		{

			if(data===true)
			{
				this.chapters_o.find('ul li[data-id='+this.chapter.id+'] span').text(this.chapter.name);
				_.mess.show('Глава обновлена','success'/*,{'title':'','func':null,'c_delay':10}*/);
			}
			else
			{
				this.chapter.id=data;
				this.chapters_o.find('ul').append('<li data-id="'+data+'"><input type="hidden" name="_d[chapters][]" value="'+data+'"/><span>'+this.chapter.name+'</span></li>');
				_.mess.show('Глава добавлена','success'/*,{'title':'','func':null,'c_delay':10}*/);
			}

		}
		// elog([data,e],'data');
	}
}