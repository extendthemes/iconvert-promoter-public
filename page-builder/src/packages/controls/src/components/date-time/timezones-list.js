const timezones = [
	{
		offset: -12,
		label: '(UTC-12:00) International Date Line West',
	},
	{
		offset: -11,
		label: '(UTC-11:00) Coordinated Universal Time-11',
	},
	{
		offset: -10,
		label: '(UTC-10:00) Hawaii',
	},
	{
		offset: -8,
		label: '(UTC-09:00) Alaska',
	},
	{
		offset: -7,
		label: '(UTC-08:00) Baja California',
	},
	{
		offset: -7,
		label: '(UTC-07:00) Pacific Daylight Time (US & Canada)',
	},
	{
		offset: -8,
		label: '(UTC-08:00) Pacific Standard Time (US & Canada)',
	},
	{
		offset: -7,
		label: '(UTC-07:00) Arizona',
	},
	{
		offset: -6,
		label: '(UTC-07:00) Chihuahua, La Paz, Mazatlan',
	},
	{
		offset: -6,
		label: '(UTC-07:00) Mountain Time (US & Canada)',
	},
	{
		offset: -6,
		label: '(UTC-06:00) Central America',
	},
	{
		offset: -5,
		label: '(UTC-06:00) Central Time (US & Canada)',
	},
	{
		offset: -5,
		label: '(UTC-06:00) Guadalajara, Mexico City, Monterrey',
	},
	{
		offset: -6,
		label: '(UTC-06:00) Saskatchewan',
	},
	{
		offset: -5,
		label: '(UTC-05:00) Bogota, Lima, Quito',
	},
	{
		offset: -5,
		label: '(UTC-05:00) Eastern Time (US & Canada)',
	},
	{
		offset: -4,
		label: '(UTC-04:00) Eastern Daylight Time (US & Canada)',
	},
	{
		offset: -5,
		label: '(UTC-05:00) Indiana (East)',
	},
	{
		offset: -4.5,
		label: '(UTC-04:30) Caracas',
	},
	{
		offset: -4,
		label: '(UTC-04:00) Asuncion',
	},
	{
		offset: -3,
		label: '(UTC-04:00) Atlantic Time (Canada)',
	},
	{
		offset: -4,
		label: '(UTC-04:00) Cuiaba',
	},
	{
		offset: -4,
		label: '(UTC-04:00) Georgetown, La Paz, Manaus, San Juan',
	},
	{
		offset: -4,
		label: '(UTC-04:00) Santiago',
	},
	{
		offset: -2.5,
		label: '(UTC-03:30) Newfoundland',
	},
	{
		offset: -3,
		label: '(UTC-03:00) Brasilia',
	},
	{
		offset: -3,
		label: '(UTC-03:00) Buenos Aires',
	},
	{
		offset: -3,
		label: '(UTC-03:00) Cayenne, Fortaleza',
	},
	{
		offset: -3,
		label: '(UTC-03:00) Greenland',
	},
	{
		offset: -3,
		label: '(UTC-03:00) Montevideo',
	},
	{
		offset: -3,
		label: '(UTC-03:00) Salvador',
	},
	{
		offset: -2,
		label: '(UTC-02:00) Coordinated Universal Time-02',
	},
	{
		offset: -1,
		label: '(UTC-02:00) Mid-Atlantic - Old',
	},
	{
		offset: -1,
		label: '(UTC-01:00) Cape Verde Is.',
	},

	{
		offset: 0,
		label: '(UTC) Coordinated Universal Time',
	},
	{
		offset: 0,
		label: '(UTC) Edinburgh, London',
	},
	{
		offset: 0,
		label: '(UTC) Monrovia, Reykjavik',
	},
	{
		offset: 1,
		label: '(UTC+01:00) Casablanca',
	},
	{
		offset: 1,
		label: '(UTC+01:00) Dublin, Lisbon',
	},
	{
		offset: 1,
		label: '(UTC+01:00) West Central Africa',
	},
	{
		offset: 1,
		label: '(UTC+01:00) Windhoek',
	},
	{
		offset: 2,
		label: '(UTC+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna',
	},
	{
		offset: 2,
		label: '(UTC+01:00) Belgrade, Bratislava, Budapest, Ljubljana, Prague',
	},
	{
		offset: 2,
		label: '(UTC+01:00) Brussels, Copenhagen, Madrid, Paris',
	},
	{
		offset: 2,
		label: '(UTC+01:00) Sarajevo, Skopje, Warsaw, Zagreb',
	},
	{
		offset: 3,
		label: '(UTC+02:00) Athens, Bucharest',
	},
	{
		offset: 3,
		label: '(UTC+02:00) Beirut',
	},
	{
		offset: 2,
		label: '(UTC+02:00) Cairo',
	},
	{
		offset: 3,
		label: '(UTC+02:00) Damascus',
	},
	{
		offset: 3,
		label: '(UTC+02:00) E. Europe',
	},
	{
		offset: 2,
		label: '(UTC+02:00) Harare, Pretoria',
	},
	{
		offset: 3,
		label: '(UTC+02:00) Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius',
	},
	{
		offset: 3,
		label: '(UTC+03:00) Istanbul',
	},
	{
		offset: 3,
		label: '(UTC+02:00) Jerusalem',
	},
	{
		offset: 2,
		label: '(UTC+02:00) Tripoli',
	},
	{
		offset: 3,
		label: '(UTC+03:00) Amman',
	},
	{
		offset: 3,
		label: '(UTC+03:00) Baghdad',
	},
	{
		offset: 3,
		label: '(UTC+02:00) Kaliningrad',
	},
	{
		offset: 3,
		label: '(UTC+03:00) Kuwait, Riyadh',
	},
	{
		offset: 3,
		label: '(UTC+03:00) Nairobi',
	},
	{
		offset: 3,
		label: '(UTC+03:00) Moscow, St. Petersburg, Volgograd, Minsk',
	},
	{
		offset: 4,
		label: '(UTC+04:00) Samara, Ulyanovsk, Saratov',
	},
	{
		offset: 4.5,
		label: '(UTC+03:30) Tehran',
	},
	{
		offset: 4,
		label: '(UTC+04:00) Abu Dhabi, Muscat',
	},
	{
		offset: 5,
		label: '(UTC+04:00) Baku',
	},
	{
		offset: 4,
		label: '(UTC+04:00) Port Louis',
	},
	{
		offset: 4,
		label: '(UTC+04:00) Tbilisi',
	},
	{
		offset: 4,
		label: '(UTC+04:00) Yerevan',
	},
	{
		offset: 4.5,
		label: '(UTC+04:30) Kabul',
	},
	{
		offset: 5,
		label: '(UTC+05:00) Ashgabat, Tashkent',
	},
	{
		offset: 5,
		label: '(UTC+05:00) Yekaterinburg',
	},
	{
		offset: 5,
		label: '(UTC+05:00) Islamabad, Karachi',
	},
	{
		offset: 5.5,
		label: '(UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi',
	},
	{
		offset: 5.5,
		label: '(UTC+05:30) Sri Jayawardenepura',
	},
	{
		offset: 5.75,
		label: '(UTC+05:45) Kathmandu',
	},
	{
		offset: 6,
		label: '(UTC+06:00) Nur-Sultan (Astana)',
	},
	{
		offset: 6,
		label: '(UTC+06:00) Dhaka',
	},
	{
		offset: 6.5,
		label: '(UTC+06:30) Yangon (Rangoon)',
	},
	{
		offset: 7,
		label: '(UTC+07:00) Bangkok, Hanoi, Jakarta',
	},
	{
		offset: 7,
		label: '(UTC+07:00) Novosibirsk',
	},
	{
		offset: 8,
		label: '(UTC+08:00) Beijing, Chongqing, Hong Kong, Urumqi',
	},
	{
		offset: 8,
		label: '(UTC+08:00) Krasnoyarsk',
	},
	{
		offset: 8,
		label: '(UTC+08:00) Kuala Lumpur, Singapore',
	},
	{
		offset: 8,
		label: '(UTC+08:00) Perth',
	},
	{
		offset: 8,
		label: '(UTC+08:00) Taipei',
	},
	{
		offset: 8,
		label: '(UTC+08:00) Ulaanbaatar',
	},
	{
		offset: 8,
		label: '(UTC+08:00) Irkutsk',
	},
	{
		offset: 9,
		label: '(UTC+09:00) Osaka, Sapporo, Tokyo',
	},
	{
		offset: 9,
		label: '(UTC+09:00) Seoul',
	},
	{
		offset: 9.5,
		label: '(UTC+09:30) Adelaide',
	},
	{
		offset: 9.5,
		label: '(UTC+09:30) Darwin',
	},
	{
		offset: 10,
		label: '(UTC+10:00) Brisbane',
	},
	{
		offset: 10,
		label: '(UTC+10:00) Canberra, Melbourne, Sydney',
	},
	{
		offset: 10,
		label: '(UTC+10:00) Guam, Port Moresby',
	},
	{
		offset: 10,
		label: '(UTC+10:00) Hobart',
	},
	{
		offset: 9,
		label: '(UTC+09:00) Yakutsk',
	},
	{
		offset: 11,
		label: '(UTC+11:00) Solomon Is., New Caledonia',
	},
	{
		offset: 11,
		label: '(UTC+11:00) Vladivostok',
	},
	{
		offset: 12,
		label: '(UTC+12:00) Auckland, Wellington',
	},
	{
		offset: 12,
		label: '(UTC+12:00) Coordinated Universal Time+12',
	},
	{
		offset: 12,
		label: '(UTC+12:00) Fiji',
	},
	{
		offset: 12,
		label: '(UTC+12:00) Magadan',
	},
	{
		offset: 13,
		label: '(UTC+12:00) Petropavlovsk-Kamchatsky - Old',
	},
	{
		offset: 13,
		label: "(UTC+13:00) Nuku'alofa",
	},
	{
		offset: 13,
		label: '(UTC+13:00) Samoa',
	},
];

export { timezones };
