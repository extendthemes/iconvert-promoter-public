// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-restricted-syntax */
import { Path, Polygon, Rect, SVG, G } from '@wordpress/primitives';
import * as BlockIcons from './block-icons';

const DummyIcon = <SVG />;

const Dots = (
	<SVG viewBox="0 0 16 16">
		<Path d="M9 0h4v4H9zM3 0h4v4H3zM9 6h4v4H9zM3 6h4v4H3zM9 12h4v4H9zM3 12h4v4H3z" />
	</SVG>
);

const ArrowLeft = (
	<SVG viewBox="0 0 20 20">
		<Path fill="none" d="M0 0h20v20H0z" />
		<Path d="M14 5l-5 5 5 5-1 2-7-7 7-7z" />
	</SVG>
);

const ArrowRight = (
	<SVG viewBox="0 0 20 20">
		<Path fill="none" d="M0 0h20v20H0z" />
		<Path d="M6 15l5-5-5-5 1-2 7 7-7 7z" />
	</SVG>
);

const ArrowDown = (
	<SVG viewBox="0 0 24 24">
		<path d="M17.5 11.6L12 16l-5.5-4.4.9-1.2L12 14l4.5-3.6 1 1.2z"></path>
	</SVG>
);

const LayoutIcon = (
	<SVG viewBox="0 0 22 22">
		<Path d="M5.61 1.54v10.3H1.56V1.54h4.05M7.17 0H0v13.44h7.17zM20.44 1.54v4H10v-4h10.44M22 0H8.47v7.09H22zM5.61 16.45v4H1.56v-4h4.05m1.56-1.54H0V22h7.17zM20.44 10.16v10.3H10v-10.3h10.44M22 8.62H8.47V22H22z" />
	</SVG>
);

const StyleIcon = (
	<SVG viewBox="0 0 22 22">
		<Path d="M22 4.68L19.27 2l-12 11.72a3.27 3.27 0 00-2.73.89c-1.74 1.7-3.3 3.07-4.55 4.16l1.05.35a18.43 18.43 0 005.1.87 4.11 4.11 0 002.95-.92A3.12 3.12 0 0010 16.4zm-2.73-.9l.91.9-7.24 7.07-.94-.89zM8.2 18.18a3 3 0 01-2 .55 15.47 15.47 0 01-3.59-.51c.73-.66 1.84-1.67 2.91-2.72a2 2 0 012.73 0 1.87 1.87 0 010 2.63zm.91-3.57a3.81 3.81 0 00-.5-.4l2.5-2.46.92.89-2.51 2.46a3.23 3.23 0 00-.41-.49z" />
	</SVG>
);

const AdvancedIcon = (
	<SVG viewBox="0 0 22 22">
		<Path d="M21.23 2.44a.61.61 0 00-.84-.24l-.12.1-2.64 2.59a.12.12 0 01-.16 0L17 4.42a.11.11 0 010-.15l2.62-2.62a.64.64 0 000-.89l-.17-.1a4.9 4.9 0 00-7.24 5.24l-4.53 4.55a.62.62 0 000 .88.62.62 0 00.89 0l4.77-4.8a.6.6 0 00.16-.62 3.56 3.56 0 01.82-3.48 3.65 3.65 0 013.66-1L16 3.36a1.37 1.37 0 000 1.94l.5.51a1.36 1.36 0 001.93 0l2-2A3.67 3.67 0 0118 8.36a3.58 3.58 0 01-2.05 0 .64.64 0 00-.62.16l-8.08 8.1a.65.65 0 00-.17.58 3 3 0 11-3.5-2.45 3 3 0 011.11 0 .63.63 0 00.61-.08l1-1a.61.61 0 000-.86.65.65 0 00-.9 0l-.72.73a4.26 4.26 0 00-1 8.46h.48a4.18 4.18 0 003.07-1.22 4.3 4.3 0 001.22-3.46l7.61-7.62a4.88 4.88 0 005.17-7.26z" />
		<Path d="M7 12.43a.43.43 0 10.14-.84H7a.41.41 0 00-.42.41.43.43 0 00.12.31.47.47 0 00.3.12zM4.16 15.66a2.1 2.1 0 101.48.61 2.1 2.1 0 00-1.48-.61zm.89 3a1.24 1.24 0 01-1.73 0 1.22 1.22 0 010-1.73 1.25 1.25 0 111.77 1.76zM13.83 8.7a.64.64 0 00.63-.64.67.67 0 00-.18-.43.66.66 0 10-.94.93.61.61 0 00.49.14z" />
		<Path d="M6.49 15.41a.63.63 0 00.9 0l6-5.9a.63.63 0 00.07-.88.46.46 0 00-.07-.07.62.62 0 00-.89 0l-6 5.95a.59.59 0 00-.14.81.11.11 0 00.13.09z" />
	</SVG>
);

const ResetIcon = (
	<SVG viewBox="0 0 512 512">
		<Path d="M444.58 81.58C400.38 35.1 339.34 9.5 272.68 9.5h-.51a255.61 255.61 0 00-201.42 98.22l-8.21 10.5-43.49-31.77A12 12 0 000 96.12V251a12 12 0 0015.57 11.4l134.52-52.23a12 12 0 003.47-21.11l-44.18-32.17 7.05-9.55a193.22 193.22 0 0164.31-55.64 181.48 181.48 0 0184.76-21.25c49.12 0 95.68 19.71 131.11 55.51a189.38 189.38 0 0139.78 59 179.2 179.2 0 010 142 189.44 189.44 0 01-39.78 59c-35.43 35.8-82 55.51-131.11 55.51a181.7 181.7 0 01-85.19-21.44 191.45 191.45 0 01-51.1-39.76 12 12 0 00-14.84-2.18L82.27 397a12 12 0 00-3 18.2 255.69 255.69 0 00192.43 87.3h.93c66.67 0 127.73-25.6 171.93-72.09C488.06 384.69 512 322.75 512 256s-23.94-128.7-67.42-174.42z" />
	</SVG>
);

const SubmenuIcon = (
	<SVG xmlns="http://www.w3.org/2000/svg" width="24" height="24">
		<Path d="M2 12c0 3.6 2.4 5.5 6 5.5h.5V19l3-2.5-3-2.5v2H8c-2.5 0-4.5-1.5-4.5-4s2-4.5 4.5-4.5h3.5V6H8c-3.6 0-6 2.4-6 6zm19.5-1h-8v1.5h8V11zm0 5h-8v1.5h8V16zm0-10h-8v1.5h8V6z" />
	</SVG>
);

const CogIcon = (
	<SVG viewBox="0 0 19.49 19.49">
		<Path
			d="M18.3 12.38l-1.4-1.15a7.43 7.43 0 000-3l1.4-1.15a1.22 1.22 0 00.28-1.55l-.8-1.38a1.22 1.22 0 00-1.48-.53l-1.69.64A7.35 7.35 0 0012 2.8L11.74 1a1.21 1.21 0 00-1.2-1H9a1.21 1.21 0 00-1.2 1l-.35 1.8a7.37 7.37 0 00-2.57 1.49l-1.69-.64a1.23 1.23 0 00-1.49.53L.91 5.56a1.22 1.22 0 00.28 1.55l1.4 1.15a7.43 7.43 0 000 3l-1.4 1.15a1.22 1.22 0 00-.28 1.55l.79 1.38a1.23 1.23 0 001.49.53l1.69-.64a7.2 7.2 0 002.57 1.48l.3 1.79a1.21 1.21 0 001.2 1h1.59a1.21 1.21 0 001.2-1l.3-1.79a7.17 7.17 0 002.57-1.48l1.69.64a1.24 1.24 0 001.49-.54l.79-1.37a1.22 1.22 0 00-.28-1.58zm-8.55 1a3.66 3.66 0 01-3.66-3.64 3.66 3.66 0 113.66 3.66z"
			fillRule="evenodd"
		/>
	</SVG>
);
const MoreVerticalMobile = (
	<SVG viewBox="0 0 48 48">
		<Path d="M24,15a3,3,0,1,0-3-3A3,3,0,0,0,24,15Z" />
		<Path d="M24,27a3,3,0,1,0-3-3A3,3,0,0,0,24,27Z" />
		<Path d="M24,39a3,3,0,1,0-3-3A3,3,0,0,0,24,39Z" />
	</SVG>
);
const MoreHorizontalMobile = (
	<SVG viewBox="0 0 48 48">
		<Path d="M15,24a3,3,0,1,0-3,3A3,3,0,0,0,15,24Z" />
		<Path d="M27,24a3,3,0,1,0-3,3A3,3,0,0,0,27,24Z" />
		<Path d="M39,24a3,3,0,1,0-3,3A3,3,0,0,0,39,24Z" />
	</SVG>
);
const NoneIcon = (
	<SVG viewBox="0 0 23 23">
		<Path d="M4.37 16.292l13.716-10.51.663.865-13.717 10.51z" />
		<Path
			className="prefix__b"
			d="M18.65 5.13H4.35A.85.85 0 003.5 6v11a.85.85 0 00.85.85h14.3a.85.85 0 00.85-.85V6a.85.85 0 00-.85-.87zm-.23 1.08v10.51H4.7V6.21z"
		/>
	</SVG>
);

