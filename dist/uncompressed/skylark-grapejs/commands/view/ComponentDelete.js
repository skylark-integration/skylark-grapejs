define(['skylark-underscore'], function (a) {
    'use strict';
    return {
        run(ed, sender, opts = {}) {
            let components = opts.component || ed.getSelectedAll();
            components = a.isArray(components) ? [...components] : [components];
            ed.select(null);
            components.forEach(component => {
                if (!component || !component.get('removable')) {
                    return this.em.logWarning('The element is not removable', { component });
                }
                component.remove();
            });
            return components;
        }
    };
});