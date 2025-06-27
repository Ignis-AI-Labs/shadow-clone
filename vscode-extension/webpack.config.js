const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const WebpackObfuscator = require('webpack-obfuscator');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
    target: 'node',
    mode: isProduction ? 'production' : 'development',
    entry: './src/extension.ts',
    output: {
        path: path.resolve(__dirname, 'out'),
        filename: 'extension.js',
        libraryTarget: 'commonjs2'
    },
    devtool: isProduction ? false : 'source-map',
    externals: {
        vscode: 'commonjs vscode',
        // Add other VS Code provided APIs
        'child_process': 'commonjs child_process',
        'fs': 'commonjs fs',
        'path': 'commonjs path',
        'os': 'commonjs os',
        'crypto': 'commonjs crypto',
        'stream': 'commonjs stream',
        'util': 'commonjs util'
    },
    resolve: {
        extensions: ['.ts', '.js'],
        alias: {
            '@': path.resolve(__dirname, 'src')
        }
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: 'ts-loader'
            }
        ]
    },
    plugins: [
        // Define production environment variables
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
            'process.env.SHADOW_CLONE_API': JSON.stringify(process.env.SHADOW_CLONE_API || ''),
            'process.env.BUILD_TIME': JSON.stringify(new Date().toISOString())
        }),
        // Only obfuscate in production
        ...(isProduction ? [
            new WebpackObfuscator({
                // Obfuscation options
                compact: true,
                controlFlowFlattening: true,
                controlFlowFlatteningThreshold: 0.75,
                deadCodeInjection: true,
                deadCodeInjectionThreshold: 0.4,
                debugProtection: true,
                debugProtectionInterval: 0,
                disableConsoleOutput: true,
                domainLock: [],
                identifierNamesGenerator: 'hexadecimal',
                log: false,
                renameGlobals: false, // Keep false for VS Code compatibility
                rotateStringArray: true,
                selfDefending: true,
                stringArray: true,
                stringArrayEncoding: ['base64'],
                stringArrayThreshold: 0.75,
                transformObjectKeys: true,
                unicodeEscapeSequence: false
            }, [
                // Exclude files from obfuscation
                'node_modules/**',
                '**/*.test.ts'
            ])
        ] : [])
    ],
    optimization: {
        minimize: isProduction,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    ecma: 2020,
                    compress: {
                        drop_console: isProduction,
                        drop_debugger: isProduction,
                        pure_funcs: isProduction ? ['console.log', 'console.info'] : []
                    },
                    mangle: isProduction ? {
                        properties: {
                            regex: /^_/  // Mangle properties starting with underscore
                        }
                    } : false,
                    format: {
                        comments: false
                    }
                },
                extractComments: false
            })
        ]
    }
};