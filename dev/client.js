/*
Copyright 2023 DigitalOcean

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

const Prism = require('../vendor/prismjs/prism');
require('../vendor/prismjs/plugins/keep-markup/prism-keep-markup')(Prism);
require('../vendor/prismjs/plugins/toolbar/prism-toolbar')(Prism);
require('../vendor/prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard')(Prism);

document.addEventListener('DOMContentLoaded', event => {
    const textbox = document.getElementById('textbox');
    const output = document.getElementById('output');

    /**
     * Handle the textbox being updated.
     */
    const update = () => {
        // Resize textbox to match input
        textbox.style.overflowY = 'hidden';
        textbox.style.height = 'auto';
        textbox.style.height = `${textbox.scrollHeight}px`;

        // Render the Markdown to HTML
        console.log(render(textbox.value));
        output.innerHTML = render(textbox.value);

        // Ensure scripts are loaded
        Array.from(output.querySelectorAll('script')).forEach(oldScript => {
            const newScript = document.createElement('script');
            Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
            newScript.appendChild(document.createTextNode(oldScript.innerHTML));
            oldScript.parentNode.replaceChild(newScript, oldScript);
        });

        // Run Prism on the output
        Prism.highlightAllUnder(output);
    };

    // Monkey-patch addEventListener to short-circuit future DOMContentLoaded handlers
    const addEventListener = document.addEventListener.bind(document);

    /**
     * Register a new event listener on the document.
     * Immediately executes DOMContentLoaded listeners, as well as registering them.
     *
     * @type {typeof addEventListener}
     */
    document.addEventListener = (type, listener, options) => {
        if (type === 'DOMContentLoaded') listener(event);
        addEventListener(type, listener, options);
    };

    // Listen for updates, and do an initial render
    textbox.addEventListener('input', update);
    update();
});
