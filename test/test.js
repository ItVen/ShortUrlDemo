"use strict";

let expect = require('chai').expect,
    request = require('request'),
    server = require('../app');

const URLS=require('../api/models/urls');

const host = "http://localhost:8009";
/**
 * Created by aven on 18-04-09.
 */
describe('server', function () {

    before(function (done) {
        console.log('开启服务');
        done();
    });

    after(function (done) {
        console.log('停止服务');
        // URLS.destory();
        done();
    });

    describe('测试首页路由', function () {
        it('打开首页', function (done) {
            request.get({ url: host}, function (error, response, body) {
                expect(body).to.include('长链');
                expect(response.statusCode).to.equal(200);
                expect(response.headers['content-type']).to.equal('text/html; charset=utf-8');
                done();
            });
        });
    });

    describe('测试提交一条链接', function () {
        it('返回一条短链接', function (done) {
            request.post(host, {form: {url: 'https://gitee.com/eclipes/projects'}}, function (error, response, body) {
                expect(body).to.include('您的短链是：');
                expect(response.statusCode).to.equal(200);
                expect(response.headers['content-type']).to.equal('text/html; charset=utf-8');
                done();
            });
        });
    });

    describe('测试访问短链接', function () {
        it('重定向到映射的长链接', function (done) {
            // Create the URL
            let data = {
                hashId:'testurl',
                url:'https://gitee.com/eclipes/projects',
                click:0
            };
            let u = new URLS(data);
            u.save(function(err,urls){
                if(urls){
                    request.get({
                        url: host+'/testurl',
                        followRedirect: false
                    }, function (error, response, body) {
                        expect(response.headers.location).to.equal('https://gitee.com/eclipes/projects');
                        expect(response.statusCode).to.equal(301);
                        done();
                    });
                 }
            });
        });
    });

    describe('测试一个不存在的链接', function () {
        it('应返回404错误', function (done) {
            request.get({
                url: host+'/nonexistenturl',
                followRedirect: false
            }, function (error, response, body) {
                expect(response.statusCode).to.equal(404);
                expect(body).to.include('链接不存在');
                done();
            });
        });
    });

    //测试API接口
    describe('测试查看所有短链的接口', function () {
        it('返回所有数据', function (done) {
            request.post(host+'/api/all',{form: {url: 'http://as.dds.hs/sdhjas'}},function (error, response, body) {
                expect(response.statusCode).to.equal(200);
                expect(body).to.include('"status":1,');
                done();
            });
        });
    });

    describe('测试查看一条短链的接口', function () {
        it('返回一条短链接', function (done) {
            request.post(host+'/api/find',{form: {url: 'http://as.dds.hs/sdhjas'}},function (error, response, body) {
                expect(response.statusCode).to.equal(200);
                expect(body).to.include('"status":1,');
                done();
            });
        });
    });

    describe('测试生成短链的接口', function () {
        it('返回一条短链接', function (done) {
            request.post(host+'/api/short',{form: {url: 'https://gitee.com/eclipes/projects'}},function (error, response, body) {
                expect(response.statusCode).to.equal(200);
                expect(body).to.include('"status":1,');
                done();
            });
        });
    });

});
