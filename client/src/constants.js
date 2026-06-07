/* ── Default categories ─────────────────────────────────────────── */
export const CATEGORIES = [
  { key: 'plumber',     label: 'Plumber',     labelBn: 'প্লাম্বার',       color: '#1e6fa8', bg: '#e8f1f8' },
  { key: 'electrician', label: 'Electrician', labelBn: 'ইলেক্ট্রিশিয়ান', color: '#c67f00', bg: '#fef6e4' },
  { key: 'cleaner',     label: 'Cleaner',     labelBn: 'ক্লিনার',         color: '#0f7a5a', bg: '#e6f4ef' },
  { key: 'bua',         label: 'Bua / Help',  labelBn: 'বুয়া',            color: '#9b3fbf', bg: '#f4ecfb' },
  { key: 'painter',     label: 'Painter',     labelBn: 'পেইন্টার',        color: '#c0392b', bg: '#fbeae9' },
  { key: 'ac_repair',   label: 'AC Repair',   labelBn: 'এসি মেকানিক',    color: '#2980b9', bg: '#eaf3fb' },
  { key: 'carpenter',   label: 'Carpenter',   labelBn: 'কাঠমিস্ত্রি',     color: '#7d4f2a', bg: '#f5ede5' },
  { key: 'gas_fitter',  label: 'Gas Fitter',  labelBn: 'গ্যাস ফিটার',     color: '#e05c00', bg: '#fdf0e6' },
  { key: 'isp',         label: 'ISP/Internet',labelBn: 'ইন্টারনেট সেবা',  color: '#8b5cf6', bg: '#f5f3ff' },
  { key: 'rajmistri',   label: 'Rajmistri',   labelBn: 'রাজমিস্ত্রি',      color: '#b45309', bg: '#fef3c7' },
  { key: 'contractor',  label: 'Contractor',  labelBn: 'কন্ট্রাক্টর',      color: '#0369a1', bg: '#e0f2fe' },
];

export const getCategoryInfo = (key, extraCategories = []) =>
  [...CATEGORIES, ...extraCategories].find((c) => c.key === key)
  || { key, label: key, labelBn: key, color: '#555', bg: '#eee' };

