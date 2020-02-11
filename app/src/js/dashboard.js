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
var changesMade = false;
var categoryCheckBoxSelectionMap = {};
var pointsSliderRange = [];
var initialLoad = true;

var mobileFiltersApplied = 0;
var mobileSearchTextEntered = false;
var appliedFilterExpanded = false
var filterHeaderFixed = false

function expand(panelClass) {
    var panel = '.search-section.' + panelClass;
    var panelBody = getElement(panel).querySelector('.rwd-panel-body');
    getElement(panel).classList.toggle('expanded');
    if (panelBody.style.maxHeight)
        panelBody.style.maxHeight = null;
    else
        panelBody.style.maxHeight = panelBody.scrollHeight + "px";
}

function expandFilterPanelMobile() {
    var panel = '.rwd-applied-filter-menu';
    var panelBody = getElement(panel).querySelector('.filter-panel-body');
    var tabBody = $('.rwd-dashboard .tabs-body');
    getElement(panel).classList.toggle('expanded');
    if (panelBody.style.maxHeight) {
        panelBody.style.maxHeight = null;
        appliedFilterExpanded = false;
        if (filterHeaderFixed)
            tabBody.css({ 'top': '60px' });
    }
    else {
        panelBody.style.maxHeight = panelBody.scrollHeight + "px";
        //tabBody.css({ 'top': '140px' });
        appliedFilterExpanded = true;
        if (filterHeaderFixed)
            tabBody.css({ 'top': '119px' });
        /* else
            tabBody.css({ 'top': '60px' }); */
    }
}

function expandSearchMobile(expanded) {
    if (expanded)
        getElement('.rwd-search-items-mobile-wrapper').classList.add('expanded');
    else {
        getElement('.rwd-search-items-mobile-wrapper').classList.remove('expanded');
        getElement('#dash-normal-results').classList.remove('rwd-hidden');
        getElement('#dash-search-results').classList.add('rwd-hidden');
        getElement('.rwd-category-carousel').classList.remove('rwd-hidden');
        getElement('.rwd-image-carousel.rwd-mobile').classList.remove('rwd-hidden');
        $('#searchProductMobile').val('');
        mobileSearchTextEntered = false;
    }

}

function selectSearchTag(event) {
    event.target.classList.toggle('selected');
}

function expandApplyFilterMobile() {
    getElement('.body-wrapper').classList.add('rwd-hidden');
    getElement('.rwd-apply-filter-overlay').classList.add('expanded');
    setTimeout(function () {
        getInputStatesOnFilterOpen();
    });

}

function closeFilterPanelMobile() {
    getElement('.rwd-apply-filter-overlay').classList.remove('expanded');
    getElement('.body-wrapper').classList.remove('rwd-hidden');
    disableApplyChangesButton();

}

function selectFilterCategoryMobile(category) {
    var categories = document.querySelectorAll('.rwd-apply-filter-overlay .rwd-filter-container-mobile .filter-category-heading-wrapper .filter-category');
    var selectedCategory = getElement('.rwd-apply-filter-overlay .rwd-filter-container-mobile .filter-category-heading-wrapper .filter-category.' + category);
    var panels = document.querySelectorAll('.rwd-apply-filter-overlay .rwd-filter-container-mobile .filter-categories-wrapper .filter-category-panel');
    var panel = getElement('.rwd-apply-filter-overlay .rwd-filter-container-mobile .filter-categories-wrapper .filter-category-panel.' + category);
    for (var i = 0; i < categories.length; i++) {
        categories[i].classList.remove('selected');
    }
    selectedCategory.classList.add('selected');
    for (var i = 0; i < panels.length; i++) {
        panels[i].classList.add('rwd-hidden');
    }
    panel.classList.remove('rwd-hidden');

}

