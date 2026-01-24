export const CITIES = [
  // Asia - East
  { name: "Seoul", timezone: "Asia/Seoul", country: "South Korea", region: "Asia" },
  { name: "Busan", timezone: "Asia/Seoul", country: "South Korea", region: "Asia" },
  { name: "Tokyo", timezone: "Asia/Tokyo", country: "Japan", region: "Asia" },
  { name: "Osaka", timezone: "Asia/Tokyo", country: "Japan", region: "Asia" },
  { name: "Beijing", timezone: "Asia/Shanghai", country: "China", region: "Asia" },
  { name: "Shanghai", timezone: "Asia/Shanghai", country: "China", region: "Asia" },
  { name: "Shenzhen", timezone: "Asia/Shanghai", country: "China", region: "Asia" },
  { name: "Guangzhou", timezone: "Asia/Shanghai", country: "China", region: "Asia" },
  { name: "Hong Kong", timezone: "Asia/Hong_Kong", country: "Hong Kong", region: "Asia" },
  { name: "Taipei", timezone: "Asia/Taipei", country: "Taiwan", region: "Asia" },
  { name: "Macau", timezone: "Asia/Macau", country: "Macau", region: "Asia" },

  // Asia - Southeast
  { name: "Singapore", timezone: "Asia/Singapore", country: "Singapore", region: "Asia" },
  { name: "Bangkok", timezone: "Asia/Bangkok", country: "Thailand", region: "Asia" },
  { name: "Ho Chi Minh City", timezone: "Asia/Ho_Chi_Minh", country: "Vietnam", region: "Asia" },
  { name: "Hanoi", timezone: "Asia/Ho_Chi_Minh", country: "Vietnam", region: "Asia" },
  { name: "Jakarta", timezone: "Asia/Jakarta", country: "Indonesia", region: "Asia" },
  { name: "Bali", timezone: "Asia/Makassar", country: "Indonesia", region: "Asia" },
  { name: "Kuala Lumpur", timezone: "Asia/Kuala_Lumpur", country: "Malaysia", region: "Asia" },
  { name: "Manila", timezone: "Asia/Manila", country: "Philippines", region: "Asia" },

  // Asia - South
  { name: "Mumbai", timezone: "Asia/Kolkata", country: "India", region: "Asia" },
  { name: "Delhi", timezone: "Asia/Kolkata", country: "India", region: "Asia" },
  { name: "Bangalore", timezone: "Asia/Kolkata", country: "India", region: "Asia" },
  { name: "Chennai", timezone: "Asia/Kolkata", country: "India", region: "Asia" },
  { name: "Kolkata", timezone: "Asia/Kolkata", country: "India", region: "Asia" },
  { name: "Dhaka", timezone: "Asia/Dhaka", country: "Bangladesh", region: "Asia" },
  { name: "Karachi", timezone: "Asia/Karachi", country: "Pakistan", region: "Asia" },
  { name: "Colombo", timezone: "Asia/Colombo", country: "Sri Lanka", region: "Asia" },

  // Asia - Central & West
  { name: "Dubai", timezone: "Asia/Dubai", country: "UAE", region: "Middle East" },
  { name: "Abu Dhabi", timezone: "Asia/Dubai", country: "UAE", region: "Middle East" },
  { name: "Doha", timezone: "Asia/Qatar", country: "Qatar", region: "Middle East" },
  { name: "Riyadh", timezone: "Asia/Riyadh", country: "Saudi Arabia", region: "Middle East" },
  { name: "Tel Aviv", timezone: "Asia/Jerusalem", country: "Israel", region: "Middle East" },
  { name: "Jerusalem", timezone: "Asia/Jerusalem", country: "Israel", region: "Middle East" },
  { name: "Tehran", timezone: "Asia/Tehran", country: "Iran", region: "Middle East" },
  { name: "Kuwait City", timezone: "Asia/Kuwait", country: "Kuwait", region: "Middle East" },
  { name: "Almaty", timezone: "Asia/Almaty", country: "Kazakhstan", region: "Asia" },

  // Europe - Western
  { name: "London", timezone: "Europe/London", country: "United Kingdom", region: "Europe" },
  { name: "Manchester", timezone: "Europe/London", country: "United Kingdom", region: "Europe" },
  { name: "Edinburgh", timezone: "Europe/London", country: "United Kingdom", region: "Europe" },
  { name: "Paris", timezone: "Europe/Paris", country: "France", region: "Europe" },
  { name: "Lyon", timezone: "Europe/Paris", country: "France", region: "Europe" },
  { name: "Amsterdam", timezone: "Europe/Amsterdam", country: "Netherlands", region: "Europe" },
  { name: "Brussels", timezone: "Europe/Brussels", country: "Belgium", region: "Europe" },
  { name: "Dublin", timezone: "Europe/Dublin", country: "Ireland", region: "Europe" },
  { name: "Lisbon", timezone: "Europe/Lisbon", country: "Portugal", region: "Europe" },

  // Europe - Central
  { name: "Berlin", timezone: "Europe/Berlin", country: "Germany", region: "Europe" },
  { name: "Munich", timezone: "Europe/Berlin", country: "Germany", region: "Europe" },
  { name: "Frankfurt", timezone: "Europe/Berlin", country: "Germany", region: "Europe" },
  { name: "Zurich", timezone: "Europe/Zurich", country: "Switzerland", region: "Europe" },
  { name: "Geneva", timezone: "Europe/Zurich", country: "Switzerland", region: "Europe" },
  { name: "Vienna", timezone: "Europe/Vienna", country: "Austria", region: "Europe" },
  { name: "Prague", timezone: "Europe/Prague", country: "Czech Republic", region: "Europe" },
  { name: "Warsaw", timezone: "Europe/Warsaw", country: "Poland", region: "Europe" },
  { name: "Budapest", timezone: "Europe/Budapest", country: "Hungary", region: "Europe" },

  // Europe - Southern
  { name: "Rome", timezone: "Europe/Rome", country: "Italy", region: "Europe" },
  { name: "Milan", timezone: "Europe/Rome", country: "Italy", region: "Europe" },
  { name: "Madrid", timezone: "Europe/Madrid", country: "Spain", region: "Europe" },
  { name: "Barcelona", timezone: "Europe/Madrid", country: "Spain", region: "Europe" },
  { name: "Athens", timezone: "Europe/Athens", country: "Greece", region: "Europe" },
  { name: "Istanbul", timezone: "Europe/Istanbul", country: "Turkey", region: "Europe" },

  // Europe - Northern
  { name: "Stockholm", timezone: "Europe/Stockholm", country: "Sweden", region: "Europe" },
  { name: "Oslo", timezone: "Europe/Oslo", country: "Norway", region: "Europe" },
  { name: "Copenhagen", timezone: "Europe/Copenhagen", country: "Denmark", region: "Europe" },
  { name: "Helsinki", timezone: "Europe/Helsinki", country: "Finland", region: "Europe" },

  // Europe - Eastern
  { name: "Moscow", timezone: "Europe/Moscow", country: "Russia", region: "Europe" },
  { name: "St. Petersburg", timezone: "Europe/Moscow", country: "Russia", region: "Europe" },
  { name: "Kyiv", timezone: "Europe/Kyiv", country: "Ukraine", region: "Europe" },
  { name: "Bucharest", timezone: "Europe/Bucharest", country: "Romania", region: "Europe" },

  // North America - USA East
  { name: "New York", timezone: "America/New_York", country: "USA", region: "North America" },
  { name: "Boston", timezone: "America/New_York", country: "USA", region: "North America" },
  { name: "Washington D.C.", timezone: "America/New_York", country: "USA", region: "North America" },
  { name: "Miami", timezone: "America/New_York", country: "USA", region: "North America" },
  { name: "Atlanta", timezone: "America/New_York", country: "USA", region: "North America" },
  { name: "Philadelphia", timezone: "America/New_York", country: "USA", region: "North America" },

  // North America - USA Central
  { name: "Chicago", timezone: "America/Chicago", country: "USA", region: "North America" },
  { name: "Houston", timezone: "America/Chicago", country: "USA", region: "North America" },
  { name: "Dallas", timezone: "America/Chicago", country: "USA", region: "North America" },
  { name: "Austin", timezone: "America/Chicago", country: "USA", region: "North America" },

  // North America - USA Mountain
  { name: "Denver", timezone: "America/Denver", country: "USA", region: "North America" },
  { name: "Phoenix", timezone: "America/Phoenix", country: "USA", region: "North America" },
  { name: "Salt Lake City", timezone: "America/Denver", country: "USA", region: "North America" },

  // North America - USA West
  { name: "Los Angeles", timezone: "America/Los_Angeles", country: "USA", region: "North America" },
  { name: "San Francisco", timezone: "America/Los_Angeles", country: "USA", region: "North America" },
  { name: "San Diego", timezone: "America/Los_Angeles", country: "USA", region: "North America" },
  { name: "Seattle", timezone: "America/Los_Angeles", country: "USA", region: "North America" },
  { name: "Portland", timezone: "America/Los_Angeles", country: "USA", region: "North America" },
  { name: "Las Vegas", timezone: "America/Los_Angeles", country: "USA", region: "North America" },

  // North America - USA Other
  { name: "Honolulu", timezone: "Pacific/Honolulu", country: "USA", region: "North America" },
  { name: "Anchorage", timezone: "America/Anchorage", country: "USA", region: "North America" },

  // North America - Canada
  { name: "Toronto", timezone: "America/Toronto", country: "Canada", region: "North America" },
  { name: "Vancouver", timezone: "America/Vancouver", country: "Canada", region: "North America" },
  { name: "Montreal", timezone: "America/Toronto", country: "Canada", region: "North America" },
  { name: "Calgary", timezone: "America/Edmonton", country: "Canada", region: "North America" },
  { name: "Ottawa", timezone: "America/Toronto", country: "Canada", region: "North America" },

  // North America - Mexico
  { name: "Mexico City", timezone: "America/Mexico_City", country: "Mexico", region: "North America" },
  { name: "Cancun", timezone: "America/Cancun", country: "Mexico", region: "North America" },
  { name: "Guadalajara", timezone: "America/Mexico_City", country: "Mexico", region: "North America" },

  // South America
  { name: "São Paulo", timezone: "America/Sao_Paulo", country: "Brazil", region: "South America" },
  { name: "Rio de Janeiro", timezone: "America/Sao_Paulo", country: "Brazil", region: "South America" },
  { name: "Brasilia", timezone: "America/Sao_Paulo", country: "Brazil", region: "South America" },
  { name: "Buenos Aires", timezone: "America/Argentina/Buenos_Aires", country: "Argentina", region: "South America" },
  { name: "Santiago", timezone: "America/Santiago", country: "Chile", region: "South America" },
  { name: "Lima", timezone: "America/Lima", country: "Peru", region: "South America" },
  { name: "Bogota", timezone: "America/Bogota", country: "Colombia", region: "South America" },
  { name: "Caracas", timezone: "America/Caracas", country: "Venezuela", region: "South America" },
  { name: "Quito", timezone: "America/Guayaquil", country: "Ecuador", region: "South America" },

  // Oceania
  { name: "Sydney", timezone: "Australia/Sydney", country: "Australia", region: "Oceania" },
  { name: "Melbourne", timezone: "Australia/Melbourne", country: "Australia", region: "Oceania" },
  { name: "Brisbane", timezone: "Australia/Brisbane", country: "Australia", region: "Oceania" },
  { name: "Perth", timezone: "Australia/Perth", country: "Australia", region: "Oceania" },
  { name: "Auckland", timezone: "Pacific/Auckland", country: "New Zealand", region: "Oceania" },
  { name: "Wellington", timezone: "Pacific/Auckland", country: "New Zealand", region: "Oceania" },

  // Africa
  { name: "Cairo", timezone: "Africa/Cairo", country: "Egypt", region: "Africa" },
  { name: "Johannesburg", timezone: "Africa/Johannesburg", country: "South Africa", region: "Africa" },
  { name: "Cape Town", timezone: "Africa/Johannesburg", country: "South Africa", region: "Africa" },
  { name: "Lagos", timezone: "Africa/Lagos", country: "Nigeria", region: "Africa" },
  { name: "Nairobi", timezone: "Africa/Nairobi", country: "Kenya", region: "Africa" },
  { name: "Casablanca", timezone: "Africa/Casablanca", country: "Morocco", region: "Africa" },
  { name: "Accra", timezone: "Africa/Accra", country: "Ghana", region: "Africa" },
  { name: "Addis Ababa", timezone: "Africa/Addis_Ababa", country: "Ethiopia", region: "Africa" },
];

export const WORK_START_HOUR = 9;
export const WORK_END_HOUR = 18;
