var keyChange, left, right, up, down, fire;

function init() {
	keyChange = false;
	left = false;
	right = false;
	down = false;
	up = false;
	fire = false;

	setEventHandlers();
};

var setEventHandlers = function() {
	window.addEventListener("keydown", onKeydown, false);
	window.addEventListener("keyup", onKeyup, false);

	//socket.on("move player", onMovePlayer);
};

newTranslateX = 0;
newTranslateY = 0;

function onKeydown(e) {
	if (e.keyCode == 37) {
		left = true;
		keyChange = true;
		if (newTranslateX < 450) {
			newTranslateX = newTranslateX+10;
			$('#canvas').css('transform', 'translate(' + newTranslateX + 'px, ' + newTranslateY + 'px)');
		}
	}
	if (e.keyCode == 39) {
		right = true;
		keyChange = true;
		if (newTranslateX < 450) {
			newTranslateX = newTranslateX-10;
			$('#canvas').css('transform', 'translate(' + newTranslateX + 'px, ' + newTranslateY + 'px)');
		}
	}
	if (e.keyCode == 38) {
		up = true;
		keyChange = true;
		if (newTranslateY < 250) {
			newTranslateY = newTranslateY+10;
			$('#canvas').css('transform', 'translate(' + newTranslateX + 'px, ' + newTranslateY + 'px)');
		}
	}
	if (e.keyCode == 40) {
		down = true;
		keyChange = true;
		if (newTranslateY < 250) {
			newTranslateY = newTranslateY-10;
			$('#canvas').css('transform', 'translate(' + newTranslateX + 'px, ' + newTranslateY + 'px)');
		}
	}
	if (e.keyCode == 32) {
		fire = true;
		keyChange = true;
	}
	if (keyChange) {
		socket.emit("move player", {left:left, right:right, up:up, down:down, fire:fire});
		keyChange = false;
	}
};

function onKeyup(e) {
	console.log("flag")
	if (e.keyCode == 37) {
		left = false;
		keyChange = true;
	}
	if (e.keyCode == 39) {
		right = false;
		keyChange = true;
	}
	if (e.keyCode == 38) {
		up = false;
		keyChange = true;
	}
	if (e.keyCode == 40) {
		down = false;
		keyChange = true;
	}
	if (e.keyCode == 32) {
		fire = false;
		keyChange = true;
	}
	if (keyChange) {
		socket.emit("move player", {left:left, right:right, up:up, down:down, fire:fire});
		keyChange = false;
	}
};

init();




