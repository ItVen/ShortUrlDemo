let mongoose=require('mongoose');
let URLSchema=require('../scheams/urls');
let URL=mongoose.model('urls',URLSchema);
/**
 * Created by aven on 18-04-09.
 */
module.exports=URL;