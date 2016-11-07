( function ( $ ) {

	'use strict';

	var self;

	/**
	 * BoldGrid SEO Keywords.
	 *
	 * This is responsible for the SEO Keywords Analysis and Scoring.
	 *
	 * @since 1.3.1
	 */
	BOLDGRID.SEO.Keywords = {
		/**
		 * Initialize BoldGrid SEO Keyword Analysis.
		 *
		 * @since 1.3.1
		 */
		init : function () {
			$( document ).ready( function() {
				self._keywords();
			});
		},

		/**
		 * Sets up event listener for changes made to the custom keyword input.
		 *
		 * Listens for changes being made to the custom keyword input, and then
		 * triggers the reporter to be updated with new status/score.
		 *
		 * @since 1.3.1
		 */
		_keywords: function() {
			var keyword = $( '#bgseo-custom-keyword' );

			// Listen for changes to input value.
			keyword.on( 'input propertychange paste', _.debounce( function() {
				var msg = {},
				    length = $( this ).val().length;

				msg = {
					title : self.keywordsInTitle(),
					description : self.keywordsInDescription(),
				};

				$( this ).trigger( 'bgseo-analysis', [{'keywords': msg}] );

			}, 1000 ) );
		},

		/**
		 * Gets the count of the keywords in the content passed in.
		 *
		 * @since 1.3.1
		 *
		 * @param {string} content The content to count keyword frequency in.
		 * @param {string} keyword The keyword/phrase to search for.
		 *
		 * @returns {Number} keywordCount Represents how many times a keyword appears.
		 */
		keywordCount: function( content, keyword ) {
			var keywordCount;

			keywordCount = content.split( keyword ).length - 1;

			return keywordCount;
		},

		/**
		 * Calculates keyword density for content and keyword passed in.
		 *
		 * @since 1.3.1
		 *
		 * @param {string} content The content to calculate density for.
		 * @param {string} keyword The keyword to base density measurement on.
		 *
		 * @returns {Number} result Calculated density of keyword in content passed.
		 */
		keywordDensity : function( content, keyword ) {
			var result, keywordCount, wordCount;

			// Normalize.
			keyword = keyword.toLowerCase();

			keywordCount = self.keywordCount( content, keyword );
			wordCount = textstatistics( content ).wordCount();
			// Get the density.
			result = ( ( keywordCount / wordCount ) * 100 );
			// Round it off.
			result = Math.round( result * 10 ) / 10;

			return result;
		},

		/**
		 * Gets the recommended keywords from content.
		 *
		 * This is what gets suggested to a user that their content is about this
		 * keyword if they do not enter in a custom target keyword or phrase.
		 *
		 * @since 1.3.1
		 *
		 * @param {string} text The text to search through.
		 * @param {Number} n How many keywords to return back.
		 *
		 * @returns {Array} result An array of n* most frequent keywords.
		 */
		recommendedKeywords: function( text, n ) {
			// Split text on non word characters
			var words = text.toLowerCase().split( /\W+/ ),
			    positions = {},
			    wordCounts = [],
			    result;

			for ( var i=0; i < words.length; i++ ) {
				var word = words[i];
				if ( ! word || word.length < 3 || _bgseoContentAnalysis.stopWords.indexOf( word ) > -1 ) {
					continue;
				}

				if ( typeof positions[word] == 'undefined' ) {
					positions[word] = wordCounts.length;
					wordCounts.push( [word, 1] );
				} else {
					wordCounts[positions[word]][1]++;
				}
			}
			// Put most frequent words at the beginning.
			wordCounts.sort( function ( a, b ) {
				return b[1] - a[1];
			});
			// Return the first n items
			result = wordCounts.slice( 0, n );

			return result;
		},

		/**
		 * Retrieves User's Custom SEO Keyword.
		 *
		 * If the user has entered in a custom keyword to run evaluation on,
		 * then we will retrieve this value instead of the automatically
		 * generated keyword recommendation.
		 *
		 * @since 1.3.1
		 *
		 * @returns {string} keyword Trimmed output of user supplied custom keyword.
		 */
		getCustomKeyword : function() {
			var keyword = $( '#bgseo-custom-keyword' ).val();
			// Trim the input since it's user input to be sure there's no spaces.
			keyword = $.trim( keyword );

			return keyword;
		},

		/**
		 * Used to get the keyword for the report.
		 *
		 * Checks if a custom keyword has been set by the user, and
		 * if it hasn't it will use the autogenerated keyword that was
		 * determined based on the content.
		 *
		 * @since 1.3.1
		 *
		 * @returns {string} customKeyword Contains the customKeyword to add to report.
		 */
		getKeyword : function() {
			var customKeyword,
			    report = BOLDGRID.SEO.TinyMCE.getReport();
			if ( report.wordCount > 99 ) {
				if ( self.getCustomKeyword().length ) {
					customKeyword = self.getCustomKeyword();
				} else {
					// Set customKeyword to recommended keyword search.
					customKeyword = report.textstatistics.recommendedKeywords[0][0];
				}
			}

			return customKeyword;
		},
		/**
		 * Used to get the keyword for the report.
		 *
		 * Checks if a custom keyword has been set by the user, and
		 * if it hasn't it will use the autogenerated keyword that was
		 * determined based on the content.
		 *
		 * @since 1.3.1
		 *
		 * @returns {Object} msg Contains the scoring for each keyword related item.
		 */
		score : function() {
			var msg = {};
			msg = {
				title : self.titleScore(),
				description : self.descriptionScore(),
				//content : self.contentScore(),
			};
			return msg;
		},

		/**
		 * Used to get the keyword usage scoring description for the title.
		 *
		 * Checks the count provided for the number of times the keyword was
		 * used in the SEO Title.
		 *
		 * @since 1.3.1
		 *
		 * @param {Number} count The number of times keyword is used in the title.
		 *
		 * @returns {Object} msg Contains the status indicator color and message for report.
		 */
		titleScore : function( count ) {
			var msg = {
				status: 'green',
				msg : _bgseoContentAnalysis.seoTitle.keywordUsage.good,
			};
			if ( 0 === count ) {
				msg = {
					status: 'red',
					msg : _bgseoContentAnalysis.seoTitle.keywordUsage.bad,
				};
			}
			if ( count > 1 ) {
				msg = {
					status: 'yellow',
					msg : _bgseoContentAnalysis.seoTitle.keywordUsage.ok,
				};
			}

			return msg;
		},

		/**
		 * Used to get the keyword usage scoring description for the description.
		 *
		 * Checks the count provided for the number of times the keyword was
		 * used in the SEO Description field.
		 *
		 * @since 1.3.1
		 *
		 * @param {Number} count The number of times keyword is used in the description.
		 *
		 * @returns {Object} msg Contains the status indicator color and message for report.
		 */
		descriptionScore : function( count ) {
			var msg = {
				status: 'green',
				msg : _bgseoContentAnalysis.seoDescription.keywordUsage.good,
			};
			if ( 0 === count ) {
				msg = {
					status: 'red',
					msg : _bgseoContentAnalysis.seoDescription.keywordUsage.bad,
				};
			}
			if ( count > 1 ) {
				msg = {
					status: 'yellow',
					msg : _bgseoContentAnalysis.seoDescription.keywordUsage.ok,
				};
			}

			return msg;
		}
	};

	self = BOLDGRID.SEO.Keywords;

})( jQuery );
