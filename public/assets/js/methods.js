var NEWSFILELOGO;
var NEWSFILECONTENTIMAGE = ['','','','','','','',''];
var reload;

var locationReload =  function(text, reload){
	var modalWin = document.createElement('div');
	modalWin.className = 'modalWin';
	modalWin.innerHTML = text;
	$('body').append(modalWin);
	$('.preloaderBlock').fadeOut(100);
	if(reload){
		$(modalWin).append('<span>Страница будет обновлена через 3 секунды</span>');
		var defInt = 3;
		reload = setInterval(function(){
			defInt = defInt - 1;
			$('.modalWin span').html('Страница будет обновлена через '+defInt+' секунды');
			if(defInt <= 0){
				clearInterval(reload)
				location.reload();
			}
		}, 1000)
	}else{
		setTimeout(function(){
			$(modalWin).fadeOut('slow', function() { $(this).remove(); }); //
		},3000)
	}
}

var saveAboutText = function(a,b){
	$('.preloaderBlock').fadeIn(100);
	$.post('/saveAboutText',{a:a,b:b}, (res) => {
		locationReload(res.message, false)
	});
}

var setRemoveTovar = function(a){
	$('.preloaderBlock').fadeIn(100);
	$.post('/setRemoveTovar',{a:a}, (res) => {
		locationReload(res.message, true)
	});
}

var setCancelTovar = function(a){
	$('.preloaderBlock').fadeIn(100);
	$.post('/setCancelTovar',{a:a}, (res) => {
		locationReload(res.message, true)
	});
}

var setGoodTovar = function(a){
	$('.preloaderBlock').fadeIn(100);
	$.post('/setGoodTovar',{a:a}, (res) => {
		locationReload(res.message, true)
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
	$('.preloaderBlock').fadeIn(100);
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
		locationReload(res.message, true)
	})
}

var newCalendarDate = function(){
	$('.preloaderBlock').fadeIn(100);
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
		var table = $('#dataTable').DataTable(); 
		table.row.add( [
            ND.title,
            ND.start,
            ND.end,
            '<a href="#" class="btn btn-danger btn-xs mb-3" onclick="setRemoveCalendar('+($("#dataTable tbody tr").size()+1)+')">Удалить</a>'
        ] ).draw( false );
		locationReload(res.message, false);
	})
}

var setRemoveCalendar = function(ai, e){
	$('.preloaderBlock').fadeIn(100);
	$.post('/setDeleteCalendar', {a: ai}, function(res){
		var table = $('#dataTable').DataTable();
		table.clear();

		for(let i = 0; i < res.data.length; i++){
			table.row.add( [
	            res.data[i].title,
	            res.data[i].start,
	            res.data[i].end,
	            '<a href="#" class="btn btn-danger btn-xs mb-3" onclick="setRemoveCalendar('+i+')">Удалить</a>'
	        ] ).draw( false );
		}

		locationReload(res.message, false)
	})
}

var blockUser = function(a,b){
	$('.preloaderBlock').fadeIn(100);
	$.post('/blockUser', {a: a, b: b}, function(res){
		locationReload(res.message, true)
	})
}

var removeUser = function(a){
	$('.preloaderBlock').fadeIn(100);
	$.post('/deleteUser', {a: a}, function(res){
		locationReload(res.message, true)
	})
}

var setAdminUser = function(a,b){
	$('.preloaderBlock').fadeIn(100);
	$.post('/setAdmUser', {a: a, b: b}, function(res){
		locationReload(res.message, true)
	})
}

var removedPhotoGallery = function(a,b){
	$('.preloaderBlock').fadeIn(100);
	$(b).parent().parent().parent().fadeOut(100);
	$.post('/removedPhotoGallery', {a: a}, function(res){
		$(b).parent().parent().parent().remove();
		locationReload(res.message, false);
	})
}

var addPhotoGallery = function(a){
	$('.preloaderBlock').fadeIn(100);
	var file = document.querySelector('#inputGroupFileGallery').files[0];
	const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function(data){
    	$.post('/addPhotoGallery', {a: data.target.result}, function(res){
			locationReload(res.message, true)
		})
    }	
}

var saveFormMessage = function(){
$('.preloaderBlock').fadeIn(100);
}

var removeUserContacts =  function(){
$('.preloaderBlock').fadeIn(100);
}

var saveDBParams = function(){
	$('.preloaderBlock').fadeIn(100);
	var isSecure = confirm("Неправильные данные могут привести к поломке всего проекта!\nТакие изминения лучше вводить разработчикам!\nВы уверены что хотите сохранить ?");
	if(isSecure){
		var DBP = {
			a: $('#example-text-input').val(),
			b: $('#example-text-input1').val(),
			c: $('#example-text-input2').val(),
			d: $('#example-text-input3').val(),
			e: $('#example-text-input4').val()
		}
		$.post('/setDbParams', DBP, function(res){
			locationReload(res.message, false)
		})
	}
}

var removeNews = function(a){
	$('.preloaderBlock').fadeIn(100);
	$.post('/setRemoveNews', {a: a}, function(res){
		locationReload(res.message, true);
	})
}