/**
 * 
 * Keep dashboard related code here
 */

/** Global vars */
var maxPoints = 10000;
var minPoints = 0;
var minStart = 20;
var maxStart = 4000;
var checkBoxesSelected = 0;
var searchPanelOffset = $('.rwd-main-section .rwd-search-panel-wrapper .search-panel').offset().top;
var numberOfSearchResults = 4;
var carouselsShown = [];

function expand(panelClass) {
    var panel = '.search-section.' + panelClass;
    var panelBody = getElement(panel).querySelector('.rwd-panel-body');
    getElement(panel).classList.toggle('expanded');
    if (panelBody.style.maxHeight)
        panelBody.style.maxHeight = null;
    else
        panelBody.style.maxHeight = panelBody.scrollHeight + "px";
}

function selectSearchTag(event) {
    event.target.classList.toggle('selected');
}

function searchProduct(event){
    var charCode = event.which || event.keyCode;
    if (charCode === 13) {  //checks whether the pressed key is "Enter"
        if(event.target.value.length > 0){
            getElement('#dash-normal-results').classList.add('rwd-hidden');
            getElement('#dash-search-results').classList.remove('rwd-hidden');
            //add search call here
            getElement('#rwd-number-of-results').innerHTML = numberOfSearchResults;
            getElement('#dash-search-results .rwd-search-heading-2 .search-text').innerHTML = event.target.value;
        }
       
    }
    
}
function checkCancelIcon(event){
    if(event.target.value.length > 0){
        getElement('.rwd-search-panel-wrapper .search-panel .search-input-wrapper .remove-search-text').classList.remove('rwd-hidden');
    } else {
        getElement('.rwd-search-panel-wrapper .search-panel .search-input-wrapper .remove-search-text').classList.add('rwd-hidden');
    }
}


function removeSearchResults(){
    getElement('#dash-normal-results').classList.remove('rwd-hidden');
    getElement('#dash-search-results').classList.add('rwd-hidden');
    getElement('.rwd-search-panel-wrapper .search-panel .search-input-wrapper .remove-search-text').classList.add('rwd-hidden');
}

/** Range slider for Points in Search panel */
var pointsSlider = document.getElementById('range-slider-points');
noUiSlider.create(pointsSlider, {
    start: [minStart, maxStart],
    connect: [false, true, false],
    step: 1,
    orientation: 'horizontal', // 'horizontal' or 'vertical'
    range: {
        'min': minPoints,
        'max': maxPoints
    },

});

var inputFieldLower = document.getElementById('lower-range-input');
var inputFieldUpper = document.getElementById('upper-range-input');

var headerFieldLower = getElement('.search-section.points .rwd-expansion-panel .rwd-panel-head .control .select.value #lower');
var headerFieldUpper = getElement('.search-section.points .rwd-expansion-panel .rwd-panel-head .control .select.value #upper');

//update input field on slider update
pointsSlider.noUiSlider.on('update', function (values, handle) {
    const value = values[handle];
    if (handle) { // i.e. if handle with index 1 comes up
        inputFieldUpper.value = Math.round(value);
        headerFieldUpper.innerHTML = Math.round(value);
    } else {
        inputFieldLower.value = Math.round(value);
        headerFieldLower.innerHTML = Math.round(value);
    }

});

// update slider when user clicks outside the box after entering the value
inputFieldLower.addEventListener('change', function () {
    // set lower value
    pointsSlider.noUiSlider.set([this.value, null]);
});

// update the slider after user presses enter key after entering the value
inputFieldLower.addEventListener('keydown', function (e) {

    if (e.which == 13) {
        // set lower value
        pointsSlider.noUiSlider.set([this.value, null]);
    }
});

// update slider when user clicks outside the box after entering the value
inputFieldUpper.addEventListener('change', function () {
    // set upper value
    pointsSlider.noUiSlider.set([null, this.value]);
});

// update the slider after user presses enter key after entering the value
inputFieldUpper.addEventListener('keydown', function (e) {

    if (e.which == 13) {
        // set upper value
        pointsSlider.noUiSlider.set([null, this.value]);
    }
});

