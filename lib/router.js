'use strict';

const KoaRouter = require('koa-router');
const bodyParser = require('koa-bodyparser');

module.exports = function(EmailService, renderer){

    class Router {
        
        constructor(config){
            this._router = new KoaRouter();

            Object.keys(config).forEach(path => {
                let routeConfig = config[path];

                this._router.get(path, ...this.showForm(path, routeConfig));
                this._router.post(path, bodyParser(), ...this.sendFile(path, routeConfig));
            });
        }

        showForm(path, routeConfig){
            routeConfig.middleware = routeConfig.middleware || {};
            routeConfig.middleware.get = routeConfig.middleware.get || {};
            let middlewares = [];

            if(routeConfig.middleware.get.prepend) middlewares = middlewares.concat(routeConfig.middleware.get.prepend);
            
            middlewares.push(async (ctx, next) => {
                ctx.body = await renderer.form(path, routeConfig.file);
                await next();
            });

            if(routeConfig.middleware.get.append) middlewares = middlewares.concat(routeConfig.middleware.get.append);
            return middlewares;
        }

        sendFile(path, routeConfig){
            routeConfig.middleware = routeConfig.middleware || {};
            routeConfig.middleware.post = routeConfig.middleware.post || {};
            let middlewares = [];

            if(routeConfig.middleware.post.prepend) middlewares = middlewares.concat(routeConfig.middleware.post.prepend);

            middlewares = middlewares.concat([async (ctx, next) => {
                let emailAddress = ctx.request.body.email;
                let renderedEmail = await renderer.email(emailAddress, path, routeConfig.file);
                let service = new EmailService(emailAddress, renderedEmail, routeConfig.file);
                
                await service.send();
                
                await next();
            }, async (ctx, next) => {
                ctx.body = await renderer.success(path, routeConfig.file);
                await next();
            }]);

            if(routeConfig.middleware.post.append) middlewares = middlewares.concat(routeConfig.middleware.post.append);
            return middlewares;
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