require.config({
	paths: {},

	map: {
		"*": {
      "jquery"    : "../node_modules/jquery/dist/jquery",
			"can"       : "../node_modules/can/dist/amd/can",
			"faux"      : "../require.faux",
			"stache"    : "../require.stache",
			"canstache" : "../node_modules/can/dist/amd/can/view/stache"
		 }
	},

	config: {
	}
});
