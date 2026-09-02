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

const reduceFraction = require('./reduce_fraction');

it('reduces a fraction to lowest terms', () => {
    expect(reduceFraction(4, 8)).toEqual([ 1, 2 ]);
});

it('leaves an already reduced fraction unchanged', () => {
    expect(reduceFraction(3, 5)).toEqual([ 3, 5 ]);
});

it('handles a numerator of zero', () => {
    expect(reduceFraction(0, 5)).toEqual([ 0, 1 ]);
});

it('handles equal numerator and denominator', () => {
    expect(reduceFraction(7, 7)).toEqual([ 1, 1 ]);
});
