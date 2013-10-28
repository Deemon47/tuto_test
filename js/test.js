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
	'_init':function()
	{
		this.sections_o=$('._sctions').change(function(){
			_.test.getSection($(this));
		});

		this.pager=_.pager.get(function(){

			var data=_.pager.getLimit(_.test.pager);
			_.test.getData(data.limit,data.page);
		},{}).appendTo('.table .bottom');

		this.table_o=$('._table');
		this.getSection();


	},
	'getSection':function(obj)
	{
		var parents=[];
		if(argumetns.length!=0)
		{
			var o=$(this).parents('[data-section]:first');
			parents.push(o.data('section'))
			o.prevAll().each(function(){
				parents.unshift($(this).data('section'));
			});
		}
		this._ajax(parent,{'action':'get_section','desc':'Идет загрузка разделов'/*,'sys':false,'params':false*/});
		;
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
			this.found_o.val(data.total);
			_.pager.update(this.pager,data.total);
		}
		else if (e.action=='get_section')
		{

		}
		elog([data,e],'data');
	}
}