function searchProduct(event, device) {
    var charCode = event.which || event.keyCode;
    if (device == 'desktop') {
        // if search done on desktop mode
        if (charCode === 13) {  //checks whether the pressed key is "Enter"
            if (event.target.value.length > 0) {
                getElement('#dash-normal-results').classList.add('rwd-hidden');
                getElement('#dash-search-results').classList.remove('rwd-hidden');
                //add search call here
                getElement('#rwd-number-of-results').innerHTML = numberOfSearchResults;
                getElement('#dash-search-results .rwd-search-heading-2 .search-text').innerHTML = event.target.value;
            }
        }
    } else {
        // if search done on mobile mode
        if (event.target.value.length > 0) {
            mobileSearchTextEntered = true;
            getElement('#dash-normal-results').classList.add('rwd-hidden');
            getElement('#dash-search-results').classList.remove('rwd-hidden');
            getElement('.rwd-category-carousel').classList.add('rwd-hidden');
            getElement('.rwd-image-carousel.rwd-mobile').style.display = 'none';
            //add search call here
            getElement('#dash-search-results .rwd-search-heading-1 .search-text').innerHTML = event.target.value;
        }
    }

}
function checkCancelIcon(event) {
    if (event.target.value.length > 0) {
        getElement('.rwd-search-panel-wrapper .search-panel .search-input-wrapper .remove-search-text').classList.remove('rwd-hidden');
    } else {
        getElement('.rwd-search-panel-wrapper .search-panel .search-input-wrapper .remove-search-text').classList.add('rwd-hidden');
    }
}


function removeSearchResults() {
    getElement('#dash-normal-results').classList.remove('rwd-hidden');
    getElement('#dash-search-results').classList.add('rwd-hidden');
    getElement('.rwd-search-panel-wrapper .search-panel .search-input-wrapper .remove-search-text').classList.add('rwd-hidden');
}

/** Range slider for Points in Search panel DESKTOP */
var pointsSlider = document.getElementById('range-slider-points');
if (pointsSlider)
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
if (pointsSlider)
    pointsSlider.noUiSlider.on('update', function (values, handle) {
        var value = values[handle];
        if (handle) { // i.e. if handle with index 1 comes up
            inputFieldUpper.value = Math.round(value);
            headerFieldUpper.innerHTML = Math.round(value);
        } else {
            inputFieldLower.value = Math.round(value);
            headerFieldLower.innerHTML = Math.round(value);
        }

    });

// update slider when user clicks outside the box after entering the value
if (inputFieldLower)
    inputFieldLower.addEventListener('change', function () {
        // set lower value
        pointsSlider.noUiSlider.set([this.value, null]);
    });

// update the slider after user presses enter key after entering the value
if (inputFieldLower)
    inputFieldLower.addEventListener('keydown', function (e) {

        if (e.which == 13) {
            // set lower value
            pointsSlider.noUiSlider.set([this.value, null]);
        }
    });

// update slider when user clicks outside the box after entering the value
if (inputFieldUpper)
    inputFieldUpper.addEventListener('change', function () {
        // set upper value
        pointsSlider.noUiSlider.set([null, this.value]);
    });

// update the slider after user presses enter key after entering the value
if (inputFieldUpper)
    inputFieldUpper.addEventListener('keydown', function (e) {
        if (e.which == 13) {
            // set upper value
            pointsSlider.noUiSlider.set([null, this.value]);
        }
    });


/** Range slider for Points in Search panel MOBILE */
var pointsSliderMobile = document.getElementById('range-slider-points-mobile');
if (pointsSliderMobile)
    noUiSlider.create(pointsSliderMobile, {
        start: [minStart, maxStart],
        connect: [false, true, false],
        step: 1,
        orientation: 'horizontal', // 'horizontal' or 'vertical'
        range: {
            'min': minPoints,
            'max': maxPoints
        },

    });

var inputFieldLowerMobile = document.getElementById('lower-range-input-mobile');
var inputFieldUpperMobile = document.getElementById('upper-range-input-mobile');

//update input field on slider update
if (pointsSliderMobile)
    pointsSliderMobile.noUiSlider.on('update', function (values, handle) {
        var value = values[handle];
        if (handle) { // i.e. if handle with index 1 comes up
            inputFieldUpperMobile.value = Math.round(value);
        } else {
            inputFieldLowerMobile.value = Math.round(value);
        }
        if (initialLoad) {
            initialLoad = false;
        } else {
            enableApplyChangesButton();
        }
    });

// update slider when user clicks outside the box after entering the value
if (inputFieldLowerMobile)
    inputFieldLowerMobile.addEventListener('change', function () {
        // set lower value
        pointsSliderMobile.noUiSlider.set([this.value, null]);
        enableApplyChangesButton();
    });

// update the slider after user presses enter key after entering the value
if (inputFieldLowerMobile)
    inputFieldLowerMobile.addEventListener('keydown', function (e) {

        if (e.which == 13) {
            // set lower value
            pointsSliderMobile.noUiSlider.set([this.value, null]);
        }
        enableApplyChangesButton();
    });

