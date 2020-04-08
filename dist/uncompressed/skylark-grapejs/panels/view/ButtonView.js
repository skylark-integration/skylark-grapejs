define([
    'skylark-backbone',
    'skylark-underscore'
], function (Backbone, a) {
    'use strict';
    const $ = Backbone.$;
    return Backbone.View.extend({
        tagName() {
            return this.model.get('tagName');
        },
        events: { click: 'clicked' },
        initialize(o) {
            var cls = this.model.get('className');
            this.config = o.config || {};
            this.em = this.config.em || {};
            const pfx = this.config.stylePrefix || '';
            const ppfx = this.config.pStylePrefix || '';
            this.pfx = pfx;
            this.ppfx = this.config.pStylePrefix || '';
            this.id = pfx + this.model.get('id');
            this.activeCls = `${ pfx }active ${ ppfx }four-color`;
            this.disableCls = `${ ppfx }disabled`;
            this.btnsVisCls = `${ pfx }visible`;
            this.className = pfx + 'btn' + (cls ? ' ' + cls : '');
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'change:active updateActive', this.updateActive);
            this.listenTo(this.model, 'checkActive', this.checkActive);
            this.listenTo(this.model, 'change:bntsVis', this.updateBtnsVis);
            this.listenTo(this.model, 'change:attributes', this.updateAttributes);
            this.listenTo(this.model, 'change:className', this.updateClassName);
            this.listenTo(this.model, 'change:disable', this.updateDisable);
            if (this.em && this.em.get)
                this.commands = this.em.get('Commands');
        },
        updateClassName() {
            const {model, pfx} = this;
            const cls = model.get('className');
            const attrCls = model.get('attributes').class;
            const classStr = `${ attrCls ? attrCls : '' } ${ pfx }btn ${ cls ? cls : '' }`;
            this.$el.attr('class', classStr.trim());
        },
        updateAttributes() {
            const {em, model, $el} = this;
            const attr = model.get('attributes') || {};
            const title = em && em.t && em.t(`panels.buttons.titles.${ model.id }`);
            $el.attr(attr);
            title && $el.attr({ title });
            this.updateClassName();
        },
        updateBtnsVis() {
            if (!this.$buttons)
                return;
            if (this.model.get('bntsVis'))
                this.$buttons.addClass(this.btnsVisCls);
            else
                this.$buttons.removeClass(this.btnsVisCls);
        },
        updateActive(opts = {}) {
            const {model, commands, $el, activeCls} = this;
            const {fromCollection} = opts;
            const context = model.get('context');
            const options = model.get('options');
            const commandName = model.get('command');
            let command = {};
            if (commands && a.isString(commandName)) {
                command = commands.get(commandName) || {};
            } else if (a.isFunction(commandName)) {
                command = commands.create({ run: commandName });
            } else if (commandName !== null && a.isObject(commandName)) {
                command = commands.create(commandName);
            }
            if (model.get('active')) {
                !fromCollection && model.collection.deactivateAll(context, model);
                model.set('active', true, { silent: true }).trigger('checkActive');
                commands.runCommand(command, {
                    ...options,
                    sender: model
                });
                command.noStop && model.set('active', false);
            } else {
                $el.removeClass(activeCls);
                commands.stopCommand(command, {
                    ...options,
                    sender: model,
                    force: 1
                });
            }
        },
        updateDisable() {
            const {disableCls, model} = this;
            const disable = model.get('disable');
            this.$el[disable ? 'addClass' : 'removeClass'](disableCls);
        },
        checkActive() {
            const {model, $el, activeCls} = this;
            model.get('active') ? $el.addClass(activeCls) : $el.removeClass(activeCls);
        },
        clicked(e) {
            if (this.model.get('bntsVis'))
                return;
            if (this.model.get('disable'))
                return;
            this.toggleActive();
        },
        toggleActive() {
            const {model} = this;
            const {active, togglable} = model.attributes;
            if (active && !togglable)
                return;
            model.set('active', !active);
            var command = this.em.get('Commands').get('select-comp');
            if (active) {
                if (model.get('runDefaultCommand'))
                    this.em.runDefault();
            } else {
                if (model.get('stopDefaultCommand'))
                    this.em.stopDefault();
            }
        },
        render() {
            const label = this.model.get('label');
            const {$el} = this;
            $el.empty();
            this.updateAttributes();
            label && $el.append(label);
            this.checkActive();
            this.updateDisable();
            return this;
        }
    });
});