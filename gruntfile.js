/// <vs SolutionOpened='dev' />
module.exports = function ( grunt ) {

	grunt.loadNpmTasks("grunt-contrib-copy");
	grunt.loadNpmTasks("grunt-contrib-requirejs");
	grunt.loadNpmTasks("grunt-contrib-clean");
	grunt.loadNpmTasks("grunt-cleanempty");

	var requireConfig  = "demo/require.config.js";

	grunt.initConfig({
		pkg: grunt.file.readJSON( "package.json" ),

		copy: {
      requirejs: {
				dest : "demo/require.js",
				src  : "node_modules/requirejs/require.js"
			}
		},

		cleanempty: {
			build: {
				files: false,
				src: [ "Scripts-dist/**/*", "Content-dist/**/*" ]
			}
		},

    clean: {
			clean: [ "Scripts-dist" ]
    },

		requirejs: {
			options: {
				baseUrl             : "",
				dir                 : "Scripts-dist",
				mainConfigFile      : requireConfig,
				skipDirOptimize     : true,
				removeCombined      : true,
				optimize            : "none",
				skipModuleInsertion : true,
				wrapShim            : true,

				modules : [
          	{
          		"name": "demo/require",
          		"override": {
          			"skipModuleInsertion": true
          		},
          		"include": [
          			"../require.faux",
          			"../require.stache"
          		]
          	},

          	{
          		"name": "common",
          		"create": true,
          		"include": [
          			"../node_modules/jquery/dist/jquery",
          			"../node_modules/can/dist/amd/can",
          			"../node_modules/can/dist/amd/can/view/stache",
          		],
          		"exclude": [ "demo/require" ]
          	},
        ],

				done: function ( done, output ) {
					grunt.log.ok();
					done();
				}
			},

			build: {
				options: {
					//optimize: "uglify2",
				}
			}
		},

	});

	grunt.registerTask( "requirejsbundle", "Generates a bundle config from the specified modules config", function ( options ) {
		var conf = grunt.config.get( "requirejs" ),
			modules = conf.options.modules,
			bundleConfig = {};

		for ( var i = 0; i < modules.length; i++ ) {
			bundleConfig[ modules[ i ].name ] = modules[ i ].include;
		}

		var contents = grunt.file.read( "Scripts-dist/" + requireConfig )
			+  "require.config({bundles: " + JSON.stringify( bundleConfig ) + "});";

		grunt.file.write( "Scripts-dist/" + requireConfig, contents );
		grunt.log.ok( modules.length + " bundles appended to `" + requireConfig + "`" );
	});

  grunt.registerTask( "dev", [ "copy:requirejs" ]);
	grunt.registerTask( "build", [ "copy:requirejs", "clean", "requirejs:build", "requirejsbundle:build", "cleanempty:build" ]);
}
