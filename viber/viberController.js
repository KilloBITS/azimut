//4954bf9dc4e7d1f7-c074598b3d833fa5-453eb3b04f521449
const http = require('http');
const ViberBot = require('viber-bot').Bot;
const BotEvents = require('viber-bot').Events;
const TextMessage = require('viber-bot').Message.Text;
var request = require('request');
const webhookUrl = 'https://chatapi.viber.com/pa/set_webhook';
const express = require('express');
const app = express();


var bot = new ViberBot({
	authToken: '4954bf9dc4e7d1f7-63f14c65d241b347-b3ec6f1293615a66',
	name: "Azimuth NEWS",
	avatar: "http://viber.com/avatar.jpg" // It is recommended to be 720x720, and no more than 100kb.
});
bot.setWebhook("https://chatapi.viber.com/pa/set_webhook").then(() => yourBot.doSomething()).catch(err => console.log(err));


bot.on(BotEvents.MESSAGE_RECEIVED, (message, response) => {
	response.send(`Thanks for subscribing, ${response.userProfile.name}`)
} );


http.createServer(bot.middleware()).listen(4337, function(){
	bot.setWebhook(webhookUrl)
});



bot.on(BotEvents.SUBSCRIBED, response =>
    response.send(`Thanks for subscribing, ${response.userProfile.name}`));
// request.post({
// 	url:'https://chatapi.viber.com/pa/send_message', 
// 	data: {
// 		"auth_token": "4954bf9dc4e7d1f7-c074598b3d833fa5-453eb3b04f521449",
// 	   "receiver":"01234567890A=",
// 	   "min_api_version":1,
// 	   "sender":{
// 	      "name":"John McClane",
// 	      "avatar":"http://avatar.example.com"
// 	   },
// 	   "tracking_data":"tracking data",
// 	   "type":"text",
// 	   "text":"Hello world!"
// 	}
// }, function(err,httpResponse,body){ 
// 	console.log(1111111111111111111111111111111)
// 	console.log(body)
// })


/******************/
// function findUrls(text) {
//     var source = (text || '').toString();
//     var urlArray = [];
//     var url;
//     var matchArray;

//     // Regular expression to find FTP, HTTP(S) and email URLs.
//     var regexToken = /(((ftp|https?):\/\/)[\-\w@:%_\+.~#?,&\/\/=]+)/g;

//     // Iterate through any URLs in the text.
//     while ((matchArray = regexToken.exec(source)) !== null) {
//         var token = matchArray[0];
//         urlArray.push(token);
//     }

//     return urlArray;
// }
// $("#section_0").each(function (index, elem) {
//     var mess = $(this).text();
//     var urlArray = findUrls(mess);
//     urlArray.forEach(function (url) {
//         var temp = mess.split(url);
//         mess = temp.join("<a href=\"" + url + "\">" + url + "</a>");
//     });
//     $("#section_0 p").html(mess);
// });