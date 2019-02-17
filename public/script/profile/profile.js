var OPEN_DLG = null;
var file;
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
});

var selectAvatar = function(){
	$("#tFile").click();
};

var setParamTovar = function(a,b){
	createError('nWarning', 'Функция временно недоступна');
}

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
}

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

var openDialog = function(user){
	$('.noneOpenDlg').fadeOut();
	$('.dlgLoader').fadeIn();
	$('.message').remove();
	$.post('/opendialog?user='+user, {user: user}, function(dlg){
		$('.head__title').html('Диатлог с - '+user)
		for(var i = 0; i < dlg.data.length; i++){
			$("#chatbox__content").append(shablonMessage(user,dlg.data[i]));
		}
		$('#chatbox__content').fadeIn(100);
		$('.dlgLoader').fadeOut(300);
	})
}

