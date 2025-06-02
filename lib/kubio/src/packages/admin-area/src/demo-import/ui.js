import {
	getPluginStateLabel,
	getSelectedDemoName,
	getSelectedDemoPlugins,
	getSelectedDemoThumb,
	getSelectedDemoIsFree,
	getPluginKubioProActiveState,
	getText,
	setSelectedDemoFromSlug,
} from './global';
import * as $ from 'jquery';
import { sprintf } from '@wordpress/i18n';
import { importPlugins } from './import-plugins';
import { castArray, once } from 'lodash';
import { importContent } from './import-content';

let lastScrollPosition = 0;

const setImportAvailability = (isAvailable) => {
	const $installerEl = $('#kubio-template-installing');
	const importButton = $installerEl.find(`#import-button`);
	const labelProOnly = $installerEl.find(`[data-available-pro-only]`);
	const checkProFeaturesButton = $installerEl.find(
		`[data-check-pro-features]`
	);

	if (isAvailable) {
		labelProOnly.addClass('hidden');
		checkProFeaturesButton.addClass('hidden');
		importButton.attr('data-start-import', '');
		importButton.show();
	} else {
		importButton.removeAttr('data-start-import');
		importButton.hide();
		labelProOnly.removeClass('hidden');
		checkProFeaturesButton.removeClass('hidden');
	}
};

const toggleTemplateView = (display = true) => {
	const $listEl = $('#kubio-templates-list');
	const $installerEl = $('#kubio-template-installing');

	if (display) {
		lastScrollPosition = window.scrollY;

		// show installer
		$listEl.hide();
		$installerEl.css('display', 'flex').hide().fadeIn(100);

		// set installer demo thum and name
		$installerEl.find(`img`).attr('src', getSelectedDemoThumb());

		// eslint-disable-next-line @wordpress/valid-sprintf
		const demoName = sprintf(
			getText('importing_template'),
			getSelectedDemoName()
		);
		$installerEl.find(`[data-title]`).html(demoName);

		// show plugins
		const plugins = getSelectedDemoPlugins();
		const $pluginsContainerEl = $installerEl.find('[data-plugins]');
		const $pluginsContainerListEl = $installerEl.find(
			'[data-plugins-list]'
		);

		if (plugins.length) {
			$pluginsContainerEl.show();
			$pluginsContainerListEl.empty();

			plugins.forEach((plugin) => {
				const state = getPluginStateLabel(plugin.slug);
				$pluginsContainerListEl.append(
					`<li><span>${plugin.label}</span><span>${state}</span></li>`
				);
			});
		} else {
			$pluginsContainerEl.hide();
		}

		//Allow import if Kubio PRO is intalled
		const isFreeDemo = getSelectedDemoIsFree();
		const pluginProActive = getPluginKubioProActiveState();

		if (pluginProActive || isFreeDemo) {
			// pluginActive || isFreeDemo
			setImportAvailability(true);
		} else {
			setImportAvailability(false);
		}
	} else {
		$installerEl.css('display', 'flex').hide();
		$('#kubio-templates-list').show();
		setTimeout(() => window.scrollTo(0, lastScrollPosition), 5);
	}
};

const startSiteImporting = async () => {
	$('.kubio-admin-page-header-start-editing').addClass('hidden'); //Hide Start Editing button

	const $installerEl = $('#kubio-template-installing');
	const $infoEL = $installerEl.find('[data-info]');
	const $progressEL = $installerEl.find('[data-progress]');
	const $mainButtons = $installerEl.find('[data-install-buttons]');
	const $successButtons = $installerEl.find('[data-install-success-buttons]');
	const $kubioProgressBar = $('.kubio-progress-bar');

	$infoEL.hide();
	$progressEL.css('display', 'flex').show();
	$mainButtons.hide();
	$kubioProgressBar.show();

	try {
		await importPlugins();
		await importContent();
	} catch (e) {
		displayErrorMessageAndStopImport();
	}

	$kubioProgressBar.hide();
	$successButtons.show();

	$('.kubio-admin-page-header-start-editing').removeClass('hidden'); //Show Start Editing button
};

const addUIEvents = () => {
	$(() => {
		$(document).on(
			'click',
			'#kubio-templates-list button[data-slug]',
			function () {
				const slug = $(this).data('slug');
				setSelectedDemoFromSlug(slug);
				toggleTemplateView();
			}
		);

		$(document).on(
			'click',
			'#kubio-template-installing button[data-cancel-import]',
			function () {
				toggleTemplateView(false);
			}
		);

		$(document).on(
			'click',
			'#kubio-template-installing button[data-start-import]',
			startSiteImporting
		);

		$(document).on('submit', '#kubio-import-demo-site', async (event) => {
			event.preventDefault();
			event.stopPropagation();

			const form = event.target;
			const formData = new window.FormData(form);
			stopMessageDisplayed = true;

			const progressBar = $(form).siblings('.kubio-progress-bar');
			progressBar.show();
			$(form).hide();
			try {
				await importContent(formData);
			} catch (e) {
				progressBar.hide();
				const errorMessage = getErrorMessageHTML(e);
				$('[data-kubio-manual-demo-site-errors]').append(
					`<div class="kubio-demo-site-manual-import-error">${errorMessage}</div>`
				);
			}

			progressBar.hide();
		});
	});
};

const installSteps = {
	PLUGINS: 'plugins',
	PREPARING: 'preparing',
	CONTENT: 'content',
};

const stepsMapping = {
	plugins: 'data-installing-plugins',
	preparing: 'data-preparing-for-import',
	content: 'data-importing-content',
};

const installStatus = {
	INACTIVE: '',
	PROGRESS: 'progress',
	DONE: 'active',
};

const setStepUIStatus = (step, status) => {
	const selector = `[data-progress-list] [${stepsMapping[step]}]`;
	$(selector).attr('class', status);
};
let stopMessageDisplayed = false;

const getErrorMessageHTML = (message) => {
	message = castArray(message);

	let messageHTML = '';

	message.forEach((m) => (messageHTML += `<p>${m}</p>`));

	return messageHTML;
};

const displayErrorMessage = (message) => {
	if (stopMessageDisplayed) {
		return;
	}

	const selector = `[data-importing-errors]`;
	$(selector).show();
	message = castArray(message);

	message.forEach((m) =>
		$(`${selector} [data-importing-errors-content]`).append(`<p>${m}</p>`)
	);
};

const displayErrorMessageAndStopImport = (message) => {
	if (!stopMessageDisplayed) {
		displayErrorMessage(message);
		displayErrorMessage(getText('import_stopped'));
		stopMessageDisplayed = true;
	}
	$('.kubio-progress-bar').hide();
	$('[data-progress-list] li').attr('class', '');
	throw message;
};

export {
	addUIEvents,
	setStepUIStatus,
	installSteps,
	installStatus,
	displayErrorMessage,
	displayErrorMessageAndStopImport,
};
