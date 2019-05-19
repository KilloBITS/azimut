var file;
var currentImage = 0;
var GLOBAL_FILE = [];
$(document).ready(function(){
	try{
		file = document.getElementById('tFile');
		file.addEventListener('change', function () {
		$(".newPhotoClick:eq("+currentImage+") img").attr("src","../../../img/spinner-preloader.gif")
		  function setupReader(file, ci){
		    var name = file.name;
		    var reader = new FileReader();
		    reader.onload = function (e) {
		    	GLOBAL_FILE.push(e.target.result);
		    	$(".newPhotoClick:eq("+ci+") img").attr("src",e.target.result);	  
		    	$(".newPhotoClick:eq("+ci+")").addClass('settingImages');
		    	$(".newPhotoClick:eq("+ci+") img").addClass('settingImages');
		    };
		    reader.readAsDataURL(file);	    
		  }
		  for (var i = 0; i < this.files.length; i++) {
		      setupReader(this.files[i], currentImage);
		      // currentImage += 1;
		  }
		  file.value ='';
		}, false);
	}catch(e){
		console.log('Неиспользуемый скрипт')
	}
	
});
var addNewTovar = function(){
	$('.addTovarData').fadeIn(300);
	$('.newTovarLoader').show();
	$.post('/newtovarautodata', function(res){
		$('#setNewNumTovar').val(res.data.phone_number);
		$('#setNewEmailTovar').val(res.data.email);
		$('.newTovarLoader').hide();
	});	
};

var clickLabelType = function(e){
	$('.buttonOfRadio').removeClass('radioactive');
	$(e).addClass('radioactive');
}

var addPhoto = function(e, a){
	currentImage = a
	if(!$(e).hasClass('settingImages')){
		$('#tFile').click()
	}	
}

var thisRemovePhoto = function(a,b){
	$('.newPhotoClick:eq('+b+') img').attr('src','../../../img/image.svg');
	$('.newPhotoClick:eq('+b+')').removeClass('settingImages');
	GLOBAL_FILE.splice(b, 1);
	return;
}

var getNewPostTovar = function(){
	var tovarData = [];
	var objectNewTovar = {}
	for(let i = 0; i < $('.lineOftovar input[type=text]').size(); i++){
		tovarData.push($('.lineOftovar:eq('+i+') input[type=text]').val());
	}
	tovarData.push($('.lineOftovar textarea').val());
	objectNewTovar.info = tovarData;
	objectNewTovar.type = document.querySelector('input[name="newTovarType"]:checked').value;
	objectNewTovar.image = GLOBAL_FILE; 
	objectNewTovar.Price = $('#setNewPriceTovar').val() +  $('#pricesValute').val();

	$.post("/newTovar", objectNewTovar, function(res){
		if(res.code === 500){
			createError(res.className, res.message)
			// window.location.reload();
		}else{
			createError(res.className, res.message)
		}
	})
}

var getEditPostTovar = function(a){
	var tovarData = [];
	var objectNewTovar = {}
	for(let i = 0; i < $('.lineOftovar input[type=text]').size(); i++){
		tovarData.push($('.lineOftovar:eq('+i+') input[type=text]').val());
	}
	tovarData.push($('.lineOftovar textarea').val());
	objectNewTovar.info = tovarData;
	objectNewTovar.type = document.querySelector('input[name="newTovarType"]:checked').value;
	objectNewTovar.image = GLOBAL_FILE; 
	objectNewTovar.Price = $('#setNewPriceTovar').val();
	objectNewTovar.AI = a;

	$.post("/setEditTovar", objectNewTovar, function(res){
		if(res.code === 500){
			createError(res.className, res.message)
			// window.location.reload();
			window.location.href = "/getDetailsTovar?AI="+a;
		}else{
			createError(res.className, res.message)
		}
	})
}