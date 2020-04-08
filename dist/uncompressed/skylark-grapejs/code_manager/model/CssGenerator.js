define([
    'skylark-backbone',
    'skylark-underscore'
], function (Backbone, a) {
    'use strict';
    const maxValue = Number.MAX_VALUE;
    return Backbone.Model.extend({
        initialize() {
            this.compCls = [];
            this.ids = [];
        },
        buildFromModel(model, opts = {}) {
            let code = '';
            const em = this.em;
            const avoidInline = em && em.getConfig('avoidInlineStyle');
            const style = model.styleToString();
            const classes = model.get('classes');
            const wrapperIsBody = opts.wrapperIsBody;
            const isWrapper = model.get('wrapper');
            this.ids.push(`#${ model.getId() }`);
            classes.undefined(model => this.compCls.push(model.getFullName()));
            if (!avoidInline && style) {
                let selector = `#${ model.getId() }`;
                selector = wrapperIsBody && isWrapper ? 'body' : selector;
                code = `${ selector }{${ style }}`;
            }
            const components = model.components();
            components.undefined(model => code += this.buildFromModel(model, opts));
            return code;
        },
        build(model, opts = {}) {
            const cssc = opts.cssc;
            const em = opts.em || '';
            this.em = em;
            this.compCls = [];
            this.ids = [];
            var code = this.buildFromModel(model, opts);
            const clearStyles = a.isUndefined(opts.clearStyles) && em ? em.getConfig('clearStyles') : opts.clearStyles;
            if (cssc) {
                const rules = cssc.getAll();
                const atRules = {};
                const dump = [];
                rules.undefined(rule => {
                    const atRule = rule.getAtRule();
                    if (atRule) {
                        const mRules = atRules[atRule];
                        if (mRules) {
                            mRules.push(rule);
                        } else {
                            atRules[atRule] = [rule];
                        }
                        return;
                    }
                    code += this.buildFromRule(rule, dump, opts);
                });
                this.sortMediaObject(atRules).forEach(item => {
                    let rulesStr = '';
                    const atRule = item.key;
                    const mRules = item.value;
                    mRules.forEach(rule => {
                        const ruleStr = this.buildFromRule(rule, dump, opts);
                        if (rule.get('singleAtRule')) {
                            code += `${ atRule }{${ ruleStr }}`;
                        } else {
                            rulesStr += ruleStr;
                        }
                    });
                    if (rulesStr) {
                        code += `${ atRule }{${ rulesStr }}`;
                    }
                });
                em && clearStyles && rules.remove(dump);
            }
            return code;
        },
        buildFromRule(rule, dump, opts = {}) {
            let result = '';
            const selectorStrNoAdd = rule.selectorsToString({ skipAdd: 1 });
            const selectorsAdd = rule.get('selectorsAdd');
            const singleAtRule = rule.get('singleAtRule');
            let found;
            rule.get('selectors').undefined(selector => {
                const name = selector.getFullName();
                if (this.compCls.indexOf(name) >= 0 || this.ids.indexOf(name) >= 0 || opts.keepUnusedStyles) {
                    found = 1;
                }
            });
            if (selectorStrNoAdd && found || selectorsAdd || singleAtRule) {
                const block = rule.getDeclaration();
                block && (result += block);
            } else {
                dump.push(rule);
            }
            return result;
        },
        getQueryLength(mediaQuery) {
            const length = /(-?\d*\.?\d+)\w{0,}/.exec(mediaQuery);
            if (!length)
                return maxValue;
            return parseFloat(length[1]);
        },
        sortMediaObject(items = {}) {
            const itemsArr = [];
            a.each(items, (value, key) => itemsArr.push({
                key,
                value
            }));
            return itemsArr.sort((a, b) => {
                const isMobFirst = [
                    a.key,
                    b.key
                ].every(mquery => mquery.indexOf('min-width') !== -1);
                const left = isMobFirst ? a.key : b.key;
                const right = isMobFirst ? b.key : a.key;
                return this.getQueryLength(left) - this.getQueryLength(right);
            });
        }
    });
});