'use strict';

module.exports = function(grunt) {

	// Unified Watch Object
	var srcFiles = {
		serverJS: ['src/server.js', 'src/config/**/*.js', 'src/app/**/*.js'],
		clientViews: ['src/public/**/*.html'],
		clientJS: ['src/public/assets/js/**/*.js', 'src/public/app/**/*.js'],
		clientCSS: ['src/public/assets/css/**/*.css']
	};


	// Project Configuration
	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),

		watch: {
			serverJS: {
				files: srcFiles.serverJS,
				tasks: ['copy:serverJS'],
				options: {
					livereload: true
				}
			},
			clientViews: {
				files: srcFiles.clientViews,
				tasks: ['copy:clientViews'],
				options: {
					livereload: true,
				}
			},
			clientJS: {
				files: srcFiles.clientJS,
				tasks: ['copy:clientJS'],
				options: {
					livereload: true
				}
			},
			clientCSS: {
				files: srcFiles.clientCSS,
				tasks: ['copy:clientCSS'],
				options: {
					livereload: true
				}
			}
		},


		clean:{
			all:['dist/*'],
			js:['dist/**/*.js', '!dist/public/assets/libs/**/*/js'],
			css:['dist/**/*.css', '!dist/public/assets/libs/**/*/css'],
			libs:['dist/public/assets/libs/**/*']
		},


		copy:{
			all:{
				expand: true,
				cwd: 'src/',
				src: ['**'],
				dest: 'dist/'
			},
			serverJS:{
				expand: true,
				cwd: 'src/',
				src: ['server.js', 'config/**/*.js', 'app/**/*.js'],
				dest: 'dist/'
			},
			clientViews:{
				expand: true,
				cwd: 'src/',
				src: ['public/**/*.html'],
				dest: 'dist/'
			},
			clientJS:{
				expand: true,
				cwd: 'src/',
				src: ['public/assets/js/**/*.js', 'public/app/**/*.js'],
				dest: 'dist/'
			},
			clientCSS:{
				expand: true,
				cwd: 'src/',
				src: ['public/assets/css/**/*.css'],
				dest: 'dist/'
			}
		},


		jshint: {
			all: {
				src: srcFiles.clientJS.concat(srcFiles.serverJS),
				options: {
					jshintrc: true
				}
			}
		},


		csslint: {
			options: {
				csslintrc: '.csslintrc',
			},
			all: {
				src: srcFiles.clientCSS
			}
		},


		uglify: {
			production: {
				options: {
					mangle: false
				},
				files: {
					'public/dist/application.min.js': 'public/dist/application.js'
				}
			}
		},


		cssmin: {
			combine: {
				files: {
					'public/dist/application.min.css': '<%= applicationCSSFiles %>'
				}
			}
		},


		nodemon: {
			dev: {
				script: 'dist/server.js',
				options: {
					nodeArgs: ['--debug'],
					ext: 'js',
					watch: srcFiles.serverJS
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
			default: ['nodemon', 'watch'],
			debug: ['nodemon', 'watch', 'node-inspector'],
			options: {
				logConcurrentOutput: true,
				limit: 10
			}
		}

	});

	// Load NPM tasks
	require('load-grunt-tasks')(grunt);

	// Making grunt default to force in order not to break the project.
	grunt.option('force', true);

	// A Task for loading the configuration object
	// Check Yo project

	// Lint task(s).
	grunt.registerTask('lint', ['jshint', 'csslint']);

	// Initialization task(s).
	grunt.registerTask('init', ['lint', 'clean:all', 'copy:all']);

	// Default task(s).
	grunt.registerTask('default', ['init', 'concurrent:default']);

	// Debug task.
	grunt.registerTask('debug', ['init', 'concurrent:debug']);

	// Build task(s).
	grunt.registerTask('build', ['lint', 'uglify', 'cssmin']);

};