// update slider when user clicks outside the box after entering the value
if (inputFieldUpperMobile)
    inputFieldUpperMobile.addEventListener('change', function () {
        // set upper value
        pointsSliderMobile.noUiSlider.set([null, this.value]);
        enableApplyChangesButton();
    });

// update the slider after user presses enter key after entering the value
if (inputFieldUpperMobile)
    inputFieldUpperMobile.addEventListener('keydown', function (e) {

        if (e.which == 13) {
            // set upper value
            pointsSliderMobile.noUiSlider.set([null, this.value]);
        }
        enableApplyChangesButton();
    });

function onCategorySelectSearch(event, device) {
    var allCheckBox;
    if (device == 'desktop') {
        allCheckBox = document.querySelectorAll('.search-section.category .rwd-panel-body .selection-container input');
    }
    else if (device == 'mobile') {
        allCheckBox = document.querySelectorAll('.rwd-apply-filter-overlay .rwd-filter-container-mobile .filter-categories-wrapper .filter-category-panel.category .selection-container input');
    }

    if (event.target.name === 'all') { // If the All checkbox is selected
        for (var i = 0; i < allCheckBox.length; i++) {
            if (event.target.checked) {
                allCheckBox[i].checked = true;

                if (allCheckBox[i].name !== 'all') {
                    checkBoxesSelected = allCheckBox.length - 1; // excluding 'All' checkbox
                    addCategoryPill(allCheckBox[i].name, device);
                }
                enableApplyChangesButton();
            } else {
                allCheckBox[i].checked = false;
                checkBoxesSelected = 0;
                if (allCheckBox[i].name !== 'all')
                    removeCategoryPill(undefined, device, allCheckBox[i].name);
            }
        }
    } else {
        // if individual checkboxes are selected
        if (event.target.checked) {
            if (event.target.name !== 'all') {
                addCategoryPill(event.target.name, device);
                checkBoxesSelected++;
                showSearchedCategoryCarousel(event.target.name);
            }
            enableApplyChangesButton();
        }
        else {
            getElement('.search-section.category .rwd-panel-body .selection-container input#categ-all').checked = false;
            if (event.target.name !== 'all')
                checkBoxesSelected--;
            removeCategoryPill(undefined, device, event.target.name);
        }
    }
    resetCategroryCheckboxSelectedCount(device);

}

function resetCategroryCheckboxSelectedCount(device) {
    var headerSelectionCount;
    if (device == 'desktop') {
        headerSelectionCount = getElement('.search-section.category .rwd-panel-head .control .select');
    }
    else if (device == 'mobile') {
        headerSelectionCount = getElement('.rwd-apply-filter-overlay .rwd-filter-container-mobile .filter-category-heading-wrapper .filter-category.category .select-count');
    }

    if (checkBoxesSelected === 0) {
        headerSelectionCount.classList.remove('value');
        if (device == 'desktop')
            headerSelectionCount.innerHTML = 'Select';
        else
            headerSelectionCount.innerHTML = '';
        resetSearchedCategoryCarousel()
    } else {
        if (device == 'desktop')
            headerSelectionCount.classList.add('value');

        headerSelectionCount.innerHTML = '(' + checkBoxesSelected + ')';
    }
}

function addCategoryPill(checkboxName, device) {
    var allPills, checkBox, label, tagToInsert;
    if (device == 'desktop') {
        allPills = getElement('.rwd-items-wrapper .rwd-categories-panel .category-pills-container .rwd-tag.category-tags.cancellable');
        checkBox = '.search-section.category .rwd-panel-body .selection-container .rwd-checkbox-container input[name ="' + checkboxName + '"]';
        if (!allPills) {
            getElement('.rwd-items-wrapper .rwd-categories-panel').classList.remove('rwd-hidden')
        }
    } else {
        allPills = getElement('.rwd-applied-filter-menu .filter-panel-body .rwd-categories-panel .category-pills-container .rwd-tag.category-tags.cancellable');
        checkBox = '.rwd-apply-filter-overlay .rwd-filter-container-mobile .filter-categories-wrapper .filter-category-panel.category .selection-container input[name ="' + checkboxName + '"]';
    }
    label = $(checkBox).parent().parent().parent().find('.label')[0].innerText;
    // If the category is already not present in the category tags pane --> then add
    if (device == 'desktop') {
        if (!getElement('.rwd-items-wrapper .rwd-categories-panel .category-pills-container .rwd-tag.category-tags.cancellable#' + checkboxName + '-pill')) {
            tagToInsert = '<div class="rwd-tag category-tags cancellable" id="' + checkboxName + '-pill">' + label + '<div class="rwd-tag-close" onclick="removeCategoryPill(event, \'desktop\')"></div></div>';
            $('.rwd-items-wrapper .rwd-categories-panel .category-pills-container').append(tagToInsert);
        }
    } else {
        if (!getElement('.rwd-applied-filter-menu .filter-panel-body .rwd-categories-panel .category-pills-container .rwd-tag.category-tags.cancellable#' + checkboxName + '-pill')) {
            tagToInsert = '<div class="rwd-tag category-tags cancellable" id="' + checkboxName + '-pill">' + label + '<div class="rwd-tag-close" onclick="removeCategoryPill(event, \'mobile\')"></div></div>';
            $('.rwd-applied-filter-menu .filter-panel-body .rwd-categories-panel .category-pills-container').append(tagToInsert);
            mobileFiltersApplied++;
            ifFiltersPresentMobile();
        }

    }


}

