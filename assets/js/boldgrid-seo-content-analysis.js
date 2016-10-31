( function ( $ ) {
	'use strict';

	var self;

	BOLDGRID.SEO.ContentAnalysis = {
		/**
		 * Initialize TinyMCE Content.
		 *
		 * @since 1.2.1
		 */
		init : function () {
			$( document ).ready( function() {
				self.seoTitle();
				self.seoDescription();
			});
		},
		// Gets the Flesch Kincaid Reading Ease Score.
		readingEase: function( content ) {
			var result;
			result = textstatistics( content ).fleschKincaidReadingEase();
			return result;
		},
		// Get the Flesch Kincaid Grade Level from content.
		gradeLevel: function( content ) {
			var grade, result = {};
			grade = textstatistics( content ).fleschKincaidGradeLevel();
			result = self.gradeAnalysis( grade );
			return result;
		},
		// Returns information about the grade for display.
		gradeAnalysis: function( grade ) {
			var description = {};
			grade = grade * 10;

			if ( grade > 90 ) {
				description = {
					'lengthScore'      : grade,
					'gradeLevel' : '5th grade',
					'explanation': 'Very easy to read. Easily understood by an average 11-year-old student.',
					'status' : 'green',
					'msg' : _bgseoContentAnalysis.readingEase.goodHigh,
				};
			}
			if ( grade.isBetween( 80, 90 ) ) {
				description = {
					'score'      : grade,
					'gradeLevel' : '6th grade',
					'explanation': 'Easy to read. Conversational English for consumers.',
					'status' : 'green',
					'msg' : _bgseoContentAnalysis.readingEase.goodMedHigh,
				};
			}
			if ( grade.isBetween( 70, 80 ) ) {
				description = {
					'score'      : grade,
					'gradeLevel' : '7th grade',
					'explanation': 'Fairly easy to read.',
					'status' : 'green',
					'msg' : _bgseoContentAnalysis.readingEase.goodMedLow,
				};
			}
			if ( grade.isBetween( 60, 70 ) ) {
				description = {
					'score'      : grade,
					'gradeLevel' : '8th & 9th',
					'explanation': 'Plain English. Easily understood by 13- to 15-year-old students.',
					'status' : 'green',
					'msg' : _bgseoContentAnalysis.readingEase.goodLow,
				};
			}
			if ( grade.isBetween( 50, 60 ) ) {
				description = {
					'score'      : grade,
					'gradeLevel' : '10th to 12th',
					'explanation': 'Fairly difficult to read.',
					'status' : 'yellow',
					'msg' : _bgseoContentAnalysis.readingEase.ok,
				};
			}
			if ( grade.isBetween( 30, 50 ) ) {
				description = {
					'score'      : grade,
					'gradeLevel' : 'College Student',
					'explanation': 'Difficult to read.',
					'status' : 'red',
					'msg' : _bgseoContentAnalysis.readingEase.badHigh,
				};
			}
			if ( grade < 30 ) {
				description = {
					'score'      : grade,
					'gradeLevel' : 'College Graduate',
					'explanation': 'Difficult to read.',
					'status' : 'red',
					'msg' : _bgseoContentAnalysis.readingEase.badLow,
				};
			}
			return description;
		},
		// Gets the count of the keywords in the content.
		keywordCount: function( content, keyword ) {
			var keywordCount;
			keywordCount = content.split( keyword ).length - 1;
			return keywordCount;
		},
		// Very basic kw density check.
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
		// Get recommended keywords from content.
		recommendedKeywords: function( text, n ) {
			// Split text on non word characters
			var words = text.toLowerCase().split( /\W+/ ),
			    positions = {},
			    wordCounts = [],
			    result;

			for ( var i=0; i < words.length; i++ ) {
				var word = words[i];
				if ( ! word || word.length < 3 || _bgseoStopWords.indexOf( word ) > -1 ) {
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
		seoTitle: function() {
			var title = $( '#boldgrid-seo-field-meta_title' );
			// Listen for changes to input value.
			title.on( 'input propertychange paste', function() {
				var titleLength = $( this ).val().length;
				$( this ).trigger( 'bgseo-analysis', [{'titleLength': titleLength}] );
			});
		},

		// Measured by character count.
		seoTitleLengthScore: function( titleLength ) {
			var msg = {};

			if ( titleLength === 0 ) {
				msg = {
					status: 'red',
					msg: _bgseoContentAnalysis.seoTitle.length.badEmpty,
				};
			}
			if ( titleLength.isBetween( 0, 30 ) ) {
				msg = {
					status: 'yellow',
					msg: _bgseoContentAnalysis.seoTitle.length.ok,
				};
			}
			if ( titleLength.isBetween( 30, 70 ) ) {
				msg = {
					status: 'green',
					msg: _bgseoContentAnalysis.seoTitle.length.good,
				};
			}

			if ( titleLength > 70 ) {
				msg = {
					status: 'red',
					msg: _bgseoContentAnalysis.seoTitle.length.badLong,
				};
			}

			return msg;
		},
		seoDescription: function() {
			var desc = $( '#boldgrid-seo-field-meta_description' );
			// Listen for changes to input value.
			desc.on( 'input propertychange paste', function() {
				var descLength = $( this ).val().length;
				$( this ).trigger( 'bgseo-analysis', [{ 'descLength': descLength }] );
			});
		},

		// Measured by character count.
		seoDescriptionLengthScore: function( descriptionLength ) {
			var msg = {};

			if ( descriptionLength === 0 ) {
				msg = {
					status: 'red',
					msg: _bgseoContentAnalysis.seoDescription.length.badEmpty,
				};
			}
			if ( descriptionLength.isBetween( 0, 126 ) ) {
				msg = {
					status: 'yellow',
					msg: _bgseoContentAnalysis.seoDescription.length.ok,
				};
			}
			if ( descriptionLength.isBetween( 125, 156 ) ) {
				msg = {
					status: 'green',
					msg: _bgseoContentAnalysis.seoDescriptione.length.good,
				};
			}
			if ( descriptionLength > 156 ) {
				msg = {
					status: 'red',
					msg: _bgseoContentAnalysis.seoDescription.length.badLong,
				};
			}

			return msg;
		},

		// Measured by word count.
		seoContentLengthScore: function( contentLength ) {
			var msg = {};

			if ( contentLength === 0 ) {
				msg = {
					status: 'red',
					msg: _bgseoContentAnalysis.content.length.badEmpty,
				};
			}
			if ( contentLength.isBetween( 0, 199 ) ) {
				msg = {
					status: 'red',
					msg: _bgseoContentAnalysis.content.length.badShort,
				};
			}
			if ( contentLength.isBetween( 198, 300 ) ) {
				msg = {
					status: 'yellow',
					msg: _bgseoContentAnalysis.content.length.ok,
				};
			}
			if ( contentLength > 299 ) {
				msg = {
					status: 'green',
					msg: _bgseoContentAnalysis.content.length.good,
				};
			}

			return msg;
		},
		// Checks if user has any images in their content.
		seoImageLengthScore: function( imageLength ) {
			var msg = {
				status: 'green',
				msg: _bgseoContentAnalysis.image.length.good,
			};
			if ( ! imageLength ) {
				msg = {
					status: 'red',
					msg: _bgseoContentAnalysis.image.length.bad,
				};
			}

			return msg;
		},
	};


	self = BOLDGRID.SEO.ContentAnalysis;

})( jQuery );

BOLDGRID.SEO.ContentAnalysis.init();
