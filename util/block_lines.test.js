/*
Copyright 2024 DigitalOcean

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

const blockLines = require('./block_lines');

it('extracts lines from a markdown-it block state', () => {
    const src = 'one\ntwo\nthree';
    const state = {
        src,
        bMarks: [ 0, 4, 8 ],
        eMarks: [ 3, 7, 13 ],
        tShift: [ 0, 0, 0 ],
    };
    expect(blockLines(state, 0, 3)).toEqual([ 'one', 'two', 'three' ]);
});

it('respects start and end line bounds', () => {
    const src = 'alpha\nbeta\ngamma';
    const state = {
        src,
        bMarks: [ 0, 6, 11 ],
        eMarks: [ 5, 10, 16 ],
        tShift: [ 0, 0, 0 ],
    };
    expect(blockLines(state, 1, 3)).toEqual([ 'beta', 'gamma' ]);
});

it('applies tShift when reading lines', () => {
    const src = '  indented';
    const state = {
        src,
        bMarks: [ 0 ],
        eMarks: [ 10 ],
        tShift: [ 2 ],
    };
    expect(blockLines(state, 0, 1)).toEqual([ 'indented' ]);
});
