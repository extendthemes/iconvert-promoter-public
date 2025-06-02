<?php
namespace KPromo;

use KPromo\Core\Utils;

function kubio_save_entity_rest_endpoint( \WP_REST_Request $request ) {
	$post_data  = (object) $request['postData'];
	$new_status = $request['status'];
	$type       = $request['type'];
	return apply_filters( Utils::getStringWithNamespacePrefix( "kubio/save-template-entity/{$post_data->type}/{$new_status}" ), $post_data, $type );
}

add_action(
	'rest_api_init',
	function () {
		$namespace = Utils::getKubioUrlWithRestPrefix( 'kubio/v1' );

		register_rest_route(
			$namespace,
			'/save-entity',
			array(
				'methods'             => \WP_REST_Server::EDITABLE,
				'callback'            => __NAMESPACE__ . '\\kubio_save_entity_rest_endpoint',
				'permission_callback' => function () {
					return current_user_can( 'edit_theme_options' );
				},

			)
		);
	}
);
