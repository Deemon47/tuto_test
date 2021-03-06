<?php
$CONTENT=<<<HTML


<div class="i button _show_file_manager">
	<label ><button type="button">Файловый менеджер</button></label>
</div>
<fieldset>
	<legend><i class="awico-folder-open"></i> Выбор раздела</legend>
	<div class="_sections">
		<input type="hidden">
	</div>

</fieldset>
<fieldset>
	<legend><i class="awico-list-alt"></i> Учебники</legend>
	<div class="table  books">
		<div class="title">
			<ul class="buttons">
				<li title="Удалить" class="_show_remove">
					<span class="awico-remove-sign"></span> Удалить выбранные учебники
				</li>
				<li title="Добавить" class="_add _book">
					<span class="awico-plus-sign"></span> Добавить учебиник
				</li>
			</ul>

		</div>

		<form class="_table"></form>
		<div class="bottom"></div>
	</div>
</fieldset>

<fieldset class="book" style="display:none">
		<legend><i class=" awico-book"></i> Учебник</legend>
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
				<br>
				<div class="i text ">
					<label>
						Выбранный раздел
						<span>
							<input type="text"  class="_section_name" readonly="" value="-" >
						</span>
					</label>
				</div>
				<h3>изменить</h3>
				<div class="_sections _book"><input type="hidden" name="_d[section]" class="_section"></div>

				<div class="i text medium">
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

				<fieldset class="_chapters">
					<legend><i class="awico-tasks"></i> Главы</legend>
					<ul class="list num">

					</ul>
					<p class="awico-question-sign"> Для сортировки потяните название главы, для редактирования - двойной клик</p>
					<div class="i button _add_chapter">
						<label ><button type="button">Добавить главу <i class="awico-plus-sign"></i></button></label>
					</div>
				</fieldset>

				<div class="i button green">
					<label ><button type="submit">Сохранить учебиник <i class="awico-ok-sign"></i></button></label>
				</div>
			</form>
</fieldset>
<fieldset class="chapter" style="display:none" >
	<legend><i class="awico-file"></i> Глава</legend>
		<div class="i text medium">
			<label>
				Название
				<span>
					<input type="text"  class="_name" name="_d[name]">
				</span>
			</label>
		</div><div class="i text">
			<label>
				Ссылка на видео
				<span>
					<input type="text"  class="_video_link" name="_d[_video_link]">
				</span>
			</label>
		</div>
		<div class="i textarea">
			<label>
				Краткое содержание
				<span>
					<textarea name="_d[desc]" class="_desc"></textarea>
				</span>
			</label>
		</div>
		<div class="i text">
			<label>
				Теги
				<span>
					<input type="text"  class="_tags" name="_d[video]">
				</span>
			</label>
		</div>
		<div class="i full">
			<label>
				Cодержание
				<textarea name="_d[content]" class="_content" ></textarea>

			</label>
		</div>
		<div class="i button green ">
			<label ><button class="_save_chapter">Сохранить главу <i class="awico-ok-sign"></i></button></label>
		</div>
		<div class="i button red ">
			<label ><button class="_remove_chapter">Удалить главу <i class="awico-remove-sign"></i></button></label>
		</div>



</fieldset>
HTML;
