define(['skylark-underscore'], function (_) {
    'use strict';
    const atRules = {
        4: 'media',
        5: 'font-face',
        6: 'page',
        7: 'keyframes',
        11: 'counter-style',
        12: 'supports',
        13: 'document',
        14: 'font-feature-values',
        15: 'viewport'
    };
    const atRuleKeys = _.keys(atRules);
    const singleAtRules = [
        '5',
        '6',
        '11',
        '15'
    ];
    const singleAtRulesNames = [
        'font-face',
        'page',
        'counter-style',
        'viewport'
    ];
    const parseSelector = (str = '') => {
        const add = [];
        const result = [];
        const sels = str.split(',');
        for (var i = 0, len = sels.length; i < len; i++) {
            var sel = sels[i].trim();
            if (/^(\.{1}[\w\-]+)+(:{1,2}[\w\-()]+)?$/gi.test(sel) || /^(#{1}[\w\-]+){1}(:{1,2}[\w\-()]+)?$/gi.test(sel)) {
                var cls = sel.split('.').filter(Boolean);
                result.push(cls);
            } else {
                add.push(sel);
            }
        }
        return {
            result,
            add
        };
    };
    const parseStyle = node => {
        const stl = node.style;
        const style = {};
        for (var i = 0, len = stl.length; i < len; i++) {
            const propName = stl[i];
            const propValue = stl.getPropertyValue(propName);
            const important = stl.getPropertyPriority(propName);
            style[propName] = `${ propValue }${ important ? ` !${ important }` : '' }`;
        }
        return style;
    };
    const parseCondition = node => {
        const condition = node.conditionText || node.media && node.media.mediaText || node.name || node.selectorText || '';
        return condition.trim();
    };
    const createNode = (selectors, style = {}, opts = {}) => {
        const node = {};
        const selLen = selectors.length;
        const lastClass = selectors[selLen - 1];
        const stateArr = lastClass ? lastClass.split(/:(.+)/) : [];
        const state = stateArr[1];
        const {atRule, selectorsAdd, mediaText} = opts;
        const singleAtRule = singleAtRulesNames.indexOf(atRule) >= 0;
        singleAtRule && (node.singleAtRule = 1);
        atRule && (node.atRuleType = atRule);
        selectorsAdd && (node.selectorsAdd = selectorsAdd);
        mediaText && (node.mediaText = mediaText);
        if (state) {
            selectors[selLen - 1] = stateArr[0];
            node.state = state;
            stateArr.splice(stateArr.length - 1, 1);
        }
        node.selectors = selectors;
        node.style = style;
        return node;
    };
    const parseNode = el => {
        var result = [];
        var nodes = el.cssRules || [];
        for (var i = 0, len = nodes.length; i < len; i++) {
            const node = nodes[i];
            const type = node.type.toString();
            let singleAtRule = 0;
            let atRuleType = '';
            let condition = '';
            let sels = node.selectorText || node.keyText;
            const isSingleAtRule = singleAtRules.indexOf(type) >= 0;
            if (isSingleAtRule) {
                singleAtRule = 1;
                atRuleType = atRules[type];
                condition = parseCondition(node);
            } else if (atRuleKeys.indexOf(type) >= 0) {
                var subRules = parseNode(node);
                condition = parseCondition(node);
                for (var s = 0, lens = subRules.length; s < lens; s++) {
                    var subRule = subRules[s];
                    condition && (subRule.mediaText = condition);
                    subRule.atRuleType = atRules[type];
                }
                result = result.concat(subRules);
            }
            if (!sels && !isSingleAtRule)
                continue;
            const style = parseStyle(node);
            const selsParsed = parseSelector(sels);
            const selsAdd = selsParsed.add;
            sels = selsParsed.result;
            let lastRule;
            for (var k = 0, len3 = sels.length; k < len3; k++) {
                const model = createNode(sels[k], style, { atRule: atRules[type] });
                result.push(model);
                lastRule = model;
            }
            if (selsAdd.length) {
                var selsAddStr = selsAdd.join(', ');
                if (lastRule) {
                    lastRule.selectorsAdd = selsAddStr;
                } else {
                    const model = {
                        selectors: [],
                        selectorsAdd: selsAddStr,
                        style
                    };
                    singleAtRule && (model.singleAtRule = singleAtRule);
                    atRuleType && (model.atRuleType = atRuleType);
                    condition && (model.mediaText = condition);
                    result.push(model);
                }
            }
        }
        return result;
    };
    var parser =  str => {
        const el = document.createElement('style');
        el.innerHTML = str;
        document.head.appendChild(el);
        const sheet = el.sheet;
        document.head.removeChild(el);
        return parseNode(sheet);
    };


    parser.parseSelector = parseSelector;
    parser.parseStyle = parseStyle;
    parser.parseCondition = parseCondition;
    parser.createNode = createNode;
    parser.parseNode = parseNode;

    return parser;
});