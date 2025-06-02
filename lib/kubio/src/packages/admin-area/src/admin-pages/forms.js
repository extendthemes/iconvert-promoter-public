import * as $ from 'jquery';
import { __ } from '@wordpress/i18n';
import { getKubioUrlWithRestPrefix } from '@kubio/constants';

// Activation forms
// Purchase tab form
const formUpgrade = $(
	'#upgrade_to_pro_wrapper #kubio-page-builder-activate-license-form'
);
let form = formUpgrade;

// Activate notice
const formActivate = $('.notice #kubio-page-builder-activate-license-form');
if (formActivate.length) {
	form = formActivate;
}

// Check license error
const formCheck = $('#kubio-page-builder-check-license form');
if (formCheck.length) {
	form = formCheck;
}

if (form.length) {
	const keyInput = form.find('input[type=text]'),
		formWrapper = form.parent(),
		message = formWrapper.find(
			'#kubio-page-builder-activate-license-message'
		),
		description = formWrapper.find('.description'),
		loader = formWrapper.find('.spinner-holder');

	function getHTMLContent(text) {
		const content = jQuery(document.createElement('div')).append(text);
		content.find('input,button,script,style').remove();

		if (content.find('body').length) {
			return content.find('body').html();
		}

		return content.html();
	}

	function hideMessage() {
		message.hide();
	}

	function showErrorMessage(messageText) {
		hideStatus();
		message.attr('class', 'message error-message');

		message.html(getHTMLContent(messageText));
		message.show();
	}

	function showStatus(icon = '', messageText = '') {
		form.hide();
		message.hide();
		description.hide();
		loader.show();

		if ('' !== icon) {
			if ('loader' === icon) {
				loader.removeClass('ok');
				loader.find('.icon .loader').show();
			} else if ('ok' === icon) {
				loader.addClass('ok');
			}
		}

		if ('' !== messageText) {
			loader.find('.message').text(messageText);
		}
	}

	function hideStatus() {
		form.show();
		message.show();
		description.show();
		loader.hide();
	}

	keyInput.on('keyup change', hideMessage);

	form.on('submit', function (event) {
		event.preventDefault();
		event.stopPropagation();
		const key = keyInput.val();
		if (!key) {
			showErrorMessage(__('License key is empty', 'kubio'));
			return;
		}

		hideMessage();
		showStatus('loader', __('Loading…', 'kubio'));
		form.addClass('disabled');

		wp.ajax
			.send(getKubioUrlWithRestPrefix('kubiowp-page-builder-activate'), {
				data: {
					key,
				},
			})
			.done(function (response) {
				if (formUpgrade.length) {
					showStatus('loader', __('Installing Kubio PRO…', 'kubio'));

					wp.ajax
						.post(
							getKubioUrlWithRestPrefix(
								'kubiowp-page-builder-maybe-install-pro'
							)
						)
						.done(function () {
							showStatus(
								'ok',
								__('Kubio PRO sucessfully installed', 'kubio')
							);
						})
						.fail(function (response) {
							if (response.message) {
								showErrorMessage(response.message);
							} else {
								showErrorMessage(
									__(
										'There was an error installing the Kubio PRO plugin',
										'kubio'
									)
								);
							}
						});
				} else {
					showStatus(
						'ok',
						response || __('Activated successfully', 'kubio')
					);
				}
			})
			.fail(function (response) {
				hideStatus();
				form.removeClass('disabled');
				showErrorMessage(response.responseJSON.data);
			});
	});

	if (formCheck.length) {
		if (!window.wp || !window.wp.ajax) {
		} else {
			wp.ajax
				.send(
					getKubioUrlWithRestPrefix(
						'kubiowp-page-builder-check-license'
					)
				)
				.fail(function (response) {
					form.closest('.notice').removeClass('hidden');
					showErrorMessage(
						getHTMLContent(response.responseJSON.data)
					);
				});
		}
	}
}
