var openForgot = function(a){
	
	$('#'+a+' .openesBlockForgot').fadeIn(300);
} 

var functionChange = function(a,b){
	var s = prompt(a.message, '');
	if(s !== ''){
		if(b === 0){
			$.post('/getSecret',{a:s}, function(res){
				createError(res.className, res.message)
			})	
		}else{
			$.post('/getPassEmail',{a:s, b: a.userData.pozivnoy}, function(res){
				createError(res.className, res.message)
			})	
		}		
	}
}

var setForgotPass = function(a){
	if(a === 0){
		var URL = '/forgotsecret';
		var forId = '#pozivSecret'
	}else{
		var URL = '/forgotemail';
		var forId = '#pozivEmail'
	}

	$.post(URL, {aa: $(forId).val() }, function(res){
		if(res.code === 500){			
			functionChange(res,a);
		}else{

		}
	});
}