/* ════════════════════════════════════════════════════════════════════
   ALL BANGLADESH LOCATIONS
   Organized by Division → Districts → Upazilas
   Total: ~500+ locations covering all 64 districts & 495 upazilas
════════════════════════════════════════════════════════════════════ */
export const BANGLADESH_LOCATIONS = {

  /* ── ঢাকা বিভাগ (Dhaka Division) ── */
  'ঢাকা বিভাগ': [
    // ─ Dhaka City / DNCC / DSCC Areas ─
    'Dhanmondi', 'Gulshan', 'Banani', 'Mirpur', 'Mohammadpur', 'Uttara',
    'Bashundhara', 'Badda', 'Rampura', 'Khilgaon', 'Wari', 'Motijheel',
    'Tejgaon', 'Shyamoli', 'Azimpur', 'Baridhara', 'Niketan', 'Mohakhali',
    'Farmgate', 'Kafrul', 'Pallabi', 'Hazaribagh', 'Lalbagh', 'Kotwali',
    'Khilkhet', 'Demra', 'Jatrabari', 'Keraniganj', 'Savar',
    'Uttara DOHS', 'Aftabnagar', 'Vatara', 'Malibagh', 'Shantinagar',
    'Segunbagicha', 'Eskaton', 'Nakhalpara', 'Tejturi Bazar',
    'Adabor', 'Basabo', 'Sabujbagh', 'Gendaria', 'Sutrapur', 'Chakbazar',
    'Hazaribag', 'Kamrangirchar', 'New Market', 'Ramna', 'Shah Ali',
    'Pallabi', 'Rupnagar', 'Mirpur DOHS', 'Kalyanpur',
    // ─ Dhaka District Upazilas ─
    'Dhamrai', 'Dohar', 'Nawabganj (Dhaka)', 'Savar',
    // ─ Gazipur District ─
    'Gazipur Sadar', 'Joydebpur', 'Tongi', 'Kaliakoir', 'Kapasia',
    'Sreepur', 'Kaliganj (Gazipur)', 'Gazipur City Corporation',
    // ─ Narsingdi District ─
    'Narsingdi Sadar', 'Belabo', 'Monohardi', 'Palash', 'Raipura', 'Shibpur',
    // ─ Narayanganj District ─
    'Narayanganj Sadar', 'Araihazar', 'Bandar', 'Rupganj', 'Sonargaon',
    'Fatullah', 'Siddhirganj',
    // ─ Manikganj District ─
    'Manikganj Sadar', 'Daulatpur (Manikganj)', 'Ghior', 'Harirampur',
    'Saturia', 'Shivalaya', 'Singair',
    // ─ Munshiganj District ─
    'Munshiganj Sadar', 'Gazaria', 'Lohajang', 'Sirajdikhan', 'Sreenagar', 'Tongibari',
    // ─ Rajbari District ─
    'Rajbari Sadar', 'Baliakandi', 'Goalandaghat', 'Kalukhali', 'Pangsha',
    // ─ Gopalganj District ─
    'Gopalganj Sadar', 'Kashiani', 'Kotalipara', 'Muksudpur', 'Tungipara',
    // ─ Faridpur District ─
    'Faridpur Sadar', 'Alfadanga', 'Bhanga', 'Boalmari', 'Charbhadrasan',
    'Madhukhali', 'Nagarkanda', 'Sadarpur', 'Saltha',
    // ─ Madaripur District ─
    'Madaripur Sadar', 'Kalkini', 'Rajoir', 'Shibchar',
    // ─ Shariatpur District ─
    'Shariatpur Sadar', 'Bhedarganj', 'Damudya', 'Gosairhat', 'Naria', 'Zanjira',
    // ─ Kishoreganj District ─
    'Kishoreganj Sadar', 'Austagram', 'Bajitpur', 'Bhairab', 'Hossainpur',
    'Itna', 'Karimganj', 'Katiadi', 'Kuliarchar', 'Mithamain',
    'Nikli', 'Pakundia', 'Tarail',
    // ─ Tangail District ─
    'Tangail Sadar', 'Basail', 'Bhuapur', 'Delduar', 'Dhanbari',
    'Ghatail', 'Gopalpur', 'Kalihati', 'Madhupur', 'Mirzapur',
    'Nagarpur', 'Sakhipur',
  ],

  /* ── চট্টগ্রাম বিভাগ (Chittagong Division) ── */
  'চট্টগ্রাম বিভাগ': [
    // ─ Chittagong City Areas ─
    'Chittagong (Chattogram)', 'Agrabad', 'Halishahar', 'Nasirabad',
    'Pahartali', 'Panchlaish', 'Bayazid', 'Chandgaon', 'Kotwali (Ctg)',
    'Bakalia', 'Double Mooring', 'Sadarghat',
    // ─ Chittagong District Upazilas ─
    'Anwara', 'Banshkhali', 'Boalkhali', 'Chandanaish', 'Fatikchhari',
    'Hathazari', 'Karnaphuli', 'Lohagara', 'Mirsharai', 'Patiya',
    'Rangunia', 'Raozan', 'Sandwip', 'Satkania', 'Sitakunda',
    // ─ Comilla District ─
    'Comilla Sadar', 'Barura', 'Brahmanpara', 'Burichang', 'Chandina',
    'Chauddagram', 'Daudkandi', 'Debidwar', 'Homna', 'Laksam',
    'Lalmai', 'Meghna', 'Muradnagar', 'Nangalkot', 'Titas',
    // ─ Cox\'s Bazar District ─
    'Cox\'s Bazar Sadar', 'Chakaria', 'Kutubdia', 'Maheshkhali',
    'Pekua', 'Ramu', 'Teknaf', 'Ukhia',
    // ─ Brahmanbaria District ─
    'Brahmanbaria Sadar', 'Akhaura', 'Ashuganj', 'Bancharampur',
    'Bijoynagar', 'Kasba', 'Nabinagar', 'Nasirnagar', 'Sarail',
    // ─ Chandpur District ─
    'Chandpur Sadar', 'Faridganj', 'Haimchar', 'Haziganj', 'Kachua',
    'Matlab Uttar', 'Matlab Dakshin', 'Shahrasti',
    // ─ Noakhali District ─
    'Noakhali Sadar', 'Begumganj', 'Chatkhil', 'Companiganj (Noakhali)',
    'Hatiya', 'Kabirhat', 'Senbagh', 'Sonaimuri', 'Subarnachar',
    // ─ Feni District ─
    'Feni Sadar', 'Chhagalnaiya', 'Daganbhuiyan', 'Fulgazi', 'Parshuram', 'Sonagazi',
    // ─ Lakshmipur District ─
    'Lakshmipur Sadar', 'Kamalnagar', 'Ramganj', 'Ramgati', 'Raipur',
    // ─ Rangamati District ─
    'Rangamati Sadar', 'Bagaichhari', 'Barkal', 'Belaichhari', 'Juraichhari',
    'Kaptai', 'Kaukhali', 'Langadu', 'Naniarchar', 'Rajasthali',
    // ─ Bandarban District ─
    'Bandarban Sadar', 'Ali Kadam', 'Lama', 'Naikhongchhari',
    'Rowangchhari', 'Ruma', 'Thanchi',
    // ─ Khagrachhari District ─
    'Khagrachhari Sadar', 'Dighinala', 'Lakshmichhari', 'Mahalchhari',
    'Manikchhari', 'Matiranga', 'Panchhari', 'Ramgarh',
  ],

  /* ── রাজশাহী বিভাগ (Rajshahi Division) ── */
  'রাজশাহী বিভাগ': [
    // ─ Rajshahi City ─
    'Rajshahi City', 'Boalia', 'Rajpara', 'Motihar', 'Shah Makhdum',
    // ─ Rajshahi District Upazilas ─
    'Rajshahi Sadar', 'Bagha', 'Bagmara', 'Charghat', 'Durgapur',
    'Godagari', 'Mohanpur', 'Paba', 'Puthia', 'Tanore',
    // ─ Bogura District ─
    'Bogura Sadar', 'Adamdighi', 'Dhunat', 'Dhupchanchia', 'Gabtali',
    'Kahaloo', 'Nandigram', 'Sariakandi', 'Shajahanpur', 'Sherpur (Bogura)',
    'Shibganj (Bogura)', 'Sonatola',
    // ─ Chapainawabganj District ─
    'Chapainawabganj Sadar', 'Bholahat', 'Gomastapur', 'Nachol', 'Shibganj',
    // ─ Naogaon District ─
    'Naogaon Sadar', 'Atrai', 'Badalgachhi', 'Dhamoirhat', 'Manda',
    'Mahadebpur', 'Niamatpur', 'Patnitala', 'Porsha', 'Raninagar', 'Sapahar',
    // ─ Natore District ─
    'Natore Sadar', 'Bagatipara', 'Baraigram', 'Gurudaspur', 'Lalpur', 'Singra',
    // ─ Joypurhat District ─
    'Joypurhat Sadar', 'Akkelpur', 'Kalai', 'Khetlal', 'Panchbibi',
    // ─ Pabna District ─
    'Pabna Sadar', 'Atgharia', 'Bera', 'Bhangura', 'Chatmohar',
    'Faridpur (Pabna)', 'Ishwardi', 'Santhia', 'Sujanagar',
    // ─ Sirajganj District ─
    'Sirajganj Sadar', 'Belkuchi', 'Chauhali', 'Kamarkhanda', 'Kazipur',
    'Raiganj', 'Shahjadpur', 'Tarash', 'Ullahpara',
  ],

  /* ── খুলনা বিভাগ (Khulna Division) ── */
  'খুলনা বিভাগ': [
    // ─ Khulna City ─
    'Khulna City', 'Sonadanga', 'Khalishpur', 'Khan Jahan Ali',
    // ─ Khulna District Upazilas ─
    'Khulna Sadar', 'Batiaghata', 'Dacope', 'Dumuria', 'Dighalia',
    'Koyra', 'Paikgachha', 'Phultala', 'Rupsa', 'Terokhada',
    // ─ Jessore (Jashore) District ─
    'Jashore Sadar', 'Abhaynagar', 'Bagherpara', 'Chaugachha',
    'Jhikargachha', 'Keshabpur', 'Manirampur', 'Sharsha',
    // ─ Satkhira District ─
    'Satkhira Sadar', 'Assasuni', 'Debhata', 'Kalaroa',
    'Kaliganj (Satkhira)', 'Shyamnagar', 'Tala',
    // ─ Bagerhat District ─
    'Bagerhat Sadar', 'Chitalmari', 'Fakirhat', 'Kachua (Bagerhat)',
    'Mollahat', 'Mongla', 'Morrelganj', 'Rampal', 'Sarankhola',
    // ─ Jhenaidah District ─
    'Jhenaidah Sadar', 'Harinakunda', 'Kaliganj (Jhenaidah)',
    'Kotchandpur', 'Maheshpur', 'Shailkupa',
    // ─ Narail District ─
    'Narail Sadar', 'Kalia', 'Lohagara (Narail)',
    // ─ Magura District ─
    'Magura Sadar', 'Mohammadpur (Magura)', 'Shalikha', 'Sreepur (Magura)',
    // ─ Kushtia District ─
    'Kushtia Sadar', 'Bheramara', 'Daulatpur (Kushtia)',
    'Khoksa', 'Kumarkhali', 'Mirpur (Kushtia)',
    // ─ Meherpur District ─
    'Meherpur Sadar', 'Gangni', 'Mujibnagar',
    // ─ Chuadanga District ─
    'Chuadanga Sadar', 'Alamdanga', 'Damurhuda', 'Jibannagar',
  ],

  /* ── বরিশাল বিভাগ (Barisal Division) ── */
  'বরিশাল বিভাগ': [
    // ─ Barishal City ─
    'Barishal City', 'Kotwali (Barishal)', 'Bandha Road',
    // ─ Barishal District Upazilas ─
    'Barishal Sadar', 'Agailjhara', 'Babuganj', 'Bakerganj', 'Banaripara',
    'Gaurnadi', 'Hizla', 'Mehendiganj', 'Muladi', 'Wazirpur',
    // ─ Bhola District ─
    'Bhola Sadar', 'Borhanuddin', 'Char Fasson', 'Daulatkhan',
    'Lalmohan', 'Manpura', 'Tazumuddin',
    // ─ Patuakhali District ─
    'Patuakhali Sadar', 'Bauphal', 'Dashmina', 'Dumki', 'Galachipa',
    'Kalapara', 'Mirzaganj', 'Rangabali',
    // ─ Pirojpur District ─
    'Pirojpur Sadar', 'Bhandaria', 'Kawkhali', 'Mathbaria',
    'Nazirpur', 'Nesarabad (Swarupkati)', 'Zianagar',
    // ─ Jhalokati District ─
    'Jhalokati Sadar', 'Kathalia', 'Nalchity', 'Rajapur',
    // ─ Barguna District ─
    'Barguna Sadar', 'Amtali', 'Bamna', 'Betagi', 'Patharghata', 'Taltali',
  ],

  /* ── সিলেট বিভাগ (Sylhet Division) ── */
  'সিলেট বিভাগ': [
    // ─ Sylhet City ─
    'Sylhet City', 'Amberkhana', 'Zindabazar', 'Shahjalal Upashahar',
    // ─ Sylhet District Upazilas ─
    'Sylhet Sadar', 'Balaganj', 'Beanibazar', 'Bishwanath',
    'Companiganj (Sylhet)', 'Dakshin Surma', 'Fenchuganj',
    'Golapganj', 'Gowainghat', 'Jaintiapur', 'Kanaighat',
    'Osmani Nagar', 'Zakiganj',
    // ─ Moulvibazar District ─
    'Moulvibazar Sadar', 'Barlekha', 'Juri', 'Kamalganj',
    'Kulaura', 'Rajnagar', 'Sreemangal',
    // ─ Habiganj District ─
    'Habiganj Sadar', 'Ajmiriganj', 'Bahubal', 'Baniachong',
    'Chunarughat', 'Lakhai', 'Madhabpur', 'Nabiganj',
    // ─ Sunamganj District ─
    'Sunamganj Sadar', 'Bishwamvarpur', 'Chhatak', 'Derai',
    'Dharamapasha', 'Dowarabazar', 'Jagannathpur', 'Jamalganj',
    'Sulla', 'Tahirpur',
  ],

  /* ── রংপুর বিভাগ (Rangpur Division) ── */
  'রংপুর বিভাগ': [
    // ─ Rangpur City ─
    'Rangpur City', 'Rangpur Sadar',
    // ─ Rangpur District Upazilas ─
    'Badarganj', 'Gangachara', 'Kaunia', 'Mithapukur', 'Pirgacha',
    'Pirganj (Rangpur)', 'Taraganj',
    // ─ Dinajpur District ─
    'Dinajpur Sadar', 'Birampur', 'Birganj', 'Biral', 'Bochaganj',
    'Chirirbandar', 'Fulbari (Dinajpur)', 'Ghoraghat', 'Hakimpur',
    'Kaharole', 'Khansama', 'Nawabganj (Dinajpur)', 'Parbatipur',
    // ─ Gaibandha District ─
    'Gaibandha Sadar', 'Fulchhari', 'Gobindaganj', 'Palashbari',
    'Sadullapur', 'Saghata', 'Sundarganj',
    // ─ Kurigram District ─
    'Kurigram Sadar', 'Bhurungamari', 'Char Rajibpur', 'Chilmari',
    'Nageshwari', 'Phulbari (Kurigram)', 'Rajibpur', 'Rajarhat',
    'Raumari', 'Ulipur',
    // ─ Lalmonirhat District ─
    'Lalmonirhat Sadar', 'Aditmari', 'Hatibandha',
    'Kaliganj (Lalmonirhat)', 'Patgram',
    // ─ Nilphamari District ─
    'Nilphamari Sadar', 'Dimla', 'Domar', 'Jaldhaka',
    'Kishorganj (Nilphamari)', 'Saidpur',
    // ─ Panchagarh District ─
    'Panchagarh Sadar', 'Atwari', 'Boda', 'Debiganj', 'Tetulia',
    // ─ Thakurgaon District ─
    'Thakurgaon Sadar', 'Baliadangi', 'Haripur',
    'Pirganj (Thakurgaon)', 'Ranisankail',
  ],

  /* ── ময়মনসিংহ বিভাগ (Mymensingh Division) ── */
  'ময়মনসিংহ বিভাগ': [
    // ─ Mymensingh City ─
    'Mymensingh City', 'Mymensingh Sadar',
    // ─ Mymensingh District Upazilas ─
    'Bhaluka', 'Dhobaura', 'Fulbaria', 'Gaffargaon', 'Gauripur',
    'Haluaghat', 'Ishwarganj', 'Muktagachha', 'Nandail', 'Phulpur',
    'Trishal',
    // ─ Jamalpur District ─
    'Jamalpur Sadar', 'Bakshiganj', 'Dewanganj', 'Islampur',
    'Madarganj', 'Melandaha', 'Sarishabari',
    // ─ Netrokona District ─
    'Netrokona Sadar', 'Atpara', 'Barhatta', 'Durgapur (Netrokona)',
    'Kalmakanda', 'Kendua', 'Khaliajuri', 'Madan', 'Mohanganj',
    'Purbadhala',
    // ─ Sherpur District ─
    'Sherpur Sadar', 'Jhenaigati', 'Nakla', 'Nalitabari', 'Sreebardi',
  ],
};

/* ── Flat list (for simple selects / search / suggestions) ── */
export const ALL_AREAS = [...new Set(Object.values(BANGLADESH_LOCATIONS).flat())];

/* Backward compat */
export const DHAKA_AREAS = BANGLADESH_LOCATIONS['ঢাকা বিভাগ'];
