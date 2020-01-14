/**
 * 
 * Keep Product Details related code here
 * 
 */
function isNumber(event) {
    var charCode = event.which || event.keyCode;
    return ((charCode >= 48 && charCode <= 57) && event.target.value.length < 6)
}
function checkPin(event) {
    var label = getElement('.pin-code-check-container .pin-code-input-box .pin-code-input-label')
    if (event.target.value)
        label.classList.add('value-present');
    else
        label.classList.remove('value-present');
}

function enterPinCode(){
    // perform delivery estimation functionality here
    var pinCodeInput = getElement('.pin-code-input-box #pinCode');
    if(pinCodeInput.value && pinCodeInput.value.length == 6 && pinCodeInput.checkValidity())
        getElement('#pinCodeDisclaimer').innerHTML = 'By Saturday, December 4 ';
}

function selectVoucherAmount(event){
    var voucherPills = document.querySelectorAll('.voucher-amount-selection .voucher-pills-container .voucher-pill');
    for( var i = 0; i < voucherPills.length; i++){
        voucherPills[i].classList.remove('selected');
    }
    event.target.classList.add('selected');
}

// Show More component code
var $el, $ps, $up, totalHeight;

$(".read-more .button").click(function () {

    totalHeight = 0

    $el = $(this);    // show more button
    $p = $el.parent();   // showmore button's parent
    $up = $('.fade-out-box');  //$up = $p.parent();    // 
    $content = $up.parent();
    $ps = $up.find("div.text");//$ps = $up.find("div:not('.read-more')");

    // measure how tall inside should be by adding together heights of all inside paragraphs (except read-more paragraph)
    $ps.each(function () {
        totalHeight += $(this).outerHeight();
    });

    $up.css({
        // Set height to prevent instant jumpdown when max height is removed
        "height": $up.height(),
        "max-height": 9999
    })
        .animate({
            "height": totalHeight
        });

    // fade out read-more
    $p.fadeOut();

    $content.css({
        "margin-bottom": 40
    });

    // prevent jump-down
    return false;

});

function expandTermsConditions(){
    var panel = '.product-terms-and-conditions';
    var panelBody = getElement(panel).querySelector('.rwd-product-tc-panel-body');
    getElement(panel).classList.toggle('expanded');
    if (panelBody.style.maxHeight)
        panelBody.style.maxHeight = null;
    else
        panelBody.style.maxHeight = panelBody.scrollHeight + "px";
}

function onPaymentModeChange(event, radioLabel){
    if(event.target.checked){
        if(radioLabel == 'Points')
            getElement('.item-code-container #item-code').innerHTML = 'APA01';
        else 
            getElement('.item-code-container #item-code').innerHTML = 'APA02';
    }
    
}

function selectThumbnail(event){
    var thumbnailDivs = document.querySelectorAll('.thumbnail-container .thumbnail');
    var selectedThumbnail = event.target;
    if(selectedThumbnail.tagName === 'IMG') // if inner image is selected then set thumbnail to the outer div
        selectedThumbnail = selectedThumbnail.parentElement
    var thumbImage = selectedThumbnail.querySelector('img');
    var mainImage = getElement('.main-image img');
    for( var i = 0; i < thumbnailDivs.length; i++){
        thumbnailDivs[i].classList.remove('selected');
    }
    selectedThumbnail.classList.add('selected');
    mainImage.src = thumbImage.src;
}

function initProduct(){
    $('.products-list-wrapper#related .items-carousel').on('init', function (event, slick) {
        slick.checkResponsive();
    });
    window.addEventListener('load', function () {
        initializeCarousel('.products-list-wrapper#related .items-carousel', {
            dots: true,
            // centerMode: true,
            // initialSlide: 1,
            arrows: true,
            slidesToShow: 4,
            slidesToScroll: 4,
            infinite: false,
            prevArrow: $('.products-list-wrapper#related .items-carousel-container .carousel-prev'),
            nextArrow: $('.products-list-wrapper#related .items-carousel-container .carousel-next'),
            // variableWidth: true
            responsive: [
                {
                    breakpoint: 1280,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 3,
                        variableWidth: true,

                    }
                },
                {
                    breakpoint: 980,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 2,
                        variableWidth: true,

                    }
                }
            ]
        });

    });
    
}

initProduct();