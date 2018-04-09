/*jslint node: true */
/*global describe: false, before: false, after: false, it: false */
"use strict";

// Declare the variables used
let expect = require('chai').expect,
    request = require('request'),
    server = require('../app')

const URLS=require('../app/models/urls');

/**
 * Created by aven on 18-04-09.
 */
describe('server', function () {

    // Beforehand, start the server
    before(function (done) {
        console.log('开启服务');
        done();
    });

    // Afterwards, stop the server and empty the database
    after(function (done) {
        console.log('停止服务');
        // URLS.destory();
        done();
    });

    // Test the index route
    describe('测试首页路由', function () {
        it('打开首页', function (done) {
            request.get({ url: 'http://localhost:3000' }, function (error, response, body) {
                expect(body).to.include('长链');
                expect(response.statusCode).to.equal(200);
                expect(response.headers['content-type']).to.equal('text/html; charset=utf-8');
                done();
            });
        });
    });

    // Test submitting a URL
    describe('测试提交一条链接', function () {
        it('返回一条短链接', function (done) {
            request.post('http://localhost:3000', {form: {url: 'https://gitee.com/eclipes/projects'}}, function (error, response, body) {
                expect(body).to.include('您的短链是：');
                expect(response.statusCode).to.equal(200);
                expect(response.headers['content-type']).to.equal('text/html; charset=utf-8');
                done();
            });
        });
    });

    // Test following a URL
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
                        url: 'http://localhost:3000/testurl',
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
                url: 'http://localhost:3000/nonexistenturl',
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
            request.post('http://localhost:3000/api/all',{form: {url: 'http://as.dds.hs/sdhjas'}},function (error, response, body) {
                expect(response.statusCode).to.equal(200);
                expect(body).to.include('"status":1,');
                done();
            });
        });
    });

    describe('测试查看一条短链的接口', function () {
        it('返回一条短链接', function (done) {
            request.post('http://localhost:3000/api/find',{form: {url: 'http://as.dds.hs/sdhjas'}},function (error, response, body) {
                expect(response.statusCode).to.equal(200);
                expect(body).to.include('"status":1,');
                done();
            });
        });
    });

    describe('测试生成短链的接口', function () {
        it('返回一条短链接', function (done) {
            request.post('http://localhost:3000/api/short',{form: {url: 'https://gitee.com/eclipes/projects'}},function (error, response, body) {
                expect(response.statusCode).to.equal(200);
                expect(body).to.include('"status":1,');
                done();
            });
        });
    });

});
