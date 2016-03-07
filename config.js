import path from 'path';

export const paths = {
    appAbsolute: path.resolve('src', 'app'),
    buildAbsolute: path.resolve('build'),
    build: {
        js: {
            app: 'js/app/',
            vendor: 'js/vendor/',
        },
        css: 'css/',
    },
};

export const serverUrl = 'http://127.0.0.1:8080';

export const env = process.env.NODE_ENV;
