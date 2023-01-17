var cloudbackend = require('appdrag-cloudbackend');
cloudbackend.init('0516c028-34d4-44e3-b221-8c47d4a77b4d', 'Task-Ninja-69a87b');


var API_KEY = 'bd57f19e0bd238f2c4a861331e2b4b7b-0afbfc6c-9e5951de';
var DOMAIN = 'mail.taskninjaservices.com';
var mg = require('mailgun-js')({apiKey: API_KEY, domain: DOMAIN});

const data = {
	from: 'Task Ninja Pro <Welcome@TaskNinjaServices.com>',
	to: 'konradhylton@gmail.com, YOU@YOUR_DOMAIN_NAME',
	subject: 'Hello again',
	text: 'Tesrrting some Mailgun awesomness!'
};
mg.messages().send(data, function (error, body) {
	console.log(body);
});




exports.handler = (event, context, callback) => {
    // TODO implement
    callback(null, 'Hello from CloudBackend');
};