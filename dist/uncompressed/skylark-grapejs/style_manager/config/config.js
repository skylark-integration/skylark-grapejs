define(function () {
    'use strict';
    return {
        stylePrefix: 'sm-',
        sectors: [],
        appendTo: '',
        hideNotStylable: true,
        highlightChanged: true,
        highlightComputed: true,
        showComputed: true,
        clearProperties: 0,
        avoidComputed: [
            'width',
            'height'
        ]
    };
});