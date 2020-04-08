define([
    'skylark-underscore',
    'skylark-backbone',
    '../../domain_abstract/model/Styleable',
    '../../selector_manager/model/Selectors'
], function (a, Backbone, Styleable, Selectors) {
    'use strict';
    const {CSS} = window;
    return Backbone.Model.extend(Styleable).extend({
        defaults: {
            selectors: {},
            selectorsAdd: '',
            style: {},
            mediaText: '',
            state: '',
            stylable: true,
            atRuleType: '',
            singleAtRule: 0,
            important: 0
        },
        initialize(c, opt = {}) {
            this.config = c || {};
            const em = opt.em;
            let selectors = this.config.selectors || [];
            this.em = em;
            if (em) {
                const sm = em.get('SelectorManager');
                const slct = [];
                selectors.undefined(selector => {
                    slct.push(sm.add(selector));
                });
                selectors = slct;
            }
            this.set('selectors', new Selectors(selectors));
        },
        getAtRule() {
            const type = this.get('atRuleType');
            const condition = this.get('mediaText');
            const typeStr = type ? `@${ type }` : condition ? '@media' : '';
            return typeStr + (condition && typeStr ? ` ${ condition }` : '');
        },
        selectorsToString(opts = {}) {
            const result = [];
            const {em} = this;
            const state = this.get('state');
            const wrapper = this.get('wrapper');
            const addSelector = this.get('selectorsAdd');
            const isBody = wrapper && em && em.getConfig('wrapperIsBody');
            const selOpts = { escape: str => CSS && CSS.escape ? CSS.escape(str) : str };
            const selectors = isBody ? 'body' : this.get('selectors').getFullString(0, selOpts);
            const stateStr = state && !opts.skipState ? `:${ state }` : '';
            selectors && result.push(`${ selectors }${ stateStr }`);
            addSelector && !opts.skipAdd && result.push(addSelector);
            return result.join(', ');
        },
        getDeclaration(opts = {}) {
            let result = '';
            const selectors = this.selectorsToString();
            const style = this.styleToString(opts);
            const singleAtRule = this.get('singleAtRule');
            if ((selectors || singleAtRule) && style) {
                result = singleAtRule ? style : `${ selectors }{${ style }}`;
            }
            return result;
        },
        toCSS(opts = {}) {
            let result = '';
            const atRule = this.getAtRule();
            const block = this.getDeclaration(opts);
            block && (result = block);
            if (atRule && result) {
                result = `${ atRule }{${ result }}`;
            }
            return result;
        },
        toJSON(...args) {
            const obj = Backbone.Model.prototype.toJSON.apply(this, args);
            if (this.em.getConfig('avoidDefaults')) {
                const defaults = this.defaults;
                a.forEach(defaults, (value, key) => {
                    if (obj[key] === value) {
                        delete obj[key];
                    }
                });
                if (a.isEmpty(obj.selectors))
                    delete obj.selectors;
                if (a.isEmpty(obj.style))
                    delete obj.style;
            }
            return obj;
        },
        compare(selectors, state, width, ruleProps = {}) {
            var st = state || '';
            var wd = width || '';
            var selectorsAdd = ruleProps.selectorsAdd || '';
            var atRuleType = ruleProps.atRuleType || '';
            var cId = 'cid';
            if (!(selectors instanceof Array) && !selectors.models)
                selectors = [selectors];
            var a1 = a.map(selectors.models || selectors, model => model.get('name'));
            var a2 = a.map(this.get('selectors').models, model => model.get('name'));
            var f = false;
            if (a1.length !== a2.length)
                return f;
            for (var i = 0; i < a1.length; i++) {
                var re = 0;
                for (var j = 0; j < a2.length; j++) {
                    if (a1[i] === a2[j])
                        re = 1;
                }
                if (re === 0)
                    return f;
            }
            if (this.get('state') !== st || this.get('mediaText') !== wd || this.get('selectorsAdd') !== selectorsAdd || this.get('atRuleType') !== atRuleType) {
                return f;
            }
            return true;
        }
    });
});