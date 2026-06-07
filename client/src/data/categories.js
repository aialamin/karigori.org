/**
 * Complete Karigori service category hierarchy
 * Structure: Category → Subcategory → Services
 * Used for: search, browse filtering, worker registration, AI search
 */

export const SERVICE_TREE = [
  {
    key: 'home_repair', label: 'Home Repair & Maintenance', labelBn: 'হোম রিপেয়ার',
    icon: 'Home', color: '#1e6fa8', bg: '#e8f1f8',
    subcategories: [
      {
        key: 'plumbing', label: 'Plumbing Services', labelBn: 'প্লাম্বিং সার্ভিস',
        parentKey: 'plumber',
        services: ['Pipe repair','Bathroom fitting','Leakage fixing','Water tank installation','Pump installation','Kitchen sink repair','Drainage cleaning','Water line installation'],
        servicesBn: ['পাইপ মেরামত','বাথরুম ফিটিং','লিকেজ মেরামত','ওভারহেড ট্যাংক','পাম্প ইনস্টল','কিচেন সিংক','ড্রেনেজ ক্লিনিং','পানির লাইন'],
      },
      {
        key: 'electrical_home', label: 'Electrical Services', labelBn: 'ইলেকট্রিক্যাল সার্ভিস',
        parentKey: 'electrician',
        services: ['House wiring','Fan/light installation','Switch/socket repair','Circuit fixing','Inverter setup','DB board','Short circuit fix'],
        servicesBn: ['হাউস ওয়্যারিং','ফ্যান/লাইট ইনস্টল','সুইচ/সকেট','সার্কিট মেরামত','ইনভার্টার','ডিবি বোর্ড','শর্ট সার্কিট'],
      },
      {
        key: 'masonry', label: 'Masonry & Construction', labelBn: 'রাজমিস্ত্রি কাজ',
        parentKey: 'carpenter',
        services: ['Brickwork','Wall construction','Cement work','Plastering','Foundation repair','Tile fitting','Floor work'],
        servicesBn: ['ইটের কাজ','দেয়াল নির্মাণ','সিমেন্টের কাজ','প্লাস্টারিং','ভিত্তি মেরামত','টাইলস ফিটিং','ফ্লোর কাজ'],
      },
      {
        key: 'carpentry', label: 'Carpentry', labelBn: 'কাঠমিস্ত্রি',
        parentKey: 'carpenter',
        services: ['Furniture making','Door/window repair','Bed/sofa making','Wood polishing','Custom cabinet','Wardrobe fitting','Modular kitchen'],
        servicesBn: ['ফার্নিচার তৈরি','দরজা/জানালা মেরামত','বেড/সোফা তৈরি','কাঠ পলিশ','কাস্টম ক্যাবিনেট','ওয়ার্ডরোব','মডুলার কিচেন'],
      },
      {
        key: 'painting', label: 'Painting & Decoration', labelBn: 'পেইন্টিং',
        parentKey: 'painter',
        services: ['Wall painting','Texture design','Interior painting','Exterior painting','Waterproofing coat','Putty work','Distemper'],
        servicesBn: ['দেয়াল রঙ','টেক্সচার ডিজাইন','ইন্টেরিয়র পেইন্ট','এক্সটেরিয়র পেইন্ট','ওয়াটারপ্রুফিং','পুটি কাজ','ডিসটেম্পার'],
      },
      {
        key: 'roofing', label: 'Roofing & Waterproofing', labelBn: 'ছাদ ও ওয়াটারপ্রুফিং',
        parentKey: 'painter',
        services: ['Roof leakage repair','Waterproof coating','Ceiling repair','Roof painting','False ceiling'],
        servicesBn: ['ছাদ লিকেজ মেরামত','ওয়াটারপ্রুফ কোটিং','ছাদ মেরামত','ছাদ রঙ','ফলস সিলিং'],
      },
    ],
  },
  {
    key: 'electrical_electronics', label: 'Electrical & Electronics', labelBn: 'ইলেকট্রিক্যাল ও ইলেকট্রনিক্স',
    icon: 'Zap', color: '#c67f00', bg: '#fef6e4',
    subcategories: [
      {
        key: 'appliance_repair', label: 'Appliance Repair', labelBn: 'হোম অ্যাপ্লায়েন্স মেরামত',
        parentKey: 'electrician',
        services: ['Fridge repair','Washing machine repair','Microwave repair','Blender/mixer repair','Rice cooker repair','Water heater repair','Oven repair'],
        servicesBn: ['ফ্রিজ মেরামত','ওয়াশিং মেশিন','মাইক্রোওয়েভ','ব্লেন্ডার/মিক্সার','রাইস কুকার','হিটার মেরামত','ওভেন মেরামত'],
      },
      {
        key: 'ac_services', label: 'AC Services', labelBn: 'এসি সার্ভিস',
        parentKey: 'ac_repair',
        services: ['AC installation','AC servicing','Gas refill','AC repair','Cleaning','PCB repair','Compressor repair'],
        servicesBn: ['এসি ইনস্টলেশন','এসি সার্ভিসিং','গ্যাস রিফিল','এসি মেরামত','ক্লিনিং','পিসিবি মেরামত','কম্প্রেসার মেরামত'],
      },
      {
        key: 'generator', label: 'Generator Services', labelBn: 'জেনারেটর সার্ভিস',
        parentKey: 'electrician',
        services: ['Generator installation','Generator repair','Generator servicing','IPS/UPS setup'],
        servicesBn: ['জেনারেটর ইনস্টল','জেনারেটর মেরামত','জেনারেটর সার্ভিস','আইপিএস/ইউপিএস'],
      },
      {
        key: 'cctv', label: 'CCTV & Security', labelBn: 'সিসিটিভি ও নিরাপত্তা',
        parentKey: 'electrician',
        services: ['CCTV installation','CCTV repair','Home security system','Door lock installation','Intercom setup'],
        servicesBn: ['সিসিটিভি ইনস্টল','সিসিটিভি মেরামত','হোম সিকিউরিটি','ডোরলক','ইন্টারকম'],
      },
      {
        key: 'network', label: 'WiFi & Network Setup', labelBn: 'ওয়াইফাই ও নেটওয়ার্ক',
        parentKey: 'electrician',
        services: ['WiFi setup','Router configuration','LAN installation','Network cable pulling','WiFi extender setup'],
        servicesBn: ['ওয়াইফাই সেটআপ','রাউটার কনফিগ','ল্যান ইনস্টল','নেটওয়ার্ক ক্যাবল','ওয়াইফাই এক্সটেন্ডার'],
      },
    ],
  },
  {
    key: 'plumbing_water', label: 'Plumbing & Water Systems', labelBn: 'প্লাম্বিং ও পানি সিস্টেম',
    icon: 'Droplets', color: '#1e6fa8', bg: '#e8f1f8',
    subcategories: [
      {
        key: 'bathroom_plumbing', label: 'Bathroom Plumbing', labelBn: 'বাথরুম প্লাম্বিং',
        parentKey: 'plumber',
        services: ['Toilet fitting','Shower installation','Basin fitting','Commode repair','Tap installation'],
        servicesBn: ['টয়লেট ফিটিং','শাওয়ার ইনস্টল','বেসিন ফিটিং','কমোড মেরামত','কল ইনস্টল'],
      },
      {
        key: 'water_pump', label: 'Water Pump Service', labelBn: 'ওয়াটার পাম্প সার্ভিস',
        parentKey: 'plumber',
        services: ['Pump installation','Pump repair','Submersible pump','Overhead tank','Water motor repair'],
        servicesBn: ['পাম্প ইনস্টল','পাম্প মেরামত','সাবমার্সিবল পাম্প','ওভারহেড ট্যাংক','মোটর মেরামত'],
      },
    ],
  },
  {
    key: 'vehicle', label: 'Vehicle & Transport Services', labelBn: 'গাড়ি ও ট্রান্সপোর্ট',
    icon: 'Car', color: '#2980b9', bg: '#eaf3fb',
    subcategories: [
      {
        key: 'car_mechanic', label: 'Car Mechanic', labelBn: 'কার মেকানিক',
        parentKey: 'electrician',
        services: ['Engine repair','Oil change','Car electrical repair','Brake service','AC recharge','Gear service'],
        servicesBn: ['ইঞ্জিন মেরামত','অয়েল চেঞ্জ','কার ইলেকট্রিক','ব্রেক সার্ভিস','এসি রিচার্জ','গিয়ার সার্ভিস'],
      },
      {
        key: 'motorcycle', label: 'Motorcycle Mechanic', labelBn: 'মোটরসাইকেল মেকানিক',
        parentKey: 'electrician',
        services: ['Bike repair','Oil change','Tire change','Engine overhaul','Carburetor cleaning'],
        servicesBn: ['বাইক মেরামত','অয়েল চেঞ্জ','টায়ার পরিবর্তন','ইঞ্জিন ওভারহল','কার্বুরেটর ক্লিনিং'],
      },
      {
        key: 'car_wash', label: 'Car Wash & Detailing', labelBn: 'কার ওয়াশ',
        parentKey: 'cleaner',
        services: ['Exterior wash','Interior cleaning','Polishing','Waxing','Engine cleaning'],
        servicesBn: ['এক্সটেরিয়র ওয়াশ','ইন্টেরিয়র ক্লিনিং','পলিশিং','ওয়াক্সিং','ইঞ্জিন ক্লিনিং'],
      },
      {
        key: 'tire', label: 'Tire & Wheel Services', labelBn: 'টায়ার সার্ভিস',
        parentKey: 'electrician',
        services: ['Tire alignment','Puncture repair','Tire change','Wheel balancing'],
        servicesBn: ['এলাইনমেন্ট','পাংচার মেরামত','টায়ার পরিবর্তন','হুইল ব্যালেন্সিং'],
      },
    ],
  },
  {
    key: 'cleaning', label: 'Cleaning Services', labelBn: 'ক্লিনিং সার্ভিস',
    icon: 'Sparkles', color: '#0f7a5a', bg: '#e6f4ef',
    subcategories: [
      {
        key: 'home_cleaning', label: 'Home Cleaning', labelBn: 'বাসা পরিষ্কার',
        parentKey: 'cleaner',
        services: ['Deep cleaning','Regular cleaning','Move-in/out cleaning','Post-construction cleaning','Spring cleaning'],
        servicesBn: ['ডিপ ক্লিনিং','নিয়মিত পরিষ্কার','মুভ ইন/আউট ক্লিনিং','পোস্ট কনস্ট্রাকশন','স্প্রিং ক্লিনিং'],
      },
      {
        key: 'office_cleaning', label: 'Office Cleaning', labelBn: 'অফিস পরিষ্কার',
        parentKey: 'cleaner',
        services: ['Office deep clean','Daily office cleaning','Conference room','Washroom cleaning'],
        servicesBn: ['অফিস ডিপ ক্লিন','নিত্যদিন পরিষ্কার','কনফারেন্স রুম','ওয়াশরুম ক্লিনিং'],
      },
      {
        key: 'sofa_carpet', label: 'Sofa/Carpet Cleaning', labelBn: 'সোফা/কার্পেট ক্লিনিং',
        parentKey: 'cleaner',
        services: ['Sofa deep clean','Carpet cleaning','Mattress cleaning','Curtain cleaning'],
        servicesBn: ['সোফা ডিপ ক্লিন','কার্পেট ক্লিনিং','ম্যাট্রেস ক্লিনিং','পর্দা পরিষ্কার'],
      },
    ],
  },
  {
    key: 'furniture_interior', label: 'Furniture & Interior', labelBn: 'ফার্নিচার ও ইন্টেরিয়র',
    icon: 'Sofa', color: '#7d4f2a', bg: '#f5ede5',
    subcategories: [
      {
        key: 'furniture', label: 'Furniture Services', labelBn: 'ফার্নিচার সার্ভিস',
        parentKey: 'carpenter',
        services: ['Furniture repair','Furniture making','Custom design','Wood polishing','Upholstery repair','Antique restoration'],
        servicesBn: ['ফার্নিচার মেরামত','ফার্নিচার তৈরি','কাস্টম ডিজাইন','কাঠ পলিশ','আপহোলস্ট্রি','পুরনো ফার্নিচার'],
      },
    ],
  },
  {
    key: 'domestic', label: 'Domestic & Personal Services', labelBn: 'গৃহস্থালি সেবা',
    icon: 'Home', color: '#9b3fbf', bg: '#f4ecfb',
    subcategories: [
      {
        key: 'cook', label: 'Cook / Chef', labelBn: 'রাঁধুনি',
        parentKey: 'bua',
        services: ['Bengali cooking','Continental cooking','Party cooking','Tiffin service','Daily cooking'],
        servicesBn: ['বাংলা রান্না','কন্টিনেন্টাল রান্না','পার্টি রান্না','টিফিন সার্ভিস','প্রতিদিনের রান্না'],
      },
      {
        key: 'childcare', label: 'Childcare / Babysitter', labelBn: 'শিশু সেবা',
        parentKey: 'bua',
        services: ['Babysitting','Child care','Baby nurse','Homework help','After school care'],
        servicesBn: ['বেবিসিটিং','শিশু যত্ন','বেবি নার্স','হোমওয়ার্ক সাহায্য','স্কুলের পরে যত্ন'],
      },
      {
        key: 'elderly_care', label: 'Elderly Care', labelBn: 'বয়স্ক সেবা',
        parentKey: 'bua',
        services: ['Elderly care','Patient care','Medicine assistance','Physiotherapy assistant','Companion care'],
        servicesBn: ['বৃদ্ধ সেবা','রোগী সেবা','ওষুধ সহায়তা','ফিজিওথেরাপি সহকারী','সঙ্গী সেবা'],
      },
      {
        key: 'maid', label: 'Maid / House Helper', labelBn: 'গৃহকর্মী / বুয়া',
        parentKey: 'bua',
        services: ['Full-time maid','Part-time maid','Laundry service','Dishwashing','House help'],
        servicesBn: ['ফুলটাইম বুয়া','পার্টটাইম বুয়া','কাপড় ধোয়া','থালা বাসন','বাসার কাজ'],
      },
    ],
  },
  {
    key: 'gas', label: 'Gas Services', labelBn: 'গ্যাস সার্ভিস',
    icon: 'Flame', color: '#e05c00', bg: '#fdf0e6',
    subcategories: [
      {
        key: 'gas_fitting', label: 'Gas Fitting', labelBn: 'গ্যাস ফিটিং',
        parentKey: 'gas_fitter',
        services: ['Gas line installation','Gas leak detection','Stove connection','Burner repair/cleaning','Titas compliance','Cylinder gas fitting'],
        servicesBn: ['গ্যাস লাইন ইনস্টল','গ্যাস লিক ডিটেকশন','স্টোভ কানেকশন','বার্নার মেরামত','তিতাস কমপ্লায়েন্স','সিলিন্ডার গ্যাস'],
      },
    ],
  },
  {
    key: 'construction', label: 'Construction Support', labelBn: 'নির্মাণ শ্রমিক',
    icon: 'Hammer', color: '#7d4f2a', bg: '#f5ede5',
    subcategories: [
      {
        key: 'labor', label: 'General Labor', labelBn: 'সাধারণ শ্রমিক',
        parentKey: 'carpenter',
        services: ['Helper labor','Loading/unloading','Material shifting','Digging','General construction work'],
        servicesBn: ['হেলপার শ্রমিক','লোডিং/আনলোডিং','মাল বহন','খোঁড়াখুঁড়ি','সাধারণ নির্মাণ'],
      },
      {
        key: 'tile_marble', label: 'Tile & Marble Fitting', labelBn: 'টাইলস ও মার্বেল',
        parentKey: 'carpenter',
        services: ['Floor tile fitting','Wall tile fitting','Marble installation','Mosaic work','Grout work'],
        servicesBn: ['ফ্লোর টাইলস','ওয়াল টাইলস','মার্বেল ইনস্টল','মোজাইক কাজ','গ্রাউট কাজ'],
      },
      {
        key: 'steel', label: 'Steel & Rod Work', labelBn: 'স্টিল/রড কাজ',
        parentKey: 'carpenter',
        services: ['Rod binding','Steel gate fabrication','Grille work','Railing installation'],
        servicesBn: ['রড বাঁধাই','স্টিল গেট','গ্রিল কাজ','রেলিং ইনস্টল'],
      },
      {
        key: 'glass', label: 'Glass Installation', labelBn: 'গ্লাস ইনস্টলেশন',
        parentKey: 'carpenter',
        services: ['Window glass fitting','Shower glass','Glass partition','Mirror installation'],
        servicesBn: ['জানালার গ্লাস','শাওয়ার গ্লাস','গ্লাস পার্টিশন','আয়না ইনস্টল'],
      },
    ],
  },
  {
    key: 'it_tech', label: 'Technical & IT Services', labelBn: 'টেকনিক্যাল ও আইটি',
    icon: 'Cpu', color: '#2980b9', bg: '#eaf3fb',
    subcategories: [
      {
        key: 'computer_repair', label: 'Computer/Laptop Repair', labelBn: 'কম্পিউটার/ল্যাপটপ মেরামত',
        parentKey: 'electrician',
        services: ['Computer repair','Laptop repair','Screen replacement','Keyboard repair','Data recovery','OS installation','Virus removal'],
        servicesBn: ['কম্পিউটার মেরামত','ল্যাপটপ মেরামত','স্ক্রিন পরিবর্তন','কিবোর্ড মেরামত','ডেটা রিকভারি','অপারেটিং সিস্টেম','ভাইরাস রিমুভাল'],
      },
      {
        key: 'mobile_repair', label: 'Mobile Phone Repair', labelBn: 'মোবাইল ফোন মেরামত',
        parentKey: 'electrician',
        services: ['Screen replacement','Battery replacement','Charging port repair','Camera repair','Software fix'],
        servicesBn: ['স্ক্রিন পরিবর্তন','ব্যাটারি পরিবর্তন','চার্জিং পোর্ট','ক্যামেরা মেরামত','সফটওয়্যার ঠিক'],
      },
    ],
  },
  {
    key: 'outdoor', label: 'Outdoor & Garden Services', labelBn: 'বাইরের কাজ ও বাগান',
    icon: 'TreePine', color: '#0f7a5a', bg: '#e6f4ef',
    subcategories: [
      {
        key: 'gardening', label: 'Gardening', labelBn: 'বাগান পরিচর্যা',
        parentKey: 'cleaner',
        services: ['Gardening','Lawn mowing','Tree cutting','Plant care','Landscaping design','Pest control'],
        servicesBn: ['বাগান করা','লন কাটা','গাছ কাটা','গাছ পরিচর্যা','ল্যান্ডস্কেপিং','কীটনাশক'],
      },
    ],
  },
  {
    key: 'emergency', label: 'Emergency Services', labelBn: 'জরুরি সার্ভিস',
    icon: 'Zap', color: '#c0392b', bg: '#fbeae9',
    subcategories: [
      {
        key: 'emergency_plumber', label: 'Emergency Plumber', labelBn: 'জরুরি প্লাম্বার',
        parentKey: 'plumber',
        services: ['24/7 emergency plumber','Water burst','Leakage emergency','Drain blockage'],
        servicesBn: ['২৪ ঘণ্টা প্লাম্বার','পানি বার্স্ট','লিকেজ জরুরি','ড্রেন ব্লকেজ'],
      },
      {
        key: 'emergency_electrician', label: 'Emergency Electrician', labelBn: 'জরুরি ইলেকট্রিশিয়ান',
        parentKey: 'electrician',
        services: ['24/7 electrician','Power failure','Short circuit emergency','Wire burning'],
        servicesBn: ['২৪ ঘণ্টা ইলেকট্রিশিয়ান','পাওয়ার ফেলিওর','শর্ট সার্কিট জরুরি','তার পোড়া'],
      },
    ],
  },
  {
    key: 'isp_internet', label: 'ISP & Internet Services', labelBn: 'ইন্টারনেট সেবা',
    icon: 'Wifi', color: '#8b5cf6', bg: '#f5f3ff',
    subcategories: [
      {
        key: 'broadband', label: 'Broadband / ISP', labelBn: 'ব্রডব্যান্ড/ISP',
        parentKey: 'isp',
        services: ['Broadband connection','WiFi setup','Router configuration','Cable wiring','Network troubleshoot','WiFi extender setup','LAN installation'],
        servicesBn: ['ব্রডব্যান্ড কানেকশন','ওয়াইফাই সেটআপ','রাউটার কনফিগ','ক্যাবল ওয়্যারিং','নেটওয়ার্ক ট্রাবলশুট','ওয়াইফাই এক্সটেন্ডার','ল্যান ইনস্টল'],
      },
    ],
  },
  {
    key: 'masonry_work', label: 'Mason / Rajmistri', labelBn: 'রাজমিস্ত্রি কাজ',
    icon: 'Hammer', color: '#b45309', bg: '#fef3c7',
    subcategories: [
      {
        key: 'masonry_services', label: 'Masonry Services', labelBn: 'রাজমিস্ত্রি সেবা',
        parentKey: 'rajmistri',
        services: ['Brickwork','Wall construction','Plastering','Tile fitting','Floor work','Foundation repair','Cement work','Grout work'],
        servicesBn: ['ইটের গাঁথুনি','দেয়াল নির্মাণ','প্লাস্টারিং','টাইলস ফিটিং','ফ্লোর কাজ','ভিত্তি মেরামত','সিমেন্টের কাজ','গ্রাউট কাজ'],
      },
    ],
  },
  {
    key: 'contracting', label: 'Contractor Services', labelBn: 'ঠিকাদারি সেবা',
    icon: 'Building', color: '#0369a1', bg: '#e0f2fe',
    subcategories: [
      {
        key: 'contractor_services', label: 'Construction Contracting', labelBn: 'নির্মাণ ঠিকাদারি',
        parentKey: 'contractor',
        services: ['House construction','Renovation','Interior design','Roofing','Sub-contracting','Construction management','Commercial building'],
        servicesBn: ['বাড়ি নির্মাণ','রিনোভেশন','ইন্টেরিয়র ডিজাইন','ছাদ ও ফ্লোর','সাব-কন্ট্রাক্টিং','নির্মাণ ব্যবস্থাপনা','বাণিজ্যিক ভবন'],
      },
    ],
  },
];

