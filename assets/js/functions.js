$( document ).ready(function() {
	
function nav(){
	var $toggle = $('.nav-toggle'),
			$nav = $('.nav');

	function setOpen(open){
		$toggle.attr('aria-expanded', String(open));
		$nav.toggleClass('open', open).prop('inert', !open);
	}

	setOpen(false);
	$toggle.on('click', function(){
		setOpen($toggle.attr('aria-expanded') !== 'true');
	}).on('keydown', function(event){
		if (event.key === 'ArrowDown'){
			event.preventDefault();
			setOpen(true);
			$nav.find('a').first().trigger('focus');
		}
	});
	$nav.on('click', 'a', function(){
		setOpen(false);
	});
	$(document).on('click focusin', function(event){
		if (!$(event.target).closest('.nav, .nav-toggle').length){
			setOpen(false);
		}
	}).on('keydown', function(event){
		if (event.key === 'Escape' && $toggle.attr('aria-expanded') === 'true'){
			setOpen(false);
			$toggle.trigger('focus');
		}
	});
}

function smoothScroll(){
	
	$('a[href^="#"]').click(function(event){
		
		var target = $($(this).attr('href'));

    if (target.length){
      event.preventDefault();
      $('html, body').stop().animate({
	      scrollTop: target.offset().top - 15
      }, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 300, function(){
        target.attr('tabindex', '-1')[0].focus({preventScroll: true});
      });
    }
		
	});
	
}

function threeSlider(){
	var $slider = $('#three-slide .slider'),
			$slides = $slider.children('li'),
			$status = $('#three-slide .carousel-status'),
			totalSlides = $slides.length,
			currentIndex = $slides.index($slides.filter('.current')),
			touchStartX = null,
			touchStartY = null;

	if (!totalSlides){
		return;
	}

	if (currentIndex < 0){
		currentIndex = 0;
	}

	function updateSlides(){
		$slides.removeClass('before back current front after');

		$slides.each(function(index){
			var forwardDistance = (index - currentIndex + totalSlides) % totalSlides,
					positionClass;

			if (forwardDistance === 0){
				positionClass = 'current';
			}
			else if (forwardDistance === 1){
				positionClass = 'front';
			}
			else if (forwardDistance === totalSlides - 1){
				positionClass = 'back';
			}
			else if (forwardDistance < totalSlides / 2){
				positionClass = 'after';
			}
			else {
				positionClass = 'before';
			}

			$(this)
				.addClass(positionClass)
				.attr('aria-hidden', positionClass === 'current' ? 'false' : 'true');
		});

		$status.text((currentIndex + 1) + ' / ' + totalSlides);
	}

	function moveSlider(direction){
		currentIndex = (currentIndex + direction + totalSlides) % totalSlides;
		updateSlides();
	}

	$('#three-slide .prev, #three-slide .next')
		.on('click', function(){
			moveSlider($(this).hasClass('next') ? 1 : -1);
		})
		.on('keydown', function(event){
			if (event.key === 'Enter' || event.key === ' '){
				event.preventDefault();
				$(this).trigger('click');
			}
		});

	$slider.on('touchstart', function(event){
		var touch = event.originalEvent.touches[0];
		touchStartX = touch.clientX;
		touchStartY = touch.clientY;
	});

	$slider.on('touchend', function(event){
		var touch = event.originalEvent.changedTouches[0],
				distanceX = touch.clientX - touchStartX,
				distanceY = touch.clientY - touchStartY;

		if (touchStartX !== null && Math.abs(distanceX) > 45 && Math.abs(distanceX) > Math.abs(distanceY)){
			moveSlider(distanceX < 0 ? 1 : -1);
		}

		touchStartX = null;
		touchStartY = null;
	});

	$slider.on('touchcancel', function(){
		touchStartX = null;
		touchStartY = null;
	});

	updateSlides();
}


nav();

smoothScroll();

threeSlider();

});
