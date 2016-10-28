var BOLDGRID = BOLDGRID || {};
BOLDGRID.SEO = BOLDGRID.SEO || {};

( function ( $ ) {

	'use strict';

	var self;

	BOLDGRID.SEO.Util = {
		/**
		 * Initialize Word Count.
		 *
		 * @since 1.2.1
		 */
		init : function () {
			Number.prototype.isBetween = function( min, max ) {
				return this > min && this < max;
			};
		},
	};

	self = BOLDGRID.SEO.Util;

})( jQuery );

BOLDGRID.SEO.Util.init();