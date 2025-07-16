jQuery( "ul.promoter-menu-sidebar" ).css("min-height", jQuery("#reports-options").height());

const queryString = window.location.search; 
const selected_popup = queryString.split('=')[2];


function sanitize(str){
    str = str.replace(/[^a-z0-9áéíóúñü \.,_-]/gim,"");
    return str.trim();
}

// display only corresponding div to li element:
var optionIds = [];
jQuery(".promoter-menu-content > div").each((index, elem) => {
    jQuery(document).on ("click", "ul.promoter-menu-sidebar li:nth-child(" + (index + 1) + ")", function () {
        jQuery(".promoter-menu-content > div").css("display", "none");
        jQuery("ul.promoter-menu-sidebar > li > a.selected-promoter-option").removeClass('selected-promoter-option');
        jQuery("#" + elem.id).css("display", "block");
        jQuery("ul.promoter-menu-sidebar > li > a:eq(" + index + ")").addClass('selected-promoter-option');
        jQuery("ul.promoter-menu-sidebar").css("height", jQuery("#" + elem.id).height());
    });
});

if(selected_popup === undefined) {
    jQuery("ul.promoter-menu-sidebar li:nth-child(3)").hide();
    jQuery("ul.promoter-menu-sidebar li:nth-child(4)").hide();
    jQuery("ul.promoter-menu-sidebar li:nth-child(5)").hide();
} else {
    //populate triggers list
    
}

//show triggers inputs as select indicates
jQuery( "select#cs_promo-trigger-type" ).change(function() {
    jQuery( "#add-trigger-inputs" ).empty();
    triggers_inputs[jQuery( "select#cs_promo-trigger-type option:checked" ).val()].forEach((value, key) => {
        jQuery( "#add-trigger-inputs" ).append('<label>'+ value[0] +'</label>');
        jQuery( "#add-trigger-inputs" ).append('<input type="'+ value[1] +'" name="input-new-trigger['+key+']" id="input-new-trigger['+key+']" class="input-new-trigger" required><br>');
    });    
});

let createPopupHref = jQuery('#cs_promo-create-new-popup').attr('href');

function createNewPopup() {
    var type = jQuery( "select#cs_promo-popup-type option:checked" ).val();
    var name = sanitize(jQuery( "#cs_promo-popup-name" ).val());
    
    var newPopupHref = createPopupHref+'?popup_name='+name+'&popup_type='+type; 

    jQuery('#cs_promo-create-new-popup').attr('href', newPopupHref);
}

let addTriggerHref = jQuery('#cs_promo-add-new-trigger').attr('href');

function addNewTrigger() {
    var type = jQuery( "select#cs_promo-trigger-type option:checked" ).val();
    
    var newAddTriggerHref = addTriggerHref+'&trigger_type='+type; 

    var i=0;
    while(jQuery("#input-new-trigger\\["+i+"\\]").length){
        newAddTriggerHref+="&input"+i+"="+sanitize(jQuery("#input-new-trigger\\["+i+"\\]").val());
        i++;
    }

    jQuery('#cs_promo-add-new-trigger').attr('href', newAddTriggerHref);

    //check if required are completed
    ///...TBD...///
}

//recurring show dropdown on check only
if (! jQuery('#cs_promo-recurring-chk').is(':checked')) {
    jQuery('#cs_promo-recurring-drd').hide();
}

jQuery('#cs_promo-recurring-chk').change(function() {
    if (jQuery(this).is(':checked')) {
        jQuery('#cs_promo-recurring-drd').show();
    } else {
        jQuery('#cs_promo-recurring-drd').hide();
    }
});

function getDisplayOptions() {
    var inputValues = jQuery('#display-conditions-options :input').map(function() {
        var type = jQuery(this).prop("type");

        if ((type == "checkbox" ) && this.checked) { 
           return 1;
        }
        // all other fields, except buttons
        else if (type == "datetime-local") {
            return jQuery(this).val();
        } else if (type == "select-one")
            return jQuery(this).val();
        else return -1;
    });

    var linkTxt = "";
    inputValues.each((index, elem) => {
        linkTxt += elem + ",";
    });
    linkTxt = linkTxt.slice(0, -1);

    var initLink = jQuery('#cs_promo-display-options-submit').attr('href');
    var finalLink = initLink + "&params=" + linkTxt;

    jQuery('#cs_promo-display-options-submit').attr('href', finalLink);
}