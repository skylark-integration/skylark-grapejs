define(function () {
    'use strict';
    return {
        run(ed, snd, opts = {}) {
            if (!ed.Canvas.hasFocus() && !opts.force)
                return;
            const toSelect = [];
            ed.getSelectedAll().forEach(component => {
                let next = component.parent();
                while (next && !next.get('selectable')) {
                    next = next.parent();
                }
                next && toSelect.push(next);
            });
            toSelect.length && ed.select(toSelect);
        }
    };
});