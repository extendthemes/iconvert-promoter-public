<?php

namespace KPromo\Core;

use IlluminateAgnostic\Arr\Support\Arr;



class Backup {

	const UNIQUE_KEY_IDENTIFIER = 'KUBIO__UNIQUE_KEY_IDENTIFIER';
	protected $option_key_base  = '_kubio_bkp';
	protected $backup_dir       = null;
	protected $unique_key;
	protected $loaded_backup = null;



	public function __construct() {
		$this->backup_dir = Utils::getStringWithNamespacePrefix( 'kubio-site-backups' );
		$this->unique_key = get_option( $this->getBackupKey( Backup::UNIQUE_KEY_IDENTIFIER ) );
		if ( ! $this->unique_key ) {
			$this->unique_key = uniqid();
			update_option( $this->getBackupKey( Backup::UNIQUE_KEY_IDENTIFIER ), $this->unique_key, false );
		}
	}

	protected function getBackupKey( $key = null ) {

		if ( Backup::UNIQUE_KEY_IDENTIFIER === $key ) {
			return Utils::getStringWithNamespacePrefix( '_kubio_backup_unique_key_id' );
		}

		$template = get_stylesheet();
		$key      = $key ? "_{$key}" : '';
		return "{$this->option_key_base}_{$this->unique_key}_$template";
	}


	public function hasBackup( $identifier ) {

		return ! ! $this->getBackupData( $identifier );
	}

	public function backupSiteStructureAndStyle( $identifier ) {

		$backup = array(
			'templates' => $this->getBlockTemplatesData( 'wp_template' ),
			'parts'     => $this->getBlockTemplatesData( 'wp_template_part' ),
			'global'    => \KPromo\kubio_get_global_data_content(),
		);

		try {
			$written_to_file = $this->maybeBackupFile( $identifier, $backup );
			$updated         = update_option( $this->getBackupKey( $identifier ), $backup, false );

			if ( ! ( $written_to_file || $updated ) ) {
				return new \WP_Error( 'kubio_backup_error' );
			}
		} catch ( \Exception $e ) {
			return new \WP_Error( 'kubio_backup_error', $e->getMessage() );
		}

		return true;
	}

	protected function getBlockTemplatesData( $post_type = 'wp_template' ) {
		$entities = get_block_templates( array(), $post_type );
		$data     = array();

		foreach ( $entities as $entity ) {
			$data[ $entity->slug ] = array(
				'content' => $entity->content,
				'source'  => get_post_meta( $entity->wp_id, '_kubio_template_source', true ),
				'type'    => $post_type,
			);
		}
		$data = apply_filters( Utils::getStringWithNamespacePrefix( 'kubio/backup/getBlockTemplatesData/data' ), $data, $post_type );
		return $data;
	}


	protected function putBlockTemplatesData( $entities ) {
		foreach ( $entities as $slug => $entity ) {

			$status = true;

			if ( $entity['type'] === 'wp_template' ) {
				$status = Importer::createTemplate( $slug, $entity['content'], true, $entity['source'] );

			}
			if ( $entity['type'] === 'wp_template_part' ) {
				$status = Importer::createTemplatePart( $slug, $entity['content'], true, $entity['source'] );

			}

			if ( is_wp_error( $status ) ) {
				return new \WP_Error( 'kubio_backup_error' );
			}
		}

		return true;
	}


	protected function getBackupFolderRoot() {
		$upload_dir  = wp_upload_dir();
		$upload_path = untrailingslashit( $upload_dir['basedir'] );

		return "{$upload_path}/{$this->backup_dir}";
	}

	protected function getBackupFilePath( $identifier ) {
		$theme       = get_stylesheet();
		$upload_path = $this->getBackupFolderRoot();
		$file_path   = "{$upload_path}/{$theme}/{$identifier }.ksb";
		return $file_path;
	}

	protected function maybeBackupFile( $identifier, $content ) {

		$file_path = $this->getBackupFilePath( $identifier );
		if ( ! file_exists( dirname( $file_path ) ) ) {
			if ( ! wp_mkdir_p( dirname( $file_path ) ) ) {
				return false;
			}
		}

		$htaccess_file = array( $this->getBackupFolderRoot() . '/.htaccess', dirname( $file_path ) . '/.htaccess' );

		foreach ( $htaccess_file as $htaccess_file ) {
			$htaccess_file = wp_normalize_path( $htaccess_file );
			if ( ! file_exists( $htaccess_file ) ) {
				file_put_contents( $htaccess_file, "Deny from all\n" );
			}
		}

		return file_put_contents( $file_path, serialize( $content ) ) !== false;
	}

	protected function maybeGetContentFromFile( $identifier ) {

		$file_path = $this->getBackupFilePath( $identifier );

		if ( ! file_exists( $file_path ) || ! is_readable( $file_path ) ) {
			return new \WP_Error( 'kubio_backup_error' );
		}

		return unserialize( file_get_contents( $file_path ) );
	}

	public function getBackupData( $identifier ) {

		if ( $this->loaded_backup !== null ) {
			return $this->loaded_backup;
		}

		$data = $this->maybeGetContentFromFile( $identifier );
		if ( ! $data || is_wp_error( $data ) ) {
			$data = get_option( $this->getBackupKey( $identifier ), array() );
		}

		$this->loaded_backup = $data;

		return $this->loaded_backup;
	}

	public function deleteBackup( $identifier ) {
		delete_option( $this->getBackupKey( $identifier ) );
		wp_delete_file( $this->getBackupFilePath( $identifier ) );
	}


	public function restoreBackup( $identifier ) {

		$data = $this->getBackupData( $identifier );

		$global_data = Arr::get( $data, 'global', null );

		$status_templates = $this->putBlockTemplatesData( Arr::get( $data, 'templates', array() ) );
		$status_parts     = $this->putBlockTemplatesData( Arr::get( $data, 'parts', array() ) );
		$status_global    = true;

		if ( $global_data ) {
			$status_global = \KPromo\kubio_replace_global_data_content( $global_data );
		}

		if ( is_wp_error( $status_templates ) || is_wp_error( $status_parts ) || is_wp_error( $status_global ) ) {
			return new \WP_Error( 'wp_template_part' );
		}

		return true;
	}
}
