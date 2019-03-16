var createUsers = function(data){
	var ub = document.getElementById('users_wraper');
	var createAva = document.createElement('div');
	createAva.className = 'userAvatarka';   
};

function checkStrength(password, dat){
	var result = $("#password-strength"+dat);
    var strength = 0;    
    if (password.length == 0) {
    	result.removeClass()
    	return ''
    }
    if (password.length < 9) {
    	result.removeClass()
    	result.addClass('normal')
    	return 'Normal'
    }
    if (password.length > 9) strength += 1
    if (password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/))  strength += 1
    if (password.match(/([!,%,&,@,#,$,^,*,?,_,~])/))  strength += 1
    if (password.match(/(.*[!,%,&,@,#,$,^,*,?,_,~].*[!,",%,&,@,#,$,^,*,?,_,~])/)) strength += 1
    if (strength < 2) {
    	result.removeClass()
    	result.addClass('medium')
    	return 'Medium'
    } else if (strength == 2 ) {
    	result.removeClass()
    	result.addClass('strong')
    	return 'Strong'
    } else {
    	result.removeClass()
    	result.addClass('vstrong')
    	return 'Very Strong'
    }
}

visualSecret = function(e){
    if($(e).hasClass('visSecOFF')){
        $(e).removeClass('visSecOFF');
        $("#secretSlovo").attr('type','text');
    }else{
        $(e).addClass('visSecOFF');
        $("#secretSlovo").attr('type','password')
    }
}