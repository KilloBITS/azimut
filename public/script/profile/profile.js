var clickTab = function(el){
	$('.PN_Nav_btn').removeClass('active');
	$(el).addClass('active');
	$('.TAB').removeClass('visible');
	$('.TAB:eq('+$('.PN_Nav_btn').index(el)+')').addClass('visible');
};