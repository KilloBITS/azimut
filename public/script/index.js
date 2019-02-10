$(function(){
  if ($(window).width() <= 800) {
    $('header').css({
      width: $(window).width() + 'px',
      height: $(window).height() + 'px'
    });    
  }

	$(window).scroll(function(){
		var winTop = $(window).scrollTop();
      
    if ($(window).width() > 800) {
      if(winTop >= 30){
        $("body").addClass("sticky-header");
      }else{
        $("body").removeClass("sticky-header");
      }
    }
	})

  var scrollTop = $(".scrollTop");
  $(window).scroll(function() {
    if ($(window).width() > 800) {
      var topPos = $(this).scrollTop();
      if (topPos > 100) {
        $(scrollTop).css("opacity", "1");
      } else {
        $(scrollTop).css("opacity", "0");
      }
    }   
  });

  $(scrollTop).click(function() {
  	$('html, body').animate({
  		scrollTop: 0
  	}, 800);
  	return false;
  });
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
var uni_divs = 30;  
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
    if(dots[i].x>innerWidth || dots[i].x<0) {
    	dots[i].dx *= -1;
    }
    if(dots[i].y>innerHeight || dots[i].y<0) {
    	dots[i].dy *= -1;
    }
    let x = dots[i].x;
    let y = dots[i].y;
    let d = Math.sqrt((x-mx)*(x-mx)+(y-my)*(y-my));
    if(d<mouse_ol) {
    	c.strokeStyle = `rgba(100, 180, 255, ${max_ms_opac*(mouse_ol-d)/mouse_ol})`;
    	c.lineWidth = 2;
    	c.beginPath();
    	c.moveTo(x, y);
    	c.lineTo(mx, my);
    	c.stroke();
    }
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
      }
    }
  }
  requestAnimationFrame(update);
}
init();
requestAnimationFrame(update);

setTimeout(function() {
  $('.wrapper').addClass('loaded');
}, 3000);

let intervalX = $('#spectr').width();
let intervalY = $('#spectr').height();

drawGrid(intervalX, intervalY, "spectr");  

  $('.sendComment').click( function(){
    $('.loader_new_comment').show();
    $('.sendComment').hide();
    var commentData = {
      text: $('#newComment').val()
    }
    $.post('/newComment', commentData, function(res){
      $('.loader_new_comment').hide();
      $('#newComment').val('');
      var newComment = '<div class="comment-wrap"><div class="comment-block"><p class="comment-text">'+res.data.text+'</p><div class="bottom-comment"><div class="comment-date">'+res.data.date+'</div></div><div class="commentAuthor">'+res.data.user+'</div></div></div>';
      $('.comments').append(newComment);
    });
  });
});

function randomInteger(min, max) {
  var rand = min + Math.random() * (max + 1 - min);
  rand = Math.floor(rand);
  return rand;
}

var textArray = head.numbers;

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
      if ($(window).width() > 800) {
        ctx.fillText(textArray[it], 10, it*25);
      }else{
        var posLine = $(window).height() / textArray.length;
        ctx.fillText(textArray[it], 10, it*posLine);
      }
      
      ctx.closePath();
    }

    var coords = head.spectr;
    }
    img.src = url;

    
      var backSpectr = new Image();
        backSpectr.onload = function(){
          if ($(window).width() > 800) {
            for(var il = 0; il < w/660; il++){    
                ctx.drawImage(backSpectr, (660 * il), 70, 660, 180);
            }
          }else{
            ctx.drawImage(backSpectr, (660 * il), 70, 660, 0);
          }
          
        };
      backSpectr.src = '../../../img/header.png'
  }


  var createError = function(type, text){
    console.log(text)
  }






