define([
    'skylark-underscore',
    './config/config',
    './model/HtmlGenerator',
    './model/CssGenerator',
    './model/JsonGenerator',
    './model/JsGenerator',
    './model/CodeMirrorEditor',
    './view/EditorView'
], function (a, defaults, gHtml, gCss, gJson, gJs, eCM, editorView) {
    'use strict';
    return () => {
        var c = {};
        var generators = {}, defGenerators = {}, viewers = {}, defViewers = {};
        const defaultViewer = 'CodeMirror';
        return {
            getConfig() {
                return c;
            },
            config: c,
            EditorView: editorView,
            name: 'CodeManager',
            init(config) {
                c = config || {};
                for (var name in defaults) {
                    if (!(name in c))
                        c[name] = defaults[name];
                }
                var ppfx = c.pStylePrefix;
                if (ppfx)
                    c.stylePrefix = ppfx + c.stylePrefix;
                defGenerators.html = new gHtml();
                defGenerators.css = new gCss();
                defGenerators.json = new gJson();
                defGenerators.js = new gJs();
                defViewers.CodeMirror = new eCM();
                this.loadDefaultGenerators().loadDefaultViewers();
                return this;
            },
            addGenerator(id, generator) {
                generators[id] = generator;
                return this;
            },
            getGenerator(id) {
                return generators[id] || null;
            },
            getGenerators() {
                return generators;
            },
            addViewer(id, viewer) {
                viewers[id] = viewer;
                return this;
            },
            getViewer(id) {
                return viewers[id] || null;
            },
            getViewers() {
                return viewers;
            },
            createViewer(opts = {}) {
                const type = !a.isUndefined(opts.type) ? opts.type : defaultViewer;
                const viewer = this.getViewer(type) && this.getViewer(type).clone();
                const cont = document.createElement('div');
                const txtarea = document.createElement('textarea');
                cont.appendChild(txtarea);
                viewer.set(opts);
                viewer.init(txtarea);
                viewer.setElement(cont);
                return viewer;
            },
            updateViewer(viewer, code) {
                viewer.setContent(code);
            },
            getCode(model, genId, opt = {}) {
                opt.em = c.em;
                var generator = this.getGenerator(genId);
                return generator ? generator.build(model, opt) : '';
            },
            loadDefaultGenerators() {
                for (var id in defGenerators)
                    this.addGenerator(id, defGenerators[id]);
                return this;
            },
            loadDefaultViewers() {
                for (var id in defViewers)
                    this.addViewer(id, defViewers[id]);
                return this;
            }
        };
    };
});