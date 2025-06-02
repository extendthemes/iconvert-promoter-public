const $  = jQuery;


const updateInputValue = (element,value)=>{
    const $element = $(element);

    switch ($element.attr('type')) {
        case 'checkbox':
            $element.prop('checked', value);
            break;
        case 'radio':
            $element.prop('checked', value);
            break;
        default:
            $element.val(value);
            break;

    }
}

export const triggerUIUpdateChange = (element) => {
    const $element = $(element);

    const customChangeEvent = $.Event('change');
    customChangeEvent._isPromoterUIUpdate = true;

    $element.trigger(customChangeEvent);
}

export const updateUIValue = (element,value)=>{

    const $element = $(element);

    switch ($element.prop('tagName')?.toLowerCase()) {
        case 'input':
            updateInputValue(element,value);
            break;
        default:
            $element.val(value);
            break;

        }

    triggerUIUpdateChange(element);

}

export const eventIsFromUIUpdate = (event) => {
    if (event && event._isPromoterUIUpdate) {
        return true;
    }

    return false;
}