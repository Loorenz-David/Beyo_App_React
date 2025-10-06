// Auto-generated from ListToMake
// Each issue's icon can be replaced with a React icon later


// Accepts array of tuples: [issue, icon]
const buildIssuesArray = (issues: [string, any][]) =>
    issues.map(([issue, icon]) => ({
        component: 'CheckBox',
        property: 'issue',
        displayName: issue,
        icon: icon
    }));

// Dining chairs
const diningChairs_backrest = buildIssuesArray([
    ['cracked wood', 'icon'], ['loose joints', 'icon'], ['chipped veneer', 'icon'], ['worn finish', 'icon']
]);
const diningChairs_seat = buildIssuesArray([
    ['soft or broken support', 'icon'], ['cracked plywood', 'icon'], ['foam collapsed', 'icon'], ['fabric torn or dirty', 'icon']
]);
const diningChairs_frame_legs = buildIssuesArray([
    ['chair wobbles', 'icon'], ['loose joints', 'icon'], ['scratches', 'icon'], ['water stains', 'icon']
]);
const DiningChairsIssueMap = [
    {component:'CheckBox', property:'location', displayName:'Backrest', icon:'icon', next:'diningChairs_backrest'},
    {component:'CheckBox', property:'location', displayName:'Seat', icon:'icon', next:'diningChairs_seat'},
    {component:'CheckBox', property:'location', displayName:'Frame/legs', icon:'icon', next:'diningChairs_frame_legs'}
];

// Easy chairs
const easyChairs_backrest = buildIssuesArray([
    ['cracked', 'icon'], ['loose', 'icon'], ['veneer lifting', 'icon']
]);
const easyChairs_seat = buildIssuesArray([
    ['foam flat', 'icon'], ['webbing sagging', 'icon'], ['dirty or torn fabric', 'icon']
]);
const easyChairs_frame = buildIssuesArray([
    ['loose', 'icon'], ['scratched', 'icon'], ['veneer damage', 'icon']
]);
const easyChairs_armrests = buildIssuesArray([
    ['worn edges', 'icon'], ['dents', 'icon'], ['chipped finish', 'icon']
]);
const EasyChairsIssueMap = [
    {component:'CheckBox', property:'location', displayName:'Backrest', icon:'icon', next:'easyChairs_backrest'},
    {component:'CheckBox', property:'location', displayName:'Seat', icon:'icon', next:'easyChairs_seat'},
    {component:'CheckBox', property:'location', displayName:'Frame', icon:'icon', next:'easyChairs_frame'},
    {component:'CheckBox', property:'location', displayName:'Armrests', icon:'icon', next:'easyChairs_armrests'}
];

// Armchairs
const armchairs_backrest = buildIssuesArray([
    ['cracked', 'icon'], ['loose', 'icon'], ['faded finish', 'icon']
]);
const armchairs_seat = buildIssuesArray([
    ['sagging', 'icon'], ['foam collapsed', 'icon'], ['fabric worn or stained', 'icon']
]);
const armchairs_frame = buildIssuesArray([
    ['loose joints', 'icon'], ['scratches', 'icon'], ['veneer lifting', 'icon']
]);
const armchairs_armrests = buildIssuesArray([
    ['worn edges', 'icon'], ['chipped or cracked wood', 'icon']
]);
const armchairs_cushions = buildIssuesArray([
    ['flat', 'icon'], ['fabric faded', 'icon'], ['bad smell', 'icon']
]);
const ArmchairsIssueMap = [
    {component:'CheckBox', property:'location', displayName:'Backrest', icon:'icon', next:'armchairs_backrest'},
    {component:'CheckBox', property:'location', displayName:'Seat', icon:'icon', next:'armchairs_seat'},
    {component:'CheckBox', property:'location', displayName:'Frame', icon:'icon', next:'armchairs_frame'},
    {component:'CheckBox', property:'location', displayName:'Armrests', icon:'icon', next:'armchairs_armrests'},
    {component:'CheckBox', property:'location', displayName:'Cushions', icon:'icon', next:'armchairs_cushions'}
];

