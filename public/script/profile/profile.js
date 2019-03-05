var OPEN_DLG = null;
var MYNICK;
var file;
var GlobalObj = {};
var audioMsg = new Audio();
    audioMsg.src='../../../audio/message.mp3';



$(document).ready(function(){
	file = document.getElementById('tFile');
	file.addEventListener('change', function () {
		$(".avatara_big").css({"background-image":"url(../../../img/spinner-preloader.gif)"})
		var fullPath = file.value;
		var startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
		var filename = fullPath.substring(startIndex);
		if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
			filename = filename.substring(1);
		}
		if (this.files && this.files[0]) {
			var reader = new FileReader();
			reader.onload = function (e) {
				$.post('/updateAvaUser',{newAva: e.target.result}, function(res){
					console.log(res);
					$(".avatara_big").css({"background-image":"url("+res.img+")"})
				});
			};
			reader.readAsDataURL(this.files[0]);
		}
	}, false);

	GlobalObj.socket = io.connect(location.hostname + ':4335');

	GlobalObj.socket.emit('clientConnect', {
        nickName: $('.tPoziv').html().split(":")[1]
    });

    GlobalObj.socket.on('writing', function (data) {		
		$('.writingMessage, .'+data.user+ ' .writingMessage' ).css({"opacity":"1"});
		setTimeout(function(){
			$('.writingMessage, .'+data.user+ ' .writingMessage').css({"opacity":"0"});
		},1500)
	});

    GlobalObj.socket.on('getonline', function (data) {	
    	for(var i = 0; i < data.data.length; i++){
    		if(data.data[i].onlineSession){
    			$('.'+data.data[0].pozivnoy).fadeIn(200);
    		}else{
				$('.'+data.data[0].pozivnoy).fadeOut(200);
    		}
    	}	
	});

	setInterval(function(){
		GlobalObj.socket.emit("getonline",{ my:  $('.tPoziv').html().split(":")[1] });
	}, 10000);
});

var writingMessage = function(){
	GlobalObj.socket.emit("writing",{ user: OPEN_DLG, my: MYNICK });
}

var sendMessage =  function(){
	// GlobalObj.socket.emit("message", {message: 'asdasdasd', to: OPEN_DLG });
	$('.button_id_submit').addClass('loadBtn');
	$.post('/sendMessage',{a:OPEN_DLG, b: $('#enterMessage').val()},function(res){
		var msgclass = 'touser';
		var MSG = '<div class="message '+msgclass+'">'+
		'<div class="message__head">'+
		'<span class="message__note">'+
		'Princess Murphy'+
		'</span> <span class="message__note">'+
		res.data.date + ' ('+ res.data.time + ')' +
		'</span> </div> <div class="message__base">'+
		'<div class="message__textbox">'+
		'<span class="message__text">'+
		res.data.text +
		'</span> </div> '+
		'<div class="message__avatar avatar">'+
		'<a href="#" class="avatar__wrap">'+
		'<img class="avatar__img" src="http://placehold.it/35x35" width="35" height="35" alt="avatar image">'+
		'</a> </div></div> </div>';
		GlobalObj.socket.emit("messages",{user: OPEN_DLG, my: MYNICK, resDlg:$('#enterMessage').val()});
		$("#chatbox__content").append(MSG);
		$('#enterMessage').val('');
		$('.button_id_submit').removeClass('loadBtn');
		$(".chatbox__row_fullheight").animate({ scrollTop: 9999 }, 'slow');
		
	});
};

var selectAvatar = function(){
	$("#tFile").click();
};

var setParamTovar = function(a,b){
	createError('nWarning', 'Функция временно недоступна');
};

var setParam = function(num, param, el){
	$('.fullBlockLoader').fadeIn(100);
	if($(el).is(':checked')){
		var parsePAram = false;
	}else{
		var parsePAram = true;
	}

	$.post('/setParamsUser',{a: num, b: parsePAram}, function(res){
		$('.fullBlockLoader').fadeOut(100);
	});
};

var changepass = function(a,b,c){
	$.post('/changePass',{a:a,b:b,c:c},function(res){
		createError(res.className, res.message);
		$('.passRep').val('');
	});	
}

var clickTab = function(el){
	$('.PN_Nav_btn').removeClass('active');
	$(el).addClass('active');
	$('.TAB').removeClass('visible');
	$('.TAB:eq('+$('.PN_Nav_btn').index(el)+')').addClass('visible');
};

var shablonMessage = function(iam, data){
	console.log(data);
	if(data.to !== iam){
		var msgclass = 'touser';
		return '<div class="message '+msgclass+'">'+
		'<div class="message__head">'+
		'<span class="message__note">'+
		'Princess Murphy'+
		'</span> <span class="message__note">'+
		data.date + ' ('+ data.time + ')' +
		'</span> </div> <div class="message__base">'+
		'<div class="message__textbox">'+
		'<span class="message__text">'+
		data.text +
		'</span> </div> '+
		'<div class="message__avatar avatar">'+
		'<a href="#" class="avatar__wrap">'+
		'<img class="avatar__img" src="http://placehold.it/35x35" width="35" height="35" alt="avatar image">'+
		'</a> </div></div> </div>';
	}else{
		var msgclass = 'tome';
		return '<div class="message '+msgclass+'">'+
		'<div class="message__head">'+
		'<span class="message__note">'+
		'Princess Murphy'+
		'</span> <span class="message__note">'+
		data.date + ' ('+ data.time + ')' +
		'</span> </div> <div class="message__base">'+
		'<div class="message__avatar avatar">'+
		'<a href="#" class="avatar__wrap">'+
		'<img class="avatar__img" src="http://placehold.it/35x35" width="35" height="35" alt="avatar image">'+
		'</a> </div> <div class="message__textbox">'+
		'<span class="message__text">'+
		data.text +
		'</span> </div> </div> </div>';
	}	
};

var messageInterval;

var openDialog = function(user){
	OPEN_DLG = user;
	$('.noneOpenDlg').fadeOut();
	$('.dlgLoader').fadeIn();
	$('.message').remove();
	$.post('/opendialog?user='+user, {user: user}, function(dlg){
		MYNICK = dlg.my;

		$('.head__title').html('Диалог с - '+user)
		for(var i = 0; i < dlg.data.length; i++){
			$("#chatbox__content").append(shablonMessage(user,dlg.data[i]));
		}		
		$('#chatbox__content,.enter').fadeIn(100);
		$('.head').css({"display":"inline-flex"})
		$('.dlgLoader').fadeOut(300);
		$(".chatbox__row_fullheight").animate({ scrollTop: 9999 }, 'slow');
	});
	
	GlobalObj.socket.on('messages', function (data) {		
		$("#chatbox__content").append(shablonMessage(user, data.data));
		$(".chatbox__row_fullheight").animate({ scrollTop: 9999 }, 'slow');
		audioMsg.play();
	});
}



var saveMyInfo = function(){
	var dataUser = {
		name: $('#myUserName').val(),
		email: $('#myUserEmail').val(),
		phone: $('#myUserPhone').val(),
		text: $('#textMe').val()
	}
	$.post('/saveMyInfo', dataUser, function(res){
		createError(res.className, res.message);
	});
}