---
layout: post
title:  Window Scroll
date: 2017-03-26 22:17:00
categories:
  - subpages
  - javascript
  - vanilla-js
tag:
  - js-vanilla
---
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras sed sapien quam. Sed dapibus est id enim facilisis, at posuere turpis adipiscing. Quisque sit amet dui dui.

<!-- code -->
    {% highlight ruby %}
      $(window).scroll(function(){

        var wScroll = $(this).scrollTop();

          if( wScroll > $('#section1').offset().top - ($(window).height() / 5.5) ){

          $('nav').addClass('nav-appear');

        }
        else {

          $('nav').removeClass('nav-appear');

        }

      });
    {% endhighlight %}
<!-- code -->
