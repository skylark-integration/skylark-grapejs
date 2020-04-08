define([
    "skylark-langx",
    'skylark-jquery',
    './config/config',
    './model/Editor',
    './view/EditorView'
], function (langx,$, defaults, EditorModel, EditorView) {
    'use strict';
    return (config = {}) => {

        const c = langx.mixin(
            {},
            defaults,
            config
        );

        c.pStylePrefix = c.stylePrefix;

        var em = new EditorModel(c);

        var editorView = new EditorView({
            model: em,
            config: c
        });
        
        return {
            $,
            editor: em,
            I18n: em.get('I18n'),
            DomComponents: em.get('DomComponents'),
            LayerManager: em.get('LayerManager'),
            CssComposer: em.get('CssComposer'),
            StorageManager: em.get('StorageManager'),
            AssetManager: em.get('AssetManager'),
            BlockManager: em.get('BlockManager'),
            TraitManager: em.get('TraitManager'),
            SelectorManager: em.get('SelectorManager'),
            CodeManager: em.get('CodeManager'),
            Commands: em.get('Commands'),
            Keymaps: em.get('Keymaps'),
            Modal: em.get('Modal'),
            Panels: em.get('Panels'),
            StyleManager: em.get('StyleManager'),
            Canvas: em.get('Canvas'),
            UndoManager: em.get('UndoManager'),
            DeviceManager: em.get('DeviceManager'),
            RichTextEditor: em.get('RichTextEditor'),
            Parser: em.get('Parser'),
            Utils: em.get('Utils'),
            Config: em.get('Config'),
            init() {
                em.init(this);
                em.on('loaded', () => {
                    this.UndoManager.clear();
                    em.get('modules').forEach(module => {
                        module.postRender && module.postRender(editorView);
                    });
                });
                return this;
            },
            getConfig(prop) {
                return em.getConfig(prop);
            },
            getHtml(opts) {
                return em.getHtml(opts);
            },
            getCss(opts) {
                return em.getCss(opts);
            },
            getJs() {
                return em.getJs();
            },
            getComponents() {
                return em.get('DomComponents').getComponents();
            },
            getWrapper() {
                return em.get('DomComponents').getWrapper();
            },
            setComponents(components) {
                em.setComponents(components);
                return this;
            },
            addComponents(components, opts) {
                return this.getWrapper().append(components, opts);
            },
            getStyle() {
                return em.get('CssComposer').getAll();
            },
            setStyle(style) {
                em.setStyle(style);
                return this;
            },
            getSelected() {
                return em.getSelected();
            },
            getSelectedAll() {
                return em.getSelectedAll();
            },
            getSelectedToStyle() {
                let selected = em.getSelected();
                if (selected) {
                    return this.StyleManager.getModelToStyle(selected);
                }
            },
            select(el, opts) {
                em.setSelected(el, opts);
                return this;
            },
            selectAdd(el) {
                em.addSelected(el);
                return this;
            },
            selectRemove(el) {
                em.removeSelected(el);
                return this;
            },
            selectToggle(el) {
                em.toggleSelected(el);
                return this;
            },
            setDevice(name) {
                em.set('device', name);
                return this;
            },
            getDevice() {
                return em.get('device');
            },
            runCommand(id, options = {}) {
                return em.get('Commands').run(id, options);
            },
            stopCommand(id, options = {}) {
                return em.get('Commands').stop(id, options);
            },
            store(clb) {
                return em.store(clb);
            },
            load(clb) {
                return em.load(clb);
            },
            getContainer() {
                return c.el;
            },
            getDirtyCount() {
                return em.getDirtyCount();
            },
            refresh() {
                em.refreshCanvas();
            },
            setCustomRte(obj) {
                this.RichTextEditor.customRte = obj;
            },
            setCustomParserCss(parser) {
                this.Parser.getConfig().parserCss = parser;
                return this;
            },
            setDragMode(value) {
                em.setDragMode(value);
                return this;
            },
            log(msg, opts = {}) {
                em.log(msg, opts);
                return this;
            },
            t(...args) {
                return em.t(...args);
            },
            on(event, callback) {
                em.on(event, callback);
                return this;
            },
            once(event, callback) {
                em.once(event, callback);
                return this;
            },
            off(event, callback) {
                em.off(event, callback);
                return this;
            },
            trigger(event) {
                em.trigger.apply(em, arguments);
                return this;
            },
            destroy() {
                return em.destroyAll();
            },
            getEl() {
                return editorView.el;
            },
            getModel() {
                return em;
            },
            render() {
                editorView.render();
                return editorView.el;
            }
        };
    };
});