import apiFetch from '@wordpress/api-fetch';

const importKubioBlog = async () =>
	await apiFetch({ path: 'kubio/v1/3rd_party_themes/import_blog' });

export { importKubioBlog };
