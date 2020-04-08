define([
    "skylark-langx/langx",
    'skylark-underscore',
    './config/config',
    './model/Sectors',
    './model/Properties',
    './view/SectorsView'
], function (langx,_, defaults, Sectors, Properties, SectorsView) {
    'use strict';
    return () => {
        var c = {};
        let properties;
        var sectors, SectView;
        return {
            name: 'StyleManager',
            getConfig() {
                return c;
            },
            init(config) {
                c = langx.mxinin({},defaults,conf);
                const ppfx = c.pStylePrefix;
                this.em = c.em;
                if (ppfx)
                    c.stylePrefix = ppfx + c.stylePrefix;
                properties = new Properties();
                sectors = new Sectors([], c);
                SectView = new SectorsView({
                    collection: sectors,
                    target: c.em,
                    config: c
                });
                return this;
            },
            onLoad() {
                sectors.add(c.sectors);
            },
            postRender() {
                const elTo = this.getConfig().appendTo;
                if (elTo) {
                    const el = _.isElement(elTo) ? elTo : document.querySelector(elTo);
                    el.appendChild(this.render());
                }
            },
            addSector(id, sector, opts = {}) {
                let result = this.getSector(id);
                if (!result) {
                    sector.id = id;
                    result = sectors.add(sector, opts);
                }
                return result;
            },
            getSector(id, opts = {}) {
                const res = sectors.where({ id })[0];
                !res && opts.warn && this._logNoSector(id);
                return res;
            },
            removeSector(id) {
                return this.getSectors().remove(this.getSector(id, { warn: 1 }));
            },
            getSectors() {
                return sectors;
            },
            addProperty(sectorId, property, opts = {}) {
                const sector = this.getSector(sectorId, { warn: 1 });
                let prop = null;
                if (sector)
                    prop = sector.get('properties').add(property, opts);
                return prop;
            },
            getProperty(sectorId, name) {
                const sector = this.getSector(sectorId, { warn: 1 });
                let prop = null;
                if (sector) {
                    prop = sector.get('properties').where({ property: name });
                    prop = prop.length == 1 ? prop[0] : prop;
                }
                return prop;
            },
            removeProperty(sectorId, name) {
                const props = this.getProperties(sectorId);
                return props && props.remove(this.getProperty(sectorId, name));
            },
            getProperties(sectorId) {
                let props = null;
                const sector = this.getSector(sectorId, { warn: 1 });
                if (sector)
                    props = sector.get('properties');
                return props;
            },
            getModelToStyle(model, options = {}) {
                const em = c.em;
                const {skipAdd} = options;
                const classes = model.get('classes');
                const id = model.getId();
                if (em) {
                    const config = em.getConfig();
                    const um = em.get('UndoManager');
                    const cssC = em.get('CssComposer');
                    const sm = em.get('SelectorManager');
                    const smConf = sm ? sm.getConfig() : {};
                    const state = !config.devicePreviewMode ? em.get('state') : '';
                    const valid = classes.getStyleable();
                    const hasClasses = valid.length;
                    const useClasses = !smConf.componentFirst || options.useClasses;
                    const opts = { state };
                    let rule;
                    um.stop();
                    if (hasClasses && useClasses) {
                        const deviceW = em.getCurrentMedia();
                        rule = cssC.get(valid, state, deviceW);
                        if (!rule && !skipAdd) {
                            rule = cssC.add(valid, state, deviceW);
                        }
                    } else if (config.avoidInlineStyle) {
                        rule = cssC.getIdRule(id, opts);
                        !rule && !skipAdd && (rule = cssC.setIdRule(id, {}, opts));
                        if (model.is('wrapper'))
                            rule.set('wrapper', 1);
                    }
                    rule && (model = rule);
                    um.start();
                }
                return model;
            },
            addType(id, definition) {
                properties.addType(id, definition);
            },
            getType(id) {
                return properties.getType(id);
            },
            getTypes() {
                return properties.getTypes();
            },
            createType(id, {model = {}, view = {}} = {}) {
                const type = this.getType(id);
                if (type) {
                    return new type.view(
                        langx.mixin({
                            model: new type.model(model),
                            config: c,
                        },view)
                    );
                }
            },
            setTarget(target, opts) {
                return SectView.setTarget(target, opts);
            },
            getEmitter() {
                return SectView.propTarget;
            },
            render() {
                return SectView.render().el;
            },
            _logNoSector(sectorId) {
                const {em} = this;
                em && em.logWarning(`'${ sectorId }' sector not found`);
            }
        };
    };
});