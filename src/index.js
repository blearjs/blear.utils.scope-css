/**
 * css 范围化
 * @author ydr.me
 * @create 2016年05月30日20:00:23
 * @ref https://github.com/thomaspark/scoper
 * @ref https://github.com/nathanmacinnes/scoped-style
 */



var reCSS = /([^\r\n,\{}]+)(,(?=[^}]*\{)|\s*\{)/g;
var reInside = /^\s*(@media|@keyframes|to|from|@font-face|[\d.]%)/;

module.exports = function (css, scope) {
    return css.replace(reCSS, function (g0, g1, g2) {
        if (g1.match(reInside)) {
            return g1 + g2;
        }

        g1 = g1.replace(/^(\s*)/, '$1' + scope + ' ');

        return g1 + g2;
    });
};