function onCategorySelectSearch(event, category) {
    var allCheckBox = document.querySelectorAll('.search-section.category .rwd-panel-body .selection-container input');
    
    if (event.target.name === 'all') { // If the All checkbox is selected
        for (var i = 0; i < allCheckBox.length; i++) {
            if (event.target.checked) {
                allCheckBox[i].checked = true;

                if (allCheckBox[i].name !== 'all') {
                    checkBoxesSelected = allCheckBox.length - 1; // excluding 'All' checkbox
                    addCategoryPill(allCheckBox[i].name);
                }
            } else {
                allCheckBox[i].checked = false;
                checkBoxesSelected = 0;
                if (allCheckBox[i].name !== 'all')
                    removeCategoryPill(undefined, allCheckBox[i].name);
            }
        }
    } else {
        // if individual checkboxes are selected
        if (event.target.checked) {
            if (event.target.name !== 'all') {
                addCategoryPill(event.target.name);
                checkBoxesSelected++;
                showSearchedCategoryCarousel(event.target.name);
            }
        }
        else {
            getElement('.search-section.category .rwd-panel-body .selection-container input#categ-all').checked = false;
            if (event.target.name !== 'all')
                checkBoxesSelected--;
            removeCategoryPill(undefined, event.target.name);
        }
    }
    resetCategroryCheckboxSelectedCount();

}

function resetCategroryCheckboxSelectedCount() {
    var headerSelectionCount = getElement('.search-section.category .rwd-panel-head .control .select');

    if (checkBoxesSelected === 0) {
        headerSelectionCount.classList.remove('value');
        headerSelectionCount.innerHTML = 'Select';
        resetSearchedCategoryCarousel();
    } else {
        headerSelectionCount.classList.add('value');
        headerSelectionCount.innerHTML = '(' + checkBoxesSelected + ')';
    }
}

function addCategoryPill(checkboxName) {
    var allPills = getElement('.rwd-items-wrapper .rwd-categories-panel .category-pills-container .rwd-tag.category-tags.cancellable');
    if (!allPills) {
        getElement('.rwd-items-wrapper .rwd-categories-panel').classList.remove('rwd-hidden')
    }
    var checkBox = '.search-section.category .rwd-panel-body .selection-container .rwd-checkbox-container input[name ="' + checkboxName + '"]';
    var label = $(checkBox).parent().parent().parent().find('.label')[0].innerText;
    // If the category is alreay not present in the category tags pane --> then add
    if (!getElement('.rwd-items-wrapper .rwd-categories-panel .category-pills-container .rwd-tag.category-tags.cancellable#' + checkboxName + '-pill')) {
        var tagToInsert = '<div class="rwd-tag category-tags cancellable" id="' + checkboxName + '-pill">' + label + '<div class="rwd-tag-close" onclick="removeCategoryPill(event)"></div></div>';
        $('.rwd-items-wrapper .rwd-categories-panel .category-pills-container').append(tagToInsert);
    }

}

function removeCategoryPill(event, checkBoxName) {
    var pill, assCheckBoxName, checkBox, assPill, allPills;

    if (checkBoxName) {
        assPill = checkBoxName + '-pill';
        pill = getElement('.rwd-items-wrapper .rwd-categories-panel .category-pills-container .rwd-tag.category-tags.cancellable#' + assPill);
        checkBox = getElement('.search-section.category .rwd-panel-body .selection-container .rwd-checkbox-container input[name ="' + checkBoxName + '"]');
        removeCategoryCarousel(checkBoxName);
    } else {
        pill = event.target.parentNode;
        assCheckBoxName = pill.id.split('-')[0];
        checkBox = getElement('.search-section.category .rwd-panel-body .selection-container .rwd-checkbox-container input[name ="' + assCheckBoxName + '"]');
        checkBoxesSelected--;
        removeCategoryCarousel(assCheckBoxName);

    }
    //remove all option search bar anyways
    getElement('.search-section.category .rwd-panel-body .selection-container input#categ-all').checked = false;

    pill.parentNode.removeChild(pill);
    checkBox.checked = false;
    allPills = getElement('.rwd-items-wrapper .rwd-categories-panel .category-pills-container .rwd-tag.category-tags.cancellable');
    if (!allPills) {
        getElement('.rwd-items-wrapper .rwd-categories-panel').classList.add('rwd-hidden');
    }
    resetCategroryCheckboxSelectedCount();
}

function onCategoryCarouselSelection(name, device) {
    var allCheckBox = document.querySelectorAll('.search-section.category .rwd-panel-body .selection-container input');
    var headerSelectionCount = getElement('.search-section.category .rwd-panel-head .control .select');
    var ifCheckBoxSelected = false, carouselExists = false;
    
    for (var i = 0; i < carouselsShown.length; i++) {
        if(carouselsShown[i] === name)
            carouselExists = true;
    }
    if(!carouselExists) {
        getElement('.search-section.category .rwd-panel-body .selection-container input[name=' + name + ']').checked = true;
        checkBoxesSelected++;
        headerSelectionCount.innerHTML = '(' + checkBoxesSelected + ')';
        addCategoryPill(name);
        carouselsShown.push(name);
        showSearchedCategoryCarousel();
    }
    
}

