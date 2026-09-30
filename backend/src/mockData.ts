import {
  KanbanColumn,
  KanbanQuote,
  YardQuote,
  JobAwaitingDock,
  DryDockProject,
  CostSummary,
  SpecificationGroup,
  WorkOrder,
  ChecklistItem
} from './types.js'

export const kanbanColumns: KanbanColumn[] = [
  { id: 'col-keppel', name: 'Keppel Shipyard', vesselOrYard: 'Yard / Jurong' },
  { id: 'col-sembcorp', name: 'Sembcorp Marine', vesselOrYard: 'Yard / Tuas' },
  { id: 'col-asl', name: 'ASL Shipyard Batam', vesselOrYard: 'Yard / Batam' },
  { id: 'col-paxocean', name: 'PaxOcean Graha', vesselOrYard: 'Yard / Karimun' }
]

export let kanbanQuotes: KanbanQuote[] = [
  {
    id: 'quote-101',
    columnId: 'col-keppel',
    title: 'Hull Hydroblasting & Anti-Fouling Coating',
    description: 'Ultra-high pressure hydroblasting 2500 bar and 3-coat silicone foul release coating system.',
    vesselName: 'MV Ocean Pioneer',
    vendorName: 'Keppel Surface Prep Ltd',
    estimatedCost: 84500,
    currency: 'USD',
    priority: 'High',
    submittedDate: '2026-09-24'
  },
  {
    id: 'quote-102',
    columnId: 'col-keppel',
    title: 'Tailshaft Withdrawal & Stern Tube Bearing Renewal',
    description: 'Pull tailshaft, inspection by DNV surveyor, replace Thordon bearings and forward/aft seals.',
    vesselName: 'MV Ocean Pioneer',
    vendorName: 'Keppel Propulsion Div',
    estimatedCost: 62000,
    currency: 'USD',
    priority: 'High',
    submittedDate: '2026-09-25'
  },
  {
    id: 'quote-103',
    columnId: 'col-sembcorp',
    title: 'Main Engine Cylinder Liner Reboring & Honing',
    description: 'In-situ cylinder liner reboring for MAN B&W 6S60MC unit 3 & 4 with piston crown reconditioning.',
    vesselName: 'MT Samudera Perkasa',
    vendorName: 'Sembcorp Tech Services',
    estimatedCost: 47800,
    currency: 'USD',
    priority: 'Medium',
    submittedDate: '2026-09-27'
  },
  {
    id: 'quote-104',
    columnId: 'col-asl',
    title: 'Ballast Tank Steel Plate Renewal (45T)',
    description: 'Crop and renew Grade A shipbuilding plate in double bottom water ballast tanks 2P & 2S.',
    vesselName: 'MV Borneo Express',
    vendorName: 'ASL Fabrication',
    estimatedCost: 112000,
    currency: 'USD',
    priority: 'High',
    submittedDate: '2026-09-28'
  },
  {
    id: 'quote-105',
    columnId: 'col-paxocean',
    title: 'Anchor Chain Calibration & Sea Chest Grating',
    description: 'Range anchor cable, calibrate links, renew 4 swivel shackles, fabricate sea chest strainers.',
    vesselName: 'TB Nusantara Star',
    vendorName: 'PaxOcean Mechanical',
    estimatedCost: 31500,
    currency: 'USD',
    priority: 'Low',
    submittedDate: '2026-09-29'
  }
]

export let yardQuotes: YardQuote[] = [
  {
    id: 'yq-201',
    title: 'Drydocking Package & Berthage Fee - Q4',
    description: 'Quotation request for 18 days graving dock occupancy, shore power connection, and tug assistance.',
    yardName: 'Keppel Shipyard Singapore',
    vesselName: 'MV Ocean Pioneer',
    requestDate: '2026-09-20',
    targetResponseDate: '2026-10-05',
    status: 'Awaiting Response',
    priority: 'High'
  },
  {
    id: 'yq-202',
    title: 'Rudder Pintle Clearance & Sea Valve Overhaul',
    description: 'Complete overhaul of 28 sea valves, sea chest strainers, and rudder drop measurement.',
    yardName: 'ASL Shipyard Batam',
    vesselName: 'MV Borneo Express',
    requestDate: '2026-09-22',
    targetResponseDate: '2026-10-03',
    status: 'Sent to Yard',
    priority: 'Medium'
  },
  {
    id: 'yq-203',
    title: 'Bow Thruster 1200kW Complete Overhaul',
    description: 'Dismount CP propeller blades, check hydraulic pitch mechanism, and NDT examination.',
    yardName: 'Sembcorp Marine Tuas',
    vesselName: 'MT Samudera Perkasa',
    requestDate: '2026-09-26',
    targetResponseDate: '2026-10-08',
    status: 'Under Review',
    priority: 'High'
  },
  {
    id: 'yq-204',
    title: 'Cargo Hold Hatch Cover Rubber Gasket Renewal',
    description: 'Clean channels, supply & fit 650m sponge rubber seals, ultrasonic leak test post-installation.',
    yardName: 'PaxOcean Graha',
    vesselName: 'MV Pacific Horizon',
    requestDate: '2026-09-28',
    targetResponseDate: '2026-10-10',
    status: 'Awaiting Response',
    priority: 'Low'
  }
]

