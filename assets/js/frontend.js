/* Magnific Popup - v1.1.0 - 2016-02-20 */
;(function (factory) {
	if (typeof define === 'function' && define.amd) { 
		// AMD. Register as an anonymous module. 
		define(['jquery'], factory); 
		} else if (typeof exports === 'object') { 
		// Node/CommonJS 
		factory(require('jquery')); 
		} else { 
		// Browser globals 
		factory(window.jQuery || window.Zepto); 
		} 
		}(function($) { 
		
		/*>>core*/
		/**
		 * 
		 * Magnific Popup Core JS file
		 * 
		 */
		
		/**
		 * Private static constants
		 */
		var CLOSE_EVENT = 'Close',
				BEFORE_CLOSE_EVENT = 'BeforeClose',
				AFTER_CLOSE_EVENT = 'AfterClose',
				BEFORE_APPEND_EVENT = 'BeforeAppend',
				MARKUP_PARSE_EVENT = 'MarkupParse',
				OPEN_EVENT = 'Open',
				CHANGE_EVENT = 'Change',
				NS = 'mfp',
				EVENT_NS = '.' + NS,
				READY_CLASS = 'mfp-ready',
				REMOVING_CLASS = 'mfp-removing',
				PREVENT_CLOSE_CLASS = 'mfp-prevent-close';
		/**
		 * Private vars 
		 */
		/*jshint -W079 */
		var mfp, // As we have only one instance of MagnificPopup object, we define it locally to not to use 'this'
				MagnificPopup = function(){},
				_isJQ = !!(window.jQuery),
				_prevStatus,
				_window = $(window),
				_document,
				_prevContentType,
				_wrapClasses,
				_currPopupType;
		
		
		/**
		 * Private functions
		 */
		var _mfpOn = function(name, f) {
						mfp.ev.on(NS + name + EVENT_NS, f);
				},
				_getEl = function(className, appendTo, html, raw) {
						var el = document.createElement('div');
						el.className = 'mfp-'+className;
						if(html) {
								el.innerHTML = html;
						}
						if(!raw) {
								el = $(el);
								if(appendTo) {
										el.appendTo(appendTo);
								}
						} else if(appendTo) {
								appendTo.appendChild(el);
						}
						return el;
				},
				_mfpTrigger = function(e, data) {
						mfp.ev.triggerHandler(NS + e, data);
		
						if(mfp.st.callbacks) {
								// converts "mfpEventName" to "eventName" callback and triggers it if it's present
								e = e.charAt(0).toLowerCase() + e.slice(1);
								if(mfp.st.callbacks[e]) {
										mfp.st.callbacks[e].apply(mfp, $.isArray(data) ? data : [data]);
								}
						}
				},
				_getCloseBtn = function(type) {
						if(type !== _currPopupType || !mfp.currTemplate.closeBtn) {
								mfp.currTemplate.closeBtn = $( mfp.st.closeMarkup.replace('%title%', mfp.st.tClose ) );
								_currPopupType = type;
						}
						return mfp.currTemplate.closeBtn;
				},
				// Initialize Magnific Popup only when called at least once
				_checkInstance = function() {
						if(!$.magnificPopup.instance) {
								/*jshint -W020 */
								mfp = new MagnificPopup();
								mfp.init();
								$.magnificPopup.instance = mfp;
						}
				},
				// CSS transition detection, http://stackoverflow.com/questions/7264899/detect-css-transitions-using-javascript-and-without-modernizr
				supportsTransitions = function() {
						var s = document.createElement('p').style, // 's' for style. better to create an element if body yet to exist
								v = ['ms','O','Moz','Webkit']; // 'v' for vendor
		
						if( s['transition'] !== undefined ) {
								return true; 
						}
								
						while( v.length ) {
								if( v.pop() + 'Transition' in s ) {
										return true;
								}
						}
										
						return false;
				};
		
		/**
		 * Public functions
		 */
		MagnificPopup.prototype = {
		
				constructor: MagnificPopup,
		
				/**
				 * Initializes Magnific Popup plugin. 
				 * This function is triggered only once when $.fn.magnificPopup or $.magnificPopup is executed
				 */
				init: function() {
						var appVersion = navigator.appVersion;
						mfp.isLowIE = mfp.isIE8 = document.all && !document.addEventListener;
						mfp.isAndroid = (/android/gi).test(appVersion);
						mfp.isIOS = (/iphone|ipad|ipod/gi).test(appVersion);
						mfp.supportsTransition = supportsTransitions();
		
						// We disable fixed positioned lightbox on devices that don't handle it nicely.
						// If you know a better way of detecting this - let me know.
						mfp.probablyMobile = (mfp.isAndroid || mfp.isIOS || /(Opera Mini)|Kindle|webOS|BlackBerry|(Opera Mobi)|(Windows Phone)|IEMobile/i.test(navigator.userAgent) );
						_document = $(document);
		
						mfp.popupsCache = {};
				},
		
				/**
				 * Opens popup
				 * @param  data [description]
				 */
				open: function(data) {
		
						var i;
		
						if(data.isObj === false) { 
								// convert jQuery collection to array to avoid conflicts later
								mfp.items = data.items.toArray();
		
								mfp.index = 0;
								var items = data.items,
										item;
								for(i = 0; i < items.length; i++) {
										item = items[i];
										if(item.parsed) {
												item = item.el[0];
										}
										if(item === data.el[0]) {
												mfp.index = i;
												break;
										}
								}
						} else {
								mfp.items = $.isArray(data.items) ? data.items : [data.items];
								mfp.index = data.index || 0;
						}
		
						// if popup is already opened - we just update the content
						if(mfp.isOpen) {
								mfp.updateItemHTML();
								return;
						}
						
						mfp.types = []; 
						_wrapClasses = '';
						if(data.mainEl && data.mainEl.length) {
								mfp.ev = data.mainEl.eq(0);
						} else {
								mfp.ev = _document;
						}
		
						if(data.key) {
								if(!mfp.popupsCache[data.key]) {
										mfp.popupsCache[data.key] = {};
								}
								mfp.currTemplate = mfp.popupsCache[data.key];
						} else {
								mfp.currTemplate = {};
						}
		
		
		
						mfp.st = $.extend(true, {}, $.magnificPopup.defaults, data ); 
						mfp.fixedContentPos = mfp.st.fixedContentPos === 'auto' ? !mfp.probablyMobile : mfp.st.fixedContentPos;
		
						if(mfp.st.modal) {
								mfp.st.closeOnContentClick = false;
								mfp.st.closeOnBgClick = false;
								mfp.st.showCloseBtn = false;
								mfp.st.enableEscapeKey = false;
						}
						
						// Building markup
						// main containers are created only once
						if(!mfp.bgOverlay) {
		
								// Dark overlay
								mfp.bgOverlay = _getEl('bg').on('click'+EVENT_NS, function() {
										mfp.close();
								});
		
								mfp.wrap = _getEl('wrap').attr('tabindex', -1).on('click'+EVENT_NS, function(e) {
										if(mfp._checkIfClose(e.target)) {
												mfp.close();
										}
								});
		
								mfp.container = _getEl('container', mfp.wrap);
						}
		
						mfp.contentContainer = _getEl('content');
						if(mfp.st.preloader) {
								mfp.preloader = _getEl('preloader', mfp.container, mfp.st.tLoading);
						}
		
		
						// Initializing modules
						var modules = $.magnificPopup.modules;
						for(i = 0; i < modules.length; i++) {
								var n = modules[i];
								n = n.charAt(0).toUpperCase() + n.slice(1);
								mfp['init'+n].call(mfp);
						}
						_mfpTrigger('BeforeOpen');
		
		
						if(mfp.st.showCloseBtn) {
								// Close button
								if(!mfp.st.closeBtnInside) {
										mfp.wrap.append( _getCloseBtn() );
								} else {
										_mfpOn(MARKUP_PARSE_EVENT, function(e, template, values, item) {
												values.close_replaceWith = _getCloseBtn(item.type);
										});
										_wrapClasses += ' mfp-close-btn-in';
								}
						}
		
						if(mfp.st.alignTop) {
								_wrapClasses += ' mfp-align-top';
						}
		
				
		
						if(mfp.fixedContentPos) {
								mfp.wrap.css({
										overflow: mfp.st.overflowY,
										overflowX: 'hidden',
										overflowY: mfp.st.overflowY
								});
						} else {
								mfp.wrap.css({ 
										top: _window.scrollTop(),
										position: 'absolute'
								});
						}
						if( mfp.st.fixedBgPos === false || (mfp.st.fixedBgPos === 'auto' && !mfp.fixedContentPos) ) {
								mfp.bgOverlay.css({
										height: _document.height(),
										position: 'absolute'
								});
						}
		
						
		
						if(mfp.st.enableEscapeKey) {
								// Close on ESC key
								_document.on('keyup' + EVENT_NS, function(e) {
										if(e.keyCode === 27) {
												mfp.close();
										}
								});
						}
		
						_window.on('resize' + EVENT_NS, function() {
								mfp.updateSize();
						});
		
		
						if(!mfp.st.closeOnContentClick) {
								_wrapClasses += ' mfp-auto-cursor';
						}
						
						if(_wrapClasses)
								mfp.wrap.addClass(_wrapClasses);
		
		
						// this triggers recalculation of layout, so we get it once to not to trigger twice
						var windowHeight = mfp.wH = _window.height();
		
						
						var windowStyles = {};
		
						if( mfp.fixedContentPos ) {
								if(mfp._hasScrollBar(windowHeight)){
										var s = mfp._getScrollbarSize();
										if(s) {
												windowStyles.marginRight = s;
										}
								}
						}
		
						if(mfp.fixedContentPos) {
								if(!mfp.isIE7) {
										windowStyles.overflow = 'hidden';
								} else {
										// ie7 double-scroll bug
										$('body, html').css('overflow', 'hidden');
								}
						}
		
						
						
						var classesToadd = mfp.st.mainClass;
						if(mfp.isIE7) {
								classesToadd += ' mfp-ie7';
						}
						if(classesToadd) {
								mfp._addClassToMFP( classesToadd );
						}
		
						// add content
						mfp.updateItemHTML();
		
						_mfpTrigger('BuildControls');
		
						// remove scrollbar, add margin e.t.c
						$('html').css(windowStyles);
						
						// add everything to DOM
						mfp.bgOverlay.add(mfp.wrap).prependTo( mfp.st.prependTo || $(document.body) );
		
						// Save last focused element
						mfp._lastFocusedEl = document.activeElement;
						
						// Wait for next cycle to allow CSS transition
						setTimeout(function() {
								
								if(mfp.content) {
										mfp._addClassToMFP(READY_CLASS);
										mfp._setFocus();
								} else {
										// if content is not defined (not loaded e.t.c) we add class only for BG
										mfp.bgOverlay.addClass(READY_CLASS);
								}
								
								// Trap the focus in popup
								_document.on('focusin' + EVENT_NS, mfp._onFocusIn);
		
						}, 16);
		
						mfp.isOpen = true;
						mfp.updateSize(windowHeight);
						_mfpTrigger(OPEN_EVENT);
		
						return data;
				},
		
				/**
				 * Closes the popup
				 */
				close: function() {
						if(!mfp.isOpen) return;
						_mfpTrigger(BEFORE_CLOSE_EVENT);
		
						mfp.isOpen = false;
						// for CSS3 animation
						if(mfp.st.removalDelay && !mfp.isLowIE && mfp.supportsTransition )  {
								mfp._addClassToMFP(REMOVING_CLASS);
								setTimeout(function() {
										mfp._close();
								}, mfp.st.removalDelay);
						} else {
								mfp._close();
						}
				},
		
				/**
				 * Helper for close() function
				 */
				_close: function() {
						_mfpTrigger(CLOSE_EVENT);
		
						var classesToRemove = REMOVING_CLASS + ' ' + READY_CLASS + ' ';
		
						mfp.bgOverlay.detach();
						mfp.wrap.detach();
						mfp.container.empty();
		
						if(mfp.st.mainClass) {
								classesToRemove += mfp.st.mainClass + ' ';
						}
		
						mfp._removeClassFromMFP(classesToRemove);
		
						if(mfp.fixedContentPos) {
								var windowStyles = {marginRight: ''};
								if(mfp.isIE7) {
										$('body, html').css('overflow', '');
								} else {
										windowStyles.overflow = '';
								}
								$('html').css(windowStyles);
						}
						
						_document.off('keyup' + EVENT_NS + ' focusin' + EVENT_NS);
						mfp.ev.off(EVENT_NS);
		
						// clean up DOM elements that aren't removed
						mfp.wrap.attr('class', 'mfp-wrap').removeAttr('style');
						mfp.bgOverlay.attr('class', 'mfp-bg');
						mfp.container.attr('class', 'mfp-container');
		
						// remove close button from target element
						if(mfp.st.showCloseBtn &&
						(!mfp.st.closeBtnInside || mfp.currTemplate[mfp.currItem.type] === true)) {
								if(mfp.currTemplate.closeBtn)
										mfp.currTemplate.closeBtn.detach();
						}
		
		
						if(mfp.st.autoFocusLast && mfp._lastFocusedEl) {
								$(mfp._lastFocusedEl).focus(); // put tab focus back
						}
						mfp.currItem = null;	
						mfp.content = null;
						mfp.currTemplate = null;
						mfp.prevHeight = 0;
		
						_mfpTrigger(AFTER_CLOSE_EVENT);
				},
				
				updateSize: function(winHeight) {
		
						if(mfp.isIOS) {
								// fixes iOS nav bars https://github.com/dimsemenov/Magnific-Popup/issues/2
								var zoomLevel = document.documentElement.clientWidth / window.innerWidth;
								var height = window.innerHeight * zoomLevel;
								mfp.wrap.css('height', height);
								mfp.wH = height;
						} else {
								mfp.wH = winHeight || _window.height();
						}
						// Fixes #84: popup incorrectly positioned with position:relative on body
						if(!mfp.fixedContentPos) {
								mfp.wrap.css('height', mfp.wH);
						}
		
						_mfpTrigger('Resize');
		
				},
		
				/**
				 * Set content of popup based on current index
				 */
				updateItemHTML: function() {
						var item = mfp.items[mfp.index];
		
						// Detach and perform modifications
						mfp.contentContainer.detach();
		
						if(mfp.content)
								mfp.content.detach();
		
						if(!item.parsed) {
								item = mfp.parseEl( mfp.index );
						}
		
						var type = item.type;
		
						_mfpTrigger('BeforeChange', [mfp.currItem ? mfp.currItem.type : '', type]);
						// BeforeChange event works like so:
						// _mfpOn('BeforeChange', function(e, prevType, newType) { });
		
						mfp.currItem = item;
		
						if(!mfp.currTemplate[type]) {
								var markup = mfp.st[type] ? mfp.st[type].markup : false;
		
								// allows to modify markup
								_mfpTrigger('FirstMarkupParse', markup);
		
								if(markup) {
										mfp.currTemplate[type] = $(markup);
								} else {
										// if there is no markup found we just define that template is parsed
										mfp.currTemplate[type] = true;
								}
						}
		
						if(_prevContentType && _prevContentType !== item.type) {
								mfp.container.removeClass('mfp-'+_prevContentType+'-holder');
						}
		
						var newContent = mfp['get' + type.charAt(0).toUpperCase() + type.slice(1)](item, mfp.currTemplate[type]);
						mfp.appendContent(newContent, type);
		
						item.preloaded = true;
		
						_mfpTrigger(CHANGE_EVENT, item);
						_prevContentType = item.type;
		
						// Append container back after its content changed
						mfp.container.prepend(mfp.contentContainer);
		
						_mfpTrigger('AfterChange');
				},
		
		
				/**
				 * Set HTML content of popup
				 */
				appendContent: function(newContent, type) {
						mfp.content = newContent;
		
						if(newContent) {
								if(mfp.st.showCloseBtn && mfp.st.closeBtnInside &&
										mfp.currTemplate[type] === true) {
										// if there is no markup, we just append close button element inside
										if(!mfp.content.find('.mfp-close').length) {
												mfp.content.append(_getCloseBtn());
										}
								} else {
										mfp.content = newContent;
								}
						} else {
								mfp.content = '';
						}
		
						_mfpTrigger(BEFORE_APPEND_EVENT);
						mfp.container.addClass('mfp-'+type+'-holder');
		
						mfp.contentContainer.append(mfp.content);
				},
		
		
				/**
				 * Creates Magnific Popup data object based on given data
				 * @param  {int} index Index of item to parse
				 */
				parseEl: function(index) {
						var item = mfp.items[index],
								type;
		
						if(item.tagName) {
								item = { el: $(item) };
						} else {
								type = item.type;
								item = { data: item, src: item.src };
						}
		
						if(item.el) {
								var types = mfp.types;
		
								// check for 'mfp-TYPE' class
								for(var i = 0; i < types.length; i++) {
										if( item.el.hasClass('mfp-'+types[i]) ) {
												type = types[i];
												break;
										}
								}
		
								item.src = item.el.attr('data-mfp-src');
								if(!item.src) {
										item.src = item.el.attr('href');
								}
						}
		
						item.type = type || mfp.st.type || 'inline';
						item.index = index;
						item.parsed = true;
						mfp.items[index] = item;
						_mfpTrigger('ElementParse', item);
		
						return mfp.items[index];
				},
		
		
				/**
				 * Initializes single popup or a group of popups
				 */
				addGroup: function(el, options) {
						var eHandler = function(e) {
								e.mfpEl = this;
								mfp._openClick(e, el, options);
						};
		
						if(!options) {
								options = {};
						}
		
						var eName = 'click.magnificPopup';
						options.mainEl = el;
		
						if(options.items) {
								options.isObj = true;
								el.off(eName).on(eName, eHandler);
						} else {
								options.isObj = false;
								if(options.delegate) {
										el.off(eName).on(eName, options.delegate , eHandler);
								} else {
										options.items = el;
										el.off(eName).on(eName, eHandler);
								}
						}
				},
				_openClick: function(e, el, options) {
						var midClick = options.midClick !== undefined ? options.midClick : $.magnificPopup.defaults.midClick;

						if(!midClick && ( e.which === 2 || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey ) ) {
								return;
						}
		
						var disableOn = options.disableOn !== undefined ? options.disableOn : $.magnificPopup.defaults.disableOn;
		
						if(disableOn) {
								if($.isFunction(disableOn)) {
										if( !disableOn.call(mfp) ) {
												return true;
										}
								} else { // else it's number
										if( _window.width() < disableOn ) {
												return true;
										}
								}
						}
		
						if(e.type) {
								e.preventDefault();
		
								// This will prevent popup from closing if element is inside and popup is already opened
								if(mfp.isOpen) {
										e.stopPropagation();
								}
						}
		
						options.el = $(e.mfpEl);
						if(options.delegate) {
								options.items = el.find(options.delegate);
						}
						mfp.open(options);
				},
		
		
				/**
				 * Updates text on preloader
				 */
				updateStatus: function(status, text) {
		
						if(mfp.preloader) {
								if(_prevStatus !== status) {
										mfp.container.removeClass('mfp-s-'+_prevStatus);
								}
		
								if(!text && status === 'loading') {
										text = mfp.st.tLoading;
								}
		
								var data = {
										status: status,
										text: text
								};
								// allows to modify status
								_mfpTrigger('UpdateStatus', data);
		
								status = data.status;
								text = data.text;
		
								mfp.preloader.html(text);
		
								mfp.preloader.find('a').on('click', function(e) {
										e.stopImmediatePropagation();
								});
		
								mfp.container.addClass('mfp-s-'+status);
								_prevStatus = status;
						}
				},
		
		
				/*
						"Private" helpers that aren't private at all
				 */
				// Check to close popup or not
				// "target" is an element that was clicked
				_checkIfClose: function(target) {
		
						if($(target).hasClass(PREVENT_CLOSE_CLASS)) {
								return;
						}
		
						var closeOnContent = mfp.st.closeOnContentClick;
						var closeOnBg = mfp.st.closeOnBgClick;
		
						if(closeOnContent && closeOnBg) {
								return true;
						} else {
		
								// We close the popup if click is on close button or on preloader. Or if there is no content.
								if(!mfp.content || $(target).hasClass('mfp-close') || (mfp.preloader && target === mfp.preloader[0]) ) {
										return true;
								}
		
								// if click is outside the content
								if(  (target !== mfp.content[0] && !$.contains(mfp.content[0], target))  ) {
										if(closeOnBg) {
												// last check, if the clicked element is in DOM, (in case it's removed onclick)
												if( $.contains(document, target) ) {
														return true;
												}
										}
								} else if(closeOnContent) {
										return true;
								}
		
						}
						return false;
				},
				_addClassToMFP: function(cName) {
						mfp.bgOverlay.addClass(cName);
						mfp.wrap.addClass(cName);
				},
				_removeClassFromMFP: function(cName) {
						this.bgOverlay.removeClass(cName);
						mfp.wrap.removeClass(cName);
				},
				_hasScrollBar: function(winHeight) {
						return (  (mfp.isIE7 ? _document.height() : document.body.scrollHeight) > (winHeight || _window.height()) );
				},
				_setFocus: function() {
						(mfp.st.focus ? mfp.content.find(mfp.st.focus).eq(0) : mfp.wrap).focus();
				},
				_onFocusIn: function(e) {
						if( e.target !== mfp.wrap[0] && !$.contains(mfp.wrap[0], e.target) ) {
								mfp._setFocus();
								return false;
						}
				},
				_parseMarkup: function(template, values, item) {
						var arr;
						if(item.data) {
								values = $.extend(item.data, values);
						}
						_mfpTrigger(MARKUP_PARSE_EVENT, [template, values, item] );
		
						$.each(values, function(key, value) {
								if(value === undefined || value === false) {
										return true;
								}
								arr = key.split('_');
								if(arr.length > 1) {
										var el = template.find(EVENT_NS + '-'+arr[0]);
		
										if(el.length > 0) {
												var attr = arr[1];
												if(attr === 'replaceWith') {
														if(el[0] !== value[0]) {
																el.replaceWith(value);
														}
												} else if(attr === 'img') {
														if(el.is('img')) {
																el.attr('src', value);
														} else {
																el.replaceWith( $('<img>').attr('src', value).attr('class', el.attr('class')) );
														}
												} else {
														el.attr(arr[1], value);
												}
										}
		
								} else {
										template.find(EVENT_NS + '-'+key).html(value);
								}
						});
				},
		
				_getScrollbarSize: function() {
						// thx David
						if(mfp.scrollbarSize === undefined) {
								var scrollDiv = document.createElement("div");
								scrollDiv.style.cssText = 'width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;';
								document.body.appendChild(scrollDiv);
								mfp.scrollbarSize = scrollDiv.offsetWidth - scrollDiv.clientWidth;
								document.body.removeChild(scrollDiv);
						}
						return mfp.scrollbarSize;
				}
		
		}; /* MagnificPopup core prototype end */
		
		/**
		 * Public static functions
		*/
		$.magnificPopup = {
				instance: null,
				proto: MagnificPopup.prototype,
				modules: [],
		
				open: function(options, index) {
						_checkInstance();
		
						if(!options) {
								options = {};
						} else {
								options = $.extend(true, {}, options);
						}
		
						options.isObj = true;
						options.index = index || 0;
						return this.instance.open(options);
				},
		
				close: function() {
						return $.magnificPopup.instance && $.magnificPopup.instance.close();
				},
		
				registerModule: function(name, module) {
						if(module.options) {
								$.magnificPopup.defaults[name] = module.options;
						}
						$.extend(this.proto, module.proto);
						this.modules.push(name);
				},
		
				defaults: {
						disableOn: 0,
						key: null,
						midClick: false,
						mainClass: '',
						preloader: true,
						focus: '', // CSS selector of input to focus after popup is opened
						closeOnContentClick: false,
						closeOnBgClick: true,
						closeBtnInside: true,
						showCloseBtn: true,
						enableEscapeKey: true,
						modal: false,
						alignTop: false,
						removalDelay: 0,
						prependTo: null,
						fixedContentPos: 'auto',
						fixedBgPos: 'auto',
						overflowY: 'auto',
						closeMarkup: '<button title="%title%" type="button" class="mfp-close">&#215;</button>',
						tClose: 'Close (Esc)',
						tLoading: 'Loading...',
						autoFocusLast: true
				}
		};

		$.fn.magnificPopup = function(options) {
				_checkInstance();
		
				var jqEl = $(this);
		
				// We call some API method of first param is a string
				if (typeof options === "string" ) {
		
						if(options === 'open') {
								var items,
										itemOpts = _isJQ ? jqEl.data('magnificPopup') : jqEl[0].magnificPopup,
										index = parseInt(arguments[1], 10) || 0;
		
								if(itemOpts.items) {
										items = itemOpts.items[index];
								} else {
										items = jqEl;
										if(itemOpts.delegate) {
												items = items.find(itemOpts.delegate);
										}
										items = items.eq( index );
								}
								mfp._openClick({mfpEl:items}, jqEl, itemOpts);
						} else {
								if(mfp.isOpen)
										mfp[options].apply(mfp, Array.prototype.slice.call(arguments, 1));
						}
		
				} else {
						// clone options obj
						options = $.extend(true, {}, options);
		
						/*
						 * As Zepto doesn't support .data() method for objects
						 * and it works only in normal browsers
						 * we assign "options" object directly to the DOM element. FTW!
						 */
						if(_isJQ) {
								jqEl.data('magnificPopup', options);
						} else {
								jqEl[0].magnificPopup = options;
						}
		
						mfp.addGroup(jqEl, options);
		
				}
				return jqEl;
		};
		
		/*>>core*/
		
		/*>>inline*/
		
		var INLINE_NS = 'inline',
				_hiddenClass,
				_inlinePlaceholder,
				_lastInlineElement,
				_putInlineElementsBack = function() {
						if(_lastInlineElement) {
								_inlinePlaceholder.after( _lastInlineElement.addClass(_hiddenClass) ).detach();
								_lastInlineElement = null;
						}
				};
		
		$.magnificPopup.registerModule(INLINE_NS, {
				options: {
						hiddenClass: 'hide', // will be appended with `mfp-` prefix
						markup: '',
						tNotFound: 'Content not found'
				},
				proto: {
		
						initInline: function() {
								mfp.types.push(INLINE_NS);
		
								_mfpOn(CLOSE_EVENT+'.'+INLINE_NS, function() {
										_putInlineElementsBack();
								});
						},
		
						getInline: function(item, template) {
		
								_putInlineElementsBack();
		
								if(item.src) {
										var inlineSt = mfp.st.inline,
												el = $(item.src);
		
										if(el.length) {
		
												// If target element has parent - we replace it with placeholder and put it back after popup is closed
												var parent = el[0].parentNode;
												if(parent && parent.tagName) {
														if(!_inlinePlaceholder) {
																_hiddenClass = inlineSt.hiddenClass;
																_inlinePlaceholder = _getEl(_hiddenClass);
																_hiddenClass = 'mfp-'+_hiddenClass;
														}
														// replace target inline element with placeholder
														_lastInlineElement = el.after(_inlinePlaceholder).detach().removeClass(_hiddenClass);
												}
		
												mfp.updateStatus('ready');
										} else {
												mfp.updateStatus('error', inlineSt.tNotFound);
												el = $('<div>');
										}
		
										item.inlineElement = el;
										return el;
								}
		
								mfp.updateStatus('ready');
								mfp._parseMarkup(template, {}, item);
								return template;
						}
				}
		});
		
		/*>>inline*/
		/*>>image*/
		var _imgInterval,
				_getTitle = function(item) {
						if(item.data && item.data.title !== undefined)
								return item.data.title;
		
						var src = mfp.st.image.titleSrc;
		
						if(src) {
								if($.isFunction(src)) {
										return src.call(mfp, item);
								} else if(item.el) {
										return item.el.attr(src) || '';
								}
						}
						return '';
				};
		
		$.magnificPopup.registerModule('image', {
		
				options: {
						markup: '<div class="mfp-figure">'+
												'<div class="mfp-close"></div>'+
												'<figure>'+
														'<div class="mfp-img"></div>'+
														'<figcaption>'+
																'<div class="mfp-bottom-bar">'+
																		'<div class="mfp-title"></div>'+
																		'<div class="mfp-counter"></div>'+
																'</div>'+
														'</figcaption>'+
												'</figure>'+
										'</div>',
						cursor: 'mfp-zoom-out-cur',
						titleSrc: 'title',
						verticalFit: true,
						tError: '<a href="%url%">The image</a> could not be loaded.'
				},
		
				proto: {
						initImage: function() {
								var imgSt = mfp.st.image,
										ns = '.image';
		
								mfp.types.push('image');
		
								_mfpOn(OPEN_EVENT+ns, function() {
										if(mfp.currItem.type === 'image' && imgSt.cursor) {
												$(document.body).addClass(imgSt.cursor);
										}
								});
		
								_mfpOn(CLOSE_EVENT+ns, function() {
										if(imgSt.cursor) {
												$(document.body).removeClass(imgSt.cursor);
										}
										_window.off('resize' + EVENT_NS);
								});
		
								_mfpOn('Resize'+ns, mfp.resizeImage);
								if(mfp.isLowIE) {
										_mfpOn('AfterChange', mfp.resizeImage);
								}
						},
						resizeImage: function() {
								var item = mfp.currItem;
								if(!item || !item.img) return;
		
								if(mfp.st.image.verticalFit) {
										var decr = 0;
										// fix box-sizing in ie7/8
										if(mfp.isLowIE) {
												decr = parseInt(item.img.css('padding-top'), 10) + parseInt(item.img.css('padding-bottom'),10);
										}
										item.img.css('max-height', mfp.wH-decr);
								}
						},
						_onImageHasSize: function(item) {
								if(item.img) {
		
										item.hasSize = true;
		
										if(_imgInterval) {
												clearInterval(_imgInterval);
										}
		
										item.isCheckingImgSize = false;
		
										_mfpTrigger('ImageHasSize', item);
		
										if(item.imgHidden) {
												if(mfp.content)
														mfp.content.removeClass('mfp-loading');
		
												item.imgHidden = false;
										}
		
								}
						},
		
						/**
						 * Function that loops until the image has size to display elements that rely on it asap
						 */
						findImageSize: function(item) {
		
								var counter = 0,
										img = item.img[0],
										mfpSetInterval = function(delay) {
		
												if(_imgInterval) {
														clearInterval(_imgInterval);
												}
												// decelerating interval that checks for size of an image
												_imgInterval = setInterval(function() {
														if(img.naturalWidth > 0) {
																mfp._onImageHasSize(item);
																return;
														}
		
														if(counter > 200) {
																clearInterval(_imgInterval);
														}
		
														counter++;
														if(counter === 3) {
																mfpSetInterval(10);
														} else if(counter === 40) {
																mfpSetInterval(50);
														} else if(counter === 100) {
																mfpSetInterval(500);
														}
												}, delay);
										};
		
								mfpSetInterval(1);
						},
		
						getImage: function(item, template) {
		
								var guard = 0,
		
										// image load complete handler
										onLoadComplete = function() {
												if(item) {
														if (item.img[0].complete) {
																item.img.off('.mfploader');
		
																if(item === mfp.currItem){
																		mfp._onImageHasSize(item);
		
																		mfp.updateStatus('ready');
																}
		
																item.hasSize = true;
																item.loaded = true;
		
																_mfpTrigger('ImageLoadComplete');
		
														}
														else {
																// if image complete check fails 200 times (20 sec), we assume that there was an error.
																guard++;
																if(guard < 200) {
																		setTimeout(onLoadComplete,100);
																} else {
																		onLoadError();
																}
														}
												}
										},
		
										// image error handler
										onLoadError = function() {
												if(item) {
														item.img.off('.mfploader');
														if(item === mfp.currItem){
																mfp._onImageHasSize(item);
																mfp.updateStatus('error', imgSt.tError.replace('%url%', item.src) );
														}
		
														item.hasSize = true;
														item.loaded = true;
														item.loadError = true;
												}
										},
										imgSt = mfp.st.image;
		
		
								var el = template.find('.mfp-img');
								if(el.length) {
										var img = document.createElement('img');
										img.className = 'mfp-img';
										if(item.el && item.el.find('img').length) {
												img.alt = item.el.find('img').attr('alt');
										}
										item.img = $(img).on('load.mfploader', onLoadComplete).on('error.mfploader', onLoadError);
										img.src = item.src;
		
										// without clone() "error" event is not firing when IMG is replaced by new IMG
										// TODO: find a way to avoid such cloning
										if(el.is('img')) {
												item.img = item.img.clone();
										}
		
										img = item.img[0];
										if(img.naturalWidth > 0) {
												item.hasSize = true;
										} else if(!img.width) {
												item.hasSize = false;
										}
								}
		
								mfp._parseMarkup(template, {
										title: _getTitle(item),
										img_replaceWith: item.img
								}, item);
		
								mfp.resizeImage();
		
								if(item.hasSize) {
										if(_imgInterval) clearInterval(_imgInterval);
		
										if(item.loadError) {
												template.addClass('mfp-loading');
												mfp.updateStatus('error', imgSt.tError.replace('%url%', item.src) );
										} else {
												template.removeClass('mfp-loading');
												mfp.updateStatus('ready');
										}
										return template;
								}
		
								mfp.updateStatus('loading');
								item.loading = true;
		
								if(!item.hasSize) {
										item.imgHidden = true;
										template.addClass('mfp-loading');
										mfp.findImageSize(item);
								}
		
								return template;
						}
				}
		});

		/*>>image*/

		/*>>retina*/
		_checkInstance(); 
}));

