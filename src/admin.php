<?php
$CONTENT=<<<HTML
<fieldset>
	<legend>Выбор раздела</legend>
	<div class="_sections">
	</div>

</fieldset>
<fieldset>
	<legend>Учебники</legend>
	<div class="table  books">
		<div class="title">
			<ul class="buttons">
				<li title="Удалить" class="_show_remove">
					<span class="awico-remove-sign"></span> Удалить выбранные книги
				</li>
				<li title="Добавить" class="_add _book">
					<span class="awico-plus-sign"></span> Добавить книгу
				</li>
			</ul>

		</div>

		<form class="_table"></form>
		<div class="bottom"></div>
	</div>
</fieldset>
<fieldset class="book" style="display:none">
		<legend>Учебник</legend>
			<form action="/ajax?_a=save_book&_i=x" method="post" enctype="multipart/form-data" target="ajax">
				<input type="hidden" class="_id" name="_d[id]" value="new">
				<div class="i text medium">
					<label>
						Название
						<span>
							<input type="text"  class="_name" name="_d[name]">
						</span>
					</label>
				</div>
				<div class="i text _section">
					<label>
						Раздел
						<span>
							<input type="hidden" name="_d[section]" >
							<input type="text" readonly="" value="-" >
						</span>
					</label>
				</div>

				<div class="i text">
				<div class="_image"><img src="" alt=""></div>
					<label>
						Картинка
						<span>
							<input type="file" name="image">
						</span>
					</label>

				</div>
				<div class="i checkbox">
					<label>
					<input type="checkbox" name="_d[hidden]" class="_status" value="1" checked="" ><span>Не отображать</span></label>
				</div>
				<br>
			<div class="i textarea medium">
				<label>
					Краткое содержание
					<span>
						<textarea name="_d[desc]" class="_desc"></textarea>
					</span>
				</label>
			</div>

				<div class="i button green">
					<label ><button type="submit">Сохранить</button></label>
				</div>
			</form>


</fieldset>
HTML;
