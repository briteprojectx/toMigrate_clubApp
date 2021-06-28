// this is a custom dictionary to make it easy to extend/override
// provide a name for an entry, it can be anything such as 'copyAssets' or 'copyFonts'
// then provide an object with a `src` array of globs and a `dest` string
module.exports = {
    copyAssets: {
        src: ['{{SRC}}/assets/**/*'],
        dest: '{{WWW}}/assets'
    },
    copyIndexContent: {
        src: ['{{SRC}}/index.html', '{{SRC}}/manifest.json', '{{SRC}}/service-worker.js'],
        dest: '{{WWW}}'
    },
    copyFonts: {
        src: ['{{ROOT}}/node_modules/ionicons/dist/fonts/**/*', '{{ROOT}}/node_modules/ionic-angular/fonts/**/*'],
        dest: '{{WWW}}/assets/fonts'
    },
    copyFWFonts: {
        src: ['{{ROOT}}/node_modules/font-awesome/fonts/**/*'],
        dest: '{{WWW}}/assets/fonts'
    },
    copyMDIFonts: {
        src: ['{{ROOT}}/node_modules/mdi/fonts/**/*'],
        dest: '{{WWW}}/assets/fonts'
    },
    copyPolyfills: {
        src: ['{{ROOT}}/node_modules/ionic-angular/polyfills/polyfills.js'],
        dest: '{{BUILD}}'
    },
    copyThemeImages: {
        src: ['{{SRC}}/theme/img/**/*'],
        dest: '{{BUILD}}/img'
    },
    copyIntl:{
        src: ['{{ROOT}}/node_modules/intl/dist/intl.complete.js'],
        dest: '{{BUILD}}'
    }
}