// Sofas
const sofas_backrest = buildIssuesArray([
    ['loose frame', 'icon'], ['cracked wood', 'icon'], ['faded finish', 'icon']
]);
const sofas_seat = buildIssuesArray([
    ['broken springs', 'icon'], ['sagging', 'icon'], ['foam collapsed', 'icon']
]);
const sofas_armrests = buildIssuesArray([
    ['dents', 'icon'], ['scratches', 'icon'], ['chipped veneer', 'icon']
]);
const sofas_frame = buildIssuesArray([
    ['loose or cracked joints', 'icon'], ['unstable', 'icon']
]);
const sofas_cushions = buildIssuesArray([
    ['foam turned to dust', 'icon'], ['fabric stretched', 'icon'], ['unpleasant smell', 'icon']
]);
const SofasIssueMap = [
    {component:'CheckBox', property:'location', displayName:'Backrest', icon:'icon', next:'sofas_backrest'},
    {component:'CheckBox', property:'location', displayName:'Seat', icon:'icon', next:'sofas_seat'},
    {component:'CheckBox', property:'location', displayName:'Armrests', icon:'icon', next:'sofas_armrests'},
    {component:'CheckBox', property:'location', displayName:'Frame', icon:'icon', next:'sofas_frame'},
    {component:'CheckBox', property:'location', displayName:'Cushions', icon:'icon', next:'sofas_cushions'}
];

// Stools
const stools_seat = buildIssuesArray([
    ['dents', 'icon'], ['chips', 'icon'], ['cracked wood', 'icon']
]);
const stools_legs_base = buildIssuesArray([
    ['unstable', 'icon'], ['loose', 'icon'], ['worn feet', 'icon']
]);
const StoolsIssueMap = [
    {component:'CheckBox', property:'location', displayName:'Seat', icon:'icon', next:'stools_seat'},
    {component:'CheckBox', property:'location', displayName:'Legs/base', icon:'icon', next:'stools_legs_base'}
];

// Other seating
const otherSeating_frame = buildIssuesArray([
    ['loose', 'icon'], ['cracked', 'icon'], ['scratched', 'icon']
]);
const otherSeating_seat = buildIssuesArray([
    ['sagging', 'icon'], ['fabric worn', 'icon'], ['dirty', 'icon']
]);
const OtherSeatingIssueMap = [
    {component:'CheckBox', property:'location', displayName:'Frame', icon:'icon', next:'otherSeating_frame'},
    {component:'CheckBox', property:'location', displayName:'Seat', icon:'icon', next:'otherSeating_seat'}
];

// Writing Desks
const writingDesks_top = buildIssuesArray([
    ['scratches', 'icon'], ['stains', 'icon'], ['veneer lifting', 'icon']
]);
const writingDesks_legs_base = buildIssuesArray([
    ['unstable', 'icon'], ['loose joints', 'icon'], ['cracked', 'icon']
]);
const writingDesks_drawers = buildIssuesArray([
    ['stuck', 'icon'], ['misaligned', 'icon'], ['missing or broken handles', 'icon']
]);
const WritingDesksIssueMap = [
    {component:'CheckBox', property:'location', displayName:'Top', icon:'icon', next:'writingDesks_top'},
    {component:'CheckBox', property:'location', displayName:'Legs/base', icon:'icon', next:'writingDesks_legs_base'},
    {component:'CheckBox', property:'location', displayName:'Drawers', icon:'icon', next:'writingDesks_drawers'}
];

// Dining Tables
const diningTables_top = buildIssuesArray([
    ['scratches', 'icon'], ['water rings', 'icon'], ['chipped veneer', 'icon'], ['faded color', 'icon']
]);
const diningTables_legs_base = buildIssuesArray([
    ['unstable', 'icon'], ['cracked', 'icon'], ['loose', 'icon']
]);
const diningTables_extensions = buildIssuesArray([
    ['warped', 'icon'], ['jammed', 'icon'], ['different color from main top', 'icon']
]);
const DiningTablesIssueMap = [
    {component:'CheckBox', property:'location', displayName:'Top', icon:'icon', next:'diningTables_top'},
    {component:'CheckBox', property:'location', displayName:'Legs/base', icon:'icon', next:'diningTables_legs_base'},
    {component:'CheckBox', property:'location', displayName:'Extensions', icon:'icon', next:'diningTables_extensions'}
];

// Nest of Tables
const nestOfTables_tops = buildIssuesArray([
    ['scratches', 'icon'], ['faded', 'icon'], ['veneer lifting', 'icon']
]);
const nestOfTables_legs = buildIssuesArray([
    ['loose', 'icon'], ['unstable', 'icon']
]);
const NestOfTablesIssueMap = [
    {component:'CheckBox', property:'location', displayName:'Tops', icon:'icon', next:'nestOfTables_tops'},
    {component:'CheckBox', property:'location', displayName:'Legs', icon:'icon', next:'nestOfTables_legs'}
];

