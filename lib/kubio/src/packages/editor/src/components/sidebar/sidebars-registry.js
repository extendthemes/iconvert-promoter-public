import { find } from 'lodash';
import SidebarArea from './sidebar-area';
import SubSidebarArea from './subsidebar-area';

const registeredAreas = [];

const registerArea = ({
	name,
	title = null,
	parent = 'document',
	render,
	isSubsidebar = false,
}) => {
	const foundSidebar = find(registeredAreas, { name });

	if (foundSidebar) {
		console.error(`sidebar ${name} already added`);
	}

	registeredAreas.push({
		name,
		parent,
		render,
		title: title || name,
		isSubsidebar,
	});
};

const getRegisteredSidebarsByParent = (parent) => {
	return registeredAreas.filter(
		({ parent: sidebarParent }) => sidebarParent === parent
	);
};

const renderSidebars = (parent) => {
	return getRegisteredSidebarsByParent(parent).map(
		({ title, render, name, isSubsidebar }) => {
			const Component = isSubsidebar ? SubSidebarArea : SidebarArea;

			return (
				<Component
					title={title}
					parentAreaIdentifier={parent}
					areaIdentifier={name}
					key={`${parent}.${name}`}
				>
					{render()}
				</Component>
			);
		}
	);
};

const registerSidebarArea = ({ name, title, parent = 'document', render }) =>
	registerArea({ name, title, parent, render, isSubsidebar: false });

const registerSubSidebarArea = ({ name, title, parent = 'document', render }) =>
	registerArea({ name, title, parent, render, isSubsidebar: true });

export {
	registerSidebarArea,
	registerSubSidebarArea,
	registeredAreas,
	getRegisteredSidebarsByParent,
	renderSidebars,
};