const ImageIcon = (
	<SVG viewBox="0 0 23 23">
		<Path d="M18.63 5H4.37a.87.87 0 00-.87.87v11.25a.87.87 0 00.87.87h14.26a.87.87 0 00.87-.87V5.88a.87.87 0 00-.87-.88zm-.29 1.16v7.52l-1.79-1.38a1.49 1.49 0 00-1.79 0L13 13.56a.51.51 0 01-.63 0l-1.94-1.79a1.49 1.49 0 00-2-.07l-3.79 3V6.17zM4.66 16.83V16v.05l4.45-3.54a.38.38 0 01.5 0l1.94 1.79a1.63 1.63 0 002 .12l1.78-1.28a.39.39 0 01.46 0l2.47 1.91v1.73z" />
		<Path d="M15.3 11.11A2.09 2.09 0 1013.21 9a2.09 2.09 0 002.09 2.09zM14.15 9a1.16 1.16 0 111.15 1.15A1.15 1.15 0 0114.15 9z" />
	</SVG>
);

const GradientIcon = (
	<SVG viewBox="0 0 23 23">
		<Path d="M18.65 5.13H4.35A.85.85 0 003.5 6v11a.85.85 0 00.85.85h14.3a.85.85 0 00.85-.85V6a.85.85 0 00-.85-.87zm-.23 1.08v10.51L4.7 6.21z" />
	</SVG>
);

const SlideshowIcon = (
	<SVG viewBox="0 0 23 23">
		<Path d="M17.46 4.89H5.5a.63.63 0 00-.63.63v12a.63.63 0 00.63.63h12a.63.63 0 00.63-.63v-12a.63.63 0 00-.63-.63zM5.88 15.28l3.58-2.85a.24.24 0 01.32 0l1.53 1.42A1.36 1.36 0 0013 14l1.4-1a.26.26 0 01.29 0l2.39 1.85v2.3H5.88zm7.94-3.15l-1.4 1a.33.33 0 01-.42 0l-1.54-1.43a1.26 1.26 0 00-1.63-.06L5.88 14V5.9h11.2v7.63l-1.76-1.37a1.26 1.26 0 00-1.5 0z" />
		<Path d="M16 8.86a1.82 1.82 0 10-1.81 1.82A1.81 1.81 0 0016 8.86zm-1.81-.81a.81.81 0 010 1.62.81.81 0 01-.81-.81.81.81 0 01.85-.81zM2.51 5.91h1.03V17.1H2.51zM0 7.01h1.03v8.98H0zM19.45 5.91h1.03V17.1h-1.03zM21.97 7.01H23v8.98h-1.03z" />
	</SVG>
);

const VideoIcon = (
	<SVG viewBox="0 0 23 23">
		<Path d="M20.09 6.46a.85.85 0 00-.83 0l-2.9 1.46v-2a.85.85 0 00-.85-.92H3.35a.85.85 0 00-.85.85v11.31a.85.85 0 00.85.85h12.16c.47 0 .85-.7.85-1.17v-1.75l2.9 1.47a.85.85 0 00.83 0 .83.83 0 00.41-.72V7.18a.82.82 0 00-.41-.72zm-.74 1.2v7.66l-3-1.51V9.17zm-4.14-1.52v10.73H3.65V6.14z" />
		<Rect x={5.18} y={8.21} width={3.05} height={1.15} rx={0.47} />
	</SVG>
);

const AddItemIcon = (
	<SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
		<Path
			className="cls-1"
			d="M17.64,6.34a8,8,0,1,0,0,11.3A7.94,7.94,0,0,0,17.64,6.34Zm-10,10a6.21,6.21,0,1,1,8.79,0A6.18,6.18,0,0,1,7.6,16.38Z"
		/>
		<Polygon
			className="cls-1"
			points="15.55 11.1 12.88 11.1 12.88 8.44 11.11 8.44 11.11 11.1 8.45 11.1 8.45 12.88 11.11 12.88 11.11 15.54 12.88 15.54 12.88 12.88 15.55 12.88 15.55 11.1"
		/>
	</SVG>
);

const DeleteItemIcon = (
	<SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
		<Path
			className="cls-1"
			d="M12,4a8,8,0,1,0,8,8A8,8,0,0,0,12,4Zm0,14.22A6.22,6.22,0,1,1,18.22,12,6.18,6.18,0,0,1,12,18.22Z"
		/>
		<Polygon
			className="cls-1"
			points="13.89 8.86 12 10.74 10.11 8.86 8.86 10.11 10.74 12 8.86 13.89 10.11 15.14 12 13.26 13.89 15.14 15.14 13.89 13.26 12 15.14 10.11 13.89 8.86"
		/>
	</SVG>
);

const DuplicateItemIcon = (
	<SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
		<Path d="M19.91,7.72l-.85-.84L17.44,5.25,16.28,4.09A.31.31,0,0,0,16.06,4H7.81a.31.31,0,0,0-.31.31V6.56H4.31A.31.31,0,0,0,4,6.88V19.69a.31.31,0,0,0,.31.31H16.19a.31.31,0,0,0,.31-.31V17.44h3.19a.31.31,0,0,0,.31-.32V7.94A.31.31,0,0,0,19.91,7.72ZM15.09,18.58H5.41V8h6.9v2.79a.29.29,0,0,0,.3.3h2.48ZM18.59,16H16.41V10.51a.3.3,0,0,0-.08-.21l-.82-.82L13.93,7.9,12.81,6.78a.29.29,0,0,0-.21-.09H8.91V5.42h6.9V8.21a.3.3,0,0,0,.3.3h2.48Z" />
	</SVG>
);

const NavOption1 = (
	<SVG viewBox="0 0 47 47">
		<Path d="M16.11 22.7h7.96v1.58h-7.96zM26.05 22.7h7.96v1.58h-7.96zM36 22.7h7.96v1.58H36zM7.11 21a2.48 2.48 0 11-2.45 2.51A2.48 2.48 0 017.11 21m0-1.59a4.07 4.07 0 104.07 4.07 4.09 4.09 0 00-4.07-4.05z" />
	</SVG>
);

const NavOption2 = (
	<SVG viewBox="0 0 47 47">
		<Path d="M9.6 28.1h7.96v1.58H9.6zM19.53 28.1h7.96v1.58h-7.96zM29.44 28.1h7.96v1.58h-7.96zM23.52 18.91a2.48 2.48 0 010 4.95A2.49 2.49 0 0121 21.38a2.49 2.49 0 012.49-2.47m0-1.6a4.07 4.07 0 104.05 4.09 4.08 4.08 0 00-4.02-4.09z" />
	</SVG>
);

const NavOption3 = (
	<SVG viewBox="0 0 47 47">
		<Path d="M14.51 22.7h7.96v1.58h-7.96zM24.45 22.7h7.96v1.58h-7.96zM43.16 22.7a.8.8 0 010 1.6h-6.38a.8.8 0 110-1.6h6.38m0-1.58h-6.38a2.38 2.38 0 000 4.76h6.38a2.38 2.38 0 100-4.76zM5.54 21a2.48 2.48 0 11-2.48 2.5A2.48 2.48 0 015.54 21m0-1.59a4.07 4.07 0 104.06 4.1 4.08 4.08 0 00-4.06-4.08z" />
	</SVG>
);