function removeCategoryPill(event, device, checkBoxName) {
    var pill, assCheckBoxName, checkBox, assPill, allPills;

    if (checkBoxName) {
        assPill = checkBoxName + '-pill';
        if (device == 'desktop') {
            pill = getElement('.rwd-items-wrapper .rwd-categories-panel .category-pills-container .rwd-tag.category-tags.cancellable#' + assPill);
            checkBox = getElement('.search-section.category .rwd-panel-body .selection-container .rwd-checkbox-container input[name ="' + checkBoxName + '"]');
        } else {
            pill = getElement('.rwd-applied-filter-menu .filter-panel-body .rwd-categories-panel .category-pills-container .rwd-tag.category-tags.cancellable#' + assPill);
            checkBox = getElement('.rwd-apply-filter-overlay .rwd-filter-container-mobile .filter-categories-wrapper .filter-category-panel.category .selection-container input[name ="' + checkBoxName + '"]');
        }

        removeCategoryCarousel(checkBoxName);
    } else {
        pill = event.target.parentNode;
        assCheckBoxName = pill.id.split('-')[0];
        if (device == 'desktop') {
            checkBox = getElement('.search-section.category .rwd-panel-body .selection-container .rwd-checkbox-container input[name ="' + assCheckBoxName + '"]');
        } else {
            checkBox = getElement('.rwd-apply-filter-overlay .rwd-filter-container-mobile .filter-categories-wrapper .filter-category-panel.category .selection-container input[name ="' + assCheckBoxName + '"]');
        }

        checkBoxesSelected--;
        removeCategoryCarousel(assCheckBoxName);

    }
    //remove all option search bar anyways
    if (device == 'desktop')
        getElement('.search-section.category .rwd-panel-body .selection-container input#categ-all').checked = false;
    else
        getElement('.rwd-apply-filter-overlay .rwd-filter-container-mobile .filter-categories-wrapper .filter-category-panel.category .selection-container input#categ-all').checked = false;

    if (pill) {
        pill.parentNode.removeChild(pill);
        checkBox.checked = false;
        allPills = getElement('.rwd-items-wrapper .rwd-categories-panel .category-pills-container .rwd-tag.category-tags.cancellable');
        if (device == 'desktop' & !allPills) {
            getElement('.rwd-items-wrapper .rwd-categories-panel').classList.add('rwd-hidden');
        }
        if (device == 'mobile') {
            mobileFiltersApplied--;
            ifFiltersPresentMobile();
        }
        resetCategroryCheckboxSelectedCount(device);
    }

}

function onCategoryCarouselSelection(name, device) {
    var allCheckBox = document.querySelectorAll('.search-section.category .rwd-panel-body .selection-container input');
    var headerSelectionCount;
    var ifCheckBoxSelected = false, carouselExists = false;
    if (device == 'desktop') {
        headerSelectionCount = getElement('.search-section.category .rwd-panel-head .control .select');
    } else {
        headerSelectionCount = getElement('.rwd-apply-filter-overlay .rwd-filter-container-mobile .filter-category-heading-wrapper .filter-category.category .select-count');
    }

    for (var i = 0; i < carouselsShown.length; i++) {
        if (carouselsShown[i] === name)
            carouselExists = true;
    }
    if (!carouselExists) {
        if (device == 'desktop') {
            getElement('.search-section.category .rwd-panel-body .selection-container input[name=' + name + ']').checked = true;
        } else {
            getElement('.rwd-apply-filter-overlay .rwd-filter-container-mobile .filter-categories-wrapper .filter-category-panel.category .selection-container input[name ="' + name + '"]').checked = true;
        }

        checkBoxesSelected++;
        headerSelectionCount.innerHTML = '(' + checkBoxesSelected + ')';
        addCategoryPill(name, device);
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
        if (carouselsShown[i] === checkbox) {
            document.querySelector('.products-list-wrapper#' + checkbox).classList.add('rwd-hidden');
            carouselsShown.splice(i, 1)
        }
    }

    if (carouselsShown.length == 0) {
        var allCarousels = document.querySelectorAll('.products-list-wrapper');
        for (var i = 0; i < allCarousels.length; i++) {
            allCarousels[i].classList.remove('rwd-hidden');
        }
    }
}

