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
	'field_list':[['id',''],['name','Название'],['img','Миниатюра'],['desc','Краткое содержание'],['сtr_count','Количество глав'],['edit',''],['status','Не отображать'],],
	'table_o':false,
	'pager':false,
	'sections_o':false,
	'selected_section':false,
	'_init_after':['m_win'],
	'_init':function()
	{
		this.sections_o=$('._sections').on('change','select',function(){
			_.test.getSection($(this));
		});
		_.m_win.add({'index':'confirm','click':'._show_remove','data':{'content':'<p>Вы уверены, что хотите удалить выбранные учебники?</p><div class="i button red"> <label ><button class="_close"><span class="awico-ok"> Да</span></button></label> </div><div class="i button green"> <label ><button class="_close"> <span class="awico-ban-circle"> Отмена</span></button></label> </div>'}, /* 'class':'', 'content_prot':'modal_win'*/});
		_.m_win.win_obj.on('click.remove','.button.red',this.removeSelected);
		this.pager=_.pager.get(function(){

			var data=_.pager.getLimit(_.test.pager);
			_.test.getData(data.limit,data.page);
		},{}).appendTo('.table .bottom');

		this.table_o=$('._table');
		this.getSection();


	},
	'removeSelected':function()
	{
		elog(_.test.table_o,'');
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
				this.selected_section=(p_o.length>0)?p_o.find('select').val():false;
				this.getData(0,1);
				return;
			}
			else
			{
				p_o.prevAll().find('select').each(function(){
					parents.push($(this).val());
				});
				parents.push(val);
				this.selected_section=val;
			}
		}
		this._ajax(parents,{'action':'get_section','desc':'Идет загрузка разделов'/*,'sys':false,'params':false*/});
		this.getData(0,1);
	},
	'getData':function(limit,page)
	{
		this._ajax({'limit':limit,'page':page},{'action':'get_data','desc':'Идет загрузка данных',/*,'sys':false,*/});
	},
	'_response':function(data,e)
	{

		if(e.action=='get_data')
		{
			elog(e.params.fields,'e.params.fields');
			var table='<table><thead><tr>';
				for(var key in this.field_list)
				{
					var field=this.field_list[key];
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
					data=row[key];
					if(field[0]=='id'||field[0]=='status')
						data='<div class="i checkbox"> <label> <input type="checkbox"></label> </div>';
					else if(field[0]=='edit')
					{
						data='<span class="_edit awico-edit" title="Редактировать"></span>';
					}

					table+='<td data-name="'+field[0]+'">'+data+'</td>';
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
		elog([data,e],'data');
	}
}