const nodemailer = require('nodemailer');
const credentials = require('../credentials');

const transport = nodemailer.createTransport({  
    service: credentials.mail.server,
    auth: {
        type: 'OAuth2',
        user: credentials.mail.id,
        clientId: credentials.mail.client_id,
        clientSecret: credentials.mail.client_secret,
        refreshToken: credentials.mail.refresh_token,
        accessToken: credentials.mail.access_token,
        expires: 3600
    }
});


module.exports.sendMail = function(to, subject, text) {
	return new Promise((resolved, rejected) => {
		var mailOptions = {  
		    from: credentials.mail.name+' <'+credentials.mail.id+'>',
		    to: to,
		    subject: subject,
		    text: text
		};

		transport.sendMail(mailOptions, function(error, response){
		    if (error) return rejected(error);
		    transport.close();
		    return resolved();
		});
	})
}