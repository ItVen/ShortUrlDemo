'use strict'

let shortid = require('shortid');
const URLS=require('../models/urls');
const Co = require('hprose').co;
const base_url = process.env.BASE_URL || 'http://short.codecup.top:8009';

/**
 * Created by aven on 18-04-09.
 */
module.exports = {
    home:function(req,res){
        Co(function* () {
            let urls = yield URLS.findeAll();
            return res.render('index', { title: '短网址服务' ,base_url: base_url,urls:urls});
        }).catch(err => {
            console.log(err);
        });
    },
    show:function(req,res){
        Co(function* () {
            //得到长链接
            let url = req.body.url;
            let key = req.body.key;
            let id;
            let u = yield URLS.findByUrl(url);
            console.log(u);
            if(!u && url){
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

            }else if(u && url){
                id = u.hashId;
            }
            let urls = yield URLS.findeAll();
            if(id){
                return res.render('index', {title: '短网址服务' ,id: id, base_url: base_url,urls:urls});
            }else {
                return res.render('index', {title: '短网址服务' ,base_url: base_url,urls:urls});
            }

        }).catch(err => {
            console.log(err);
        });
    },
    jump:function (req,res) {
        Co(function* () {
            let id = req.params.id.trim();
            let u = yield URLS.findById(id);

            if(u){
                u.click = u.click+1;
                console.log(u);
                yield u.save();

                res.status(301);
                res.set('Location', u.url);
                return res.send();
            }else{
                res.status(404);
                let error = {status:404,stack:"链接不存在"};
                return res.render('error',{error:error});
            }
        }).catch(err => {
            console.log(err);
            res.status(500);
            let error = {status:500,stack:"服务器错误 ，请联系作者 @aven"};
            return res.render('error',{error:error});
        });
    }
};