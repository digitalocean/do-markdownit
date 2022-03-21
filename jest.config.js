'use strict';

module.exports = {
    collectCoverage: true,
    collectCoverageFrom: [
        '@(modifiers|rules|util)/**/*.js',
        'index.js',
    ],
    // TODO: Improve test coverage and enable coverage thresholds (ideally at 100%)
    // coverageThreshold: {
    //     global: {
    //         branches: 80,
    //         functions: 80,
    //         lines: 80,
    //         statements: 80,
    //     },
    // },
};
