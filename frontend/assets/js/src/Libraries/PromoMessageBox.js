export const PromoMessageBox = (() => {   
    const $ = jQuery;
    const show = (message, settings = {}) => {
        const {
            okButton = "OK",
            animationClass = "animate__slideInUp",
        } = settings;

        const template = `
            <div class="promo-message-box">
                <div class="promo-message-text">${message}</div>
                <button class="promo-message-button">${okButton}</button>
            </div>
        `;

        if ($('.promo-message-box').length > 0) {
            $('.promo-message-box').remove();
        }
        $('body').append(template);
        const _message__box = $('.promo-message-box');

        _message__box.addClass(`visible animate__animated ${animationClass}`);

        $('.promo-message-button').on('click', function(){
            _message__box.remove();
        });
    }

    return {
        show
    }
})();