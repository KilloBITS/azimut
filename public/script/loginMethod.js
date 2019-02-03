$(document).ready(function(){
	$('#signIn').click(function(){
		$('.nav_loader').show();
		$.post('/signin',{l: $('#emailRadio').val() , p: $('#passwordRadio').val()},function(result){
			console.log(result);
			$('.nav_loader').hide();
		});
	});
});