define([
    "skylark-langx/langx",
    'skylark-backbone',
    'skylark-underscore'
], function (langx,Backbone, _) {
    'use strict';
    let Component;
    return Backbone.Collection.extend({
        initialize(models, opt = {}) {
            this.opt = opt;
            this.listenTo(this, 'add', this.onAdd);
            this.config = opt.config;
            this.em = opt.em;
            const {em} = this;
            this.model = (attrs, options) => {
                var model;
                const df = opt.em.get('DomComponents').componentTypes;
                options.em = opt.em;
                options.config = opt.config;
                options.componentTypes = df;
                options.domc = opt.domc;
                for (var it = 0; it < df.length; it++) {
                    var dfId = df[it].id;
                    if (dfId == attrs.type) {
                        model = df[it].model;
                        break;
                    }
                }
                if (!model) {
                    model = df[df.length - 1].model;
                    em && attrs.type && em.logWarning(`Component type '${ attrs.type }' not found`, {
                        attrs,
                        options
                    });
                }
                return new model(attrs, options);
            };
        },
        parseString(value, opt = {}) {
            const {em} = this;
            const {domc} = this.opt;
            const cssc = em.get('CssComposer');
            const parsed = em.get('Parser').parseHtml(value);
            if (!Component)
                Component = require('./Component').default;
            Component.checkId(parsed.html, parsed.css, domc.componentsById);
            if (parsed.css && cssc && !opt.temporary) {
                cssc.addCollection(parsed.css, langx.mixin({},opt,{
                    extend: 1
                }));
            }
            return parsed.html;
        },
        add(models, opt = {}) {
            if (_.isString(models)) {
                models = this.parseString(models, opt);
            } else if (_.isArray(models)) {
                models.forEach((item, index) => {
                    if (_.isString(item)) {
                        models[index] = this.parseString(item, opt);
                    }
                });
            }
            const isMult = _.isArray(models);
            models = (isMult ? models : [models]).filter(i => i).map(model => this.processDef(model));
            models = isMult ? models : models[0];
            return Backbone.Collection.prototype.add.apply(this, [
                models,
                opt
            ]);
        },
        processDef(mdl) {
            if (mdl.cid && mdl.ccid)
                return mdl;
            const {em, config = {}} = this;
            const {processor} = config;
            let model = mdl;
            if (processor) {
                model = { ...model };
                const modelPr = processor(model);
                if (modelPr) {
                    _.each(model, (val, key) => delete model[key]);
                    _.extend(model, modelPr);
                }
            }
            if (model.$$typeof && typeof model.props == 'object') {
                model = { ...model };
                model.props = { ...model.props };
                const domc = em.get('DomComponents');
                const parser = em.get('Parser');
                const {parserHtml} = parser;
                _.each(model, (value, key) => {
                    if (!_.includes([
                            'props',
                            'type'
                        ], key))
                        delete model[key];
                });
                const {props} = model;
                const comps = props.children;
                delete props.children;
                delete model.props;
                const res = parserHtml.splitPropsFromAttr(props);
                model.attributes = res.attrs;
                if (comps) {
                    model.components = comps;
                }
                if (!model.type) {
                    model.type = 'textnode';
                } else if (!domc.getType(model.type)) {
                    model.tagName = model.type;
                    delete model.type;
                }
                _.extend(model, res.props);
            }
            return model;
        },
        onAdd(model, c, opts = {}) {
            const em = this.em;
            const style = model.getStyle();
            const avoidInline = em && em.getConfig('avoidInlineStyle');
            if (!_.isEmpty(style) && !avoidInline && em && em.get && em.getConfig('forceClass') && !opts.temporary) {
                const name = model.cid;
                const rule = em.get('CssComposer').setClassRule(name, style);
                model.setStyle({});
                model.addClass(name);
            }
        }
    });
});