function resetSearchedCategoryCarousel() {
    var allCarousels = document.querySelectorAll('.products-list-wrapper');
    for (var i = 0; i < allCarousels.length; i++) {
        allCarousels[i].classList.remove('rwd-hidden');
    }
}

function ifFiltersPresentMobile(trigger) {
    if (getElement('.rwd-applied-filter-menu .filter-menu-icon .toggle-filters-icon')) {
        if (mobileFiltersApplied > 0) {

            getElement('.rwd-applied-filter-menu .filter-menu-icon .toggle-filters-icon').classList.remove('rwd-hidden');
        } else {
            getElement('.rwd-applied-filter-menu .filter-menu-icon .toggle-filters-icon').classList.add('rwd-hidden');
            if (!trigger)
                expandFilterPanelMobile();
        }
        getElement('.rwd-applied-filter-menu .filter-menu-icon #filter-number').innerHTML = mobileFiltersApplied;
    }

}

function clearAllFiltersMobile() {
    var allCheckBoxes = document.querySelectorAll('.rwd-apply-filter-overlay .rwd-filter-container-mobile .filter-categories-wrapper .filter-category-panel.category .selection-container input');
    //Reset checkboxes
    for (var i = 0; i < allCheckBoxes.length; i++) {

        if (allCheckBoxes[i].name !== 'all' && allCheckBoxes[i].checked == true) {

            checkBoxesSelected--;
            removeCategoryPill(undefined, 'mobile', allCheckBoxes[i].name);
        }
        allCheckBoxes[i].checked = false;
    }
    //resetCategroryCheckboxSelectedCount();

    // Reset slider and inputs
    pointsSliderMobile.noUiSlider.updateOptions({
        start: [minStart, maxStart]
    });

    enableApplyChangesButton()
}

function getInputStatesOnFilterOpen() {
    var allCheckBoxes = document.querySelectorAll('.rwd-apply-filter-overlay .rwd-filter-container-mobile .filter-categories-wrapper .filter-category-panel.category .selection-container input');

    for (var i = 0; i < allCheckBoxes.length; i++) {
        categoryCheckBoxSelectionMap[allCheckBoxes[i].name] = allCheckBoxes[i].checked;
    }
    pointsSliderRange[0] = inputFieldLowerMobile.value;
    pointsSliderRange[1] = inputFieldUpperMobile.value;
}

function setPreviousInputStatesOnFilter() {
    var allCheckBoxes = document.querySelectorAll('.rwd-apply-filter-overlay .rwd-filter-container-mobile .filter-categories-wrapper .filter-category-panel.category .selection-container input');

    for (var i = 0; i < allCheckBoxes.length; i++) {
        var stateDiff = allCheckBoxes[i].checked !== categoryCheckBoxSelectionMap[allCheckBoxes[i].name];
        allCheckBoxes[i].checked = categoryCheckBoxSelectionMap[allCheckBoxes[i].name];
        if (allCheckBoxes[i].name !== 'all') {
            if (!allCheckBoxes[i].checked) {
                if (stateDiff)
                    checkBoxesSelected--;
                removeCategoryPill(undefined, 'mobile', allCheckBoxes[i].name);
                /* (function(name){
                    setTimeout(function(){
                        removeCategoryPill(undefined, 'mobile', name);
                    }, 5000);
                })(allCheckBoxes[i].name); */


            } else {
                if (stateDiff)
                    checkBoxesSelected++;
                addCategoryPill(allCheckBoxes[i].name, 'mobile');
                resetCategroryCheckboxSelectedCount('mobile');
            }
        }
    }
    pointsSliderMobile.noUiSlider.updateOptions({
        start: pointsSliderRange
    });
}

