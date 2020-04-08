define([
    'skylark-underscore',
    './BrowserParserCss',
    './BrowserParserCss'
], function (a, BrowserCssParser, b) {
    'use strict';
    return (config = {}) => ({
        parse(str) {
            let result = [];
            const {parserCss, em = {}} = config;
            const editor = em && em.get && em.get('Editor');
            const nodes = parserCss ? parserCss(str, editor) : BrowserCssParser(str);
            nodes.forEach(node => result = result.concat(this.checkNode(node)));
            return result;
        },
        checkNode(node) {
            const {selectors, style} = node;
            if (a.isString(selectors)) {
                const nodes = [];
                const selsParsed = b.parseSelector(selectors);
                const classSets = selsParsed.result;
                const selectorsAdd = selsParsed.add.join(', ');
                const opts = {
                    atRule: node.atRule,
                    mediaText: node.params
                };
                if (classSets.length) {
                    classSets.forEach(classSet => {
                        nodes.push(b.createNode(classSet, style, opts));
                    });
                } else {
                    nodes.push(b.createNode([], style, opts));
                }
                if (selectorsAdd) {
                    const lastNode = nodes[nodes.length - 1];
                    lastNode.selectorsAdd = selectorsAdd;
                }
                node = nodes;
            }
            return node;
        }
    });
});