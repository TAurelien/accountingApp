'use strict';

var _ = require('lodash');

var srcDir = 'src';
var publicDir = 'public';
var libDir = 'lib';
var binDir = 'bin';

module.exports = function (grunt) {

	var properties = require('./properties/properties.json');

	var binFiles = {

		serverFiles: [
			binDir + '/**/*',
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

	var mongoDataCollections = {

		// TODO @grunt Turn mongoDataCollection as a function that will get all the data from folder
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

		development: [{
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
				tasks: ['jshint:modif', 'sync'],
				options: {
					livereload: false,
					spawn: false
				}
			},
			clientViews: {
				files: srcFiles.clientViews,
				tasks: ['jshint:modif', 'sync'],
				options: {
					livereload: true,
					spawn: false
				}
			},
			clientJS: {
				files: srcFiles.clientJS,
				tasks: ['jshint:modif', 'sync'],
				options: {
					livereload: true,
					spawn: false
				}
			},
			clientCSS: {
				files: srcFiles.clientCSS,
				tasks: ['jshint:modif', 'sync'],
				options: {
					livereload: true,
					spawn: false
				}
			},
			clientSCSS: {
				files: srcFiles.clientSCSS,
				tasks: ['jshint:modif', 'sync'],
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
				db: null,
				host: null,
				port: null,
				stopOnError: false,
				collections: null
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
			dev: {
				options: {
					'web-port': 1337,
					'web-host': 'localhost',
					'debug-port': 5858,
					'save-live-edit': false,
					'no-preload': false,
					'stack-trace-limit': 4,
					'hidden': ["node_modules/**/*", "src/**/*"]
				}
			}
		},

		concurrent: {
			default: ['nodemon:default', 'watch'],
			debug: ['nodemon:debug', 'watch', 'node-inspector', 'setOpen:nodeInspector'],
			debugbrk: ['nodemon:debugbrk', 'watch', 'node-inspector', 'setOpen:nodeInspector'],
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
		},

		open: {
			custom: {
				path: null,
				app: 'chrome'
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

	function setupEnvProperties() {
		var env = process.env.NODE_ENV;
		if (!env) {
			env = process.env.NODE_ENV = 'development';
		}
		console.log('Environment : ' + env);
		if (env !== 'production') {
			var envProperties = require('./properties/' + env + '/properties.json');
			_.merge(properties, envProperties);
		}
	}

	grunt.registerTask('setupEnvProperties', function () {
		setupEnvProperties();
	});

	grunt.registerTask('setupMongoImportConf', function () {
		var mongoImportOptions = {
			db: properties.db.database,
			host: properties.db.host,
			port: properties.db.port,
			stopOnError: false,
			collections: mongoDataCollections[process.env.NODE_ENV]
		};
		grunt.config('mongoimport.options', mongoImportOptions);
	});

	grunt.registerTask('setOpen', function (app) {
		setupEnvProperties();
		if (properties.tools[app].launchBrowser) {

			var browser = 'chrome';
			if (properties.tools.browser.cmd) {
				browser = properties.tools.browser.cmd;
			}

			var config = {
				path: properties.tools[app].url,
				app: browser
			};
			grunt.config('open.custom', config);
			grunt.task.run('open');
		}
	});

	// Alias tasks
	grunt.registerTask('lint', ['jshint:all']);
	grunt.registerTask('populateDB', ['setupMongoImportConf', 'mongoimport']);
	grunt.registerTask('setDevEnv', ['env:dev', 'setupEnvProperties', 'populateDB']);
	grunt.registerTask('setTestEnv', ['env:test', 'setupEnvProperties', 'populateDB']);

	// Misc tasks
	grunt.registerTask('ungit', ['setOpen:ungit']);

	// Dev tasks
	grunt.registerTask('initDev', ['setDevEnv', 'lint', 'sync']);
	grunt.registerTask('dev', ['initDev', 'concurrent:default']);
	grunt.registerTask('devDebug', ['initDev', 'concurrent:debug']);
	grunt.registerTask('devDebugbrk', ['initDev', 'concurrent:debugbrk']);

	// Test tasks
	// TODO @grunt Define grunt test tasks
	grunt.registerTask('test', ['setTestEnv', 'lint', 'sync']);

	// Build / Release tasks
	// TODO @grunt Define grunt build tasks
	// TODO @grunt Define grunt release tasks
	grunt.registerTask('release', []);

	grunt.registerTask('default', ['dev']);

};