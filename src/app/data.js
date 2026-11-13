export const statusSteps = ["Submitted", "In review", "Assigned", "Resolved"];

export const complaints = [
  {
    id: "RAI-1024",
    title: "Water cooler not working",
    location: "Second floor, Block A",
    category: "Infrastructure",
    priority: "High",
    priorityReason: "Affects many students and has been pending for 3 days",
    department: "Maintenance",
    status: "Assigned",
    date: "5 Nov 2026",
    duplicateOf: "RAI-1019",
  },
  {
    id: "RAI-1023",
    title: "Wi-Fi not working in library",
    location: "Central Library",
    category: "Technical",
    priority: "Medium",
    priorityReason: "Affects a shared study space",
    department: "IT Services",
    status: "In review",
    date: "4 Nov 2026",
    duplicateOf: null,
  },
  {
    id: "RAI-1019",
    title: "No drinking water on second floor",
    location: "Second floor, Block A",
    category: "Infrastructure",
    priority: "High",
    priorityReason: "Basic facility unavailable",
    department: "Maintenance",
    status: "Assigned",
    date: "3 Nov 2026",
    duplicateOf: null,
  },
  {
    id: "RAI-1015",
    title: "Broken projector in classroom",
    location: "Classroom 204, Block B",
    category: "Infrastructure",
    priority: "Low",
    priorityReason: "Classes can continue with alternatives",
    department: "Maintenance",
    status: "Resolved",
    date: "1 Nov 2026",
    duplicateOf: null,
  },
  {
    id: "RAI-1011",
    title: "Street light not working near hostel gate",
    location: "Hostel Gate",
    category: "Safety",
    priority: "High",
    priorityReason: "Safety concern during night hours",
    department: "Electrical",
    status: "In review",
    date: "30 Oct 2026",
    duplicateOf: null,
  },
  {
    id: "RAI-1008",
    title: "Delay in scholarship document verification",
    location: "Administrative Office",
    category: "Administrative",
    priority: "Medium",
    priorityReason: "Time-sensitive but not an emergency",
    department: "Administration",
    status: "Submitted",
    date: "29 Oct 2026",
    duplicateOf: null,
  },
];

export function statusClass(status) {
  if (status === "Resolved") return "resolved";
  if (status === "Assigned") return "progress";
  return "pending";
}

export function priorityClass(priority) {
  if (priority === "High") return "prio-high";
  if (priority === "Medium") return "prio-medium";
  return "prio-low";
}