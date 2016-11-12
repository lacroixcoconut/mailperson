'use strict';

const KoaRouter = require('koa-router');
const bodyParser = require('koa-bodyparser');

module.exports = function(EmailService, renderer){

    class Router {
        
        constructor(config){
            this._router = new KoaRouter();
            this.config = config;

            Object.keys(this.config).forEach(path => {
                this._router.get(path, this.showForm(path, this.config[path]));
                this._router.post(path, bodyParser(), this.sendFile(path, this.config[path]), this.showSuccess(path, this.config[path]));
            });
        }

        showForm(path, file){
            return async (ctx, next) => {
                ctx.body = await renderer.form(path, file);
                await next();
            };
        }

        showSuccess(path, file){
            return async (ctx, next) => {
                ctx.body = await renderer.success(path, file);
                await next();
            }
        }

        sendFile(path, file){
            return async (ctx, next) => {
                let emailAddress = ctx.request.body.email;
                let renderedEmail = await renderer.email(emailAddress, path, file);
                let service = new EmailService(emailAddress, renderedEmail, file);
                
                await service.send();
                
                await next();
            };
        }

        routes(){
            return this._router.routes();
        }

        allowedMethods(){
            return this._router.allowedMethods();
        }

    };

    return Router;
};