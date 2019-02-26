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