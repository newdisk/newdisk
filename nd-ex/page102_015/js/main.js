var startEx = new StartEx();

function StartEx() {
	var cls = this;

	var stage1,
		car,
		carX,
		carY,
		sign,
		tolpa;

	var text = [];

	var right_answer = [1,0],
		user_answer = [0,0];
	

	var game,
		game_width = 2071,
		game_height = 1600;

	var zastavka = false;

	cls.tweens = [];
	cls.break_line;
	cls.desc_line;
	cls.arrow;
	cls.arrow_line;
	cls.smoke;
	cls.smoke2;
	cls.brake_trail = [];
	cls.timer;

	cls.preload = function() {
		console.log('preload')
		game.load.pack('all_img', 'js/manifest.json', null, this);
	}
	cls.create = function() {
		console.log('create')
		game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		game.stage.disableVisibilityChange = true;
		game.physics.startSystem(Phaser.Physics.ARCADE);

		// Level background and others...
		stage1 = game.add.sprite(0,0,'stage_1');
		cls.brake_trail[0] = game.add.graphics(0.0);
		cls.brake_trail[1] = game.add.graphics(0.0);

		tolpa = game.add.sprite(0,0, 'tolpa'); // TO DO animation
		tolpa.position.x = 1860;
		tolpa.position.y = 420;

		cls.car = game.add.sprite(0,0, 'car');
		sign = game.add.sprite(1800,450, 'sign');

		text[0] = game.add.text(10,540,'остановочный\nпуть 40 метров',{font:'80px Arial', fill: '#ffffff', align: 'center'});
		text[0].alpha = 0;
		text[1] = game.add.text(10,240,'время реакции\nводителя',{font:'80px Arial', fill: '#ffffff', align: 'center'});
		text[1].alpha = 0;
		text[2] = game.add.text(510,240,'время\nсрабатывания\nтормоза',{font:'80px Arial', fill: '#009900', align: 'center'});
		text[2].alpha = 0;
		text[3] = game.add.text(510,940,'тормозной\nпуть 20 метров',{font:'80px Arial', fill: '#990000', align: 'center'});
		text[3].alpha = 0;

		// Set graphics
		cls.break_line = game.add.graphics(0,0);
		cls.break_line.lineStyle(70, '0xffffff', 1)

		cls.desc_line = game.add.graphics(0,0);
		cls.desc_line.lineStyle(5, '0xffffff', 1)
		
		cls.arrow = game.add.graphics(0,0);
		cls.arrow.beginFill('0xffffff',1).lineTo(31, 60).lineTo(80, -5).lineTo(0,0).endFill();
		cls.arrow.alpha = 0;

		cls.arrow_line = game.add.graphics(0,0);
		cls.arrow_line.lineStyle(30, '0xffffff', 1)

		cls.brake_trail[0].lineStyle(20, '0x7d7d7d', 1)
		cls.brake_trail[1].lineStyle(20, '0x7d7d7d', 1)

		// Set brake smoke
		// 1
		cls.smoke = game.add.emitter(0, 0, 20); // (x, y, quantity)
		cls.smoke.makeParticles('smoke');
		cls.smoke.setYSpeed(5, 10);
		cls.smoke.setScale(1, 3, 1, 3, 0, null, false);
		cls.smoke.gravity = -200;
		// 2
		cls.smoke2 = game.add.emitter(0, 0, 20); // (x, y, quantity)
		cls.smoke2.makeParticles('smoke');
		cls.smoke2.setYSpeed(5, 10);
		cls.smoke2.setScale(1, 3, 1, 3, 0, null, false);
		cls.smoke2.gravity = -200;


		// Set tween
		cls.car.position.x =-370;
		cls.car.position.y =1330;
		cls.tweens[0] = game.add.tween(cls.car).to({x:2000 ,y:250}, 3000, 'Linear')
		cls.tweens[0].frameBased = true;
		cls.tweens[2] = game.add.tween(tolpa).to({x:1250 ,y:50}, 2900, Phaser.Easing.Sinusoidal.In)
		cls.tweens[2].frameBased = true;
	
	}

	cls.update = function() {
		if (!game.ready) {
			game.ready = true;
			cls.makeTimer();
		}
	}

	cls.restart = function(e) {
		console.log('restart')
		$('.task-submit').removeClass('disabled');
		
		if (!game) {
			console.log('no game => creating...')
			game = new Phaser.Game(game_width, game_height, Phaser.CANVAS, 'break', { preload: cls.preload, create: cls.create, update: cls.update }, true);
			
		} else {
			game.paused = false;
			game.state.restart({
				 clearWorld:true
			});
			game.ready = false;
			zastavka = false;
		};
	};
	cls.makeTimer = function () {
		// Time to timer
		console.log(game.ready)
		$('.task-submit').addClass('disabled');
		cls.timer = game.time.create(true);
		cls.timer.add(700, doStart, this);
		cls.timer.add(1650, doBrake, this);
		cls.timer.start();
	}

	var check_answer = function(e) {
		// console.log(e.target)
		game.paused = true;
		$('.task-submit').eq(1).addClass('disabled');
		console.log(cls.car.position.x)
		var result = 0;
		if (cls.car.position.x > 1300 || cls.car.position.x < 950) {
			result = 0;
		} else {
			result = 100;
		}
		task.sendResult(result);
	}

	function sceneEnding () {
		
		cls.timer = game.time.create(true);
		if(zastavka){
			cls.timer.add(1000, check_answer, this);
		} else {
			zastavka = true;
			cls.timer.add(1000, cleanScene, this);
		}
		cls.timer.start();
	}

	function cleanScene() {
		cls.break_line.clear().lineStyle(70,'0xffffff',1);
		cls.desc_line.clear().lineStyle(5,'0xffffff',1);
		cls.arrow.alpha = 0;
		cls.arrow_line.clear().lineStyle(30,'0xffffff',1);;
		// cls.smoke.clear();
		// cls.smoke2.clear();
		cls.brake_trail[0].clear().lineStyle(20, '0x7d7d7d', 1);
		cls.brake_trail[1].clear().lineStyle(20, '0x7d7d7d', 1);

		cls.car.position.x =-370;
		cls.car.position.y =1330;
		tolpa.position.x = 1860;
		tolpa.position.y = 420;
		cls.tweens[0] = game.add.tween(cls.car).to({x:2000 ,y:250}, 3000, 'Linear')
		cls.tweens[0].onComplete.add(check_answer,this);
		cls.tweens[2] = game.add.tween(tolpa).to({x:1250 ,y:50}, 2900, Phaser.Easing.Sinusoidal.In)
		
		text[0].alpha = 0;
		text[1].alpha = 0;
		text[2].alpha = 0;
		text[3].alpha = 0;


		$('.task-submit').eq(0).removeClass('disabled');
	}

	function drawLine(e) {
		// console.log(cls.tweens[1].timeline[0].percent)
		
		if (cls.tweens[1].timeline[0].percent > 0.19 && cls.tweens[1].timeline[0].percent < 0.23) {
			// draw green line
			cls.break_line.lineStyle(70,'0x009900',1);
		} else if(cls.tweens[1].timeline[0].percent >= 0.23) {
			// draw red line
			if (cls.break_line.lineColor == '0x009900') {
				cls.brake_trail[0].moveTo(cls.car.position.x+380, cls.car.position.y+95);
				cls.brake_trail[1].moveTo(cls.car.position.x+290, cls.car.position.y+40);
				cls.smoke.start(false, 800, 50, 100) // (explode?, lifespan, frequency, quantity, forsQuantity)
				cls.smoke2.start(false, 800, 50, 100)
			}
			cls.break_line.lineStyle(70,'0x990000',1);
			// make brake smoke
			cls.smoke.x = cls.car.position.x+190;
			cls.smoke.y = cls.car.position.y+180;

			cls.smoke2.x = cls.car.position.x;
			cls.smoke2.y = cls.car.position.y+140;

			// draw brake trail
			cls.brake_trail[0].lineTo(cls.car.position.x+380, cls.car.position.y+95)
			cls.brake_trail[1].lineTo(cls.car.position.x+290, cls.car.position.y+40)
			
		}
		if(cls.tweens[1].timeline[0].percent < 0.32) {
			
			cls.arrow_line.lineTo(cls.car.position.x+180, cls.car.position.y-275);
			cls.arrow.position.x = cls.car.position.x+150;
			cls.arrow.position.y = cls.car.position.y-295;
		}
		cls.break_line.lineTo(cls.car.position.x+500, cls.car.position.y+150);

		
	}

	function doStart(e) {
		// console.warn('Погнали!')
		$('.task-submit').eq(0).addClass('disabled');
		if (zastavka) {
			$('.task-submit').eq(1).removeClass('disabled');
		}
		cls.tweens[0].start();
		cls.tweens[2].start();
	}

	function doBrake(e) {
		// console.warn('Стоп машина!')
		$('.task-submit').eq(1).addClass('disabled');
		cls.tweens[0].stop();
		// console.log(cls.car.position.x, cls.car.position.y)

		carX = cls.car.position.x;
		carY = cls.car.position.y;
		// console.log(carX,carY)
		// cls.break_line.rotation = -.45;

		cls.break_line.moveTo(carX+500, carY+150);

		cls.desc_line
			.moveTo(carX+515, carY+180)
			.lineTo(carX+515, carY+250);
		cls.desc_line
			.moveTo(carX+935, carY-17)
			.lineTo(carX+935, carY+33);
		cls.desc_line
			.moveTo(carX+1005, carY-48)
			.lineTo(carX+1005, carY+33);
		cls.desc_line
			.moveTo(carX+1415, carY-240)
			.lineTo(carX+1415, carY+240);


		cls.tweens[1] = game.add.tween(cls.car).to({ x:carX+900, y:carY- 425 }, 5000, Phaser.Easing.Cubic.Out);
		cls.tweens[1].onUpdateCallback(drawLine).onComplete.add(sceneEnding, this)
		cls.tweens[1].frameBased = true;
		cls.tweens[1].start();
		
		cls.arrow.alpha = 1;
		cls.arrow_line.moveTo(carX+180, carY-275);

		// text
		text[0].x = carX+100;
		text[0].y = carY-750;
		text[0].alpha = 1;

		text[1].x = carX+200;
		text[1].y = carY+240;
		text[1].alpha = 1;

		text[2].x = carX+700;
		text[2].y = carY+10;
		text[2].alpha = 1;

		text[3].x = carX+1100;
		text[3].y = carY+240;
		text[3].alpha = 1;
	}

	window.addEventListener('load', function() {
		var start_btn = document.getElementsByClassName('task-submit')[0];
			start_btn.addEventListener('touchstart', doStart, false)
			start_btn.addEventListener('click', doStart, false)

		var brake_btn = document.getElementsByClassName('task-submit')[1];
			brake_btn.addEventListener('touchstart', doBrake, false)
			brake_btn.addEventListener('click', doBrake, false)

	}, false)

}
