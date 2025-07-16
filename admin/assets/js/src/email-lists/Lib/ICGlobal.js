import { SnackBarAlert } from "../../snack-bar-alert";

export const ICGlobal = (() => {
    const $ = jQuery;  

    const checkFlashMessages = () => {
        const fleshMessagesSelector = $("#ic-flash-messages .cs-flash-messages .cs-flash-message");
        const message = fleshMessagesSelector.html();
        const messageType = fleshMessagesSelector.data('type');

        const amOptions = {
            timeout: ( messageType === 'success' ? 5000 : false )
        }        

        if(fleshMessagesSelector.length > 0) {
            SnackBarAlert.alertMessage(message, messageType, amOptions );
        }
    }

    return {
        checkFlashMessages        
    };
})();