/**
 * scope css
 * @author ydr.me
 * @create 2018年09月26日14:19:04
 */


'use strict';

var object = require('blear.utils.object');
var modification = require('blear.core.modification');

var defaults = {
    /**
     * 样式文本
     */
    cssText: '',

    /**
     * scope 类型
     * 1 = 属性【默认】
     * 2 = 父级
     * @type number
     */
    type: 1,

    /**
     * 作用域选择器
     */
    scopeSelector: ''
};
var ifEl = null;

/**
 * css 作用域处理
 * @param options
 * @param options.cssText
 * @param [options.type=1]
 * @param options.scopeSelector
 * @returns {string}
 */
module.exports = function (options) {
    options = object.assign({}, defaults, options);
    var originCssText = (options.cssText || '').trim();

    if (!originCssText) {
        return originCssText;
    }

    var sheet = initStyleSheet(originCssText);
    var scopeSelector = options.scopeSelector || '';
    var scopedCssText = processSheet(sheet, function (selector) {
        switch (options.type) {
            case 1:
            default:
                return selector.replace(/^(.*?)(:+[^:]+)?$/, '$1' + scopeSelector + '$2');

            case 2:
                return scopeSelector + ' ' + selector;
        }
    });
    destorySheet(sheet);
    return scopedCssText;
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
                var con = rule.conditionText;
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
 * 销毁 sheet
 * @param sheet
 */
function destorySheet(sheet) {
    modification.remove(sheet.ownerNode);
}
