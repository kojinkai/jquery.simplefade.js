/*! simplefade - v0.0.1 - 2013-09-18
* https://github.com/kojinkai/simplefade
* Copyright (c) 2013 Lewis Nixon; Licensed MIT */
;(function ( $, window, document, undefined ) {

  'use strict';

  // Create the defaults once
  var simplefade = 'simplefade',
      defaults = {
        interval: 5000,
        startsWith: 0
      };

  function testTransition() {
    var t,
        el = document.createElement('fakeelement');
    
    var transitions = {
      'transition':'transitionend',
      'OTransition':'otransitionEnd',
      'MozTransition':'transitionend',
      'WebkitTransition':'webkitTransitionEnd'
    };

    for ( t in transitions ) {
          if ( el.style[t] !== undefined ) {
            return transitions[t];
        }
      }
      return false;
    }

  function SimpleFade(element, options) {
    this.element = element;

    // Merge defaults and uder options
    this.options = $.extend( {}, defaults, options);
    
    this.$indicators = $(this.element).siblings('.fade-controls');

    this._defaults = defaults;
    this._name = simplefade;
    
    this.init();
  }

  SimpleFade.prototype = {
    
    init: function() {
      $(this.element).children().eq(this.options.startsWith).addClass('active');
      this.cycle();
    },

    transitionType: testTransition(),

    getActiveIndex: function () {
      this.$active = $(this.element).find('.active');
      this.$items = this.$active.parent().children();
      return this.$items.index(this.$active);

    },

    cycle: function() {
      if (this.interval) {
        clearInterval(this.interval);
      }
      if ( this.options.interval ) {
        this.interval = setInterval($.proxy(this.next, this), this.options.interval);
      }
      return this;
    },
    
    next: function () {
      if (this.fading) {
        return;
      }
      return this.fade('next');
    },
    
    prev: function () {
      if (this.sliding) {
        return;
      }
      return this.fade('prev');
    },
    
    to: function (pos) {
      var activeIndex = this.getActiveIndex(),
      that = this;

      if ( pos > (this.$items.length - 1) || pos < 0 ) {
        return;
      }

      if ( this.fading ) {
        return this.element.one('faded', function () {
          that.to(pos);
        });
      }

      if ( activeIndex === pos ) {
        return this.pause().cycle();
      }

      return this.fade( pos > activeIndex ? 'next' : 'prev', $(this.$items[pos]));
    },    

    pause: function (e) {
          if (!e) {
            this.paused = true;
          }
          
          if ($(this.element).find('.next, .prev').length && this.transitionType() ) {
            this.element.trigger(this.transitionType);
            this.cycle();
          }

          clearInterval(this.interval);
          this.interval = null;
          return this;
        },    

    fade: function (type, next) {
      var $active = $(this.element).children('.active'),
          $next = next || $active[type](),
          direction = type === 'next' ? 'left' : 'right',
          that = this,
          e;

      // switch to fading state
      this.fading = true;
      
      // if we are at the last slide (e.g. no .next()) then fallback to beginning
      $next = $next.length ? $next : $(this.element).children().first();

      e = $.Event('fade', {
        relatedTarget: $next[0],
        direction: direction
      });

      if ( this.$indicators.length ) {
        this.$indicators.find('.active').removeClass('active');
        $(this.element).one('faded', function () {
          var $nextIndicator = $(that.$indicators.children()[that.getActiveIndex()]);
          if ( $nextIndicator ) {
            $nextIndicator.addClass('active');            
          }
        });
      }


      if ( this.transitionType ) {
        
        $(this.element).trigger(e);

        $next.addClass(type);
        $active.one( this.transitionType, function () {
          
          // when transition ends, cleanup transitioning classes
          $next.removeClass([type, direction].join(' ')).addClass('active');
          $active.removeClass(['active', direction].join(' '));
          $next.addClass('active');
          that.fading = false;
          
          $(that.element).trigger('faded');
        });
        $active.removeClass('active');
      }

      else {
       

       // Fallback to jQuery
        $(this.element).trigger(e);
        // $active.removeClass('active');
        // $next.addClass('active');
        this.fading = false;
        $(this.element).trigger('faded');
        $active.fadeOut(250, function() {
          $active.removeClass('active');
          $next.fadeIn(250).addClass('active');
        });

      }
        this.cycle();
    }
  };

  $.fn[simplefade] = function ( options ) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('simplefade');
      if (!data) {
        $this.data('simplefade', (data = new SimpleFade(this, options)));
      }
      else {
        new SimpleFade( this, options );
      }      
    });
  };  

 /* simpleFade DATA-API
  * ================= */

  $(document).on('click.simplefade.data-api', '[data-slide], [data-slide-to]', function (e) {
  
    var $this = $(this), 
    href,

    // regex strip for ie7
    target = $this.attr('data-target') || e.preventDefault() || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, ''),
    slideIndex = $this.attr('data-slide-to');
    
    if (slideIndex) {
      $(target).data('simplefade').pause().to(slideIndex);
    }

    e.preventDefault();
  }); 

})( jQuery, window, document );