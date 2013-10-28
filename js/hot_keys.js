/**
 *	Функционал горячих клавиш DeeX
 *
 *	21.02.2013
 *	@version 1
 *	@copyright BRANDER
 *	@author Deemon<a@dee13.ru>
 */

_.hot_keys=
{
	'ind':0,
	'binded':{},/*С - Ctrl; A - Alt; S - Shift; 'CAS' В этом порядке*/
	'active':true,
	'keyCodes':
	{
		8 :"BACKSPACE", 9 :"TAB", 13 :"ENTER",  19 :"PAUSE", 20 :"CAPS LOCK", 27 :"ESC",32:'SPACE', 33 :"PAGE UP", 34 :"PAGE DOWN", 35 :"END", 36 :"HOME", 37 :"LEFT ARROW", 38 :"UP ARROW", 39 :"RIGHT ARROW", 40 :"DOWN ARROW", 45 :"INSERT", 46 :"DELETE",
		48 :"0", 49 :"1", 50 :"2", 51 :"3", 52 :"4", 53 :"5", 54 :"6", 55 :"7", 56 :"8", 57 :"9", 65 :"A", 66 :"B", 67 :"C", 68:"D", 69 :"E", 70 :"F", 71 :"G", 72 :"H", 73 :"I", 74 :"J", 75 :"K", 76 :"L", 77 :"M", 78 :"N", 79 :"O", 80 :"P", 81 :"Q", 82 :"R", 83 :"S", 84 :"T", 85 :"U", 86 :"V", 87 :"W", 88 :"X", 89 :"Y", 90 :"Z",  93 :"SELECT KEY",
		96 :"NP0", 97 :"NP1", 98 :"NP2", 99 :"NP3", 100 :"NP4", 101 :"NP5", 102 :"NP6", 103:"NP7", 104 :"NP8", 105 :"NP9", 106 :"NP*", 107 :"NP+",
		109 :"NP-", 110 :"NP.", 111 :"NP/", 144 :"NUM LOCK", 145 :"SCROLL LOCK",
		186 :";", 187 :"=", 188 :",", 189 :"-", 190 :".", 191 :"/", 192 :"~", 219 :"[", 220 :"\\", 221 :"]", 222:"'",
		112 :"F1", 113 :"F2", 114 :"F3", 115 :"F4", 116 :"F5", 117 :"F6", 118 :"F7", 119 :"F8", 120 :"F9", 121 :"F10", 122 :"F11", 123 :"F12",
		'context':
		{
			16 :"SHIFT", 17 :"CTRL", 18 :"ALT",
		}
	},
	'_init':function(first)
	{
		if(first)
			$(document).on('keydown.hot_keys',_.hot_keys.use);
		else
		{
			this.active=true;
			this.binded={};
			this.ind=0;
		}
	},
	/*Включение \ отключение всех горячих клавиш*/
	'offOn':function(off)
	{
		if('boolean' != typeof off || off == this.active)
			this.active=!this.active;
	},
	/*Назначить клавишу*/
	'bind':function(hk,func,name)
	{
		if(!(hk in this.binded))
			this.binded[hk]={};
		if(arguments.length<3)
			name=this.ind++;
		this.binded[hk][name]=func;
		return name;
	},
	/*Дезактивировать сочетание*/
	'unbind':function(hk,name)
	{
		if(hk in this.binded && name in this.binded[hk])
			delete this.binded[hk][name];
	},
	/*Использование*/
	'use':function(ev)
	{
		var hk_o=_.hot_keys;
		if(!hk_o.active)
			return;
		var mods =(ev.ctrlKey?'C':'')+(ev.altKey?'A':'')+(ev.shiftKey?'S':'');
		if(mods!=='')
			mods+='+';
		if(!(ev.keyCode in hk_o.keyCodes))
			return;
		var hk=mods+hk_o.keyCodes[ev.keyCode];
			// elog(hk,'HOTKEY');
		var used=false;
		if( hk in hk_o.binded)
		{
			hk=hk_o.binded[hk];
			for(var i in hk)
				if(typeof hk[i]=='function')
				{
					elog(hk,'HOTKEY');
					hk[i]();
					used=true;
				}
		}
		return !used;
	}
};
