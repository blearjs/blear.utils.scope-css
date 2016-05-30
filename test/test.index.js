/**
 * karma 测试 文件
 * @author ydr.me
 * @create 2016-05-17 12:13
 */


'use strict';

var scopeCSS = require('../src/index.js');
var style1 = require('./style1.css');
var style2 = require('./style2.css');

describe('测试文件', function () {
    it('base', function () {
        var css2 = scopeCSS(style1, '#demo');

        console.log(css2);
        expect(css2).toMatch(/^\s*?#demo \.a \{$/m);
        expect(css2).toMatch(/@keyframes b \{$/m);
        expect(css2).toMatch(/^\s*?1% \{/m);
        expect(css2).toMatch(/@keyframes c \{$/m);
        expect(css2).toMatch(/^\s*?from \{$/m);
        expect(css2).toMatch(/^@media \(min-width: 769px\) \{$/m);
        expect(css2).toMatch(/^\s*?#demo \.d \{$/m);
    });
    
    
    it('compressed', function () {
        var css2 = scopeCSS(style2, '#demo');

        console.log(css2);
        expect(css2).toMatch(/#demo \.a\{/);
        expect(css2).toMatch(/@keyframes b\{/);
        expect(css2).toMatch(/\b1%\{/);
        expect(css2).toMatch(/@keyframes c\{/);
        expect(css2).toMatch(/from\{/);
        expect(css2).toMatch(/@media\(min-width:769px\)\{/);
        expect(css2).toMatch(/#demo \.d\{/);
    });
});
