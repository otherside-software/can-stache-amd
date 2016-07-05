define([ "module" ], function ( module ) {
	return {
		version: "2.0.0",
		load: function ( name, require, onload, config ) {
			require([ "can", "canstache" ], function ( can ) {
				var id = can.view.toId( name );
				can.ajax({
					url: require.toUrl( name ),
					cache: true,
					datatype: "text",
					type: "GET"
				}).done( function ( data ) {
					can.stache.async( data )
						.then( onload );
				}).fail( function () {
					onload.error();
				})
			});
		},

		pluginBuilder: "./require.stache.build"
	}
});