const NavOption4 = (
	<SVG viewBox="0 0 47 47">
		<Path d="M9.94 22.7h7.96v1.58H9.94zM0 22.7h7.96v1.58H0zM38.24 22.7h6.38a.8.8 0 110 1.6h-6.38a.8.8 0 010-1.6m-2.38.8a2.38 2.38 0 002.38 2.38h6.38a2.38 2.38 0 100-4.76h-6.38a2.38 2.38 0 00-2.38 2.38zM26.87 21a2.49 2.49 0 012.49 2.48A2.48 2.48 0 1126.87 21m-4.06 2.5a4.07 4.07 0 104.06-4.08 4.07 4.07 0 00-4.06 4.09z" />
	</SVG>
);

const NavOption5 = (
	<SVG viewBox="0 0 47 47">
		<Path d="M9.6 28.1h7.96v1.58H9.6zM19.54 28.1h7.96v1.58h-7.96zM29.45 28.1h7.96v1.58h-7.96zM43.16 20.58a.8.8 0 010 1.6h-6.37a.8.8 0 010-1.6h6.37m0-1.58h-6.37a2.38 2.38 0 100 4.76h6.37a2.38 2.38 0 100-4.76zM5.55 18.91a2.48 2.48 0 11-2.48 2.47 2.47 2.47 0 012.48-2.47m0-1.6A4.07 4.07 0 109.6 21.4a4.07 4.07 0 00-4.05-4.09z" />
	</SVG>
);

const HeroIcon1 = (
	<SVG viewBox="0 0 47 47">
		<Path d="M0 17.93h47v2.58H0zM2.06 23.01h42.88v1.29H2.06zM17.81 27.12h11.38v1.95H17.81z" />
	</SVG>
);

const HeroIcon2 = (
	<SVG viewBox="0 0 47 47">
		<Path d="M46.14 12.5H25.86a.85.85 0 00-.86.84v20.3a.85.85 0 00.84.86h20.3a.85.85 0 00.86-.84v-20.3a.85.85 0 00-.84-.86zm-.43 1.29v13.57l-3.33-2.58a1.92 1.92 0 00-2.28 0l-2.39 1.72a.77.77 0 01-1-.06L34.1 24a1.89 1.89 0 00-2.48 0l-5.35 4.2V13.79zM26.29 33.21v-3.4l6.15-4.9a.62.62 0 01.81 0l2.61 2.41a2.07 2.07 0 002.6.16l2.39-1.72a.6.6 0 01.74 0L45.71 29v4.22z" />
		<Path d="M40.66 22.19a2.87 2.87 0 10-2.88-2.87 2.88 2.88 0 002.88 2.87zm0-4.46a1.59 1.59 0 11-1.59 1.59 1.59 1.59 0 011.59-1.59zM0 17.93h20v2.58H0zM0 23.01h15.88v1.29H0zM0 27.12h5.69v1.95H0z" />
	</SVG>
);

const HeroIcon3 = (
	<SVG viewBox="0 0 47 47">
		<Path d="M21.14 12.5H.86a.85.85 0 00-.86.84v20.3a.85.85 0 00.84.86h20.3a.85.85 0 00.86-.84v-20.3a.85.85 0 00-.84-.86zm-.43 1.29v13.57l-3.33-2.58a1.92 1.92 0 00-2.28 0l-2.39 1.72a.77.77 0 01-1-.06L9.12 24a1.88 1.88 0 00-2.48-.09l-5.35 4.25V13.79zM1.29 33.21v-3.4l6.15-4.9a.62.62 0 01.81 0l2.61 2.41a2.07 2.07 0 002.6.16l2.39-1.72a.6.6 0 01.74 0L20.71 29v4.22z" />
		<Path d="M15.66 22.19a2.87 2.87 0 10-2.88-2.87 2.88 2.88 0 002.88 2.87zm0-4.46a1.59 1.59 0 11-1.59 1.59 1.59 1.59 0 011.59-1.59zM27 17.93h20v2.58H27zM27 23.01h15.88v1.29H27zM27 27.12h5.69v1.95H27z" />
	</SVG>
);

const HeroIcon4 = (
	<SVG viewBox="0 0 47 47">
		<Path d="M33.64 4.5H13.36a.85.85 0 00-.86.84v20.3a.85.85 0 00.84.86h20.3a.85.85 0 00.86-.84V5.36a.85.85 0 00-.84-.86zm-.43 1.29v13.57l-3.33-2.58a1.92 1.92 0 00-2.28 0l-2.39 1.72a.77.77 0 01-1-.06L21.6 16a1.89 1.89 0 00-2.48 0l-5.35 4.2V5.79zM13.79 25.21v-3.4l6.15-4.9a.62.62 0 01.81 0l2.61 2.41a2.07 2.07 0 002.64.18l2.39-1.72a.6.6 0 01.74 0L33.25 21v4.22z" />
		<Path d="M28.16 14.19a2.87 2.87 0 10-2.88-2.87 2.88 2.88 0 002.88 2.87zm0-4.46a1.59 1.59 0 11-1.59 1.59 1.59 1.59 0 011.59-1.59zM12.5 31.36h22v2.58h-22zM14.56 36.44h17.88v1.29H14.56zM20.66 40.55h5.69v1.95h-5.69z" />
	</SVG>
);

const HeroIcon5 = (
	<SVG viewBox="0 0 47 47">
		<Path d="M33.64 20.5H13.36a.85.85 0 00-.86.84v20.3a.85.85 0 00.84.86h20.3a.85.85 0 00.86-.84v-20.3a.85.85 0 00-.84-.86zm-.43 1.29v13.57l-3.33-2.58a1.92 1.92 0 00-2.28 0l-2.39 1.72a.77.77 0 01-1-.06L21.6 32a1.89 1.89 0 00-2.48 0l-5.35 4.2V21.79zM13.79 41.21v-3.4l6.15-4.9a.62.62 0 01.81 0l2.61 2.41a2.07 2.07 0 002.64.18l2.39-1.72a.6.6 0 01.74 0L33.25 37v4.22z" />
		<Path d="M28.16 30.19a2.87 2.87 0 10-2.88-2.87 2.88 2.88 0 002.88 2.87zm0-4.46a1.59 1.59 0 11-1.59 1.59 1.59 1.59 0 011.59-1.59zM12.5 4.5h22v2.58h-22zM14.56 9.58h17.88v1.29H14.56zM20.66 13.68h5.69v1.95h-5.69z" />
	</SVG>
);