/*!
 * SelectWoo 1.0.6
 * https://github.com/woocommerce/selectWoo
 *
 * Released under the MIT license
 * https://github.com/woocommerce/selectWoo/blob/master/LICENSE.md
 */
(function (factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define(['jquery'], factory);
	} else if (typeof module === 'object' && module.exports) {
		// Node/CommonJS
		module.exports = function (root, jQuery) {
			if (jQuery === undefined) {
				// require('jQuery') returns a factory that requires window to
				// build a jQuery instance, we normalize how we use modules
				// that require this pattern but the window provided is a noop
				// if it's defined (how jquery works)
				if (typeof window !== 'undefined') {
					jQuery = require('jquery');
				}
				else {
					jQuery = require('jquery')(root);
				}
			}
			factory(jQuery);
			return jQuery;
		};
	} else {
		// Browser globals
		factory(jQuery);
	}
} (function (jQuery) {
		// This is needed so we can catch the AMD loader configuration and use it
		// The inner file should be wrapped (by `banner.start.js`) in a function that
		// returns the AMD loader references.
		var S2 =(function () {
		// Restore the Select2 AMD loader so it can be used
		// Needed mostly in the language files, where the loader is not inserted
		if (jQuery && jQuery.fn && jQuery.fn.select2 && jQuery.fn.select2.amd) {
			var S2 = jQuery.fn.select2.amd;
		}
	var S2;(function () { if (!S2 || !S2.requirejs) {
	if (!S2) { S2 = {}; } else { require = S2; }
	/**
	 * @license almond 0.3.3 Copyright jQuery Foundation and other contributors.
	 * Released under MIT license, http://github.com/requirejs/almond/LICENSE
	 */
	//Going sloppy to avoid 'use strict' string cost, but strict practices should
	//be followed.
	/*global setTimeout: false */
	
	var requirejs, require, define;
	(function (undef) {
			var main, req, makeMap, handlers,
					defined = {},
					waiting = {},
					config = {},
					defining = {},
					hasOwn = Object.prototype.hasOwnProperty,
					aps = [].slice,
					jsSuffixRegExp = /\.js$/;
	
			function hasProp(obj, prop) {
					return hasOwn.call(obj, prop);
			}
	
			/**
			 * Given a relative module name, like ./something, normalize it to
			 * a real name that can be mapped to a path.
			 * @param {String} name the relative name
			 * @param {String} baseName a real name that the name arg is relative
			 * to.
			 * @returns {String} normalized name
			 */
			function normalize(name, baseName) {
					var nameParts, nameSegment, mapValue, foundMap, lastIndex,
							foundI, foundStarMap, starI, i, j, part, normalizedBaseParts,
							baseParts = baseName && baseName.split("/"),
							map = config.map,
							starMap = (map && map['*']) || {};
	
					//Adjust any relative paths.
					if (name) {
							name = name.split('/');
							lastIndex = name.length - 1;
	
							// If wanting node ID compatibility, strip .js from end
							// of IDs. Have to do this here, and not in nameToUrl
							// because node allows either .js or non .js to map
							// to same file.
							if (config.nodeIdCompat && jsSuffixRegExp.test(name[lastIndex])) {
									name[lastIndex] = name[lastIndex].replace(jsSuffixRegExp, '');
							}
	
							// Starts with a '.' so need the baseName
							if (name[0].charAt(0) === '.' && baseParts) {
									//Convert baseName to array, and lop off the last part,
									//so that . matches that 'directory' and not name of the baseName's
									//module. For instance, baseName of 'one/two/three', maps to
									//'one/two/three.js', but we want the directory, 'one/two' for
									//this normalization.
									normalizedBaseParts = baseParts.slice(0, baseParts.length - 1);
									name = normalizedBaseParts.concat(name);
							}
	
							//start trimDots
							for (i = 0; i < name.length; i++) {
									part = name[i];
									if (part === '.') {
											name.splice(i, 1);
											i -= 1;
									} else if (part === '..') {
											// If at the start, or previous value is still ..,
											// keep them so that when converted to a path it may
											// still work when converted to a path, even though
											// as an ID it is less than ideal. In larger point
											// releases, may be better to just kick out an error.
											if (i === 0 || (i === 1 && name[2] === '..') || name[i - 1] === '..') {
													continue;
											} else if (i > 0) {
													name.splice(i - 1, 2);
													i -= 2;
											}
									}
							}
							//end trimDots
	
							name = name.join('/');
					}
	
					//Apply map config if available.
					if ((baseParts || starMap) && map) {
							nameParts = name.split('/');
	
							for (i = nameParts.length; i > 0; i -= 1) {
									nameSegment = nameParts.slice(0, i).join("/");
	
									if (baseParts) {
											//Find the longest baseName segment match in the config.
											//So, do joins on the biggest to smallest lengths of baseParts.
											for (j = baseParts.length; j > 0; j -= 1) {
													mapValue = map[baseParts.slice(0, j).join('/')];
	
													//baseName segment has  config, find if it has one for
													//this name.
													if (mapValue) {
															mapValue = mapValue[nameSegment];
															if (mapValue) {
																	//Match, update name to the new value.
																	foundMap = mapValue;
																	foundI = i;
																	break;
															}
													}
											}
									}
	
									if (foundMap) {
											break;
									}
	
									//Check for a star map match, but just hold on to it,
									//if there is a shorter segment match later in a matching
									//config, then favor over this star map.
									if (!foundStarMap && starMap && starMap[nameSegment]) {
											foundStarMap = starMap[nameSegment];
											starI = i;
									}
							}
	
							if (!foundMap && foundStarMap) {
									foundMap = foundStarMap;
									foundI = starI;
							}
	
							if (foundMap) {
									nameParts.splice(0, foundI, foundMap);
									name = nameParts.join('/');
							}
					}
	
					return name;
			}
	
			function makeRequire(relName, forceSync) {
					return function () {
							//A version of a require function that passes a moduleName
							//value for items that may need to
							//look up paths relative to the moduleName
							var args = aps.call(arguments, 0);
	
							//If first arg is not require('string'), and there is only
							//one arg, it is the array form without a callback. Insert
							//a null so that the following concat is correct.
							if (typeof args[0] !== 'string' && args.length === 1) {
									args.push(null);
							}
							return req.apply(undef, args.concat([relName, forceSync]));
					};
			}
	
			function makeNormalize(relName) {
					return function (name) {
							return normalize(name, relName);
					};
			}
	
			function makeLoad(depName) {
					return function (value) {
							defined[depName] = value;
					};
			}
	
			function callDep(name) {
					if (hasProp(waiting, name)) {
							var args = waiting[name];
							delete waiting[name];
							defining[name] = true;
							main.apply(undef, args);
					}
	
					if (!hasProp(defined, name) && !hasProp(defining, name)) {
							throw new Error('No ' + name);
					}
					return defined[name];
			}
	
			//Turns a plugin!resource to [plugin, resource]
			//with the plugin being undefined if the name
			//did not have a plugin prefix.
			function splitPrefix(name) {
					var prefix,
							index = name ? name.indexOf('!') : -1;
					if (index > -1) {
							prefix = name.substring(0, index);
							name = name.substring(index + 1, name.length);
					}
					return [prefix, name];
			}
	
			//Creates a parts array for a relName where first part is plugin ID,
			//second part is resource ID. Assumes relName has already been normalized.
			function makeRelParts(relName) {
					return relName ? splitPrefix(relName) : [];
			}
	
			/**
			 * Makes a name map, normalizing the name, and using a plugin
			 * for normalization if necessary. Grabs a ref to plugin
			 * too, as an optimization.
			 */
			makeMap = function (name, relParts) {
					var plugin,
							parts = splitPrefix(name),
							prefix = parts[0],
							relResourceName = relParts[1];
	
					name = parts[1];
	
					if (prefix) {
							prefix = normalize(prefix, relResourceName);
							plugin = callDep(prefix);
					}
	
					//Normalize according
					if (prefix) {
							if (plugin && plugin.normalize) {
									name = plugin.normalize(name, makeNormalize(relResourceName));
							} else {
									name = normalize(name, relResourceName);
							}
					} else {
							name = normalize(name, relResourceName);
							parts = splitPrefix(name);
							prefix = parts[0];
							name = parts[1];
							if (prefix) {
									plugin = callDep(prefix);
							}
					}
	
					//Using ridiculous property names for space reasons
					return {
							f: prefix ? prefix + '!' + name : name, //fullName
							n: name,
							pr: prefix,
							p: plugin
					};
			};
	
			function makeConfig(name) {
					return function () {
							return (config && config.config && config.config[name]) || {};
					};
			}
	
			handlers = {
					require: function (name) {
							return makeRequire(name);
					},
					exports: function (name) {
							var e = defined[name];
							if (typeof e !== 'undefined') {
									return e;
							} else {
									return (defined[name] = {});
							}
					},
					module: function (name) {
							return {
									id: name,
									uri: '',
									exports: defined[name],
									config: makeConfig(name)
							};
					}
			};
	
			main = function (name, deps, callback, relName) {
					var cjsModule, depName, ret, map, i, relParts,
							args = [],
							callbackType = typeof callback,
							usingExports;
	
					//Use name if no relName
					relName = relName || name;
					relParts = makeRelParts(relName);
	
					//Call the callback to define the module, if necessary.
					if (callbackType === 'undefined' || callbackType === 'function') {
							//Pull out the defined dependencies and pass the ordered
							//values to the callback.
							//Default to [require, exports, module] if no deps
							deps = !deps.length && callback.length ? ['require', 'exports', 'module'] : deps;
							for (i = 0; i < deps.length; i += 1) {
									map = makeMap(deps[i], relParts);
									depName = map.f;
	
									//Fast path CommonJS standard dependencies.
									if (depName === "require") {
											args[i] = handlers.require(name);
									} else if (depName === "exports") {
											//CommonJS module spec 1.1
											args[i] = handlers.exports(name);
											usingExports = true;
									} else if (depName === "module") {
											//CommonJS module spec 1.1
											cjsModule = args[i] = handlers.module(name);
									} else if (hasProp(defined, depName) ||
														 hasProp(waiting, depName) ||
														 hasProp(defining, depName)) {
											args[i] = callDep(depName);
									} else if (map.p) {
											map.p.load(map.n, makeRequire(relName, true), makeLoad(depName), {});
											args[i] = defined[depName];
									} else {
											throw new Error(name + ' missing ' + depName);
									}
							}
	
							ret = callback ? callback.apply(defined[name], args) : undefined;
	
							if (name) {
									//If setting exports via "module" is in play,
									//favor that over return value and exports. After that,
									//favor a non-undefined return value over exports use.
									if (cjsModule && cjsModule.exports !== undef &&
													cjsModule.exports !== defined[name]) {
											defined[name] = cjsModule.exports;
									} else if (ret !== undef || !usingExports) {
											//Use the return value from the function.
											defined[name] = ret;
									}
							}
					} else if (name) {
							//May just be an object definition for the module. Only
							//worry about defining if have a module name.
							defined[name] = callback;
					}
			};
	
			requirejs = require = req = function (deps, callback, relName, forceSync, alt) {
					if (typeof deps === "string") {
							if (handlers[deps]) {
									//callback in this case is really relName
									return handlers[deps](callback);
							}
							//Just return the module wanted. In this scenario, the
							//deps arg is the module name, and second arg (if passed)
							//is just the relName.
							//Normalize module name, if it contains . or ..
							return callDep(makeMap(deps, makeRelParts(callback)).f);
					} else if (!deps.splice) {
							//deps is a config object, not an array.
							config = deps;
							if (config.deps) {
									req(config.deps, config.callback);
							}
							if (!callback) {
									return;
							}
	
							if (callback.splice) {
									//callback is an array, which means it is a dependency list.
									//Adjust args if there are dependencies
									deps = callback;
									callback = relName;
									relName = null;
							} else {
									deps = undef;
							}
					}
	
					//Support require(['a'])
					callback = callback || function () {};
	
					//If relName is a function, it is an errback handler,
					//so remove it.
					if (typeof relName === 'function') {
							relName = forceSync;
							forceSync = alt;
					}
	
					//Simulate async callback;
					if (forceSync) {
							main(undef, deps, callback, relName);
					} else {
							//Using a non-zero value because of concern for what old browsers
							//do, and latest browsers "upgrade" to 4 if lower value is used:
							//http://www.whatwg.org/specs/web-apps/current-work/multipage/timers.html#dom-windowtimers-settimeout:
							//If want a value immediately, use require('id') instead -- something
							//that works in almond on the global level, but not guaranteed and
							//unlikely to work in other AMD implementations.
							setTimeout(function () {
									main(undef, deps, callback, relName);
							}, 4);
					}
	
					return req;
			};
	
			/**
			 * Just drops the config on the floor, but returns req in case
			 * the config return value is used.
			 */
			req.config = function (cfg) {
					return req(cfg);
			};
	
			/**
			 * Expose module registry for debugging and tooling
			 */
			requirejs._defined = defined;
	
			define = function (name, deps, callback) {
					if (typeof name !== 'string') {
							throw new Error('See almond README: incorrect module build, no module name');
					}
	
					//This module may not have dependencies
					if (!deps.splice) {
							//deps is not an array, so probably means
							//an object literal or factory function for
							//the value. Adjust args.
							callback = deps;
							deps = [];
					}
	
					if (!hasProp(defined, name) && !hasProp(waiting, name)) {
							waiting[name] = [name, deps, callback];
					}
			};
	
			define.amd = {
					jQuery: true
			};
	}());
	
	S2.requirejs = requirejs;S2.require = require;S2.define = define;
	}
	}());
	S2.define("almond", function(){});
	
	/* global jQuery:false, $:false */
	S2.define('jquery',[],function () {
		var _$ = jQuery || $;
	
		if (_$ == null && console && console.error) {
			console.error(
				'Select2: An instance of jQuery or a jQuery-compatible library was not ' +
				'found. Make sure that you are including jQuery before Select2 on your ' +
				'web page.'
			);
		}
	
		return _$;
	});
	
	S2.define('select2/utils',[
		'jquery'
	], function ($) {
		var Utils = {};
	
		Utils.Extend = function (ChildClass, SuperClass) {
			var __hasProp = {}.hasOwnProperty;
	
			function BaseConstructor () {
				this.constructor = ChildClass;
			}
	
			for (var key in SuperClass) {
				if (__hasProp.call(SuperClass, key)) {
					ChildClass[key] = SuperClass[key];
				}
			}
	
			BaseConstructor.prototype = SuperClass.prototype;
			ChildClass.prototype = new BaseConstructor();
			ChildClass.__super__ = SuperClass.prototype;
	
			return ChildClass;
		};
	
		function getMethods (theClass) {
			var proto = theClass.prototype;
	
			var methods = [];
	
			for (var methodName in proto) {
				var m = proto[methodName];
	
				if (typeof m !== 'function') {
					continue;
				}
	
				if (methodName === 'constructor') {
					continue;
				}
	
				methods.push(methodName);
			}
	
			return methods;
		}
	
		Utils.Decorate = function (SuperClass, DecoratorClass) {
			var decoratedMethods = getMethods(DecoratorClass);
			var superMethods = getMethods(SuperClass);
	
			function DecoratedClass () {
				var unshift = Array.prototype.unshift;
	
				var argCount = DecoratorClass.prototype.constructor.length;
	
				var calledConstructor = SuperClass.prototype.constructor;
	
				if (argCount > 0) {
					unshift.call(arguments, SuperClass.prototype.constructor);
	
					calledConstructor = DecoratorClass.prototype.constructor;
				}
	
				calledConstructor.apply(this, arguments);
			}
	
			DecoratorClass.displayName = SuperClass.displayName;
	
			function ctr () {
				this.constructor = DecoratedClass;
			}
	
			DecoratedClass.prototype = new ctr();
	
			for (var m = 0; m < superMethods.length; m++) {
					var superMethod = superMethods[m];
	
					DecoratedClass.prototype[superMethod] =
						SuperClass.prototype[superMethod];
			}
	
			var calledMethod = function (methodName) {
				// Stub out the original method if it's not decorating an actual method
				var originalMethod = function () {};
	
				if (methodName in DecoratedClass.prototype) {
					originalMethod = DecoratedClass.prototype[methodName];
				}
	
				var decoratedMethod = DecoratorClass.prototype[methodName];
	
				return function () {
					var unshift = Array.prototype.unshift;
	
					unshift.call(arguments, originalMethod);
	
					return decoratedMethod.apply(this, arguments);
				};
			};
	
			for (var d = 0; d < decoratedMethods.length; d++) {
				var decoratedMethod = decoratedMethods[d];
	
				DecoratedClass.prototype[decoratedMethod] = calledMethod(decoratedMethod);
			}
	
			return DecoratedClass;
		};
	
		var Observable = function () {
			this.listeners = {};
		};
	
		Observable.prototype.on = function (event, callback) {
			this.listeners = this.listeners || {};
	
			if (event in this.listeners) {
				this.listeners[event].push(callback);
			} else {
				this.listeners[event] = [callback];
			}
		};
	
		Observable.prototype.trigger = function (event) {
			var slice = Array.prototype.slice;
			var params = slice.call(arguments, 1);
	
			this.listeners = this.listeners || {};
	
			// Params should always come in as an array
			if (params == null) {
				params = [];
			}
	
			// If there are no arguments to the event, use a temporary object
			if (params.length === 0) {
				params.push({});
			}
	
			// Set the `_type` of the first object to the event
			params[0]._type = event;
	
			if (event in this.listeners) {
				this.invoke(this.listeners[event], slice.call(arguments, 1));
			}
	
			if ('*' in this.listeners) {
				this.invoke(this.listeners['*'], arguments);
			}
		};
	
		Observable.prototype.invoke = function (listeners, params) {
			for (var i = 0, len = listeners.length; i < len; i++) {
				listeners[i].apply(this, params);
			}
		};
	
		Utils.Observable = Observable;
	
		Utils.generateChars = function (length) {
			var chars = '';
	
			for (var i = 0; i < length; i++) {
				var randomChar = Math.floor(Math.random() * 36);
				chars += randomChar.toString(36);
			}
	
			return chars;
		};
	
		Utils.bind = function (func, context) {
			return function () {
				func.apply(context, arguments);
			};
		};
	
		Utils._convertData = function (data) {
			for (var originalKey in data) {
				var keys = originalKey.split('-');
	
				var dataLevel = data;
	
				if (keys.length === 1) {
					continue;
				}
	
				for (var k = 0; k < keys.length; k++) {
					var key = keys[k];
	
					// Lowercase the first letter
					// By default, dash-separated becomes camelCase
					key = key.substring(0, 1).toLowerCase() + key.substring(1);
	
					if (!(key in dataLevel)) {
						dataLevel[key] = {};
					}
	
					if (k == keys.length - 1) {
						dataLevel[key] = data[originalKey];
					}
	
					dataLevel = dataLevel[key];
				}
	
				delete data[originalKey];
			}
	
			return data;
		};
	
		Utils.hasScroll = function (index, el) {
			// Adapted from the function created by @ShadowScripter
			// and adapted by @BillBarry on the Stack Exchange Code Review website.
			// The original code can be found at
			// http://codereview.stackexchange.com/q/13338
			// and was designed to be used with the Sizzle selector engine.
	
			var $el = $(el);
			var overflowX = el.style.overflowX;
			var overflowY = el.style.overflowY;
	
			//Check both x and y declarations
			if (overflowX === overflowY &&
					(overflowY === 'hidden' || overflowY === 'visible')) {
				return false;
			}
	
			if (overflowX === 'scroll' || overflowY === 'scroll') {
				return true;
			}
	
			return ($el.innerHeight() < el.scrollHeight ||
				$el.innerWidth() < el.scrollWidth);
		};
	
		Utils.escapeMarkup = function (markup) {
			var replaceMap = {
				'\\': '&#92;',
				'&': '&amp;',
				'<': '&lt;',
				'>': '&gt;',
				'"': '&quot;',
				'\'': '&#39;',
				'/': '&#47;'
			};
	
			// Do not try to escape the markup if it's not a string
			if (typeof markup !== 'string') {
				return markup;
			}
	
			return String(markup).replace(/[&<>"'\/\\]/g, function (match) {
				return replaceMap[match];
			});
		};
	
		Utils.entityDecode = function(html) {
			var txt = document.createElement("textarea");
			txt.innerHTML = html;
			return txt.value;
		}
	
		// Append an array of jQuery nodes to a given element.
		Utils.appendMany = function ($element, $nodes) {
			// jQuery 1.7.x does not support $.fn.append() with an array
			// Fall back to a jQuery object collection using $.fn.add()
			if ($.fn.jquery.substr(0, 3) === '1.7') {
				var $jqNodes = $();
	
				$.map($nodes, function (node) {
					$jqNodes = $jqNodes.add(node);
				});
	
				$nodes = $jqNodes;
			}
	
			$element.append($nodes);
		};
	
		// Determine whether the browser is on a touchscreen device.
		Utils.isTouchscreen = function() {
			if ('undefined' === typeof Utils._isTouchscreenCache) {
				Utils._isTouchscreenCache = 'ontouchstart' in document.documentElement;
			}
			return Utils._isTouchscreenCache;
		}
	
		return Utils;
	});
	
	S2.define('select2/results',[
		'jquery',
		'./utils'
	], function ($, Utils) {
		function Results ($element, options, dataAdapter) {
			this.$element = $element;
			this.data = dataAdapter;
			this.options = options;
	
			Results.__super__.constructor.call(this);
		}
	
		Utils.Extend(Results, Utils.Observable);
	
		Results.prototype.render = function () {
			var $results = $(
				'<ul class="select2-results__options" role="listbox" tabindex="-1"></ul>'
			);
	
			if (this.options.get('multiple')) {
				$results.attr('aria-multiselectable', 'true');
			}
	
			this.$results = $results;
	
			return $results;
		};
	
		Results.prototype.clear = function () {
			this.$results.empty();
		};
	
		Results.prototype.displayMessage = function (params) {
			var escapeMarkup = this.options.get('escapeMarkup');
	
			this.clear();
			this.hideLoading();
	
			var $message = $(
				'<li role="alert" aria-live="assertive"' +
				' class="select2-results__option"></li>'
			);
	
			var message = this.options.get('translations').get(params.message);
	
			$message.append(
				escapeMarkup(
					message(params.args)
				)
			);
	
			$message[0].className += ' select2-results__message';
	
			this.$results.append($message);
		};
	
		Results.prototype.hideMessages = function () {
			this.$results.find('.select2-results__message').remove();
		};
	
		Results.prototype.append = function (data) {
			this.hideLoading();
	
			var $options = [];
	
			if (data.results == null || data.results.length === 0) {
				if (this.$results.children().length === 0) {
					this.trigger('results:message', {
						message: 'noResults'
					});
				}
	
				return;
			}
	
			data.results = this.sort(data.results);
	
			for (var d = 0; d < data.results.length; d++) {
				var item = data.results[d];
	
				var $option = this.option(item);
	
				$options.push($option);
			}
	
			this.$results.append($options);
		};
	
		Results.prototype.position = function ($results, $dropdown) {
			var $resultsContainer = $dropdown.find('.select2-results');
			$resultsContainer.append($results);
		};
	
		Results.prototype.sort = function (data) {
			var sorter = this.options.get('sorter');
	
			return sorter(data);
		};
	
		Results.prototype.highlightFirstItem = function () {
			var $options = this.$results
				.find('.select2-results__option[data-selected]');
	
			var $selected = $options.filter('[data-selected=true]');
	
			// Check if there are any selected options
			if ($selected.length > 0) {
				// If there are selected options, highlight the first
				$selected.first().trigger('mouseenter');
			} else {
				// If there are no selected options, highlight the first option
				// in the dropdown
				$options.first().trigger('mouseenter');
			}
	
			this.ensureHighlightVisible();
		};
	
		Results.prototype.setClasses = function () {
			var self = this;
	
			this.data.current(function (selected) {
				var selectedIds = $.map(selected, function (s) {
					return s.id.toString();
				});
	
				var $options = self.$results
					.find('.select2-results__option[data-selected]');
	
				$options.each(function () {
					var $option = $(this);
	
					var item = $.data(this, 'data');
	
					// id needs to be converted to a string when comparing
					var id = '' + item.id;
	
					if ((item.element != null && item.element.selected) ||
							(item.element == null && $.inArray(id, selectedIds) > -1)) {
						$option.attr('data-selected', 'true');
					} else {
						$option.attr('data-selected', 'false');
					}
				});
	
			});
		};
	
		Results.prototype.showLoading = function (params) {
			this.hideLoading();
	
			var loadingMore = this.options.get('translations').get('searching');
	
			var loading = {
				disabled: true,
				loading: true,
				text: loadingMore(params)
			};
			var $loading = this.option(loading);
			$loading.className += ' loading-results';
	
			this.$results.prepend($loading);
		};
	
		Results.prototype.hideLoading = function () {
			this.$results.find('.loading-results').remove();
		};
	
		Results.prototype.option = function (data) {
			var option = document.createElement('li');
			option.className = 'select2-results__option';
	
			var attrs = {
				'role': 'option',
				'data-selected': 'false',
				'tabindex': -1
			};
	
			if (data.disabled) {
				delete attrs['data-selected'];
				attrs['aria-disabled'] = 'true';
			}
	
			if (data.id == null) {
				delete attrs['data-selected'];
			}
	
			if (data._resultId != null) {
				option.id = data._resultId;
			}
	
			if (data.title) {
				option.title = data.title;
			}
	
			if (data.children) {
				attrs['aria-label'] = data.text;
				delete attrs['data-selected'];
			}
	
			for (var attr in attrs) {
				var val = attrs[attr];
	
				option.setAttribute(attr, val);
			}
	
			if (data.children) {
				var $option = $(option);
	
				var label = document.createElement('strong');
				label.className = 'select2-results__group';
	
				var $label = $(label);
				this.template(data, label);
				$label.attr('role', 'presentation');
	
				var $children = [];
	
				for (var c = 0; c < data.children.length; c++) {
					var child = data.children[c];
	
					var $child = this.option(child);
	
					$children.push($child);
				}
	
				var $childrenContainer = $('<ul></ul>', {
					'class': 'select2-results__options select2-results__options--nested',
					'role': 'listbox'
				});
				$childrenContainer.append($children);
				$option.attr('role', 'list');
	
				$option.append(label);
				$option.append($childrenContainer);
			} else {
				this.template(data, option);
			}
	
			$.data(option, 'data', data);
	
			return option;
		};
	
		Results.prototype.bind = function (container, $container) {
			var self = this;
	
			var id = container.id + '-results';
	
			this.$results.attr('id', id);
	
			container.on('results:all', function (params) {
				self.clear();
				self.append(params.data);
	
				if (container.isOpen()) {
					self.setClasses();
					self.highlightFirstItem();
				}
			});
	
			container.on('results:append', function (params) {
				self.append(params.data);
	
				if (container.isOpen()) {
					self.setClasses();
				}
			});
	
			container.on('query', function (params) {
				self.hideMessages();
				self.showLoading(params);
			});
	
			container.on('select', function () {
				if (!container.isOpen()) {
					return;
				}
	
				self.setClasses();
				self.highlightFirstItem();
			});
	
			container.on('unselect', function () {
				if (!container.isOpen()) {
					return;
				}
	
				self.setClasses();
				self.highlightFirstItem();
			});
	
			container.on('open', function () {
				// When the dropdown is open, aria-expended="true"
				self.$results.attr('aria-expanded', 'true');
				self.$results.attr('aria-hidden', 'false');
	
				self.setClasses();
				self.ensureHighlightVisible();
			});
	
			container.on('close', function () {
				// When the dropdown is closed, aria-expended="false"
				self.$results.attr('aria-expanded', 'false');
				self.$results.attr('aria-hidden', 'true');
				self.$results.removeAttr('aria-activedescendant');
			});
	
			container.on('results:toggle', function () {
				var $highlighted = self.getHighlightedResults();
	
				if ($highlighted.length === 0) {
					return;
				}
	
				$highlighted.trigger('mouseup');
			});
	
			container.on('results:select', function () {
				var $highlighted = self.getHighlightedResults();
	
				if ($highlighted.length === 0) {
					return;
				}
	
				var data = $highlighted.data('data');
	
				if ($highlighted.attr('data-selected') == 'true') {
					self.trigger('close', {});
				} else {
					self.trigger('select', {
						data: data
					});
				}
			});
	
			container.on('results:previous', function () {
				var $highlighted = self.getHighlightedResults();
	
				var $options = self.$results.find('[data-selected]');
	
				var currentIndex = $options.index($highlighted);
	
				// If we are already at te top, don't move further
				if (currentIndex === 0) {
					return;
				}
	
				var nextIndex = currentIndex - 1;
	
				// If none are highlighted, highlight the first
				if ($highlighted.length === 0) {
					nextIndex = 0;
				}
	
				var $next = $options.eq(nextIndex);
	
				$next.trigger('mouseenter');
	
				var currentOffset = self.$results.offset().top;
				var nextTop = $next.offset().top;
				var nextOffset = self.$results.scrollTop() + (nextTop - currentOffset);
	
				if (nextIndex === 0) {
					self.$results.scrollTop(0);
				} else if (nextTop - currentOffset < 0) {
					self.$results.scrollTop(nextOffset);
				}
			});
	
			container.on('results:next', function () {
				var $highlighted = self.getHighlightedResults();
	
				var $options = self.$results.find('[data-selected]');
	
				var currentIndex = $options.index($highlighted);
	
				var nextIndex = currentIndex + 1;
	
				// If we are at the last option, stay there
				if (nextIndex >= $options.length) {
					return;
				}
	
				var $next = $options.eq(nextIndex);
	
				$next.trigger('mouseenter');
	
				var currentOffset = self.$results.offset().top +
					self.$results.outerHeight(false);
				var nextBottom = $next.offset().top + $next.outerHeight(false);
				var nextOffset = self.$results.scrollTop() + nextBottom - currentOffset;
	
				if (nextIndex === 0) {
					self.$results.scrollTop(0);
				} else if (nextBottom > currentOffset) {
					self.$results.scrollTop(nextOffset);
				}
			});
	
			container.on('results:focus', function (params) {
				params.element.addClass('select2-results__option--highlighted').attr('aria-selected', 'true');
				self.$results.attr('aria-activedescendant', params.element.attr('id'));
			});
	
			container.on('results:message', function (params) {
				self.displayMessage(params);
			});
	
			if ($.fn.mousewheel) {
				this.$results.on('mousewheel', function (e) {
					var top = self.$results.scrollTop();
	
					var bottom = self.$results.get(0).scrollHeight - top + e.deltaY;
	
					var isAtTop = e.deltaY > 0 && top - e.deltaY <= 0;
					var isAtBottom = e.deltaY < 0 && bottom <= self.$results.height();
	
					if (isAtTop) {
						self.$results.scrollTop(0);
	
						e.preventDefault();
						e.stopPropagation();
					} else if (isAtBottom) {
						self.$results.scrollTop(
							self.$results.get(0).scrollHeight - self.$results.height()
						);
	
						e.preventDefault();
						e.stopPropagation();
					}
				});
			}
	
			this.$results.on('mouseup', '.select2-results__option[data-selected]',
				function (evt) {
				var $this = $(this);
	
				var data = $this.data('data');
	
				if ($this.attr('data-selected') === 'true') {
					if (self.options.get('multiple')) {
						self.trigger('unselect', {
							originalEvent: evt,
							data: data
						});
					} else {
						self.trigger('close', {});
					}
	
					return;
				}
	
				self.trigger('select', {
					originalEvent: evt,
					data: data
				});
			});
	
			this.$results.on('mouseenter', '.select2-results__option[data-selected]',
				function (evt) {
				var data = $(this).data('data');
	
				self.getHighlightedResults()
						.removeClass('select2-results__option--highlighted')
						.attr('aria-selected', 'false');
	
				self.trigger('results:focus', {
					data: data,
					element: $(this)
				});
			});
		};
	
		Results.prototype.getHighlightedResults = function () {
			var $highlighted = this.$results
			.find('.select2-results__option--highlighted');
	
			return $highlighted;
		};
	
		Results.prototype.destroy = function () {
			this.$results.remove();
		};
	
		Results.prototype.ensureHighlightVisible = function () {
			var $highlighted = this.getHighlightedResults();
	
			if ($highlighted.length === 0) {
				return;
			}
	
			var $options = this.$results.find('[data-selected]');
	
			var currentIndex = $options.index($highlighted);
	
			var currentOffset = this.$results.offset().top;
			var nextTop = $highlighted.offset().top;
			var nextOffset = this.$results.scrollTop() + (nextTop - currentOffset);
	
			var offsetDelta = nextTop - currentOffset;
			nextOffset -= $highlighted.outerHeight(false) * 2;
	
			if (currentIndex <= 2) {
				this.$results.scrollTop(0);
			} else if (offsetDelta > this.$results.outerHeight() || offsetDelta < 0) {
				this.$results.scrollTop(nextOffset);
			}
		};
	
		Results.prototype.template = function (result, container) {
			var template = this.options.get('templateResult');
			var escapeMarkup = this.options.get('escapeMarkup');
	
			var content = template(result, container);
	
			if (content == null) {
				container.style.display = 'none';
			} else if (typeof content === 'string') {
				container.innerHTML = escapeMarkup(content);
			} else {
				$(container).append(content);
			}
		};
	
		return Results;
	});
	
	S2.define('select2/keys',[
	
	], function () {
		var KEYS = {
			BACKSPACE: 8,
			TAB: 9,
			ENTER: 13,
			SHIFT: 16,
			CTRL: 17,
			ALT: 18,
			ESC: 27,
			SPACE: 32,
			PAGE_UP: 33,
			PAGE_DOWN: 34,
			END: 35,
			HOME: 36,
			LEFT: 37,
			UP: 38,
			RIGHT: 39,
			DOWN: 40,
			DELETE: 46
		};
	
		return KEYS;
	});
	
	S2.define('select2/selection/base',[
		'jquery',
		'../utils',
		'../keys'
	], function ($, Utils, KEYS) {
		function BaseSelection ($element, options) {
			this.$element = $element;
			this.options = options;
	
			BaseSelection.__super__.constructor.call(this);
		}
	
		Utils.Extend(BaseSelection, Utils.Observable);
	
		BaseSelection.prototype.render = function () {
			var $selection = $(
				'<span class="select2-selection" ' +
				' aria-haspopup="true" aria-expanded="false">' +
				'</span>'
			);
	
			this._tabindex = 0;
	
			if (this.$element.data('old-tabindex') != null) {
				this._tabindex = this.$element.data('old-tabindex');
			} else if (this.$element.attr('tabindex') != null) {
				this._tabindex = this.$element.attr('tabindex');
			}
	
			$selection.attr('title', this.$element.attr('title'));
			$selection.attr('tabindex', this._tabindex);
	
			this.$selection = $selection;
	
			return $selection;
		};
	
		BaseSelection.prototype.bind = function (container, $container) {
			var self = this;
	
			var id = container.id + '-container';
			var resultsId = container.id + '-results';
			var searchHidden = this.options.get('minimumResultsForSearch') === Infinity;
	
			this.container = container;
	
			this.$selection.on('focus', function (evt) {
				self.trigger('focus', evt);
			});
	
			this.$selection.on('blur', function (evt) {
				self._handleBlur(evt);
			});
	
			this.$selection.on('keydown', function (evt) {
				self.trigger('keypress', evt);
	
				if (evt.which === KEYS.SPACE) {
					evt.preventDefault();
				}
			});
	
			container.on('results:focus', function (params) {
				self.$selection.attr('aria-activedescendant', params.data._resultId);
			});
	
			container.on('selection:update', function (params) {
				self.update(params.data);
			});
	
			container.on('open', function () {
				// When the dropdown is open, aria-expanded="true"
				self.$selection.attr('aria-expanded', 'true');
				self.$selection.attr('aria-owns', resultsId);
	
				self._attachCloseHandler(container);
			});
	
			container.on('close', function () {
				// When the dropdown is closed, aria-expanded="false"
				self.$selection.attr('aria-expanded', 'false');
				self.$selection.removeAttr('aria-activedescendant');
				self.$selection.removeAttr('aria-owns');
	
				// This needs to be delayed as the active element is the body when the
				// key is pressed.
				window.setTimeout(function () {
					self.$selection.focus();
				}, 1);
	
				self._detachCloseHandler(container);
			});
	
			container.on('enable', function () {
				self.$selection.attr('tabindex', self._tabindex);
			});
	
			container.on('disable', function () {
				self.$selection.attr('tabindex', '-1');
			});
		};
	
		BaseSelection.prototype._handleBlur = function (evt) {
			var self = this;
	
			// This needs to be delayed as the active element is the body when the tab
			// key is pressed, possibly along with others.
			window.setTimeout(function () {
				// Don't trigger `blur` if the focus is still in the selection
				if (
					(document.activeElement == self.$selection[0]) ||
					($.contains(self.$selection[0], document.activeElement))
				) {
					return;
				}
	
				self.trigger('blur', evt);
			}, 1);
		};
	
		BaseSelection.prototype._attachCloseHandler = function (container) {
			var self = this;
	
			$(document.body).on('mousedown.select2.' + container.id, function (e) {
				var $target = $(e.target);
	
				var $select = $target.closest('.select2');
	
				var $all = $('.select2.select2-container--open');
	
				$all.each(function () {
					var $this = $(this);
	
					if (this == $select[0]) {
						return;
					}
	
					var $element = $this.data('element');
					$element.select2('close');
	
					// Remove any focus when dropdown is closed by clicking outside the select area.
					// Timeout of 1 required for close to finish wrapping up.
					setTimeout(function(){
					 $this.find('*:focus').blur();
					 $target.focus();
					}, 1);
				});
			});
		};
	
		BaseSelection.prototype._detachCloseHandler = function (container) {
			$(document.body).off('mousedown.select2.' + container.id);
		};
	
		BaseSelection.prototype.position = function ($selection, $container) {
			var $selectionContainer = $container.find('.selection');
			$selectionContainer.append($selection);
		};
	
		BaseSelection.prototype.destroy = function () {
			this._detachCloseHandler(this.container);
		};
	
		BaseSelection.prototype.update = function (data) {
			throw new Error('The `update` method must be defined in child classes.');
		};
	
		return BaseSelection;
	});
	
	S2.define('select2/selection/single',[
		'jquery',
		'./base',
		'../utils',
		'../keys'
	], function ($, BaseSelection, Utils, KEYS) {
		function SingleSelection () {
			SingleSelection.__super__.constructor.apply(this, arguments);
		}
	
		Utils.Extend(SingleSelection, BaseSelection);
	
		SingleSelection.prototype.render = function () {
			var $selection = SingleSelection.__super__.render.call(this);
	
			$selection.addClass('select2-selection--single');
	
			$selection.html(
				'<span class="select2-selection__rendered"></span>' +
				'<span class="select2-selection__arrow" role="presentation">' +
					'<b role="presentation"></b>' +
				'</span>'
			);
	
			return $selection;
		};
	
		SingleSelection.prototype.bind = function (container, $container) {
			var self = this;
	
			SingleSelection.__super__.bind.apply(this, arguments);
	
			var id = container.id + '-container';
	
			this.$selection.find('.select2-selection__rendered')
				.attr('id', id)
				.attr('role', 'textbox')
				.attr('aria-readonly', 'true');
			this.$selection.attr('aria-labelledby', id);
	
			// This makes single non-search selects work in screen readers. If it causes problems elsewhere, remove.
			this.$selection.attr('role', 'combobox');
	
			this.$selection.on('mousedown', function (evt) {
				// Only respond to left clicks
				if (evt.which !== 1) {
					return;
				}
	
				self.trigger('toggle', {
					originalEvent: evt
				});
			});
	
			this.$selection.on('focus', function (evt) {
				// User focuses on the container
			});
	
			this.$selection.on('keydown', function (evt) {
				// If user starts typing an alphanumeric key on the keyboard, open if not opened.
				if (!container.isOpen() && evt.which >= 48 && evt.which <= 90) {
					container.open();
				}
			});
	
			this.$selection.on('blur', function (evt) {
				// User exits the container
			});
	
			container.on('focus', function (evt) {
				if (!container.isOpen()) {
					self.$selection.focus();
				}
			});
	
			container.on('selection:update', function (params) {
				self.update(params.data);
			});
		};
	
		SingleSelection.prototype.clear = function () {
			this.$selection.find('.select2-selection__rendered').empty();
		};
	
		SingleSelection.prototype.display = function (data, container) {
			var template = this.options.get('templateSelection');
			var escapeMarkup = this.options.get('escapeMarkup');
	
			return escapeMarkup(template(data, container));
		};
	
		SingleSelection.prototype.selectionContainer = function () {
			return $('<span></span>');
		};
	
		SingleSelection.prototype.update = function (data) {
			if (data.length === 0) {
				this.clear();
				return;
			}
	
			var selection = data[0];
	
			var $rendered = this.$selection.find('.select2-selection__rendered');
			var formatted = Utils.entityDecode(this.display(selection, $rendered));
	
			$rendered.empty().text(formatted);
			$rendered.prop('title', selection.title || selection.text);
		};
	
		return SingleSelection;
	});
	
	S2.define('select2/selection/multiple',[
		'jquery',
		'./base',
		'../utils'
	], function ($, BaseSelection, Utils) {
		function MultipleSelection ($element, options) {
			MultipleSelection.__super__.constructor.apply(this, arguments);
		}
	
		Utils.Extend(MultipleSelection, BaseSelection);
	
		MultipleSelection.prototype.render = function () {
			var $selection = MultipleSelection.__super__.render.call(this);
	
			$selection.addClass('select2-selection--multiple');
	
			$selection.html(
				'<ul class="select2-selection__rendered" aria-live="polite" aria-relevant="additions removals" aria-atomic="true"></ul>'
			);
	
			return $selection;
		};
	
		MultipleSelection.prototype.bind = function (container, $container) {
			var self = this;
	
			MultipleSelection.__super__.bind.apply(this, arguments);
	
			this.$selection.on('click', function (evt) {
				self.trigger('toggle', {
					originalEvent: evt
				});
			});
	
			this.$selection.on(
				'click',
				'.select2-selection__choice__remove',
				function (evt) {
					// Ignore the event if it is disabled
					if (self.options.get('disabled')) {
						return;
					}
	
					var $remove = $(this);
					var $selection = $remove.parent();
	
					var data = $selection.data('data');
	
					self.trigger('unselect', {
						originalEvent: evt,
						data: data
					});
				}
			);
	
			this.$selection.on('keydown', function (evt) {
				// If user starts typing an alphanumeric key on the keyboard, open if not opened.
				if (!container.isOpen() && evt.which >= 48 && evt.which <= 90) {
					container.open();
				}
			});
	
			// Focus on the search field when the container is focused instead of the main container.
			container.on( 'focus', function(){
				self.focusOnSearch();
			});
		};
	
		MultipleSelection.prototype.clear = function () {
			this.$selection.find('.select2-selection__rendered').empty();
		};
	
		MultipleSelection.prototype.display = function (data, container) {
			var template = this.options.get('templateSelection');
			var escapeMarkup = this.options.get('escapeMarkup');
	
			return escapeMarkup(template(data, container));
		};
	
		MultipleSelection.prototype.selectionContainer = function () {
			var $container = $(
				'<li class="select2-selection__choice">' +
					'<span class="select2-selection__choice__remove" role="presentation" aria-hidden="true">' +
						'&times;' +
					'</span>' +
				'</li>'
			);
	
			return $container;
		};
	
		/**
		 * Focus on the search field instead of the main multiselect container.
		 */
		MultipleSelection.prototype.focusOnSearch = function() {
			var self = this;
	
			if ('undefined' !== typeof self.$search) {
				// Needs 1 ms delay because of other 1 ms setTimeouts when rendering.
				setTimeout(function(){
					// Prevent the dropdown opening again when focused from this.
					// This gets reset automatically when focus is triggered.
					self._keyUpPrevented = true;
	
					self.$search.focus();
				}, 1);
			}
		}
	
		MultipleSelection.prototype.update = function (data) {
			this.clear();
	
			if (data.length === 0) {
				return;
			}
	
			var $selections = [];
	
			for (var d = 0; d < data.length; d++) {
				var selection = data[d];
	
				var $selection = this.selectionContainer();
				var removeItemTag = $selection.html();
				var formatted = this.display(selection, $selection);
				if ('string' === typeof formatted) {
					formatted = Utils.entityDecode(formatted.trim());
				}
	
				$selection.text(formatted);
				$selection.prepend(removeItemTag);
				$selection.prop('title', selection.title || selection.text);
	
				$selection.data('data', selection);
	
				$selections.push($selection);
			}
	
			var $rendered = this.$selection.find('.select2-selection__rendered');
	
			Utils.appendMany($rendered, $selections);
		};
	
		return MultipleSelection;
	});
	
	S2.define('select2/selection/placeholder',[
		'../utils'
	], function (Utils) {
		function Placeholder (decorated, $element, options) {
			this.placeholder = this.normalizePlaceholder(options.get('placeholder'));
	
			decorated.call(this, $element, options);
		}
	
		Placeholder.prototype.normalizePlaceholder = function (_, placeholder) {
			if (typeof placeholder === 'string') {
				placeholder = {
					id: '',
					text: placeholder
				};
			}
	
			return placeholder;
		};
	
		Placeholder.prototype.createPlaceholder = function (decorated, placeholder) {
			var $placeholder = this.selectionContainer();
	
			$placeholder.text(Utils.entityDecode(this.display(placeholder)));
			$placeholder.addClass('select2-selection__placeholder')
									.removeClass('select2-selection__choice');
	
			return $placeholder;
		};
	
		Placeholder.prototype.update = function (decorated, data) {
			var singlePlaceholder = (
				data.length == 1 && data[0].id != this.placeholder.id
			);
			var multipleSelections = data.length > 1;
	
			if (multipleSelections || singlePlaceholder) {
				return decorated.call(this, data);
			}
	
			this.clear();
	
			var $placeholder = this.createPlaceholder(this.placeholder);
	
			this.$selection.find('.select2-selection__rendered').append($placeholder);
		};
	
		return Placeholder;
	});
	
	S2.define('select2/selection/allowClear',[
		'jquery',
		'../keys'
	], function ($, KEYS) {
		function AllowClear () { }
	
		AllowClear.prototype.bind = function (decorated, container, $container) {
			var self = this;
	
			decorated.call(this, container, $container);
	
			if (this.placeholder == null) {
				if (this.options.get('debug') && window.console && console.error) {
					console.error(
						'Select2: The `allowClear` option should be used in combination ' +
						'with the `placeholder` option.'
					);
				}
			}
	
			this.$selection.on('mousedown', '.select2-selection__clear',
				function (evt) {
					self._handleClear(evt);
			});
	
			container.on('keypress', function (evt) {
				self._handleKeyboardClear(evt, container);
			});
		};
	
		AllowClear.prototype._handleClear = function (_, evt) {
			// Ignore the event if it is disabled
			if (this.options.get('disabled')) {
				return;
			}
	
			var $clear = this.$selection.find('.select2-selection__clear');
	
			// Ignore the event if nothing has been selected
			if ($clear.length === 0) {
				return;
			}
	
			evt.stopPropagation();
	
			var data = $clear.data('data');
	
			for (var d = 0; d < data.length; d++) {
				var unselectData = {
					data: data[d]
				};
	
				// Trigger the `unselect` event, so people can prevent it from being
				// cleared.
				this.trigger('unselect', unselectData);
	
				// If the event was prevented, don't clear it out.
				if (unselectData.prevented) {
					return;
				}
			}
	
			this.$element.val(this.placeholder.id).trigger('change');
	
			this.trigger('toggle', {});
		};
	
		AllowClear.prototype._handleKeyboardClear = function (_, evt, container) {
			if (container.isOpen()) {
				return;
			}
	
			if (evt.which == KEYS.DELETE || evt.which == KEYS.BACKSPACE) {
				this._handleClear(evt);
			}
		};
	
		AllowClear.prototype.update = function (decorated, data) {
			decorated.call(this, data);
	
			if (this.$selection.find('.select2-selection__placeholder').length > 0 ||
					data.length === 0) {
				return;
			}
	
			var $remove = $(
				'<span class="select2-selection__clear">' +
					'&times;' +
				'</span>'
			);
			$remove.data('data', data);
	
			this.$selection.find('.select2-selection__rendered').prepend($remove);
		};
	
		return AllowClear;
	});
	
	S2.define('select2/selection/search',[
		'jquery',
		'../utils',
		'../keys'
	], function ($, Utils, KEYS) {
		function Search (decorated, $element, options) {
			decorated.call(this, $element, options);
		}
	
		Search.prototype.render = function (decorated) {
			var $search = $(
				'<li class="select2-search select2-search--inline">' +
					'<input class="select2-search__field" type="text" tabindex="-1"' +
					' autocomplete="off" autocorrect="off" autocapitalize="none"' +
					' spellcheck="false" role="textbox" aria-autocomplete="list" />' +
				'</li>'
			);
	
			this.$searchContainer = $search;
			this.$search = $search.find('input');
	
			var $rendered = decorated.call(this);
	
			this._transferTabIndex();
	
			return $rendered;
		};
	
		Search.prototype.bind = function (decorated, container, $container) {
			var self = this;
			var resultsId = container.id + '-results';
	
			decorated.call(this, container, $container);
	
			container.on('open', function () {
				self.$search.attr('aria-owns', resultsId);
				self.$search.trigger('focus');
			});
	
			container.on('close', function () {
				self.$search.val('');
				self.$search.removeAttr('aria-activedescendant');
				self.$search.removeAttr('aria-owns');
				self.$search.trigger('focus');
			});
	
			container.on('enable', function () {
				self.$search.prop('disabled', false);
	
				self._transferTabIndex();
			});
	
			container.on('disable', function () {
				self.$search.prop('disabled', true);
			});
	
			container.on('focus', function (evt) {
				self.$search.trigger('focus');
			});
	
			container.on('results:focus', function (params) {
				self.$search.attr('aria-activedescendant', params.data._resultId);
			});
	
			this.$selection.on('focusin', '.select2-search--inline', function (evt) {
				self.trigger('focus', evt);
			});
	
			this.$selection.on('focusout', '.select2-search--inline', function (evt) {
				self._handleBlur(evt);
			});
	
			this.$selection.on('keydown', '.select2-search--inline', function (evt) {
				evt.stopPropagation();
	
				self.trigger('keypress', evt);
	
				self._keyUpPrevented = evt.isDefaultPrevented();
	
				var key = evt.which;
	
				if (key === KEYS.BACKSPACE && self.$search.val() === '') {
					var $previousChoice = self.$searchContainer
						.prev('.select2-selection__choice');
	
					if ($previousChoice.length > 0) {
						var item = $previousChoice.data('data');
	
						self.searchRemoveChoice(item);
	
						evt.preventDefault();
					}
				} else if (evt.which === KEYS.ENTER) {
					container.open();
					evt.preventDefault();
				}
			});
	
			// Try to detect the IE version should the `documentMode` property that
			// is stored on the document. This is only implemented in IE and is
			// slightly cleaner than doing a user agent check.
			// This property is not available in Edge, but Edge also doesn't have
			// this bug.
			var msie = document.documentMode;
			var disableInputEvents = msie && msie <= 11;
	
			// Workaround for browsers which do not support the `input` event
			// This will prevent double-triggering of events for browsers which support
			// both the `keyup` and `input` events.
			this.$selection.on(
				'input.searchcheck',
				'.select2-search--inline',
				function (evt) {
					// IE will trigger the `input` event when a placeholder is used on a
					// search box. To get around this issue, we are forced to ignore all
					// `input` events in IE and keep using `keyup`.
					if (disableInputEvents) {
						self.$selection.off('input.search input.searchcheck');
						return;
					}
	
					// Unbind the duplicated `keyup` event
					self.$selection.off('keyup.search');
				}
			);
	
			this.$selection.on(
				'keyup.search input.search',
				'.select2-search--inline',
				function (evt) {
					// IE will trigger the `input` event when a placeholder is used on a
					// search box. To get around this issue, we are forced to ignore all
					// `input` events in IE and keep using `keyup`.
					if (disableInputEvents && evt.type === 'input') {
						self.$selection.off('input.search input.searchcheck');
						return;
					}
	
					var key = evt.which;
	
					// We can freely ignore events from modifier keys
					if (key == KEYS.SHIFT || key == KEYS.CTRL || key == KEYS.ALT) {
						return;
					}
	
					// Tabbing will be handled during the `keydown` phase
					if (key == KEYS.TAB) {
						return;
					}
	
					self.handleSearch(evt);
				}
			);
		};
	
		/**
		 * This method will transfer the tabindex attribute from the rendered
		 * selection to the search box. This allows for the search box to be used as
		 * the primary focus instead of the selection container.
		 *
		 * @private
		 */
		Search.prototype._transferTabIndex = function (decorated) {
			this.$search.attr('tabindex', this.$selection.attr('tabindex'));
			this.$selection.attr('tabindex', '-1');
		};
	
		Search.prototype.createPlaceholder = function (decorated, placeholder) {
			this.$search.attr('placeholder', placeholder.text);
		};
	
		Search.prototype.update = function (decorated, data) {
			var searchHadFocus = this.$search[0] == document.activeElement;
	
			this.$search.attr('placeholder', '');
	
			decorated.call(this, data);
	
			this.$selection.find('.select2-selection__rendered')
										 .append(this.$searchContainer);
	
			this.resizeSearch();
			if (searchHadFocus) {
				this.$search.focus();
			}
		};
	
		Search.prototype.handleSearch = function () {
			this.resizeSearch();
	
			if (!this._keyUpPrevented) {
				var input = this.$search.val();
	
				this.trigger('query', {
					term: input
				});
			}
	
			this._keyUpPrevented = false;
		};
	
		Search.prototype.searchRemoveChoice = function (decorated, item) {
			this.trigger('unselect', {
				data: item
			});
	
			this.$search.val(item.text);
			this.handleSearch();
		};
	
		Search.prototype.resizeSearch = function () {
			this.$search.css('width', '25px');
	
			var width = '';
	
			if (this.$search.attr('placeholder') !== '') {
				width = this.$selection.find('.select2-selection__rendered').innerWidth();
			} else {
				var minimumWidth = this.$search.val().length + 1;
	
				width = (minimumWidth * 0.75) + 'em';
			}
	
			this.$search.css('width', width);
		};
	
		return Search;
	});
	
	S2.define('select2/selection/eventRelay',[
		'jquery'
	], function ($) {
		function EventRelay () { }
	
		EventRelay.prototype.bind = function (decorated, container, $container) {
			var self = this;
			var relayEvents = [
				'open', 'opening',
				'close', 'closing',
				'select', 'selecting',
				'unselect', 'unselecting'
			];
	
			var preventableEvents = ['opening', 'closing', 'selecting', 'unselecting'];
	
			decorated.call(this, container, $container);
	
			container.on('*', function (name, params) {
				// Ignore events that should not be relayed
				if ($.inArray(name, relayEvents) === -1) {
					return;
				}
	
				// The parameters should always be an object
				params = params || {};
	
				// Generate the jQuery event for the Select2 event
				var evt = $.Event('select2:' + name, {
					params: params
				});
	
				self.$element.trigger(evt);
	
				// Only handle preventable events if it was one
				if ($.inArray(name, preventableEvents) === -1) {
					return;
				}
	
				params.prevented = evt.isDefaultPrevented();
			});
		};
	
		return EventRelay;
	});
	
	S2.define('select2/translation',[
		'jquery',
		'require'
	], function ($, require) {
		function Translation (dict) {
			this.dict = dict || {};
		}
	
		Translation.prototype.all = function () {
			return this.dict;
		};
	
		Translation.prototype.get = function (key) {
			return this.dict[key];
		};
	
		Translation.prototype.extend = function (translation) {
			this.dict = $.extend({}, translation.all(), this.dict);
		};
	
		// Static functions
	
		Translation._cache = {};
	
		Translation.loadPath = function (path) {
			if (!(path in Translation._cache)) {
				var translations = require(path);
	
				Translation._cache[path] = translations;
			}
	
			return new Translation(Translation._cache[path]);
		};
	
		return Translation;
	});
	
	S2.define('select2/diacritics',[
	
	], function () {
		var diacritics = {
			'\u24B6': 'A',
			'\uFF21': 'A',
			'\u00C0': 'A',
			'\u00C1': 'A',
			'\u00C2': 'A',
			'\u1EA6': 'A',
			'\u1EA4': 'A',
			'\u1EAA': 'A',
			'\u1EA8': 'A',
			'\u00C3': 'A',
			'\u0100': 'A',
			'\u0102': 'A',
			'\u1EB0': 'A',
			'\u1EAE': 'A',
			'\u1EB4': 'A',
			'\u1EB2': 'A',
			'\u0226': 'A',
			'\u01E0': 'A',
			'\u00C4': 'A',
			'\u01DE': 'A',
			'\u1EA2': 'A',
			'\u00C5': 'A',
			'\u01FA': 'A',
			'\u01CD': 'A',
			'\u0200': 'A',
			'\u0202': 'A',
			'\u1EA0': 'A',
			'\u1EAC': 'A',
			'\u1EB6': 'A',
			'\u1E00': 'A',
			'\u0104': 'A',
			'\u023A': 'A',
			'\u2C6F': 'A',
			'\uA732': 'AA',
			'\u00C6': 'AE',
			'\u01FC': 'AE',
			'\u01E2': 'AE',
			'\uA734': 'AO',
			'\uA736': 'AU',
			'\uA738': 'AV',
			'\uA73A': 'AV',
			'\uA73C': 'AY',
			'\u24B7': 'B',
			'\uFF22': 'B',
			'\u1E02': 'B',
			'\u1E04': 'B',
			'\u1E06': 'B',
			'\u0243': 'B',
			'\u0182': 'B',
			'\u0181': 'B',
			'\u24B8': 'C',
			'\uFF23': 'C',
			'\u0106': 'C',
			'\u0108': 'C',
			'\u010A': 'C',
			'\u010C': 'C',
			'\u00C7': 'C',
			'\u1E08': 'C',
			'\u0187': 'C',
			'\u023B': 'C',
			'\uA73E': 'C',
			'\u24B9': 'D',
			'\uFF24': 'D',
			'\u1E0A': 'D',
			'\u010E': 'D',
			'\u1E0C': 'D',
			'\u1E10': 'D',
			'\u1E12': 'D',
			'\u1E0E': 'D',
			'\u0110': 'D',
			'\u018B': 'D',
			'\u018A': 'D',
			'\u0189': 'D',
			'\uA779': 'D',
			'\u01F1': 'DZ',
			'\u01C4': 'DZ',
			'\u01F2': 'Dz',
			'\u01C5': 'Dz',
			'\u24BA': 'E',
			'\uFF25': 'E',
			'\u00C8': 'E',
			'\u00C9': 'E',
			'\u00CA': 'E',
			'\u1EC0': 'E',
			'\u1EBE': 'E',
			'\u1EC4': 'E',
			'\u1EC2': 'E',
			'\u1EBC': 'E',
			'\u0112': 'E',
			'\u1E14': 'E',
			'\u1E16': 'E',
			'\u0114': 'E',
			'\u0116': 'E',
			'\u00CB': 'E',
			'\u1EBA': 'E',
			'\u011A': 'E',
			'\u0204': 'E',
			'\u0206': 'E',
			'\u1EB8': 'E',
			'\u1EC6': 'E',
			'\u0228': 'E',
			'\u1E1C': 'E',
			'\u0118': 'E',
			'\u1E18': 'E',
			'\u1E1A': 'E',
			'\u0190': 'E',
			'\u018E': 'E',
			'\u24BB': 'F',
			'\uFF26': 'F',
			'\u1E1E': 'F',
			'\u0191': 'F',
			'\uA77B': 'F',
			'\u24BC': 'G',
			'\uFF27': 'G',
			'\u01F4': 'G',
			'\u011C': 'G',
			'\u1E20': 'G',
			'\u011E': 'G',
			'\u0120': 'G',
			'\u01E6': 'G',
			'\u0122': 'G',
			'\u01E4': 'G',
			'\u0193': 'G',
			'\uA7A0': 'G',
			'\uA77D': 'G',
			'\uA77E': 'G',
			'\u24BD': 'H',
			'\uFF28': 'H',
			'\u0124': 'H',
			'\u1E22': 'H',
			'\u1E26': 'H',
			'\u021E': 'H',
			'\u1E24': 'H',
			'\u1E28': 'H',
			'\u1E2A': 'H',
			'\u0126': 'H',
			'\u2C67': 'H',
			'\u2C75': 'H',
			'\uA78D': 'H',
			'\u24BE': 'I',
			'\uFF29': 'I',
			'\u00CC': 'I',
			'\u00CD': 'I',
			'\u00CE': 'I',
			'\u0128': 'I',
			'\u012A': 'I',
			'\u012C': 'I',
			'\u0130': 'I',
			'\u00CF': 'I',
			'\u1E2E': 'I',
			'\u1EC8': 'I',
			'\u01CF': 'I',
			'\u0208': 'I',
			'\u020A': 'I',
			'\u1ECA': 'I',
			'\u012E': 'I',
			'\u1E2C': 'I',
			'\u0197': 'I',
			'\u24BF': 'J',
			'\uFF2A': 'J',
			'\u0134': 'J',
			'\u0248': 'J',
			'\u24C0': 'K',
			'\uFF2B': 'K',
			'\u1E30': 'K',
			'\u01E8': 'K',
			'\u1E32': 'K',
			'\u0136': 'K',
			'\u1E34': 'K',
			'\u0198': 'K',
			'\u2C69': 'K',
			'\uA740': 'K',
			'\uA742': 'K',
			'\uA744': 'K',
			'\uA7A2': 'K',
			'\u24C1': 'L',
			'\uFF2C': 'L',
			'\u013F': 'L',
			'\u0139': 'L',
			'\u013D': 'L',
			'\u1E36': 'L',
			'\u1E38': 'L',
			'\u013B': 'L',
			'\u1E3C': 'L',
			'\u1E3A': 'L',
			'\u0141': 'L',
			'\u023D': 'L',
			'\u2C62': 'L',
			'\u2C60': 'L',
			'\uA748': 'L',
			'\uA746': 'L',
			'\uA780': 'L',
			'\u01C7': 'LJ',
			'\u01C8': 'Lj',
			'\u24C2': 'M',
			'\uFF2D': 'M',
			'\u1E3E': 'M',
			'\u1E40': 'M',
			'\u1E42': 'M',
			'\u2C6E': 'M',
			'\u019C': 'M',
			'\u24C3': 'N',
			'\uFF2E': 'N',
			'\u01F8': 'N',
			'\u0143': 'N',
			'\u00D1': 'N',
			'\u1E44': 'N',
			'\u0147': 'N',
			'\u1E46': 'N',
			'\u0145': 'N',
			'\u1E4A': 'N',
			'\u1E48': 'N',
			'\u0220': 'N',
			'\u019D': 'N',
			'\uA790': 'N',
			'\uA7A4': 'N',
			'\u01CA': 'NJ',
			'\u01CB': 'Nj',
			'\u24C4': 'O',
			'\uFF2F': 'O',
			'\u00D2': 'O',
			'\u00D3': 'O',
			'\u00D4': 'O',
			'\u1ED2': 'O',
			'\u1ED0': 'O',
			'\u1ED6': 'O',
			'\u1ED4': 'O',
			'\u00D5': 'O',
			'\u1E4C': 'O',
			'\u022C': 'O',
			'\u1E4E': 'O',
			'\u014C': 'O',
			'\u1E50': 'O',
			'\u1E52': 'O',
			'\u014E': 'O',
			'\u022E': 'O',
			'\u0230': 'O',
			'\u00D6': 'O',
			'\u022A': 'O',
			'\u1ECE': 'O',
			'\u0150': 'O',
			'\u01D1': 'O',
			'\u020C': 'O',
			'\u020E': 'O',
			'\u01A0': 'O',
			'\u1EDC': 'O',
			'\u1EDA': 'O',
			'\u1EE0': 'O',
			'\u1EDE': 'O',
			'\u1EE2': 'O',
			'\u1ECC': 'O',
			'\u1ED8': 'O',
			'\u01EA': 'O',
			'\u01EC': 'O',
			'\u00D8': 'O',
			'\u01FE': 'O',
			'\u0186': 'O',
			'\u019F': 'O',
			'\uA74A': 'O',
			'\uA74C': 'O',
			'\u01A2': 'OI',
			'\uA74E': 'OO',
			'\u0222': 'OU',
			'\u24C5': 'P',
			'\uFF30': 'P',
			'\u1E54': 'P',
			'\u1E56': 'P',
			'\u01A4': 'P',
			'\u2C63': 'P',
			'\uA750': 'P',
			'\uA752': 'P',
			'\uA754': 'P',
			'\u24C6': 'Q',
			'\uFF31': 'Q',
			'\uA756': 'Q',
			'\uA758': 'Q',
			'\u024A': 'Q',
			'\u24C7': 'R',
			'\uFF32': 'R',
			'\u0154': 'R',
			'\u1E58': 'R',
			'\u0158': 'R',
			'\u0210': 'R',
			'\u0212': 'R',
			'\u1E5A': 'R',
			'\u1E5C': 'R',
			'\u0156': 'R',
			'\u1E5E': 'R',
			'\u024C': 'R',
			'\u2C64': 'R',
			'\uA75A': 'R',
			'\uA7A6': 'R',
			'\uA782': 'R',
			'\u24C8': 'S',
			'\uFF33': 'S',
			'\u1E9E': 'S',
			'\u015A': 'S',
			'\u1E64': 'S',
			'\u015C': 'S',
			'\u1E60': 'S',
			'\u0160': 'S',
			'\u1E66': 'S',
			'\u1E62': 'S',
			'\u1E68': 'S',
			'\u0218': 'S',
			'\u015E': 'S',
			'\u2C7E': 'S',
			'\uA7A8': 'S',
			'\uA784': 'S',
			'\u24C9': 'T',
			'\uFF34': 'T',
			'\u1E6A': 'T',
			'\u0164': 'T',
			'\u1E6C': 'T',
			'\u021A': 'T',
			'\u0162': 'T',
			'\u1E70': 'T',
			'\u1E6E': 'T',
			'\u0166': 'T',
			'\u01AC': 'T',
			'\u01AE': 'T',
			'\u023E': 'T',
			'\uA786': 'T',
			'\uA728': 'TZ',
			'\u24CA': 'U',
			'\uFF35': 'U',
			'\u00D9': 'U',
			'\u00DA': 'U',
			'\u00DB': 'U',
			'\u0168': 'U',
			'\u1E78': 'U',
			'\u016A': 'U',
			'\u1E7A': 'U',
			'\u016C': 'U',
			'\u00DC': 'U',
			'\u01DB': 'U',
			'\u01D7': 'U',
			'\u01D5': 'U',
			'\u01D9': 'U',
			'\u1EE6': 'U',
			'\u016E': 'U',
			'\u0170': 'U',
			'\u01D3': 'U',
			'\u0214': 'U',
			'\u0216': 'U',
			'\u01AF': 'U',
			'\u1EEA': 'U',
			'\u1EE8': 'U',
			'\u1EEE': 'U',
			'\u1EEC': 'U',
			'\u1EF0': 'U',
			'\u1EE4': 'U',
			'\u1E72': 'U',
			'\u0172': 'U',
			'\u1E76': 'U',
			'\u1E74': 'U',
			'\u0244': 'U',
			'\u24CB': 'V',
			'\uFF36': 'V',
			'\u1E7C': 'V',
			'\u1E7E': 'V',
			'\u01B2': 'V',
			'\uA75E': 'V',
			'\u0245': 'V',
			'\uA760': 'VY',
			'\u24CC': 'W',
			'\uFF37': 'W',
			'\u1E80': 'W',
			'\u1E82': 'W',
			'\u0174': 'W',
			'\u1E86': 'W',
			'\u1E84': 'W',
			'\u1E88': 'W',
			'\u2C72': 'W',
			'\u24CD': 'X',
			'\uFF38': 'X',
			'\u1E8A': 'X',
			'\u1E8C': 'X',
			'\u24CE': 'Y',
			'\uFF39': 'Y',
			'\u1EF2': 'Y',
			'\u00DD': 'Y',
			'\u0176': 'Y',
			'\u1EF8': 'Y',
			'\u0232': 'Y',
			'\u1E8E': 'Y',
			'\u0178': 'Y',
			'\u1EF6': 'Y',
			'\u1EF4': 'Y',
			'\u01B3': 'Y',
			'\u024E': 'Y',
			'\u1EFE': 'Y',
			'\u24CF': 'Z',
			'\uFF3A': 'Z',
			'\u0179': 'Z',
			'\u1E90': 'Z',
			'\u017B': 'Z',
			'\u017D': 'Z',
			'\u1E92': 'Z',
			'\u1E94': 'Z',
			'\u01B5': 'Z',
			'\u0224': 'Z',
			'\u2C7F': 'Z',
			'\u2C6B': 'Z',
			'\uA762': 'Z',
			'\u24D0': 'a',
			'\uFF41': 'a',
			'\u1E9A': 'a',
			'\u00E0': 'a',
			'\u00E1': 'a',
			'\u00E2': 'a',
			'\u1EA7': 'a',
			'\u1EA5': 'a',
			'\u1EAB': 'a',
			'\u1EA9': 'a',
			'\u00E3': 'a',
			'\u0101': 'a',
			'\u0103': 'a',
			'\u1EB1': 'a',
			'\u1EAF': 'a',
			'\u1EB5': 'a',
			'\u1EB3': 'a',
			'\u0227': 'a',
			'\u01E1': 'a',
			'\u00E4': 'a',
			'\u01DF': 'a',
			'\u1EA3': 'a',
			'\u00E5': 'a',
			'\u01FB': 'a',
			'\u01CE': 'a',
			'\u0201': 'a',
			'\u0203': 'a',
			'\u1EA1': 'a',
			'\u1EAD': 'a',
			'\u1EB7': 'a',
			'\u1E01': 'a',
			'\u0105': 'a',
			'\u2C65': 'a',
			'\u0250': 'a',
			'\uA733': 'aa',
			'\u00E6': 'ae',
			'\u01FD': 'ae',
			'\u01E3': 'ae',
			'\uA735': 'ao',
			'\uA737': 'au',
			'\uA739': 'av',
			'\uA73B': 'av',
			'\uA73D': 'ay',
			'\u24D1': 'b',
			'\uFF42': 'b',
			'\u1E03': 'b',
			'\u1E05': 'b',
			'\u1E07': 'b',
			'\u0180': 'b',
			'\u0183': 'b',
			'\u0253': 'b',
			'\u24D2': 'c',
			'\uFF43': 'c',
			'\u0107': 'c',
			'\u0109': 'c',
			'\u010B': 'c',
			'\u010D': 'c',
			'\u00E7': 'c',
			'\u1E09': 'c',
			'\u0188': 'c',
			'\u023C': 'c',
			'\uA73F': 'c',
			'\u2184': 'c',
			'\u24D3': 'd',
			'\uFF44': 'd',
			'\u1E0B': 'd',
			'\u010F': 'd',
			'\u1E0D': 'd',
			'\u1E11': 'd',
			'\u1E13': 'd',
			'\u1E0F': 'd',
			'\u0111': 'd',
			'\u018C': 'd',
			'\u0256': 'd',
			'\u0257': 'd',
			'\uA77A': 'd',
			'\u01F3': 'dz',
			'\u01C6': 'dz',
			'\u24D4': 'e',
			'\uFF45': 'e',
			'\u00E8': 'e',
			'\u00E9': 'e',
			'\u00EA': 'e',
			'\u1EC1': 'e',
			'\u1EBF': 'e',
			'\u1EC5': 'e',
			'\u1EC3': 'e',
			'\u1EBD': 'e',
			'\u0113': 'e',
			'\u1E15': 'e',
			'\u1E17': 'e',
			'\u0115': 'e',
			'\u0117': 'e',
			'\u00EB': 'e',
			'\u1EBB': 'e',
			'\u011B': 'e',
			'\u0205': 'e',
			'\u0207': 'e',
			'\u1EB9': 'e',
			'\u1EC7': 'e',
			'\u0229': 'e',
			'\u1E1D': 'e',
			'\u0119': 'e',
			'\u1E19': 'e',
			'\u1E1B': 'e',
			'\u0247': 'e',
			'\u025B': 'e',
			'\u01DD': 'e',
			'\u24D5': 'f',
			'\uFF46': 'f',
			'\u1E1F': 'f',
			'\u0192': 'f',
			'\uA77C': 'f',
			'\u24D6': 'g',
			'\uFF47': 'g',
			'\u01F5': 'g',
			'\u011D': 'g',
			'\u1E21': 'g',
			'\u011F': 'g',
			'\u0121': 'g',
			'\u01E7': 'g',
			'\u0123': 'g',
			'\u01E5': 'g',
			'\u0260': 'g',
			'\uA7A1': 'g',
			'\u1D79': 'g',
			'\uA77F': 'g',
			'\u24D7': 'h',
			'\uFF48': 'h',
			'\u0125': 'h',
			'\u1E23': 'h',
			'\u1E27': 'h',
			'\u021F': 'h',
			'\u1E25': 'h',
			'\u1E29': 'h',
			'\u1E2B': 'h',
			'\u1E96': 'h',
			'\u0127': 'h',
			'\u2C68': 'h',
			'\u2C76': 'h',
			'\u0265': 'h',
			'\u0195': 'hv',
			'\u24D8': 'i',
			'\uFF49': 'i',
			'\u00EC': 'i',
			'\u00ED': 'i',
			'\u00EE': 'i',
			'\u0129': 'i',
			'\u012B': 'i',
			'\u012D': 'i',
			'\u00EF': 'i',
			'\u1E2F': 'i',
			'\u1EC9': 'i',
			'\u01D0': 'i',
			'\u0209': 'i',
			'\u020B': 'i',
			'\u1ECB': 'i',
			'\u012F': 'i',
			'\u1E2D': 'i',
			'\u0268': 'i',
			'\u0131': 'i',
			'\u24D9': 'j',
			'\uFF4A': 'j',
			'\u0135': 'j',
			'\u01F0': 'j',
			'\u0249': 'j',
			'\u24DA': 'k',
			'\uFF4B': 'k',
			'\u1E31': 'k',
			'\u01E9': 'k',
			'\u1E33': 'k',
			'\u0137': 'k',
			'\u1E35': 'k',
			'\u0199': 'k',
			'\u2C6A': 'k',
			'\uA741': 'k',
			'\uA743': 'k',
			'\uA745': 'k',
			'\uA7A3': 'k',
			'\u24DB': 'l',
			'\uFF4C': 'l',
			'\u0140': 'l',
			'\u013A': 'l',
			'\u013E': 'l',
			'\u1E37': 'l',
			'\u1E39': 'l',
			'\u013C': 'l',
			'\u1E3D': 'l',
			'\u1E3B': 'l',
			'\u017F': 'l',
			'\u0142': 'l',
			'\u019A': 'l',
			'\u026B': 'l',
			'\u2C61': 'l',
			'\uA749': 'l',
			'\uA781': 'l',
			'\uA747': 'l',
			'\u01C9': 'lj',
			'\u24DC': 'm',
			'\uFF4D': 'm',
			'\u1E3F': 'm',
			'\u1E41': 'm',
			'\u1E43': 'm',
			'\u0271': 'm',
			'\u026F': 'm',
			'\u24DD': 'n',
			'\uFF4E': 'n',
			'\u01F9': 'n',
			'\u0144': 'n',
			'\u00F1': 'n',
			'\u1E45': 'n',
			'\u0148': 'n',
			'\u1E47': 'n',
			'\u0146': 'n',
			'\u1E4B': 'n',
			'\u1E49': 'n',
			'\u019E': 'n',
			'\u0272': 'n',
			'\u0149': 'n',
			'\uA791': 'n',
			'\uA7A5': 'n',
			'\u01CC': 'nj',
			'\u24DE': 'o',
			'\uFF4F': 'o',
			'\u00F2': 'o',
			'\u00F3': 'o',
			'\u00F4': 'o',
			'\u1ED3': 'o',
			'\u1ED1': 'o',
			'\u1ED7': 'o',
			'\u1ED5': 'o',
			'\u00F5': 'o',
			'\u1E4D': 'o',
			'\u022D': 'o',
			'\u1E4F': 'o',
			'\u014D': 'o',
			'\u1E51': 'o',
			'\u1E53': 'o',
			'\u014F': 'o',
			'\u022F': 'o',
			'\u0231': 'o',
			'\u00F6': 'o',
			'\u022B': 'o',
			'\u1ECF': 'o',
			'\u0151': 'o',
			'\u01D2': 'o',
			'\u020D': 'o',
			'\u020F': 'o',
			'\u01A1': 'o',
			'\u1EDD': 'o',
			'\u1EDB': 'o',
			'\u1EE1': 'o',
			'\u1EDF': 'o',
			'\u1EE3': 'o',
			'\u1ECD': 'o',
			'\u1ED9': 'o',
			'\u01EB': 'o',
			'\u01ED': 'o',
			'\u00F8': 'o',
			'\u01FF': 'o',
			'\u0254': 'o',
			'\uA74B': 'o',
			'\uA74D': 'o',
			'\u0275': 'o',
			'\u01A3': 'oi',
			'\u0223': 'ou',
			'\uA74F': 'oo',
			'\u24DF': 'p',
			'\uFF50': 'p',
			'\u1E55': 'p',
			'\u1E57': 'p',
			'\u01A5': 'p',
			'\u1D7D': 'p',
			'\uA751': 'p',
			'\uA753': 'p',
			'\uA755': 'p',
			'\u24E0': 'q',
			'\uFF51': 'q',
			'\u024B': 'q',
			'\uA757': 'q',
			'\uA759': 'q',
			'\u24E1': 'r',
			'\uFF52': 'r',
			'\u0155': 'r',
			'\u1E59': 'r',
			'\u0159': 'r',
			'\u0211': 'r',
			'\u0213': 'r',
			'\u1E5B': 'r',
			'\u1E5D': 'r',
			'\u0157': 'r',
			'\u1E5F': 'r',
			'\u024D': 'r',
			'\u027D': 'r',
			'\uA75B': 'r',
			'\uA7A7': 'r',
			'\uA783': 'r',
			'\u24E2': 's',
			'\uFF53': 's',
			'\u00DF': 's',
			'\u015B': 's',
			'\u1E65': 's',
			'\u015D': 's',
			'\u1E61': 's',
			'\u0161': 's',
			'\u1E67': 's',
			'\u1E63': 's',
			'\u1E69': 's',
			'\u0219': 's',
			'\u015F': 's',
			'\u023F': 's',
			'\uA7A9': 's',
			'\uA785': 's',
			'\u1E9B': 's',
			'\u24E3': 't',
			'\uFF54': 't',
			'\u1E6B': 't',
			'\u1E97': 't',
			'\u0165': 't',
			'\u1E6D': 't',
			'\u021B': 't',
			'\u0163': 't',
			'\u1E71': 't',
			'\u1E6F': 't',
			'\u0167': 't',
			'\u01AD': 't',
			'\u0288': 't',
			'\u2C66': 't',
			'\uA787': 't',
			'\uA729': 'tz',
			'\u24E4': 'u',
			'\uFF55': 'u',
			'\u00F9': 'u',
			'\u00FA': 'u',
			'\u00FB': 'u',
			'\u0169': 'u',
			'\u1E79': 'u',
			'\u016B': 'u',
			'\u1E7B': 'u',
			'\u016D': 'u',
			'\u00FC': 'u',
			'\u01DC': 'u',
			'\u01D8': 'u',
			'\u01D6': 'u',
			'\u01DA': 'u',
			'\u1EE7': 'u',
			'\u016F': 'u',
			'\u0171': 'u',
			'\u01D4': 'u',
			'\u0215': 'u',
			'\u0217': 'u',
			'\u01B0': 'u',
			'\u1EEB': 'u',
			'\u1EE9': 'u',
			'\u1EEF': 'u',
			'\u1EED': 'u',
			'\u1EF1': 'u',
			'\u1EE5': 'u',
			'\u1E73': 'u',
			'\u0173': 'u',
			'\u1E77': 'u',
			'\u1E75': 'u',
			'\u0289': 'u',
			'\u24E5': 'v',
			'\uFF56': 'v',
			'\u1E7D': 'v',
			'\u1E7F': 'v',
			'\u028B': 'v',
			'\uA75F': 'v',
			'\u028C': 'v',
			'\uA761': 'vy',
			'\u24E6': 'w',
			'\uFF57': 'w',
			'\u1E81': 'w',
			'\u1E83': 'w',
			'\u0175': 'w',
			'\u1E87': 'w',
			'\u1E85': 'w',
			'\u1E98': 'w',
			'\u1E89': 'w',
			'\u2C73': 'w',
			'\u24E7': 'x',
			'\uFF58': 'x',
			'\u1E8B': 'x',
			'\u1E8D': 'x',
			'\u24E8': 'y',
			'\uFF59': 'y',
			'\u1EF3': 'y',
			'\u00FD': 'y',
			'\u0177': 'y',
			'\u1EF9': 'y',
			'\u0233': 'y',
			'\u1E8F': 'y',
			'\u00FF': 'y',
			'\u1EF7': 'y',
			'\u1E99': 'y',
			'\u1EF5': 'y',
			'\u01B4': 'y',
			'\u024F': 'y',
			'\u1EFF': 'y',
			'\u24E9': 'z',
			'\uFF5A': 'z',
			'\u017A': 'z',
			'\u1E91': 'z',
			'\u017C': 'z',
			'\u017E': 'z',
			'\u1E93': 'z',
			'\u1E95': 'z',
			'\u01B6': 'z',
			'\u0225': 'z',
			'\u0240': 'z',
			'\u2C6C': 'z',
			'\uA763': 'z',
			'\u0386': '\u0391',
			'\u0388': '\u0395',
			'\u0389': '\u0397',
			'\u038A': '\u0399',
			'\u03AA': '\u0399',
			'\u038C': '\u039F',
			'\u038E': '\u03A5',
			'\u03AB': '\u03A5',
			'\u038F': '\u03A9',
			'\u03AC': '\u03B1',
			'\u03AD': '\u03B5',
			'\u03AE': '\u03B7',
			'\u03AF': '\u03B9',
			'\u03CA': '\u03B9',
			'\u0390': '\u03B9',
			'\u03CC': '\u03BF',
			'\u03CD': '\u03C5',
			'\u03CB': '\u03C5',
			'\u03B0': '\u03C5',
			'\u03C9': '\u03C9',
			'\u03C2': '\u03C3'
		};
	
		return diacritics;
	});
	
	S2.define('select2/data/base',[
		'../utils'
	], function (Utils) {
		function BaseAdapter ($element, options) {
			BaseAdapter.__super__.constructor.call(this);
		}
	
		Utils.Extend(BaseAdapter, Utils.Observable);
	
		BaseAdapter.prototype.current = function (callback) {
			throw new Error('The `current` method must be defined in child classes.');
		};
	
		BaseAdapter.prototype.query = function (params, callback) {
			throw new Error('The `query` method must be defined in child classes.');
		};
	
		BaseAdapter.prototype.bind = function (container, $container) {
			// Can be implemented in subclasses
		};
	
		BaseAdapter.prototype.destroy = function () {
			// Can be implemented in subclasses
		};
	
		BaseAdapter.prototype.generateResultId = function (container, data) {
			var id = '';
	
			if (container != null) {
				id += container.id
			} else {
				id += Utils.generateChars(4);
			}
	
			id += '-result-';
			id += Utils.generateChars(4);
	
			if (data.id != null) {
				id += '-' + data.id.toString();
			} else {
				id += '-' + Utils.generateChars(4);
			}
			return id;
		};
	
		return BaseAdapter;
	});
	
	S2.define('select2/data/select',[
		'./base',
		'../utils',
		'jquery'
	], function (BaseAdapter, Utils, $) {
		function SelectAdapter ($element, options) {
			this.$element = $element;
			this.options = options;
	
			SelectAdapter.__super__.constructor.call(this);
		}
	
		Utils.Extend(SelectAdapter, BaseAdapter);
	
		SelectAdapter.prototype.current = function (callback) {
			var data = [];
			var self = this;
	
			this.$element.find(':selected').each(function () {
				var $option = $(this);
	
				var option = self.item($option);
	
				data.push(option);
			});
	
			callback(data);
		};
	
		SelectAdapter.prototype.select = function (data) {
			var self = this;
	
			data.selected = true;
	
			// If data.element is a DOM node, use it instead
			if ($(data.element).is('option')) {
				data.element.selected = true;
	
				this.$element.trigger('change');
	
				return;
			}
	
			if (this.$element.prop('multiple')) {
				this.current(function (currentData) {
					var val = [];
	
					data = [data];
					data.push.apply(data, currentData);
	
					for (var d = 0; d < data.length; d++) {
						var id = data[d].id;
	
						if ($.inArray(id, val) === -1) {
							val.push(id);
						}
					}
	
					self.$element.val(val);
					self.$element.trigger('change');
				});
			} else {
				var val = data.id;
	
				this.$element.val(val);
				this.$element.trigger('change');
			}
		};
	
		SelectAdapter.prototype.unselect = function (data) {
			var self = this;
	
			if (!this.$element.prop('multiple')) {
				return;
			}
	
			data.selected = false;
	
			if ($(data.element).is('option')) {
				data.element.selected = false;
	
				this.$element.trigger('change');
	
				return;
			}
	
			this.current(function (currentData) {
				var val = [];
	
				for (var d = 0; d < currentData.length; d++) {
					var id = currentData[d].id;
	
					if (id !== data.id && $.inArray(id, val) === -1) {
						val.push(id);
					}
				}
	
				self.$element.val(val);
	
				self.$element.trigger('change');
			});
		};
	
		SelectAdapter.prototype.bind = function (container, $container) {
			var self = this;
	
			this.container = container;
	
			container.on('select', function (params) {
				self.select(params.data);
			});
	
			container.on('unselect', function (params) {
				self.unselect(params.data);
			});
		};
	
		SelectAdapter.prototype.destroy = function () {
			// Remove anything added to child elements
			this.$element.find('*').each(function () {
				// Remove any custom data set by Select2
				$.removeData(this, 'data');
			});
		};
	
		SelectAdapter.prototype.query = function (params, callback) {
			var data = [];
			var self = this;
	
			var $options = this.$element.children();
	
			$options.each(function () {
				var $option = $(this);
	
				if (!$option.is('option') && !$option.is('optgroup')) {
					return;
				}
	
				var option = self.item($option);
	
				var matches = self.matches(params, option);
	
				if (matches !== null) {
					data.push(matches);
				}
			});
	
			callback({
				results: data
			});
		};
	
		SelectAdapter.prototype.addOptions = function ($options) {
			Utils.appendMany(this.$element, $options);
		};
	
		SelectAdapter.prototype.option = function (data) {
			var option;
	
			if (data.children) {
				option = document.createElement('optgroup');
				option.label = data.text;
			} else {
				option = document.createElement('option');
	
				if (option.textContent !== undefined) {
					option.textContent = data.text;
				} else {
					option.innerText = data.text;
				}
			}
	
			if (data.id !== undefined) {
				option.value = data.id;
			}
	
			if (data.disabled) {
				option.disabled = true;
			}
	
			if (data.selected) {
				option.selected = true;
			}
	
			if (data.title) {
				option.title = data.title;
			}
	
			var $option = $(option);
	
			var normalizedData = this._normalizeItem(data);
			normalizedData.element = option;
	
			// Override the option's data with the combined data
			$.data(option, 'data', normalizedData);
	
			return $option;
		};
	
		SelectAdapter.prototype.item = function ($option) {
			var data = {};
	
			data = $.data($option[0], 'data');
	
			if (data != null) {
				return data;
			}
	
			if ($option.is('option')) {
				data = {
					id: $option.val(),
					text: $option.text(),
					disabled: $option.prop('disabled'),
					selected: $option.prop('selected'),
					title: $option.prop('title')
				};
			} else if ($option.is('optgroup')) {
				data = {
					text: $option.prop('label'),
					children: [],
					title: $option.prop('title')
				};
	
				var $children = $option.children('option');
				var children = [];
	
				for (var c = 0; c < $children.length; c++) {
					var $child = $($children[c]);
	
					var child = this.item($child);
	
					children.push(child);
				}
	
				data.children = children;
			}
	
			data = this._normalizeItem(data);
			data.element = $option[0];
	
			$.data($option[0], 'data', data);
	
			return data;
		};
	
		SelectAdapter.prototype._normalizeItem = function (item) {
			if (!$.isPlainObject(item)) {
				item = {
					id: item,
					text: item
				};
			}
	
			item = $.extend({}, {
				text: ''
			}, item);
	
			var defaults = {
				selected: false,
				disabled: false
			};
	
			if (item.id != null) {
				item.id = item.id.toString();
			}
	
			if (item.text != null) {
				item.text = item.text.toString();
			}
	
			if (item._resultId == null && item.id) {
				item._resultId = this.generateResultId(this.container, item);
			}
	
			return $.extend({}, defaults, item);
		};
	
		SelectAdapter.prototype.matches = function (params, data) {
			var matcher = this.options.get('matcher');
	
			return matcher(params, data);
		};
	
		return SelectAdapter;
	});
	
	S2.define('select2/data/array',[
		'./select',
		'../utils',
		'jquery'
	], function (SelectAdapter, Utils, $) {
		function ArrayAdapter ($element, options) {
			var data = options.get('data') || [];
	
			ArrayAdapter.__super__.constructor.call(this, $element, options);
	
			this.addOptions(this.convertToOptions(data));
		}
	
		Utils.Extend(ArrayAdapter, SelectAdapter);
	
		ArrayAdapter.prototype.select = function (data) {
			var $option = this.$element.find('option').filter(function (i, elm) {
				return elm.value == data.id.toString();
			});
	
			if ($option.length === 0) {
				$option = this.option(data);
	
				this.addOptions($option);
			}
	
			ArrayAdapter.__super__.select.call(this, data);
		};
	
		ArrayAdapter.prototype.convertToOptions = function (data) {
			var self = this;
	
			var $existing = this.$element.find('option');
			var existingIds = $existing.map(function () {
				return self.item($(this)).id;
			}).get();
	
			var $options = [];
	
			// Filter out all items except for the one passed in the argument
			function onlyItem (item) {
				return function () {
					return $(this).val() == item.id;
				};
			}
	
			for (var d = 0; d < data.length; d++) {
				var item = this._normalizeItem(data[d]);
	
				// Skip items which were pre-loaded, only merge the data
				if ($.inArray(item.id, existingIds) >= 0) {
					var $existingOption = $existing.filter(onlyItem(item));
	
					var existingData = this.item($existingOption);
					var newData = $.extend(true, {}, item, existingData);
	
					var $newOption = this.option(newData);
	
					$existingOption.replaceWith($newOption);
	
					continue;
				}
	
				var $option = this.option(item);
	
				if (item.children) {
					var $children = this.convertToOptions(item.children);
	
					Utils.appendMany($option, $children);
				}
	
				$options.push($option);
			}
	
			return $options;
		};
	
		return ArrayAdapter;
	});
	
	S2.define('select2/data/ajax',[
		'./array',
		'../utils',
		'jquery'
	], function (ArrayAdapter, Utils, $) {
		function AjaxAdapter ($element, options) {
			this.ajaxOptions = this._applyDefaults(options.get('ajax'));
	
			if (this.ajaxOptions.processResults != null) {
				this.processResults = this.ajaxOptions.processResults;
			}
	
			AjaxAdapter.__super__.constructor.call(this, $element, options);
		}
	
		Utils.Extend(AjaxAdapter, ArrayAdapter);
	
		AjaxAdapter.prototype._applyDefaults = function (options) {
			var defaults = {
				data: function (params) {
					return $.extend({}, params, {
						q: params.term
					});
				},
				transport: function (params, success, failure) {
					var $request = $.ajax(params);
	
					$request.then(success);
					$request.fail(failure);
	
					return $request;
				}
			};
	
			return $.extend({}, defaults, options, true);
		};
	
		AjaxAdapter.prototype.processResults = function (results) {
			return results;
		};
	
		AjaxAdapter.prototype.query = function (params, callback) {
			var matches = [];
			var self = this;
	
			if (this._request != null) {
				// JSONP requests cannot always be aborted
				if ($.isFunction(this._request.abort)) {
					this._request.abort();
				}
	
				this._request = null;
			}
	
			var options = $.extend({
				type: 'GET'
			}, this.ajaxOptions);
	
			if (typeof options.url === 'function') {
				options.url = options.url.call(this.$element, params);
			}
	
			if (typeof options.data === 'function') {
				options.data = options.data.call(this.$element, params);
			}
	
			function request () {
				var $request = options.transport(options, function (data) {
					var results = self.processResults(data, params);
	
					if (self.options.get('debug') && window.console && console.error) {
						// Check to make sure that the response included a `results` key.
						if (!results || !results.results || !$.isArray(results.results)) {
							console.error(
								'Select2: The AJAX results did not return an array in the ' +
								'`results` key of the response.'
							);
						}
					}
	
					callback(results);
					self.container.focusOnActiveElement();
				}, function () {
					// Attempt to detect if a request was aborted
					// Only works if the transport exposes a status property
					if ($request.status && $request.status === '0') {
						return;
					}
	
					self.trigger('results:message', {
						message: 'errorLoading'
					});
				});
	
				self._request = $request;
			}
	
			if (this.ajaxOptions.delay && params.term != null) {
				if (this._queryTimeout) {
					window.clearTimeout(this._queryTimeout);
				}
	
				this._queryTimeout = window.setTimeout(request, this.ajaxOptions.delay);
			} else {
				request();
			}
		};
	
		return AjaxAdapter;
	});
	
	S2.define('select2/data/tags',[
		'jquery'
	], function ($) {
		function Tags (decorated, $element, options) {
			var tags = options.get('tags');
	
			var createTag = options.get('createTag');
	
			if (createTag !== undefined) {
				this.createTag = createTag;
			}
	
			var insertTag = options.get('insertTag');
	
			if (insertTag !== undefined) {
					this.insertTag = insertTag;
			}
	
			decorated.call(this, $element, options);
	
			if ($.isArray(tags)) {
				for (var t = 0; t < tags.length; t++) {
					var tag = tags[t];
					var item = this._normalizeItem(tag);
	
					var $option = this.option(item);
	
					this.$element.append($option);
				}
			}
		}
	
		Tags.prototype.query = function (decorated, params, callback) {
			var self = this;
	
			this._removeOldTags();
	
			if (params.term == null || params.page != null) {
				decorated.call(this, params, callback);
				return;
			}
	
			function wrapper (obj, child) {
				var data = obj.results;
	
				for (var i = 0; i < data.length; i++) {
					var option = data[i];
	
					var checkChildren = (
						option.children != null &&
						!wrapper({
							results: option.children
						}, true)
					);
	
					var optionText = (option.text || '').toUpperCase();
					var paramsTerm = (params.term || '').toUpperCase();
	
					var checkText = optionText === paramsTerm;
	
					if (checkText || checkChildren) {
						if (child) {
							return false;
						}
	
						obj.data = data;
						callback(obj);
	
						return;
					}
				}
	
				if (child) {
					return true;
				}
	
				var tag = self.createTag(params);
	
				if (tag != null) {
					var $option = self.option(tag);
					$option.attr('data-select2-tag', true);
	
					self.addOptions([$option]);
	
					self.insertTag(data, tag);
				}
	
				obj.results = data;
	
				callback(obj);
			}
	
			decorated.call(this, params, wrapper);
		};
	
		Tags.prototype.createTag = function (decorated, params) {
			var term = $.trim(params.term);
	
			if (term === '') {
				return null;
			}
	
			return {
				id: term,
				text: term
			};
		};
	
		Tags.prototype.insertTag = function (_, data, tag) {
			data.unshift(tag);
		};
	
		Tags.prototype._removeOldTags = function (_) {
			var tag = this._lastTag;
	
			var $options = this.$element.find('option[data-select2-tag]');
	
			$options.each(function () {
				if (this.selected) {
					return;
				}
	
				$(this).remove();
			});
		};
	
		return Tags;
	});
	
	S2.define('select2/data/tokenizer',[
		'jquery'
	], function ($) {
		function Tokenizer (decorated, $element, options) {
			var tokenizer = options.get('tokenizer');
	
			if (tokenizer !== undefined) {
				this.tokenizer = tokenizer;
			}
	
			decorated.call(this, $element, options);
		}
	
		Tokenizer.prototype.bind = function (decorated, container, $container) {
			decorated.call(this, container, $container);
	
			this.$search =  container.dropdown.$search || container.selection.$search ||
				$container.find('.select2-search__field');
		};
	
		Tokenizer.prototype.query = function (decorated, params, callback) {
			var self = this;
	
			function createAndSelect (data) {
				// Normalize the data object so we can use it for checks
				var item = self._normalizeItem(data);
	
				// Check if the data object already exists as a tag
				// Select it if it doesn't
				var $existingOptions = self.$element.find('option').filter(function () {
					return $(this).val() === item.id;
				});
	
				// If an existing option wasn't found for it, create the option
				if (!$existingOptions.length) {
					var $option = self.option(item);
					$option.attr('data-select2-tag', true);
	
					self._removeOldTags();
					self.addOptions([$option]);
				}
	
				// Select the item, now that we know there is an option for it
				select(item);
			}
	
			function select (data) {
				self.trigger('select', {
					data: data
				});
			}
	
			params.term = params.term || '';
	
			var tokenData = this.tokenizer(params, this.options, createAndSelect);
	
			if (tokenData.term !== params.term) {
				// Replace the search term if we have the search box
				if (this.$search.length) {
					this.$search.val(tokenData.term);
					this.$search.focus();
				}
	
				params.term = tokenData.term;
			}
	
			decorated.call(this, params, callback);
		};
	
		Tokenizer.prototype.tokenizer = function (_, params, options, callback) {
			var separators = options.get('tokenSeparators') || [];
			var term = params.term;
			var i = 0;
	
			var createTag = this.createTag || function (params) {
				return {
					id: params.term,
					text: params.term
				};
			};
	
			while (i < term.length) {
				var termChar = term[i];
	
				if ($.inArray(termChar, separators) === -1) {
					i++;
	
					continue;
				}
	
				var part = term.substr(0, i);
				var partParams = $.extend({}, params, {
					term: part
				});
	
				var data = createTag(partParams);
	
				if (data == null) {
					i++;
					continue;
				}
	
				callback(data);
	
				// Reset the term to not include the tokenized portion
				term = term.substr(i + 1) || '';
				i = 0;
			}
	
			return {
				term: term
			};
		};
	
		return Tokenizer;
	});
	
	S2.define('select2/data/minimumInputLength',[
	
	], function () {
		function MinimumInputLength (decorated, $e, options) {
			this.minimumInputLength = options.get('minimumInputLength');
	
			decorated.call(this, $e, options);
		}
	
		MinimumInputLength.prototype.query = function (decorated, params, callback) {
			params.term = params.term || '';
	
			if (params.term.length < this.minimumInputLength) {
				this.trigger('results:message', {
					message: 'inputTooShort',
					args: {
						minimum: this.minimumInputLength,
						input: params.term,
						params: params
					}
				});
	
				return;
			}
	
			decorated.call(this, params, callback);
		};
	
		return MinimumInputLength;
	});
	
	S2.define('select2/data/maximumInputLength',[
	
	], function () {
		function MaximumInputLength (decorated, $e, options) {
			this.maximumInputLength = options.get('maximumInputLength');
	
			decorated.call(this, $e, options);
		}
	
		MaximumInputLength.prototype.query = function (decorated, params, callback) {
			params.term = params.term || '';
	
			if (this.maximumInputLength > 0 &&
					params.term.length > this.maximumInputLength) {
				this.trigger('results:message', {
					message: 'inputTooLong',
					args: {
						maximum: this.maximumInputLength,
						input: params.term,
						params: params
					}
				});
	
				return;
			}
	
			decorated.call(this, params, callback);
		};
	
		return MaximumInputLength;
	});
	
	S2.define('select2/data/maximumSelectionLength',[
	
	], function (){
		function MaximumSelectionLength (decorated, $e, options) {
			this.maximumSelectionLength = options.get('maximumSelectionLength');
	
			decorated.call(this, $e, options);
		}
	
		MaximumSelectionLength.prototype.query =
			function (decorated, params, callback) {
				var self = this;
	
				this.current(function (currentData) {
					var count = currentData != null ? currentData.length : 0;
					if (self.maximumSelectionLength > 0 &&
						count >= self.maximumSelectionLength) {
						self.trigger('results:message', {
							message: 'maximumSelected',
							args: {
								maximum: self.maximumSelectionLength
							}
						});
						return;
					}
					decorated.call(self, params, callback);
				});
		};
	
		return MaximumSelectionLength;
	});
	
	S2.define('select2/dropdown',[
		'jquery',
		'./utils'
	], function ($, Utils) {
		function Dropdown ($element, options) {
			this.$element = $element;
			this.options = options;
	
			Dropdown.__super__.constructor.call(this);
		}
	
		Utils.Extend(Dropdown, Utils.Observable);
	
		Dropdown.prototype.render = function () {
			var $dropdown = $(
				'<span class="select2-dropdown">' +
					'<span class="select2-results"></span>' +
				'</span>'
			);
	
			$dropdown.attr('dir', this.options.get('dir'));
	
			this.$dropdown = $dropdown;
	
			return $dropdown;
		};
	
		Dropdown.prototype.bind = function () {
			// Should be implemented in subclasses
		};
	
		Dropdown.prototype.position = function ($dropdown, $container) {
			// Should be implmented in subclasses
		};
	
		Dropdown.prototype.destroy = function () {
			// Remove the dropdown from the DOM
			this.$dropdown.remove();
		};
	
		return Dropdown;
	});
	
	S2.define('select2/dropdown/search',[
		'jquery',
		'../utils'
	], function ($, Utils) {
		function Search () { }
	
		Search.prototype.render = function (decorated) {
			var $rendered = decorated.call(this);
	
			var $search = $(
				'<span class="select2-search select2-search--dropdown">' +
					'<input class="select2-search__field" type="text" tabindex="-1"' +
					' autocomplete="off" autocorrect="off" autocapitalize="none"' +
					' spellcheck="false" role="combobox" aria-autocomplete="list" aria-expanded="true" />' +
				'</span>'
			);
	
			this.$searchContainer = $search;
			this.$search = $search.find('input');
	
			$rendered.prepend($search);
	
			return $rendered;
		};
	
		Search.prototype.bind = function (decorated, container, $container) {
			var self = this;
			var resultsId = container.id + '-results';
	
			decorated.call(this, container, $container);
	
			this.$search.on('keydown', function (evt) {
				self.trigger('keypress', evt);
	
				self._keyUpPrevented = evt.isDefaultPrevented();
			});
	
			// Workaround for browsers which do not support the `input` event
			// This will prevent double-triggering of events for browsers which support
			// both the `keyup` and `input` events.
			this.$search.on('input', function (evt) {
				// Unbind the duplicated `keyup` event
				$(this).off('keyup');
			});
	
			this.$search.on('keyup input', function (evt) {
				self.handleSearch(evt);
			});
	
			container.on('open', function () {
				self.$search.attr('tabindex', 0);
				self.$search.attr('aria-owns', resultsId);
				self.$search.focus();
	
				window.setTimeout(function () {
					self.$search.focus();
				}, 0);
			});
	
			container.on('close', function () {
				self.$search.attr('tabindex', -1);
				self.$search.removeAttr('aria-activedescendant');
				self.$search.removeAttr('aria-owns');
				self.$search.val('');
			});
	
			container.on('focus', function () {
				if (!container.isOpen()) {
					self.$search.focus();
				}
			});
	
			container.on('results:all', function (params) {
				if (params.query.term == null || params.query.term === '') {
					var showSearch = self.showSearch(params);
	
					if (showSearch) {
						self.$searchContainer.removeClass('select2-search--hide');
					} else {
						self.$searchContainer.addClass('select2-search--hide');
					}
				}
			});
	
			container.on('results:focus', function (params) {
				self.$search.attr('aria-activedescendant', params.data._resultId);
			});
		};
	
		Search.prototype.handleSearch = function (evt) {
			if (!this._keyUpPrevented) {
				var input = this.$search.val();
	
				this.trigger('query', {
					term: input
				});
			}
	
			this._keyUpPrevented = false;
		};
	
		Search.prototype.showSearch = function (_, params) {
			return true;
		};
	
		return Search;
	});
	
	S2.define('select2/dropdown/hidePlaceholder',[
	
	], function () {
		function HidePlaceholder (decorated, $element, options, dataAdapter) {
			this.placeholder = this.normalizePlaceholder(options.get('placeholder'));
	
			decorated.call(this, $element, options, dataAdapter);
		}
	
		HidePlaceholder.prototype.append = function (decorated, data) {
			data.results = this.removePlaceholder(data.results);
	
			decorated.call(this, data);
		};
	
		HidePlaceholder.prototype.normalizePlaceholder = function (_, placeholder) {
			if (typeof placeholder === 'string') {
				placeholder = {
					id: '',
					text: placeholder
				};
			}
	
			return placeholder;
		};
	
		HidePlaceholder.prototype.removePlaceholder = function (_, data) {
			var modifiedData = data.slice(0);
	
			for (var d = data.length - 1; d >= 0; d--) {
				var item = data[d];
	
				if (this.placeholder.id === item.id) {
					modifiedData.splice(d, 1);
				}
			}
	
			return modifiedData;
		};
	
		return HidePlaceholder;
	});
	
	S2.define('select2/dropdown/infiniteScroll',[
		'jquery'
	], function ($) {
		function InfiniteScroll (decorated, $element, options, dataAdapter) {
			this.lastParams = {};
	
			decorated.call(this, $element, options, dataAdapter);
	
			this.$loadingMore = this.createLoadingMore();
			this.loading = false;
		}
	
		InfiniteScroll.prototype.append = function (decorated, data) {
			this.$loadingMore.remove();
			this.loading = false;
	
			decorated.call(this, data);
	
			if (this.showLoadingMore(data)) {
				this.$results.append(this.$loadingMore);
			}
		};
	
		InfiniteScroll.prototype.bind = function (decorated, container, $container) {
			var self = this;
	
			decorated.call(this, container, $container);
	
			container.on('query', function (params) {
				self.lastParams = params;
				self.loading = true;
			});
	
			container.on('query:append', function (params) {
				self.lastParams = params;
				self.loading = true;
			});
	
			this.$results.on('scroll', function () {
				var isLoadMoreVisible = $.contains(
					document.documentElement,
					self.$loadingMore[0]
				);
	
				if (self.loading || !isLoadMoreVisible) {
					return;
				}
	
				var currentOffset = self.$results.offset().top +
					self.$results.outerHeight(false);
				var loadingMoreOffset = self.$loadingMore.offset().top +
					self.$loadingMore.outerHeight(false);
	
				if (currentOffset + 50 >= loadingMoreOffset) {
					self.loadMore();
				}
			});
		};
	
		InfiniteScroll.prototype.loadMore = function () {
			this.loading = true;
	
			var params = $.extend({}, {page: 1}, this.lastParams);
	
			params.page++;
	
			this.trigger('query:append', params);
		};
	
		InfiniteScroll.prototype.showLoadingMore = function (_, data) {
			return data.pagination && data.pagination.more;
		};
	
		InfiniteScroll.prototype.createLoadingMore = function () {
			var $option = $(
				'<li ' +
				'class="select2-results__option select2-results__option--load-more"' +
				'role="option" aria-disabled="true"></li>'
			);
	
			var message = this.options.get('translations').get('loadingMore');
	
			$option.html(message(this.lastParams));
	
			return $option;
		};
	
		return InfiniteScroll;
	});
	
	S2.define('select2/dropdown/attachBody',[
		'jquery',
		'../utils'
	], function ($, Utils) {
		function AttachBody (decorated, $element, options) {
			this.$dropdownParent = options.get('dropdownParent') || $(document.body);
	
			decorated.call(this, $element, options);
		}
	
		AttachBody.prototype.bind = function (decorated, container, $container) {
			var self = this;
	
			var setupResultsEvents = false;
	
			decorated.call(this, container, $container);
	
			container.on('open', function () {
				self._showDropdown();
				self._attachPositioningHandler(container);
	
				if (!setupResultsEvents) {
					setupResultsEvents = true;
	
					container.on('results:all', function () {
						self._positionDropdown();
						self._resizeDropdown();
					});
	
					container.on('results:append', function () {
						self._positionDropdown();
						self._resizeDropdown();
					});
				}
			});
	
			container.on('close', function () {
				self._hideDropdown();
				self._detachPositioningHandler(container);
			});
	
			this.$dropdownContainer.on('mousedown', function (evt) {
				evt.stopPropagation();
			});
		};
	
		AttachBody.prototype.destroy = function (decorated) {
			decorated.call(this);
	
			this.$dropdownContainer.remove();
		};
	
		AttachBody.prototype.position = function (decorated, $dropdown, $container) {
			// Clone all of the container classes
			$dropdown.attr('class', $container.attr('class'));
	
			$dropdown.removeClass('select2');
			$dropdown.addClass('select2-container--open');
	
			$dropdown.css({
				position: 'absolute',
				top: -999999
			});
	
			this.$container = $container;
		};
	
		AttachBody.prototype.render = function (decorated) {
			var $container = $('<span></span>');
	
			var $dropdown = decorated.call(this);
			$container.append($dropdown);
	
			this.$dropdownContainer = $container;
	
			return $container;
		};
	
		AttachBody.prototype._hideDropdown = function (decorated) {
			this.$dropdownContainer.detach();
		};
	
		AttachBody.prototype._attachPositioningHandler =
				function (decorated, container) {
			var self = this;
	
			var scrollEvent = 'scroll.select2.' + container.id;
			var resizeEvent = 'resize.select2.' + container.id;
			var orientationEvent = 'orientationchange.select2.' + container.id;
	
			var $watchers = this.$container.parents().filter(Utils.hasScroll);
			$watchers.each(function () {
				$(this).data('select2-scroll-position', {
					x: $(this).scrollLeft(),
					y: $(this).scrollTop()
				});
			});
	
			$watchers.on(scrollEvent, function (ev) {
				var position = $(this).data('select2-scroll-position');
				$(this).scrollTop(position.y);
			});
	
			$(window).on(scrollEvent + ' ' + resizeEvent + ' ' + orientationEvent,
				function (e) {
				self._positionDropdown();
				self._resizeDropdown();
			});
		};
	
		AttachBody.prototype._detachPositioningHandler =
				function (decorated, container) {
			var scrollEvent = 'scroll.select2.' + container.id;
			var resizeEvent = 'resize.select2.' + container.id;
			var orientationEvent = 'orientationchange.select2.' + container.id;
	
			var $watchers = this.$container.parents().filter(Utils.hasScroll);
			$watchers.off(scrollEvent);
	
			$(window).off(scrollEvent + ' ' + resizeEvent + ' ' + orientationEvent);
		};
	
		AttachBody.prototype._positionDropdown = function () {
			var $window = $(window);
	
			var isCurrentlyAbove = this.$dropdown.hasClass('select2-dropdown--above');
			var isCurrentlyBelow = this.$dropdown.hasClass('select2-dropdown--below');
	
			var newDirection = null;
	
			var offset = this.$container.offset();
	
			offset.bottom = offset.top + this.$container.outerHeight(false);
	
			var container = {
				height: this.$container.outerHeight(false)
			};
	
			container.top = offset.top;
			container.bottom = offset.top + container.height;
	
			var dropdown = {
				height: this.$dropdown.outerHeight(false)
			};
	
			var viewport = {
				top: $window.scrollTop(),
				bottom: $window.scrollTop() + $window.height()
			};
	
			var enoughRoomAbove = viewport.top < (offset.top - dropdown.height);
			var enoughRoomBelow = viewport.bottom > (offset.bottom + dropdown.height);
	
			var css = {
				left: offset.left,
				top: container.bottom
			};
	
			// Determine what the parent element is to use for calciulating the offset
			var $offsetParent = this.$dropdownParent;
	
			// For statically positoned elements, we need to get the element
			// that is determining the offset
			if ($offsetParent.css('position') === 'static') {
				$offsetParent = $offsetParent.offsetParent();
			}
	
			var parentOffset = $offsetParent.offset();
	
			css.left -= parentOffset.left;
	
			if (!isCurrentlyAbove && !isCurrentlyBelow) {
				newDirection = 'below';
			}
	
			if (!enoughRoomBelow && enoughRoomAbove && !isCurrentlyAbove) {
				newDirection = 'above';
			} else if (!enoughRoomAbove && enoughRoomBelow && isCurrentlyAbove) {
				newDirection = 'below';
			}
	
			if (newDirection == 'above' ||
				(isCurrentlyAbove && newDirection !== 'below')) {
				css.top = container.top - dropdown.height;
			}
	
			if (newDirection != null) {
				this.$dropdown
					.removeClass('select2-dropdown--below select2-dropdown--above')
					.addClass('select2-dropdown--' + newDirection);
				this.$container
					.removeClass('select2-container--below select2-container--above')
					.addClass('select2-container--' + newDirection);
			}
	
			this.$dropdownContainer.css(css);
		};
	
		AttachBody.prototype._resizeDropdown = function () {
			var css = {
				width: this.$container.outerWidth(false) + 'px'
			};
	
			if (this.options.get('dropdownAutoWidth')) {
				css.minWidth = css.width;
				css.position = 'relative';
				css.width = 'auto';
			}
	
			this.$dropdown.css(css);
		};
	
		AttachBody.prototype._showDropdown = function (decorated) {
			this.$dropdownContainer.appendTo(this.$dropdownParent);
	
			this._positionDropdown();
			this._resizeDropdown();
		};
	
		return AttachBody;
	});
	
	S2.define('select2/dropdown/minimumResultsForSearch',[
	
	], function () {
		function countResults (data) {
			var count = 0;
	
			for (var d = 0; d < data.length; d++) {
				var item = data[d];
	
				if (item.children) {
					count += countResults(item.children);
				} else {
					count++;
				}
			}
	
			return count;
		}
	
		function MinimumResultsForSearch (decorated, $element, options, dataAdapter) {
			this.minimumResultsForSearch = options.get('minimumResultsForSearch');
	
			if (this.minimumResultsForSearch < 0) {
				this.minimumResultsForSearch = Infinity;
			}
	
			decorated.call(this, $element, options, dataAdapter);
		}
	
		MinimumResultsForSearch.prototype.showSearch = function (decorated, params) {
			if (countResults(params.data.results) < this.minimumResultsForSearch) {
				return false;
			}
	
			return decorated.call(this, params);
		};
	
		return MinimumResultsForSearch;
	});
	
	S2.define('select2/dropdown/selectOnClose',[
	
	], function () {
		function SelectOnClose () { }
	
		SelectOnClose.prototype.bind = function (decorated, container, $container) {
			var self = this;
	
			decorated.call(this, container, $container);
	
			container.on('close', function (params) {
				self._handleSelectOnClose(params);
			});
		};
	
		SelectOnClose.prototype._handleSelectOnClose = function (_, params) {
			if (params && params.originalSelect2Event != null) {
				var event = params.originalSelect2Event;
	
				// Don't select an item if the close event was triggered from a select or
				// unselect event
				if (event._type === 'select' || event._type === 'unselect') {
					return;
				}
			}
	
			var $highlightedResults = this.getHighlightedResults();
	
			// Only select highlighted results
			if ($highlightedResults.length < 1) {
				return;
			}
	
			var data = $highlightedResults.data('data');
	
			// Don't re-select already selected resulte
			if (
				(data.element != null && data.element.selected) ||
				(data.element == null && data.selected)
			) {
				return;
			}
	
			this.trigger('select', {
					data: data
			});
		};
	
		return SelectOnClose;
	});
	
	S2.define('select2/dropdown/closeOnSelect',[
	
	], function () {
		function CloseOnSelect () { }
	
		CloseOnSelect.prototype.bind = function (decorated, container, $container) {
			var self = this;
	
			decorated.call(this, container, $container);
	
			container.on('select', function (evt) {
				self._selectTriggered(evt);
			});
	
			container.on('unselect', function (evt) {
				self._selectTriggered(evt);
			});
		};
	
		CloseOnSelect.prototype._selectTriggered = function (_, evt) {
			var originalEvent = evt.originalEvent;
	
			// Don't close if the control key is being held
			if (originalEvent && originalEvent.ctrlKey) {
				return;
			}
	
			this.trigger('close', {
				originalEvent: originalEvent,
				originalSelect2Event: evt
			});
		};
	
		return CloseOnSelect;
	});
	
	S2.define('select2/i18n/en',[],function () {
		// English
		return {
			errorLoading: function () {
				return 'The results could not be loaded.';
			},
			inputTooLong: function (args) {
				var overChars = args.input.length - args.maximum;
	
				var message = 'Please delete ' + overChars + ' character';
	
				if (overChars != 1) {
					message += 's';
				}
	
				return message;
			},
			inputTooShort: function (args) {
				var remainingChars = args.minimum - args.input.length;
	
				var message = 'Please enter ' + remainingChars + ' or more characters';
	
				return message;
			},
			loadingMore: function () {
				return 'Loading more results…';
			},
			maximumSelected: function (args) {
				var message = 'You can only select ' + args.maximum + ' item';
	
				if (args.maximum != 1) {
					message += 's';
				}
	
				return message;
			},
			noResults: function () {
				return 'No results found';
			},
			searching: function () {
				return 'Searching…';
			}
		};
	});
	
	S2.define('select2/defaults',[
		'jquery',
		'require',
	
		'./results',
	
		'./selection/single',
		'./selection/multiple',
		'./selection/placeholder',
		'./selection/allowClear',
		'./selection/search',
		'./selection/eventRelay',
	
		'./utils',
		'./translation',
		'./diacritics',
	
		'./data/select',
		'./data/array',
		'./data/ajax',
		'./data/tags',
		'./data/tokenizer',
		'./data/minimumInputLength',
		'./data/maximumInputLength',
		'./data/maximumSelectionLength',
	
		'./dropdown',
		'./dropdown/search',
		'./dropdown/hidePlaceholder',
		'./dropdown/infiniteScroll',
		'./dropdown/attachBody',
		'./dropdown/minimumResultsForSearch',
		'./dropdown/selectOnClose',
		'./dropdown/closeOnSelect',
	
		'./i18n/en'
	], function ($, require,
	
							 ResultsList,
	
							 SingleSelection, MultipleSelection, Placeholder, AllowClear,
							 SelectionSearch, EventRelay,
	
							 Utils, Translation, DIACRITICS,
	
							 SelectData, ArrayData, AjaxData, Tags, Tokenizer,
							 MinimumInputLength, MaximumInputLength, MaximumSelectionLength,
	
							 Dropdown, DropdownSearch, HidePlaceholder, InfiniteScroll,
							 AttachBody, MinimumResultsForSearch, SelectOnClose, CloseOnSelect,
	
							 EnglishTranslation) {
		function Defaults () {
			this.reset();
		}
	
		Defaults.prototype.apply = function (options) {
			options = $.extend(true, {}, this.defaults, options);
	
			if (options.dataAdapter == null) {
				if (options.ajax != null) {
					options.dataAdapter = AjaxData;
				} else if (options.data != null) {
					options.dataAdapter = ArrayData;
				} else {
					options.dataAdapter = SelectData;
				}
	
				if (options.minimumInputLength > 0) {
					options.dataAdapter = Utils.Decorate(
						options.dataAdapter,
						MinimumInputLength
					);
				}
	
				if (options.maximumInputLength > 0) {
					options.dataAdapter = Utils.Decorate(
						options.dataAdapter,
						MaximumInputLength
					);
				}
	
				if (options.maximumSelectionLength > 0) {
					options.dataAdapter = Utils.Decorate(
						options.dataAdapter,
						MaximumSelectionLength
					);
				}
	
				if (options.tags) {
					options.dataAdapter = Utils.Decorate(options.dataAdapter, Tags);
				}
	
				if (options.tokenSeparators != null || options.tokenizer != null) {
					options.dataAdapter = Utils.Decorate(
						options.dataAdapter,
						Tokenizer
					);
				}
	
				if (options.query != null) {
					var Query = require(options.amdBase + 'compat/query');
	
					options.dataAdapter = Utils.Decorate(
						options.dataAdapter,
						Query
					);
				}
	
				if (options.initSelection != null) {
					var InitSelection = require(options.amdBase + 'compat/initSelection');
	
					options.dataAdapter = Utils.Decorate(
						options.dataAdapter,
						InitSelection
					);
				}
			}
	
			if (options.resultsAdapter == null) {
				options.resultsAdapter = ResultsList;
	
				if (options.ajax != null) {
					options.resultsAdapter = Utils.Decorate(
						options.resultsAdapter,
						InfiniteScroll
					);
				}
	
				if (options.placeholder != null) {
					options.resultsAdapter = Utils.Decorate(
						options.resultsAdapter,
						HidePlaceholder
					);
				}
	
				if (options.selectOnClose) {
					options.resultsAdapter = Utils.Decorate(
						options.resultsAdapter,
						SelectOnClose
					);
				}
			}
	
			if (options.dropdownAdapter == null) {
				if (options.multiple) {
					options.dropdownAdapter = Dropdown;
				} else {
					var SearchableDropdown = Utils.Decorate(Dropdown, DropdownSearch);
	
					options.dropdownAdapter = SearchableDropdown;
				}
	
				if (options.minimumResultsForSearch !== 0) {
					options.dropdownAdapter = Utils.Decorate(
						options.dropdownAdapter,
						MinimumResultsForSearch
					);
				}
	
				if (options.closeOnSelect) {
					options.dropdownAdapter = Utils.Decorate(
						options.dropdownAdapter,
						CloseOnSelect
					);
				}
	
				if (
					options.dropdownCssClass != null ||
					options.dropdownCss != null ||
					options.adaptDropdownCssClass != null
				) {
					var DropdownCSS = require(options.amdBase + 'compat/dropdownCss');
	
					options.dropdownAdapter = Utils.Decorate(
						options.dropdownAdapter,
						DropdownCSS
					);
				}
	
				options.dropdownAdapter = Utils.Decorate(
					options.dropdownAdapter,
					AttachBody
				);
			}
	
			if (options.selectionAdapter == null) {
				if (options.multiple) {
					options.selectionAdapter = MultipleSelection;
				} else {
					options.selectionAdapter = SingleSelection;
				}
	
				// Add the placeholder mixin if a placeholder was specified
				if (options.placeholder != null) {
					options.selectionAdapter = Utils.Decorate(
						options.selectionAdapter,
						Placeholder
					);
				}
	
				if (options.allowClear) {
					options.selectionAdapter = Utils.Decorate(
						options.selectionAdapter,
						AllowClear
					);
				}
	
				if (options.multiple) {
					options.selectionAdapter = Utils.Decorate(
						options.selectionAdapter,
						SelectionSearch
					);
				}
	
				if (
					options.containerCssClass != null ||
					options.containerCss != null ||
					options.adaptContainerCssClass != null
				) {
					var ContainerCSS = require(options.amdBase + 'compat/containerCss');
	
					options.selectionAdapter = Utils.Decorate(
						options.selectionAdapter,
						ContainerCSS
					);
				}
	
				options.selectionAdapter = Utils.Decorate(
					options.selectionAdapter,
					EventRelay
				);
			}
	
			if (typeof options.language === 'string') {
				// Check if the language is specified with a region
				if (options.language.indexOf('-') > 0) {
					// Extract the region information if it is included
					var languageParts = options.language.split('-');
					var baseLanguage = languageParts[0];
	
					options.language = [options.language, baseLanguage];
				} else {
					options.language = [options.language];
				}
			}
	
			if ($.isArray(options.language)) {
				var languages = new Translation();
				options.language.push('en');
	
				var languageNames = options.language;
	
				for (var l = 0; l < languageNames.length; l++) {
					var name = languageNames[l];
					var language = {};
	
					try {
						// Try to load it with the original name
						language = Translation.loadPath(name);
					} catch (e) {
						try {
							// If we couldn't load it, check if it wasn't the full path
							name = this.defaults.amdLanguageBase + name;
							language = Translation.loadPath(name);
						} catch (ex) {
							// The translation could not be loaded at all. Sometimes this is
							// because of a configuration problem, other times this can be
							// because of how Select2 helps load all possible translation files.
							if (options.debug && window.console && console.warn) {
								console.warn(
									'Select2: The language file for "' + name + '" could not be ' +
									'automatically loaded. A fallback will be used instead.'
								);
							}
	
							continue;
						}
					}
	
					languages.extend(language);
				}
	
				options.translations = languages;
			} else {
				var baseTranslation = Translation.loadPath(
					this.defaults.amdLanguageBase + 'en'
				);
				var customTranslation = new Translation(options.language);
	
				customTranslation.extend(baseTranslation);
	
				options.translations = customTranslation;
			}
	
			return options;
		};
	
		Defaults.prototype.reset = function () {
			function stripDiacritics (text) {
				// Used 'uni range + named function' from http://jsperf.com/diacritics/18
				function match(a) {
					return DIACRITICS[a] || a;
				}
	
				return text.replace(/[^\u0000-\u007E]/g, match);
			}
	
			function matcher (params, data) {
				// Always return the object if there is nothing to compare
				if ($.trim(params.term) === '') {
					return data;
				}
	
				// Do a recursive check for options with children
				if (data.children && data.children.length > 0) {
					// Clone the data object if there are children
					// This is required as we modify the object to remove any non-matches
					var match = $.extend(true, {}, data);
	
					// Check each child of the option
					for (var c = data.children.length - 1; c >= 0; c--) {
						var child = data.children[c];
	
						var matches = matcher(params, child);
	
						// If there wasn't a match, remove the object in the array
						if (matches == null) {
							match.children.splice(c, 1);
						}
					}
	
					// If any children matched, return the new object
					if (match.children.length > 0) {
						return match;
					}
	
					// If there were no matching children, check just the plain object
					return matcher(params, match);
				}
	
				var original = stripDiacritics(data.text).toUpperCase();
				var term = stripDiacritics(params.term).toUpperCase();
	
				// Check if the text contains the term
				if (original.indexOf(term) > -1) {
					return data;
				}
	
				// If it doesn't contain the term, don't return anything
				return null;
			}
	
			this.defaults = {
				amdBase: './',
				amdLanguageBase: './i18n/',
				closeOnSelect: true,
				debug: false,
				dropdownAutoWidth: false,
				escapeMarkup: Utils.escapeMarkup,
				language: EnglishTranslation,
				matcher: matcher,
				minimumInputLength: 0,
				maximumInputLength: 0,
				maximumSelectionLength: 0,
				minimumResultsForSearch: 0,
				selectOnClose: false,
				sorter: function (data) {
					return data;
				},
				templateResult: function (result) {
					return result.text;
				},
				templateSelection: function (selection) {
					return selection.text;
				},
				theme: 'default',
				width: 'resolve'
			};
		};
	
		Defaults.prototype.set = function (key, value) {
			var camelKey = $.camelCase(key);
	
			var data = {};
			data[camelKey] = value;
	
			var convertedData = Utils._convertData(data);
	
			$.extend(this.defaults, convertedData);
		};
	
		var defaults = new Defaults();
	
		return defaults;
	});
	
	S2.define('select2/options',[
		'require',
		'jquery',
		'./defaults',
		'./utils'
	], function (require, $, Defaults, Utils) {
		function Options (options, $element) {
			this.options = options;
	
			if ($element != null) {
				this.fromElement($element);
			}
	
			this.options = Defaults.apply(this.options);
	
			if ($element && $element.is('input')) {
				var InputCompat = require(this.get('amdBase') + 'compat/inputData');
	
				this.options.dataAdapter = Utils.Decorate(
					this.options.dataAdapter,
					InputCompat
				);
			}
		}
	
		Options.prototype.fromElement = function ($e) {
			var excludedData = ['select2'];
	
			if (this.options.multiple == null) {
				this.options.multiple = $e.prop('multiple');
			}
	
			if (this.options.disabled == null) {
				this.options.disabled = $e.prop('disabled');
			}
	
			if (this.options.language == null) {
				if ($e.prop('lang')) {
					this.options.language = $e.prop('lang').toLowerCase();
				} else if ($e.closest('[lang]').prop('lang')) {
					this.options.language = $e.closest('[lang]').prop('lang');
				}
			}
	
			if (this.options.dir == null) {
				if ($e.prop('dir')) {
					this.options.dir = $e.prop('dir');
				} else if ($e.closest('[dir]').prop('dir')) {
					this.options.dir = $e.closest('[dir]').prop('dir');
				} else {
					this.options.dir = 'ltr';
				}
			}
	
			$e.prop('disabled', this.options.disabled);
			$e.prop('multiple', this.options.multiple);
	
			if ($e.data('select2Tags')) {
				if (this.options.debug && window.console && console.warn) {
					console.warn(
						'Select2: The `data-select2-tags` attribute has been changed to ' +
						'use the `data-data` and `data-tags="true"` attributes and will be ' +
						'removed in future versions of Select2.'
					);
				}
	
				$e.data('data', $e.data('select2Tags'));
				$e.data('tags', true);
			}
	
			if ($e.data('ajaxUrl')) {
				if (this.options.debug && window.console && console.warn) {
					console.warn(
						'Select2: The `data-ajax-url` attribute has been changed to ' +
						'`data-ajax--url` and support for the old attribute will be removed' +
						' in future versions of Select2.'
					);
				}
	
				$e.attr('ajax--url', $e.data('ajaxUrl'));
				$e.data('ajax--url', $e.data('ajaxUrl'));
			}
	
			var dataset = {};
	
			// Prefer the element's `dataset` attribute if it exists
			// jQuery 1.x does not correctly handle data attributes with multiple dashes
			if ($.fn.jquery && $.fn.jquery.substr(0, 2) == '1.' && $e[0].dataset) {
				dataset = $.extend(true, {}, $e[0].dataset, $e.data());
			} else {
				dataset = $e.data();
			}
	
			var data = $.extend(true, {}, dataset);
	
			data = Utils._convertData(data);
	
			for (var key in data) {
				if ($.inArray(key, excludedData) > -1) {
					continue;
				}
	
				if ($.isPlainObject(this.options[key])) {
					$.extend(this.options[key], data[key]);
				} else {
					this.options[key] = data[key];
				}
			}
	
			return this;
		};
	
		Options.prototype.get = function (key) {
			return this.options[key];
		};
	
		Options.prototype.set = function (key, val) {
			this.options[key] = val;
		};
	
		return Options;
	});
	
	S2.define('select2/core',[
		'jquery',
		'./options',
		'./utils',
		'./keys'
	], function ($, Options, Utils, KEYS) {
		var Select2 = function ($element, options) {
			if ($element.data('select2') != null) {
				$element.data('select2').destroy();
			}
	
			this.$element = $element;
	
			this.id = this._generateId($element);
	
			options = options || {};
	
			this.options = new Options(options, $element);
	
			Select2.__super__.constructor.call(this);
	
			// Set up the tabindex
	
			var tabindex = $element.attr('tabindex') || 0;
			$element.data('old-tabindex', tabindex);
			$element.attr('tabindex', '-1');
	
			// Set up containers and adapters
	
			var DataAdapter = this.options.get('dataAdapter');
			this.dataAdapter = new DataAdapter($element, this.options);
	
			var $container = this.render();
	
			this._placeContainer($container);
	
			var SelectionAdapter = this.options.get('selectionAdapter');
			this.selection = new SelectionAdapter($element, this.options);
			this.$selection = this.selection.render();
	
			this.selection.position(this.$selection, $container);
	
			var DropdownAdapter = this.options.get('dropdownAdapter');
			this.dropdown = new DropdownAdapter($element, this.options);
			this.$dropdown = this.dropdown.render();
	
			this.dropdown.position(this.$dropdown, $container);
	
			var ResultsAdapter = this.options.get('resultsAdapter');
			this.results = new ResultsAdapter($element, this.options, this.dataAdapter);
			this.$results = this.results.render();
	
			this.results.position(this.$results, this.$dropdown);
	
			// Bind events
	
			var self = this;
	
			// Bind the container to all of the adapters
			this._bindAdapters();
	
			// Register any DOM event handlers
			this._registerDomEvents();
	
			// Register any internal event handlers
			this._registerDataEvents();
			this._registerSelectionEvents();
			this._registerDropdownEvents();
			this._registerResultsEvents();
			this._registerEvents();
	
			// Set the initial state
			this.dataAdapter.current(function (initialData) {
				self.trigger('selection:update', {
					data: initialData
				});
			});
	
			// Hide the original select
			$element.addClass('select2-hidden-accessible');
			$element.attr('aria-hidden', 'true');
	
			// Synchronize any monitored attributes
			this._syncAttributes();
	
			$element.data('select2', this);
		};
	
		Utils.Extend(Select2, Utils.Observable);
	
		Select2.prototype._generateId = function ($element) {
			var id = '';
	
			if ($element.attr('id') != null) {
				id = $element.attr('id');
			} else if ($element.attr('name') != null) {
				id = $element.attr('name') + '-' + Utils.generateChars(2);
			} else {
				id = Utils.generateChars(4);
			}
	
			id = id.replace(/(:|\.|\[|\]|,)/g, '');
			id = 'select2-' + id;
	
			return id;
		};
	
		Select2.prototype._placeContainer = function ($container) {
			$container.insertAfter(this.$element);
	
			var width = this._resolveWidth(this.$element, this.options.get('width'));
	
			if (width != null) {
				$container.css('width', width);
			}
		};
	
		Select2.prototype._resolveWidth = function ($element, method) {
			var WIDTH = /^width:(([-+]?([0-9]*\.)?[0-9]+)(px|em|ex|%|in|cm|mm|pt|pc))/i;
	
			if (method == 'resolve') {
				var styleWidth = this._resolveWidth($element, 'style');
	
				if (styleWidth != null) {
					return styleWidth;
				}
	
				return this._resolveWidth($element, 'element');
			}
	
			if (method == 'element') {
				var elementWidth = $element.outerWidth(false);
	
				if (elementWidth <= 0) {
					return 'auto';
				}
	
				return elementWidth + 'px';
			}
	
			if (method == 'style') {
				var style = $element.attr('style');
	
				if (typeof(style) !== 'string') {
					return null;
				}
	
				var attrs = style.split(';');
	
				for (var i = 0, l = attrs.length; i < l; i = i + 1) {
					var attr = attrs[i].replace(/\s/g, '');
					var matches = attr.match(WIDTH);
	
					if (matches !== null && matches.length >= 1) {
						return matches[1];
					}
				}
	
				return null;
			}
	
			return method;
		};
	
		Select2.prototype._bindAdapters = function () {
			this.dataAdapter.bind(this, this.$container);
			this.selection.bind(this, this.$container);
	
			this.dropdown.bind(this, this.$container);
			this.results.bind(this, this.$container);
		};
	
		Select2.prototype._registerDomEvents = function () {
			var self = this;
	
			this.$element.on('change.select2', function () {
				self.dataAdapter.current(function (data) {
					self.trigger('selection:update', {
						data: data
					});
				});
			});
	
			this.$element.on('focus.select2', function (evt) {
				self.trigger('focus', evt);
			});
	
			this._syncA = Utils.bind(this._syncAttributes, this);
			this._syncS = Utils.bind(this._syncSubtree, this);
	
			if (this.$element[0].attachEvent) {
				this.$element[0].attachEvent('onpropertychange', this._syncA);
			}
	
			var observer = window.MutationObserver ||
				window.WebKitMutationObserver ||
				window.MozMutationObserver
			;
	
			if (observer != null) {
				this._observer = new observer(function (mutations) {
					$.each(mutations, self._syncA);
					$.each(mutations, self._syncS);
				});
				this._observer.observe(this.$element[0], {
					attributes: true,
					childList: true,
					subtree: false
				});
			} else if (this.$element[0].addEventListener) {
				this.$element[0].addEventListener(
					'DOMAttrModified',
					self._syncA,
					false
				);
				this.$element[0].addEventListener(
					'DOMNodeInserted',
					self._syncS,
					false
				);
				this.$element[0].addEventListener(
					'DOMNodeRemoved',
					self._syncS,
					false
				);
			}
		};
	
		Select2.prototype._registerDataEvents = function () {
			var self = this;
	
			this.dataAdapter.on('*', function (name, params) {
				self.trigger(name, params);
			});
		};
	
		Select2.prototype._registerSelectionEvents = function () {
			var self = this;
			var nonRelayEvents = ['toggle', 'focus'];
	
			this.selection.on('toggle', function () {
				self.toggleDropdown();
			});
	
			this.selection.on('focus', function (params) {
				self.focus(params);
			});
	
			this.selection.on('*', function (name, params) {
				if ($.inArray(name, nonRelayEvents) !== -1) {
					return;
				}
	
				self.trigger(name, params);
			});
		};
	
		Select2.prototype._registerDropdownEvents = function () {
			var self = this;
	
			this.dropdown.on('*', function (name, params) {
				self.trigger(name, params);
			});
		};
	
		Select2.prototype._registerResultsEvents = function () {
			var self = this;
	
			this.results.on('*', function (name, params) {
				self.trigger(name, params);
			});
		};
	
		Select2.prototype._registerEvents = function () {
			var self = this;
	
			this.on('open', function () {
				self.$container.addClass('select2-container--open');
			});
	
			this.on('close', function () {
				self.$container.removeClass('select2-container--open');
			});
	
			this.on('enable', function () {
				self.$container.removeClass('select2-container--disabled');
			});
	
			this.on('disable', function () {
				self.$container.addClass('select2-container--disabled');
			});
	
			this.on('blur', function () {
				self.$container.removeClass('select2-container--focus');
			});
	
			this.on('query', function (params) {
				if (!self.isOpen()) {
					self.trigger('open', {});
				}
	
				this.dataAdapter.query(params, function (data) {
					self.trigger('results:all', {
						data: data,
						query: params
					});
				});
			});
	
			this.on('query:append', function (params) {
				this.dataAdapter.query(params, function (data) {
					self.trigger('results:append', {
						data: data,
						query: params
					});
				});
			});
	
			this.on('open', function(){
				// Focus on the active element when opening dropdown.
				// Needs 1 ms delay because of other 1 ms setTimeouts when rendering.
				setTimeout(function(){
					self.focusOnActiveElement();
				}, 1);
			});
	
			$(document).on('keydown', function (evt) {
				var key = evt.which;
				if (self.isOpen()) {
					if (key === KEYS.ESC || (key === KEYS.UP && evt.altKey)) {
						self.close();
	
						evt.preventDefault();
					} else if (key === KEYS.ENTER || key === KEYS.TAB) {
						self.trigger('results:select', {});
	
						evt.preventDefault();
					} else if ((key === KEYS.SPACE && evt.ctrlKey)) {
						self.trigger('results:toggle', {});
	
						evt.preventDefault();
					} else if (key === KEYS.UP) {
						self.trigger('results:previous', {});
	
						evt.preventDefault();
					} else if (key === KEYS.DOWN) {
						self.trigger('results:next', {});
	
						evt.preventDefault();
					}
	
					var $searchField = self.$dropdown.find('.select2-search__field');
					if (! $searchField.length) {
						$searchField = self.$container.find('.select2-search__field');
					}
	
					// Move the focus to the selected element on keyboard navigation.
					// Required for screen readers to work properly.
					if (key === KEYS.DOWN || key === KEYS.UP) {
							self.focusOnActiveElement();
					} else {
						// Focus on the search if user starts typing.
						$searchField.focus();
						// Focus back to active selection when finished typing.
						// Small delay so typed character can be read by screen reader.
						setTimeout(function(){
								self.focusOnActiveElement();
						}, 1000);
					}
				} else if (self.hasFocus()) {
					if (key === KEYS.ENTER || key === KEYS.SPACE ||
							key === KEYS.DOWN) {
						self.open();
						evt.preventDefault();
					}
				}
			});
		};
	
		Select2.prototype.focusOnActiveElement = function () {
			// Don't mess with the focus on touchscreens because it causes havoc with on-screen keyboards.
			if (this.isOpen() && ! Utils.isTouchscreen()) {
				this.$results.find('li.select2-results__option--highlighted').focus();
			}
		};
	
		Select2.prototype._syncAttributes = function () {
			this.options.set('disabled', this.$element.prop('disabled'));
	
			if (this.options.get('disabled')) {
				if (this.isOpen()) {
					this.close();
				}
	
				this.trigger('disable', {});
			} else {
				this.trigger('enable', {});
			}
		};
	
		Select2.prototype._syncSubtree = function (evt, mutations) {
			var changed = false;
			var self = this;
	
			// Ignore any mutation events raised for elements that aren't options or
			// optgroups. This handles the case when the select element is destroyed
			if (
				evt && evt.target && (
					evt.target.nodeName !== 'OPTION' && evt.target.nodeName !== 'OPTGROUP'
				)
			) {
				return;
			}
	
			if (!mutations) {
				// If mutation events aren't supported, then we can only assume that the
				// change affected the selections
				changed = true;
			} else if (mutations.addedNodes && mutations.addedNodes.length > 0) {
				for (var n = 0; n < mutations.addedNodes.length; n++) {
					var node = mutations.addedNodes[n];
	
					if (node.selected) {
						changed = true;
					}
				}
			} else if (mutations.removedNodes && mutations.removedNodes.length > 0) {
				changed = true;
			}
	
			// Only re-pull the data if we think there is a change
			if (changed) {
				this.dataAdapter.current(function (currentData) {
					self.trigger('selection:update', {
						data: currentData
					});
				});
			}
		};
	
		/**
		 * Override the trigger method to automatically trigger pre-events when
		 * there are events that can be prevented.
		 */
		Select2.prototype.trigger = function (name, args) {
			var actualTrigger = Select2.__super__.trigger;
			var preTriggerMap = {
				'open': 'opening',
				'close': 'closing',
				'select': 'selecting',
				'unselect': 'unselecting'
			};
	
			if (args === undefined) {
				args = {};
			}
	
			if (name in preTriggerMap) {
				var preTriggerName = preTriggerMap[name];
				var preTriggerArgs = {
					prevented: false,
					name: name,
					args: args
				};
	
				actualTrigger.call(this, preTriggerName, preTriggerArgs);
	
				if (preTriggerArgs.prevented) {
					args.prevented = true;
	
					return;
				}
			}
	
			actualTrigger.call(this, name, args);
		};
	
		Select2.prototype.toggleDropdown = function () {
			if (this.options.get('disabled')) {
				return;
			}
	
			if (this.isOpen()) {
				this.close();
			} else {
				this.open();
			}
		};
	
		Select2.prototype.open = function () {
			if (this.isOpen()) {
				return;
			}
	
			this.trigger('query', {});
		};
	
		Select2.prototype.close = function () {
			if (!this.isOpen()) {
				return;
			}
	
			this.trigger('close', {});
		};
	
		Select2.prototype.isOpen = function () {
			return this.$container.hasClass('select2-container--open');
		};
	
		Select2.prototype.hasFocus = function () {
			return this.$container.hasClass('select2-container--focus');
		};
	
		Select2.prototype.focus = function (data) {
			// No need to re-trigger focus events if we are already focused
			if (this.hasFocus()) {
				return;
			}
	
			this.$container.addClass('select2-container--focus');
			this.trigger('focus', {});
		};
	
		Select2.prototype.enable = function (args) {
			if (this.options.get('debug') && window.console && console.warn) {
				console.warn(
					'Select2: The `select2("enable")` method has been deprecated and will' +
					' be removed in later Select2 versions. Use $element.prop("disabled")' +
					' instead.'
				);
			}
	
			if (args == null || args.length === 0) {
				args = [true];
			}
	
			var disabled = !args[0];
	
			this.$element.prop('disabled', disabled);
		};
	
		Select2.prototype.data = function () {
			if (this.options.get('debug') &&
					arguments.length > 0 && window.console && console.warn) {
				console.warn(
					'Select2: Data can no longer be set using `select2("data")`. You ' +
					'should consider setting the value instead using `$element.val()`.'
				);
			}
	
			var data = [];
	
			this.dataAdapter.current(function (currentData) {
				data = currentData;
			});
	
			return data;
		};
	
		Select2.prototype.val = function (args) {
			if (this.options.get('debug') && window.console && console.warn) {
				console.warn(
					'Select2: The `select2("val")` method has been deprecated and will be' +
					' removed in later Select2 versions. Use $element.val() instead.'
				);
			}
	
			if (args == null || args.length === 0) {
				return this.$element.val();
			}
	
			var newVal = args[0];
	
			if ($.isArray(newVal)) {
				newVal = $.map(newVal, function (obj) {
					return obj.toString();
				});
			}
	
			this.$element.val(newVal).trigger('change');
		};
	
		Select2.prototype.destroy = function () {
			this.$container.remove();
	
			if (this.$element[0].detachEvent) {
				this.$element[0].detachEvent('onpropertychange', this._syncA);
			}
	
			if (this._observer != null) {
				this._observer.disconnect();
				this._observer = null;
			} else if (this.$element[0].removeEventListener) {
				this.$element[0]
					.removeEventListener('DOMAttrModified', this._syncA, false);
				this.$element[0]
					.removeEventListener('DOMNodeInserted', this._syncS, false);
				this.$element[0]
					.removeEventListener('DOMNodeRemoved', this._syncS, false);
			}
	
			this._syncA = null;
			this._syncS = null;
	
			this.$element.off('.select2');
			this.$element.attr('tabindex', this.$element.data('old-tabindex'));
	
			this.$element.removeClass('select2-hidden-accessible');
			this.$element.attr('aria-hidden', 'false');
			this.$element.removeData('select2');
	
			this.dataAdapter.destroy();
			this.selection.destroy();
			this.dropdown.destroy();
			this.results.destroy();
	
			this.dataAdapter = null;
			this.selection = null;
			this.dropdown = null;
			this.results = null;
		};
	
		Select2.prototype.render = function () {
			var $container = $(
				'<span class="select2 select2-container">' +
					'<span class="selection"></span>' +
					'<span class="dropdown-wrapper" aria-hidden="true"></span>' +
				'</span>'
			);
	
			$container.attr('dir', this.options.get('dir'));
	
			this.$container = $container;
	
			this.$container.addClass('select2-container--' + this.options.get('theme'));
	
			$container.data('element', this.$element);
	
			return $container;
		};
	
		return Select2;
	});
	
	S2.define('select2/compat/utils',[
		'jquery'
	], function ($) {
		function syncCssClasses ($dest, $src, adapter) {
			var classes, replacements = [], adapted;
	
			classes = $.trim($dest.attr('class'));
	
			if (classes) {
				classes = '' + classes; // for IE which returns object
	
				$(classes.split(/\s+/)).each(function () {
					// Save all Select2 classes
					if (this.indexOf('select2-') === 0) {
						replacements.push(this);
					}
				});
			}
	
			classes = $.trim($src.attr('class'));
	
			if (classes) {
				classes = '' + classes; // for IE which returns object
	
				$(classes.split(/\s+/)).each(function () {
					// Only adapt non-Select2 classes
					if (this.indexOf('select2-') !== 0) {
						adapted = adapter(this);
	
						if (adapted != null) {
							replacements.push(adapted);
						}
					}
				});
			}
	
			$dest.attr('class', replacements.join(' '));
		}
	
		return {
			syncCssClasses: syncCssClasses
		};
	});
	
	S2.define('select2/compat/containerCss',[
		'jquery',
		'./utils'
	], function ($, CompatUtils) {
		// No-op CSS adapter that discards all classes by default
		function _containerAdapter (clazz) {
			return null;
		}
	
		function ContainerCSS () { }
	
		ContainerCSS.prototype.render = function (decorated) {
			var $container = decorated.call(this);
	
			var containerCssClass = this.options.get('containerCssClass') || '';
	
			if ($.isFunction(containerCssClass)) {
				containerCssClass = containerCssClass(this.$element);
			}
	
			var containerCssAdapter = this.options.get('adaptContainerCssClass');
			containerCssAdapter = containerCssAdapter || _containerAdapter;
	
			if (containerCssClass.indexOf(':all:') !== -1) {
				containerCssClass = containerCssClass.replace(':all:', '');
	
				var _cssAdapter = containerCssAdapter;
	
				containerCssAdapter = function (clazz) {
					var adapted = _cssAdapter(clazz);
	
					if (adapted != null) {
						// Append the old one along with the adapted one
						return adapted + ' ' + clazz;
					}
	
					return clazz;
				};
			}
	
			var containerCss = this.options.get('containerCss') || {};
	
			if ($.isFunction(containerCss)) {
				containerCss = containerCss(this.$element);
			}
	
			CompatUtils.syncCssClasses($container, this.$element, containerCssAdapter);
	
			$container.css(containerCss);
			$container.addClass(containerCssClass);
	
			return $container;
		};
	
		return ContainerCSS;
	});
	
	S2.define('select2/compat/dropdownCss',[
		'jquery',
		'./utils'
	], function ($, CompatUtils) {
		// No-op CSS adapter that discards all classes by default
		function _dropdownAdapter (clazz) {
			return null;
		}
	
		function DropdownCSS () { }
	
		DropdownCSS.prototype.render = function (decorated) {
			var $dropdown = decorated.call(this);
	
			var dropdownCssClass = this.options.get('dropdownCssClass') || '';
	
			if ($.isFunction(dropdownCssClass)) {
				dropdownCssClass = dropdownCssClass(this.$element);
			}
	
			var dropdownCssAdapter = this.options.get('adaptDropdownCssClass');
			dropdownCssAdapter = dropdownCssAdapter || _dropdownAdapter;
	
			if (dropdownCssClass.indexOf(':all:') !== -1) {
				dropdownCssClass = dropdownCssClass.replace(':all:', '');
	
				var _cssAdapter = dropdownCssAdapter;
	
				dropdownCssAdapter = function (clazz) {
					var adapted = _cssAdapter(clazz);
	
					if (adapted != null) {
						// Append the old one along with the adapted one
						return adapted + ' ' + clazz;
					}
	
					return clazz;
				};
			}
	
			var dropdownCss = this.options.get('dropdownCss') || {};
	
			if ($.isFunction(dropdownCss)) {
				dropdownCss = dropdownCss(this.$element);
			}
	
			CompatUtils.syncCssClasses($dropdown, this.$element, dropdownCssAdapter);
	
			$dropdown.css(dropdownCss);
			$dropdown.addClass(dropdownCssClass);
	
			return $dropdown;
		};
	
		return DropdownCSS;
	});
	
	S2.define('select2/compat/initSelection',[
		'jquery'
	], function ($) {
		function InitSelection (decorated, $element, options) {
			if (options.get('debug') && window.console && console.warn) {
				console.warn(
					'Select2: The `initSelection` option has been deprecated in favor' +
					' of a custom data adapter that overrides the `current` method. ' +
					'This method is now called multiple times instead of a single ' +
					'time when the instance is initialized. Support will be removed ' +
					'for the `initSelection` option in future versions of Select2'
				);
			}
	
			this.initSelection = options.get('initSelection');
			this._isInitialized = false;
	
			decorated.call(this, $element, options);
		}
	
		InitSelection.prototype.current = function (decorated, callback) {
			var self = this;
	
			if (this._isInitialized) {
				decorated.call(this, callback);
	
				return;
			}
	
			this.initSelection.call(null, this.$element, function (data) {
				self._isInitialized = true;
	
				if (!$.isArray(data)) {
					data = [data];
				}
	
				callback(data);
			});
		};
	
		return InitSelection;
	});
	
	S2.define('select2/compat/inputData',[
		'jquery'
	], function ($) {
		function InputData (decorated, $element, options) {
			this._currentData = [];
			this._valueSeparator = options.get('valueSeparator') || ',';
	
			if ($element.prop('type') === 'hidden') {
				if (options.get('debug') && console && console.warn) {
					console.warn(
						'Select2: Using a hidden input with Select2 is no longer ' +
						'supported and may stop working in the future. It is recommended ' +
						'to use a `<select>` element instead.'
					);
				}
			}
	
			decorated.call(this, $element, options);
		}
	
		InputData.prototype.current = function (_, callback) {
			function getSelected (data, selectedIds) {
				var selected = [];
	
				if (data.selected || $.inArray(data.id, selectedIds) !== -1) {
					data.selected = true;
					selected.push(data);
				} else {
					data.selected = false;
				}
	
				if (data.children) {
					selected.push.apply(selected, getSelected(data.children, selectedIds));
				}
	
				return selected;
			}
	
			var selected = [];
	
			for (var d = 0; d < this._currentData.length; d++) {
				var data = this._currentData[d];
	
				selected.push.apply(
					selected,
					getSelected(
						data,
						this.$element.val().split(
							this._valueSeparator
						)
					)
				);
			}
	
			callback(selected);
		};
	
		InputData.prototype.select = function (_, data) {
			if (!this.options.get('multiple')) {
				this.current(function (allData) {
					$.map(allData, function (data) {
						data.selected = false;
					});
				});
	
				this.$element.val(data.id);
				this.$element.trigger('change');
			} else {
				var value = this.$element.val();
				value += this._valueSeparator + data.id;
	
				this.$element.val(value);
				this.$element.trigger('change');
			}
		};
	
		InputData.prototype.unselect = function (_, data) {
			var self = this;
	
			data.selected = false;
	
			this.current(function (allData) {
				var values = [];
	
				for (var d = 0; d < allData.length; d++) {
					var item = allData[d];
	
					if (data.id == item.id) {
						continue;
					}
	
					values.push(item.id);
				}
	
				self.$element.val(values.join(self._valueSeparator));
				self.$element.trigger('change');
			});
		};
	
		InputData.prototype.query = function (_, params, callback) {
			var results = [];
	
			for (var d = 0; d < this._currentData.length; d++) {
				var data = this._currentData[d];
	
				var matches = this.matches(params, data);
	
				if (matches !== null) {
					results.push(matches);
				}
			}
	
			callback({
				results: results
			});
		};
	
		InputData.prototype.addOptions = function (_, $options) {
			var options = $.map($options, function ($option) {
				return $.data($option[0], 'data');
			});
	
			this._currentData.push.apply(this._currentData, options);
		};
	
		return InputData;
	});
	
	S2.define('select2/compat/matcher',[
		'jquery'
	], function ($) {
		function oldMatcher (matcher) {
			function wrappedMatcher (params, data) {
				var match = $.extend(true, {}, data);
	
				if (params.term == null || $.trim(params.term) === '') {
					return match;
				}
	
				if (data.children) {
					for (var c = data.children.length - 1; c >= 0; c--) {
						var child = data.children[c];
	
						// Check if the child object matches
						// The old matcher returned a boolean true or false
						var doesMatch = matcher(params.term, child.text, child);
	
						// If the child didn't match, pop it off
						if (!doesMatch) {
							match.children.splice(c, 1);
						}
					}
	
					if (match.children.length > 0) {
						return match;
					}
				}
	
				if (matcher(params.term, data.text, data)) {
					return match;
				}
	
				return null;
			}
	
			return wrappedMatcher;
		}
	
		return oldMatcher;
	});
	
	S2.define('select2/compat/query',[
	
	], function () {
		function Query (decorated, $element, options) {
			if (options.get('debug') && window.console && console.warn) {
				console.warn(
					'Select2: The `query` option has been deprecated in favor of a ' +
					'custom data adapter that overrides the `query` method. Support ' +
					'will be removed for the `query` option in future versions of ' +
					'Select2.'
				);
			}
	
			decorated.call(this, $element, options);
		}
	
		Query.prototype.query = function (_, params, callback) {
			params.callback = callback;
	
			var query = this.options.get('query');
	
			query.call(null, params);
		};
	
		return Query;
	});
	
	S2.define('select2/dropdown/attachContainer',[
	
	], function () {
		function AttachContainer (decorated, $element, options) {
			decorated.call(this, $element, options);
		}
	
		AttachContainer.prototype.position =
			function (decorated, $dropdown, $container) {
			var $dropdownContainer = $container.find('.dropdown-wrapper');
			$dropdownContainer.append($dropdown);
	
			$dropdown.addClass('select2-dropdown--below');
			$container.addClass('select2-container--below');
		};
	
		return AttachContainer;
	});
	
	S2.define('select2/dropdown/stopPropagation',[
	
	], function () {
		function StopPropagation () { }
	
		StopPropagation.prototype.bind = function (decorated, container, $container) {
			decorated.call(this, container, $container);
	
			var stoppedEvents = [
			'blur',
			'change',
			'click',
			'dblclick',
			'focus',
			'focusin',
			'focusout',
			'input',
			'keydown',
			'keyup',
			'keypress',
			'mousedown',
			'mouseenter',
			'mouseleave',
			'mousemove',
			'mouseover',
			'mouseup',
			'search',
			'touchend',
			'touchstart'
			];
	
			this.$dropdown.on(stoppedEvents.join(' '), function (evt) {
				evt.stopPropagation();
			});
		};
	
		return StopPropagation;
	});
	
	S2.define('select2/selection/stopPropagation',[
	
	], function () {
		function StopPropagation () { }
	
		StopPropagation.prototype.bind = function (decorated, container, $container) {
			decorated.call(this, container, $container);
	
			var stoppedEvents = [
				'blur',
				'change',
				'click',
				'dblclick',
				'focus',
				'focusin',
				'focusout',
				'input',
				'keydown',
				'keyup',
				'keypress',
				'mousedown',
				'mouseenter',
				'mouseleave',
				'mousemove',
				'mouseover',
				'mouseup',
				'search',
				'touchend',
				'touchstart'
			];
	
			this.$selection.on(stoppedEvents.join(' '), function (evt) {
				evt.stopPropagation();
			});
		};
	
		return StopPropagation;
	});
	
	/*!
	 * jQuery Mousewheel 3.1.13
	 *
	 * Copyright jQuery Foundation and other contributors
	 * Released under the MIT license
	 * http://jquery.org/license
	 */
	
	(function (factory) {
			if ( typeof S2.define === 'function' && S2.define.amd ) {
					// AMD. Register as an anonymous module.
					S2.define('jquery-mousewheel',['jquery'], factory);
			} else if (typeof exports === 'object') {
					// Node/CommonJS style for Browserify
					module.exports = factory;
			} else {
					// Browser globals
					factory(jQuery);
			}
	}(function ($) {
	
			var toFix  = ['wheel', 'mousewheel', 'DOMMouseScroll', 'MozMousePixelScroll'],
					toBind = ( 'onwheel' in document || document.documentMode >= 9 ) ?
											['wheel'] : ['mousewheel', 'DomMouseScroll', 'MozMousePixelScroll'],
					slice  = Array.prototype.slice,
					nullLowestDeltaTimeout, lowestDelta;
	
			if ( $.event.fixHooks ) {
					for ( var i = toFix.length; i; ) {
							$.event.fixHooks[ toFix[--i] ] = $.event.mouseHooks;
					}
			}
	
			var special = $.event.special.mousewheel = {
					version: '3.1.12',
	
					setup: function() {
							if ( this.addEventListener ) {
									for ( var i = toBind.length; i; ) {
											this.addEventListener( toBind[--i], handler, false );
									}
							} else {
									this.onmousewheel = handler;
							}
							// Store the line height and page height for this particular element
							$.data(this, 'mousewheel-line-height', special.getLineHeight(this));
							$.data(this, 'mousewheel-page-height', special.getPageHeight(this));
					},
	
					teardown: function() {
							if ( this.removeEventListener ) {
									for ( var i = toBind.length; i; ) {
											this.removeEventListener( toBind[--i], handler, false );
									}
							} else {
									this.onmousewheel = null;
							}
							// Clean up the data we added to the element
							$.removeData(this, 'mousewheel-line-height');
							$.removeData(this, 'mousewheel-page-height');
					},
	
					getLineHeight: function(elem) {
							var $elem = $(elem),
									$parent = $elem['offsetParent' in $.fn ? 'offsetParent' : 'parent']();
							if (!$parent.length) {
									$parent = $('body');
							}
							return parseInt($parent.css('fontSize'), 10) || parseInt($elem.css('fontSize'), 10) || 16;
					},
	
					getPageHeight: function(elem) {
							return $(elem).height();
					},
	
					settings: {
							adjustOldDeltas: true, // see shouldAdjustOldDeltas() below
							normalizeOffset: true  // calls getBoundingClientRect for each event
					}
			};
	
			$.fn.extend({
					mousewheel: function(fn) {
							return fn ? this.bind('mousewheel', fn) : this.trigger('mousewheel');
					},
	
					unmousewheel: function(fn) {
							return this.unbind('mousewheel', fn);
					}
			});
	
	
			function handler(event) {
					var orgEvent   = event || window.event,
							args       = slice.call(arguments, 1),
							delta      = 0,
							deltaX     = 0,
							deltaY     = 0,
							absDelta   = 0,
							offsetX    = 0,
							offsetY    = 0;
					event = $.event.fix(orgEvent);
					event.type = 'mousewheel';
	
					// Old school scrollwheel delta
					if ( 'detail'      in orgEvent ) { deltaY = orgEvent.detail * -1;      }
					if ( 'wheelDelta'  in orgEvent ) { deltaY = orgEvent.wheelDelta;       }
					if ( 'wheelDeltaY' in orgEvent ) { deltaY = orgEvent.wheelDeltaY;      }
					if ( 'wheelDeltaX' in orgEvent ) { deltaX = orgEvent.wheelDeltaX * -1; }
	
					// Firefox < 17 horizontal scrolling related to DOMMouseScroll event
					if ( 'axis' in orgEvent && orgEvent.axis === orgEvent.HORIZONTAL_AXIS ) {
							deltaX = deltaY * -1;
							deltaY = 0;
					}
	
					// Set delta to be deltaY or deltaX if deltaY is 0 for backwards compatabilitiy
					delta = deltaY === 0 ? deltaX : deltaY;
	
					// New school wheel delta (wheel event)
					if ( 'deltaY' in orgEvent ) {
							deltaY = orgEvent.deltaY * -1;
							delta  = deltaY;
					}
					if ( 'deltaX' in orgEvent ) {
							deltaX = orgEvent.deltaX;
							if ( deltaY === 0 ) { delta  = deltaX * -1; }
					}
	
					// No change actually happened, no reason to go any further
					if ( deltaY === 0 && deltaX === 0 ) { return; }
	
					// Need to convert lines and pages to pixels if we aren't already in pixels
					// There are three delta modes:
					//   * deltaMode 0 is by pixels, nothing to do
					//   * deltaMode 1 is by lines
					//   * deltaMode 2 is by pages
					if ( orgEvent.deltaMode === 1 ) {
							var lineHeight = $.data(this, 'mousewheel-line-height');
							delta  *= lineHeight;
							deltaY *= lineHeight;
							deltaX *= lineHeight;
					} else if ( orgEvent.deltaMode === 2 ) {
							var pageHeight = $.data(this, 'mousewheel-page-height');
							delta  *= pageHeight;
							deltaY *= pageHeight;
							deltaX *= pageHeight;
					}
	
					// Store lowest absolute delta to normalize the delta values
					absDelta = Math.max( Math.abs(deltaY), Math.abs(deltaX) );
	
					if ( !lowestDelta || absDelta < lowestDelta ) {
							lowestDelta = absDelta;
	
							// Adjust older deltas if necessary
							if ( shouldAdjustOldDeltas(orgEvent, absDelta) ) {
									lowestDelta /= 40;
							}
					}
	
					// Adjust older deltas if necessary
					if ( shouldAdjustOldDeltas(orgEvent, absDelta) ) {
							// Divide all the things by 40!
							delta  /= 40;
							deltaX /= 40;
							deltaY /= 40;
					}
	
					// Get a whole, normalized value for the deltas
					delta  = Math[ delta  >= 1 ? 'floor' : 'ceil' ](delta  / lowestDelta);
					deltaX = Math[ deltaX >= 1 ? 'floor' : 'ceil' ](deltaX / lowestDelta);
					deltaY = Math[ deltaY >= 1 ? 'floor' : 'ceil' ](deltaY / lowestDelta);
	
					// Normalise offsetX and offsetY properties
					if ( special.settings.normalizeOffset && this.getBoundingClientRect ) {
							var boundingRect = this.getBoundingClientRect();
							offsetX = event.clientX - boundingRect.left;
							offsetY = event.clientY - boundingRect.top;
					}
	
					// Add information to the event object
					event.deltaX = deltaX;
					event.deltaY = deltaY;
					event.deltaFactor = lowestDelta;
					event.offsetX = offsetX;
					event.offsetY = offsetY;
					// Go ahead and set deltaMode to 0 since we converted to pixels
					// Although this is a little odd since we overwrite the deltaX/Y
					// properties with normalized deltas.
					event.deltaMode = 0;
	
					// Add event and delta to the front of the arguments
					args.unshift(event, delta, deltaX, deltaY);
	
					// Clearout lowestDelta after sometime to better
					// handle multiple device types that give different
					// a different lowestDelta
					// Ex: trackpad = 3 and mouse wheel = 120
					if (nullLowestDeltaTimeout) { clearTimeout(nullLowestDeltaTimeout); }
					nullLowestDeltaTimeout = setTimeout(nullLowestDelta, 200);
	
					return ($.event.dispatch || $.event.handle).apply(this, args);
			}
	
			function nullLowestDelta() {
					lowestDelta = null;
			}
	
			function shouldAdjustOldDeltas(orgEvent, absDelta) {
					// If this is an older event and the delta is divisable by 120,
					// then we are assuming that the browser is treating this as an
					// older mouse wheel event and that we should divide the deltas
					// by 40 to try and get a more usable deltaFactor.
					// Side note, this actually impacts the reported scroll distance
					// in older browsers and can cause scrolling to be slower than native.
					// Turn this off by setting $.event.special.mousewheel.settings.adjustOldDeltas to false.
					return special.settings.adjustOldDeltas && orgEvent.type === 'mousewheel' && absDelta % 120 === 0;
			}
	
	}));
	
	S2.define('jquery.select2',[
		'jquery',
		'jquery-mousewheel',
	
		'./select2/core',
		'./select2/defaults'
	], function ($, _, Select2, Defaults) {
		if ($.fn.selectWoo == null) {
			// All methods that should return the element
			var thisMethods = ['open', 'close', 'destroy'];
	
			$.fn.selectWoo = function (options) {
				options = options || {};
	
				if (typeof options === 'object') {
					this.each(function () {
						var instanceOptions = $.extend(true, {}, options);
	
						var instance = new Select2($(this), instanceOptions);
					});
	
					return this;
				} else if (typeof options === 'string') {
					var ret;
					var args = Array.prototype.slice.call(arguments, 1);
	
					this.each(function () {
						var instance = $(this).data('select2');
	
						if (instance == null && window.console && console.error) {
							console.error(
								'The select2(\'' + options + '\') method was called on an ' +
								'element that is not using Select2.'
							);
						}
	
						ret = instance[options].apply(instance, args);
					});
	
					// Check if we should be returning `this`
					if ($.inArray(options, thisMethods) > -1) {
						return this;
					}
	
					return ret;
				} else {
					throw new Error('Invalid arguments for Select2: ' + options);
				}
			};
		}
	
		if ($.fn.select2 != null && $.fn.select2.defaults != null) {
			$.fn.selectWoo.defaults = $.fn.select2.defaults;
		}
	
		if ($.fn.selectWoo.defaults == null) {
			$.fn.selectWoo.defaults = Defaults;
		}
	
		// Also register selectWoo under select2 if select2 is not already present.
		$.fn.select2 = $.fn.select2 || $.fn.selectWoo;
	
		return Select2;
	});
	
		// Return the AMD loader configuration so it can be used outside of this file
		return {
			define: S2.define,
			require: S2.require
		};
	}());
	
		// Autoload the jQuery bindings
		// We know that all of the modules exist above this, so we're safe
		var select2 = S2.require('jquery.select2');
	
		// Hold the AMD module references on the jQuery function that was just loaded
		// This allows Select2 to use the internal loader outside of this file, such
		// as in the language files.
		jQuery.fn.select2.amd = S2;
		jQuery.fn.selectWoo.amd = S2;
	
		// Return the Select2 instance for anyone who is importing it.
		return select2;
}));
	

