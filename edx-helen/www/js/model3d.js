;(window.initModel3d = function(){
		var mouseDownX,mouseDownY,properties={};
		if (!$('.model3d').length) {
			console.log('model3d templates not found!');
			return
		}

		$('.item .model-image').on('dragstart', function(event) {
			event.preventDefault();
		});
		$('.item').on('mousedown',function(e){
			setMouseDownPos(e.pageX,e.pageY);
			$('.item').on('mousemove',function(e){
				handleMove(e.pageX,e.pageY);
			});
		})
		$(document).on('mouseup',function(){
			$('.item').off('mousemove');
		})
		//touches
		$('.item').on('touchstart',function(e){
			if(navigator.userAgent.match(/Android|windows/i)){
				e.pageX= e.originalEvent.targetTouches[0].pageX;
				e.pageY= e.originalEvent.targetTouches[0].pageY;
			}
			setMouseDownPos(e.pageX,e.pageY);
			$('.item').on('touchmove',function(e){
				if(navigator.userAgent.match(/Android|windows/i)){
					if(e.originalEvent.targetTouches.length>1){
						return;
					}
					e.preventDefault();
					e.pageX = e.originalEvent.targetTouches[0].pageX;
					e.pageY = e.originalEvent.targetTouches[0].pageY;
				}
				handleMove(e.pageX,e.pageY);
			});
		})
		$(document).on('touchend',function(e){
			$('.item').off('touchmove');
		})
		///touches
		$('.item').on('wheel mousewheel keydown', function (e, delta) {
			e.preventDefault()
			scrollHandle(e,delta);
		});

		init();

		function init(){
			setProperties();
			fixYAxesValues();
			$('.item').addClass('hide');
			$('.item').removeClass('current');
			setBeginImage();
			setImageHeight();
			setImageProperties();
		}

		function setProperties(){
			properties.moveBufferX = parseInt($('.property').attr('data-move-buffer-x'));
			properties.moveBufferY = parseInt($('.property').attr('data-move-buffer-y'));
			properties.continiusXMoving = $('.property').attr('data-continius-x-moving')=='true'?true:false;
			properties.scalingStep = parseInt($('.property').attr('data-scaling-step'));
			properties.YReversed = $('.property').attr('data-Y-reversed')=='true'?true:false;
		}

		function setImageProperties(){
			setTimeout(function(){
				properties.minImageWidth = $('.item.current .model-image').width();
				properties.maxImageWidth = $('.item.current .model-image').width()*2;
			},500);
		}

		function setImageHeight(){
			setTimeout(function(){
				if($('.item.current img').height()>self.innerHeight){
					$('.item img').height(self.innerHeight);
				}
			},500);
		}

		function fixYAxesValues(){
			var yvals = {};
			$('.item').each(function(){
				yvals[$(this).attr('data-pos-y')] = 1;
			});
			var i=0;
			for(var key in yvals){
				if(!yvals.hasOwnProperty(key))continue;
				yvals[key] = i;
				i++;
			}
			$('.item').each(function(){
				$(this).attr('data-pos-y',yvals[$(this).attr('data-pos-y')]);
			});
		}

		function setBeginImage(){
			var y_count = $('.item[data-pos-x=1]').length;

			var x_active_pos = 0;
			var y_active_pos = y_count - 1;

			var $item = getItem(x_active_pos,y_active_pos);
			if($item.length){
				setActiveItem($item);
			}
		}

		function getItem(x,y){
			return $('.item[data-pos-x='+x+'][data-pos-y='+y+']');
		}

		function setActiveItem($item){
			$('.item').removeClass('current')
			$('.item').addClass('hide')
			$item.removeClass('hide')
			$item.addClass('current')
			$last_item = $item
		}

		function setMouseDownPos(x,y){
			mouseDownX=x
			mouseDownY=y
		}

		function handleMove(x,y){
			var shiftX = x-mouseDownX;
			var shiftY = y-mouseDownY;
			var $item = $('.item.current');

			if(Math.abs(shiftX) > properties.moveBufferX){
				if(shiftX < 0){
					doStepX($item,-1);
					mouseDownX = x;
				}
				if(shiftX > 0){
					doStepX($item,1);
					mouseDownX = x;
				}
			}
			if(Math.abs(shiftY) > properties.moveBufferY){
				if(shiftY < 0){
					doStepY($item,-1);
					mouseDownY = y;
				}
				if(shiftY > 0){
					doStepY($item,1);
					mouseDownY = y;
				}
			}

		}

		function getItemPosX($item){
			return parseInt($item.attr('data-pos-x'));
		}
		function getItemPosY($item){
			return parseInt($item.attr('data-pos-y'));
		}

		function doStepX($curr_item,step){
			var $item = getItem(getItemPosX($curr_item)+step,getItemPosY($curr_item));
			if($item.length){
				setActiveItem($item);
			}else{
				if(properties.continiusXMoving){
					if($curr_item.is('.item[data-pos-y='+$curr_item.attr('data-pos-y')+']:last')){
						setActiveItem($('.item[data-pos-y='+$curr_item.attr('data-pos-y')+']:first'));
					}
					if($curr_item.is('.item[data-pos-y='+$curr_item.attr('data-pos-y')+']:first')){
						setActiveItem($('.item[data-pos-y='+$curr_item.attr('data-pos-y')+']:last'));
					}
				}
			}
		}

		function doStepY($curr_item,step){
			if(properties.YReversed){
				step *=-1;
			}
			var $item = getItem(getItemPosX($curr_item),getItemPosY($curr_item)+step);
			if($item.length){
				setActiveItem($item);
			}
		}

		function scrollHandle(e,delta){
			var delta = delta || e.originalEvent.deltaY * -1 || e.originalEvent.wheelDelta;

			if (delta > 0 || e.which == 38) {
				scaleImages(e,true);
			} else if (delta < 0 || e.which == 40) {
				scaleImages(e,false);
			} else {
				return;
			}
			e.preventDefault();
		}

		function scaleImages(evt,encrease){
			var multyplic = 1;
			if(!encrease){
				multyplic = -1
			}
			var currentWidth = $('.item.current .model-image').width();
			var currentHeight = $('.item.current .model-image').height();

			var heightRate = currentHeight/currentWidth

			var newWidth = currentWidth+properties.scalingStep*multyplic;
			var newHeight = currentHeight+properties.scalingStep*multyplic*heightRate;

			if((encrease && newWidth > properties.maxImageWidth) || (!encrease && newWidth < properties.minImageWidth)){
				return
			}
			$('.item .model-image').width(newWidth);
			$('.item .model-image').height(newHeight);

			//moveImgsToCursor(evt,encrease,currentWidth,currentHeight);
			scrollToMiddle();
		}

		//not needed for a while
		function moveImgsToCursor(evt,encrease,oldWidth,oldHeight){
			//	var cursorX = evt.pageX - $('.item.current .model-image').offset().left
			//	var cursorY = evt.pageY - $('.item.current .model-image').offset().top

			var cursorX = $('.item.current .model-image').width()/2;
			var cursorY = $('.item.current .model-image').height()/2;

			var newWidth = $('.item.current .model-image').width();
			var newHeight = $('.item.current .model-image').height();

			var cursorXRate = cursorX/(Math.abs(newWidth)<=Math.abs(oldWidth)?newWidth:oldWidth);
			var cursorYRate = cursorY/(Math.abs(newHeight)<=Math.abs(oldHeight)?newHeight:oldHeight);

			var widthChange = newWidth-oldWidth;
			var heightChange = newHeight-oldHeight;

			var shiftLeft = widthChange*cursorXRate;
			var shiftTop = heightChange*cursorYRate;

			console.log(cursorXRate);
			console.log($('.item.current .model-image').position().left);

			var left = Math.floor(($('.item.current .model-image').position().left-shiftLeft))+'px';
			var top = Math.floor(($('.item.current .model-image').position().top-shiftTop))+'px';

			$('.item .model-image').css({
				'left':left
			});
			$('.item .model-image').css({
				'top':top
			});
		}

		function scrollToMiddle(){
			var myDiv = $("body");
			var scrollto = Math.round(myDiv.offset().top + myDiv[0].scrollHeight/2 - (myDiv.height() / 2));
			myDiv.scrollTop(scrollto);
		}

})()
