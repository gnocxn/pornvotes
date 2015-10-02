Package.describe({
    name: 'nxcong:image-picker',
    version: '0.0.1',
    // Brief, one-line summary of the package.
    summary: 'Image Picker is a simple jQuery plugin that transforms a select element into a more user friendly graphical interface',
    // URL to the Git repository containing the source code for this package.
    git: 'https://github.com/rvera/image-picker',
    // By default, Meteor will default to using README.md for documentation.
    // To avoid submitting documentation, set this field to null.
    documentation: 'README.md'
});

Package.onUse(function (api) {
    api.versionsFrom('1.2.0.2');
    api.use(['ecmascript','jquery']);
    api.addFiles(['lib/image-picker.min.js','lib/image-picker.css'],['client']);
});

Package.onTest(function (api) {
    api.use('ecmascript');
    api.use('tinytest');
    api.use('nxcong:image-picker');
    api.addFiles('image-picker-tests.js');
});
