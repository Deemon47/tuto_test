<?php
$opt=<<<HTML

	<options>1</options>
	<options>2</options>
	<options>3</options>
	<options>4</options>
HTML;

$CONTENT=<<<HTML
<fieldset>
	<legend>Выбор раздела</legend>
	<div class="_sections">
	<div class="i select" data-section="1"> <label> <select > <?=$opt?></select> </label> </div>
	<div class="i select" data-section="2"> <label> <select > <?=$opt?> </select> </label> </div>
	<div class="i select" data-section="3"> <label> <select > <?=$opt?> </select> </label> </div>
	<div class="i select" data-section="4"> <label> <select > <?=$opt?> </select> </label> </div>
	</div>

</fieldset>
<fieldset>
	<legend>Настройка вывода</legend>



	<div class="i button  _update_fields">
		<label ><button>Обновить список полей <i class="awico-refresh"></i></button></label>
	</div>
	<div class="i button green _show">
		<label ><button>Вывести <i class="awico-ok"></i></button></label>
	</div>

	<br>
	<br>
	<div class="table">
	<div class="title">
		<h3>Полученные резюме</h3>

		<ul class="buttons">

		</ul>

	</div>

	<div class="_table"></div>
	<div class="bottom"></div>
</fieldset>
HTML;
