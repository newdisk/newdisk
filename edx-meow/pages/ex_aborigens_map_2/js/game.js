var startEx = new StartEx();

function StartEx() {
	var cls = this;

	var game_width = 800,
			game_height = 720;

	var stage1,
		buttons_set = [
			{	x: 50, y: 20, w:134, h:65, cap: 'Балты'},
			{	x: 230, y: 20, w:134, h:65, cap: 'Западные\nславяне'},
			{	x: 408, y: 20, w:134, h:65, cap: 'Южные\nславяне'},
			{	x: 585, y: 20, w:134, h:65, cap: 'Восточные\nславяне'},
		],
		baskets_set = [
			{ x:234, y:120, txt_posY:100},
			{ x:108, y:265, txt_posY:80},
			{ x:67, y:405, txt_posY:110},
			{ x:228, y:114, txt_posY:190}
		];

	var right_answer = [ 0, 1, 2, 3],
			user_answer = [-1,-1,-1,-1];

	var font_style = {
		font: '18px Arial',
		fill: '#000000',
		align: 'center'
	}
	var font_style2 = {
		font: '16px Arial',
		fill: '#000000'
	}
	var cur_field_pos = {x:0,y:0 }

// colors
	var colorN = 0x9D9DBA // - grey
	var colorTrue = '#0eb50e'//'#7BAF7E' // - green
	var colorFalse = '#FF0000'//'#D16B56' // - red

	cls.game;
	cls.btn = [];

	cls.btn_repeat = [];
	cls.btn_check = [];
	cls.btn_show = [];
	cls.btn_zoom = [];

	cls.txt_field = [];
	cls.regions = [];
	cls.layers = [];

	cls.preload = function() {
		// console.log('preload')
		cls.game.load.pack('all_img', 'js/manifest.json', null, this);
	}

	cls.create = function() {
		// console.log('create')
		// поведение канвас при ресайзе
		cls.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		cls.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
		// cls.game.stage.disableVisibilityChange = true; // откючение автопаузы, true - откл

		// bg
		var gameBg = cls.game.add.bitmapData(cls.game.width,cls.game.height);
			gameBg.ctx.beginPath();
	    gameBg.ctx.rect(0,0, cls.game.width, cls.game.height);
	    gameBg.ctx.fillStyle = '#ffffff';
	    gameBg.ctx.fill();
	    gameBg.addToWorld();

	    // pause control
	    cls.game.input.onDown.add(cls.unpause, this);

		// layers
		cls.layers[0] = cls.game.add.group();
		cls.layers[1] = cls.game.add.group();
		cls.layers[2] = cls.game.add.group();

		// Level background
		stage1 = cls.game.add.sprite(0,100,'map');
		cls.layers[0].add(stage1)

		for (var i = 0; i < baskets_set.length; i++) {
			// create regions
			cls.regions[i] = cls.game.add.sprite(baskets_set[i].x, baskets_set[i].y, 'region_'+Number(i+1));
			cls.regions[i].marked = 0;
			cls.regions[i].tint = 0xeff9ee;
			cls.layers[0].add(cls.regions[i])

			// create text fields
			cls.txt_field[i] = cls.game.add.text(Math.floor(cls.regions[i].x + cls.regions[i].width / 2), baskets_set[i].y + baskets_set[i].txt_posY, buttons_set[i].cap, font_style);
			cls.txt_field[i].anchor.set(.5);
			cls.txt_field[i].alpha = 0;
			cls.txt_field[i].btnId = -1;
			cls.txt_field[i].fId = i;
			cls.txt_field[i].events.onDragUpdate.add(function(current){
				cls.updateDrag(current);
	    });
			cls.txt_field[i].events.onDragStop.add(function(current){
				cls.stopTextDrag(current);
			});
			cls.txt_field[i].events.onDragStart.add(function(current){
				cls.startTextDrag(current);
			});
			cls.layers[1].add(cls.txt_field[i])
			// create dragable buttons
			cls.btn[i] = cls.game.add.sprite(buttons_set[i].x, buttons_set[i].y, 'volk_'+Number(i+1));
			cls.btn[i].width = buttons_set[i].w;
			cls.btn[i].height = buttons_set[i].h;
			cls.btn[i].btnId = i;
			cls.btn[i].inputEnabled = true;
			cls.btn[i].input.useHandCursor = true;
			cls.btn[i].input.enableDrag();
			cls.btn[i].events.onDragUpdate.add(function(currentSprite){
				cls.updateDrag(currentSprite);
	    });
			cls.btn[i].events.onDragStop.add(function(currentSprite){
				cls.stopDrag(currentSprite);
	    });
	    cls.layers[2].add(cls.btn[i])
		}
		////////////////////////////////////////////////////////
		// hit areas
		var tmpX = cls.regions[0].x,
				tmpY = cls.regions[0].y;
		cls.regions[0].hitArea = new Phaser.Polygon([
			new Phaser.Point(363 - tmpX, 128 - tmpY),
			new Phaser.Point(287 - tmpX, 157 - tmpY),
			new Phaser.Point(262 - tmpX, 218 - tmpY),
			new Phaser.Point(239 - tmpX, 278 - tmpY),
			new Phaser.Point(253 - tmpX, 305 - tmpY),
			new Phaser.Point(294 - tmpX, 315 - tmpY),
			new Phaser.Point(321 - tmpX, 293 - tmpY),
			new Phaser.Point(317 - tmpX, 264 - tmpY),
			new Phaser.Point(335 - tmpX, 233 - tmpY),
			new Phaser.Point(357 - tmpX, 207 - tmpY),
			new Phaser.Point(366 - tmpX, 166 - tmpY),
			new Phaser.Point(358 - tmpX, 150 - tmpY),
			new Phaser.Point(360 - tmpX, 141 - tmpY)
		]);

		tmpX = cls.regions[1].x,
		tmpY = cls.regions[1].y;
		cls.regions[1].hitArea = new Phaser.Polygon([
			new Phaser.Point(239 - tmpX, 277 - tmpY),
			new Phaser.Point(247 - tmpX, 278 - tmpY),
			new Phaser.Point(234 - tmpX, 274 - tmpY),
			new Phaser.Point(229 - tmpX, 267 - tmpY),
			new Phaser.Point(174 - tmpX, 291 - tmpY),
			new Phaser.Point(152 - tmpX, 278 - tmpY),
			new Phaser.Point(113 - tmpX, 300 - tmpY),
			new Phaser.Point(117 - tmpX, 343 - tmpY),
			new Phaser.Point(134 - tmpX, 385 - tmpY),
			new Phaser.Point(128 - tmpX, 414 - tmpY),
			new Phaser.Point(163 - tmpX, 431 - tmpY),
			new Phaser.Point(216 - tmpX, 435 - tmpY),
			new Phaser.Point(241 - tmpX, 402 - tmpY),
			new Phaser.Point(286 - tmpX, 382 - tmpY),
			new Phaser.Point(286 - tmpX, 337 - tmpY),
			new Phaser.Point(292 - tmpX, 320 - tmpY),
			new Phaser.Point(262 - tmpX, 317 - tmpY),
			new Phaser.Point(239 - tmpX, 298 - tmpY)
		]);

		tmpX = cls.regions[2].x,
		tmpY = cls.regions[2].y;
		cls.regions[2].hitArea = new Phaser.Polygon([
			new Phaser.Point(163 - tmpX, 431 - tmpY),
			new Phaser.Point(128 - tmpX, 414 - tmpY),
			new Phaser.Point(91 - tmpX, 421 - tmpY),
			new Phaser.Point(77 - tmpX, 445 - tmpY),
			new Phaser.Point(92 - tmpX, 473 - tmpY),
			new Phaser.Point(118 - tmpX, 474 - tmpY),
			new Phaser.Point(152 - tmpX, 482 - tmpY),
			new Phaser.Point(264 - tmpX, 589 - tmpY),
			new Phaser.Point(268 - tmpX, 606 - tmpY),
			new Phaser.Point(295 - tmpX, 605 - tmpY),
			new Phaser.Point(341 - tmpX, 585 - tmpY),
			new Phaser.Point(354 - tmpX, 551 - tmpY),
			new Phaser.Point(419 - tmpX, 514 - tmpY),
			new Phaser.Point(429 - tmpX, 465 - tmpY),
			new Phaser.Point(394 - tmpX, 476 - tmpY),
			new Phaser.Point(335 - tmpX, 518 - tmpY),
			new Phaser.Point(294 - tmpX, 511 - tmpY),
			new Phaser.Point(212 - tmpX, 439 - tmpY)
		]);

		tmpX = cls.regions[3].x,
		tmpY = cls.regions[3].y;
		cls.regions[3].hitArea = new Phaser.Polygon([
			new Phaser.Point(405 - tmpX, 117 - tmpY),
			new Phaser.Point(366 - tmpX, 128 - tmpY),
			new Phaser.Point(363 - tmpX, 141 - tmpY),
			new Phaser.Point(369 - tmpX, 165 - tmpY),
			new Phaser.Point(367 - tmpX, 199 - tmpY),
			new Phaser.Point(356 - tmpX, 227 - tmpY),
			new Phaser.Point(326 - tmpX, 259 - tmpY),
			new Phaser.Point(330 - tmpX, 296 - tmpY),
			new Phaser.Point(324 - tmpX, 302 - tmpY),
			new Phaser.Point(292 - tmpX, 327 - tmpY),
			new Phaser.Point(291 - tmpX, 370 - tmpY),
			new Phaser.Point(288 - tmpX, 382 - tmpY),
			new Phaser.Point(281 - tmpX, 391 - tmpY),
			new Phaser.Point(249 - tmpX, 402 - tmpY),
			new Phaser.Point(232 - tmpX, 425 - tmpY),
			new Phaser.Point(263 - tmpX, 461 - tmpY),
			new Phaser.Point(320 - tmpX, 479 - tmpY),
			new Phaser.Point(427 - tmpX, 460 - tmpY),
			new Phaser.Point(507 - tmpX, 396 - tmpY),
			new Phaser.Point(503 - tmpX, 353 - tmpY),
			new Phaser.Point(530 - tmpX, 330 - tmpY),
			new Phaser.Point(560 - tmpX, 243 - tmpY),
			new Phaser.Point(536 - tmpX, 137 - tmpY),
			new Phaser.Point(418 - tmpX, 126 - tmpY)
		]);

		// create bottom buttons
		// background for btn as bitmap
		var bmd = cls.game.add.bitmapData(130,40);
		bmd.ctx.beginPath();
	    bmd.ctx.rect(0,0,150,40);
	    bmd.ctx.fillStyle = '#E8E8E8';
	    bmd.ctx.fill();

		cls.btn_repeat[0] = cls.game.add.sprite(75, 662, bmd)
		cls.btn_repeat[0].inputEnabled = true;
		cls.btn_repeat[0].input.useHandCursor = true;
		cls.btn_repeat[0].events.onInputDown.add(cls.restart)
		cls.btn_repeat[1] = cls.game.add.sprite(85, 669, 'repeat')
		cls.btn_repeat[2] = cls.game.add.text(115, 674, 'Повторить', font_style2)

		cls.btn_check[0] = cls.game.add.sprite(305, 664, bmd)
		cls.btn_check[0].events.onInputDown.add(cls.check_answer)
		cls.btn_check[1] = cls.game.add.sprite(315, 673, 'check')
		cls.btn_check[2] = cls.game.add.text(345, 674, 'Проверить', font_style2)

		cls.btn_show[0] = cls.game.add.sprite(535, 664, bmd)
		cls.btn_show[0].inputEnabled = true;
		// cls.btn_show[0].input.useHandCursor = true;
		// cls.btn_show[0].events.onInputDown.add(cls.show_answer)
		cls.btn_show[0].width = 175;
		cls.btn_show[1] = cls.game.add.sprite(545, 667, 'show_answer')
		cls.btn_show[2] = cls.game.add.text(585, 674, 'Показать ответ', font_style2)

		cls.btn_zoom[0] = cls.game.add.sprite(755, 575, 'zoom')
		cls.btn_zoom[0].inputEnabled = true;
		cls.btn_zoom[0].input.useHandCursor = true;
		cls.btn_zoom[0].events.onInputDown.add(goFull)
	}
	cls.update = function() {
	}
	cls.render = function() {
		// cls.game.debug.inputInfo(30, 100);
	}

	function goFull() {
	    if (cls.game.scale.isFullScreen) {
	        cls.game.scale.stopFullScreen();
	    } else {
	        cls.game.scale.startFullScreen(false); //true=antialiasing ON, false=antialiasing off
	    }
	}

	// функция проверяет было ли нажатие по кнопке «поторить» или «показать ответ» в режиме паузы
	cls.unpause = function() {
		if (cls.game.paused) {
			if (cls.btn_repeat[0].getBounds().contains(cls.game.input.x, cls.game.input.y)) {
				cls.restart();
			}
			if (cls.btn_show[0].getBounds().contains(cls.game.input.x, cls.game.input.y)) {
				cls.show_answer();
			}
		}
	}

	cls.show_answer = function() {
		for (var i = 0; i < buttons_set.length; i++) {
			cls.txt_field[i].setText(buttons_set[i].cap)
			cls.txt_field[i].inputEnabled = false;
			cls.txt_field[i].alpha = 1;
			cls.txt_field[i].addColor('#000000',0)
		}
	}
	cls.check_answer = function() {
		if (checkAreasMarks()) {
			cls.game.paused = true;

			var result = -1;
			for (var i = 0; i < user_answer.length; i++) {
				if (user_answer[i] != right_answer[i]) {
					result = 0;
					cls.txt_field[i].addColor(colorFalse,0)
				} else {
					cls.txt_field[i].addColor(colorTrue,0)
				}
			}
			if (result) {
				result = 100;
			}
			task.sendResult(result)
		}
	}

	cls.restart = function() {
		// console.log('restart')
		user_answer = [-1,-1,-1];

		if (!cls.game) {
			// console.log('no game => creating...')
			cls.game = new Phaser.Game(game_width, game_height, Phaser.AUTO, 'round', { preload: cls.preload, create: cls.create, update: cls.update, render: cls.render }, true);

		} else {
			cls.game.paused = false;
			cls.game.state.restart({
				 clearWorld:true
			});
		};
	};

	cls.stopDrag = function(sprite){
		// console.log('stopDrag')

		// check overlap
		for (var i = 0; i < cls.regions.length; i++) {
			if (cls.regions[i].hitArea.contains(cls.game.input.x - cls.regions[i].x, cls.game.input.y - cls.regions[i].y)){
				// console.log(i)
				// check if selected
				if (cls.regions[i].marked) {
					cls.btn[cls.txt_field[i].btnId].inputEnabled = true;
					cls.btn[cls.txt_field[i].btnId].alpha =1;
				}
				// прячем кнопку
				sprite.position.x = buttons_set[sprite.btnId].x
				sprite.position.y = buttons_set[sprite.btnId].y
				sprite.alpha = 0
				sprite.inputEnabled = false;

				cls.txt_field[i].setText(buttons_set[sprite.btnId].cap)
				cls.txt_field[i].btnId = sprite.btnId;
				cls.txt_field[i].inputEnabled = true;
				cls.txt_field[i].input.enableDrag();
				cls.txt_field[i].alpha = 1;
				// set answer
				user_answer[i] = sprite.btnId
				// console.log(user_answer)
				cls.regions[i].marked = 1;
				// если все объекты размещены, то кнопка проверить доступна
				if (checkAreasMarks()) {
					cls.btn_check[0].inputEnabled = true;
					cls.btn_check[0].input.useHandCursor = true;
				} else {
					cls.btn_check[0].inputEnabled = false;
				}
				cls.regions[i].tint = 0xeff9ee;

				break;
			}
			sprite.position.x = buttons_set[sprite.btnId].x
			sprite.position.y = buttons_set[sprite.btnId].y
		}
	};
	cls.startTextDrag = function(field) {
		cur_field_pos.x = field.x
		cur_field_pos.y = field.y
	}
	cls.stopTextDrag = function(field) {
		// console.log('stop drag text')
		// chek overlap
		var check_f = 0;
		for (var i = 0; i < cls.regions.length; i++) {
			if (cls.regions[i].hitArea.contains(cls.game.input.x - cls.regions[i].x, cls.game.input.y - cls.regions[i].y)) {

				// check if selected => change
				if (cls.regions[i].marked && i!=field.fId) {
					// console.log('marked')
					var tmp_txt = cls.txt_field[i]._text;
					// change txt fields
					cls.txt_field[i].setText(field._text);
					field.setText(tmp_txt)
					// change answer
					// console.log('field.fId =>', field.fId, cls.txt_field[i].fId)
					user_answer[field.fId] = cls.txt_field[i].btnId;
					// console.log('field.btnId=>',i, field.btnId)
					user_answer[i] = field.btnId;
					// console.log(user_answer)

					// change id
					var tmp_id = cls.txt_field[i].btnId;
					cls.txt_field[i].btnId = field.btnId;
					field.btnId = tmp_id;

					cls.regions[i].tint = 0xeff9ee;

					check_f = 1;
					break;
				} else {
					// console.log('not marked')
					cls.txt_field[i].setText(field._text);
					cls.txt_field[i].inputEnabled = true;
					cls.txt_field[i].input.enableDrag();
					cls.txt_field[i].btnId = field.btnId;
					cls.txt_field[i].alpha = 1;

					user_answer[field.fId] = -1;
					user_answer[i] = field.btnId;
					// console.log(user_answer)

					if (i!=field.fId) {
						field.setText('')
						field.inputEnabled = false;
					}

					cls.regions[i].tint = 0xeff9ee;
					cls.regions[i].marked = 1;
					cls.regions[field.fId].marked = 0;

					check_f = 1;
					break;
				}
			}
		}
		// переместили название и не попали ни в одну из областей
		if (!check_f) {
			field.setText('');
			field.inputEnabled = false;
			user_answer[field.fId] = -1;
			// показываем кнопку
			cls.btn[field.btnId].alpha = 1;
			cls.btn[field.btnId].inputEnabled = true;
			cls.regions[field.fId].marked = 0;
			// кнопка проверить не доступна
			cls.btn_check[0].inputEnabled = false;
		}
		field.x = cur_field_pos.x
		field.y = cur_field_pos.y
	};
	cls.updateDrag = function(sprite) {
		// check overlap
		var check_f = 0;
		for (var i = 0; i < cls.regions.length; i++) {
			if (cls.regions[i].hitArea.contains(cls.game.input.x - cls.regions[i].x, cls.game.input.y - cls.regions[i].y) && !check_f) {
				cls.regions[i].tint = 0xffdc66;
				check_f = 1;
			} else {
				cls.regions[i].tint = 0xeff9ee;
			}
		}
	};

	function checkAreasMarks() {
		for (var i = 0; i < cls.regions.length; i++) {
			if(!cls.regions[i].marked) {
				return false;
			}
		}
		return true;
	}
}
