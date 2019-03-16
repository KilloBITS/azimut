//4954bf9dc4e7d1f7-c074598b3d833fa5-453eb3b04f521449
//'UakWjwPVd8Dj2dVWag5CTw=='
const fs = require('fs');
const webhookUrl = 'https://chatapi.viber.com/pa/set_webhook';
// const webhookUrl = 'http://localhost:4334/set_webhook';
const express = require('express');
const app = express();
//______________________________________________________________________________________________________
//Рабочий
// const { ViberClient } = require('messaging-api-viber');
// const client = ViberClient.connect('4954bf9dc4e7d1f7-48c99ebc7901f555-c3c348d5b3bf0135');
// client.setWebhook(webhookUrl).catch(error => {
//   // console.log(error); // formatted error message
//   // console.log(error.stack); // error stack trace
//   // console.log(error.config); // axios request config
//   // console.log(error.request); // HTTP request
//   // console.log(error.response); // HTTP response
// });

// client.getAccountInfo().then(info => {
//   console.log(info);
// });

// client.broadcastText(['UakWjwPVd8Dj2dVWag5CTw=='],'test test test').then(result => {console.log(result) });

// client.sendPicture('SN-CHAT-47_', {
//   text: 'Photo description',
//   media: 'http://www.images.com/img.jpg',
//   thumbnail: 'http://www.images.com/thumb.jpg',
// });
// client.sendText('UakWjwPVd8Dj2dVWag5CTw==', 'Hello'); //
//______________________________________________________________________________________________________

 


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