const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const inDevelopment = process.env.NODE_ENV === 'development';
const axios = require('axios');
const webpack = require('webpack');
const fs = require('fs');
const path = require('path');
const packageJson = require('./package.json');
const componentName = packageJson.componentNmae;

module.exports = {
    css: {
        extract: true
    },
    configureWebpack: () => ({
        entry: inDevelopment ? { 'main': `./src/main.js`, 'main-ssr': './src/components/index.js' } : './src/components/index.js',
        optimization: {
            splitChunks: false
        },
        plugins: [new WebpackManifestPlugin(), new webpack.DefinePlugin({
            'process.env.COMPONENT_NAME': JSON.stringify(componentName)
        }),
        ],
        externals: {
            vue: 'Vue',
        },
    }),
    chainWebpack: config => {
        config.module
            .rule('js')
            .use('babel-loader')
            .tap(options => {
                options = options || {}
                options.presets = ['@vue/cli-plugin-babel/preset']
                return options
            });
        config.plugin('html').tap(options => {
            options[0].excludeChunks = ['main-ssr']
            return options;
        });
        config.plugin('extract-css').tap(options => {
            options[0].filename = inDevelopment ? 'css/[name].css' : 'css/[name].[contenthash:8].css';
            options[0].chunkFilename = inDevelopment ? 'css/[name].css' : 'css/[name].[contenthash:8].css';
            return options;
        });
        config.plugin('preload').tap(options => {
            options[0].fileBlacklist.push(/main-ssr\.js/);
            return options;
        });
    },
    devServer: {
        headers: { "Access-Control-Allow-Origin": "*" },
        before: (app) => {
            app.get("/ssr", async (_, resp) => {
                const ssrResponse = await axios.post('http://localhost:3000/dev/api/hyp-vue', {
                    msg: "Welcome to the Hypernova Vue SSR App"
                });
                resp.status(ssrResponse.status)
                if (ssrResponse.status === 200) {
                    let htmlContent = fs.readFileSync(path.join(__dirname, 'ssrTemplate.html'), 'utf-8');
                    htmlContent = htmlContent.replace('$INJECT_HTML', ssrResponse.data.html);
                    let scriptReplacement = '';
                    let styleReplacement = '';
                    if (ssrResponse.data.meta && ssrResponse.data.meta.scriptUrl) {
                        scriptReplacement = `<script type="module" async src="${ssrResponse.data.meta.scriptUrl}"></script>`
                    }
                    if (ssrResponse.data.meta && ssrResponse.data.meta.styleUrl) {
                        styleReplacement = `<link type="text/css" rel="stylesheet" href="${ssrResponse.data.meta.styleUrl}" />`;
                    }
                    htmlContent = htmlContent.replace('$INJECT_JS', scriptReplacement)
                        .replace('$INJECT_CSS', styleReplacement);
                    resp.send(htmlContent);
                }
                resp.end()
            });
        }
    }
}