// Bedside Tables
const bedsideTables_top = buildIssuesArray([
    ['scratches', 'icon'], ['water rings', 'icon'], ['chipped veneer', 'icon']
]);
const bedsideTables_legs_base = buildIssuesArray([
    ['unstable', 'icon'], ['loose', 'icon']
]);
const bedsideTables_drawers = buildIssuesArray([
    ['stuck', 'icon'], ['swollen', 'icon'], ['misaligned', 'icon'], ['missing handles', 'icon']
]);
const bedsideTables_shelf = buildIssuesArray([
    ['warped', 'icon'], ['cracked', 'icon']
]);
const BedsideTablesIssueMap = [
    {component:'CheckBox', property:'location', displayName:'Top', icon:'icon', next:'bedsideTables_top'},
    {component:'CheckBox', property:'location', displayName:'Legs/base', icon:'icon', next:'bedsideTables_legs_base'},
    {component:'CheckBox', property:'location', displayName:'Drawer(s)', icon:'icon', next:'bedsideTables_drawers'},
    {component:'CheckBox', property:'location', displayName:'Shelf', icon:'icon', next:'bedsideTables_shelf'}
];

// Coffee Tables
const coffeeTables_top = buildIssuesArray([
    ['scratches', 'icon'], ['stains', 'icon'], ['veneer damage', 'icon']
]);
const coffeeTables_legs_base = buildIssuesArray([
    ['loose', 'icon'], ['cracked', 'icon'], ['unstable', 'icon']
]);
const coffeeTables_shelf = buildIssuesArray([
    ['warped', 'icon'], ['loose', 'icon']
]);
const CoffeeTablesIssueMap = [
    {component:'CheckBox', property:'location', displayName:'Top', icon:'icon', next:'coffeeTables_top'},
    {component:'CheckBox', property:'location', displayName:'Legs/base', icon:'icon', next:'coffeeTables_legs_base'},
    {component:'CheckBox', property:'location', displayName:'Shelf', icon:'icon', next:'coffeeTables_shelf'}
];

// Hall Tables
const hallTables_top = buildIssuesArray([
    ['deep scratches', 'icon'], ['chips', 'icon']
]);
const hallTables_legs_base = buildIssuesArray([
    ['unstable', 'icon'], ['cracked', 'icon']
]);
const hallTables_drawers = buildIssuesArray([
    ['stuck', 'icon'], ['broken handle', 'icon']
]);
const HallTablesIssueMap = [
    {component:'CheckBox', property:'location', displayName:'Top', icon:'icon', next:'hallTables_top'},
    {component:'CheckBox', property:'location', displayName:'Legs/base', icon:'icon', next:'hallTables_legs_base'},
    {component:'CheckBox', property:'location', displayName:'Drawer(s)', icon:'icon', next:'hallTables_drawers'}
];

// Side Tables
const sideTables_top = buildIssuesArray([
    ['scratches', 'icon'], ['faded color', 'icon'], ['chipped veneer', 'icon']
]);
const sideTables_legs_base = buildIssuesArray([
    ['loose', 'icon'], ['unstable', 'icon']
]);
const sideTables_shelf = buildIssuesArray([
    ['warped', 'icon'], ['damaged', 'icon']
]);
const SideTablesIssueMap = [
    {component:'CheckBox', property:'location', displayName:'Top', icon:'icon', next:'sideTables_top'},
    {component:'CheckBox', property:'location', displayName:'Legs/base', icon:'icon', next:'sideTables_legs_base'},
    {component:'CheckBox', property:'location', displayName:'Shelf', icon:'icon', next:'sideTables_shelf'}
];

// Other Tables
const otherTables_top = buildIssuesArray([
    ['scratches', 'icon'], ['watermarks', 'icon'], ['cracked', 'icon']
]);
const otherTables_frame_base = buildIssuesArray([
    ['loose', 'icon'], ['unstable', 'icon']
]);
const otherTables_extensions = buildIssuesArray([
    ['stuck', 'icon'], ['warped', 'icon']
]);
const OtherTablesIssueMap = [
    {component:'CheckBox', property:'location', displayName:'Top', icon:'icon', next:'otherTables_top'},
    {component:'CheckBox', property:'location', displayName:'Frame/base', icon:'icon', next:'otherTables_frame_base'},
    {component:'CheckBox', property:'location', displayName:'Extensions', icon:'icon', next:'otherTables_extensions'}
];