const CustomIcon = (
	<SVG viewBox="0 0 47 47">
		<Path d="M5.32,21.69a1.92,1.92,0,0,0-.38-.43A1.86,1.86,0,0,0,4.42,21a1.73,1.73,0,0,0-.6-.11,2,2,0,0,0-1,.23,1.68,1.68,0,0,0-.65.59,2.67,2.67,0,0,0-.37.86,4.62,4.62,0,0,0-.11,1,4.33,4.33,0,0,0,.11.95,2.51,2.51,0,0,0,.37.83,1.79,1.79,0,0,0,.65.6,2.09,2.09,0,0,0,1,.22A1.57,1.57,0,0,0,5,25.66a2.14,2.14,0,0,0,.54-1.26H7.23a3.88,3.88,0,0,1-.33,1.31,3.09,3.09,0,0,1-.72,1,3.33,3.33,0,0,1-1,.63,4,4,0,0,1-1.32.21,4,4,0,0,1-1.61-.31A3.45,3.45,0,0,1,1,26.4a3.79,3.79,0,0,1-.75-1.28A4.8,4.8,0,0,1,0,23.54a5,5,0,0,1,.26-1.62A4,4,0,0,1,1,20.62a3.5,3.5,0,0,1,1.2-.87,4,4,0,0,1,1.61-.31A4,4,0,0,1,5,19.62a3.32,3.32,0,0,1,1,.54A2.9,2.9,0,0,1,6.8,21a3,3,0,0,1,.37,1.19H5.52A1.54,1.54,0,0,0,5.32,21.69Z" />
		<Path d="M14.11,26.8a3.6,3.6,0,0,1-2.44.76,3.57,3.57,0,0,1-2.44-.76,3,3,0,0,1-.86-2.35V19.62h1.7v4.83a3.18,3.18,0,0,0,.06.62,1.2,1.2,0,0,0,.23.54,1.16,1.16,0,0,0,.48.38,2,2,0,0,0,.83.15,1.64,1.64,0,0,0,1.27-.41,2,2,0,0,0,.34-1.28V19.62H15v4.83A3,3,0,0,1,14.11,26.8Z" />
		<Path d="M17.77,25.48a1.32,1.32,0,0,0,.37.44,1.85,1.85,0,0,0,.55.25,2.82,2.82,0,0,0,.65.08,4.22,4.22,0,0,0,.49,0,1.56,1.56,0,0,0,.49-.15.94.94,0,0,0,.38-.3.68.68,0,0,0,.16-.48.66.66,0,0,0-.21-.51,1.66,1.66,0,0,0-.52-.33,5.89,5.89,0,0,0-.74-.23L18.55,24c-.29-.08-.57-.17-.85-.27a3.12,3.12,0,0,1-.74-.41,1.8,1.8,0,0,1-.73-1.53,2,2,0,0,1,.26-1,2.26,2.26,0,0,1,.67-.74,2.84,2.84,0,0,1,.93-.43,3.79,3.79,0,0,1,1.05-.14,5.06,5.06,0,0,1,1.17.13,3,3,0,0,1,1,.44,2.34,2.34,0,0,1,.69.78,2.41,2.41,0,0,1,.26,1.15H20.6a1.59,1.59,0,0,0-.15-.58,1.15,1.15,0,0,0-.33-.36,1.45,1.45,0,0,0-.48-.18,2.58,2.58,0,0,0-.58-.06,1.92,1.92,0,0,0-.41,0,1.16,1.16,0,0,0-.38.15,1,1,0,0,0-.28.27.77.77,0,0,0-.1.42A.81.81,0,0,0,18,22a.86.86,0,0,0,.35.26,4.27,4.27,0,0,0,.7.24l1.18.3c.15,0,.35.08.61.16a2.91,2.91,0,0,1,.76.36,2.22,2.22,0,0,1,.66.67,1.87,1.87,0,0,1,.28,1.07,2.31,2.31,0,0,1-.21,1,2,2,0,0,1-.61.79,2.92,2.92,0,0,1-1,.52,5,5,0,0,1-1.4.18A5.22,5.22,0,0,1,18,27.41a3.05,3.05,0,0,1-1.06-.5,2.37,2.37,0,0,1-.74-.86A2.55,2.55,0,0,1,16,24.81h1.65A1.41,1.41,0,0,0,17.77,25.48Z" />
		<Polygon points="22.91 21.06 22.91 19.62 29.28 19.62 29.28 21.06 26.95 21.06 26.95 27.39 25.24 27.39 25.24 21.06 22.91 21.06" />
		<Path d="M37.21,21.92a4.18,4.18,0,0,0-.75-1.3,3.5,3.5,0,0,0-1.2-.87,4.31,4.31,0,0,0-3.21,0,3.44,3.44,0,0,0-1.21.87,4.18,4.18,0,0,0-.75,1.3,5,5,0,0,0-.26,1.62,4.8,4.8,0,0,0,.26,1.58,4,4,0,0,0,.75,1.28,3.4,3.4,0,0,0,1.21.85,4.31,4.31,0,0,0,3.21,0,3.45,3.45,0,0,0,1.2-.85,4,4,0,0,0,.75-1.28,4.8,4.8,0,0,0,.26-1.58A5,5,0,0,0,37.21,21.92Zm-1.56,2.57a2.51,2.51,0,0,1-.37.83,1.79,1.79,0,0,1-.65.6,2.29,2.29,0,0,1-2,0,1.87,1.87,0,0,1-.65-.6,2.51,2.51,0,0,1-.37-.83,4.33,4.33,0,0,1-.11-.95,4.62,4.62,0,0,1,.11-1,2.67,2.67,0,0,1,.37-.86,1.76,1.76,0,0,1,.65-.59,2.2,2.2,0,0,1,2,0,1.68,1.68,0,0,1,.65.59,2.67,2.67,0,0,1,.37.86,4.62,4.62,0,0,1,.11,1A4.33,4.33,0,0,1,35.65,24.49Z" />
		<Polygon points="41.04 19.62 42.85 24.96 42.88 24.96 44.6 19.62 47 19.62 47 27.39 45.4 27.39 45.4 21.89 45.38 21.89 43.48 27.39 42.16 27.39 40.25 21.94 40.23 21.94 40.23 27.39 38.63 27.39 38.63 19.62 41.04 19.62" />
	</SVG>
);

const BorderTop = (
	<SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
		<Path d="M10.91 0H2.19v2.19h19.62V0h-10.9z" />
	</SVG>
);

const BorderLeft = (
	<SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
		<Path d="M2.19 10.91V2.19H0v19.62h2.19v-10.9z" />
	</SVG>
);

const BorderBottom = (
	<SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
		<Path d="M10.91 21.81H2.19V24h19.62v-2.19h-10.9z" />
	</SVG>
);

const BorderRight = (
	<SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
		<Path d="M24 10.91V2.19h-2.19v19.62H24v-10.9z" />
	</SVG>
);

const BorderRadiusAll = (
	<SVG viewBox="0 0 24 24">
		<Path d="M2.19 0h8.72v2.19H2.19v8.72H0V2.19A2.18 2.18 0 012.16 0zM0 21.81v-8.72h2.19v8.72h8.72V24H2.19A2.18 2.18 0 010 21.84zM24 2.19v8.72h-2.19V2.19h-8.72V0h8.72A2.18 2.18 0 0124 2.16zM21.81 24h-8.72v-2.19h8.72v-8.72H24v8.72A2.18 2.18 0 0121.84 24z" />
	</SVG>
);

const BorderRadiusTopRight = (
	<SVG viewBox="0 0 24 24">
		<Path d="M24 2.19v8.72h-2.19V2.19h-8.72V0h8.72A2.18 2.18 0 0124 2.16z" />
	</SVG>
);

const BorderRadiusBottomRight = (
	<SVG viewBox="0 0 24 24">
		<Path d="M21.81 24h-8.72v-2.19h8.72v-8.72H24v8.72A2.18 2.18 0 0121.84 24z" />
	</SVG>
);

const BorderRadiusBottomLeft = (
	<SVG viewBox="0 0 24 24">
		<Path d="M0 21.81v-8.72h2.19v8.72h8.72V24H2.19A2.18 2.18 0 010 21.84z" />
	</SVG>
);

const BorderRadiusTopLeft = (
	<SVG viewBox="0 0 24 24">
		<Path d="M2.19 0h8.72v2.19H2.19v8.72H0V2.19A2.18 2.18 0 012.16 0z" />
	</SVG>
);

const HorizontalAlignLeft = (
	<SVG
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 512 512"
		style={{ width: '15px' }}
	>
		<Path d="M108 276h394c5.5 0 10 3.6 10 8v104c0 4.4-4.5 8-10 8H108c-5.5 0-10-3.6-10-8V284c0-4.4 4.5-8 10-8zM108 116h256c5.5 0 10 3.6 10 8v104c0 4.4-4.5 8-10 8H108c-5.5 0-10-3.6-10-8V124c0-4.4 4.5-8 10-8zM10 0h29a10 10 0 0110 10v492a10 10 0 01-10 10H10a10 10 0 01-10-10V10A10 10 0 0110 0z" />
	</SVG>
);

const HorizontalAlignCenter = (
	<SVG
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 512 512"
		style={{ width: '15px' }}
	>
		<Path d="M453 276H280.5v-40H384c5.5 0 10-3.6 10-8V124c0-4.4-4.5-8-10-8H280.5V10a10 10 0 00-10-10h-29a10 10 0 00-10 10v106H128c-5.5 0-10 3.6-10 8v104c0 4.4 4.5 8 10 8h103.5v40H59c-5.5 0-10 3.6-10 8v104c0 4.4 4.5 8 10 8h172.5v106a10 10 0 0010 10h29a10 10 0 0010-10V396H453c5.5 0 10-3.6 10-8V284c0-4.4-4.5-8-10-8z" />
	</SVG>
);