/* ── Flat lookup maps ── */

/** All services (leaf nodes) → parent category key */
export const SERVICE_TO_CATEGORY = {};
/** All subcategory keys → parent category key */
export const SUBCAT_TO_CATEGORY  = {};
/** All service terms for AI search */
export const ALL_SERVICE_TERMS   = [];

SERVICE_TREE.forEach((cat) => {
  cat.subcategories.forEach((sub) => {
    SUBCAT_TO_CATEGORY[sub.key] = sub.parentKey;
    sub.services.forEach((svc) => {
      SERVICE_TO_CATEGORY[svc.toLowerCase()] = sub.parentKey;
      ALL_SERVICE_TERMS.push({ term: svc.toLowerCase(), categoryKey: sub.parentKey, subcategoryKey: sub.key });
    });
    sub.servicesBn?.forEach((svc) => {
      SERVICE_TO_CATEGORY[svc] = sub.parentKey;
      ALL_SERVICE_TERMS.push({ term: svc, categoryKey: sub.parentKey, subcategoryKey: sub.key });
    });
  });
});

/** Find category from any service term */
export function findCategoryByService(term) {
  const t = term.toLowerCase().trim();
  // Exact
  if (SERVICE_TO_CATEGORY[t]) return SERVICE_TO_CATEGORY[t];
  // Partial
  const match = ALL_SERVICE_TERMS.find((s) => s.term.includes(t) || t.includes(s.term.slice(0, 5)));
  return match?.categoryKey || null;
}

/** Get all subcategories + services for a given category key */
export function getSubcategoriesForCategory(categoryKey) {
  const results = [];
  SERVICE_TREE.forEach((cat) => {
    cat.subcategories.forEach((sub) => {
      if (sub.parentKey === categoryKey) results.push(sub);
    });
  });
  return results;
}

/** Search subcategories and services by query */
export function searchServices(query) {
  if (!query?.trim()) return [];
  const q = query.toLowerCase().trim();
  const results = [];

  SERVICE_TREE.forEach((cat) => {
    cat.subcategories.forEach((sub) => {
      const matchSub = sub.label.toLowerCase().includes(q) || sub.labelBn.includes(q);
      const matchedServices = sub.services.filter((s) => s.toLowerCase().includes(q));
      const matchedServicesBn = sub.servicesBn?.filter((s) => s.includes(q)) || [];

      if (matchSub || matchedServices.length > 0 || matchedServicesBn.length > 0) {
        results.push({
          categoryKey: sub.parentKey,
          subcategory: sub,
          matchedServices: [...matchedServices, ...matchedServicesBn],
        });
      }
    });
  });

  return results.slice(0, 8);
}
