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
		title: $('#example-text-input').val(),
		TEXT:  $('#example-textarea-input').val(),
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