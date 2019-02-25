global.parseLanguage = function(req){
	switch(req.cookies.AL){
		case 'ru': return 'RU' ;break;
		case 'ua': return 'UA' ;break;
		case 'en': return 'EN' ;break;
		default: return 'RU'
	}
}