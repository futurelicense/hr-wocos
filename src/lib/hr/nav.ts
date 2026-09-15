export type NavItem = {
  id: string;
  label: string;
  route: string;
  badge?: string;
  badgeTone?: "neutral" | "warning" | "success" | "danger" | "info";
};

export type NavSection = {
  section: string;
  items: NavItem[];
};

export const navigation: NavSection[] = [
  {
    section: "Overview",
    items: [{ id: "hr_command_center", label: "HR Command Center", route: "/hr" }],
  },
  {
    section: "Talent",
    items: [
      { id: "workforce_requests", label: "Workforce Requests", route: "/hr/workforce-requests", badge: "3" },
      { id: "vacancies", label: "Vacancies", route: "/hr/vacancies", badge: "14" },
      { id: "candidates", label: "Candidates", route: "/hr/candidates", badge: "47" },
      { id: "interviews", label: "Interviews", route: "/hr/interviews", badge: "5" },
      {
        id: "verification",
        label: "Background Verification",
        route: "/hr/verification",
        badge: "8",
        badgeTone: "warning",
      },
      { id: "offers", label: "Offers", route: "/hr/offers" },
    ],
  },
  {
    section: "Onboard",
    items: [
      { id: "onboarding", label: "Digital Onboarding", route: "/hr/onboarding", badge: "11" },
      {
        id: "deployment_readiness",
        label: "Deployment Readiness",
        route: "/hr/deployment-readiness",
        badge: "7",
        badgeTone: "success",
      },
    ],
  },
  {
    section: "Workforce",
    items: [
      { id: "employees", label: "Employees", route: "/hr/employees", badge: "186" },
      { id: "deployments", label: "Client Deployments", route: "/hr/deployments" },
      { id: "attendance", label: "Attendance", route: "/hr/attendance" },
      { id: "timesheets", label: "Timesheets", route: "/hr/timesheets" },
      { id: "leave", label: "Leave", route: "/hr/leave" },
    ],
  },
  {
    section: "HR Operations",
    items: [
      { id: "payroll_operations", label: "Payroll Operations", route: "/hr/payroll", badge: "6", badgeTone: "danger" },
      { id: "service_desk", label: "HR Service Desk", route: "/hr/service-desk" },
      { id: "performance", label: "Performance", route: "/hr/performance" },
      { id: "compliance", label: "Compliance", route: "/hr/compliance", badge: "12", badgeTone: "warning" },
    ],
  },
  {
    section: "Portals",
    items: [
      { id: "client_portal", label: "Client Portal", route: "/hr/client-portal" },
      { id: "employee_portal", label: "Employee Self-Service", route: "/hr/employee-portal" },
    ],
  },
  {
    section: "Intelligence",
    items: [
      { id: "analytics", label: "Reports & Analytics", route: "/hr/analytics" },
      { id: "sonia", label: "Sonia AI", route: "/hr/sonia", badgeTone: "info" },
    ],
  },
  {
    section: "Administration",
    items: [
      { id: "workflow_configuration", label: "Workflow Configuration", route: "/hr/settings/workflows" },
      { id: "hr_settings", label: "HR Settings", route: "/hr/settings" },
    ],
  },
];

export const roles = [
  { id: "hr_admin", name: "HR Administrator" },
  { id: "recruiter", name: "Recruiter" },
  { id: "verification_officer", name: "Verification Officer" },
  { id: "hr_manager", name: "HR Manager" },
  { id: "payroll_officer", name: "Payroll Officer" },
  { id: "operations_manager", name: "Workforce Operations Manager" },
  { id: "client_manager", name: "Client Relationship Manager" },
  { id: "client_user", name: "Client User" },
  { id: "employee", name: "Employee" },
  { id: "executive", name: "Executive" },
];
