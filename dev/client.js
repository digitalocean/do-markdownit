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

require('./client.scss');
const render = require('./render');

document.addEventListener('DOMContentLoaded', () => {
    const textbox = document.getElementById('textbox');
    const output = document.getElementById('output');

    /**
     * Handle the textbox being updated.
     * Resizes that textbox to match the input, renders the input to HTML.
     */
    const update = () => {
        textbox.style.overflowY = 'hidden';
        textbox.style.height = 'auto';
        textbox.style.height = `${textbox.scrollHeight}px`;
        output.innerHTML = render(textbox.value);
    };

    textbox.addEventListener('input', update);
    update();
});
