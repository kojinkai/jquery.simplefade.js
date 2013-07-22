/* ==========================================================
 * Borrowed heavily from:
 * bootstrap-carousel.js v2.3.2
 * http://twitter.github.com/bootstrap/javascript.html#carousel
 * ==========================================================
 * 
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 *
 * ========================================================== */


;(function ( $, window, document, undefined ) {

  // Create the defaults once
  var simplefade = 'simplefade',
      defaults = {
        interval: 5000,
        startsWith: 0
      };

  function SimpleFade(element, options) {
    this.element = element;

    // Merge defaults and uder options
    this.options = $.extend( {}, defaults, options);
    
    this.$indicators = $(this.element).find('.fade-controls');

    this._defaults = defaults;
    this._name = simplefade;
    
    this.init();
  }

  SimpleFade.prototype = {
    
    init: function() {
      $(this.element).css('position', 'relative').children().css({'position': 'absolute', 'left': 0, 'right': 0});
      $(this.element).children().eq(this.options.startsWith).addClass('active');
      this.cycle();
    },

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
          // isCycling = this.interval,
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
      $(this.element).trigger(e);
      $active.removeClass('active');
      $next.addClass('active');
      this.fading = false;
      $(this.element).trigger('faded');

      // Start Cycling
      // this.cycle();
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
    // $(target).toggleClass(option.toggle);
    $(target).simplefade(option);
  }); 

})( jQuery, window, document );