export interface Agent {
  name: string;
  region: string;
  phone: string;
}

export interface Office {
  city: string;
  address: string;
  phone: string;
  hours: string;
}

export const AGENTS: readonly Agent[] = [
  { name: 'Adeola Bakare', region: 'Lagos & South-West', phone: '+234 803 411 2201' },
  { name: 'Chinedu Okafor', region: 'South-East & South-South', phone: '+234 806 552 8842' },
  { name: 'Fatima Ibrahim', region: 'Kano & North-West', phone: '+234 809 220 7714' },
  { name: 'Musa Danladi', region: 'Adamawa & North-East', phone: '+234 807 118 6633' },
  { name: 'Grace Okon', region: 'Abuja & North-Central', phone: '+234 812 774 9910' },
];

export const OFFICES: readonly Office[] = [
  {
    city: 'Lagos',
    address: '14 Adeola Odeku Street, Victoria Island, Lagos',
    phone: '+234 1 342 8800',
    hours: 'Mon–Fri, 9:00 – 17:00',
  },
  {
    city: 'Adamawa',
    address: 'Plot 22 Galadima Aminu Way, Jimeta, Yola, Adamawa',
    phone: '+234 75 262 4411',
    hours: 'Mon–Fri, 9:00 – 16:30',
  },
];
