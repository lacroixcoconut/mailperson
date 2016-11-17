# Mailperson

Mailperson is a simple Koa-based application for creating a file mailing site. The application uses a configuration object to set routes and associated files. When a route is visited, an email form is rendered that when submitted will send the associated file to the submitted address. No information is recorded about email addresses by the application. 

# Usage

Mailperson uses ES7 async/await features, so applications using it must be run with Node >= 7 and the --harmony flag. 

## Starting MailPerson 

```javascript
const mailperson = require('mailperson');
const app = mailperson(config);

app.listen(port);
```

## Configuration

The configuration hash has the following options:

- 
  **start** Boolean <false>
  When true, the app will automatically start listening on the port listed in the `port` property of the config
-
  **port** Integer <3000>
  The port the app should listen on. Only used if `start` is true
-
  **email_service** Object (required)
	- **from** String (required)
	  The 'from' email address to use for all mail sent by MailPerson
	- **smtp** Object (required)
	  Accepts any valid configuration object for [nodemailer](https://github.com/nodemailer/nodemailer). String configurations are not currently supported
-
  **middleware** Object
    - **prepend** Array
      An array of valid Koa2 middleware functions to run before all routes
    - **append** Array
      An array of valid Koa2 middleware functions to run after all routes
-
  **renderer** Object
  	- **views_path** String .
  	   The absolute path of your views directory. Default views are used if no directory is applied. See below for information on setting your own views
  	- **extension** String <'tpl'>
  	   The file extension to expect for template files
-
  **routes** Object
  A valid router configuration as described below


### Routes Object
	
The router configuration is an object where each key is a path to match, and each value is an object describing the mailer that will operate at that route. Any URL safe path is valid, except `/`, unless the index path is disabled as detailed below.

**key** Any URL valid path

**config** Object (required)
  - **file** Object (required)
     - **subject** String (required)
       The subject to use for the email.
     - **path** String (required)
       A local or network path to the file attachment
     - **filename** String
       The filename to use for the attachment in the email, defaults to the file's actual name
  - **middleware** Object
  	 - **get** Object
  	   - **prepend** Array
  	     An array of valid Koa2 middleware functions to prepend before any GET request to the route
  	   - **append** Array
  	     An array of valid Koa2 middleware functions to append after any GET request to the route
  	 - **post** Object
  	   - **prepend** Array
  	     An array of valid Koa2 middleware functions to prepend before any POST request to the route
  	   - **append** Array
  	     An array of valid Koa2 middleware functions to append after any POST request to the route

**Index Route**

 By default, the router will generate an index page at `/`, unless the key `index` is explicitly set to `false` in the routes hash. This key can also be supplied with a configuration hash to set middleware, as described above.

## Views

If you want to use custom views, you must supply four EJS template files, `index`, `form`, `email`, and `success`. The form template will be rendered on a GET request to any route, the email template is used to render the body of emails, and the success template is rendered after the email has been sent. Each template will be supplied with some data, listed below:

- **index.tpl**
	- **routes** An array where each element is array of [route_path, filename]
- **form.tpl**
	- **path** The path of the current route. The form in this template should submit an input named `email` to this route
	- **file** The `file` object from the current route's configuration hash
- **email.tpl**
	- **address** The email address the message is being sent to.
	- **path** The path of the current route
	- **file** The `file` object from the current route's configuration path
- **success.tpl**
	- **path** The path of the current route
	- **file** The `file` object from the current route's configuration path


## Todo

- Make config simpler
- Allow a layout to be passed in to render templates within
- Allow for custom data injection in templates
- Support per route templating
