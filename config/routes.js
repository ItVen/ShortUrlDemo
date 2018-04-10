let Index=require('../api/controllers/index');
let Api=require('../api/controllers/api');
/**
 * Created by aven on 18-04-09.
 */
module.exports=function(app){
    /***********demo展示*************/
    app.get('/',Index.home);
    app.post ('/',Index.show);
    app.get('/api',Index.apiShow);
    app.route('/:id').all(Index.jump);


    /*******API*******/
    app.post('/api/short',Api.short);
    app.get('/api/short',Api.short);

    app.post('/api/all',Api.all);
    app.post('/api/find',Api.findOne);
};