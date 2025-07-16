export const PromoHelpers = (() => {
    const parseJSON = (str) => {
        try {
            const parsed = JSON.parse(str);

            if (parsed && typeof parsed === "object") {
                return parsed;
            }
        }
        catch (e) { }

        return false;
    };

    const copyToClipboard = (textToCopy) => {
        if (navigator.clipboard && window.isSecureContext) {
            return navigator.clipboard.writeText(textToCopy);
        } else {
            const textArea = document.createElement("textarea");
            textArea.value = textToCopy;
            textArea.style.position = "fixed";
            textArea.style.left = "-999999px";
            textArea.style.top = "-999999px";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            return new Promise((res, rej) => {
                document.execCommand('copy') ? res() : rej();
                textArea.remove();
            });
        }
    }

    const promoDelay = (time) => {
        return new Promise(resolve => setTimeout(resolve, time));
    }

    const selectorCompose = (typeSelector, valueSelector) => {
        switch (typeSelector) {
            case 'class':
                if (valueSelector.startsWith('.')) {
                    return valueSelector;
                }
                return '.' + valueSelector;

            case 'id':
                if (valueSelector.startsWith('#')) {
                    return valueSelector;
                }
                return '#' + valueSelector;

            default:
                return valueSelector;
        }
    }

    const isPreviewPage = () => {
        return (document.body.classList.contains('single-cs-promo-popups')  || window.location.search.includes('__iconvert-promoter-preview'));
    }

    return {
        parseJSON,
        copyToClipboard,
        promoDelay,
        selectorCompose,
        isPreviewPage
    }
})();