'use strict';

module.exports = function(config){

    const Koa = require('koa');
    const app = config.app || new Koa();

    const EmailService = require('./lib/email_service')(config.email_service);
    const Renderer = require('./lib/renderer');
    const renderer = new Renderer(config.renderer);
    const Router = require('./lib/router')(EmailService, renderer);
    const router = new Router(config.routes);

    if(config.middleware && config.middleware.prepend){
        config.middleware.prepend.forEach(middleware => { app.use(middleware) } );
    }

    app.use(router.routes())
       .use(router.allowedMethods());

    if(config.middleware && config.middleware.append){
        config.middleware.append.forEach(middleware => { app.use(middleware) } );
    }

    if(config.start) app.listen(config.port || 3000);
    
    return app;
};