export let jobsAwaitingDock: JobAwaitingDock[] = [
  {
    id: 'job-301',
    title: 'Propeller Blade Polishing & Laser Pitch Alignment',
    description: 'Class approved super-polish to Rubert Grade A, laser scanning for pitch deviation, repair tip cavitations.',
    vesselName: 'MV Ocean Pioneer',
    category: 'Propulsion & Shaft',
    estimatedDurationDays: 4,
    priority: 'High',
    status: 'Approved',
    approvedDate: '2026-09-22'
  },
  {
    id: 'job-302',
    title: 'Overboard Discharge Valve Refurbishment (18 Units)',
    description: 'Dismantle, lap seats, replace PTFE packing, pressure test at 1.5x working pressure with Class witness.',
    vesselName: 'MV Borneo Express',
    category: 'Piping & Valves',
    estimatedDurationDays: 6,
    priority: 'Medium',
    status: 'Approved',
    approvedDate: '2026-09-24'
  },
  {
    id: 'job-303',
    title: 'Zinc Anode Replacement on Underwater Hull & Sea Chests',
    description: 'Weld 140 pieces high-purity sacrificial zinc anodes (12kg each) per cathodic protection drawing.',
    vesselName: 'MT Samudera Perkasa',
    category: 'Hull & Structure',
    estimatedDurationDays: 3,
    priority: 'Medium',
    status: 'Approved',
    approvedDate: '2026-09-25'
  },
  {
    id: 'job-304',
    title: 'Switchboard Megger Test & Generator Breaker Calibration',
    description: 'Insulation resistance testing of main 440V distribution and trip test calibration for ABB air circuit breakers.',
    vesselName: 'TB Nusantara Star',
    category: 'Electrical & Automation',
    estimatedDurationDays: 5,
    priority: 'High',
    status: 'Scheduled',
    approvedDate: '2026-09-28'
  },
  {
    id: 'job-305',
    title: 'Lifeboat Davit Load Test & Winch Brake Overhaul',
    description: 'Dynamic 1.1x load test with water bags, overhaul centrifugal brake, replace stainless wire ropes.',
    vesselName: 'MV Pacific Horizon',
    category: 'Safety & Navigation',
    estimatedDurationDays: 2,
    priority: 'Low',
    status: 'Awaiting Slot',
    approvedDate: '2026-09-29'
  }
]

export let dryDockProjects: DryDockProject[] = [
  {
    id: 'dd-401',
    dockName: 'Dry Dock #1 (Graving)',
    vesselName: 'MV Ocean Pioneer',
    yardLocation: 'Keppel Shipyard, Singapore',
    status: 'In Progress',
    startDate: '2026-09-18',
    estimatedCompletionDate: '2026-10-06',
    completionPercentage: 68,
    manager: 'Capt. Hendra Wijaya'
  },
  {
    id: 'dd-402',
    dockName: 'Floating Dock #3 (25,000 TLC)',
    vesselName: 'MV Borneo Express',
    yardLocation: 'ASL Batam Yard, Indonesia',
    status: 'In Progress',
    startDate: '2026-09-22',
    estimatedCompletionDate: '2026-10-12',
    completionPercentage: 42,
    manager: 'Ir. Budi Santoso'
  },
  {
    id: 'dd-403',
    dockName: 'Dry Dock #2 (Panamax)',
    vesselName: 'MT Samudera Perkasa',
    yardLocation: 'Sembcorp Tuas, Singapore',
    status: 'Open',
    startDate: '2026-10-02',
    estimatedCompletionDate: '2026-10-24',
    completionPercentage: 10,
    manager: 'Marcus Lim'
  },
  {
    id: 'dd-404',
    dockName: 'Slipway #1',
    vesselName: 'TB Nusantara Star',
    yardLocation: 'PaxOcean Karimun, Indonesia',
    status: 'On Hold',
    startDate: '2026-09-15',
    estimatedCompletionDate: '2026-10-15',
    completionPercentage: 55,
    manager: 'Ahmad Fauzi'
  },
  {
    id: 'dd-405',
    dockName: 'Floating Dock #1',
    vesselName: 'MV Java Trader',
    yardLocation: 'Pelindo Marine Surabaya',
    status: 'Complete',
    startDate: '2026-08-20',
    estimatedCompletionDate: '2026-09-14',
    completionPercentage: 100,
    manager: 'Dwi Prasetyo'
  },
  {
    id: 'dd-406',
    dockName: 'Dry Dock #4',
    vesselName: 'MV Bali Carrier',
    yardLocation: 'Sembcorp Tuas, Singapore',
    status: 'Complete',
    startDate: '2026-08-10',
    estimatedCompletionDate: '2026-09-02',
    completionPercentage: 100,
    manager: 'Capt. Hendra Wijaya'
  }
]

