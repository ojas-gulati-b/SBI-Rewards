/**
 * 
 * Keep dashboard related code here
 */

/** Global vars */
var maxPoints = 10000;
var minPoints = 0;
var minStart = 20;
var maxStart = 4000

function expand(panelClass){
    var panel = '.search-section.' + panelClass;
    getElement(panel).classList.toggle('expanded');
}

function openProductPage(){
    window.open("product-details.html");
}

function selectSearchTag(event){
    event.target.classList.toggle('selected');
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

//update input field on slider update
pointsSlider.noUiSlider.on('update', function (values, handle) {
    const value = values[handle];
    if (handle) { // i.e. if handle with index 1 comes up
        inputFieldUpper.value = Math.round(value);
    }else
        inputFieldLower.value = Math.round(value);
});

// update slider when user clicks outside the box after entering the value
inputFieldLower.addEventListener('change', function () {
    // set lower value
    pointsSlider.noUiSlider.set([this.value, null]);
});

// update the slider after user presses enter key after entering the value
inputFieldLower.addEventListener('keydown', function (e) {

    if(e.which == 13){
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

    if(e.which == 13){
        // set upper value
        pointsSlider.noUiSlider.set([null, this.value]);
    }
});

function init() {
    window.addEventListener('load', function () {
        
        initializeCarousel('.category-carousel', {
            dots: false,
            //centerMode: true,
            // initialSlide: 1,
            arrows: true,
            slidesToShow: 10,
            slidesToScroll: 1,
            infinite: true,
            prevArrow: $('.rwd-category-carousel .carousel-container .carousel-prev'),
            nextArrow: $('.rwd-category-carousel .carousel-container .carousel-next'),
            variableWidth: true
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
        });
        
    })
}

init();