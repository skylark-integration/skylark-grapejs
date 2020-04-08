define(function () {
    'use strict';
    return {
        id: 'gjs-',
        autosave: 1,
        autoload: 1,
        type: 'local',
        stepsBeforeSave: 1,
        storeComponents: 1,
        storeStyles: 1,
        storeHtml: 1,
        storeCss: 1,
        checkLocal: 1,
        params: {},
        headers: {},
        urlStore: '',
        urlLoad: '',
        beforeSend(jqXHR, settings) {
        },
        onComplete(jqXHR, status) {
        },
        contentTypeJson: true,
        credentials: 'include',
        fetchOptions: ''
    };
});