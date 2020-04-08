define([
    'skylark-underscore',
    './config/config',
    './model/CssRule',
    './model/CssRules',
    './view/CssRulesView',
    '../../selector_manager/model/Selectors',
    '../../selector_manager/model/Selector'
], function (a, defaults, CssRule, CssRules, CssRulesView, Selectors, Selector) {
    'use strict';
    return () => {
        let em;
        var c = {};
        var rules, rulesView;
        return {
            Selectors,
            name: 'CssComposer',
            getConfig() {
                return c;
            },
            storageKey() {
                var keys = [];
                var smc = c.stm && c.stm.getConfig() || {};
                if (smc.storeCss)
                    keys.push('css');
                if (smc.storeStyles)
                    keys.push('styles');
                return keys;
            },
            init(config) {
                c = config || {};
                for (var name in defaults) {
                    if (!(name in c))
                        c[name] = defaults[name];
                }
                var ppfx = c.pStylePrefix;
                if (ppfx)
                    c.stylePrefix = ppfx + c.stylePrefix;
                var elStyle = c.em && c.em.config.style || '';
                c.rules = elStyle || c.rules;
                em = c.em;
                rules = new CssRules([], c);
                rulesView = new CssRulesView({
                    collection: rules,
                    config: c
                });
                return this;
            },
            onLoad() {
                rules.add(c.rules);
            },
            postLoad(em) {
                const ev = 'add remove';
                const rules = this.getAll();
                const um = em.get('UndoManager');
                um && um.add(rules);
                em.stopListening(rules, ev, this.handleChange);
                em.listenTo(rules, ev, this.handleChange);
                rules.each(rule => this.handleChange(rule, { avoidStore: 1 }));
            },
            handleChange(model, opts = {}) {
                const ev = 'change:style';
                const um = em.get('UndoManager');
                um && um.add(model);
                const handleUpdates = em.handleUpdates.bind(em);
                em.stopListening(model, ev, handleUpdates);
                em.listenTo(model, ev, handleUpdates);
                !opts.avoidStore && handleUpdates('', '', opts);
            },
            load(data) {
                var d = data || '';
                if (!d && c.stm) {
                    d = c.em.getCacheLoad();
                }
                var obj = d.styles || '';
                if (d.styles) {
                    try {
                        obj = JSON.parse(d.styles);
                    } catch (err) {
                    }
                } else if (d.css) {
                    obj = c.em.get('Parser').parseCss(d.css);
                }
                if (a.isArray(obj)) {
                    obj.length && rules.reset(obj);
                } else if (obj) {
                    rules.reset(obj);
                }
                return obj;
            },
            store(noStore) {
                if (!c.stm)
                    return;
                var obj = {};
                var keys = this.storageKey();
                if (keys.indexOf('css') >= 0)
                    obj.css = c.em.getCss();
                if (keys.indexOf('styles') >= 0)
                    obj.styles = JSON.stringify(rules);
                if (!noStore)
                    c.stm.store(obj);
                return obj;
            },
            add(selectors, state, width, opts = {}) {
                var s = state || '';
                var w = width || '';
                var opt = { ...opts };
                var rule = this.get(selectors, s, w, opt);
                if (rule && rule.config && !rule.config.singleAtRule) {
                    return rule;
                } else {
                    opt.state = s;
                    opt.mediaText = w;
                    opt.selectors = '';
                    rule = new CssRule(opt, c);
                    rule.get('selectors').add(selectors);
                    rules.add(rule);
                    return rule;
                }
            },
            get(selectors, state, width, ruleProps) {
                var rule = null;
                rules.each(m => {
                    if (rule)
                        return;
                    if (m.compare(selectors, state, width, ruleProps))
                        rule = m;
                });
                return rule;
            },
            getAll() {
                return rules;
            },
            clear() {
                this.getAll().reset();
                return this;
            },
            addCollection(data, opts = {}) {
                var result = [];
                var d = data instanceof Array ? data : [data];
                for (var i = 0, l = d.length; i < l; i++) {
                    var rule = d[i] || {};
                    if (!rule.selectors)
                        continue;
                    var sm = c.em && c.em.get('SelectorManager');
                    if (!sm)
                        console.warn('Selector Manager not found');
                    var sl = rule.selectors;
                    var sels = sl instanceof Array ? sl : [sl];
                    var newSels = [];
                    for (var j = 0, le = sels.length; j < le; j++) {
                        var selec = sm.add(sels[j]);
                        newSels.push(selec);
                    }
                    var modelExists = this.get(newSels, rule.state, rule.mediaText, rule);
                    var model = this.add(newSels, rule.state, rule.mediaText, rule);
                    var updateStyle = !modelExists || !opts.avoidUpdateStyle;
                    const style = rule.style || {};
                    if (updateStyle) {
                        let styleUpdate = opts.extend ? {
                            ...model.get('style'),
                            ...style
                        } : style;
                        model.set('style', styleUpdate);
                    }
                    result.push(model);
                }
                return result;
            },
            setRule(selectors, style, opts = {}) {
                const {atRuleType, atRuleParams} = opts;
                const node = em.get('Parser').parserCss.checkNode({
                    selectors,
                    style
                })[0];
                const {state, selectorsAdd} = node;
                const sm = em.get('SelectorManager');
                const selector = sm.add(node.selectors);
                const rule = this.add(selector, state, atRuleParams, {
                    selectorsAdd,
                    atRule: atRuleType
                });
                rule.setStyle(style, opts);
                return rule;
            },
            getRule(selectors, opts = {}) {
                const sm = em.get('SelectorManager');
                const node = em.get('Parser').parserCss.checkNode({ selectors })[0];
                const selector = sm.get(node.selectors);
                const {state, selectorsAdd} = node;
                const {atRuleType, atRuleParams} = opts;
                return selector && this.get(selector, state, atRuleParams, {
                    selectorsAdd,
                    atRule: atRuleType
                });
            },
            setIdRule(name, style = {}, opts = {}) {
                const state = opts.state || '';
                const media = opts.mediaText || em.getCurrentMedia();
                const sm = em.get('SelectorManager');
                const selector = sm.add({
                    name,
                    type: Selector.TYPE_ID
                });
                const rule = this.add(selector, state, media);
                rule.setStyle(style, opts);
                return rule;
            },
            getIdRule(name, opts = {}) {
                const state = opts.state || '';
                const media = opts.mediaText || em.getCurrentMedia();
                const selector = em.get('SelectorManager').get(name, Selector.TYPE_ID);
                return selector && this.get(selector, state, media);
            },
            setClassRule(name, style = {}, opts = {}) {
                const state = opts.state || '';
                const media = opts.mediaText || em.getCurrentMedia();
                const sm = em.get('SelectorManager');
                const selector = sm.add({
                    name,
                    type: Selector.TYPE_CLASS
                });
                const rule = this.add(selector, state, media);
                rule.setStyle(style, opts);
                return rule;
            },
            getClassRule(name, opts = {}) {
                const state = opts.state || '';
                const media = opts.mediaText || em.getCurrentMedia();
                const selector = em.get('SelectorManager').get(name, Selector.TYPE_CLASS);
                return selector && this.get(selector, state, media);
            },
            render() {
                return rulesView.render().el;
            }
        };
    };
});