function enableApplyChangesButton() {
    changesMade = true;
    var button = getElement('.rwd-apply-filter-overlay .apply-cancel-section .apply-filters');
    button.removeAttribute("disabled");
    //getInputStatesOnFilterOpen();
}

function disableApplyChangesButton() {
    var button = getElement('.rwd-apply-filter-overlay .apply-cancel-section .apply-filters');
    button.setAttribute("disabled", true);
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

function loadMore(id) {
    if(getElement('.products-list-wrapper#' + id) && getElement('.products-list-wrapper#' + id).classList.contains('rwd-hidden')){
        getElement('.products-list-wrapper#' + id).classList.remove('rwd-hidden');
        $('.products-list-wrapper#' + id + '.items-carousel').on('init', function (event, slick) {
            slick.checkResponsive();
        });
        initializeCarousel('.products-list-wrapper#' + id + ' .items-carousel', getProductCarouselOptionsObject(id));
    }
}

var dashboard = document.querySelector('.body-wrapper');
$(window).scroll(function () {

    /* var bh = $(window).height();
    var st = $(window).scrollTop();
    var el = $('.rwd-main-section .rwd-search-panel-wrapper .search-panel');
    var eh = el.height();
    var fh = $('.sbi-eregs-footer').height();
    var footer = $('.sbi-eregs-footer');
    if (st >= (searchPanelOffset + eh + 30) - bh) {
        //fix the positon and leave the green bar in the viewport
        el.css({
            position: 'fixed',
            width: 280,
            bottom: 20
        });
    }
    else {
        // return element to normal flow
        el.removeAttr("style");
    }
    if(el.offset().top + el.height() >= footer.offset().top - 10){
        el.css({
            position:  'absolute',
            width: 280,
            }   
        );
    } */
    var el = $('.rwd-main-section .rwd-search-panel-wrapper .search-panel');
    var searchHeading = $('.rwd-main-section .rwd-search-panel-wrapper .search-heading');
    var footer = $('.sbi-eregs-footer');
    var wrapper = $('.rwd-main-section .rwd-search-panel-wrapper');
    var searchPanelWidth = 280;
    var panelHeight = $('.search-heading').height() +  $('.search-panel').height() + 20;
    if($(window).width() > 767){

        if($(window).height() - $('.rwd-header').height() <= panelHeight){
    
           var stickyValue =  panelHeight + $('.rwd-main-section').offset().top - ($(window).height() - 45);
        }else{
            var stickyValue =  $('.rwd-main-section').offset().top - $('.rwd-header').height() - 35 ;
        }
           console.log(stickyValue);
        
        if ($(this).scrollTop() > (stickyValue)) {
            if ($(window).width() >= 1240 && $(window).width() <= 1280) {
                searchPanelWidth = 240
            }
            if($(window).height() - $('.rwd-header').height() <= panelHeight){
                el.css({ 'position': 'fixed', 'bottom': '30px', 'width': searchPanelWidth, 'top': 'unset' });
            }else{
                el.css({ 'position': 'fixed', 'top': '200px', 'width': searchPanelWidth, 'bottom': 'unset' });
            }
            
            searchHeading.css({ 'position': 'fixed', 'top': '150px', 'width': searchPanelWidth, 'bottom': 'unset' });
            //wrapper.css({ 'margin-right': '149px' });
        }
        if ($(this).scrollTop() < (stickyValue)) {
            if ($(window).width() >= 1240 && $(window).width() <= 1280) {
                searchPanelWidth = 240
            }
            if($(window).height() - $('.rwd-header').height() <= panelHeight){
                el.css({ 'position': 'static', 'top': '0px', 'width': searchPanelWidth , 'bottom': 'unset'});
            }
            else{
                el.css({ 'position': 'static', 'top': '0px', 'width': searchPanelWidth });
            }
            searchHeading.css({ 'position': 'static', 'top': '0px', 'width': searchPanelWidth });
            //wrapper.removeAttr("style");
        }
    }
    if (el.offset().top + el.height() >= footer.offset().top - 30) {
        el.css({
            position: 'absolute',
            width: searchPanelWidth,
            bottom: 30,
            top: 'auto'
        });
        searchHeading.css({
            position: 'absolute',
            width: searchPanelWidth,
            bottom: 515,
            top: 'auto'
        });
    }

    //infinite scroll code
    var a =$(window).scrollTop(), b = $(window).height(), c=$(document).height(), d=$('.sbi-eregs-footer').height();
    if ($(window).scrollTop() + $(window).height() > ($(document).height() - $('.sbi-eregs-footer').height())) {
        loadMore('entertainment-2');
    }

});

$(window).scroll(function (e) {
    var $el = $('.rwd-applied-filter-menu');
    var tabBody = $('.rwd-dashboard .tabs-body');
    var isPositionFixed = ($el.css('position') == 'fixed');
    var offset = $el.offset().top;
    if ($(window).width() <= 960) {
        if ($(this).scrollTop() > 187) {//203
            filterHeaderFixed = true;
            $el.css({ 'position': 'fixed', 'top': '0px' });
            if (appliedFilterExpanded) {
                tabBody.css({ 'top': '139px' }); //119
            }
            else {
                tabBody.css({ 'top': '60px' });
            }

        }
        if ($(this).scrollTop() < 187) {
            filterHeaderFixed = false;
            $el.css({ 'position': 'static', 'top': '0px' });
            tabBody.css({ 'top': '0px' });
        }
    }
});

function getProductCarouselOptionsObject(carouselID) {
    return {
        dots: true,
        //centerMode: true,
        // initialSlide: 1,
        arrows: true,
        slidesToShow: 3,
        slidesToScroll: 3,
        infinite: false,
        prevArrow: $('.products-list-wrapper#' + carouselID + ' .items-carousel-container .carousel-prev'),
        nextArrow: $('.products-list-wrapper#' + carouselID + ' .items-carousel-container .carousel-next'),
        // variableWidth: true
        responsive: [
            {
                breakpoint: 1281,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    variableWidth: true,

                }
            },
            {
                breakpoint: 960,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    variableWidth: true,
                    dots: false,
                    arrows: false
                }
            }
        ]
    }
}

