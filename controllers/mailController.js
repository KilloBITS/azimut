const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: 'azimutbot@gmail.com',
		pass: 'qazwsx159357'
	}
});

global.sendMail = function(subject,textData, touser){
	var mailOptions = {
	    from: "azimutbot@gmail.com", // sender address
	    to: touser, // list of receivers
	    subject: subject, // Subject line
	    text:  textData, // plain text body
	};
	transporter.sendMail(mailOptions, function (error, info) {});
}