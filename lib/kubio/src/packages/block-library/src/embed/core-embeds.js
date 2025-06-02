/**
 * Internal dependencies
 */
import {
	embedAmazonIcon,
	embedAnimotoIcon,
	embedAudioIcon,
	embedContentIcon,
	embedDailymotionIcon,
	embedFacebookIcon,
	embedFlickrIcon,
	embedInstagramIcon,
	embedPhotoIcon,
	embedRedditIcon,
	embedSpotifyIcon,
	embedTumblrIcon,
	embedTwitterIcon,
	embedVideoIcon,
	embedVimeoIcon,
	embedWordPressIcon,
	embedYouTubeIcon,
} from './icons';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { createBlock } from '@wordpress/blocks';

export const common = [
	{
		name: 'core-embed/twitter',
		settings: {
			title: __('Twitter', 'kubio'),
			icon: embedTwitterIcon,
			keywords: ['tweet', __('social', 'kubio')],
			description: __('Embed a tweet.', 'kubio'),
		},
		patterns: [/^https?:\/\/(www\.)?twitter\.com\/.+/i],
	},
	{
		name: 'core-embed/youtube',
		settings: {
			title: __('YouTube', 'kubio'),
			icon: embedYouTubeIcon,
			keywords: [__('music', 'kubio'), __('video', 'kubio')],
			description: __('Embed a YouTube video.', 'kubio'),
		},
		patterns: [
			/^https?:\/\/((m|www)\.)?youtube\.com\/.+/i,
			/^https?:\/\/youtu\.be\/.+/i,
		],
	},
	{
		name: 'core-embed/facebook',
		settings: {
			title: __('Facebook', 'kubio'),
			icon: embedFacebookIcon,
			keywords: [__('social', 'kubio')],
			description: __('Embed a Facebook post.', 'kubio'),
			previewable: false,
		},
		patterns: [/^https?:\/\/www\.facebook.com\/.+/i],
	},
	{
		name: 'core-embed/instagram',
		settings: {
			title: __('Instagram', 'kubio'),
			icon: embedInstagramIcon,
			keywords: [__('image', 'kubio'), __('social', 'kubio')],
			description: __('Embed an Instagram post.', 'kubio'),
		},
		patterns: [/^https?:\/\/(www\.)?instagr(\.am|am\.com)\/.+/i],
	},
	{
		name: 'core-embed/wordpress',
		settings: {
			title: __('WordPress', 'kubio'),
			icon: embedWordPressIcon,
			keywords: [__('post', 'kubio'), __('blog', 'kubio')],
			responsive: false,
			description: __('Embed a WordPress post.', 'kubio'),
		},
	},
	{
		name: 'core-embed/soundcloud',
		settings: {
			title: __('SoundCloud', 'kubio'),
			icon: embedAudioIcon,
			keywords: [__('music', 'kubio'), __('audio', 'kubio')],
			description: __('Embed SoundCloud content.', 'kubio'),
		},
		patterns: [/^https?:\/\/(www\.)?soundcloud\.com\/.+/i],
	},
	{
		name: 'core-embed/spotify',
		settings: {
			title: __('Spotify', 'kubio'),
			icon: embedSpotifyIcon,
			keywords: [__('music', 'kubio'), __('audio', 'kubio')],
			description: __('Embed Spotify content.', 'kubio'),
		},
		patterns: [/^https?:\/\/(open|play)\.spotify\.com\/.+/i],
	},
	{
		name: 'core-embed/flickr',
		settings: {
			title: __('Flickr', 'kubio'),
			icon: embedFlickrIcon,
			keywords: [__('image', 'kubio')],
			description: __('Embed Flickr content.', 'kubio'),
		},
		patterns: [
			/^https?:\/\/(www\.)?flickr\.com\/.+/i,
			/^https?:\/\/flic\.kr\/.+/i,
		],
	},
	{
		name: 'core-embed/vimeo',
		settings: {
			title: __('Vimeo', 'kubio'),
			icon: embedVimeoIcon,
			keywords: [__('video', 'kubio')],
			description: __('Embed a Vimeo video.', 'kubio'),
		},
		patterns: [/^https?:\/\/(www\.)?vimeo\.com\/.+/i],
	},
];

