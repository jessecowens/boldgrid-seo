describe( 'api.Tooltips.onReady() : Setup event listeners and get selector cache.', function() {

	sandbox( '<div id="butterbean-control-bgseo_robots_index" class="butterbean-control butterbean-control-radio"><span class="butterbean-label">Meta Robots Index<span class="bgseo-tooltip dashicons dashicons-editor-help" aria-expanded="false"></span></span><span class="butterbean-description" style="display: none;">Setting this to index means that search engines are encouraged to show your website in their search results.</span><ul class="butterbean-radio-list"><li><label><input type="radio" value="index" name="butterbean_boldgrid_seo_setting_bgseo_robots_index" checked="checked">index</label></li><li><label><input type="radio" value="noindex" name="butterbean_boldgrid_seo_setting_bgseo_robots_index">noindex</label></li></ul></div>' );

	it( 'Loads in $(document).ready().', function() {
		// Set document ready.
		BOLDGRID.SEO.Tooltips.onReady();
		expect( BOLDGRID.SEO.Tooltips.settings ).toBeDefined();
	});

	it( 'Calls _enableTooltips() on document ready initialize.', function() {
		var _enableTooltips = spyOn( BOLDGRID.SEO.Tooltips, '_enableTooltips' );
		// Set document ready.
		BOLDGRID.SEO.Tooltips.onReady();
		expect( _enableTooltips ).toHaveBeenCalled();
	});

	it( 'Calls _toggleTooltip() on document ready initialize.', function() {
		var _toggleTooltip = spyOn( BOLDGRID.SEO.Tooltips, '_toggleTooltip' );
		// Set document ready.
		BOLDGRID.SEO.Tooltips.onReady();
		expect( _toggleTooltip ).toHaveBeenCalled();
	});

	it( 'Calls to setup settings/selector cache.', function() {
		var getSettings = spyOn( BOLDGRID.SEO.Tooltips, 'getSettings' );
		// Set document ready.
		BOLDGRID.SEO.Tooltips.onReady();
		expect( getSettings ).toHaveBeenCalled();
	});

	it( 'Calls hideTooltips() on initialization.', function() {
		var hideTooltips = spyOn( BOLDGRID.SEO.Tooltips, 'hideTooltips' );
		// Set document ready.
		BOLDGRID.SEO.Tooltips.onReady();
		expect( hideTooltips ).toHaveBeenCalled();
	});

	it( 'It loads api.Robots selector cache stored in api.Robots.settings.', function() {
		expect( BOLDGRID.SEO.Tooltips.settings ).toBeDefined();
		settingsInitialized = BOLDGRID.SEO.Tooltips.settings;
		expect( settingsInitialized.description.selector ).toBe( '.butterbean-control .butterbean-description' );
	});

});
