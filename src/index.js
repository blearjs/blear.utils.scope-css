/**
 * scope css
 * @author ydr.me
 * @create 2018年09月26日14:19:04
 */


'use strict';

var object = require('blear.utils.object');
var modification = require('blear.core.modification');

var ifEl = null;

/**
 * css 作用域处理
 * @param cssText {string} css 文本
 * @param scopeSelector {string} 作用域选择器
 * @param [mode=1] {number} 1=parent,2=attr
 * @returns {string}
 */
module.exports = function (cssText, scopeSelector, mode) {
    var originCssText = (cssText || '').trim();
    var deepRE = /\s+\/deep\/\s+/;
    var normalRE = /^(.*?)(:+[^:]+)?$/;

    if (!originCssText) {
        return originCssText;
    }

    // 兼容 deep selector
    // @link https://vue-loader-v14.vuejs.org/zh-cn/features/scoped-css.html
    // 有些像 Sass 之类的预处理器无法正确解析 >>>。这种情况下你可以使用 /deep/ 操作符取而代之
    // ——这是一个 >>> 的别名，同样可以正常工作。
    originCssText = originCssText.replace(/\s+>>>\s+/, ' /deep/ ');
    var sheet = initStyleSheet(originCssText);
    var scopedCssText = processSheet(sheet, function (selector) {
        switch (mode) {
            case 1:
            default:
                return scopeSelector + ' ' + selector.replace(deepRE, ' ');

            case 2:
                return deepRE.test(selector) ?
                    selector.replace(deepRE, scopeSelector + ' ') :
                    selector.replace(normalRE, '$1' + scopeSelector + '$2');
        }
    });
    destorySheet(sheet);
    return postSelf(scopedCssText);
};


/// =====================================================
/// =====================================================
/// =====================================================

/**
 * 初始化 iframe el
 * @returns {Node}
 */
function initIframeEl() {
    var doc = document;
    var ifEl = modification.create('iframe', {
        style: {
            display: 'none'
        }
    });

    if (doc.body) {
        modification.insert(ifEl);
    } else {
        modification.insert(ifEl, doc.head, 3);
    }

    return ifEl;
}

/**
 * 初始化 style sheet
 * @param cssText
 * @returns {StyleSheet}
 */
function initStyleSheet(cssText) {
    ifEl = ifEl || initIframeEl();
    var styleEl = modification.create('style');
    styleEl.innerHTML = cssText;
    modification.insert(styleEl, ifEl.contentDocument.body);
    return styleEl.sheet;
}

/**
 * 递归处理 sheet
 * @param sheet {object} sheet
 * @param processor {function} 处理
 * @returns {string}
 */
function processSheet(sheet, processor) {
    var rules = sheet.cssRules;
    var i = 0;
    var l = rules.length;
    var cssText = '';

    for (; i < l; i++) {
        var rule = rules[i];
        var type = rule.type;

        // https://developer.mozilla.org/zh-CN/docs/Web/API/CSSRule
        switch (type) {
            // 1 = style
            case 1:
                var sel = rule.selectorText;
                var val = rule.style.cssText;
                cssText += processor(sel) + '{' + val + '}';
                break;

            // 4 = media
            case 4:
                var con = rule.media.mediaText;
                cssText += '@media ' + con + '{' + processSheet(rule, processor) + '}';
                break;

            // 2 = charset
            // 3 = import
            // 5 = font-face
            // 6 = page
            // 7 = key-frames
            // 8 = key-frame
            // 10 = namespace
            // 11 = counter
            // 12 = supports
            // 13 = document
            // 14 = font-feature-value
            // 15 = viewport
            // 16 = region-style
            default:
                cssText += rule.cssText;
                break;
        }
    }

    return cssText;
}

/**
 * 处理 self 关键字
 * @param cssText
 * @returns {string}
 */
function postSelf(cssText) {
    return cssText.replace(/\s__self__\s*?{/ig, '{');
}

/**
 * 销毁 sheet
 * @param sheet
 */
function destorySheet(sheet) {
    modification.remove(sheet.ownerNode);
}
