/* 
This function brings up the popover when hovering over the sidebar or local links. To differentiate it
from other popovers you may have in your code, they are given additionl 
'sidebar-popover'/'link-popover' class.
You can select all the sidebar popovers using $('.sidebar-popover') and 
all the local link popovers using $('.link-popover').

*/
(function(){
	"use strict";

	  
	//http://www.abeautifulsite.net/blog/2011/11/detecting-mobile-devices-with-javascript/
	var isMobile = {
	    Android: function() {return navigator.userAgent.match(/Android/i);},
	    BlackBerry: function() {return navigator.userAgent.match(/BlackBerry/i);},
	    iOS: function() {return navigator.userAgent.match(/iPhone|iPad|iPod/i);},
	    Opera: function() {return navigator.userAgent.match(/Opera Mini/i);},
	    Windows: function() {return navigator.userAgent.match(/IEMobile/i);},
	    any: function() {
	    	return (isMobile.Android()
	    		|| isMobile.BlackBerry()
	    		|| isMobile.iOS()
	    		|| isMobile.Opera()
	    		|| isMobile.Windows());
	    }
	};
	
	$(document).ready(function() {

		// remove missing images from the document
		$('img').on('error',hideMissingImages);

		//disable links if the sidebar is hidden
		$('#sidebar-wrapper').click(function(evt) {
			var isActive = $('#wrapper').hasClass('active');	
			if($(window).width()<=767 && $(evt.target).attr('href') && !isActive){
				evt.preventDefault();
			}
			$('#wrapper').toggleClass('active'); 
		});

		// only apply mouseover-related stuff if we're not on a mobile device
		if(!isMobile.any()){


			var pageContent = $('.page-content').html() 
	  					+'<span class="glyphicon glyphicon-remove popover-close steelblue"></span>'
		 
			var popoverOptions = {
				'trigger':'manual'
		        ,'container':'#page-content-wrapper'
		        ,'placement': 'right'
		        ,'delay':{show:50, hide: 500}
		        ,'white-space': 'nowrap'
		        ,'html':'true'
		        ,'content': pageContent
		    };
			// only add popover on hover if we're not on a mobile device
			popoverSidebarOnHover(popoverOptions);
			
			//make this optional. See #show-hide-local-link-popover
			//popoverLinksOnHover(popoverOptions);

			// slide in/out on mouseenter/mouseleave 
			// (only if not on a mobile device)
			$('#sidebar-wrapper').mouseenter(function(evt){
				$('#wrapper').addClass('active');
			})
			.mouseleave(function(evt){
				$('#wrapper').removeClass('active');
			});

			var localLinks = $(".page-content a[href*='#']");
			var localLinksExist = false;
			var ll = -1, n = localLinks.length; 
			while(++ll < n && ! localLinksExist){
				if(localLinks[ll].innerHTML && $(localLinks[ll]).attr('href')[0]=='#') localLinksExist = true;
			}
			
			if(localLinksExist){
				// add a control to the top of the page to hide mouseover the local links
				$('.page-content').prepend('<small><a class="pull-right"'+
							' id="show-hide-local-link-popover">Show/Hide Preview of Local Links on Hover</a></small>');
				$('#show-hide-local-link-popover').on('click',function(evt){
					evt.preventDefault();
					$(this).toggleClass('clicked')
					if($(this).hasClass('clicked')){
						popoverLinksOnHover(popoverOptions);
					}
					else{
						$('.local-link').removeClass('local-link');
						$('.popover.link-popover').remove();
					}
				});
			}		
		}
	});
	
	// -----------------------------------------------------
	$(window).resize(slideInOut);          
	// Slide in/out for the case where the screen width <768px
	function slideInOut(evt){
		var w = $(window).width();	
		if( w>767){
			$('#wrapper').removeClass('active');
		}
		else{
			$('.popover.sidebar-popover').removeClass('in');
		}
	}
	function getLocalLinks(){
		//local links
		var localLinks = $(".page-content a[href*='#']");
		localLinks.each(function(i,d){
			if(this.innerHTML && $(this).attr('href')[0]=='#') $(this).addClass('local-link')
		});
		return $(".page-content .local-link");
	}

	//---------------------------
	function hideMissingImages(){
		if($(this.parentNode).is('A')) $(this.parentNode).remove();
		else $(this).remove()
	}
	// show popover when hovering over local links
	function popoverLinksOnHover(popoverOptions){ 
		var localLinks = getLocalLinks();;
		// localLinks.addClass('highlight');
		localLinks.popover(popoverOptions);
		localLinks.on("mouseover", mouseoverLocalLink)
			.on("mouseout", mouseoutPopover)
			.on("click", mouseclickPopover);
	}
	
	// show popover when hovering over sidebar
	function popoverSidebarOnHover(popoverOptions){
		var sidebarList = $('#sidebar-wrapper .nav.nav-list li'); 
	 	sidebarList.popover(popoverOptions);
		sidebarList.on("mouseover", function(evt){
					mouseoverPopover(evt,'sidebar-popover');
				})
				.on("mouseout", mouseoutPopover)
				.on("click", mouseclickPopover);
	}
	// Events ----------------------------------------------
	// -----------------------------------------------------
	function mouseoutPopover(evt){}
	function mouseoverPopover(evt,elemTag){
		// no popover if screen is tiny / mobile device
		if($(window).width()<=768) return;

		var elem = evt.currentTarget;
	
		// hide this popover when the tooltips leave
		$('.popover').removeClass('in');
        $(elem).popover("show");   

        var href = $(elem).attr("href");
        if(!href){
        	href = $(elem).find('a').attr('href');
        }
        var popover = $('.popover.fade.right.in');
       
		popover.addClass(elemTag);
		initPopovers('.popover.'+elemTag);

		// Remove all missing images
		$('.popover').find('img').on('error',hideMissingImages);

		updatePopover(popover,href);
	}
	function mouseclickPopover(evt){ 
 		$(".popover.link-popover").removeClass('in');
 		$(".popover.sidebar-popover").removeClass('in');
 	} 	
 	// A little more special for the local links since we want to be able
 	// to turn it on/off
 	function mouseoverLocalLink(evt){
		if($(this).hasClass('local-link'))
			mouseoverPopover(evt,'link-popover');
	}
	
 	// Helper functions ------------------------------------
 	// -----------------------------------------------------
 	// attach event handlers
	function initPopovers(elemTag){ 
			$(elemTag)
				.on('mouseover',function(evt){
					$(this).addClass('in')
				})
				.on('scroll',function(evt){
					updatePopoverCloseButtonPosition($(this));			 
				});

			$(elemTag + ' .popover-close').on('click',function(evt){ 
				$(this.offsetParent).removeClass('in')
			})
	} 
	// position the popover and adjust the scroll position.
	function updatePopover(popover,href){
		if(popover.length){
				 
		   	updatePopoverScrollPosition(popover,href);
		    // updatePopoverCloseButtonPosition(popover);
		    var $w = $(window);
		    var top = Math.max( parseInt(popover.css('top')), $w.scrollTop() ) + 22; 
		    top = Math.min(top, $w.scrollTop() + $w.height() - (popover.height() + screenTop + 30) );
		    popover.css('top',top+ 'px')
		}
	}
	// place the 'close' button at the top right regardless of where we are scrolling
	function updatePopoverCloseButtonPosition(popover){

		if(popover.length){ 
		    // close button position
			$(popover.find('.popover-close'))
		    	.css({
		    		'top' : (popover.scrollTop() + 5) +'px' 
		    		,'left' : (popover.width()) + 'px'
		    	});
		} 
	}
	// scroll to the correct position in the popover
	function updatePopoverScrollPosition(popover,href){
		var offsetTop = getHrefElemOffsetTop(popover,href.substring(1,href.length))
		    ,scrollTop = offsetTop - popover.offset().top - 5;
		popover.scrollTop(scrollTop);
	}
	//--------------------------
	// get the offset of the header in the popover element
    function getHrefElemOffsetTop(popover,name){
    	if(!name) return 0;
    	var hrefElem = $(popover.find('.popover-content a[name="'+name+'"]'));
    	return hrefElem.offset().top;
    }
    function jsfy(s){
    	console.log(JSON.stringify(s));
    }

 
}());