function init() {
    window.addEventListener('load', function () {

        ifFiltersPresentMobile('init');

        /* $('.rwd-category-carousel .category-carousel').on('init', function (event, slick) {
            slick.checkResponsive();
        }); */
        console.log('init');
        initializeCarousel('.rwd-category-carousel .carousel-container.rwd-desktop .category-carousel', {
            dots: false,
            arrows: true,
            slidesToShow: 10,
            slidesToScroll: 4,
            infinite: true,
            prevArrow: $('.rwd-category-carousel .carousel-container.rwd-desktop .carousel-prev'),
            nextArrow: $('.rwd-category-carousel .carousel-container.rwd-desktop .carousel-next'),
            //variableWidth: true,
            //mobileFirst: true,
            respondTo: 'slider',
            responsive: [
                {
                    breakpoint: 5000,
                    settings: {
                        slidesToShow: 10,
                        slidesToScroll: 4,
                        arrows: true,
                        prevArrow: $('.rwd-category-carousel .carousel-container.rwd-desktop .carousel-prev'),
                        nextArrow: $('.rwd-category-carousel .carousel-container.rwd-desktop .carousel-next'),
                        //variableWidth: false,
                        //mobileFirst: true,
                    }
                },

                {
                    breakpoint: 1179,
                    settings: {
                        slidesToShow: 8,
                        slidesToScroll: 4,
                        //variableWidth: false,
                        //mobileFirst: true,
                    }
                },
                {
                    breakpoint: 923,
                    settings: {
                        slidesToShow: 7,
                        slidesToScroll: 4,
                        //variableWidth: false,
                        //mobileFirst: true,
                    }
                },
                {
                    breakpoint: 859,
                    settings: {
                        slidesToShow: 6,
                        slidesToScroll: 4,
                        //variableWidth: false,
                        //mobileFirst: true,
                    }
                },
            ]
        });

        initializeCarousel('.rwd-category-carousel .carousel-container.rwd-mobile .category-carousel', {
            dots: false,
            arrows: false,
            slidesToShow: 7,
            slidesToScroll: 3,
            infinite: true,
            prevArrow: $('.rwd-category-carousel .carousel-container.rwd-mobile .carousel-prev'),
            nextArrow: $('.rwd-category-carousel .carousel-container.rwd-mobile .carousel-next'),
            //variableWidth: true,
            //mobileFirst: true,
            respondTo: 'slider',
            responsive: [
                {
                    breakpoint: 514,
                    settings: {
                        slidesToShow: 3,
                        variableWidth: false,
                    }
                },
                {
                    breakpoint: 614,
                    settings: {
                        slidesToShow: 5,
                        variableWidth: false,
                    }
                },
                {
                    breakpoint: 714,
                    settings: {
                        slidesToShow: 6,
                        variableWidth: false,
                    }
                },
                {
                    breakpoint: 814,
                    settings: {
                        slidesToShow: 7,
                        variableWidth: false,
                    }
                },
            ]
        });


        initializeCarousel('.carousel-container.mid-page.rwd-desktop .category-carousel', {
            dots: false,
            //centerMode: true,
            // initialSlide: 1,
            arrows: true,
            slidesToShow: 7,
            slidesToScroll: 4,
            infinite: true,
            prevArrow: $('.carousel-container.mid-page.rwd-desktop .carousel-prev'),
            nextArrow: $('.carousel-container.mid-page.rwd-desktop .carousel-next'),
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
        initializeCarousel('.carousel-container.mid-page.rwd-mobile .category-carousel', {
            dots: false,
            arrows: true,
            slidesToShow: 7,
            slidesToScroll: 3,
            infinite: true,
            prevArrow: $('.carousel-container.mid-page.rwd-mobile .carousel-prev'),
            nextArrow: $('.carousel-container.mid-page.rwd-mobile .carousel-next'),
            //variableWidth: true,
            //mobileFirst: true,
            respondTo: 'slider',
            responsive: [
                {
                    breakpoint: 514,
                    settings: {
                        slidesToShow: 3,
                        variableWidth: false,
                    }
                },
                {
                    breakpoint: 614,
                    settings: {
                        slidesToShow: 5,
                        variableWidth: false,
                    }
                },
                {
                    breakpoint: 714,
                    settings: {
                        slidesToShow: 6,
                        variableWidth: false,
                    }
                },
                {
                    breakpoint: 814,
                    settings: {
                        slidesToShow: 7,
                        variableWidth: false,
                    }
                },
            ]
        });
        $('.products-list-wrapper#offers .items-carousel').on('init', function (event, slick) {
            slick.checkResponsive();
        });
        initializeCarousel('.products-list-wrapper#offers .items-carousel', getProductCarouselOptionsObject('offers'));
        $('.products-list-wrapper#electronics .items-carousel').on('init', function (event, slick) {
            slick.checkResponsive();
        });
        initializeCarousel('.products-list-wrapper#electronics .items-carousel', getProductCarouselOptionsObject('electronics'));
        $('.products-list-wrapper#entertainment .items-carousel').on('init', function (event, slick) {
            slick.checkResponsive();
        });
        initializeCarousel('.products-list-wrapper#entertainment .items-carousel', getProductCarouselOptionsObject('entertainment'));
        $('.products-list-wrapper#offers-2 .items-carousel').on('init', function (event, slick) {
            slick.checkResponsive();
        });
        initializeCarousel('.products-list-wrapper#offers-2 .items-carousel', getProductCarouselOptionsObject('offers-2'));
        $('.products-list-wrapper#electronics-2 .items-carousel').on('init', function (event, slick) {
            slick.checkResponsive();
        });
        initializeCarousel('.products-list-wrapper#electronics-2 .items-carousel', getProductCarouselOptionsObject('electronics-2'));

        initializeCarousel('.rwd-image-carousel.rwd-desktop .rwd-carousel-container .image-carousel', {
            dots: false,
            centerMode: true,
            centerPadding: '150px',
            // initialSlide: 0,
            arrows: true,
            slidesToShow: 2,
            slidesToScroll: 1,
            infinite: true,
            prevArrow: $('.rwd-image-carousel.rwd-desktop .rwd-carousel-container .carousel-prev'),
            nextArrow: $('.rwd-image-carousel.rwd-desktop .rwd-carousel-container .carousel-next'),
            // variableWidth: true,
            //autoplay: true,
            autoplaySpeed: 3000,
        });
        initializeCarousel('.rwd-image-carousel.rwd-mobile .rwd-carousel-container .image-carousel', {
            dots: false,
            //centerMode: true,
            //centerPadding: '150px',
            initialSlide: 0,
            arrows: false,
            slidesToShow: 2,
            slidesToScroll: 1,
            infinite: true,
            variableWidth: true,
            //autoplay: true,
        });

        // Make search panel sticky
        /* $(".rwd-main-section .rwd-search-panel-wrapper .search-panel").stick_in_parent({
            parent: $('.rwd-body-wrapper')
        }); */

        searchPanelOffset = $('.rwd-main-section .rwd-search-panel-wrapper .search-panel').offset().top;
        disableApplyChangesButton(); // set apply filter button in mobile to disabled
    })
}

init();