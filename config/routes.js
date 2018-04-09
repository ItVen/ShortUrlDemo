let Index=require('../app/controllers/index');

/**
 * Created by aven on 18-04-09.
 */
module.exports=function(app){
    app.get('/',Index.home);
    app.post ('/',Index.show);
    app.route('/:id').all(Index.jump)
};