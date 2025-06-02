import { compose } from '@wordpress/compose';
import { addFilter } from '@wordpress/hooks';
import {
	withHelperDefaultOptions,
	withKubioBlockContext,
	WithKubioSessionContext,
} from '../../context';
import { BlockListBlockColibri } from './ancestors';
import { withLocalId } from './local-id';
import { BlockAddMigrations, kubioApplyBlockMigrations } from './migrations';
import { BlockListBlockOwnerDocument } from './owner-document';
import { withEnsureStyleRef } from './styleref';
import { withUpdateVariationsRef } from './update-variations-ref';
import { KubioUseBlockCss } from './use-block-css';
import { withRootElement } from './root-element';

addFilter( 'editor.BlockListBlock', 'kubio/style/edit', KubioUseBlockCss, 1 );

addFilter(
	'editor.BlockListBlock',
	'kubio/BlockListBlockKubioBlockContext',
	withKubioBlockContext,
	5 // data helper
);

addFilter(
	'editor.BlockListBlock',
	'kubio/style/WithKubioSessionContext',
	compose( [ WithKubioSessionContext ] ),
	7
);

addFilter(
	'editor.BlockListBlock',
	'kubio/BlockListBlockKubioBlockContextHelperDefaults',
	withHelperDefaultOptions,
	8
);

addFilter( 'editor.BlockListBlock', 'kubio/style/withLocalId', withLocalId, 8 );

addFilter(
	'editor.BlockListBlock',
	'kubio/style/BlockListBlockOwnerDocument',
	compose( [ BlockListBlockOwnerDocument ] ),
	9
);

addFilter( 'editor.BlockListBlock', 'kubio/style/edit', BlockListBlockColibri );

addFilter(
	'blocks.getBlockAttributes',
	'kubio/block-migrations',
	kubioApplyBlockMigrations
);

addFilter(
	'editor.BlockListBlock',
	'kubio/BlockAddMigrations',
	compose( [ BlockAddMigrations ] ),
	20
);

addFilter(
	'editor.BlockListBlock',
	'kubio/withEnsureStyleRef',
	withEnsureStyleRef,
	30
);

addFilter(
	'editor.BlockListBlock',
	'kubio/withUpdateVariationsRef',
	withUpdateVariationsRef,
	40
);
addFilter(
	'editor.BlockListBlock',
	'kubio/withRootElement',
	withRootElement,
	40
);