export const others = [
	{
		name: 'core-embed/animoto',
		settings: {
			title: __('Animoto', 'kubio'),
			icon: embedAnimotoIcon,
			description: __('Embed an Animoto video.', 'kubio'),
		},
		patterns: [/^https?:\/\/(www\.)?(animoto|video214)\.com\/.+/i],
	},
	{
		name: 'core-embed/cloudup',
		settings: {
			title: __('Cloudup', 'kubio'),
			icon: embedContentIcon,
			description: __('Embed Cloudup content.', 'kubio'),
		},
		patterns: [/^https?:\/\/cloudup\.com\/.+/i],
	},
	{
		// Deprecated since CollegeHumor content is now powered by YouTube
		name: 'core-embed/collegehumor',
		settings: {
			title: __('CollegeHumor', 'kubio'),
			icon: embedVideoIcon,
			description: __('Embed CollegeHumor content.', 'kubio'),
			supports: {
				inserter: false,
			},
		},
		patterns: [],
	},
	{
		name: 'core-embed/crowdsignal',
		settings: {
			title: __('Crowdsignal', 'kubio'),
			icon: embedContentIcon,
			keywords: ['polldaddy', __('survey', 'kubio')],
			transform: [
				{
					type: 'block',
					blocks: ['core-embed/polldaddy'],
					transform: (content) => {
						return createBlock('core-embed/crowdsignal', {
							content,
						});
					},
				},
			],
			description: __(
				'Embed Crowdsignal (formerly Polldaddy) content.',
				'kubio'
			),
		},
		patterns: [
			/^https?:\/\/((.+\.)?polldaddy\.com|poll\.fm|.+\.survey\.fm)\/.+/i,
		],
	},
	{
		name: 'core-embed/dailymotion',
		settings: {
			title: __('Dailymotion', 'kubio'),
			icon: embedDailymotionIcon,
			keywords: [__('video', 'kubio')],
			description: __('Embed a Dailymotion video.', 'kubio'),
		},
		patterns: [/^https?:\/\/(www\.)?dailymotion\.com\/.+/i],
	},
	{
		name: 'core-embed/hulu',
		settings: {
			title: __('Hulu', 'kubio'),
			icon: embedVideoIcon,
			keywords: [__('video', 'kubio')],
			description: __('Embed Hulu content.', 'kubio'),
		},
		patterns: [/^https?:\/\/(www\.)?hulu\.com\/.+/i],
	},
	{
		name: 'core-embed/imgur',
		settings: {
			title: __('Imgur', 'kubio'),
			icon: embedPhotoIcon,
			description: __('Embed Imgur content.', 'kubio'),
		},
		patterns: [/^https?:\/\/(.+\.)?imgur\.com\/.+/i],
	},
	{
		name: 'core-embed/issuu',
		settings: {
			title: __('Issuu', 'kubio'),
			icon: embedContentIcon,
			description: __('Embed Issuu content.', 'kubio'),
		},
		patterns: [/^https?:\/\/(www\.)?issuu\.com\/.+/i],
	},
	{
		name: 'core-embed/kickstarter',
		settings: {
			title: __('Kickstarter', 'kubio'),
			icon: embedContentIcon,
			description: __('Embed Kickstarter content.', 'kubio'),
		},
		patterns: [
			/^https?:\/\/(www\.)?kickstarter\.com\/.+/i,
			/^https?:\/\/kck\.st\/.+/i,
		],
	},
	{
		name: 'core-embed/meetup-com',
		settings: {
			title: __('Meetup.com', 'kubio'),
			icon: embedContentIcon,
			description: __('Embed Meetup.com content.', 'kubio'),
		},
		patterns: [/^https?:\/\/(www\.)?meetu(\.ps|p\.com)\/.+/i],
	},
	{
		name: 'core-embed/mixcloud',
		settings: {
			title: __('Mixcloud', 'kubio'),
			icon: embedAudioIcon,
			keywords: [__('music', 'kubio'), __('audio', 'kubio')],
			description: __('Embed Mixcloud content.', 'kubio'),
		},
		patterns: [/^https?:\/\/(www\.)?mixcloud\.com\/.+/i],
	},
	{
		// Deprecated in favour of the core-embed/crowdsignal block
		name: 'core-embed/polldaddy',
		settings: {
			title: __('Polldaddy', 'kubio'),
			icon: embedContentIcon,
			description: __('Embed Polldaddy content.', 'kubio'),
			supports: {
				inserter: false,
			},
		},
		patterns: [],
	},
	{
		name: 'core-embed/reddit',
		settings: {
			title: __('Reddit', 'kubio'),
			icon: embedRedditIcon,
			description: __('Embed a Reddit thread.', 'kubio'),
		},
		patterns: [/^https?:\/\/(www\.)?reddit\.com\/.+/i],
	},
	{
		name: 'core-embed/reverbnation',
		settings: {
			title: __('ReverbNation', 'kubio'),
			icon: embedAudioIcon,
			description: __('Embed ReverbNation content.', 'kubio'),
		},
		patterns: [/^https?:\/\/(www\.)?reverbnation\.com\/.+/i],
	},
	{
		name: 'core-embed/screencast',
		settings: {
			title: __('Screencast', 'kubio'),
			icon: embedVideoIcon,
			description: __('Embed Screencast content.', 'kubio'),
		},
		patterns: [/^https?:\/\/(www\.)?screencast\.com\/.+/i],
	},
	{
		name: 'core-embed/scribd',
		settings: {
			title: __('Scribd', 'kubio'),
			icon: embedContentIcon,
			description: __('Embed Scribd content.', 'kubio'),
		},
		patterns: [/^https?:\/\/(www\.)?scribd\.com\/.+/i],
	},
	{
		name: 'core-embed/slideshare',
		settings: {
			title: __('Slideshare', 'kubio'),
			icon: embedContentIcon,
			description: __('Embed Slideshare content.', 'kubio'),
		},
		patterns: [/^https?:\/\/(.+?\.)?slideshare\.net\/.+/i],
	},
	{
		name: 'core-embed/smugmug',
		settings: {
			title: __('SmugMug', 'kubio'),
			icon: embedPhotoIcon,
			description: __('Embed SmugMug content.', 'kubio'),
			previewable: false,
		},
		patterns: [/^https?:\/\/(.+\.)?smugmug\.com\/.*/i],
	},
	{
		// Deprecated in favour of the core-embed/speaker-deck block.
		name: 'core-embed/speaker',
		settings: {
			title: __('Speaker', 'kubio'),
			icon: embedAudioIcon,
			supports: {
				inserter: false,
			},
		},
		patterns: [],
	},
	{
		name: 'core-embed/speaker-deck',
		settings: {
			title: __('Speaker Deck', 'kubio'),
			icon: embedContentIcon,
			transform: [
				{
					type: 'block',
					blocks: ['core-embed/speaker'],
					transform: (content) => {
						return createBlock('core-embed/speaker-deck', {
							content,
						});
					},
				},
			],
			description: __('Embed Speaker Deck content.', 'kubio'),
		},
		patterns: [/^https?:\/\/(www\.)?speakerdeck\.com\/.+/i],
	},
	{
		name: 'core-embed/tiktok',
		settings: {
			title: __('TikTok', 'kubio'),
			icon: embedVideoIcon,
			keywords: [__('video', 'kubio')],
			description: __('Embed a TikTok video.', 'kubio'),
		},
		patterns: [/^https?:\/\/(www\.)?tiktok\.com\/.+/i],
	},
	{
		name: 'core-embed/ted',
		settings: {
			title: __('TED', 'kubio'),
			icon: embedVideoIcon,
			description: __('Embed a TED video.', 'kubio'),
		},
		patterns: [/^https?:\/\/(www\.|embed\.)?ted\.com\/.+/i],
	},
	{
		name: 'core-embed/tumblr',
		settings: {
			title: __('Tumblr', 'kubio'),
			icon: embedTumblrIcon,
			keywords: [__('social', 'kubio')],
			description: __('Embed a Tumblr post.', 'kubio'),
		},
		patterns: [/^https?:\/\/(www\.)?tumblr\.com\/.+/i],
	},
	{
		name: 'core-embed/videopress',
		settings: {
			title: __('VideoPress', 'kubio'),
			icon: embedVideoIcon,
			keywords: [__('video', 'kubio')],
			description: __('Embed a VideoPress video.', 'kubio'),
		},
		patterns: [/^https?:\/\/videopress\.com\/.+/i],
	},
	{
		name: 'core-embed/wordpress-tv',
		settings: {
			title: __('WordPress.tv', 'kubio'),
			icon: embedVideoIcon,
			description: __('Embed a WordPress.tv video.', 'kubio'),
		},
		patterns: [/^https?:\/\/wordpress\.tv\/.+/i],
	},
	{
		name: 'core-embed/amazon-kindle',
		settings: {
			title: __('Amazon Kindle', 'kubio'),
			icon: embedAmazonIcon,
			keywords: [__('ebook', 'kubio')],
			responsive: false,
			description: __('Embed Amazon Kindle content.', 'kubio'),
		},
		patterns: [
			/^https?:\/\/([a-z0-9-]+\.)?(amazon|amzn)(\.[a-z]{2,4})+\/.+/i,
			/^https?:\/\/(www\.)?(a\.co|z\.cn)\/.+/i,
		],
	},
];