function showSearchedCategoryCarousel(carousel) {
    var allCarousels = document.querySelectorAll('.products-list-wrapper');
    var selectedCarousel;

    for (var i = 0; i < allCarousels.length; i++) {
        allCarousels[i].classList.add('rwd-hidden');
    }
    /** Code to show neccessary carousel here */
    for (var i = 0; i < carouselsShown.length; i++) {
        selectedCarousel = getElement('.products-list-wrapper#' + carouselsShown[i]);
        selectedCarousel.classList.remove('rwd-hidden');
    }
    
    // selectedCarousel.classList.remove('rwd-hidden');
}

function removeCategoryCarousel(checkbox) {
    for (var i = 0; i < carouselsShown.length; i++) {
        if(carouselsShown[i] === checkbox){
            document.querySelector('.products-list-wrapper#' + checkbox).classList.add('rwd-hidden');
            carouselsShown.splice(i, 1)
        }
    }
    
    if(carouselsShown.length == 0){
        var allCarousels = document.querySelectorAll('.products-list-wrapper');
        for (var i = 0; i < allCarousels.length; i++) {
            allCarousels[i].classList.remove('rwd-hidden');
        }
    }
}

function resetSearchedCategoryCarousel(){
    var allCarousels = document.querySelectorAll('.products-list-wrapper');
    for (var i = 0; i < allCarousels.length; i++) {
        allCarousels[i].classList.remove('rwd-hidden');
    }
}

/* function moveScroller() {
    var $anchor = $(".rwd-main-section .rwd-search-panel-wrapper .search-panel");
    var $scroller = $('#scroller');

    var move = function () {
        var tem1 = $(window).scrollTop();
        var tem2 =$(window).height();
        var st = $(window).scrollTop() + $(window).height();
        var tem=$anchor.offset();
        var ot = $anchor.offset().top + $anchor.height();
        if (st > ot) {
            $anchor.css({
                position: "fixed",
                bottom: "0px",
                width: '280px',
            });
        } else if(tem.top === tem1){
            $anchor.css({
                position: "static",
                top: ""
            });
        }
    };
    $(window).scroll(move);
    move();
} */

/* function sticktothebottom() {
    var h = window.innerHeight;
    var window_top = $(window).scrollTop();
    var top = $('#stick-here').offset().top;
    var panelh = $(".rwd-main-section .rwd-search-panel-wrapper .search-panel").height();
    if (window_top + h > top + 22) {
        $('.rwd-main-section .rwd-search-panel-wrapper .search-panel').addClass('stick');
        $('#stick-here').height($('#stickThis').outerHeight());
    } 
    
    if (window_top + top < panelh + (22 * 2)) {
        $('#stickThis').removeClass('stick');
        $('#stick-here').height(0);
    }
}
$(function() {
    $(window).scroll(sticktothebottom);
    sticktothebottom();
}); */
$(window).scroll(function () {

    var bh = $(window).height();
    var st = $(window).scrollTop();
    var el = $('.rwd-main-section .rwd-search-panel-wrapper .search-panel');
    var eh = el.height();
    
    if (st >= (searchPanelOffset + eh +30) - bh) {
        //fix the positon and leave the green bar in the viewport
        el.css({
            position: 'fixed',
            width: 280,
            bottom: 30
        });
    }
    else {
        // return element to normal flow
        el.removeAttr("style");
    }

});

