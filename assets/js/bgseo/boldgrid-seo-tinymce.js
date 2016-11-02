( function ( $ ) {

	'use strict';

	var self;

	BOLDGRID.SEO.TinyMCE = {
		/**
		 * Initialize TinyMCE Content.
		 *
		 * @since 1.2.1
		 */
		init : function () {
			self.onloadContent();
			self.generateReport();
			$( document ).ready( function() {
				self.editorChange();
			});
		},
		onloadContent: function() {
			var text,
				editor = $( '#content.wp-editor-area[aria-hidden=false]' );
			$( window ).on( 'load bgseo-media-inserted', function() {
				var content;

				if ( tinymce.ActiveEditor ) {
					content = tinyMCE.get( wpActiveEditor ).getContent();
				} else {
					content = $( '#content' ).val();
					content = content.replace( /\r?\n|\r/g, '' );
				}

				content = {
					'raw': content,
					'text': self.stripper( content.toLowerCase() ),
				};

				$( '#content' ).trigger( 'bgseo-analysis', [content] );
			});
		},
		editorChange: function() {
			var text, targetId;
			$( '#content.wp-editor-area' ).on( 'input propertychange paste nodechange', function() {
				targetId = $( this ).attr( 'id' );
				text = self.wpContent( targetId );
			});
			return text;
		},
		tmceChange: function( e ) {
			var text, targetId = e.target.id;
			text = self.wpContent( targetId );
			return text;
		},
		wpContent : function( targetId ) {
			var text = {};
			switch ( targetId ) {
				// Grab text from TinyMCE Editor.
				case 'tinymce' :
					// Only do this if page/post editor has TinyMCE as active editor.
					if ( tinymce.activeEditor )
						// Define text as the content of the current TinyMCE instance.
						text = tinyMCE.get( wpActiveEditor ).getContent();
					break;
				case 'content' :
					text = $( '#content' ).val();
					text = text.replace( /\r?\n|\r/g, '' );
					break;
			}
			text = {
				'raw': text,
				'text': self.stripper( text.toLowerCase() ),
			};

			$( '#content' ).trigger( 'bgseo-analysis', [text] );

		},
		// Strip out remaining traces of HTML to form our cleanText output to scan
		stripper: function( html ) {
			var tmp;
			tmp = document.implementation.createHTMLDocument( 'New' ).body;
			tmp.innerHTML = html;
			return tmp.textContent || tmp.innerText || " ";
		},
		generateReport : function() {
			var words,
				count,
				report = {};

			$( document ).on( 'bgseo-analysis', function( e, eventInfo ) {
				var titleLength = $( '#boldgrid-seo-field-meta_title' ).val().length,
				    descriptionLength = $( '#boldgrid-seo-field-meta_description' ).val().length;

				report.title = {
					length : titleLength,
					lengthScore:  BOLDGRID.SEO.Title.titleScore( titleLength ),
					keywordUsage : 0,
				};
				report.description = {
					length : descriptionLength,
					lengthScore:  BOLDGRID.SEO.Description.descriptionScore( descriptionLength ),
					keywordUsage : 0,
				};

				report.robotIndex = {
					lengthScore: BOLDGRID.SEO.Robots.indexScore(),
				};

				report.robotFollow = {
					lengthScore: BOLDGRID.SEO.Robots.followScore(),
				};

				if ( eventInfo ) {
					// Get WordPress' more acurate word counts.
					if ( ! _.isUndefined( eventInfo.count ) ) {
						report.wordCount = eventInfo.count;
						report.content = {
							length : eventInfo.count,
							lengthScore : BOLDGRID.SEO.ContentAnalysis.seoContentLengthScore( eventInfo.count ),
						};
					} else if ( eventInfo.count === 0 ) {
						report.content = {
							length : 0,
							lengthScore : BOLDGRID.SEO.ContentAnalysis.seoContentLengthScore( 0 ),
						};
					}

					// Listen for changes to raw HTML in editor.
					if ( eventInfo.raw ) {
						var raw = eventInfo.raw, imgLength;
						imgLength = $( raw ).find( 'img' ).length;

						report.rawstatistics = {
							'h1Count': $( raw ).find( 'h1' ).length,
							'h2Count': $( raw ).find( 'h2' ).length,
							'h3Count': $( raw ).find( 'h3' ).length,
							imageCount: imgLength,
						};
						report.image = {
							length : imgLength,
							lengthScore: BOLDGRID.SEO.ContentAnalysis.seoImageLengthScore( imgLength ),
						};
					}

					// Listen for changes to the actual text entered by user.
					if ( eventInfo.text ) {
						var customKeyword, content = eventInfo.text;
						words = textstatistics( content ).wordCount();

						if ( words > 99 ) {
							report.textstatistics = {
								gradeLevel  : BOLDGRID.SEO.Readability.gradeLevel( content ),
								keywordDensity : BOLDGRID.SEO.Keywords.keywordDensity( content, 'gads' ),
								recommendedKeywords : BOLDGRID.SEO.Keywords.recommendedKeywords( content, 1 ),
							};

							if ( BOLDGRID.SEO.Keywords.getCustomKeyword().length ) {
								customKeyword = { customKeyword : BOLDGRID.SEO.Keywords.getCustomKeyword() };
							} else {
								// Set customKeyword to recommended keyword search.
								customKeyword = { customKeyword : report.textstatistics.recommendedKeywords[0][0] };
							}
							// Assign recommended keyword to text input placeholder.
							$( '#bgseo-custom-keyword' ).attr( 'placeholder', report.textstatistics.recommendedKeywords[0][0] );
							// Extends the report.
							_.extend( report.textstatistics, customKeyword );
						}
					}

					// Listen to changes to the SEO Title.
					if ( eventInfo.titleLength ) {
						report.title.length = eventInfo.titleLength;
					}

					// Listen to changes to the SEO Description.
					if ( eventInfo.descLength ) {
						report.description.length = eventInfo.descLength;
					}

					if ( eventInfo.robotIndex ) {
						report.robotIndex = {
							lengthScore : eventInfo.robotIndex,
						};
					}

					if ( eventInfo.robotFollow ) {
						report.robotFollow = {
							lengthScore : eventInfo.robotFollow,
						};
					}
				}
				console.log(report);
				// Send analysis to display the report.
				$( '#content' ).trigger( 'bgseo-report', [report] );
			});
		},
	};

	self = BOLDGRID.SEO.TinyMCE;

})( jQuery );

BOLDGRID.SEO.TinyMCE.init();
