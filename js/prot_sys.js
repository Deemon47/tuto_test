_.prot.add({'file_man':'<button data-index="#index#" data-prot="fm_button" class="show-file-m">#text#</button><ul data-prot="fm_browser" class="file-m-browser"><li data-item="entry" data-path="#relpath#" data-isdir="#isdir#" class="file-m-entry #type#">#text#</li></ul><ul data-prot="fm_selector" class="file-m-selector"><li data-item="entry" data-path="#relpath#" data-isdir="#isdir#" class="file-m-entry #type#">#text#</li></ul><div data-prot="fm_uploader" class="file-m-wrap-uploader"><div class="upl-toolpanel">#switcher#<input type="file" name="file" multiple="multiple" class="upl-file-field" /><button class="upl-upload">Upload to Server</button><button class="upl-clear">Empty List</button></div><div class="upl-file-container">#file_list#</div></div><ul data-prot="fm_file_list" class="upl-file-list">#items#<li data-item="entry" class="file-item"><span class="fmdel">x</span><div class="fname">#filename#</div><div class="progress">#percent#%</div></li></ul><li data-prot="fm_file_item" class="file-item"><span class="fmdel">x</span><div class="fname">#filename#</div><div class="progress">#percent#%</div></li><div data-prot="fm_wrapper" class="file-m-wrapper"><div class="file-m-wrap-browser"><div class="file-m-toolpanel"><button class="file-m-mkdir">#mkdir_title#</button><input type="text" id="file-m-new-folder" value="newfolder" /></div>#browser#</div><div class="file-m-wrap-selector"><div class="file-m-toolpanel">Selected Files</div>#selector#</div>#uploader#</div><select data-prot="fm_switcher" class="upl-selectbox">#options#<option value="#value#" data-item="option">#text#</option></select>',
'form':'<form method="post">#data#<h1 data-prot="h1">#text1#</h1><h2 data-prot="h2">#text#</h2><h3 data-prot="h3">#text#</h3><h4 data-prot="h4">#text#</h4><h5 data-prot="h5">#text#</h5><h6 data-prot="h6">#text#</h6><ul data-prot="ul" class="list"><li data-item="item">#text#</li></ul><p data-prot="p">#text#</p><div data-prot="input" class="i text"><label>#title#<span><input type="text" value="#value#" name="#name#" /></span></label></div><div data-prot="pass" class="i text"><label>#title#<span><input type="password" value="#value#" name="#name#" /></span></label></div><div data-prot="textarea" class="i textarea"><label>#title#<span><textarea name="#name#">#value#</textarea></span></label></div><div data-prot="button" class="i button"><label><button type="#type#">#text#</button></label></div><div data-prot="checkbox" class="i checkbox"><label><input type="checkbox" name="#name#" value="#value#" /><span>#title#</span></label></div><div data-prot="select" class="i select"><label>#title#<select name="#name#">#options#<option value="#val#" data-item="option">#text#</option></select></label></div><div data-prot="radio" class="i radio"><label><input type="radio" name="#name#" value="#value#" /><span>#title#</span></label></div><hr data-prot="hr" /><fieldset data-prot="group"><legend>#title#</legend>#data#</fieldset></form>',
'loading':'<style>._loading{position:fixed;top:0;left:0;font-size:60px} ._loading img{width:100px}</style><div class="_loading"><img src="/images/DeeX-anim.gif" />#text#</div>',
'login':'<style>._login{width:250px;margin:auto;}</style><form f_name="login" sys="1" method="post" class="_login"><input type="text" name="name" />Логин<br /><input type="text" name="pass" />Пароль<br /><input type="text" name="long[name][very]" /><select name="arr[]" multiple="multiple"><option value="1">1</option><option value="2">1</option></select><p class="_message"></p><button type="submit">Войти</button></form>',
'main_menu':'<style></style><div class="_menu"></div>',
'messages':'<div class="messages"><div data-prot="notice" class="message"><div class="awico-info-sign title">#title#<span class="close _close"><span class="awico-remove"></span></span></div><p>#text#</p></div><div data-prot="error" class="message error"><div class="awico-exclamation-sign title">#title#<span class="close _close"><span class="awico-remove"></span></span></div><p>#text#</p></div><div data-prot="warning" class="message warning"><div class="awico-warning-sign title">#title#<span class="close _close"><span class="awico-remove"></span></span></div><p>#text#</p></div><div data-prot="success" class="message success"><div class="awico-thumbs-up title">#title#<span class="close _close"><span class="awico-remove"></span></span></div><p>#text#</p></div></div>',
'modal_win':'<div class="title">#title#<span class="_close red"><i class="awico-remove"></i></span></div><div class="content">#content#</div>',
'pager':'<p class="limit _info">Выводить по<input type="text" class="_limit" /></p><span class="pager"><span class="awico-arrow-left _prev">&nbsp;Предыдущая</span><span data-prot="num">#text#</span><input type="text" class="_current" /><span class="_next">Следущая&nbsp;<i class="awico-arrow-right"></i></span></span>',
'progress':'<div class="progress"><div class="progress-inner"><div class="title"><div class="procent"><span class="_procent"></span>%</div><span class="_title">#title#</span></div><div class="line-wrap"><div class="line _line"></div></div></div></div>',
'scroll_bars':'<style>._vert_bar{width:20px;border:solid 1px green;} ._horiz_bar{height:20px;border:solid 1px green;} ._vert_bar ._drag{width:100%;background:green; height:20px} ._horiz_bar ._drag {height:100%;background:green; width:20px}</style><div class="_vert_bar"><div class="_drag"></div></div><div class="_horiz_bar"><div class="_drag"></div></div>',
'scroller':'<style>._vert_panel{height:20px;border:solid 1px green;} ._horiz_panel{width:20px;border:solid 1px green;} ._horiz_panel ._drag {width:100%;background:green; height:20px} ._vert_panel ._drag{height:100%;background:green; min-width:30px;}</style><div class="_vert_panel"><div class="_drag"></div></div><div class="_horiz_panel"><div class="_drag"></div><div class="arrrow"></div></div>',
'table_m':'<div class="table _table_m"><div class="title"><h3>#title#</h3><ul class="buttons"><li title="Добавить" class="_add"><span class="awico-plus-sign"></span></li><li title="Редактировать" class="_edit"><span class="awico-pencil"></span></li><li title="Удалить" class="_delete"><span class="awico-remove-sign"></span></li><li title="Сортировать" class="_save_sort"><span class="awico-random"></span></li><li title="Фильтр" class="_sh_filter"><span class="awico-filter"></span></li><li title="Экспорт" class="_export"><span class="awico-download-alt"></span></li></ul></div>#table_place#<div class="bottom">#pager_place#</div></div>',
'table_man':'<table class="_tm"><thead><tr><td class="_tm_title">#title#</td><td colspan="100" class="_tm_tools"><ul class="_buttons"><li title="Добавить" class="_add"><span class="awico-plus-sign"></span></li><li title="Редактировать (F2-сохранить все изменения, ESC-отменить изменения)" class="_edits"><span class="awico-pencil"></span></li><li title="Редактировать (подробно)" class="_edit"><span class="awico-th-list"></span></li><li title="Удалить" class="_delete"><span class="awico-remove-sign"></span></li><li title="Дублировать" class="_duplicate"><span class="awico-share"></span></li><li title="Экспорт в Excel" class="_export"><span class="awico-download-alt"></span></li></ul></td></tr></thead><tbody></tbody><tfoot><tr><td colspan="100" class="pager-wrap"></td></tr></tfoot></table>',
'templ':'<div calss="templ"><fieldset data-prot="place" class="place"><legend>Положение #name#</legend><div class="_block_list"></div></fieldset><fieldset data-prot="block" class="block"><legend class="_handle">Блок #name#<span title="Редактировать параметры" class="_edit"><i class="awico-edit"></i></span><span title="Удалить блок и вложенные" class="_remove"><i class="awico-remove-sign"></i></span><span title="Свернуть/развернуть" class="_show_hide"><i class="a awico-resize-vertical"></i></span></legend><div class="_places"></div></fieldset></div>',
'tooltip':'<div class="tooltip"><p>#text#</p><span class="dot _dot"></span></div>',
'value_selector':'<div data-prot="selected" class="value-selector i"><div>#title#<span class="list"><span data-item="selected" class="item">#text#</span></span></div></div><div data-prot="values" class="search"><div class="i text full"><span><input type="text" autocomlite="off" class="_search" /><i class="awico-search"></i></span></div><ul><li data-item="val" data-val="#val#">#text#</li></ul></div>',
});