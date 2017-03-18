## grunt-unused

This is a Grunt plugin that searches a list of files for unused strings. It can loop through a file with a regex to find search params.

### Use-case

Tell if any variables in a file are not used in a project. For example, check if variables in a translation file are not used in the main project.

### Installation

grunt.loadNpmTasks('grunt-unused');

### Usage examples

unused: {
    default: {
        files: {
            src: ['app/**/*.html']
        },
        options: {
            findParamsIn: ['translations.js'],
            regex: /[a-z]*=/g,
            omitInResults: '='
        }
    }
}