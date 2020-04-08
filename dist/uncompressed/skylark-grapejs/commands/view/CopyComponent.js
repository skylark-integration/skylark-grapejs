define(function () {
    'use strict';
    return {
        run(ed) {
            const em = ed.getModel();
            const models = [...ed.getSelectedAll()];
            if (models.length) {
                em.set('clipboard', models);
            }
        }
    };
});