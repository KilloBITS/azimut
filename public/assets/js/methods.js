var saveAboutText = function(a,b){
	$.post('/saveAboutText',{a:a,b:b}, (res) => {
		console.log(res);
	});
}