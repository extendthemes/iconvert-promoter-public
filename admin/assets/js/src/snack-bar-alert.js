export const SnackBarAlert = (() => {

    const $ = jQuery;
    let snackBar = false;

    const alertMessage = (aMessage, aStatus = null, options) => {
    
        const visibleSnackbar = $('.js-snackbar__wrapper');
        const keepInfo = options?.keepInfo ? options.keepInfo : false;

        if(visibleSnackbar.length > 0 && !keepInfo) {
          snackBar.Close();
        }
        
        snackBar = new SnackBar({
          message: aMessage,
          dismissible: true,
          status: aStatus,
          ...options,
        });
    }

    return {
      alertMessage,
	}
})()