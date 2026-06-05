export const CATEGORIES = [
  { key: 'plumber',     label: 'Plumber',     labelBn: 'প্লাম্বার',       color: '#1e6fa8', bg: '#e8f1f8' },
  { key: 'electrician', label: 'Electrician', labelBn: 'ইলেক্ট্রিশিয়ান', color: '#c67f00', bg: '#fef6e4' },
  { key: 'cleaner',     label: 'Cleaner',     labelBn: 'ক্লিনার',         color: '#0f7a5a', bg: '#e6f4ef' },
  { key: 'bua',         label: 'Bua / Help',  labelBn: 'বুয়া',            color: '#9b3fbf', bg: '#f4ecfb' },
  { key: 'painter',     label: 'Painter',     labelBn: 'পেইন্টার',        color: '#c0392b', bg: '#fbeae9' },
  { key: 'ac_repair',   label: 'AC Repair',   labelBn: 'এসি মেকানিক',    color: '#2980b9', bg: '#eaf3fb' },
  { key: 'carpenter',   label: 'Carpenter',   labelBn: 'কাঠমিস্ত্রি',     color: '#7d4f2a', bg: '#f5ede5' },
  { key: 'gas_fitter',  label: 'Gas Fitter',  labelBn: 'গ্যাস ফিটার',     color: '#e05c00', bg: '#fdf0e6' },
];

export const DHAKA_AREAS = [
  'Dhanmondi', 'Gulshan', 'Banani', 'Mirpur', 'Mohammadpur',
  'Uttara', 'Bashundhara', 'Wari', 'Khilgaon', 'Rampura',
  'Badda', 'Motijheel', 'Tejgaon', 'Shyamoli', 'Azimpur',
  'Baridhara', 'Niketan', 'Mohakhali', 'Farmgate', 'Kafrul',
  'Pallabi', 'Hazaribagh', 'Lalbagh', 'Kotwali', 'Khilkhet',
];

export const getCategoryInfo = (key) =>
  CATEGORIES.find((c) => c.key === key) || { label: key, color: '#555', bg: '#eee' };