// Sideboards
const sideboards_top = buildIssuesArray([
    ['scratches', 'icon'], ['chips', 'icon'], ['water rings', 'icon']
]);
const sideboards_frame = buildIssuesArray([
    ['cracked', 'icon'], ['veneer lifting', 'icon'], ['faded', 'icon']
]);
const sideboards_doors = buildIssuesArray([
    ['warped', 'icon'], ['loose', 'icon'], ['won’t close properly', 'icon']
]);
const sideboards_drawers = buildIssuesArray([
    ['stuck', 'icon'], ['misaligned', 'icon'], ['missing handle', 'icon']
]);
const sideboards_legs_base = buildIssuesArray([
    ['sagging', 'icon'], ['unstable', 'icon']
]);
const SideboardsIssueMap = [
    {component:'CheckBox', property:'location', displayName:'Top', icon:'icon', next:'sideboards_top'},
    {component:'CheckBox', property:'location', displayName:'Frame', icon:'icon', next:'sideboards_frame'},
    {component:'CheckBox', property:'location', displayName:'Doors', icon:'icon', next:'sideboards_doors'},
    {component:'CheckBox', property:'location', displayName:'Drawers', icon:'icon', next:'sideboards_drawers'},
    {component:'CheckBox', property:'location', displayName:'Legs/base', icon:'icon', next:'sideboards_legs_base'}
];

// Highboards
const highboards_top = buildIssuesArray([
    ['scratches', 'icon'], ['faded', 'icon']
]);
const highboards_frame = buildIssuesArray([
    ['cracked', 'icon'], ['veneer problems', 'icon'], ['faded', 'icon']
]);
const highboards_doors = buildIssuesArray([
    ['warped', 'icon'], ['loose hinges', 'icon'], ['sticking', 'icon']
]);
const highboards_glass = buildIssuesArray([
    ['scratched', 'icon'], ['cracked', 'icon'], ['missing', 'icon']
]);
const highboards_drawers = buildIssuesArray([
    ['swollen', 'icon'], ['misaligned', 'icon']
]);
const highboards_legs_base = buildIssuesArray([
    ['unstable', 'icon']
]);
const HighboardsIssueMap = [
    {component:'CheckBox', property:'location', displayName:'Top', icon:'icon', next:'highboards_top'},
    {component:'CheckBox', property:'location', displayName:'Frame', icon:'icon', next:'highboards_frame'},
    {component:'CheckBox', property:'location', displayName:'Doors', icon:'icon', next:'highboards_doors'},
    {component:'CheckBox', property:'location', displayName:'Glass', icon:'icon', next:'highboards_glass'},
    {component:'CheckBox', property:'location', displayName:'Drawers', icon:'icon', next:'highboards_drawers'},
    {component:'CheckBox', property:'location', displayName:'Legs/base', icon:'icon', next:'highboards_legs_base'}
];

// Bookshelves
const bookshelves_top = buildIssuesArray([
    ['scratches', 'icon'], ['veneer lifting', 'icon']
]);
const bookshelves_frame_sides = buildIssuesArray([
    ['warped', 'icon'], ['cracked', 'icon']
]);
const bookshelves_shelves = buildIssuesArray([
    ['bowing', 'icon'], ['cracked', 'icon'], ['loose', 'icon']
]);
const bookshelves_doors = buildIssuesArray([
    ['warped', 'icon'], ['loose hinges', 'icon'], ['sticking', 'icon']
]);
const bookshelves_drawers = buildIssuesArray([
    ['stuck', 'icon'], ['swollen', 'icon']
]);
const bookshelves_legs_base = buildIssuesArray([
    ['unstable', 'icon']
]);
const BookshelvesIssueMap = [
    {component:'CheckBox', property:'location', displayName:'Top', icon:'icon', next:'bookshelves_top'},
    {component:'CheckBox', property:'location', displayName:'Frame/sides', icon:'icon', next:'bookshelves_frame_sides'},
    {component:'CheckBox', property:'location', displayName:'Shelves', icon:'icon', next:'bookshelves_shelves'},
    {component:'CheckBox', property:'location', displayName:'Doors', icon:'icon', next:'bookshelves_doors'},
    {component:'CheckBox', property:'location', displayName:'Drawers', icon:'icon', next:'bookshelves_drawers'},
    {component:'CheckBox', property:'location', displayName:'Legs/base', icon:'icon', next:'bookshelves_legs_base'}
];

// Chest of Drawers
const chestOfDrawers_top = buildIssuesArray([
    ['scratches', 'icon'], ['chips', 'icon']
]);
const chestOfDrawers_frame = buildIssuesArray([
    ['cracked', 'icon'], ['loose', 'icon']
]);
const chestOfDrawers_drawers = buildIssuesArray([
    ['stuck', 'icon'], ['broken handle', 'icon'], ['misaligned', 'icon']
]);
const chestOfDrawers_legs_base = buildIssuesArray([
    ['unstable', 'icon']
]);
const ChestOfDrawersIssueMap = [
    {component:'CheckBox', property:'location', displayName:'Top', icon:'icon', next:'chestOfDrawers_top'},
    {component:'CheckBox', property:'location', displayName:'Frame', icon:'icon', next:'chestOfDrawers_frame'},
    {component:'CheckBox', property:'location', displayName:'Drawers', icon:'icon', next:'chestOfDrawers_drawers'},
    {component:'CheckBox', property:'location', displayName:'Legs/base', icon:'icon', next:'chestOfDrawers_legs_base'}
];

