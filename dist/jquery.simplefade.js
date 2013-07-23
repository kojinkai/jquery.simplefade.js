/*! simplefade - v0.0.1 - 2013-07-23
* https://github.com/kojinkai/simplefade
* Copyright (c) 2013 Lewis Nixon; Licensed MIT */
;(function ( $, window, document, undefined ) {

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
      if ( this.options.interval && !this.paused ) {
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
        $active.addClass(direction);
        $next.addClass(direction);

        $active.one( this.transitionType, function () {
          // when transition ends, cleanup transitioning classes
          $next.removeClass([type, direction].join(' ')).addClass('active');
          $active.removeClass(['active', direction].join(' '));
          that.sliding = false;
          
          $(that.element).trigger('faded');

        });
      }

      else {
       
        $(this.element).trigger(e);
        $active.removeClass('active');
        $next.addClass('active');
        this.fading = false;
        $(this.element).trigger('faded');
      }

    }
  };

  $.fn[simplefade] = function ( options ) {
    return this.each(function () {
      new SimpleFade( this, options );
    });
  };  

 /* simpleFade DATA-API
  * ================= */

  $(document).on('click.carousel.data-api', '[data-slide], [data-slide-to]', function (e) {
  
    var $this = $(this), 
    href,

    // regex strip for ie7
    target = $this.attr('data-target') || e.preventDefault() || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, ''),
    option = $this.data();
    $(target).simplefade(option);
  }); 

})( jQuery, window, document );