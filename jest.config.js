// Modifications to
// https://github.com/jsynowiec/node-typescript-boilerplate/blob/32e3b53d62933438291a14e1d09904aed1df19d0/jest.config.js
// Copyright (c) 2017 Target Brands, Inc.

module.exports = {
    testEnvironment: 'node',
    transform: {
        '^.+\\.ts$': '<rootDir>/preprocessor.js',
        '^.+\\.js$': '<rootDir>/node_modules/babel-jest'
    },
    moduleFileExtensions: [
        'ts',
        'js'
    ],
    testRegex: '(/test/.*|(\\.|/)(test|spec))\\.(ts|js)$',
    coverageDirectory: 'coverage',
    collectCoverageFrom: [
        'src/**/*.{ts,js}',
        '!src/**/*.d.ts',
    ]
}
