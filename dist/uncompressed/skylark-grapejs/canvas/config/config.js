define(function () {
    'use strict';
    return {
        stylePrefix: 'cv-',
        scripts: [],
        styles: [],
        customBadgeLabel: '',
        autoscrollLimit: 50,
        notTextable: [
            'button',
            'a',
            'input[type=checkbox]',
            'input[type=radio]'
        ]
    };
});