const HorizontalAlignRight = (
	<SVG
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 512 512"
		style={{ width: '15px' }}
	>
		<Path d="M414 284v104c0 4.4-4.5 8-10 8H10c-5.5 0-10-3.6-10-8V284c0-4.4 4.5-8 10-8h394c5.5 0 10 3.6 10 8zM414 124v104c0 4.4-4.5 8-10 8H148c-5.5 0-10-3.6-10-8V124c0-4.4 4.5-8 10-8h256c5.5 0 10 3.6 10 8zM463 502V10a10 10 0 0110-10h29a10 10 0 0110 10v492a10 10 0 01-10 10h-29a10 10 0 01-10-10z" />
	</SVG>
);

const VerticalAlignTop = (
	<SVG
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 512 512"
		style={{ width: '15px' }}
	>
		<Path d="M236 108v394c0 5.5-3.6 10-8 10H124c-4.4 0-8-4.5-8-10V108c0-5.5 3.6-10 8-10h104c4.4 0 8 4.5 8 10zM396 108v256c0 5.5-3.6 10-8 10H284c-4.4 0-8-4.5-8-10V108c0-5.5 3.6-10 8-10h104c4.4 0 8 4.5 8 10zM10 0h492a10 10 0 0110 10v29a10 10 0 01-10 10H10A10 10 0 010 39V10A10 10 0 0110 0z" />
	</SVG>
);

const VerticalAlignMiddle = (
	<SVG
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 512 512"
		style={{ width: '15px' }}
	>
		<Path d="M502 231.5H396V128c0-5.5-3.6-10-8-10H284c-4.4 0-8 4.5-8 10v103.5h-40V59c0-5.5-3.6-10-8-10H124c-4.4 0-8 4.5-8 10v172.5H10a10 10 0 00-10 10v29a10 10 0 0010 10h106V453c0 5.5 3.6 10 8 10h104c4.4 0 8-4.5 8-10V280.5h40V384c0 5.5 3.6 10 8 10h104c4.4 0 8-4.5 8-10V280.5h106a10 10 0 0010-10v-29a10 10 0 00-10-10z" />
	</SVG>
);

const VerticalAlignBottom = (
	<SVG
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 512 512"
		style={{ width: '15px' }}
	>
		<Path d="M228 414H124c-4.4 0-8-4.5-8-10V10c0-5.5 3.6-10 8-10h104c4.4 0 8 4.5 8 10v394c0 5.5-3.6 10-8 10zM388 414H284c-4.4 0-8-4.5-8-10V148c0-5.5 3.6-10 8-10h104c4.4 0 8 4.5 8 10v256c0 5.5-3.6 10-8 10zM512 473v29a10 10 0 01-10 10H10a10 10 0 01-10-10v-29a10 10 0 0110-10h492a10 10 0 0110 10z" />
	</SVG>
);

const TextAlignLeft = (
	<SVG
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 512 512"
		style={{ width: '15px' }}
	>
		<Path d="M253.12 55H0v50h256V55h-2.88zM0 231h512v50H0zM0 407h256v50H0z" />
	</SVG>
);

const TextAlignCenter = (
	<SVG
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 512 512"
		style={{ width: '15px' }}
	>
		<Path d="M381.12 55H128v50h256V55h-2.88zM0 231h512v50H0zM128 407h256v50H128z" />
	</SVG>
);

const TextAlignRight = (
	<SVG
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 512 512"
		style={{ width: '15px' }}
	>
		<Path d="M509.12 55H256v50h256V55h-2.88zM0 231h512v50H0zM256 407h256v50H256z" />
	</SVG>
);

const TextAlignJustify = (
	<SVG
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 512 512"
		style={{ width: '15px' }}
	>
		<Path d="M506.25 55H0v50h512V55h-5.75zM0 231h512v50H0zM0 407h512v50H0z" />
	</SVG>
);

const EnterIcon = (
	<SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 19.49 19.49">
		<Path d="M15.79,0a1,1,0,0,0-1,1V12.43a1.35,1.35,0,0,1-1.35,1.35H6.13l2-2a1,1,0,1,0-1.43-1.42L3,14.07A1,1,0,0,0,3,15.5H3l3.7,3.69a1,1,0,0,0,1.43-1.42h0l-2-2h7.31a3.35,3.35,0,0,0,3.36-3.36V1A1,1,0,0,0,15.79,0Z" />
	</SVG>
);

const ReplaceIcon = (
	<SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
		<Path d="M19.28,10.72H14a.72.72,0,0,1-.72-.72V4.72A.72.72,0,0,1,14,4h5.28a.72.72,0,0,1,.72.72V10A.72.72,0,0,1,19.28,10.72ZM14.69,9.31h3.9V5.41h-3.9Z" />
		<Path d="M11.28,6.66H7.37a.76.76,0,0,0-.77.76V9.93l-.67-.67a.7.7,0,1,0-1,1l1.82,1.83a.77.77,0,0,0,1.08,0h0l1.83-1.83a.7.7,0,1,0-1-1h0L8,9.93V8.06h3.28a.7.7,0,1,0,0-1.4Z" />
		<Path d="M4.72,13.28H10a.72.72,0,0,1,.72.72v5.28A.72.72,0,0,1,10,20H4.72A.72.72,0,0,1,4,19.28V14a.72.72,0,0,1,.72-.72Zm4.59,1.41H5.41v3.9h3.9Z" />
		<Path d="M12.72,17.34h3.92a.76.76,0,0,0,.76-.76V14.07l.67.67a.7.7,0,0,0,1-1h0l-1.82-1.83a.77.77,0,0,0-1.08,0h0l-1.83,1.83a.7.7,0,1,0,1,1l.66-.67v1.87H12.72a.7.7,0,1,0,0,1.4Z" />
	</SVG>
);

const KubioLogo = (
	<SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 320">
		<Path d="M5.77,320a5,5,0,0,1-4.27-4.94V175a5,5,0,0,1,5-5H146.56a5,5,0,0,1,4.94,4.26A150.06,150.06,0,0,1,5.77,320Z" />
		<Path d="M176,150a2,2,0,0,1-1.5-1.93V8a2,2,0,0,1,2-2H316.56A2,2,0,0,1,318.5,7.5,147.06,147.06,0,0,1,176,150Z" />
		<Path d="M176.51,314a2,2,0,0,1-2-2V171.93A2,2,0,0,1,176,170,147.06,147.06,0,0,1,318.5,312.5a2,2,0,0,1-1.94,1.49Z" />
		<Path d="M151.5,145.74a5,5,0,0,1-4.94,4.26H6.51a5,5,0,0,1-5-5V4.94A5,5,0,0,1,5.77,0,150.06,150.06,0,0,1,151.5,145.74Z" />
	</SVG>
);

