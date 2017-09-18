/**
 * css 范围化
 * @author ydr.me
 * @create 2016年05月30日20:00:23
 * @ref https://github.com/thomaspark/scoper
 * @ref https://github.com/nathanmacinnes/scoped-style
 */



var seperatorRE = /([^\r\n,\{}]+)(,(?=[^}]*\{)|\s*\{)/g;
var insideRE = /^\s*(@media|@keyframes|to|from|@font-face|[\d.]%)/;
// @charset "UTF-8";
var charsetRE = /@charset\s+(["'])(.*?)\1;/i;

module.exports = function (css, scope) {
    var charset = '';

    css = css.replace(charsetRE, function (source, quote, char) {
        charset = '@charset ' + quote + char + quote + ';';
        return '';
    });

    return charset + css.replace(seperatorRE, function (g0, g1, g2) {
        if (g1.match(insideRE)) {
            return g1 + g2;
        }

        g1 = g1.replace(/^(\s*)/, '$1' + scope + ' ');

        return g1 + g2;
    });
};

