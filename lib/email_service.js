'use strict';

const NodeMailer = require('nodemailer');
const pick = require('lodash').pick;

const DEFAULTS = {
	secure: true
}

module.exports = function(config={}){

	const SMTP_SETTINGS = Object.assign({}, DEFAULTS, config.smtp || {});
	const transport = NodeMailer.createTransport(SMTP_SETTINGS, config.defaults || {});

	class EmailService {

		constructor(email, content, file){
			this.email = email;
			this.content = content;
			this.file = file;
		}

		send(){
			return transport.sendMail(this.mailOptions());
		}

		mailOptions(){
			return {
				from: config.from,
				to: this.email,
				html: this.content,
				subject: this.file.subject,
				attachments: [this.attachment()]
			};
		}

		attachment(){
			return pick(this.file, ['path','filename','content','contentType','contentDisposition','cid','encoding','headers']);
		}
	}

	return EmailService;
}