const Translate = (
	<SVG
		id="Layer_1"
		data-name="Layer 1"
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 512 512"
	>
		<Path
			className="cls-1"
			d="M137.5,463.79l-1.14,0,.7-23.7h34.23v23.71H137.5Zm325.21,0H428.13V440.08h34.58Zm-58.29,0H369.85V440.08h34.57Zm-58.28,0H311.56V440.08h34.58Zm-58.29,0H253.28V440.08h34.57Zm-58.28,0H195V440.08h34.57Zm262.14-5.7-12-20.42a17.58,17.58,0,0,0,8.63-15.06v-4.1H512v4.1A41.4,41.4,0,0,1,491.71,458.09Zm-384.72-8a41.11,41.11,0,0,1-10.57-27.52v-13.1h23.71v13.1a17.4,17.4,0,0,0,4.48,11.66ZM512,394.8H488.29V360.23H512Zm-391.87-9H96.42V351.22h23.71ZM512,336.52H488.29V301.94H512Zm-391.87-9H96.42V292.94h23.71ZM512,278.23H488.29V243.66H512Zm-391.87-9H96.42V234.65h23.71ZM512,220H488.29V185.38H512Zm-391.87-9H96.42V176.37h23.71ZM512,161.67H488.29V127.09H512Zm-391.87-9H96.42V118.09h23.71ZM512,103.38H488.29v-14a17.45,17.45,0,0,0-4.13-11.26l18.1-15.32A41.19,41.19,0,0,1,512,89.39Zm-391.87-9H96.42v-5a41,41,0,0,1,19.23-34.83l12.66,20a17.44,17.44,0,0,0-8.18,14.79ZM471.88,72c-.34,0-.7,0-1,0H436.25V48.21h34.57c.78,0,1.66,0,2.5.08Zm-59.34,0H378V48.21h34.58Zm-58.28,0H319.68V48.21h34.58Zm-58.29,0H261.4V48.21H296Zm-58.28,0H203.11V48.21h34.58Zm-58.29,0H144.83V48.21H179.4Z"
		/>
		<g style={{ opacity: 0.3 }}>
			<Rect
				className="cls-1"
				y="60.07"
				width="391.87"
				height="391.87"
				rx="15.51"
			/>
		</g>
	</SVG>
);
const Skew = (
	<svg
		id="Layer_1"
		data-name="Layer 1"
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 512 512"
	>
		<Path
			className="cls-1"
			d="M104.84,445.74a39.41,39.41,0,0,1-5.94-.46l3.7-23.72a14,14,0,0,0,2.24.18h30.89v24H104.84Zm302.3,0H385.73v-24h21.41a14.39,14.39,0,0,0,7.12-1.86L426,440.79A38.55,38.55,0,0,1,407.14,445.74Zm-43.41,0h-35v-24h35Zm-57,0h-35v-24h35Zm-57,0h-35v-24h35Zm-57,0h-35v-24h35ZM72.78,428.58a38.34,38.34,0,0,1-6.52-21.44V387.8h24v19.34a14.49,14.49,0,0,0,2.45,8.08ZM444.7,416l-23.35-5.53a14.64,14.64,0,0,0,.39-3.37V378.33h24v28.81A38.53,38.53,0,0,1,444.7,416ZM90.26,365.8h-24v-35h24Zm355.48-9.47h-24v-35h24ZM90.26,308.8h-24v-35h24Zm355.48-9.47h-24v-35h24ZM90.26,251.8h-24v-35h24Zm355.48-9.47h-24v-35h24ZM90.26,194.8h-24v-35h24Zm355.48-9.47h-24v-35h24ZM90.26,137.8h-24V104.86c0-1,0-2,.12-3l23.93,1.86c0,.37,0,.76,0,1.15Zm355.48-9.47h-24V104.86a14.4,14.4,0,0,0-1.34-6.11l21.76-10.12a38.3,38.3,0,0,1,3.58,16.23ZM95.86,93.39,81,74.53a38.75,38.75,0,0,1,23.86-8.27h17.28v24H104.86A14.36,14.36,0,0,0,95.86,93.39ZM411.59,91a14.54,14.54,0,0,0-4.46-.7h-35v-24h35a38.24,38.24,0,0,1,11.79,1.85Zm-61.45-.7h-35v-24h35Zm-57,0h-35v-24h35Zm-57,0h-35v-24h35Zm-57,0h-35v-24h35Z"
		/>
		<g style={{ opacity: 0.3 }}>
			<Path
				className="cls-1"
				d="M501.44,78.26H172.65a15.82,15.82,0,0,0-14.29,9L1,418.67a10.55,10.55,0,0,0,9.53,15.07H339.35a15.82,15.82,0,0,0,14.29-9L511,93.33A10.55,10.55,0,0,0,501.44,78.26Z"
			/>
		</g>
	</svg>
);
const Scale = (
	<SVG
		id="Layer_1"
		data-name="Layer 1"
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 512 512"
	>
		<g style={{ opacity: 0.3 }}>
			<Rect className="cls-2" width="512" height="512" rx="20" />
		</g>
		<Path
			className="cls-2"
			d="M380.36,436.5h-35v-24h35Zm-59,0h-35v-24h35Zm-59,0h-35v-24h35Zm-59,0h-35v-24h35Zm-59,0H112.72a36.93,36.93,0,0,1-4.94-.33L111,412.38a12.69,12.69,0,0,0,1.76.12h31.64Zm262.35-.75-4.78-23.51a13.27,13.27,0,0,0,10.57-13v-.45h24v.45A37.34,37.34,0,0,1,406.71,435.75ZM79.82,416.68a37.24,37.24,0,0,1-4.32-17.4V376.54h24v22.74a13,13,0,0,0,1.52,6.15ZM436.5,374.83h-24v-35h24Zm-337-22.29h-24v-35h24Zm337-36.71h-24v-35h24Zm-337-22.29h-24v-35h24Zm337-36.71h-24v-35h24Zm-337-22.29h-24v-35h24Zm337-36.71h-24v-35h24Zm-337-22.29h-24v-35h24Zm337-36.71h-24V112.72a13.08,13.08,0,0,0-.81-4.56l22.52-8.31a37.1,37.1,0,0,1,2.29,12.87Zm-337-22.29h-24v-3.82a37.27,37.27,0,0,1,25-35.16l7.9,22.67a13.24,13.24,0,0,0-8.89,12.49ZM402.76,100a13.51,13.51,0,0,0-3.48-.46h-35v-24h35a37.1,37.1,0,0,1,9.8,1.31Zm-62.48-.46h-35v-24h35Zm-59,0h-35v-24h35Zm-59,0h-35v-24h35Zm-59,0h-35v-24h35Z"
		/>
	</SVG>
);
const Rotate = (
	<SVG
		id="Layer_1"
		data-name="Layer 1"
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 512 512"
	>
		<Path
			className="cls-1"
			d="M426.11,468.05H391.38v-24h34.88l.25,24Zm-59.73,0h-35v-24h35Zm-60,0h-35v-24h35Zm-60,0h-35v-24h35Zm-60,0h-35v-24h35Zm-60,0h-35v-24h35Zm-65.92-8.61A41.64,41.64,0,0,1,44,426.11v-7.47H68v7.47A17.81,17.81,0,0,0,75,440.37Zm397-5.47-17.93-16a17.85,17.85,0,0,0,4.54-11.9V412.87h24v13.24A41.88,41.88,0,0,1,457.44,454ZM68,393.64H44v-35H68Zm400.1-5.77h-24v-35h24ZM68,333.64H44v-35H68Zm400.1-5.77h-24v-35h24ZM68,273.64H44v-35H68Zm400.1-5.77h-24v-35h24ZM68,213.64H44v-35H68Zm400.1-5.77h-24v-35h24ZM68,153.64H44v-35H68Zm400.1-5.77h-24v-35h24ZM68,93.64H44V85.89a41.73,41.73,0,0,1,16.2-33.1L74.9,71.73a17.84,17.84,0,0,0-7,14.16Zm400.1-5.77h-24v-2a17.9,17.9,0,0,0-9.87-16L445,48.47a41.79,41.79,0,0,1,23,37.42ZM426.11,68h-35V44h35Zm-60,0h-35V44h35Zm-60,0h-35V44h35Zm-60,0h-35V44h35Zm-60,0h-35V44h35Zm-60,0h-35V44h35Z"
		/>
		<g style={{ opacity: 0.3 }}>
			<Rect
				className="cls-1"
				x="55.95"
				y="55.95"
				width="400.1"
				height="400.1"
				rx="29.94"
				transform="translate(-84.21 379.82) rotate(-65)"
			/>
		</g>
	</SVG>
);
const Perspective = (
	<SVG
		id="Layer_1"
		data-name="Layer 1"
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 512 512"
	>
		<Path
			className="cls-1"
			d="M480.74,512H453.55V487.57h27.19a6.73,6.73,0,0,0,3.56-1l12.77,20.82A31.21,31.21,0,0,1,480.74,512Zm-49.58,0H393.5V487.57h37.66Zm-60.05,0H333.45V487.57h37.66Zm-60.05,0H273.4V487.57h37.66ZM251,512H213.36V487.57H251Zm-60,0H153.31V487.57H191Zm-60.05,0H93.26V487.57h37.66Zm-60,0H33.21V487.57H70.87ZM3.8,495.69A31.3,31.3,0,0,1,0,480.74V452.57H24.43v28.17a6.69,6.69,0,0,0,.82,3.26ZM512,477.81H487.57V440.15H512ZM24.43,430.18H0V392.53H24.43ZM512,417.76H487.57V380.11H512ZM24.43,370.13H0V332.48H24.43ZM512,357.72H487.57V320.06H512ZM24.43,310.09H0V272.43H24.43ZM512,297.67H487.57V260H512ZM24.43,250H0V212.38H24.43ZM512,237.62H487.57V200H512ZM24.43,190H0V152.33H24.43ZM512,177.57H487.57V139.91H512ZM24.43,129.94H0V92.28H24.43ZM512,117.52H487.57V79.86H512ZM24.43,69.89H0V32.24H24.43ZM512,57.47H487.57V31.26a6.77,6.77,0,0,0-1.18-3.85l20.14-13.83A31.12,31.12,0,0,1,512,31.26ZM28.31,25.09l-10.57-22A31,31,0,0,1,31.26,0H60.4V24.43H31.26A6.77,6.77,0,0,0,28.31,25.09Zm452.43-.66H443.08V0h37.66Zm-60.05,0H383V0h37.65Zm-60.05,0H323V0h37.65Zm-60,0H262.94V0H300.6Zm-60.05,0H202.89V0h37.66Zm-60.05,0H142.84V0H180.5Zm-60,0H82.79V0h37.66Z"
		/>
		<g style={{ opacity: 0.3 }}>
			<Path
				className="cls-1"
				d="M415.58,203.16H94.25a10.17,10.17,0,0,0-9.87,7.72l-67,268.87A20.35,20.35,0,0,0,37.17,505H472.66a20.35,20.35,0,0,0,19.75-25.27l-67-268.87A10.18,10.18,0,0,0,415.58,203.16Z"
			/>
		</g>
	</SVG>
);

