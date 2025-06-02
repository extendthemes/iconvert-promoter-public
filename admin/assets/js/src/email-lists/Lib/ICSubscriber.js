import { ICModal } from "./ICModal";
import { SnackBarAlert } from '../../snack-bar-alert';

export const ICSubscriber = (() => {
    const $ = jQuery; 
    const ajaxURL = cs_promo_settings.ajax_url;  

    const setup = () => {
        const listElement = document.querySelector("#ic-listid");
        const __nonce = document.querySelector("#_wpnonce")?.value;
        let listID = 0;

        if(listElement) {
            listID = listElement?.value;
        }        
        
        deleteSubscriber(listID, __nonce);        
        editSubscriber(listID, __nonce);        
    }

    const editSubscriber = (listID, __nonce) => {
        const editButtons = document.querySelectorAll('.cs-el-edit');

        if (editButtons) {
            editButtons.forEach(item => {
                item.addEventListener('click', e => {
                    e.preventDefault();                    
                    const id = item.dataset.id;

                    getSubscriberFromServer({ action: "icp_subscribers_edit", post_id: id, _wpnonce: __nonce });
                });
            })
        }
    }; 

    const showEditSubscribeForm = (content, id, __nonce) => {
        const settings = {
            primary_button: 'Save',
            secondary_button: 'Cancel',
            callback: () => { return editSubscriberFromDB(id, __nonce) },
            size: 'custom'
        }
        ICModal.dialog('Edit subscriber', content, settings); 
    }

    const editSubscriberFromDB = (id, __nonce) => {

        const name = document.querySelector('input[name="name"]');
        const email = document.querySelector('input[name="email"]');
        const form = document.querySelector('#ic-create-list-form');        

        if (form.checkValidity()) {            
            email.classList.remove('is-invalid');

            $.post(ajaxURL, {
                action: 'icp_subscribers_update',
                post_id: id,
                name: name.value,
                email: email.value,
                _wpnonce: __nonce,
            }, (response) => {
                if (response && response.success) {                    
                    window.location.reload();
                } else {
                    SnackBarAlert.alertMessage('The subscriber was not updated!', 'error');
                    
                    return false;
                }
            });
        } else {
            email.classList.add('is-invalid')
            return false;
        }
    }

    const deleteSubscriber = (listID, __nonce) => {
        const deleteButtons = document.querySelectorAll('.cs-el-delete');        

        if (deleteButtons) {
            deleteButtons.forEach(item => {
                item.addEventListener('click', e => {
                    e.preventDefault();
                    const id = item.dataset.id
                    const settings = {
                        primary_button: 'Remove from this list',
                        secondary_button: 'Remove from all lists',
                        callback: () => { removeFromDB(listID, id, __nonce) },
                        secondary_callback: () => { removeFromDB(listID, id, __nonce, 'all') },
                        size: 'custom'
                    }
                    ICModal.dialog('Remove email list item', '<p>From where do you want to remove the email list item?<p>', settings);
                }); 
            })
        }
    };    

    const removeFromDB = (listID, id, __nonce, where = 'list') => {        
        
        $.post(ajaxURL, {
            action: 'icp_subscribers_delete',
            post_id: id,
            list_id: listID,
            where,
            _wpnonce: __nonce,
        }, (response) => {
            if (response && response.success) {                
                window.location.reload();
                return;
            } else {
                SnackBarAlert.alertMessage('The email was not deleted!', 'error');
            }
        });
    }

    const getSubscriberFromServer = (settings) => {
        $.ajax({
            type: 'GET',
            url: ajaxURL,
            data: settings
        }).then((response) => {            
            if (response.success) {
                showEditSubscribeForm(response.data.body, settings.post_id, settings._wpnonce)
            } 

            return false;
        });
    }

    return {
        setup        
    };
})();