'use strict'

let mongoose=require('mongoose');
let Schema = mongoose.Schema;

/**
 * Created by aven on 18-04-09.
 */
let URLSchema=new Schema({
    hashId:String,
    url:String,
    click:Number,
    createAt:{
            type:Date,
            default:Date.now()
        },
    updateAt:{
            type:Date,
            default:Date.now()
        }
});

URLSchema.pre('save',function(next){
    if(this.isNew){
        this.createAt=this.updateAt=Date.now();
    }else{
        this.updateAt=Date.now();
    }
    next();
});

//调用一下静态方法，不会与数据库直接交互，只有经过Modle模型编译实例化后才会具有这个静态方法
URLSchema.statics={
    findeAll:function(cb){
        return this.find({})
            .sort('meta.updateAt')
            .exec(cb);
    },
    findById:function(id,cb){
        return this
            .findOne({hashId:id})
            .exec(cb);
    },
    findByUrl:function(url,cb){
        return this
            .findOne({url:url})
            .exec(cb);
    }
}
//将模式导出
module.exports = URLSchema;