/*
Copyright 2022 DigitalOcean

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.

You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

'use strict';

const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const fs = require('fs');
const render = require('./render');

const text = fs.readFileSync(path.resolve(__dirname, '../fixtures/full-input.md'), 'utf8');

module.exports = {
    mode: 'development',
    entry: path.resolve(__dirname, './client.js'),
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'client.js',
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, './client.html'),
            templateParameters: {
                text: text.replace(/</g, '&lt;').replace(/>/g, '&gt;'),
                out: render(text),
            },
        }),
    ],
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader',
                ],
            },
        ],
    },
};
