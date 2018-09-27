/**
 * karma 测试 文件
 * @author ydr.me
 * @create 2016-05-17 12:13
 */


'use strict';

var scope = require('../src/index');

describe('attr scope mode', function () {

    it('base', function () {
        var cssText1 = 'a{width:1px;}';
        var cssText2 = scope(
            cssText1,
            '[x]',
            2
        );

        expect(cssText2).toEqual(
            'a[x]{width: 1px;}'
        );
    });

    it('pseudo class', function () {
        var cssText1 = 'a:hover{width:1px;}';
        var cssText2 = scope(
            cssText1,
            '[x]',
            2
        );

        expect(cssText2).toEqual(
            'a[x]:hover{width: 1px;}'
        );
    });

    it('pseudo element', function () {
        var cssText1 = 'a:after{width:1px;}';
        var cssText2 = scope(
            cssText1,
            '[x]',
            2
        );

        expect(cssText2).toEqual(
            'a[x]::after{width: 1px;}'
        );
    });

    it('@charset', function () {
        var cssText1 = '@charset "utf-8";';
        var cssText2 = scope(
            cssText1,
            '[x]',
            2
        );

        expect(cssText2).toEqual('');
    });

    it('@media', function () {
        var cssText1 = '@media all and (max-width: 100px){a{width:1px;}}';
        var cssText2 = scope(
            cssText1,
            '[x]',
            2
        );

        expect(cssText2).toMatch(
            /^@media (all and )?\(max-width:\s*?100px\){a\[x]{width: 1px;}}$/
        );
    });

    it('@keyframes', function () {
        var cssText1 = '@keyframes y{from{width:1px;}to{width:2px;}}@keyframes y{from{width:1px;}to{width:2px;}}';
        var cssText2 = scope(
            cssText1,
            '[x]',
            2
        );

        if (cssText2 === '') {
            return console.log('this browser does not support `@keyframes`');
        }

        expect(cssText2.replace(/\n/g, '').replace(/\s+/g, ' ')).toMatch(
            /^@(.*?)keyframes y {\s*?0% { width: 1px; }\s*?100% { width: 2px; }\s*?}$/
        );
    });

});