const UnlockIcon = (
	<SVG viewBox="0 0 20 20">
		<Path d="M12 9v-3c0-1.1-0.9-2-2-2s-2 0.9-2 2h-2c0-2.21 1.79-4 4-4s4 1.79 4 4v3h1c0.55 0 1 0.45 1 1v7c0 0.55-0.45 1-1 1h-10c-0.55 0-1-0.45-1-1v-7c0-0.55 0.45-1 1-1h7zM11 16l-0.36-2.15c0.51-0.24 0.86-0.75 0.86-1.35 0-0.83-0.67-1.5-1.5-1.5s-1.5 0.67-1.5 1.5c0 0.6 0.35 1.11 0.86 1.35l-0.36 2.15h2z" />
	</SVG>
);

const LockIcon = (
	<SVG viewBox="0 0 20 20">
		<Path d="M15,9h-1V6c0-2.2-1.8-4-4-4S6,3.8,6,6v3H5c-0.5,0-1,0.5-1,1v7c0,0.5,0.5,1,1,1h10c0.5,0,1-0.5,1-1v-7C16,9.5,15.5,9,15,9z   M11,16H9l0.4-2.2c-0.5-0.2-0.9-0.8-0.9-1.3c0-0.8,0.7-1.5,1.5-1.5s1.5,0.7,1.5,1.5c0,0.6-0.3,1.1-0.9,1.3L11,16z M12,9H8V6  c0-1.1,0.9-2,2-2s2,0.9,2,2V9z" />
	</SVG>
);

const WooCommerceSmallLogo = (
	<SVG viewBox="0 0 1024 1024">
		<Path
			fill="#a2aab2"
			d="M612.192 426.336c0-6.896-3.136-51.6-28-51.6-37.36 0-46.704 72.256-46.704 82.624 0 3.408 3.152 58.496 28.032 58.496 34.192-.032 46.672-72.288 46.672-89.52zm202.192 0c0-6.896-3.152-51.6-28.032-51.6-37.28 0-46.608 72.256-46.608 82.624 0 3.408 3.072 58.496 27.952 58.496 34.192-.032 46.688-72.288 46.688-89.52zM141.296.768c-68.224 0-123.504 55.488-123.504 123.92v650.72c0 68.432 55.296 123.92 123.504 123.92h339.808l123.504 123.936V899.328h278.048c68.224 0 123.52-55.472 123.52-123.92v-650.72c0-68.432-55.296-123.92-123.52-123.92h-741.36zm526.864 422.16c0 55.088-31.088 154.88-102.64 154.88-6.208 0-18.496-3.616-25.424-6.016-32.512-11.168-50.192-49.696-52.352-66.256 0 0-3.072-17.792-3.072-40.752 0-22.992 3.072-45.328 3.072-45.328 15.552-75.728 43.552-106.736 96.448-106.736 59.072-.032 83.968 58.528 83.968 110.208zM486.496 302.4c0 3.392-43.552 141.168-43.552 213.424v75.712c-2.592 12.08-4.16 24.144-21.824 24.144-46.608 0-88.88-151.472-92.016-161.84-6.208 6.896-62.24 161.84-96.448 161.84-24.864 0-43.552-113.648-46.608-123.936C176.704 436.672 160 334.224 160 327.328c0-20.672 1.152-38.736 26.048-38.736 6.208 0 21.6 6.064 23.712 17.168 11.648 62.032 16.688 120.512 29.168 185.968 1.856 2.928 1.504 7.008 4.56 10.432 3.152-10.288 66.928-168.784 94.96-168.784 22.544 0 30.4 44.592 33.536 61.824 6.208 20.656 13.088 55.216 22.416 82.752 0-13.776 12.48-203.12 65.392-203.12 18.592.032 26.704 6.928 26.704 27.568zM870.32 422.928c0 55.088-31.088 154.88-102.64 154.88-6.192 0-18.448-3.616-25.424-6.016-32.432-11.168-50.176-49.696-52.288-66.256 0 0-3.888-17.92-3.888-40.896s3.888-45.184 3.888-45.184c15.552-75.728 43.488-106.736 96.384-106.736 59.104-.032 83.968 58.528 83.968 110.208z"
		/>
	</SVG>
);
const QueryLayoutIcon1 = (
	<SVG viewBox="0 0 47 47">
		<Rect x="8.65" y="6.76" width="17.55" height="1.3" />
		<Rect x="30.03" y="6.76" width="8.32" height="1.3" />
		<Rect x="8.65" y="14.91" width="29.69" height="1.3" />
		<Rect x="20.79" y="10.84" width="17.55" height="1.3" />
		<Rect x="8.65" y="10.84" width="8.32" height="1.3" />
		<Rect x="8.65" y="18.99" width="20.86" height="1.3" />
		<Rect x="33.34" y="18.99" width="5" height="1.3" />
		<Rect x="8.65" y="22.92" width="17.55" height="1.3" />
		<Rect x="30.03" y="22.92" width="8.32" height="1.3" />
		<Rect x="8.65" y="31.08" width="29.69" height="1.3" />
		<Rect x="20.79" y="27" width="17.55" height="1.3" />
		<Rect x="8.65" y="27" width="8.32" height="1.3" />
		<Rect x="20.79" y="39.09" width="17.55" height="1.3" />
		<Rect x="8.65" y="39.09" width="8.32" height="1.3" />
		<Rect x="8.65" y="35.15" width="20.86" height="1.3" />
		<Rect x="33.34" y="35.15" width="5" height="1.3" />
	</SVG>
);
const QueryLayoutIcon2 = (
	<SVG viewBox="0 0 47 47">
		<Path d="M16.36,14.3V11.56a.87.87,0,0,0-.87-.87H12.75a.87.87,0,0,0-.87.87V14.3a.87.87,0,0,0,.87.87h2.74A.87.87,0,0,0,16.36,14.3Zm-1.3-.43H13.18V12h1.88Z" />
		<Path d="M12.61,17.67h3a.8.8,0,0,1,0,1.6h-3a.8.8,0,0,1,0-1.6Z" />
		<Path d="M12.61,20.82h3a.8.8,0,0,1,0,1.6h-3a.8.8,0,1,1,0-1.6Z" />
		<Path d="M12.61,24h3a.8.8,0,0,1,0,1.6h-3a.8.8,0,1,1,0-1.6Z" />
		<Path d="M8.65,8.86V38.14A2.32,2.32,0,0,0,10,40.25h0l.31.1.13,0a2,2,0,0,0,.48.05h8.62V6.55H11a1.83,1.83,0,0,0-.47,0l-.15,0-.3.1h0A2.3,2.3,0,0,0,8.65,8.86Zm1.6.3v-.3a.72.72,0,0,1,.44-.66.82.82,0,0,1,.28,0h7v30.7H11a.72.72,0,0,1-.72-.71v-29Z" />
		<Rect x="22.11" y="6.76" width="9.6" height="1.3" />
		<Rect x="33.8" y="6.76" width="4.55" height="1.3" />
		<Rect x="22.11" y="14.91" width="16.24" height="1.3" />
		<Rect x="28.75" y="10.84" width="9.6" height="1.3" />
		<Rect x="22.11" y="10.84" width="4.55" height="1.3" />
		<Rect x="22.11" y="18.99" width="11.41" height="1.3" />
		<Rect x="35.61" y="18.99" width="2.74" height="1.3" />
		<Rect x="22.11" y="22.92" width="9.6" height="1.3" />
		<Rect x="33.8" y="22.92" width="4.55" height="1.3" />
		<Rect x="22.11" y="31.08" width="16.24" height="1.3" />
		<Rect x="28.75" y="27" width="9.6" height="1.3" />
		<Rect x="22.11" y="27" width="4.55" height="1.3" />
		<Rect x="28.75" y="39.09" width="9.6" height="1.3" />
		<Rect x="22.11" y="39.09" width="4.55" height="1.3" />
		<Rect x="22.11" y="35.15" width="11.41" height="1.3" />
		<Rect x="35.61" y="35.15" width="2.74" height="1.3" />
	</SVG>
);
const QueryLayoutIcon3 = (
	<SVG viewBox="0 0 47 47">
		<Path d="M31.51,15.17h2.74a.87.87,0,0,0,.87-.87V11.56a.87.87,0,0,0-.87-.87H31.51a.87.87,0,0,0-.87.87V14.3A.87.87,0,0,0,31.51,15.17ZM31.94,12h1.88v1.88H31.94Z" />
		<Path d="M34.39,17.67h-3a.8.8,0,0,0,0,1.6h3a.8.8,0,0,0,0-1.6Z" />
		<Path d="M34.39,20.82h-3a.8.8,0,0,0,0,1.6h3a.8.8,0,1,0,0-1.6Z" />
		<Path d="M34.39,24h-3a.8.8,0,0,0,0,1.6h3a.8.8,0,1,0,0-1.6Z" />
		<Path d="M37,6.75h0l-.3-.1-.15,0a1.83,1.83,0,0,0-.47,0H27.41v33.9H36a2,2,0,0,0,.48-.05l.13,0,.31-.1h0a2.32,2.32,0,0,0,1.38-2.11V8.86A2.3,2.3,0,0,0,37,6.75Zm-.21,5.48V38.14a.72.72,0,0,1-.72.71H29V8.15h7a.82.82,0,0,1,.28,0,.72.72,0,0,1,.44.66v3.37Z" />
		<Rect x="15.29" y="6.76" width="9.6" height="1.3" />
		<Rect x="8.65" y="6.76" width="4.55" height="1.3" />
		<Rect x="8.65" y="14.91" width="16.24" height="1.3" />
		<Rect x="8.65" y="10.84" width="9.6" height="1.3" />
		<Rect x="20.34" y="10.84" width="4.55" height="1.3" />
		<Rect x="13.48" y="18.99" width="11.41" height="1.3" />
		<Rect x="8.65" y="18.99" width="2.74" height="1.3" />
		<Rect x="15.29" y="22.92" width="9.6" height="1.3" />
		<Rect x="8.65" y="22.92" width="4.55" height="1.3" />
		<Rect x="8.65" y="31.08" width="16.24" height="1.3" />
		<Rect x="8.65" y="27" width="9.6" height="1.3" />
		<Rect x="20.34" y="27" width="4.55" height="1.3" />
		<Rect x="8.65" y="39.09" width="9.6" height="1.3" />
		<Rect x="20.34" y="39.09" width="4.55" height="1.3" />
		<Rect x="13.48" y="35.15" width="11.41" height="1.3" />
		<Rect x="8.65" y="35.15" width="2.74" height="1.3" />
	</SVG>
);