// Bar Cabinets
const barCabinets_top = buildIssuesArray([
    ['scratches', 'icon'], ['stains', 'icon']
]);
const barCabinets_frame = buildIssuesArray([
    ['chipped veneer', 'icon'], ['cracks', 'icon']
]);
const barCabinets_doors = buildIssuesArray([
    ['loose', 'icon'], ['warped', 'icon']
]);
const barCabinets_glass = buildIssuesArray([
    ['scratched', 'icon'], ['cracked', 'icon'], ['missing', 'icon']
]);
const barCabinets_drawers = buildIssuesArray([
    ['stuck', 'icon'], ['misaligned', 'icon']
]);
const barCabinets_legs_base = buildIssuesArray([
    ['unstable', 'icon']
]);
const BarCabinetsIssueMap = [
    {component:'CheckBox', property:'location', displayName:'Top', icon:'icon', next:'barCabinets_top'},
    {component:'CheckBox', property:'location', displayName:'Frame', icon:'icon', next:'barCabinets_frame'},
    {component:'CheckBox', property:'location', displayName:'Doors', icon:'icon', next:'barCabinets_doors'},
    {component:'CheckBox', property:'location', displayName:'Glass', icon:'icon', next:'barCabinets_glass'},
    {component:'CheckBox', property:'location', displayName:'Drawers', icon:'icon', next:'barCabinets_drawers'},
    {component:'CheckBox', property:'location', displayName:'Legs/base', icon:'icon', next:'barCabinets_legs_base'}
];

// Wardrobes
const wardrobes_top = buildIssuesArray([
    ['scratches', 'icon'], ['stains', 'icon']
]);
const wardrobes_frame = buildIssuesArray([
    ['cracked panels', 'icon'], ['veneer lifting', 'icon']
]);
const wardrobes_doors = buildIssuesArray([
    ['warped', 'icon'], ['sticking', 'icon'], ['loose hinges', 'icon']
]);
const wardrobes_inside_fittings = buildIssuesArray([
    ['missing shelves or rods', 'icon'], ['warped', 'icon']
]);
const wardrobes_legs_base = buildIssuesArray([
    ['unstable', 'icon']
]);
const WardrobesIssueMap = [
    {component:'CheckBox', property:'location', displayName:'Top', icon:'icon', next:'wardrobes_top'},
    {component:'CheckBox', property:'location', displayName:'Frame', icon:'icon', next:'wardrobes_frame'},
    {component:'CheckBox', property:'location', displayName:'Doors', icon:'icon', next:'wardrobes_doors'},
    {component:'CheckBox', property:'location', displayName:'Inside fittings', icon:'icon', next:'wardrobes_inside_fittings'},
    {component:'CheckBox', property:'location', displayName:'Legs/base', icon:'icon', next:'wardrobes_legs_base'}
];

// Other Storage
const otherStorage_top = buildIssuesArray([
    ['scratches', 'icon'], ['chips', 'icon']
]);
const otherStorage_frame = buildIssuesArray([
    ['cracks', 'icon'], ['loose', 'icon']
]);
const otherStorage_doors_drawers = buildIssuesArray([
    ['warped', 'icon'], ['stuck', 'icon']
]);
const OtherStorageIssueMap = [
    {component:'CheckBox', property:'location', displayName:'Top', icon:'icon', next:'otherStorage_top'},
    {component:'CheckBox', property:'location', displayName:'Frame', icon:'icon', next:'otherStorage_frame'},
    {component:'CheckBox', property:'location', displayName:'Doors/drawers', icon:'icon', next:'otherStorage_doors_drawers'}
];

