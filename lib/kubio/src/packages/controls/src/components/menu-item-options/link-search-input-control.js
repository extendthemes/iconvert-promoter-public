import { noop, omit } from 'lodash';

import { forwardRef, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import { URLInput } from '../';
import { CREATE_TYPE } from './constants';

const LinkSearchInputControl = forwardRef(
	(
		{
			value,
			children,
			currentLink = {},
			className = null,
			placeholder = null,
			onCreateSuggestion = noop,
			onChange = noop,
			onSelect = noop,
			allowDirectEntry = true,
			showInitialSuggestions = false,
			suggestionsPortalContainerRef,
			autoFocus = false,
		},
		ref
	) => {
		const [focusedSuggestion, setFocusedSuggestion] = useState();

		/**
		 * Handles the user moving between different suggestions. Does not handle
		 * choosing an individual item.
		 *
		 * @param {string} selection  the url of the selected suggestion.
		 * @param {Object} suggestion the suggestion object.
		 */
		const onInputChange = (selection, suggestion) => {
			onChange(selection);
			setFocusedSuggestion(suggestion);
		};

		const onFormSubmit = (event) => {
			event.preventDefault();
			onSuggestionSelected(focusedSuggestion || { url: value });
		};

		const onSuggestionSelected = async (selectedSuggestion) => {
			let suggestion = selectedSuggestion;
			if (CREATE_TYPE === selectedSuggestion.type) {
				// Create a new page and call onSelect with the output from the onCreateSuggestion callback
				try {
					suggestion = await onCreateSuggestion(
						selectedSuggestion.title
					);
					if (suggestion?.url) {
						onSelect(suggestion);
					}
				} catch (e) {}
				return;
			}

			if (
				allowDirectEntry ||
				(suggestion && Object.keys(suggestion).length >= 1)
			) {
				onSelect(
					// Some direct entries don't have types or IDs, and we still need to clear the previous ones.
					{ ...omit(currentLink, 'id', 'url'), ...suggestion },
					suggestion
				);
			}
		};

		return (
			<form onSubmit={onFormSubmit}>
				<URLInput
					className={className}
					value={value}
					onChange={onInputChange}
					placeholder={
						placeholder ?? __('Search or type url', 'kubio')
					}
					onSuggestionSelected={onSuggestionSelected}
					showInitialSuggestions={showInitialSuggestions}
					ref={ref}
					suggestionsPortalContainerRef={
						suggestionsPortalContainerRef
					}
					// eslint-disable-next-line jsx-a11y/no-autofocus
					autoFocus={autoFocus}
				/>
				{children}
			</form>
		);
	}
);

export { LinkSearchInputControl };
