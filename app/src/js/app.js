/**
 * 
 * Keep common code here
 */

function getElement(selector) {
    return document.querySelector(selector);
}

function initializeCarousel(selector, options){
    var carousel = selector
    //$(document).ready(function(){
    $(carousel).slick(options);
      //});
}