// Floor Lamps
const floorLamps_base = buildIssuesArray([
    ['rust', 'icon'], ['unstable', 'icon']
]);
const floorLamps_pole = buildIssuesArray([
    ['bent', 'icon'], ['cracked', 'icon'], ['loose', 'icon']
]);
const floorLamps_arms = buildIssuesArray([
    ['misaligned', 'icon'], ['loose', 'icon']
]);
const floorLamps_shades = buildIssuesArray([
    ['torn', 'icon'], ['cracked', 'icon'], ['yellowed', 'icon']
]);
const floorLamps_electrical = buildIssuesArray([
    ['frayed cord', 'icon'], ['unsafe plug', 'icon'], ['broken switch', 'icon']
]);
const FloorLampsIssueMap = [
    {component:'CheckBox', property:'location', displayName:'Base', icon:'icon', next:'floorLamps_base'},
    {component:'CheckBox', property:'location', displayName:'Pole', icon:'icon', next:'floorLamps_pole'},
    {component:'CheckBox', property:'location', displayName:'Arms', icon:'icon', next:'floorLamps_arms'},
    {component:'CheckBox', property:'location', displayName:'Shade(s)', icon:'icon', next:'floorLamps_shades'},
    {component:'CheckBox', property:'location', displayName:'Electrical', icon:'icon', next:'floorLamps_electrical'}
];

// Table Lamps
const tableLamps_base = buildIssuesArray([
    ['cracks', 'icon'], ['chips', 'icon']
]);
const tableLamps_body = buildIssuesArray([
    ['scratched', 'icon'], ['dented', 'icon'], ['loose', 'icon']
]);
const tableLamps_shade = buildIssuesArray([
    ['discolored', 'icon'], ['torn', 'icon'], ['cracked', 'icon']
]);
const tableLamps_electrical = buildIssuesArray([
    ['frayed cord', 'icon'], ['unsafe plug', 'icon'], ['broken switch', 'icon']
]);
const TableLampsIssueMap = [
    {component:'CheckBox', property:'location', displayName:'Base', icon:'icon', next:'tableLamps_base'},
    {component:'CheckBox', property:'location', displayName:'Body', icon:'icon', next:'tableLamps_body'},
    {component:'CheckBox', property:'location', displayName:'Shade', icon:'icon', next:'tableLamps_shade'},
    {component:'CheckBox', property:'location', displayName:'Electrical', icon:'icon', next:'tableLamps_electrical'}
];

// Ceiling Lamps
const ceilingLamps_mount = buildIssuesArray([
    ['rust', 'icon'], ['loose', 'icon']
]);
const ceilingLamps_arms = buildIssuesArray([
    ['bent', 'icon'], ['loose', 'icon']
]);
const ceilingLamps_shades = buildIssuesArray([
    ['cracked', 'icon'], ['missing', 'icon'], ['discolored', 'icon']
]);
const ceilingLamps_electrical = buildIssuesArray([
    ['bad wiring', 'icon'], ['missing parts', 'icon']
]);
const CeilingLampsIssueMap = [
    {component:'CheckBox', property:'location', displayName:'Mount', icon:'icon', next:'ceilingLamps_mount'},
    {component:'CheckBox', property:'location', displayName:'Arms', icon:'icon', next:'ceilingLamps_arms'},
    {component:'CheckBox', property:'location', displayName:'Shades', icon:'icon', next:'ceilingLamps_shades'},
    {component:'CheckBox', property:'location', displayName:'Electrical', icon:'icon', next:'ceilingLamps_electrical'}
];

// Wall Lamps
const wallLamps_mount = buildIssuesArray([
    ['loose', 'icon'], ['rusty', 'icon']
]);
const wallLamps_body_arm = buildIssuesArray([
    ['bent', 'icon'], ['cracked', 'icon']
]);
const wallLamps_shade = buildIssuesArray([
    ['torn', 'icon'], ['cracked', 'icon'], ['missing', 'icon']
]);
const wallLamps_electrical = buildIssuesArray([
    ['bad wiring', 'icon'], ['broken switch', 'icon']
]);
const WallLampsIssueMap = [
    {component:'CheckBox', property:'location', displayName:'Mount', icon:'icon', next:'wallLamps_mount'},
    {component:'CheckBox', property:'location', displayName:'Body/arm', icon:'icon', next:'wallLamps_body_arm'},
    {component:'CheckBox', property:'location', displayName:'Shade', icon:'icon', next:'wallLamps_shade'},
    {component:'CheckBox', property:'location', displayName:'Electrical', icon:'icon', next:'wallLamps_electrical'}
];

// Other Lamps
const otherLamps_base_mount = buildIssuesArray([
    ['cracked', 'icon'], ['rusty', 'icon']
]);
const otherLamps_body = buildIssuesArray([
    ['bent', 'icon'], ['loose', 'icon']
]);
const otherLamps_shades = buildIssuesArray([
    ['damaged', 'icon'], ['missing', 'icon']
]);
const otherLamps_electrical = buildIssuesArray([
    ['unsafe wiring', 'icon']
]);
const OtherLampsIssueMap = [
    {component:'CheckBox', property:'location', displayName:'Base/mount', icon:'icon', next:'otherLamps_base_mount'},
    {component:'CheckBox', property:'location', displayName:'Body', icon:'icon', next:'otherLamps_body'},
    {component:'CheckBox', property:'location', displayName:'Shade(s)', icon:'icon', next:'otherLamps_shades'},
    {component:'CheckBox', property:'location', displayName:'Electrical', icon:'icon', next:'otherLamps_electrical'}
];

