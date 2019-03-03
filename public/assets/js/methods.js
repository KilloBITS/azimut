var NEWSFILELOGO;
var NEWSFILECONTENTIMAGE = ['','','','','','','',''];

var saveAboutText = function(a,b){
	$.post('/saveAboutText',{a:a,b:b}, (res) => {
		console.log(res);
	});
}

var setRemoveTovar = function(a){
	$.post('/setRemoveTovar',{a:a}, (res) => {
		console.log(res);
		location.reload();
	});
}

var setCancelTovar = function(a){
	$.post('/setCancelTovar',{a:a}, (res) => {
		console.log(res);
		location.reload();
	});
}

var setGoodTovar = function(a){
	$.post('/setGoodTovar',{a:a}, (res) => {
		console.log(res);
		location.reload();
	});
}

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

var selectNewsLogo = function(){
	var file = document.querySelector('#inputGroupFile01').files[0];
	getBase64(file).then(
	  data => NEWSFILELOGO = data
	);
}

var selectNewsContentImage = function(e,i){
	var fullPath = $(e).val();
	if (fullPath) {
	    var startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
	    var filename = fullPath.substring(startIndex);
	    if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
	        filename = filename.substring(1);

	        var file = document.querySelector('#'+$(e).attr('id')).files[0];
			getBase64(file).then(
			  data => NEWSFILECONTENTIMAGE[i] = data
			);
	    }
	    $(e).parent().children()[1].innerHTML = filename
	}
	
	
}

var saveNewNews = function(){
	var NN = {
		title:  [
			$('#example-text-input-RU').val(),
			$('#example-text-input-UA').val(),
			$('#example-text-input-EN').val()
		],
		TEXT:  [
			$('#example-textarea-input-RU').val(),
			$('#example-textarea-input-UA').val(),
			$('#example-textarea-input-EN').val()
		],
		DATE:  $('#example-date-input').val(),
		type:  $('#example-type-input').val(),
		NEWS_LOGO: NEWSFILELOGO,
		CONTENT_IMAGE: NEWSFILECONTENTIMAGE,
	}
	$.post('/setNewNews', NN, function(res){
		console.log(res);
		location.reload();
	})
}

var newCalendarDate = function(){
	if(isNaN(new Date($("#example-datetime-local-input-end").val()))){
		var data = null;
	}else{
		var data = new Date($("#example-datetime-local-input-end").val());
	}
	var ND = {
		allDay: false,
		end: data,
		start: new Date($("#example-datetime-local-input-start").val()),
		text: $("#example-text-input2").val(),
		title: $("#example-text-input").val()
	}

	$.post('/setNewCalendar', ND, function(res){
		console.log(res);
		location.reload();
	})
}

var setRemoveCalendar = function(ai){
	$.post('/setDeleteCalendar', {a: ai}, function(res){
		console.log(res);
		location.reload();
	})
}

var blockUser = function(a,b){
	$.post('/blockUser', {a: a, b: b}, function(res){
		console.log(res);
		location.reload();
	})
}

var removeUser = function(a){
	$.post('/deleteUser', {a: a}, function(res){
		console.log(res);
		location.reload();
	})
}

var setAdminUser = function(a,b){
	$.post('/setAdmUser', {a: a, b: b}, function(res){
		console.log(res);
		location.reload();
	})
}