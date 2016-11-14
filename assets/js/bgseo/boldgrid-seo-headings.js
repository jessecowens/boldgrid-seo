( function ( $ ) {

	'use strict';

	var self;

	BOLDGRID.SEO.Headings = {

		/**
		 * Initialize BoldGrid SEO Headings Analysis.
		 *
		 * @since 1.3.1
		 */
		init : function () {

		},
		score : function( count ) {
			var msg = {
					status : 'green',
					msg : _bgseoContentAnalysis.headings.h1.good,
				};
			// If we have more than one H1 tag rendered.
			if ( count > 1 ) {
				msg = {
					status : 'red',
					msg : _bgseoContentAnalysis.headings.h1.badMultiple,
				};
			}
			// If no H1 tag is present.
			if ( 0 === count ) {
				msg = {
					status : 'red',
					msg : _bgseoContentAnalysis.headings.h1.badEmpty,
				};
			}
			return msg;
		},
		/**
		 * Gets count of how many times keywords appear in headings.
		 *
		 * @since 1.3.1
		 */
		keywords : function( headings ) {
			var found = { length : 0 },
			    keyword = BOLDGRID.SEO.Keywords.getKeyword(),
			    report = BOLDGRID.SEO.TinyMCE.getReport();

				if ( _.isUndefined( headings ) ) {
					headings = report.bgseo_dashboard.headings.count;
				}

				_( headings.count ).each( function( value, key ) {
					var text = value.text;
					_( text ).each( function( item ) {

						_( found ).extend({ length : Number( found.length ) + Number( item.occurences( keyword ) ) });
					});
				});


			return found.length;
		},
	};

	self = BOLDGRID.SEO.Headings;

})( jQuery );