// custom js
jQuery(function($){
	var ajax_url = window.awcpt_frontend_object.ajaxurl;
	
	// select2 use for multi select
	$('.awcpt-dropdown').selectWoo({
		minimumResultsForSearch: 15,
		dropdownCssClass: 'awcpt-select2-dropdown'
	});

	// Product image lightbox
	$('.awcpt-prdimage-lightbox').magnificPopup({
		type:'image',
		closeOnContentClick: true,
		closeBtnInside: true,
		closeMarkup: '<button title="%title%" type="button" class="awcpt-mfp-close">&#215;</button>',
		image: {
			verticalFit: true
		}
	});
	
	// Woo default btn quantity param adjsut when changing quanity field value
	$('body').on('change', '.awcpt-quantity', function(e){
		var qty = $(this).val();
		var parent = $(this).parents('tr');
		$(parent).find('td').each(function(){
			$(this).find('.add_to_cart_button').attr('data-quantity', qty);
		});
	});

	// handling table action button click
	$('body').on('click', '.awcpt-action-btn', function(e){
		var action = $(this).data('action');
		var target = $(this).attr('href');
		if( ['product_page', 'product_page_newtab', 'external_link'].includes(action) ){
			return;
		}

		e.preventDefault();

		var thisbutton = $(this);
		var parent = $(this).parents('tr');
		var product_id = $(parent).data('id');
		var incart = $(parent).attr('data-cart-in');
		var quantity = 1;
		var input_qty = $(parent).find('.awcpt-quantity').val();
		if( input_qty > 0 ){
			quantity = input_qty;
		}

		if( action == 'cart_redirect' ){
			target = target + '?add-to-cart=' + product_id + '&quantity=' + quantity;
			window.location.href = target;
		} else if( action == 'cart_checkout' ){
			target = target + '?add-to-cart=' + product_id + '&quantity=' + quantity;
			window.location.href = target;
		} else if( action == 'cart_refresh' ){
			var page_url = window.location.href;
			var urlparts= page_url.split('?');
			if( urlparts.length >= 2 ) {
				var pars = urlparts[1].split('&');
				for( var i = (pars.length - 1 ); i >= 0; i-- ){
					if( ( pars[i].lastIndexOf( 'add-to-cart=', 0 ) !== -1 ) || ( pars[i].lastIndexOf( 'quantity=', 0 ) !== -1 ) ){
						pars.splice(i, 1);
					}
				}  

				var url_params = pars.join('&');
				if( url_params.length > 0 ){
					page_url = urlparts[0] + '?' + url_params;
					target = page_url + '&add-to-cart=' + product_id + '&quantity=' + quantity;
				} else {
					page_url = urlparts[0];
					target = page_url + '?add-to-cart=' + product_id + '&quantity=' + quantity;
				}
			} else {
				target = page_url + '?add-to-cart=' + product_id + '&quantity=' + quantity;
			}

			window.location.href = target;
		} else {
			var data = {
				'action': 'awcpt_add_to_cart',
				'product_id': product_id,
				'quantity': quantity
			};

			$(thisbutton).removeClass('added').addClass('awcpt-btn-loading');

			$.post(ajax_url, data, function(response) {
				if( response.error && response.product_url ) {
					window.location.href = response.product_url;
					return;
				} else {
					$(document.body).trigger('added_to_cart', [response.fragments, response.cart_hash, thisbutton]);
					incart = parseInt(incart) + parseInt(quantity);
					$(parent).attr('data-cart-in', incart);
					$(thisbutton).find('.awcpt-cart-badge').text(incart).removeClass('awcpt-cart-badge-hide');
				}
				$(thisbutton).removeClass('awcpt-btn-loading');
			});
		}
	});

	// product table select all product
	$('body').on('change', '.awcpt-universal-checkbox', function(){
			var parent = $(this).parents('.awcpt-container');
			if($(this).is(':checked')){
					$(parent).find(".awcpt-universal-checkbox").prop('checked', true);
					$(parent).find(".awcpt-product-checkbox").each(function() {
							if( ! $(this).is(':disabled') ){
									$(this).prop('checked', true);
							}
					});
			} else {
					$(parent).find(".awcpt-universal-checkbox").prop('checked', false);
					$(parent).find(".awcpt-product-checkbox").each(function() {
							if( ! $(this).is(':disabled') ){
									$(this).prop('checked', false);
							}
					});
			}
	});

	// add all to cart btn
	$('body').on('click', '.add-to-cart-all', function(e){
		e.preventDefault();
		var thisbutton = $(this);
		var container = $(thisbutton).parents('.awcpt-container');
		var cart_data = [];
		var total_items = 0;
		$(container).find('.awcpt-product-table tbody tr').each(function(){
			var product_id = $(this).data('id');
			var incart = $(this).attr('data-cart-in');
			var selected = $(this).find(".awcpt-product-checkbox").is(':checked') ? true : false;
			if( selected ){
				var quantity = 1;
				// custom qty input val
				var input_qty = $(this).find('.awcpt-quantity').val();
				if( input_qty ){
					input_qty = parseInt(input_qty);
				} else {
					input_qty = 0;
				}

				// woo default qty input val
				var woo_default_qty = $(this).find('.quantity input.qty').val();
				if( woo_default_qty ){
					woo_default_qty = parseInt(woo_default_qty);
				} else {
					woo_default_qty = 0;
				}

				// setting highest val as input quantity
				if( woo_default_qty > input_qty ){
					input_qty = woo_default_qty;
				}

				// seting quanity
				if( input_qty > 0 ){
					quantity = input_qty;
				}

				// adjusting total items
				total_items = total_items + quantity;

				// Current product data and adding it to cart data array
				var current_data = {product_id:product_id, quantity:quantity};
				cart_data.push(current_data);
			}
		});

		if( cart_data.length > 0 ){
			var data = {
				'action': 'awcpt_add_all_to_cart',
				'cart_data': cart_data
			};

			$(thisbutton).removeClass('added').addClass('awcpt-btn-loading');

			$.post(ajax_url, data, function(response) {
				if( ! response.error ) {
					$(document.body).trigger('added_to_cart', [response.fragments, response.cart_hash, thisbutton]);
					$(thisbutton).find('.awcpt-cart-all-badge').text(total_items);
					// Adjusting incart param and btn badge
					$(container).find('.awcpt-product-table tbody tr').each(function(){
						var product_id = $(this).data('id');
						var incart = parseInt( $(this).attr('data-cart-in') );
						for( var i=0; i < cart_data.length; i++ ){
							if( cart_data[i].product_id == product_id ){
								incart = incart + cart_data[i].quantity;
								$(this).attr('data-cart-in', incart);
								$(this).find('.awcpt-cart-badge').text(incart);
							}
						}
					});
				}
				$(thisbutton).removeClass('awcpt-btn-loading');
			});
		}
	});

	// filter handle
	$('body').on('change', '.awcpt-filter-fld', function(e){
		var filter_type = $(this).data('type');
		var filter_wrap = $(this).parents('.awcpt-filter');
		var fld_val = '';
		var container = $(this).parents('.awcpt-wrapper');
		var table_id = $(container).data('table-id');
		$(container).find('.awcpt-ft-loader').show();
		$(container).find('.awcpt-product-found-msg').remove();

		if( $(this).hasClass('awcpt-filter-checkbox') ){
			$(filter_wrap).find('.awcpt-filter-checkbox').each(function(){
				if( $(this).is(':checked') ){
					if( fld_val != '' ) {
						fld_val = fld_val + ',' + $(this).val();
					} else {
						fld_val = $(this).val();
					}
				}
			});
		} else if( $(this).hasClass('awcpt-multi-select') ) {
			var fld_val_array = $(this).val();
			fld_val = fld_val_array.join(',');
		} else {
			fld_val = $(this).val();
		}

		// handling new query string parameter
		if( filter_type == 'availability' ){
			var param_name = table_id + '_stock_status';
		} else if( filter_type == 'category' ){
			var param_name = table_id + '_categories';
		} else if( filter_type == 'onsale' ){
			var param_name = table_id + '_onsale';
		} else if( filter_type == 'price' ){
			var param_name = table_id + '_price_range';
		} else if( filter_type == 'rating' ){
			var param_name = table_id + '_rated';
		} else if( filter_type == 'results_per_page' ){
			var param_name = table_id + '_results_per_page';
			// adjust offset
			$(container).find('.awcpt-loadmore-btn').attr('data-offset', fld_val);
		} else if( filter_type == 'order_by' ){
			var param_name = table_id + '_order_by';
		} else {
			var param_name = '';
		}

		var pagination_sts = $(container).find('.awcpt-product-table').attr('data-pagination');
		var ajax_pagination_sts = $(container).find('.awcpt-product-table').attr('data-ajax-pagination');
		var loadmore_sts = $(container).find('.awcpt-product-table').attr('data-loadmore');
		var page_number = $(container).find('.awcpt-pagination-wrap .awcpt-pagination .current').text();
		var offset = parseInt( $(container).find('.awcpt-loadmore-btn-wrapper .awcpt-loadmore-btn').attr('data-offset') );
		var page_url = window.location.href;
		var urlparts= page_url.split('?');
		var base_url = urlparts[0];
		var query_string = ( urlparts.length >= 2 ) ? awcpt_parse_query_string( urlparts[1], param_name ) : '';

		if(query_string != ''){
			query_string = query_string + '&' + param_name + '=' + fld_val;
		} else {
			query_string = param_name + '=' + fld_val;
		}

		// ajax variable
		var data = {
			'action': 'awcpt_filter',
			'table_id': table_id,
			'page_number': page_number,
			'query_string': query_string
		};

		// generating new url
		if( fld_val != '' ){
			page_url = base_url + '?' + query_string;
		} else {
			// removing qstring parameter if val is null
			query_string = awcpt_parse_query_string( query_string, param_name );
			if( query_string != '' ){
				page_url = base_url + '?' + query_string;
			} else {
				page_url = base_url;
			}
		}

		// ajax or non ajax pagination case
		if( ( pagination_sts == 'on' && ajax_pagination_sts == 'on' ) || loadmore_sts == 'on' ){
			// calling ajax handler
			awcpt_filter_ajax( data, container, page_url );
		} else {
			window.location.href = page_url;
		}
	});

	// custom price range filter input submit handle
	$('body').on('click', '.awcpt-price-range-btn', function(e){
		e.preventDefault();
		var price_range_wrap = $(this).parents('.awcpt-price-range-wrap');
		var container = $(this).parents('.awcpt-wrapper');
		var table_id = $(container).data('table-id');
		$(container).find('.awcpt-ft-loader').show();
		$(container).find('.awcpt-product-found-msg').remove();
		var min_price = $(price_range_wrap).find('.awcpt-price-input-min').val();
		var max_price = $(price_range_wrap).find('.awcpt-price-input-max').val();
		var price_range = '';
		if( min_price != '' && max_price != '' ){
			price_range = min_price + '-' + max_price;
		}

		var param_name = table_id + '_price_range';
		var pagination_sts = $(container).find('.awcpt-product-table').attr('data-pagination');
		var ajax_pagination_sts = $(container).find('.awcpt-product-table').attr('data-ajax-pagination');
		var loadmore_sts = $(container).find('.awcpt-product-table').attr('data-loadmore');
		var page_number = $(container).find('.awcpt-pagination-wrap .awcpt-pagination .current').text();
		var offset = parseInt( $(container).find('.awcpt-loadmore-btn-wrapper .awcpt-loadmore-btn').attr('data-offset') );
		var page_url = window.location.href;
		var urlparts= page_url.split('?');
		var base_url = urlparts[0];
		var query_string = ( urlparts.length >= 2 ) ? awcpt_parse_query_string( urlparts[1], param_name ) : '';

		if(query_string != ''){
			query_string = query_string + '&' + param_name + '=' + price_range;
		} else {
			query_string = param_name + '=' + price_range;
		}

		// ajax variable
		var data = {
			'action': 'awcpt_filter',
			'table_id': table_id,
			'page_number': page_number,
			'query_string': query_string
		};

		// generating new url
		if( price_range != '' ){
				page_url = base_url + '?' + query_string;
		} else {
			// removing qstring parameter if val is null
			query_string = awcpt_parse_query_string( query_string, param_name );
			if( query_string != '' ){
				page_url = base_url + '?' + query_string;
			} else {
				page_url = base_url;
			}
		}

		// ajax or non ajax pagination case
		if( ( pagination_sts == 'on' && ajax_pagination_sts == 'on' ) || loadmore_sts == 'on' ){
			// calling ajax handler
			awcpt_filter_ajax( data, container, page_url );
		} else {
			window.location.href = page_url;
		}
	});

	// Search
	$('body').on('click', '.awcpt-search-submit', function(e){
		e.preventDefault();
		var sterm = $(this).parents('.awcpt-search-wrapper').find('.awcpt-search-input').val();
		var container = $(this).parents('.awcpt-wrapper');
		var table_id = $(container).data('table-id');
		$(container).find('.awcpt-ft-loader').show();
		$(container).find('.awcpt-product-found-msg').remove();
		var pagination_sts = $(container).find('.awcpt-product-table').attr('data-pagination');
		var ajax_pagination_sts = $(container).find('.awcpt-product-table').attr('data-ajax-pagination');
		var loadmore_sts = $(container).find('.awcpt-product-table').attr('data-loadmore');
		var page_number = $(container).find('.awcpt-pagination-wrap .awcpt-pagination .current').text();
		var offset = parseInt( $(container).find('.awcpt-loadmore-btn-wrapper .awcpt-loadmore-btn').attr('data-offset') );
		var page_url = window.location.href;
		var urlparts= page_url.split('?');
		var base_url = urlparts[0];
		var param_name = table_id + '_search';
		var query_string = ( urlparts.length >= 2 ) ? awcpt_parse_query_string( urlparts[1], param_name ) : '';

		if( sterm != '' ){
			// query string and new page url handling
			if( query_string != '' ){
				query_string = query_string + '&' + param_name + '=' + sterm;
			} else {
				query_string = param_name + '=' + sterm;
			}

			page_url = base_url + '?' + query_string;

			// ajax
			var data = {
				'action': 'awcpt_filter',
				'table_id': table_id,
				'page_number': page_number,
				'query_string': query_string
			};

			// ajax or non ajax pagination case
			if( ( pagination_sts == 'on' && ajax_pagination_sts == 'on' ) || loadmore_sts == 'on' ){
				// calling ajax handler
				awcpt_filter_ajax( data, container, page_url );
			} else {
				window.location.href = page_url;
			}

			$(container).find('.awcpt-search-clear').show();
		} else {
			$(container).find('.awcpt-ft-loader').hide();
		}
	});

	// Clear search
	$('body').on('click', '.awcpt-search-clear', function(e){
		var container = $(this).parents('.awcpt-wrapper');
		var table_id = $(container).data('table-id');
		$(container).find('.awcpt-ft-loader').show();
		$(container).find('.awcpt-product-found-msg').remove();
		var pagination_sts = $(container).find('.awcpt-product-table').attr('data-pagination');
		var ajax_pagination_sts = $(container).find('.awcpt-product-table').attr('data-ajax-pagination');
		var loadmore_sts = $(container).find('.awcpt-product-table').attr('data-loadmore');
		var page_number = $(container).find('.awcpt-pagination-wrap .awcpt-pagination .current').text();
		var page_url = window.location.href;
		var urlparts= page_url.split('?');
		var base_url = urlparts[0];
		var param_name = table_id + '_search';
		var query_string = ( urlparts.length >= 2 ) ? awcpt_parse_query_string( urlparts[1], param_name ) : '';

		// generate new page url
		if( query_string != '' ){
			page_url = base_url + '?' + query_string;
		} else {
			page_url = base_url;
		}

		// ajax
		var data = {
			'action': 'awcpt_filter',
			'table_id': table_id,
			'page_number': page_number,
			'query_string': query_string
		};

		// ajax or non ajax pagination case
		if( ( pagination_sts == 'on' && ajax_pagination_sts == 'on' ) || loadmore_sts == 'on' ){
			// clear input field val
			$(container).find('.awcpt-search-input').val('');
			
			// hide clear icon
			$(container).find('.awcpt-search-clear').hide();

			// calling ajax handler
			awcpt_filter_ajax( data, container, page_url );
		} else {
			window.location.href = page_url;
		}
	});

	// clear filters
	$('body').on('click', '.awcpt-clear-filter', function(e){
		e.preventDefault();
		var container = $(this).parents('.awcpt-wrapper');
		var table_id = $(container).data('table-id');
		$(container).find('.awcpt-ft-loader').show();
		$(container).find('.awcpt-product-found-msg').remove();
		var pagination_sts = $(container).find('.awcpt-product-table').attr('data-pagination');
		var ajax_pagination_sts = $(container).find('.awcpt-product-table').attr('data-ajax-pagination');
		var loadmore_sts = $(container).find('.awcpt-product-table').attr('data-loadmore');
		var page_number = $(container).find('.awcpt-pagination-wrap .awcpt-pagination .current').text();
		var page_url = window.location.href;
		var urlparts= page_url.split('?');
		var base_url = urlparts[0];
		var query_string = ( urlparts.length >= 2 ) ? urlparts[1] : '';
		var filter_params = ["order_by", "results_per_page", "categories", "price_range", "stock_status", "onsale", "rated", "search"];
		var pars = query_string.split('&');

		// clearing filter terms from query string
		for( var i = (pars.length - 1 ); i >= 0; i-- ){
			var item = pars[i];
			var param_name = '';
			for( var j = 0; j < filter_params.length; j++ ){
				param_name = table_id + '_' + filter_params[j];
				if( ( item.lastIndexOf( param_name, 0 ) !== -1 ) ){
					pars.splice(i, 1);
				}
			}
		}

		// generate new page url
		if( pars != '' ){
			query_string = pars.join('&');
			page_url = base_url + '?' + query_string;
		} else {
			page_url = base_url;
		}

		// ajax
		var data = {
			'action': 'awcpt_filter',
			'table_id': table_id,
			'page_number': page_number,
			'query_string': ''
		};

		// ajax or non ajax pagination case
		if( ( pagination_sts == 'on' && ajax_pagination_sts == 'on' ) || loadmore_sts == 'on' ){
			// clearing radion and checkboxes
			$(container).find('.awcpt-filter-radio, .awcpt-filter-checkbox').each(function(){
				$(this).prop('checked',false);
			});

			// clearing dropdown select
			$(container).find('.awcpt-dropdown').each(function(){
				if( ! $(this).hasClass('awcpt-multi-select') ) {
					$(this).prop('selectedIndex',0);
				} else {
					$(this).val(null);
				}
			})

			// adjusting select2 js vals
			$(container).find(".awcpt-dropdown").select2("destroy");
			$(container).find('.awcpt-dropdown').selectWoo({
				minimumResultsForSearch: 15,
				dropdownCssClass: 'awcpt-select2-dropdown'
			});

			// clearing input boxes
			$(container).find('.awcpt-nav input[type=text], .awcpt-nav input[type=number], .awcpt-nav input[type=search]').val('');

			// hide search clear
			$(container).find('.awcpt-search-clear').hide();

			// calling ajax handler
			awcpt_filter_ajax( data, container, page_url );
		} else {
			window.location.href = page_url;
		}
	});

	// Pagination
	$('body').on('click', '.awcpt-pagination a.page-numbers', function(e){
		e.preventDefault();
		var pagination_wrap = $(this).parents('.awcpt-pagination');
		var container = $(this).parents('.awcpt-wrapper');
		var table_id = $(container).data('table-id');
		var page_number = '';

		// page num handling
		if( $(this).hasClass('next') ){
			var current_page_num = parseInt( $(pagination_wrap).find('.current').text() );
			page_number = current_page_num + 1;
		} else if( $(this).hasClass('prev') ){
			var current_page_num = parseInt( $(pagination_wrap).find('.current').text() );
			page_number = current_page_num - 1;
		} else {
			page_number = $(this).text();
		}

		var page_url = window.location.href;
		var urlparts= page_url.split('?');
		var base_url = urlparts[0];
		var param_name = table_id + '_paged';
		var query_string = ( urlparts.length >= 2 ) ? awcpt_parse_query_string( urlparts[1], param_name ) : '';

		// checking page number and new query string & url gen
		if( page_number != '' ){
			// query string and new page url handling
			if( query_string != '' ){
				query_string = query_string + '&' + param_name + '=' + page_number;
			} else {
				query_string = param_name + '=' + page_number;
			}

			// new page url
			page_url = base_url + '?' + query_string;
		}

		// ajax and non ajax handling
		if( $(pagination_wrap).hasClass('awcpt-ajax-pagination') ){
			$(container).find('.awcpt-ft-loader').show();
			$(container).find('.awcpt-product-found-msg').remove();

			if( page_number != '' ){
				// ajax
				var data = {
					'action': 'awcpt_filter',
					'table_id': table_id,
					'page_number': page_number,
					'query_string': query_string
				};

				// calling ajax handler
				awcpt_filter_ajax( data, container, page_url );
			} else {
				$(container).find('.awcpt-ft-loader').hide();
			}
		} else {
			window.location.href = page_url;
		}
	});

	// Loadmore handle
	$('body').on('click', '.awcpt-loadmore-btn', function(e){
		e.preventDefault();
		var offset = parseInt( $(this).attr('data-offset') );
		var container = $(this).parents('.awcpt-wrapper');
		var table_id = $(container).data('table-id');
		$(container).find('.awcpt-ft-loader').show();
		var page_url = window.location.href;
		var urlparts= page_url.split('?');
		var query_string = ( urlparts.length >= 2 ) ? urlparts[1] : '';

		// ajax data
		var data = {
			'action': 'awcpt_filter',
			'table_id': table_id,
			'query_string': query_string,
			'offset': offset,
			'loadmore_click': true
		};

		$.post(ajax_url, data, function(response) {
			var sidebar_result_count = response.sidebar_result_count;
			var head_left_result_count = response.head_left_result_count;
			var head_right_result_count = response.head_right_result_count;

			if( response.success == true ) {
				var table_data = response.table_data;
				offset = response.offset;
				var found_posts = response.found_posts;
				$(container).find('.awcpt-product-table tbody').append(table_data);
				$(container).find('.awcpt-loadmore-btn').attr('data-offset', offset);

				// loadmore btn
				if( offset >= found_posts ){
					$(container).find('.awcpt-loadmore-btn').hide();
				}

				// result count adjust in filters
				$(container).find('.awcpt-left-nav .awcpt-result-count').replaceWith(sidebar_result_count);
				$(container).find('.awcpt-head-left-nav .awcpt-result-count').replaceWith(head_left_result_count);
				$(container).find('.awcpt-head-right-nav .awcpt-result-count').replaceWith(head_right_result_count);
			}

			$(container).find('.awcpt-ft-loader').hide();
		});
	});

	// widget toggle content
	$('.awcpt-left-nav .awcpt-filter-row-heading').on('click', function(){
		var $nextDiv = $(this).next();
		var $this = $(this);
		if($(this).hasClass('awcpt-accordion-close')){
			$this.removeClass('awcpt-accordion-close');
			$nextDiv.slideDown();          
		} else {          
			$this.addClass('awcpt-accordion-close');
			$nextDiv.slideUp(); 
		}
	});

	/**
	 * WC minicart removal handle
	*/
	$('body').on('click', '.remove_from_cart_button', function(e){
		e.preventDefault();
		var removed_prd_id = parseInt( $(this).attr('data-product_id') );
		var incart = 0;
		var current_prd_id = '';
		$('body').find('.awcpt-product-table').each(function(){
			$(this).find('> tbody > tr').each(function(){
				current_prd_id = parseInt( $(this).attr('data-id') );
				if( current_prd_id == removed_prd_id ) {
					$(this).attr('data-cart-in', incart);
					$(this).find('> td').each(function(){
						$(this).find('.awcpt-action-btn .awcpt-cart-badge').text(incart).addClass('awcpt-cart-badge-hide');
					});
				}
			});
		});
	});

	// awcpt filter, pagination and search ajax function
	function awcpt_filter_ajax( data, container, page_url ){
		$.post(ajax_url, data, function(response) {
			var sidebar_result_count = response.sidebar_result_count;
			var head_left_result_count = response.head_left_result_count;
			var head_right_result_count = response.head_right_result_count;

			if( response.success == true ) {
				var table_data = response.table_data;
				var pagination_data = response.pagination;
				var found_posts = response.found_posts;
				var offset = response.offset;

				// adjusting content table and pagination
				$(container).find('.awcpt-product-table tbody').html(table_data);
				$(container).find('.awcpt-pagination-wrap').html(pagination_data);

				// loadmore btn
				$(container).find('.awcpt-loadmore-btn').attr('data-offset', offset);
				if( offset >= found_posts ){
					$(container).find('.awcpt-loadmore-btn').hide();
				} else {
					$(container).find('.awcpt-loadmore-btn').show();
				}

				// result count adjust in filters
				$(container).find('.awcpt-left-nav .awcpt-result-count').replaceWith(sidebar_result_count);
				$(container).find('.awcpt-head-left-nav .awcpt-result-count').replaceWith(head_left_result_count);
				$(container).find('.awcpt-head-right-nav .awcpt-result-count').replaceWith(head_right_result_count);
			} else {
				var not_found_msg = response.not_found_msg;
				$(container).find('.awcpt-product-table tbody').html('');
				$(container).find('.awcpt-pagination-wrap').html('');
				$(container).find('.awcpt-loadmore-btn').hide();
				$(container).find('.awcpt-container').append(not_found_msg);
				// result count adjust in filters
				$(container).find('.awcpt-left-nav .awcpt-result-count').replaceWith(sidebar_result_count);
				$(container).find('.awcpt-head-left-nav .awcpt-result-count').replaceWith(head_left_result_count);
				$(container).find('.awcpt-head-right-nav .awcpt-result-count').replaceWith(head_right_result_count);
			}

			// variation form
			$('body').find('.variations_form').each(function () {
				jQuery(this).wc_variation_form();
			});

			$(container).find('.awcpt-ft-loader').hide();
			window.history.pushState( {path: page_url},'', page_url );
		});
	}

	// parse query string helper fn.
	function awcpt_parse_query_string(query_string, param_name){
		var pars = query_string.split('&');

		for( var i = (pars.length - 1 ); i >= 0; i-- ){
				if( ( pars[i].lastIndexOf( param_name, 0 ) !== -1 ) ){
						pars.splice(i, 1);
				}
		}

		var url_params = decodeURIComponent( pars.join('&') );

		return url_params;
	}
});


