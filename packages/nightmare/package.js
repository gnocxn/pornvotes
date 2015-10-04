Package.describe({
    name: 'cafe4it:nightmare',
    version: '0.0.1',
    // Brief, one-line summary of the package.
    summary: 'A high-level browser automation library. http://nightmarejs.org',
    // URL to the Git repository containing the source code for this package.
    git: 'https://github.com/segmentio/nightmare.git',
    // By default, Meteor will default to using README.md for documentation.
    // To avoid submitting documentation, set this field to null.
    documentation: 'README.md'
});

Npm.depends({'nightmare' : '2.0.7'});

Package.onUse(function (api) {
    api.versionsFrom('1.2.0.2');
    api.use('ecmascript');
    api.addFiles(['nightmare.js'],['server']);
});

Package.onTest(function (api) {
    api.use('ecmascript');
    api.use('tinytest');
    api.use('cafe4it:nightmare');
    api.addFiles('nightmare-tests.js');
});
