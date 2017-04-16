/*-- smooth scrolling for anchor links --*/
$(function () {
  $('a.smooth').click(function () {
    if (location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '') && location.hostname === this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      if (target.length) {
        $('html,body').animate({
          scrollTop: target.offset().top
        }, 1000);
        return false;
      }
    }
  });
});

/*-- images respinsive --*/
$(function () {
  $("img").addClass("img-responsive");
});

/*-- iframe responsive --*/
$(function () {
  $("iframe").addClass("embed-responsive-item");
  $("iframe").parent().addClass('embed-responsive embed-responsive-16by9');
});

/*-- excerpt image --*/
$(function () {
  $('.excerpt img').remove();
});

/*-- blog pagination --*/
$(function (e) {
  $('.pagination .active a').click(function (e) {
    e.preventDefault();
  });
});

$(function () {
  $('.paginate-tab').click(function () {
    $(this).toggleClass('open');
    $(this).children('.fa').toggleClass('fa-angle-left fa-angle-right');
    $('.paginate-navigation').toggleClass('open');
  });
});

$(function () {
  if ($('#blog').length) {
    $(window).scroll(function () {
      var wScroll = $(this).scrollTop();

      if (wScroll > $('#blog').offset().top - $(window).height() / 145) {

        $('.paginate-wrapper').addClass('fixed');
      } else {

        $('.paginate-wrapper').removeClass('fixed');
      }
    });
  }
});

/*-- Navigation --*/
$(function () {
  $(window).scroll(function () {
    var wScroll = $(this).scrollTop();

    if (wScroll > $('.hero-container').offset().top - $(window).height() / 3.2) {
      $('.navbar').removeClass('normal');
      $('.navbar').addClass('fixed');
      $('.mobile-nav').addClass('block');
    } else {
      $('.navbar').removeClass('fixed');
      $('.navbar').addClass('normal');
      $('.mobile-nav').removeClass('block');
    }
    if (wScroll > $('.hero-container').offset().top - $(window).height() / 3.5) {
      $('.mobile-nav').addClass('down');
    } else {
      $('.mobile-nav').removeClass('down');
    }
  });
});

$(function () {
  $('.navbar-toggle').toggle(function () {
    $('.mobile-nav').addClass('drop');
    $('.navbar').addClass("dropDown");
    $('.navbar').addClass("drop");
  }, function () {
    $('.navbar').removeClass("drop");
    $('.mobile-nav').removeClass('drop');
    $('.navbar').delay(300).queue(function () {
      $(this).removeClass("dropDown").dequeue();
    });
  });
});