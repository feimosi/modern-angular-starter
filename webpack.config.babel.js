// Webpack
import webpack from 'webpack';
import CommonsChunkPlugin from 'webpack/lib/optimize/CommonsChunkPlugin';
import DedupePlugin from 'webpack/lib/optimize/DedupePlugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import OccurrenceOrderPlugin from 'webpack/lib/optimize/OccurrenceOrderPlugin';
import UglifyJsPlugin from 'webpack/lib/optimize/UglifyJsPlugin';

// PostCSS
import autoprefixer from 'autoprefixer';
import postcssImport from 'postcss-import';
import precss from 'precss';
import stylelint from 'stylelint';

// Config
import { paths, serverUrl, env } from './config';

const hash = env === 'production' ? '-[hash:8]' : '';
const extractVendor = new ExtractTextPlugin(`${paths.build.css}vendor${hash}.css`);
const extractSCSS = new ExtractTextPlugin(`${paths.build.css}main${hash}.css`);

const commonConfig = {
    context: paths.appAbsolute,
    entry: {
        [`${paths.build.js.app}main`]: './app.module.js',
    },
    output: {
        path: paths.buildAbsolute,
        filename: `[name]${hash}.js`,
    },
    module: {
        preLoaders: [
            { test: /\.js$/, exclude: /node_modules/, loader: 'eslint-loader' },
        ],
        loaders: [
            { test: /\.js$/, exclude: /node_modules/, loaders: ['ng-annotate', 'babel'] },
            { test: /\.css$/, loader: extractVendor.extract('css') },
            { test: /\.scss$/, loader: extractSCSS.extract('css!postcss') },
            { test: /\.html$/, loader: 'raw' },
            { test: /\.jade$/, loader: 'jade' },
            { test: /\.json$/, loader: 'json' },
            { test: /\.(png|jpg|gif)$/, loader: `url?limit=10000&name=img/[name]${hash}.[ext]` },
            { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file' },
            {
                test: /\.woff(2)?(\?v=\d+\.\d+\.\d+)?$/, loader:
                'url?limit=100000&mimetype=application/font-woff',
            }, {
                test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url?limit=10000&mimetype=application/octet-stream',
            }, {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url?limit=10000&mimetype=image/svg+xml',
            },
        ],
    },
    resolve: {
        root: [
            paths.appAbsolute,
        ],
    },
    postcss() {
        return [stylelint,
                postcssImport({ addDependencyTo: webpack }),
                autoprefixer,
                precss];
    },
    plugins: [
        extractVendor,
        extractSCSS,
    ],
    devServer: {
        proxy: {
            '/api/*': {
                target: serverUrl,
            },
        },
        historyApiFallback: true,
    },
};

const developmentConfig = (config) => {
    const devConfig = Object.assign({}, config);
    devConfig.devtool = 'source-map';
    devConfig.debug = true;
    return devConfig;
};

const productionConfig = (config) => {
    const prodConfig = Object.assign({}, config);
    prodConfig.devtool = false;
    prodConfig.debug = false;
    prodConfig.entry.vendor = ['babel-polyfill', 'angular', 'angular-animate',
                               'angular-aria', 'angular-material'];
    prodConfig.plugins.push(
        new DedupePlugin(),
        new OccurrenceOrderPlugin(true),
        new UglifyJsPlugin({
            output: {
                comments: false,
            },
            compress: {
                warnings: false,
            },
        }),
        new CommonsChunkPlugin({
            name: 'vendor',
            filename: `${paths.build.js.vendor}vendor${hash}.js`,
            minChunks: Infinity,
        })
    );
    return prodConfig;
};

export default env === 'production' ?
    productionConfig(commonConfig) : developmentConfig(commonConfig);