// Posters
const posters_paper_artwork = buildIssuesArray([
    ['faded', 'icon'], ['yellowed', 'icon'], ['torn', 'icon'], ['stained', 'icon']
]);
const posters_frame = buildIssuesArray([
    ['cracked', 'icon'], ['missing corners', 'icon']
]);
const posters_glass = buildIssuesArray([
    ['scratched', 'icon'], ['cracked', 'icon'], ['missing', 'icon']
]);
const posters_backboard = buildIssuesArray([
    ['warped', 'icon'], ['stained', 'icon']
]);
const PostersIssueMap = [
    {component:'CheckBox', property:'location', displayName:'Paper/artwork', icon:'icon', next:'posters_paper_artwork'},
    {component:'CheckBox', property:'location', displayName:'Frame', icon:'icon', next:'posters_frame'},
    {component:'CheckBox', property:'location', displayName:'Glass', icon:'icon', next:'posters_glass'},
    {component:'CheckBox', property:'location', displayName:'Backboard', icon:'icon', next:'posters_backboard'}
];

// Porcelain
const porcelain_body = buildIssuesArray([
    ['chips', 'icon'], ['cracks', 'icon'], ['fine lines (crazing)', 'icon']
]);
const porcelain_glaze = buildIssuesArray([
    ['stains', 'icon'], ['dull', 'icon']
]);
const porcelain_handles_lids = buildIssuesArray([
    ['broken', 'icon'], ['missing', 'icon']
]);
const PorcelainIssueMap = [
    {component:'CheckBox', property:'location', displayName:'Body', icon:'icon', next:'porcelain_body'},
    {component:'CheckBox', property:'location', displayName:'Glaze', icon:'icon', next:'porcelain_glaze'},
    {component:'CheckBox', property:'location', displayName:'Handles/lids', icon:'icon', next:'porcelain_handles_lids'}
];

// Pictures
const pictures_artwork = buildIssuesArray([
    ['faded', 'icon'], ['stained', 'icon'], ['flaking paint', 'icon']
]);
const pictures_frame = buildIssuesArray([
    ['cracked', 'icon'], ['missing corners', 'icon']
]);
const pictures_glass = buildIssuesArray([
    ['scratched', 'icon'], ['cracked', 'icon']
]);
const pictures_backboard = buildIssuesArray([
    ['warped', 'icon'], ['stained', 'icon']
]);
const PicturesIssueMap = [
    {component:'CheckBox', property:'location', displayName:'Artwork', icon:'icon', next:'pictures_artwork'},
    {component:'CheckBox', property:'location', displayName:'Frame', icon:'icon', next:'pictures_frame'},
    {component:'CheckBox', property:'location', displayName:'Glass', icon:'icon', next:'pictures_glass'},
    {component:'CheckBox', property:'location', displayName:'Backboard', icon:'icon', next:'pictures_backboard'}
];

