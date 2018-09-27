/**
 * karma 测试 文件
 * @author ydr.me
 * @create 2016-05-17 12:13
 */


'use strict';

var scope = require('../src/index');

describe('parent scope type', function () {

    it('base', function () {
        var cssText1 = 'a{width:1px;}';
        var cssText2 = scope({
            cssText: cssText1,
            type: 2,
            scopeSelector: '.x'
        });

        expect(cssText2).toEqual(
            '.x a{width: 1px;}'
        );
    });

    it('pseudo class', function () {
        var cssText1 = 'a:hover{width:1px;}';
        var cssText2 = scope({
            cssText: cssText1,
            type: 2,
            scopeSelector: '.x'
        });

        expect(cssText2).toEqual(
            '.x a:hover{width: 1px;}'
        );
    });

    it('pseudo element', function () {
        var cssText1 = 'a:after{width:1px;}';
        var cssText2 = scope({
            cssText: cssText1,
            type: 2,
            scopeSelector: '.x'
        });

        expect(cssText2).toEqual(
            '.x a::after{width: 1px;}'
        );
    });

    it('@charset', function () {
        var cssText1 = '@charset "utf-8";';
        var cssText2 = scope({
            cssText: cssText1,
            type: 2,
            scopeSelector: '.x'
        });

        expect(cssText2).toEqual('');
    });

    it('@media', function () {
        var cssText1 = '@media all and (max-width: 100px){a{width:1px;}}';
        var cssText2 = scope({
            cssText: cssText1,
            type: 2,
            scopeSelector: '.x'
        });

        expect(cssText2).toEqual(
            '@media (max-width: 100px){.x a{width: 1px;}}'
        );
    });

    it('@keyframes', function () {
        var cssText1 = '@keyframes y{from{width:1px;}to{width:2px;}}';
        var cssText2 = scope({
            cssText: cssText1,
            type: 2,
            scopeSelector: '.x'
        });

        expect(cssText2.replace(/\n/g, '')).toEqual(
            '@keyframes y {   0% { width: 1px; }  100% { width: 2px; }}'
        );
    });

});

