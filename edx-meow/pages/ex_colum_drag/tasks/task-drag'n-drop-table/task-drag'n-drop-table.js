'use strict';

/* Pull right answers form html */

var container = document.querySelector(".secret-info");
var thList = container.querySelectorAll(".th-title");
var tdList = container.querySelectorAll(".variants");
var variants = [];
var ansList = [];

var k = 0;
for (var i = 0; i < thList.length; i++) {
	variants[2*i] = thList[i].textContent;
	variants[2*i+1] = [];
	var tdItemList = tdList[i].getElementsByTagName("li");
	for (var j = 0; j < tdItemList.length; j++) {
		variants[2*i+1][j] = tdItemList[j].textContent;
		ansList[k] = tdItemList[j].textContent;
		k++;
	}
}
container.innerHTML = '';

/* Shuffle item of ansList */

Array.prototype.shuffle = function() {
	for (var i = this.length - 1; i > 0; i--) {
		var num = Math.floor(Math.random() * (i + 1));
		var d = this[num];
		this[num] = this[i];
		this[i] = d;
	}
};

ansList.shuffle();

/* Create th title */

for (var i = 0; i < thList.length; i++) {
	var createElem = document.createElement('div');
	createElem.className = "table__th";
	createElem.innerHTML = variants[2*i];
	document.querySelector(".table__th-row").appendChild(createElem);
}

/* Create elements */

var heightItem;
var marginItem = 4;
for (var i = 0; i < ansList.length; i++) {
	var createElem = document.createElement('span');
	createElem.className = "table__td";
	createElem.innerHTML = ansList[i];
	createElem.style.margin = marginItem + 'px';
	document.querySelector(".wrapper__box").appendChild(createElem);
	heightItem = createElem.offsetHeight;
}
document.querySelector(".wrapper__box").style.minHeight = heightItem + 32 + 'px';

/* Create td row elements (baskets) */

var basketsArr = [];
var blockWrapper;
for (var i = 0; i < thList.length; i++) {
	basketsArr[i] = [];
	var createElem = document.createElement('div');
	createElem.className = "table__td-cell";
	document.querySelector(".table__td-row").appendChild(createElem);
	isSizeBaskets(createElem,basketsArr,i);
}

function isSizeBaskets(elem,basketsArr,i) {
	blockWrapper = getCoords(document.querySelector(".wrapper"));
	basketsArr[i] = getCoords(elem);
	basketsArr[i].top = basketsArr[i].top - blockWrapper.top;
	basketsArr[i].left = basketsArr[i].left - blockWrapper.left;
}

var itemList = document.querySelectorAll(".table__td");
var baskets = document.querySelectorAll(".table__td-cell");

/* Add listeners on window size change */

window.addEventListener('resize', windowSizeChange);

function windowSizeChange() {
    for (var i = 0; i < thList.length; i++) {
    	isSizeBaskets(baskets[i],basketsArr,i);
    }
}

/* Add listeners on elements */

for (var i = 0; i < itemList.length; i++) {
  itemList[i].addEventListener("mousedown", itemMouseDown); 
  itemList[i].addEventListener("touchstart", itemTouchStart);
}

function getCoords(elem) { // кроме IE8-
  var box = elem.getBoundingClientRect();

  return {
    top: box.top + pageYOffset,
    left: box.left + pageXOffset
  };
}

function drawInWrapper(dragObj,e,shiftX,shiftY) {
  // find position of selected element relatively ".wrapper"
  dragObj.left = e.pageX - blockWrapper.left - shiftX - marginItem; 
  dragObj.top = e.pageY - blockWrapper.top - shiftY - marginItem;
  dragObj.style.left = dragObj.left + 'px';
  dragObj.style.top = dragObj.top + 'px';
}

function itemMouseDown(e) {
	if (e.which != 1) return; // click is defined if click happens only on left mouse button
	var dragObj = e.target;
	
	// turn off default browser Drag’n’Drop
	dragObj.ondragstart = function() {
		return false;
	};

	var coords = getCoords(dragObj);
	// shiftX, shiftY - cursor coordinates (relatively top left corner of element)
	var shiftX = e.pageX - coords.left;
	var shiftY = e.pageY - coords.top;

	drawInWrapper(dragObj,e,shiftX,shiftY);

	// remember start coords of selected element
	dragObj.downX = e.pageX;
	dragObj.downY = e.pageY;

	dragObj.style.position = 'absolute';
	dragObj.style.zIndex = 2;
	dragObj.classList.add("drag");
	document.querySelector(".wrapper").appendChild(dragObj);

	document.onmousemove = function(e) {
		drawInWrapper(dragObj,e,shiftX,shiftY);
	};

	dragObj.onmouseup = function() {
	    document.onmousemove = null;
	    dragObj.onmouseup = null;
	    isDropped(dragObj);
	};
}

