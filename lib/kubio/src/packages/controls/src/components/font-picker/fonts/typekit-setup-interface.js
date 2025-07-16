import { useGlobalDataFonts } from '@kubio/global-data';
import { AvailableInPro } from '@kubio/pro';
import {
	BaseControl,
	Button,
	Flex,
	FlexBlock,
	FlexItem,
	Notice,
	SelectControl,
	Spinner,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalInputControl as InputControl,
} from '@wordpress/components';
import { useMemo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { update } from '@wordpress/icons';
import { map } from 'lodash';
import { RowControls } from '../../row-controls';

const TypeKitSetupInterface = () => {
	const {
		getTypeKitAPIKey,
		setTypeKitAPIKey,
		setTypekitUsedProject,
		getTypeKitUsedProject,
		getTypeKitProjects,
		isTypeKitApiLoading,
		refreshTypeKitFonts,
	} = useGlobalDataFonts();

	const key = getTypeKitAPIKey();
	const currentProject = getTypeKitUsedProject();
	const projects = getTypeKitProjects();

	const projectsOptions = useMemo( () => {
		const options = map( projects, ( project ) => ( {
			value: project.id,
			label: project.name,
		} ) );

		if ( ! options.length ) {
			return [];
		}

		options.unshift( {
			value: '',
			label: __( 'Select a TypeKit Project', 'kubio' ),
		} );

		return options;
	}, [ projects ] );

	const changeSelectedProject = ( value ) => {
		setTypekitUsedProject( value );
	};

	let controlsTypeKit = (
		<>
			<AvailableInPro
				displayModal={ false }
				urlArgs={ {
					source: 'general',
					content: 'typekit',
				} }
			/>
		</>
	);


	return controlsTypeKit;
};

export { TypeKitSetupInterface };
