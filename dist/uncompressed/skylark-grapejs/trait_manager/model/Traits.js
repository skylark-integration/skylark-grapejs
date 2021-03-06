define([
    'skylark-backbone',
    'skylark-underscore',
    './Trait',
    './TraitFactory'
], function (Backbone, a, Trait, TraitFactory) {
    'use strict';
    return Backbone.Collection.extend({
        model: Trait,
        initialize(coll, options = {}) {
            this.em = options.em || '';
            this.listenTo(this, 'add', this.handleAdd);
            this.listenTo(this, 'reset', this.handleReset);
        },
        handleReset(coll, {
            previousModels = []
        } = {}) {
            previousModels.forEach(model => model.trigger('remove'));
        },
        handleAdd(model) {
            const target = this.target;
            if (target) {
                model.target = target;
            }
        },
        setTarget(target) {
            this.target = target;
        },
        add(models, opt) {
            const em = this.em;
            if (a.isString(models) || a.isArray(models)) {
                const tm = em && em.get && em.get('TraitManager');
                const tmOpts = tm && tm.getConfig();
                const tf = TraitFactory(tmOpts);
                if (a.isString(models)) {
                    models = [models];
                }
                for (var i = 0, len = models.length; i < len; i++) {
                    const str = models[i];
                    const model = a.isString(str) ? tf.build(str)[0] : str;
                    model.target = this.target;
                    models[i] = model;
                }
            }
            return Backbone.Collection.prototype.add.apply(this, [
                models,
                opt
            ]);
        }
    });
});