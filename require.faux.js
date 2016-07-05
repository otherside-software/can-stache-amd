define([], function () {

	/* This loader plugin does literally nothing. It simply loads the named module, and then finishes.
	 * This plugin is necessary to force dependencies that aren't originally specified to be included in a build layer during the writing stage in a pluginBuilder.
	 */

	return {
		version: "1.0.0",
		load: function ( name, require, onload, _ ) {
			require([ name ], function ( module ) {
				onload( module );
			})
		}
	}
})
