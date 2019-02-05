$(function(){
	$(window).scroll(function(){
		var winTop = $(window).scrollTop();
		if(winTop >= 30){
			$("body").addClass("sticky-header");
		}else{
			$("body").removeClass("sticky-header");
		}
	})

  // declare variable
  var scrollTop = $(".scrollTop");

  $(window).scroll(function() {
    // declare variable
    var topPos = $(this).scrollTop();

    // if user scrolls down - show scroll to top button
    if (topPos > 100) {
    	$(scrollTop).css("opacity", "1");

    } else {
    	$(scrollTop).css("opacity", "0");
    }

  }); // scroll END

  //Click event to scroll to top
  $(scrollTop).click(function() {
  	$('html, body').animate({
  		scrollTop: 0
  	}, 800);
  	return false;

  }); // click() scroll top EM

})

$(document).ready(function(){
	var cnvs = document.getElementById("canvas");
	cnvs.width = window.innerWidth;
	cnvs.height = window.innerHeight;
	var c = cnvs.getContext('2d');
	var dots_num = 70;
	var r = 1;
	var mx, my;
	var mouse_ol = 150;
	var dots_ol = 150;
	var max_speed = 1;
	var max_ms_opac = 1;
	var max_dots_opac = 1;
var uni_divs = 30;  // ensures that dots are evenly spread across the canvas initially

window.addEventListener('mousemove', updtMouse);

var dots = new Array();

var Dot = function(x, y, dx, dy) {
	this.x = x;
	this.y = y;
	this.dx = dx;
	this.dy = dy;
}

function updtMouse(e) {
	mx = e.x;
	my = e.y;
	console.log(mx + " " + my);
}

function init() {

	for(let i=0; i<dots_num; i++) {
		let x = Math.floor((Math.random()*innerWidth/uni_divs)+(parseInt(i/(dots_num/uni_divs))*(innerWidth/uni_divs)));
		let y = Math.floor(Math.random()*innerHeight);
		let dx = Math.random()*max_speed+0.1;
		let dy = Math.random()*max_speed+0.1;
		if(i%2==0) {
			dx*=-1;
			dy*=-1;
		}
		let temp = new Dot(x, y, dx, dy);
		dots.push(temp);
	}

}

function update() {

	c.clearRect(0, 0, innerWidth, innerHeight);

	for(let i=0; i<dots_num; i++) {

		let dy = dots[i].dy;
		let dx = dots[i].dx;

		dots[i].x += dx;
		dots[i].y += dy;

    // rebounce form walls
    if(dots[i].x>innerWidth || dots[i].x<0) {
    	dots[i].dx *= -1;
    }
    if(dots[i].y>innerHeight || dots[i].y<0) {
    	dots[i].dy *= -1;
    }

    let x = dots[i].x;
    let y = dots[i].y;
    // draw its line to mouse
    let d = Math.sqrt((x-mx)*(x-mx)+(y-my)*(y-my));
    if(d<mouse_ol) {
    	c.strokeStyle = `rgba(100, 180, 255, ${max_ms_opac*(mouse_ol-d)/mouse_ol})`;
    	c.lineWidth = 2;
    	c.beginPath();
    	c.moveTo(x, y);
    	c.lineTo(mx, my);
    	c.stroke();
    }

    // for(let i=0; i<dots_num; i++) {
    	for(let j=i+1; j<dots_num; j++) {
    		let x1 = dots[j].x;
    		let y1 = dots[j].y;
    		let d = Math.sqrt((x1-x)*(x1-x)+(y1-y)*(y1-y));
    		if(d<dots_ol) {
    			c.strokeStyle = `rgba(157, 210, 255, ${max_dots_opac*(dots_ol-d)/dots_ol})`;
    			c.lineWidth = 1;
    			c.beginPath();
    			c.moveTo(x1, y1);
    			c.lineTo(x, y);
    			c.stroke();
        // }
      }
    }
  }
  requestAnimationFrame(update);
}

init();

requestAnimationFrame(update);
/** Login **/

setTimeout(function() {
  $('.wrapper').addClass('loaded');
}, 3000);


/** Spqctr **/ 
let intervalX = $('#spectr').width();
let intervalY = $('#spectr').height();

// for(var il = 0; il < (intervalX / 2) - 1; il++){
//   var lineSpectr = document.createElement('div');
//   lineSpectr.className = 'lineSpectr';
//   lineSpectr.style.height = randomInteger(25, 100) + 'px'
//   $('#spectrLineArray').append(lineSpectr);
// }  
// for(let i = 0; i < intervalY; i++){

// }
// setInterval(function(){
  drawGrid(intervalX, intervalY, "spectr");  
// },100)

});

function randomInteger(min, max) {
  var rand = min + Math.random() * (max + 1 - min);
  rand = Math.floor(rand);
  return rand;
}
var textArray = ['+50','+45','+40','+35','+30','+25','+20','+15','+10','+5'];

var drawGrid = function(w, h, id) {
  var canvas = document.getElementById(id);
  var ctx = canvas.getContext('2d');
  ctx.canvas.width  = w;
  ctx.canvas.height = h;
  ctx.clearRect(0, 0, w, h);
  var data = '<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"> \
  <defs> \
  <pattern id="smallGrid" width="8" height="8" patternUnits="userSpaceOnUse"> \
  <path d="M 8 0 L 0 0 0 8" fill="none" stroke="gray" stroke-width="0.5" /> \
  </pattern> \
  <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse"> \
  <rect width="80" height="80" fill="url(#smallGrid)" /> \
  <path d="M 80 0 L 0 0 0 80" fill="none" stroke="gray" stroke-width="1" /> \
  </pattern> \
  </defs> \
  <rect width="100%" height="100%" fill="url(#smallGrid)" /> \
  </svg>';

  var DOMURL = window.URL || window.webkitURL || window;

  var img = new Image();
  var svg = new Blob([data], {type: 'image/svg+xml;charset=utf-8'});
  var url = DOMURL.createObjectURL(svg);
  
  img.onload = function () {
    ctx.drawImage(img, 0, 0);
    DOMURL.revokeObjectURL(url);

    ctx.beginPath();
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = 'white';
    ctx.moveTo(0, 125);
    ctx.lineTo(w, 125);
    ctx.stroke();
    ctx.closePath();

    for(var it = 0; it < (h / 25); it++){
      ctx.beginPath();
      ctx.strokeStyle = "silver";
      ctx.fillStyle = "silver";
      ctx.font = "16px sans-serif";
      ctx.fillText(textArray[it], 10, it*25);
      ctx.closePath();
      // indText = indText+1;
    }
    for(var il = 0; il < w; il++){
          // grd = ctx.createLinearGradient(1, 1, h, w);
      
      // // Add colors
      // grd.addColorStop(0, 'rgba(0, 13, 119, 1)');
      // grd.addColorStop(1, 'rgba(255, 255, 255, 1)');
      
      // // Fill with gradient
      // ctx.fillStyle = grd;
      // ctx.strokeStyle = grd;
      var lllH = randomInteger(180, 230);

      ctx.beginPath();
      ctx.lineWidth = 1;  
      ctx.strokeStyle = 'white';
      ctx.moveTo(il, lllH - 2);
      ctx.lineTo(il, h);
      ctx.stroke();
      ctx.closePath();

      ctx.beginPath();
      ctx.lineWidth = 1;  
      ctx.strokeStyle = '#125b8d';
      ctx.moveTo(il, lllH);
      ctx.lineTo(il, h);
      ctx.stroke();
      ctx.closePath();
    }

    }
    img.src = url;
  }


  var createError = function(type, text){
    console.log(text)
  }






