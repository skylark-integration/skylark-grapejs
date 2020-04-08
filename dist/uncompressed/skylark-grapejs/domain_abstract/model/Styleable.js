define([
    'skylark-underscore',
    '../../utils/mixins',
    '../../parser/model/ParserHtml'
], function (a, b, ParserHtml) {
    'use strict';
    const parseStyle = ParserHtml().parseStyle;
    return {
        parseStyle,
        extendStyle(prop) {
            return {
                ...this.getStyle(),
                ...prop
            };
        },
        getStyle() {
            const style = this.get('style') || {};
            return { ...style };
        },
        setStyle(prop = {}, opts = {}) {
            if (a.isString(prop)) {
                prop = parseStyle(prop);
            }
            const propOrig = this.getStyle();
            const propNew = { ...prop };
            this.set('style', propNew, opts);
            const diff = b.shallowDiff(propOrig, propNew);
            a.keys(diff).forEach(pr => {
                const em = this.em;
                this.trigger(`change:style:${ pr }`);
                if (em) {
                    em.trigger(`styleable:change`, this, pr);
                    em.trigger(`styleable:change:${ pr }`, this, pr);
                }
            });
            return propNew;
        },
        addStyle(prop, value = '', opts = {}) {
            if (typeof prop == 'string') {
                prop = { prop: value };
            } else {
                opts = value || {};
            }
            prop = this.extendStyle(prop);
            this.setStyle(prop, opts);
        },
        removeStyle(prop) {
            let style = this.getStyle();
            delete style[prop];
            this.setStyle(style);
        },
        styleToString(opts = {}) {
            const result = [];
            const style = this.getStyle();
            for (let prop in style) {
                const imp = opts.important;
                const important = a.isArray(imp) ? imp.indexOf(prop) >= 0 : imp;
                const value = `${ style[prop] }${ important ? ' !important' : '' }`;
                const propPrv = prop.substr(0, 2) == '__';
                value && !propPrv && result.push(`${ prop }:${ value };`);
            }
            return result.join('');
        },
        getSelectors() {
            return this.get('selectors') || this.get('classes');
        },
        getSelectorsString() {
            return this.selectorsToString ? this.selectorsToString() : this.getSelectors().getFullString();
        }
    };
});