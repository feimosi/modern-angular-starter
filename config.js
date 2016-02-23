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

export const env = process.env.NODE_ENV;
