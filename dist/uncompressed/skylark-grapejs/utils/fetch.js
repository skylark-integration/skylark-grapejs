define([
], function () {
    'use strict';
    return typeof fetch == 'function' ? fetch.bind() : (url, options) => {
        return new Promise((res, rej) => {
            const req = new XMLHttpRequest();
            req.open(options.method || 'get', url);
            req.withCredentials = options.credentials == 'include';
            for (let k in options.headers || {}) {
                req.setRequestHeader(k, options.headers[k]);
            }
            req.onload = e => res({
                status: req.status,
                statusText: req.statusText,
                text: () => Promise.resolve(req.responseText)
            });
            req.onerror = rej;
            if (req.upload && options.onProgress) {
                req.upload.onprogress = options.onProgress;
            }
            options.body ? req.send(options.body) : req.send();
        });
    };
});