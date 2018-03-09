/**
 * css 范围化
 * @author ydr.me
 * @create 2016年05月30日20:00:23
 * @update 2018年03月09日10:43:18
 * @ref https://github.com/thomaspark/scoper
 * @ref https://github.com/nathanmacinnes/scoped-style
 */

var object = require('blear.utils.object');
var random = require('blear.utils.random');


var seperatorRE = /([^\r\n,\{}]+)(,(?=[^}]*\{)|\s*\{)/g;
var insideRE = /^\s*(@media|@keyframes|to|from|@font-face|[\d.]%)/i;
// @charset "UTF-8";
var charsetRE = /@charset\s+(["'])(.*?)\1;/i;
var selfRE = /\b__self__\b([\s\n\r]*?{[^}]*})/ig;

module.exports = function (css, scope) {
    var charset = '';

    // 预处理 @charset
    css = css.replace(charsetRE, function (source, quote, char) {
        charset = '@charset ' + quote + char + quote + ';';
        return '';
    });

    // 预处理 __self__
    var selfMap = {};
    css = css.replace(selfRE, function (source) {
        var id = gid();
        selfMap[id] = source;
        return id + '{}';
    });

    css = charset + css.replace(seperatorRE, function (g0, g1, g2) {
        if (g1.match(insideRE)) {
            return g1 + g2;
        }

        g1 = g1.replace(/^(\s*)/, '$1' + scope + ' ');

        return g1 + g2;
    });

    // 恢复 __self__
    object.each(selfMap, function (key, val) {
        css = css.replace(scope + ' ' + key + '{}', val.replace(selfRE, function (origin, content) {
            return scope + content;
        }));
    });

    selfMap = null;
    return css;
};

/**
 * 生成一个不太可能重复的字符串
 * @returns {string}
 */
var gid = function () {
    return 'œ' + random.guid() + 'œ';
};