// Other Decorations
const otherDecorations_main_body = buildIssuesArray([
    ['chipped', 'icon'], ['cracked', 'icon'], ['discolored', 'icon']
]);
const otherDecorations_base_support = buildIssuesArray([
    ['loose', 'icon'], ['worn', 'icon']
]);
const otherDecorations_frame = buildIssuesArray([
    ['cracked', 'icon'], ['missing parts', 'icon']
]);
const OtherDecorationsIssueMap = [
    {component:'CheckBox', property:'location', displayName:'Main body', icon:'icon', next:'otherDecorations_main_body'},
    {component:'CheckBox', property:'location', displayName:'Base/support', icon:'icon', next:'otherDecorations_base_support'},
    {component:'CheckBox', property:'location', displayName:'Frame (if any)', icon:'icon', next:'otherDecorations_frame'}
];
export interface MapDictionary {
    component:string,
    property:string,
    displayName:string,
    icon:string | React.JSX.Element,
    next?: string,
    
}
export interface ItemIssuesMapType {
    [key: string]: MapDictionary[]
}
export const ItemIssuesMap: ItemIssuesMapType = {
    'Dining Chair': DiningChairsIssueMap,
    diningChairs_backrest,
    diningChairs_seat,
    diningChairs_frame_legs,

    'Easy Chair': EasyChairsIssueMap,
    easyChairs_backrest,
    easyChairs_seat,
    easyChairs_frame,
    easyChairs_armrests,

    'Armchair': ArmchairsIssueMap,
    armchairs_backrest,
    armchairs_seat,
    armchairs_frame,
    armchairs_armrests,
    armchairs_cushions,

    'Sofa': SofasIssueMap,
    sofas_backrest,
    sofas_seat,
    sofas_armrests,
    sofas_frame,
    sofas_cushions,

    'Stool': StoolsIssueMap,
    stools_seat,
    stools_legs_base,

    'Other Seating': OtherSeatingIssueMap,
    otherSeating_frame,
    otherSeating_seat,

    'Writing Desk': WritingDesksIssueMap,
    writingDesks_top,
    writingDesks_legs_base,
    writingDesks_drawers,

    'Dining Table': DiningTablesIssueMap,
    diningTables_top,
    diningTables_legs_base,
    diningTables_extensions,

    'Nest of Tables': NestOfTablesIssueMap,
    nestOfTables_tops,
    nestOfTables_legs,

    'Bedside Tables': BedsideTablesIssueMap,
    bedsideTables_top,
    bedsideTables_legs_base,
    bedsideTables_drawers,
    bedsideTables_shelf,

    'Coffee Tables': CoffeeTablesIssueMap,
    coffeeTables_top,
    coffeeTables_legs_base,
    coffeeTables_shelf,

    'Hall Table': HallTablesIssueMap,
    hallTables_top,
    hallTables_legs_base,
    hallTables_drawers,

    'Side Table': SideTablesIssueMap,
    sideTables_top,
    sideTables_legs_base,
    sideTables_shelf,

    'Other Table': OtherTablesIssueMap,
    otherTables_top,
    otherTables_frame_base,
    otherTables_extensions,

    'Sideboard': SideboardsIssueMap,
    sideboards_top,
    sideboards_frame,
    sideboards_doors,
    sideboards_drawers,
    sideboards_legs_base,

    'Highboard': HighboardsIssueMap,
    highboards_top,
    highboards_frame,
    highboards_doors,
    highboards_glass,
    highboards_drawers,
    highboards_legs_base,

    'Bookshelf': BookshelvesIssueMap,
    bookshelves_top,
    bookshelves_frame_sides,
    bookshelves_shelves,
    bookshelves_doors,
    bookshelves_drawers,
    bookshelves_legs_base,

    'Chest of Drawers': ChestOfDrawersIssueMap,
    chestOfDrawers_top,
    chestOfDrawers_frame,
    chestOfDrawers_drawers,
    chestOfDrawers_legs_base,

    'Bar Cabinet': BarCabinetsIssueMap,
    barCabinets_top,
    barCabinets_frame,
    barCabinets_doors,
    barCabinets_glass,
    barCabinets_drawers,
    barCabinets_legs_base,

    'Wardrobe': WardrobesIssueMap,
    wardrobes_top,
    wardrobes_frame,
    wardrobes_doors,
    wardrobes_inside_fittings,
    wardrobes_legs_base,

    'Other Storage': OtherStorageIssueMap,
    otherStorage_top,
    otherStorage_frame,
    otherStorage_doors_drawers,

    'Floor Lamp': FloorLampsIssueMap,
    floorLamps_base,
    floorLamps_pole,
    floorLamps_arms,
    floorLamps_shades,
    floorLamps_electrical,

    'Table Lamp': TableLampsIssueMap,
    tableLamps_base,
    tableLamps_body,
    tableLamps_shade,
    tableLamps_electrical,

    'Ceiling Lamp': CeilingLampsIssueMap,
    ceilingLamps_mount,
    ceilingLamps_arms,
    ceilingLamps_shades,
    ceilingLamps_electrical,

    'Wall Lamp': WallLampsIssueMap,
    wallLamps_mount,
    wallLamps_body_arm,
    wallLamps_shade,
    wallLamps_electrical,

    'Other Lamp': OtherLampsIssueMap,
    otherLamps_base_mount,
    otherLamps_body,
    otherLamps_shades,
    otherLamps_electrical,

    'Poster': PostersIssueMap,
    posters_paper_artwork,
    posters_frame,
    posters_glass,
    posters_backboard,

    'Porcelain': PorcelainIssueMap,
    porcelain_body,
    porcelain_glaze,
    porcelain_handles_lids,

    'Picture': PicturesIssueMap,
    pictures_artwork,
    pictures_frame,
    pictures_glass,
    pictures_backboard,

    'Other Decoration': OtherDecorationsIssueMap,
    otherDecorations_main_body,
    otherDecorations_base_support,
    otherDecorations_frame
};