const UpdateIcon = (
	<SVG id="a" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
		<Path d="M505.35,243.2h-36.61l-1.25-9.02c-7.08-51.04-31.53-97.9-68.83-131.96-37.71-34.43-86.16-53.39-136.44-53.39-54.73,0-106.34,22.03-145.31,62.03-2.4,2.46-2.58,6.9-.39,9.51l30.53,36.25c1.64,1.95,3.48,2.4,4.74,2.44,1.83,.06,3.61-.75,5.03-2.25,28.24-29.94,65.68-46.42,105.4-46.42,33.73,0,66.73,12.18,92.93,34.3,25.75,21.74,43.97,52.16,51.32,85.65l2.82,12.87h-48c-3.84,0-5.49,2.83-6.02,4.04-.53,1.21-1.49,4.37,1.05,7.38l72.03,85.73c1.72,2.05,3.86,2.35,4.98,2.35s3.26-.31,4.98-2.35l72.04-85.73c2.53-3.01,1.57-6.16,1.04-7.38s-2.18-4.04-6.02-4.04Z" />
		<Path d="M364.95,355.38c-1.64-1.95-3.48-2.4-4.74-2.44-1.81-.06-3.61,.74-5.04,2.25-28.24,29.94-65.68,46.42-105.4,46.42-33.73,0-66.73-12.18-92.93-34.3-25.75-21.74-43.97-52.16-51.32-85.65l-2.82-12.87h47.95c3.84,0,5.49-2.82,6.02-4.04s1.49-4.36-1.04-7.37c-10.06-11.98-20.11-23.97-30.16-35.96-13.69-16.34-27.85-33.24-41.81-49.81-1.71-2.03-3.84-2.34-4.96-2.34h0c-1.12,0-3.26,.31-4.98,2.35L1.67,257.38c-2.53,3.01-1.57,6.16-1.04,7.38,.53,1.22,2.18,4.04,6.02,4.04H43.26l1.25,9.02c7.08,51,31.56,97.86,68.94,131.96,37.75,34.43,86.16,53.4,136.32,53.4,54.78,0,106.39-22.03,145.32-62.03,2.4-2.46,2.57-6.9,.38-9.51l-30.53-36.26Z" />
	</SVG>
);

import { KubioLoader } from './kubio-loader';
import { BlockIconWrapper } from './block-icons/utils/block-icon-wrapper';



export {
	DummyIcon,
	Dots,
	ArrowLeft,
	ArrowRight,
	ArrowDown,
	LayoutIcon,
	StyleIcon,
	AdvancedIcon,
	ResetIcon,
	SubmenuIcon,
	CogIcon,
	NoneIcon,
	ImageIcon,
	GradientIcon,
	SlideshowIcon,
	VideoIcon,
	AddItemIcon,
	DeleteItemIcon,
	DuplicateItemIcon,
	NavOption1,
	NavOption2,
	NavOption3,
	NavOption4,
	NavOption5,
	HeroIcon1,
	HeroIcon2,
	HeroIcon3,
	HeroIcon4,
	HeroIcon5,
	CustomIcon,
	MoreHorizontalMobile,
	MoreVerticalMobile,
	BorderTop,
	BorderLeft,
	BorderBottom,
	BorderRight,
	BorderRadiusAll,
	BorderRadiusBottomLeft,
	BorderRadiusBottomRight,
	BorderRadiusTopLeft,
	BorderRadiusTopRight,
	HorizontalAlignLeft,
	HorizontalAlignCenter,
	HorizontalAlignRight,
	VerticalAlignBottom,
	VerticalAlignMiddle,
	VerticalAlignTop,
	TextAlignLeft,
	TextAlignCenter,
	TextAlignRight,
	TextAlignJustify,
	EnterIcon,
	LockIcon,
	UnlockIcon,
	ReplaceIcon,
	KubioLogo,
	// block icons
	BlockIcons,
	Translate,
	Skew,
	Scale,
	Rotate,
	Perspective,
	WooCommerceSmallLogo,
	QueryLayoutIcon1,
	QueryLayoutIcon2,
	QueryLayoutIcon3,
	UpdateIcon,
	KubioLoader,
	BlockIconWrapper,
};
