import _ from 'lodash';
import { GutentagSelectControl } from '../index';
import { Button } from '@wordpress/components';
import { DeleteItemIcon } from '@kubio/icons';
import classnames from 'classnames';

const GutentagSelectWithDelete = ({ onDelete = _.noop, ...props }) => {
	return (
		<GutentagSelectControl
			{...props}
			itemRenderer={(item) => {
				const { label, value, showDelete = true } = item;
				return (
					<div
						className={classnames([
							'kubio-select-with-delete__option-container',
						])}
					>
						<span>{label}</span>
						{showDelete && (
							<Button
								isSmall
								icon={DeleteItemIcon}
								onClick={(event) => {
									event.preventDefault();
									event.stopPropagation();

									onDelete(value);
								}}
							/>
						)}
					</div>
				);
			}}
		/>
	);
};

export { GutentagSelectWithDelete };
