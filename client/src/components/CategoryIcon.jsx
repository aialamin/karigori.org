import {
  Wrench, Zap, Sparkles, Home, Paintbrush, Wind, Hammer, Flame,
  Scissors, Car, Truck, Leaf, Package, ShieldCheck, Heart, BookOpen,
  Camera, Coffee, Cpu, Droplets, Fan,
  Flower2, Globe, Headphones, Key, Layers,
  Lightbulb, Monitor, Music, Palette, Phone,
  Recycle, Settings, Star, Sun, Thermometer,
  TreePine, Tv, Umbrella, Utensils, Waves, Wifi,
  HardHat, Building2,
} from 'lucide-react';

/* ── Built-in category → icon ── */
const BUILT_IN = {
  plumber:     Wrench,
  electrician: Zap,
  cleaner:     Sparkles,
  bua:         Home,
  painter:     Paintbrush,
  ac_repair:   Wind,
  carpenter:   Hammer,
  gas_fitter:  Flame,
  isp:         Wifi,
  rajmistri:   HardHat,
  contractor:  Building2,
};

/* ── All selectable icons for custom categories ── */
export const ICON_OPTIONS = [
  { name: 'Wrench',       Icon: Wrench      }, { name: 'Zap',         Icon: Zap         },
  { name: 'Sparkles',     Icon: Sparkles    }, { name: 'Home',        Icon: Home        },
  { name: 'Paintbrush',   Icon: Paintbrush  }, { name: 'Wind',        Icon: Wind        },
  { name: 'Hammer',       Icon: Hammer      }, { name: 'Flame',       Icon: Flame       },
  { name: 'Scissors',     Icon: Scissors    }, { name: 'Car',         Icon: Car         },
  { name: 'Truck',        Icon: Truck       }, { name: 'Leaf',        Icon: Leaf        },
  { name: 'Package',      Icon: Package     }, { name: 'ShieldCheck', Icon: ShieldCheck },
  { name: 'Heart',        Icon: Heart       }, { name: 'BookOpen',    Icon: BookOpen    },
  { name: 'Camera',       Icon: Camera      }, { name: 'Coffee',      Icon: Coffee      },
  { name: 'Cpu',          Icon: Cpu         }, { name: 'Droplets',    Icon: Droplets    },
  { name: 'Fan',          Icon: Fan         }, { name: 'Flower2',     Icon: Flower2     },
  { name: 'Globe',        Icon: Globe       }, { name: 'Headphones',  Icon: Headphones  },
  { name: 'Key',          Icon: Key         }, { name: 'Layers',      Icon: Layers      },
  { name: 'Lightbulb',    Icon: Lightbulb   }, { name: 'Monitor',     Icon: Monitor     },
  { name: 'Music',        Icon: Music       }, { name: 'Palette',     Icon: Palette     },
  { name: 'Phone',        Icon: Phone       }, { name: 'Recycle',     Icon: Recycle     },
  { name: 'Settings',     Icon: Settings    }, { name: 'Star',        Icon: Star        },
  { name: 'Sun',          Icon: Sun         }, { name: 'Thermometer', Icon: Thermometer },
  { name: 'TreePine',     Icon: TreePine    }, { name: 'Tv',          Icon: Tv          },
  { name: 'Umbrella',     Icon: Umbrella    }, { name: 'Utensils',    Icon: Utensils    },
  { name: 'Waves',        Icon: Waves       }, { name: 'Wifi',        Icon: Wifi        },
  { name: 'HardHat',     Icon: HardHat     }, { name: 'Building2',   Icon: Building2   },
];

const ICON_BY_NAME = Object.fromEntries(ICON_OPTIONS.map(({ name, Icon }) => [name, Icon]));

/* ── Main component — handles both built-in and custom icon names ── */
export function CategoryIcon({ category, iconName, size = 20, className = '' }) {
  const Icon =
    BUILT_IN[category] ||
    (iconName && ICON_BY_NAME[iconName]) ||
    ICON_BY_NAME[category] ||   // in case custom key matches an icon name
    Wrench;
  return <Icon size={size} className={className} />;
}
