/**
 * @type {import('rollup').RollupOptions}
 */

import typescript from '@rollup/plugin-typescript';
import babel from 'rollup-plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';

const entries = {
    'index': 'src/lib/index.ts',
    'AudioVisual': 'src/lib/audiovisual.tsx',
    'InlineLrc': 'src/lib/InlineLrc.tsx',
    'ScrollingLrc': 'src/lib/ScrollingLrc.tsx',
    'Loading': 'src/lib/Loading.tsx',
    'MediaSlider': 'src/lib/MediaSlider.tsx',
    'PlayOrPauseButton': 'src/lib/PlayOrPauseButton.tsx',
    'Poster': 'src/lib/Poster.tsx',
};

const generateConfig = (entry) => ({
    input: {
        [entry]: entries[entry]
    },
    output: {
        dir: 'dist',
        format: 'es'
    },
    plugins: [
        typescript(),
        resolve(),
        commonjs(),
        babel({
            comments: false,
            runtimeHelpers: true,
            extensions: ['.ts', '.tsx'],
            presets: [
                '@babel/preset-react',
                [
                    '@babel/preset-env',
                    {
                        targets: { browsers: ['last 2 versions', 'safari >= 7'] }
                    }
                ]
            ],
            plugins: [
                ['@babel/transform-runtime', { useESModules: true, regenerator: false }]
            ],
            exclude: 'node_modules/**'
        })
    ],
    external: [
        'react',
        'react-dom'
    ]
})

export default Object.keys(entries).map(generateConfig)