function init() {
    window.addEventListener('load', function () {

        /* $('.rwd-category-carousel .category-carousel').on('init', function (event, slick) {
            slick.checkResponsive();
        }); */
        console.log('init');
        initializeCarousel('.rwd-category-carousel .category-carousel', {
            dots: false,
            arrows: true,
            slidesToShow: 10,
            slidesToScroll: 1,
            infinite: true,
            prevArrow: $('.rwd-category-carousel .carousel-container .carousel-prev'),
            nextArrow: $('.rwd-category-carousel .carousel-container .carousel-next'),
            //variableWidth: true,
            //mobileFirst: true,
            respondTo : 'slider',
            responsive: [
                {
                    breakpoint: 5000,
                    settings: {
                        slidesToShow: 10,
                        slidesToScroll: 1,
                        //variableWidth: false,
                        //mobileFirst: true,
                    }
                },
                
                {
                    breakpoint: 1179,
                    settings: {
                        slidesToShow: 8,
                        slidesToScroll: 1,
                        //variableWidth: false,
                        //mobileFirst: true,
                    }
                },
                {
                    breakpoint: 923,
                    settings: {
                        slidesToShow: 7,
                        slidesToScroll: 1,
                        //variableWidth: false,
                        //mobileFirst: true,
                    }
                },
                {
                    breakpoint: 870,
                    settings: {
                        slidesToShow: 6,
                        slidesToScroll: 1,
                        //variableWidth: false,
                        //mobileFirst: true,
                    }
                },
                /* {
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 7,
                        variableWidth: false,
                        //mobileFirst: true,
                    }
                },
                {
                    breakpoint: 980,
                    settings: {
                        slidesToShow: 7,
                        variableWidth: false,
                        //mobileFirst: true,
                    }
                },
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 6,
                        variableWidth: false,
                        //mobileFirst: true,
                    }
                } */
            ]
        });


        initializeCarousel('.carousel-container.mid-page .category-carousel', {
            dots: false,
            //centerMode: true,
            // initialSlide: 1,
            arrows: true,
            slidesToShow: 7,
            slidesToScroll: 1,
            infinite: true,
            prevArrow: $('.carousel-container.mid-page .carousel-prev'),
            nextArrow: $('.carousel-container.mid-page .carousel-next'),
            variableWidth: true,
            responsive: [
                {
                    breakpoint: 1280,
                    settings: {
                        slidesToShow: 5,
                        variableWidth: false,
                    }
                },
                {
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 5,
                        variableWidth: false,
                    }
                },
                {
                    breakpoint: 980,
                    settings: {
                        slidesToShow: 4,
                        variableWidth: false,
                    }
                },
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 3,
                        variableWidth: false,
                    }
                }
            ]
        });
        $('.products-list-wrapper#offers .items-carousel').on('init', function (event, slick) {
            slick.checkResponsive();
        });
        initializeCarousel('.products-list-wrapper#offers .items-carousel', {
            dots: true,
            //centerMode: true,
            // initialSlide: 1,
            arrows: true,
            slidesToShow: 3,
            slidesToScroll: 3,
            infinite: false,
            prevArrow: $('.products-list-wrapper#offers .items-carousel-container .carousel-prev'),
            nextArrow: $('.products-list-wrapper#offers .items-carousel-container .carousel-next'),
            // variableWidth: true
            responsive: [
                {
                    breakpoint: 1280,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 2,
                        variableWidth: true,

                    }
                }
            ]
        });
        $('.products-list-wrapper#electronics .items-carousel').on('init', function (event, slick) {
            slick.checkResponsive();
        });
        initializeCarousel('.products-list-wrapper#electronics .items-carousel', {
            dots: true,
            //centerMode: true,
            // initialSlide: 1,
            arrows: true,
            slidesToShow: 3,
            slidesToScroll: 3,
            infinite: false,
            prevArrow: $('.products-list-wrapper#electronics .items-carousel-container .carousel-prev'),
            nextArrow: $('.products-list-wrapper#electronics .items-carousel-container .carousel-next'),
            // variableWidth: true
            responsive: [
                {
                    breakpoint: 1280,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 2,
                        variableWidth: true,

                    }
                }
            ]
        });
        $('.products-list-wrapper#entertainment .items-carousel').on('init', function (event, slick) {
            slick.checkResponsive();
        });
        initializeCarousel('.products-list-wrapper#entertainment .items-carousel', {
            dots: true,
            //centerMode: true,
            // initialSlide: 1,
            arrows: true,
            slidesToShow: 3,
            slidesToScroll: 3,
            infinite: false,
            prevArrow: $('.products-list-wrapper#entertainment .items-carousel-container .carousel-prev'),
            nextArrow: $('.products-list-wrapper#entertainment .items-carousel-container .carousel-next'),
            // variableWidth: true
            responsive: [
                {
                    breakpoint: 1280,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 2,
                        variableWidth: true,

                    }
                }
            ]
        });
        $('.products-list-wrapper#offers-2 .items-carousel').on('init', function (event, slick) {
            slick.checkResponsive();
        });
        initializeCarousel('.products-list-wrapper#offers-2 .items-carousel', {
            dots: true,
            //centerMode: true,
            // initialSlide: 1,
            arrows: true,
            slidesToShow: 3,
            slidesToScroll: 3,
            infinite: false,
            prevArrow: $('.products-list-wrapper#offers-2 .items-carousel-container .carousel-prev'),
            nextArrow: $('.products-list-wrapper#offers-2 .items-carousel-container .carousel-next'),
            // variableWidth: true
            responsive: [
                {
                    breakpoint: 1280,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 2,
                        variableWidth: true,

                    }
                }
            ]
        });
        $('.products-list-wrapper#electronics-2 .items-carousel').on('init', function (event, slick) {
            slick.checkResponsive();
        });
        initializeCarousel('.products-list-wrapper#electronics-2 .items-carousel', {
            dots: true,
            //centerMode: true,
            // initialSlide: 1,
            arrows: true,
            slidesToShow: 3,
            slidesToScroll: 3,
            infinite: false,
            prevArrow: $('.products-list-wrapper#electronics-2 .items-carousel-container .carousel-prev'),
            nextArrow: $('.products-list-wrapper#electronics-2 .items-carousel-container .carousel-next'),
            // variableWidth: true
            responsive: [
                {
                    breakpoint: 1280,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 2,
                        variableWidth: true,

                    }
                }
            ]
        });
        $('.products-list-wrapper#entertainment-2 .items-carousel').on('init', function (event, slick) {
            slick.checkResponsive();
        });
        initializeCarousel('.products-list-wrapper#entertainment-2 .items-carousel', {
            dots: true,
            //centerMode: true,
            // initialSlide: 1,
            arrows: true,
            slidesToShow: 3,
            slidesToScroll: 3,
            infinite: false,
            prevArrow: $('.products-list-wrapper#entertainment-2 .items-carousel-container .carousel-prev'),
            nextArrow: $('.products-list-wrapper#entertainment-2 .items-carousel-container .carousel-next'),
            // variableWidth: true
            responsive: [
                {
                    breakpoint: 1280,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 2,
                        variableWidth: true,

                    }
                }
            ]
        });
        $('.products-list-wrapper#offers-3 .items-carousel').on('init', function (event, slick) {
            slick.checkResponsive();
        });
        initializeCarousel('.products-list-wrapper#offers-3 .items-carousel', {
            dots: true,
            //centerMode: true,
            // initialSlide: 1,
            arrows: true,
            slidesToShow: 3,
            slidesToScroll: 3,
            infinite: false,
            prevArrow: $('.products-list-wrapper#offers-3 .items-carousel-container .carousel-prev'),
            nextArrow: $('.products-list-wrapper#offers-3 .items-carousel-container .carousel-next'),
            // variableWidth: true
            responsive: [
                {
                    breakpoint: 1280,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 2,
                        variableWidth: true,

                    }
                }
            ]
        });
        $('.products-list-wrapper#electronics-3 .items-carousel').on('init', function (event, slick) {
            slick.checkResponsive();
        });
        initializeCarousel('.products-list-wrapper#electronics-3 .items-carousel', {
            dots: true,
            //centerMode: true,
            // initialSlide: 1,
            arrows: true,
            slidesToShow: 3,
            slidesToScroll: 3,
            infinite: false,
            prevArrow: $('.products-list-wrapper#electronics-3 .items-carousel-container .carousel-prev'),
            nextArrow: $('.products-list-wrapper#electronics-3 .items-carousel-container .carousel-next'),
            // variableWidth: true
            responsive: [
                {
                    breakpoint: 1280,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 2,
                        variableWidth: true,

                    }
                }
            ]
        });
        $('.products-list-wrapper#entertainment-3 .items-carousel').on('init', function (event, slick) {
            slick.checkResponsive();
        });
        initializeCarousel('.products-list-wrapper#entertainment-3 .items-carousel', {
            dots: true,
            //centerMode: true,
            // initialSlide: 1,
            arrows: true,
            slidesToShow: 3,
            slidesToScroll: 3,
            infinite: false,
            prevArrow: $('.products-list-wrapper#entertainment-3 .items-carousel-container .carousel-prev'),
            nextArrow: $('.products-list-wrapper#entertainment-3 .items-carousel-container .carousel-next'),
            // variableWidth: true
            responsive: [
                {
                    breakpoint: 1280,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 2,
                        variableWidth: true,

                    }
                }
            ]
        });
        initializeCarousel('.rwd-image-carousel .rwd-carousel-container .image-carousel', {
            dots: false,
            centerMode: true,
            centerPadding: '150px',
            // initialSlide: 0,
            arrows: false,
            slidesToShow: 2,
            slidesToScroll: 1,
            infinite: true,
            // prevArrow: $('.products-list-wrapper#entertainment .items-carousel-container .carousel-prev'),
            // nextArrow: $('.products-list-wrapper#entertainment .items-carousel-container .carousel-next'),
            // variableWidth: true,
            //autoplay: true,
            autoplaySpeed: 3000,
        });

        // Make search panel sticky
        /* $(".rwd-main-section .rwd-search-panel-wrapper .search-panel").stick_in_parent({
            parent: $('.rwd-body-wrapper')
        }); */

        searchPanelOffset = $('.rwd-main-section .rwd-search-panel-wrapper .search-panel').offset().top;

    })
}

init();