'use strict'

let shortid = require('shortid');
const URLS=require('../models/urls');
const Co = require('hprose').co;
const base_url = process.env.BASE_URL || 'http://localhost:8011';
/**
 * Created by aven on 18-04-09.
 */
module.exports = {
    /**
     *  生成 短链
     *  @param url 长链
     *  @param key 自定义短链key
     * */
    short:function(req,res){
        Co(function* () {
            //得到长链接
            let url = req.body.url;
            let key = req.body.key;
            let id;
            if(!url) return res.json({status:0, msg:"缺少请求必要参数URL"});
            let u = yield URLS.findByUrl(url);
            if(!u){
                // 创建一个短的hash值
                let self ;
                if(key){
                    self = yield URLS.findById(key);
                    if(!self){
                        id = key;
                    }
                }else{
                    id = shortid.generate();
                }

                if(!self){
                    let data = {
                        hashId:id,
                        url:url,
                        click:0
                    };
                    u = new URLS(data);
                    yield u.save();
                }

            }else {
                id = u.hashId;
            }
            return res.json({
                status:1,
                msg:"请求成功",
                url:base_url+id
            });

        }).catch(err => {
            console.log(err);
        });
    },
    /**
     * 查看所有
     * */
    all:function (req,res) {
        Co(function* () {
            let urls = yield URLS.findeAll();
            return res.json({
                status:1,
                msg:"请求成功",
                data:urls
            });
        }).catch(err => {
            console.log(err);
            res.status(500);
            let error = {status:500,stack:"服务器错误 ，请联系作者 @aven"};
            return res.render('error',{error:error});
        });
    },
    /**
     * 查看 单条
     *  @param url 长链
     *  @param key 短链种子id
     * */
    findOne:function(req,res){
        Co(function* () {
            let url = req.body.url;
            let key = req.body.key;
            let data;
            if(!url) return res.json({status:0, msg:"缺少请求必要参数 url or key"});
            if(key){//key优先级高与URL
                data = yield URLS.findById(key);
            }else{
                data = yield URLS.findByUrl(url);
            }
            if (!data) return res.json({status:-1, msg:"数据不存在"});
            return res.json({
                status:1,
                msg:"请求成功",
                data:data
            });
        }).catch(err => {
            console.log(err);
            res.status(500);
            let error = {status:500,stack:"服务器错误 ，请联系作者 @aven"};
            return res.render('error',{error:error});
        });
    }
};