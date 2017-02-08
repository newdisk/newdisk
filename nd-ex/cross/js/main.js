var startEx = new StartEx();

function StartEx() {
	var cls = this;

	cls.cells=[];
	cls.timer;
	// cls.isTouchDevice = 'ontouchstart' in document.documentElement;

	var game_width,
		game_height;

	var game;

	var stage1;
	var cross_cell_width = 50,
		cross_cell_height = 50;
	var load_text,
		text = '';
	var offsetX = 0,
		offsetY = 0;
	var words = [
		// {
		// 	word: 'правила',
		// 	orientation: 'h',	// h, v
		// 	startX: 2,
		// 	startY: 0,
		// 	number: '1',
		// 	numberPos: 4  		// 1- top, 2 - right, 3 - bottom, 4 - left
		// }
	];
	var right_answer = [],
		back=[];
	var changeResult = [];
	var storedWord = '';
	var position,
		wordLength,
		isOnText = false;
	var allInputs;

	var iFocus = {staus:false, obj:''},
		iBlur = {staus:true, obj:''};
	var lastX,
		lastY;
	var pxRate = window.devicePixelRatio;
	// console.log('px rate',pxRate)
	// Start action functions
	function preload() {
		// console.log('preload')
		game.load.pack('all_img', 'js/manifest.json', null, this);

		//game.load.spritesheet('btn_up', 'img/go.png', 358, 292)
	}

	function create() {
		// console.log('create')
		// console.log(cls.isTouchDevice)
		game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		game.stage.disableVisibilityChange = true; // disable pause on focus left
		Phaser.Canvas.setTouchAction(game.canvas, "auto");	// Ebable to scroll canvas container
		game.input.touch.preventDefault = false;			// Ebable to scroll canvas container

		cls.timer = game.time.create(false); // create timer for disable multiple focus
		// Level background
		
		for (var i = 0; i < words.length; i++) {
			
			var x = words[i].startX;
			var y = words[i].startY;

			words[i].word = words[i].word.toUpperCase();

			// определяем и выставляем где будет находиться относительно первой ячейки номер слова
			switch (words[i].numberPos) {
				case 1:
					posX = offsetX+(x+1)*(cross_cell_width+3) + (cross_cell_width+3)/2 - 5;
					posY = offsetY+(y+1)*(cross_cell_height+3) - 20;
					break;
				case 2:
					posX = offsetX+(x+1)*(cross_cell_width+3) + (cross_cell_width+3) + 3;
					posY = offsetY+(y+1)*(cross_cell_height+3) + (cross_cell_height+3)/2 - 8;
					break;
				case 3:
					posX = offsetX+(x+1)*(cross_cell_width+3) + (cross_cell_width+3)/2 - 5;
					posY = offsetY+(y+1)*(cross_cell_height+3) + (cross_cell_height+3) + 3;
					break;
				case 4:
					posX = offsetX+(x+1)*(cross_cell_width+3) - 14;
					posY = offsetY+(y+1)*(cross_cell_height+3) + (cross_cell_height+3)/2 - 10;
					break;
			}
			var text = game.add.text(posX,posY, words[i].number ,{font: '16px Arial', fill: '#DA091F'});

			for (var j = 0; j < words[i].word.length; j++) {

				if (back[y] == undefined) {
					back[y] = [];
				}
				back[y][x] = game.add.sprite(offsetX+(x+1)*(cross_cell_width+3), offsetY+(y+1)*(cross_cell_height+3), 'box');
				back[y][x].width = cross_cell_width;
			    back[y][x].height = cross_cell_height;
					
				if (right_answer[y] == undefined) {
					right_answer[y] = [];
				}
				right_answer[y][x] = words[i].word[j];

				if (cls.cells[y] == undefined) {
					cls.cells[y] = [];
				}
				cls.cells[y][x] = createInput(offsetX+(x+1)*(cross_cell_width+3), offsetY+(y+1)*(cross_cell_height+3), words[i].word[j], y, x)

				if (words[i].orientation == 'h') {
					x++;
				} else {
					y++;
				}
			}
		}
		allInputs = $('input');
	}


	 cls.inputFocus = function(sprite) {
	 	// sprite.input.enabled = false
	 	if(!cls.timer.running) {
			sprite.canvasInput.focus();
			cls.timer.add(200, function() { cls.timer.stop();})
			cls.timer.start();
	 	}
		
	}

	function createInput(x,y, leter, i,j) {
		//console.log(x,y, leter, i,j)
		var bmd = game.add.bitmapData(cross_cell_width,cross_cell_height);
		var myInput = game.add.sprite(x, y, bmd);
		// console.log(bmd.canvas)
		myInput.canvasInput = new CanvasInput({
			canvas: bmd.canvas,
			fontSize: 24,
			fontFamily: 'Arial',
			fontColor: '#212121',
			fontWeight: 'bold',
			value: ' ', // leter,  // set value to variable «leter» to see leters in boxes
			width: 28,
			height:28,
			padding: 10,
			backgroundColor: 'rgba(0, 0, 0, 0)',
			borderWidth: 0,
			borderColor: false,
			borderRadius: 0,
			onkeyup: function(){onText(this)},
			onblur: function(){onBlur(this)},
			onfocus: function(){onFocus(this)},
			boxShadow: false,//'1px 1px 0px #fff',
			innerShadow: '0px 0px 5px rgba(0, 0, 0, 0)'
	    });
	    myInput.inputEnabled = true;
	    myInput.input.useHandCursor = true;
	    myInput.events.onInputUp.add(cls.inputFocus, this);

	    myInput.canvasInput.cellsId = {x:j, y:i}

	    return myInput;
	}
	/**
	 * Callback on char input
	 */
	function onText (obj) {
		// console.log('onText', storedWord)
		// console.log('change',obj.cellsId)

		isOnText = true;

		obj.value(obj.value().toUpperCase())
		if (obj.value().length > 1) {
			obj.value(obj.value().slice(-1))
		}

		// реализуем переход к следующей ячейке

		wordLength = storedWord.word.length;
		if (storedWord.orientation == 'h') {
			position = (wordLength + obj.cellsId.x) - (wordLength + storedWord.startX)+1;
		} else {
			position = (wordLength + obj.cellsId.y) - (wordLength + storedWord.startY)+1;
		}
		// console.log(position)
		if (position < wordLength) {
			if (storedWord.orientation == 'h') {
				cls.cells[obj.cellsId.y][obj.cellsId.x+1].canvasInput.focus();
			} else {
				cls.cells[obj.cellsId.y+1][obj.cellsId.x].canvasInput.focus();
			}
		} else if (position == wordLength) {
			isOnText = false;
			obj.blur();
		}
	}
	/**
	 * Callback on focus input box
	 */
	function onFocus (obj) {
		// console.log('focus')

		// перемещаем инпут рядом с выделеной ячейкой для фокуса экрана мобильных устройств
		allInputs.eq(obj._inputsIndex).css({'top': (game.scale.height/(game_height/cross_cell_height))*(obj.cellsId.y+1) +'px', 'left':(game.scale.width/(game_width/cross_cell_width))*(obj.cellsId.x+1)+'px'})
		
		// console.log(iBlur.staus)
		if ( iBlur.staus ) {
			// console.log('focus-pocus', obj)

			for (var i = 0; i < words.length; i++) {
				// console.log("проверяем", words[i].word)
				var x = words[i].startX;
				var y = words[i].startY;

				for (var j = 0; j < words[i].word.length; j++) {
					// console.log('step', x, y)
					if(x == obj.cellsId.x && y == obj.cellsId.y) {
						// console.log('слово найдено:', words[i].word)
						if (words[i].orientation == 'h') {
							// store horizontal word obj
							if (!isOnText) {
								storedWord = words[i];
							}
							isOnText = false;
							// change boxes state to active for horizontal word
							for (var k = 0; k < words[i].word.length; k++) {
								changeResult.push({x:words[i].startX+k,y:words[i].startY})
								back[ words[i].startY ][ words[i].startX+k ].frame = 2;
								if ((cls.cells[ words[i].startY ][ words[i].startX+k ].canvasInput.value() == '' || cls.cells[ words[i].startY ][ words[i].startX+k ].canvasInput.value() == ' ') && obj.cellsId.x != storedWord.startX+k) {
									cls.cells[ words[i].startY ][ words[i].startX+k ].canvasInput.value('_')
								}
							}
							back[obj.cellsId.y][obj.cellsId.x].frame = 4;
							
							iFocus.obj = obj;
							iBlur.staus = false;

							return true;
						} else {
							// store vertical word obj and continue searching
							if (!isOnText) {
								storedWord = words[i];
							}
						}
					} 
					if (words[i].orientation == 'h') {
						x++;
					} else {
						y++;
					}
				}
			}
			isOnText = false;
			// if no horizontal word was found - change boxes state to active for vertical word
			for (var k = 0; k < storedWord.word.length; k++) {
				changeResult.push({ x:storedWord.startX, y:storedWord.startY+k })
				back[ storedWord.startY+k ][ storedWord.startX ].frame = 2;
				if ((cls.cells[ storedWord.startY+k ][ storedWord.startX ].canvasInput.value() == '' || cls.cells[ storedWord.startY+k ][ storedWord.startX ].canvasInput.value() == ' ') && obj.cellsId.y != storedWord.startY+k) {
					cls.cells[ storedWord.startY+k ][ storedWord.startX ].canvasInput.value('_')
				}
			}
			back[obj.cellsId.y][obj.cellsId.x].frame = 4;
			iFocus.obj = obj;
			iBlur.staus = false;
		} else {
			onBlur(iFocus.obj)
			onFocus(obj)
		}
	}

	/**
	 * Callback on lost focus
	 */
	function onBlur (obj) {
		// фикс для мобильников: исчезающая клава
		if( (!isOnText && !cls.timer.running) || isOnText ) {
			// console.log('blur')
			myBlur();
		} else {
			// console.log('dont blur')
			cls.timer.stop();
			// повторный фокус
			cls.cells[obj.cellsId.y][obj.cellsId.x].canvasInput.focus();
		}
		
		function myBlur() {
			if ( obj.cellsId.x == iFocus.obj.cellsId.x && obj.cellsId.y == iFocus.obj.cellsId.y ) {
				
				// console.log('blur', obj.cellsId)
				for (var i = 0; i < changeResult.length; i++) {
					var value = cls.cells[changeResult[i].y][changeResult[i].x].canvasInput.value();
					if (value.length < 1) {
						cls.cells[changeResult[i].y][changeResult[i].x].canvasInput.value(' ')
					}
					if ( value != '') {
						if (value == '_' || value == ' ') {
							back[changeResult[i].y][changeResult[i].x].frame = 0;
							cls.cells[changeResult[i].y][changeResult[i].x].canvasInput.value(' ')
						} else {
							back[changeResult[i].y][changeResult[i].x].frame = 1;
						}
						
					} else {
						back[changeResult[i].y][changeResult[i].x].frame = 0;
					}
				}
				changeResult = []
				
				iBlur.staus = true;
				iBlur.obj = obj;
			}
		}
			
	}

	var check_answer = function(e) {
		// console.log(e.target)
		game.paused = true;
		$('.task-submit').addClass('disabled');
		var result = 100;

		for (var i = 0; i < words.length; i++) {
			// console.log("проверяем", words[i].word)
			var x = words[i].startX;
			var y = words[i].startY;

			for (var j = 0; j < words[i].word.length; j++) {
				// console.log(cls.cells[y][x].canvasInput.value().toUpperCase(),'?=',right_answer[y][x], y, x)
				if (cls.cells[y][x].canvasInput.value().toUpperCase() != right_answer[y][x]) {
					back[y][x].frame = 3;
					result = 0;
					// task.sendResult(result)
					// return false;
					// break;
				} else {
					if (j == words[i].word.length-1) {
						// console.log('слово:', words[i].word, "отгадано ;)" )
					}
				}	
				if (words[i].orientation == 'h') {
					x++;
				} else {
					y++;
				}
				
			}
		}

		//result = 100;
		task.sendResult(result)

		e.preventDefault();
		e.stopPropagation();
	}


	function update() {
		// ...
	}

	cls.restart = function (e) {
		// console.log('restart')
		$('.task-submit').removeClass('disabled');
		if (!game) {
			// console.log('no cls.game => creating...')
			$.getJSON('js/words.json', function(data) {
				words = data.words;
				game_width = data.game_w;
				game_height = data.game_h;

				game = new Phaser.Game(game_width, game_height, Phaser.CANVAS, 'cross', { preload: preload, create: create, update: update}, true);
			})
		} else {
			game.paused = false;
			game.state.restart({
				 clearWorld:true
			});
		};
	}

	window.addEventListener('load', function() {
		var check_btn = document.getElementsByClassName('task-submit')[0];
			check_btn.addEventListener('touchstart', check_answer, false)
			check_btn.addEventListener('click', check_answer, false)

	}, false)

}