module.exports = {
    env: {
        browser: true,
        jasmine: true,
        mocha: true,
    },
    globals: {
        inject: true,
    },
    extends: [
        'airbnb/base',
    ],
    rules: {
        camelcase: [2, {
            properties: 'always',
        }],
        indent: [2, 4],
        strict: [2, 'never'],
        'func-names': 0,
        'id-length': [2, {
            min: 2,
            properties: 'never',
            exceptions: ['i', 'j', 'x', 'y', '$', '_'],
        }],
    },
};
