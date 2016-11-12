'use strict';

const ejs = require('ejs');
const readFile = require('fs').readFile;
const projectRoot = require('./project_root')();

const DEFAULTS = {
	views_path: `${projectRoot}/views`,
	extension: 'tpl'
};

class Renderer {
	
	constructor(options={}){
		this.settings = Object.assign({}, DEFAULTS, options);
	}

	email(address, path, file){
		return this.renderTemplate('email', { address: address, path: path, file: file });
	}

	form(path, file){
		return this.renderTemplate('form', { path: path, file: file });
	}

	success(path, file){
		return this.renderTemplate('success', { path: path, file: file});
	}

	renderTemplate(name, data){
		return this.loadTemplate(name)
				.then(template => { return template(data); })
				.catch( e => { throw e; });
	}

	loadTemplate(name){
		return new Promise((resolve, reject) => {
			var template = ejs.cache.get(name);
			if(template) return resolve(template);
			readFile(`${this.settings.views_path}/${name}.${this.settings.extension}`, (err, data) => {
				if(err) return reject(err);
				template = ejs.compile(data.toString(), {cache: true, filename: name});
				resolve(template);
			});
		});
	}

};

module.exports = Renderer;