export const costSummaryData: CostSummary = {
  totalBudget: 1450000,
  totalEstimates: 1385000,
  totalCosts: 1120000,
  currency: 'USD',
  breakdown: [
    { name: 'Hull & Structure', budget: 420000, estimates: 410000, costs: 360000 },
    { name: 'Propulsion & Shafting', budget: 350000, estimates: 330000, costs: 285000 },
    { name: 'Machinery & Piping', budget: 280000, estimates: 275000, costs: 215000 },
    { name: 'Electrical & Automation', budget: 180000, estimates: 170000, costs: 135000 },
    { name: 'Dockage & General Services', budget: 220000, estimates: 200000, costs: 125000 }
  ]
}

export let specificationGroups: SpecificationGroup[] = [
  {
    id: 'sg-1',
    code: 'SPEC-HULL-01',
    name: 'Hull Cleaning, Grit Blasting & Painting',
    description: 'Standard technical specs for water-jetting, surface profile Sa 2.5, primer, and antifouling coatings.',
    itemCount: 14,
    category: 'Hull & Coating',
    updatedAt: '2026-09-25'
  },
  {
    id: 'sg-2',
    code: 'SPEC-PROP-02',
    name: 'Propeller, Rudder & Steering Gear Inspection',
    description: 'Clearance tolerances, dye penetrant testing on blade roots, hydraulic torque test.',
    itemCount: 9,
    category: 'Propulsion',
    updatedAt: '2026-09-26'
  },
  {
    id: 'sg-3',
    code: 'SPEC-PIPE-03',
    name: 'Sea Water Cooling & Bilge Lines Overhaul',
    description: 'Galvanized pipe renewal, Cu-Ni pipe spool fabrication, and hydrostatic pressure testing.',
    itemCount: 22,
    category: 'Piping',
    updatedAt: '2026-09-28'
  },
  {
    id: 'sg-4',
    code: 'SPEC-ELEC-04',
    name: 'Main Generator & MSB Insulation Restoration',
    description: 'Oven drying of alternators, varnish impregnation, breaker secondary injection tests.',
    itemCount: 11,
    category: 'Electrical',
    updatedAt: '2026-09-29'
  }
]

export let workOrders: WorkOrder[] = [
  {
    id: 'wo-001',
    orderNumber: 'WO-2026-089',
    title: 'Sea Chest Grating Removal & Strainer Clean',
    description: 'Dismount port & stbd sea chest gratings, grit blast, inspect zinc anodes, reinstall with new stainless fasteners.',
    vesselName: 'MV Ocean Pioneer',
    assignedTo: 'Keppel Mechanical Team A',
    priority: 'High',
    status: 'In Progress',
    dueDate: '2026-10-02'
  },
  {
    id: 'wo-002',
    orderNumber: 'WO-2026-090',
    title: 'Anchor Chain Calibration 14 Shackles',
    description: 'Drop anchor chains in dock bottom, wire brush, caliper measure 3 links per shackle, paint meter marks.',
    vesselName: 'MV Borneo Express',
    assignedTo: 'ASL Rigging Crew',
    priority: 'Medium',
    status: 'Pending',
    dueDate: '2026-10-05'
  },
  {
    id: 'wo-003',
    orderNumber: 'WO-2026-091',
    title: 'Main Engine Turbocharger Rotor Balancing',
    description: 'Dismount rotor assembly, ultrasonic clean nozzle ring, dynamic balance at 15,000 RPM, renew ceramic bearings.',
    vesselName: 'MT Samudera Perkasa',
    assignedTo: 'TurboCare Marine Specialist',
    priority: 'Urgent',
    status: 'In Progress',
    dueDate: '2026-10-04'
  }
]

export let checklists: ChecklistItem[] = [
  {
    id: 'chk-1',
    title: 'Pre-Docking Safety & Stability Verification',
    description: 'Ensure trim by the stern < 1.5m, zero list, minimal ballast, sound all tanks, secure loose deck items.',
    category: 'Pre-Docking',
    totalChecks: 12,
    completedChecks: 12,
    status: 'Completed',
    targetDate: '2026-09-18'
  },
  {
    id: 'chk-2',
    title: 'Dock Bottom Block Positioning & Vessel Touchdown',
    description: 'Verify keel block alignment with docking plan, side block heights, and diver inspection before dewatering.',
    category: 'In-Dock',
    totalChecks: 8,
    completedChecks: 8,
    status: 'Completed',
    targetDate: '2026-09-19'
  },
  {
    id: 'chk-3',
    title: 'Daily Hot Work & Enclosed Space Entry Permits',
    description: 'Atmospheric gas testing (O2 > 20.8%, LEL 0%), fire watch stationed, ventilation blower functional.',
    category: 'In-Dock',
    totalChecks: 15,
    completedChecks: 11,
    status: 'In Progress',
    targetDate: '2026-10-01'
  },
  {
    id: 'chk-4',
    title: 'Pre-Flooding Sea Valve Closure & Hull Plug Re-installation',
    description: 'All bottom plugs torqued and soap tested, all underwater valves shut and wire locked, surveyor clearance.',
    category: 'Flooding & Undocking',
    totalChecks: 10,
    completedChecks: 2,
    status: 'Pending',
    targetDate: '2026-10-06'
  }
]
