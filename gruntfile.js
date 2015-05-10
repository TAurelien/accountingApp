'use strict';

// Module dependencies ========================================================
var fs = require('fs');
var path = require('path');
var _ = require('lodash');

var srcDir = 'src';
var binDir = 'bin';
var testDir = 'test';
var docDir = 'doc';
var dataDir = 'data';

var starterFile = binDir + '/app.js';

module.exports = function (grunt) {

	var properties = require('./properties/properties.json');

	var binFiles = [binDir + '/**/*'];
	var srcFiles = [srcDir + '/**/*', '!' + srcDir + '/**/' + testDir + '/**/*'];
	var testFiles = [srcDir + '/**/' + testDir + '/**/*.js', testDir + '/**/*.js'];
	var jsFiles = [srcDir + '/**/*.js', testDir + '/**/*.js'];
	var jsonFiles = [srcDir + '/**/*.json', testDir + '/**/*.json'];

	var mongoDataCollections = (function () {
		var collections = {};
		var dataPath = path.resolve(process.cwd(), './' + dataDir);
		var envDirs = (function () {
			try {
				return fs.readdirSync(dataPath).filter(function (file) {
					return fs.statSync(path.join(dataPath, file)).isDirectory();
				});
			} catch (err) {
				return [];
			}
		})();

		_.forEach(envDirs, function (envDir) {
			var envCollections = [];
			var envDataPath = path.join(dataPath, '/' + envDir);
			var collectionFiles = (function () {
				try {
					return fs.readdirSync(envDataPath).filter(function (file) {
						return fs.statSync(path.join(envDataPath, file)).isFile();
					});
				} catch (err) {
					return [];
				}
			})();

			_.forEach(collectionFiles, function (file) {
				envCollections.push({
					name: file.replace('.json', ''),
					type: 'json',
					file: dataDir + '/' + envDir + '/' + file,
					jsonArray: true,
					upsert: true,
					drop: true
				});
			});
			collections[envDir] = envCollections;
		});
		return collections;
	})();

	// ========================================================================

	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),

		watch: {
			serverFiles: {
				files: srcFiles,
				tasks: ['jshint:modif', 'sync:default'],
				options: {
					livereload: false,
					spawn: false
				}
			}
		},

		sync: {
			default: {
				files: [{
					cwd: srcDir + '/',
					src: ['**', '!**/' + testDir + '/**'],
					dest: binDir + '/'
				}],
				pretend: false,
				verbose: true,
				updateAndDelete: true
			}
		},

		clean: {
			bin: [binDir + '/*'],
			doc: [docDir + '/*']
		},

		copy: {
			bin: {
				expand: true,
				cwd: srcDir + '/',
				src: ['**', '!**/' + testDir + '/**'],
				dest: binDir + '/'
			}
		},

		jshint: {
			all: {
				src: jsFiles,
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
				script: starterFile,
				options: {
					nodeArgs: [''],
					watch: binFiles
				}
			},
			debug: {
				script: starterFile,
				options: {
					nodeArgs: ['--debug'],
					watch: binFiles
				}
			},
			debugbrk: {
				script: starterFile,
				options: {
					nodeArgs: ['--debug-brk'],
					watch: binFiles
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
					'hidden': ["node_modules", "src", "releases", "test", "data", "properties"]
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
			},
			doc: {
				path: docDir + '/index.html',
				app: 'chrome'
			}
		},

		release: {
			options: {
				changelog: true,
				changelogText: '\n### v<%= version %>\n',
				add: true,
				commit: true,
				tag: true,
				tagName: 'v<%= version %>',
				commitMessage: 'Release <%= version %>',
				pushTag: true,
				npm: false,
				indentation: '\t',
				github: {
					repo: null,
					usernameVar: null,
					passwordVar: null
				}
			}
		},

		jsdoc: {
			dist: {
				src: srcFiles,
				options: {
					destination: docDir,
					private: false
				}
			}
		},

		mochaTest: {
			test: {
				src: testFiles,
				options: {
					reporter: 'spec'
				}
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

	grunt.registerTask('setupReleaseGithub', function () {
		setupEnvProperties();
		var github = {
			repo: properties.tools.github.repo,
			usernameVar: properties.tools.github.username,
			passwordVar: properties.tools.github.password
		};
		grunt.config('release.options.github', github);
	});

	grunt.registerTask('releaseApp', function (type) {
		grunt.task.run('setupReleaseGithub');
		if (type) {
			grunt.task.run('release:' + type);
		} else {
			grunt.task.run('release');
		}
	});

	// Alias tasks
	grunt.registerTask('lint', ['jshint:all']);
	grunt.registerTask('populateDB', ['setupMongoImportConf', 'mongoimport']);
	grunt.registerTask('setDevEnv', ['env:dev', 'setupEnvProperties', 'populateDB']);
	grunt.registerTask('setTestEnv', ['env:test', 'setupEnvProperties', 'populateDB']);

	// Misc tasks
	grunt.registerTask('ungit', ['setOpen:ungit']);
	grunt.registerTask('generateDoc', ['clean:doc', 'jsdoc']);
	grunt.registerTask('openDoc', ['open:doc']);

	// Dev tasks
	grunt.registerTask('initDev', ['setDevEnv', 'lint', 'sync:default']);
	grunt.registerTask('dev', ['initDev', 'concurrent:default']);
	grunt.registerTask('devDebug', ['initDev', 'concurrent:debug']);
	grunt.registerTask('devDebugbrk', ['initDev', 'concurrent:debugbrk']);

	// Test tasks
	// TODO @grunt Define grunt test tasks
	grunt.registerTask('test', ['setTestEnv', 'lint', 'mochaTest']);

	// Build / Release tasks
	// TODO @grunt Define grunt build tasks

	grunt.registerTask('default', ['dev']);

};