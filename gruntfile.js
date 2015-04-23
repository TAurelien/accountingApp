'use strict';

var _ = require('lodash');

var srcDir = 'src';
var publicDir = 'public';
var libDir = 'lib';
var binDir = 'bin';

var properties = require('./' + binDir + '/properties.json');

module.exports = function (grunt) {

	var binFiles = {
		serverFiles: [
			binDir + '/**/*.js',
			binDir + '/**/*.json',
			'!' + binDir + '/**/' + publicDir
		],

		clientViews: [
			binDir + '/**/' + publicDir + '/**/*.html',
			'!' + binDir + '/**/' + publicDir + '/**/' + libDir
		],

		clientJS: [
			binDir + '/**/' + publicDir + '/**/*.js',
			'!' + binDir + '/**/' + publicDir + '/**/' + libDir
		],

		clientCSS: [
			binDir + '/**/' + publicDir + '/**/*.css',
			'!' + binDir + '/**/' + publicDir + '/**/' + libDir
		],

		clientSCSS: [
			binDir + '/**/' + publicDir + '/**/*.scss',
			'!' + binDir + '/**/' + publicDir + '/**/' + libDir
		]
	};

	var srcFiles = {

		serverFiles: [
			srcDir + '/**/*.js',
			srcDir + '/**/*.json',
			'!' + srcDir + '/**/' + publicDir
		],

		clientViews: [
			srcDir + '/**/' + publicDir + '/**/*.html',
			'!' + srcDir + '/**/' + publicDir + '/**/' + libDir
		],

		clientJS: [
			srcDir + '/**/' + publicDir + '/**/*.js',
			'!' + srcDir + '/**/' + publicDir + '/**/' + libDir
		],

		clientCSS: [
			srcDir + '/**/' + publicDir + '/**/*.css',
			'!' + srcDir + '/**/' + publicDir + '/**/' + libDir
		],

		clientSCSS: [
			srcDir + '/**/' + publicDir + '/**/*.scss',
			'!' + srcDir + '/**/' + publicDir + '/**/' + libDir
		]

	};

	var dataCollections = {

		all: [{
			name: 'currencies',
			type: 'json',
			file: 'data/currencies.json',
			jsonArray: true,
			upsert: true,
			drop: true
		}, {
			name: 'accountTypes',
			type: 'json',
			file: 'data/accountTypes.json',
			jsonArray: true,
			upsert: true,
			drop: true
		}],

		dev: [{
			name: 'generalLedgers',
			type: 'json',
			file: 'data/development/generalLedgers.json',
			jsonArray: true,
			upsert: true,
			drop: true
		}, {
			name: 'accounts',
			type: 'json',
			file: 'data/development/accounts.json',
			jsonArray: true,
			upsert: true,
			drop: true
		}, {
			name: 'transactions',
			type: 'json',
			file: 'data/development/transactions.json',
			jsonArray: true,
			upsert: true,
			drop: true
		}],

		test: [{
			name: 'generalLedgers',
			type: 'json',
			file: 'data/test/generalLedgers.json',
			jsonArray: true,
			upsert: true,
			drop: true
		}, {
			name: 'accounts',
			type: 'json',
			file: 'data/test/accounts.json',
			jsonArray: true,
			upsert: true,
			drop: true
		}, {
			name: 'transactions',
			type: 'json',
			file: 'data/test/transactions.json',
			jsonArray: true,
			upsert: true,
			drop: true
		}]

	}

	// ========================================================================

	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),

		watch: {
			serverFiles: {
				files: srcFiles.serverFiles,
				tasks: ['modif'],
				options: {
					livereload: false,
					spawn: false
				}
			},
			clientViews: {
				files: srcFiles.clientViews,
				tasks: ['modif'],
				options: {
					livereload: true,
					spawn: false
				}
			},
			clientJS: {
				files: srcFiles.clientJS,
				tasks: ['modif'],
				options: {
					livereload: true,
					spawn: false
				}
			},
			clientCSS: {
				files: srcFiles.clientCSS,
				tasks: ['modif'],
				options: {
					livereload: true,
					spawn: false
				}
			},
			clientSCSS: {
				files: srcFiles.clientSCSS,
				tasks: ['modif'],
				options: {
					livereload: true,
					spawn: false
				}
			}
		},

		sync: {
			default: {
				files: [{
					cwd: srcDir + '/',
					src: ['**', '!**/*.scss'],
					dest: binDir + '/',
				}],
				pretend: false,
				verbose: true,
				updateAndDelete: true
			}
		},

		clean: {
			all: [binDir + '/*']
		},

		copy: {
			all: {
				expand: true,
				cwd: srcDir + '/',
				src: ['**', '!**/*.scss'],
				dest: binDir + '/'
			}
		},

		jshint: {
			all: {
				src: srcFiles.clientJS.concat(srcFiles.serverFiles),
				options: {
					jshintrc: true
				}
			},
			modif: {
				src: [],
				options: {
					jshintrc: true
				}
			}
		},

		mongoimport: {
			options: {
				db: properties.dev.db.database,
				host: properties.dev.db.host,
				port: properties.dev.db.port,
				stopOnError: false,
				collections: dataCollections.dev
			}
		},

		nodemon: {
			default: {
				script: binDir + '/server.js',
				options: {
					nodeArgs: [''],
					watch: binFiles.serverFiles
				}
			},
			debug: {
				script: binDir + '/server.js',
				options: {
					nodeArgs: ['--debug'],
					watch: binFiles.serverFiles
				}
			},
			debugbrk: {
				script: binDir + '/server.js',
				options: {
					nodeArgs: ['--debug-brk'],
					watch: binFiles.serverFiles
				}
			}
		},

		'node-inspector': {
			custom: {
				options: {
					'web-port': 1337,
					'web-host': 'localhost',
					'debug-port': 5858,
					'save-live-edit': true,
					'no-preload': true,
					'stack-trace-limit': 50,
					'hidden': []
				}
			}
		},

		concurrent: {
			default: ['nodemon:default', 'watch'],
			debug: ['nodemon:debug', 'watch', 'node-inspector'],
			debugbrk: ['nodemon:debugbrk', 'watch', 'node-inspector'],
			options: {
				logConcurrentOutput: true,
				limit: 10
			}
		},

		env: {
			prod: {
				NODE_ENV: 'production'
			},
			dev: {
				NODE_ENV: 'development'
			},
			test: {
				NODE_ENV: 'test'
			}
		}

	});

	var watchedEvents = Object.create(null);

	var onChange = _.debounce(function () {

		var events = watchedEvents;
		// { path : action }
		// path => 'src\\server.js' file or folder
		// action => 'changed', 'added', 'deleted', 'renamed'

		var jshintArray = [];

		_.forEach(events, function (action, path) {
			if (action !== 'deleted') {
				jshintArray.push(path);
			}
		});

		grunt.config('jshint.modif.src', jshintArray);

		watchedEvents = Object.create(null);

	}, 200);

	grunt.event.on('watch', function (action, filepath) {
		watchedEvents[filepath] = action;
		onChange();
	});

	// Load NPM tasks
	require('load-grunt-tasks')(grunt);

	// Making grunt default to force in order not to break the project.
	grunt.option('force', true);

	// A Task for loading the configuration object
	// Check Yo project

	// Initialization tasks
	grunt.registerTask('lint', ['jshint:all']);
	grunt.registerTask('init', ['lint', 'sync:default']);
	grunt.registerTask('modif', ['jshint:modif', 'sync:default']);
	grunt.registerTask('setup_dev_db', ['mongoimport'])

	// Starting tasks
	grunt.registerTask('default', ['env:dev', 'setup_dev_db', 'init', 'concurrent:default']);
	grunt.registerTask('debug', ['env:dev', 'setup_dev_db', 'init', 'concurrent:debug']);
	grunt.registerTask('debugbrk', ['env:dev', 'setup_dev_db', 'init', 'concurrent:debugbrk']);

	// Testing tasks
	// TODO Define grunt test tasks
	//grunt.registerTask('test', ['env:test', 'lint']);

	// Build / Release tasks
	// TODO Define grunt build tasks
	//grunt.registerTask('test', ['env:prod', 'setup_test_db', 'lint']);

};