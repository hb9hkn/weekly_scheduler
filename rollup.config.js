import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';

export default {
  input: 'src/weekly-scheduler-card.ts',
  output: {
    file: 'www/weekly-scheduler-card.js',
    format: 'es',
    sourcemap: false,
  },
  plugins: [
    resolve(),
    typescript({
      tsconfig: './tsconfig.json',
    }),
    terser({
      format: {
        comments: false,
      },
    }),
  ],
};
