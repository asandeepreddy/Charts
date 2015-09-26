/*
 * jquery.mobile.actionsheet v2
 *
 * Copyright (c) 2011, Stefan Gebhardt and Tobias Seelinger
 * Dual licensed under the MIT and GPL Version 2 licenses.
 * 
 * Date: 2011-05-03 17:11:00 (Tue, 3 May 2011)
 * Revision: 2
 */
var opened = 0;
(function($,window){
	$.widget("mobile.actionsheet",$.mobile.widget,{
		wallpaper: undefined,
		content: undefined,
		_init: function() {
                    opened = 0;
			var self = this;
			this.content = ((typeof this.element.jqmData('sheet') !== 'undefined')
				? $('#' + this.element.jqmData('sheet'))
				: this.element.next('div')).addClass('ui-actionsheet-content');
			// Move content to parent page
			// Otherwise there is an error i will describe here soon
			var parentPage = this.element.parents(':jqmData(role="page")');
			this.content.remove().appendTo(parentPage);

			//setup command buttons
			this.content.find(':jqmData(role="button")').filter(':jqmData(rel!="close")')
				.addClass('ui-actionsheet-commandbtn')
				.bind('click', function(){
					self.reset();
				});
			//setup close button
			this.content.find(':jqmData(rel="close")')
				.addClass('ui-actionsheet-closebtn')
				.bind('click', function(){
					self.close();
				});
			this.element.bind('click', function(){
				self.open();
			});
			if( this.element.parents( ':jqmData(role="content")' ).length !== 0 ) {
				this.element.buttonMarkup();
			}
		},
		open: function() {
                    if(opened>0){
                        return;
                    }
                    $(".listitems_body_div").hide();
			this.element.unbind('click'); //avoid twice opening
			//alert('open');
                        opened = 1;
			var cc= this.content.parents(':jqmData(role="page")');
			this.wallpaper= $('<div>', {'class':'ui-actionsheet-wallpaper'})
				.appendTo(cc)
				.show();
			
			//window.setTimeout($.proxy(this._wbc, this), 500);
			this.wallpaper.bind(
					"click",
					$.proxy(function() { this.close(); },this));
			this._positionContent();

			$(window).bind('orientationchange.actionsheet',$.proxy(function () {
				this._positionContent();
			}, this));
		
			if( $.support.cssTransitions ) {
				this.content.animationComplete(function(event) {
						$(event.target).removeClass("ui-actionsheet-animateIn ui-actionsheet-opening");
					});
				this.content.addClass("ui-actionsheet-animateIn ui-actionsheet-opening").show();
			} else {
				this.content.addClass("ui-actionsheet-opening");
				this.content.fadeIn(function () {
					$(this).removeClass("ui-actionsheet-opening");
				});
			}
		},
		close: function(event) {
                    opened = 0;
			var self = this;
			$(".listitems_body_div").show();
			this.wallpaper.unbind('click');
			$(window).unbind('orientationchange.actionsheet');
			if( $.support.cssTransitions ) {
				this.content.animationComplete(function() {
					self.reset();
				});
				this.content.addClass("ui-actionsheet-animateOut");
				this.wallpaper.remove();
			} else {
				this.wallpaper.remove();
				this.content.fadeOut();
				this.element.bind('click', function(){
					self.open();
				});
			}
		},
		reset: function() {
                    opened = 0;
			this.wallpaper.remove();
			this.content
				.removeClass("ui-actionsheet-animateOut")
				.removeClass("ui-actionsheet-animateIn")
				.hide();
			var self= this;
			this.element.bind('click', function(){
				self.open();
			});
		},
		_positionContent: function() {
			var height = $(window).height(),
				width = $(window).width(),
				scrollPosition = $(window).scrollTop();
			this.content.css({
				'top': (scrollPosition + height / 2 - this.content.height() / 2),
				'left': (width / 2 - this.content.width() / 2)
			});
		}
	});

	$( ":jqmData(role='page')" ).live( "pageinit", function() { 
		$( ":jqmData(role='actionsheet')", this ).each(function() {
			$(this).actionsheet();
		});
	});

}) (jQuery,this);