function isDropped(dragObj) {
	for (var i = 0; i < basketsArr.length; i++) {
    	if (dragObj.top - basketsArr[i].top + heightItem > baskets[i].offsetHeight 
			|| basketsArr[i].top > dragObj.top + heightItem) {

    	} else if (dragObj.offsetWidth + dragObj.left < basketsArr[i].left
    		|| basketsArr[i].left + baskets[i].offsetWidth < dragObj.left
    		|| i !== basketsArr.length - 1 
    			&& basketsArr[i].left + baskets[i].offsetWidth - dragObj.left < dragObj.offsetWidth / 2) {

    	} else {
    		baskets[i].appendChild(dragObj);
    		dragObj.removeAttribute("style");
    		dragObj.classList.remove('drag');
    		dragObj.style.width = dragObj.offsetWidth + 'px';
    		dragObj.style.display = "block";
    		dragObj.style.margin = marginItem + 'px';
    		isDisabled();
    		return;
    	}
    }
	document.querySelector(".wrapper__box").appendChild(dragObj);
	dragObj.removeAttribute("style");
	dragObj.style.margin = marginItem + 'px';
	dragObj.classList.remove('drag');
	isDisabled();
}


function itemTouchStart(e) {
	if (e.targetTouches.length !== 1) return;
	var dragObj = e.target;

	var coords = getCoords(dragObj);
    // shiftX, shiftY - cursor coordinates (relatively top left corner of element)
    var shiftX = e.targetTouches[0].pageX - coords.left;
    var shiftY = e.targetTouches[0].pageY - coords.top;

    drawInWrapper(dragObj,e.targetTouches[0],shiftX,shiftY);

    dragObj.style.position = 'absolute';
	dragObj.style.zIndex = 2;
	dragObj.classList.add("drag");
	document.querySelector(".wrapper").appendChild(dragObj);

    dragObj.addEventListener("touchmove", itemTouchMove);
    dragObj.addEventListener("touchend", itemTouchEnd);

    function itemTouchMove(e) {
      e.preventDefault(); // Prevent the browser from processing emulated mouse events
      drawInWrapper(dragObj,e.targetTouches[0],shiftX,shiftY);
    }

    function itemTouchEnd(e) {
    	dragObj.ontouchstart = null;
    	dragObj.ontouchmove = null;
    	isDropped(dragObj);
    }
}

var btnAns = document.querySelector(".btn--answer");
var btnRest = document.querySelector(".btn--restart");
var btnShow = document.querySelector(".btn--show");
var ansTrue = document.querySelector(".form__response--true");
var ansFalse = document.querySelector(".form__response--false");

btnAns.addEventListener("click", btnAnsClickHandler);
btnAns.disabled = true;

btnRest.addEventListener('click', btnRestClickHandler);

btnShow.addEventListener("click", btnShowAnswer);

function isDisabled() {
	if (document.querySelector(".wrapper__box")
			.querySelectorAll(".table__td").length === 0) {
		btnAns.disabled = false;
	} else {
		btnAns.disabled = true;
	}
}

function btnAnsClickHandler() {
	var ansArr = [];
	var allRight = true;
	for (var i = 0; i < thList.length; i++) {
		ansArr[i] = [];
		var k = 0;
		var basketsContent = baskets[i].querySelectorAll(".table__td");
		for (var j = 0; j < basketsContent.length; j++) {
			if (isContains(basketsContent[j],i) === false) {
				ansArr[i][k++] = basketsContent[j].textContent;
			} 
		}
		if (ansArr[i].length !== 0) {allRight = false};
	}
	if (allRight === true) {
		ansTrue.classList.add("visible");
	} else {
		ansFalse.classList.add("visible");
	}
}

var find = function(array, value) {
for (var i = 0; i < array.length; i++) {
  if (array[i] === value) return i;
}

return -1;
};

function isContains(elem, number) {
	elem.style.pointerEvents = "none";
	if (find(variants[2*number+1], elem.textContent) === -1) {
		elem.style.background = "#fccfc0";
		return false;
	}
		elem.style.background = "#c8e6d1";
		return true;
}

function btnRestClickHandler() {
	ansList.shuffle();
	for (var i = 0; i < itemList.length; i++) {
		itemList[i].removeAttribute("style");
		itemList[i].style.margin = marginItem + 'px';
		itemList[i].innerHTML = ansList[i];
		document.querySelector(".wrapper__box").appendChild(itemList[i]);
	}
	ansTrue.classList.remove("visible");
	ansFalse.classList.remove("visible");
	for (var i = 0; i < baskets.length; i++) {
		baskets[i].innerHTML = '';
	}
}

function btnShowAnswer() {
	btnAns.disabled = true;
	document.querySelector(".wrapper__box").innerHTML = '';
	for (var j = 0; j < thList.length; j++){
		baskets[j].innerHTML = '';
		for (var i = 0; i < variants[2*j+1].length; i++) {
			var createElem = document.createElement('span');
			createElem.className = "table__td";
			createElem.innerHTML = variants[2*j+1][i];
			createElem.style.margin = marginItem + 'px';
			createElem.style.background = "#c8e6d1";
			baskets[j].appendChild(createElem);
		}
	}
	var rightList = document.querySelectorAll(".table__td");
	for (var k = 0; k < rightList.length; k++) {
		rightList[k].style.width = rightList[k].offsetWidth + 'px';
		rightList[k].style.display = "block";
		rightList[k].style.pointerEvents = "none";
	}
}