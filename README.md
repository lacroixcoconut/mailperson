# Mailperson

Mailperson is a simple Koa-based application for creating a file mailing site. The application uses a configuration object to set routes and associated files. When a route is visited, an email form is rendered that when submitted will send the associated file to the submitted address. No information is recorded about email addresses by the application. 

# Usage

Mailperson uses ES7 async/await features, so applications using it must be run with Node >= 7 and the --harmony flag. 

Example:

```javascript
'use strict';

const mailperson = require('mailperson');
const config = {
	routes: {
		'/test/1': { 
			file: {
				subject: 'Test File 1',
				filename: 'test1.txt',
				path: '/dev/files/test1.txt'
			},
			middleware: {
				prepend: [],
				append: []
			}
		},
		'/test/remote': {
			file: {
				subject: 'Remote Test File',
				filename: 'remote_test.jpg',
				path: 'https://some.s3.url.com/bucket/remote_test.jpg'
			}
		}
	},
	email_service: {
		from: 'bum@dumb.com',
		smtp: {
			host: 'smtp.dumb.com',
			auth: {
				user: 'bum@dumb.com',
				pass: process.env['EMAIL_PASSWORD']
			}
		}
	},
	middleware: {
		prepend: [
			(async function (ctx, next){
				try{
					await next();
				} catch(e) {
					console.error(e);
					ctx.status = 500;
					ctx.body = e.message;
				}
			})
		],
		append: [
			(async function (ctx, next){
				console.log("Request cycle completed.")
			})
		]
	},
	renderer: {
		views_path: './views',
		extension: 'tpl'
	}
};

const app = mailperson(config);

```

This will create an application with two routes, `/test/1`, and `/test/remote`. Each will render a form to send the file described by the associated object. Mailperson uses nodemailer under the hood, and the file configuration hash accepts all of the options available for an attachment object in nodemailer, in addition to a `subject` property for setting the subject of the email.

The `email_service` configuration also configures nodemailer. The `from` property sets the from address for all emails. The smtp configuration accepts any valid configuration for nodemailer.

The middleware configuration option accepts an array of koa-compatible middleware functions that will be added to the application's middleware stack before the built in routing and mail sending middleware.

The renderer configuration accepts two optional settings, the path to the views directory, and the file extension the templates use. These will default to the directory 'views' in your project root, and 'tpl', respectively. This directory must contain files named `form`, `email`, and `success`, each containing an EJS template for that resource. The form should post to the same route as the page.

##Todo

- Make config simpler
- Provide more options for injecting middleware
- Allow config to pass app
- Provide default templates
- Allow a layout to be passed in to render templates within
- Allow for custom data injection in templates
