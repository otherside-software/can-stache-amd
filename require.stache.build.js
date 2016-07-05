define([], function () {
	var buildMap = {},
		buildRequire = require.config({
			context: "__build",
			baseUrl: require.s.contexts._.config.baseUrl,
			map: {
				"*": {
					"can/util/jquery"  : "can/util/domless"
				}
			}
		});

	function esc( string ) {
		var escMap = {
			'\n': "\\n",
			'\r': "\\r",
			'\u2028': "\\u2028",
			'\u2029': "\\u2029"
		};

		return ('' + string).replace(/["'\\\n\r\u2028\u2029]/g, function (character) {
			if("'\"\\".indexOf(character) >= 0) {
				return "\\"+character;
			} else  {
				return escMap[character];
			}
		});
	};

	function getFile( name ) {
		var fs = buildRequire( "fs" ),
			url = buildRequire.toUrl( name ),
			data = fs.readFileSync( url, "utf8" );

		//Remove BOM (Byte Mark Order) from utf8 files if it is there.
		if ( data.indexOf('\uFEFF') === 0 ) {
			data = data.substring(1);
		}
		return data;
	}

	function getPartials( data, prefix ) {
		function fill( _, match ) {
			partials.push( match );
		};

		var partials = [], regex = new RegExp(/{{>(.+?)}}/g);
		data.replace( regex, fill );

		return partials
			.filter( function( item, pos ) {
				return partials.indexOf( item ) == pos;
			})
			.map( function ( item ) {
				return item.substr( -7 ) === ".stache"
					? prefix + "!" + item.trim()
					: prefix + "!" + item.trim() + ".stache";
			});
	}

	return {
		version: "2.0.0",
		load: function ( name, require, onload, config ) {
			var	getIntermediateAndImports = buildRequire( "can/view/intermediate_and_imports" ),
				data = getFile( name ),
				partials = getPartials( data, config.map["*"]["stache"]),
				imports = getIntermediateAndImports( data ).imports;

			buildMap[ name ] = {
				id: can.view.toId( name ),
				template: data,
				imports: imports,
				partials: partials
			};

			for( var i in partials ) {
				// force the partials to become part of the build
				require( partials[ i ]);
			}

			for( var i in imports ) {
				// force the imports to become part of the build
				require( "faux!" + imports[ i ]);
			}

			onload();
		},

		write: function ( plugin, module, write ) {
			if ( buildMap.hasOwnProperty( module )) {
				var data = buildMap[ module ];

				data.imports.unshift( "can" );

				var deps = data.imports
					.concat( data.partials )
					.map( function ( item ) {
						return "'" + item + "'";
					})
					.join( ", " );

				write.asModule(
					plugin + "!" + module,
					"define([ " + deps + " ], function ( can ) {\n  return can.stache( '" + data.id + "', '" + esc( data.template ) + "' )\n" + "});\n"
				);
			}
		}
	}
});
