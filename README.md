# HR WoCOS

{

  "product": {

    "name": "WoCOS HR",

    "full_name": "WoCOS HR - Intelligent Workforce Operations",

    "parent_platform": "WoCOS",

    "product_type": "business_add_on",

    "version": "1.0",

    "implementation_stage": "frontend_prototype",

    "description": "An intelligent HR and workforce operations add-on for WoCOS covering the employee lifecycle from workforce request through recruitment, onboarding, deployment, workforce operations, compliance, performance and exit.",

    "design_principles": [

      "workflow_first",

      "role_based",

      "modular",

      "AI_assisted",

      "client_aware",

      "employee_centric",

      "configuration_driven",

      "work_continuity"

    ]

  },

  "roles": [

    {

      "id": "hr_admin",

      "name": "HR Administrator"

    },

    {

      "id": "recruiter",

      "name": "Recruiter"

    },

    {

      "id": "verification_officer",

      "name": "Verification Officer"

    },

    {

      "id": "hr_manager",

      "name": "HR Manager"

    },

    {

      "id": "payroll_officer",

      "name": "Payroll Officer"

    },

    {

      "id": "operations_manager",

      "name": "Workforce Operations Manager"

    },

    {

      "id": "client_manager",

      "name": "Client Relationship Manager"

    },

    {

      "id": "client_user",

      "name": "Client User"

    },

    {

      "id": "employee",

      "name": "Employee"

    },

    {

      "id": "executive",

      "name": "Executive"

    }

  ],

  "navigation": [

    {

      "section": "Overview",

      "items": [

        {

          "id": "hr_command_center",

          "label": "HR Command Center",

          "route": "/hr"

        }

      ]

    },

    {

      "section": "Talent",

      "items": [

        {

          "id": "workforce_requests",

          "label": "Workforce Requests",

          "route": "/hr/workforce-requests"

        },

        {

          "id": "vacancies",

          "label": "Vacancies",

          "route": "/hr/vacancies"

        },

        {

          "id": "candidates",

          "label": "Candidates",

          "route": "/hr/candidates"

        },

        {

          "id": "interviews",

          "label": "Interviews",

          "route": "/hr/interviews"

        },

        {

          "id": "verification",

          "label": "Background Verification",

          "route": "/hr/verification"

        },

        {

          "id": "offers",

          "label": "Offers",

          "route": "/hr/offers"

        }

      ]

    },

    {

      "section": "Onboard",

      "items": [

        {

          "id": "onboarding",

          "label": "Digital Onboarding",

          "route": "/hr/onboarding"

        },

        {

          "id": "deployment_readiness",

          "label": "Deployment Readiness",

          "route": "/hr/deployment-readiness"

        }

      ]

    },

    {

      "section": "Workforce",

      "items": [

        {

          "id": "employees",

          "label": "Employees",

          "route": "/hr/employees"

        },

        {

          "id": "deployments",

          "label": "Client Deployments",

          "route": "/hr/deployments"

        },

        {

          "id": "attendance",

          "label": "Attendance",

          "route": "/hr/attendance"

        },

        {

          "id": "timesheets",

          "label": "Timesheets",

          "route": "/hr/timesheets"

        },

        {

          "id": "leave",

          "label": "Leave",

          "route": "/hr/leave"

        }

      ]

    },

    {

      "section": "HR Operations",

      "items": [

        {

          "id": "payroll_operations",

          "label": "Payroll Operations",

          "route": "/hr/payroll"

        },

        {

          "id": "service_desk",

          "label": "HR Service Desk",

          "route": "/hr/service-desk"

        },

        {

          "id": "performance",

          "label": "Performance",

          "route": "/hr/performance"

        },

        {

          "id": "compliance",

          "label": "Compliance",

          "route": "/hr/compliance"

        }

      ]

    },

    {

      "section": "Portals",

      "items": [

        {

          "id": "client_portal",

          "label": "Client Portal",

          "route": "/hr/client-portal"

        },

        {

          "id": "employee_portal",

          "label": "Employee Self-Service",

          "route": "/hr/employee-portal"

        }

      ]

    },

    {

      "section": "Intelligence",

      "items": [

        {

          "id": "analytics",

          "label": "Reports & Analytics",

          "route": "/hr/analytics"

        },

        {

          "id": "sonia",

          "label": "Sonia AI",

          "route": "/hr/sonia"

        }

      ]

    },

    {

      "section": "Administration",

      "items": [

        {

          "id": "workflow_configuration",

          "label": "Workflow Configuration",

          "route": "/hr/settings/workflows"

        },

        {

          "id": "hr_settings",

          "label": "HR Settings",

          "route": "/hr/settings"

        }

      ]

    }

  ],

  "lifecycle": {

    "name": "Workforce Lifecycle",

    "stages": [

      {

        "order": 1,

        "id": "request",

        "label": "Workforce Request"

      },

      {

        "order": 2,

        "id": "vacancy",

        "label": "Vacancy Activation"

      },

      {

        "order": 3,

        "id": "sourcing",

        "label": "Candidate Sourcing"

      },

      {

        "order": 4,

        "id": "screening",

        "label": "Screening"

      },

      {

        "order": 5,

        "id": "interview",

        "label": "Interview & Assessment"

      },

      {

        "order": 6,

        "id": "selection",

        "label": "Selection"

      },

      {

        "order": 7,

        "id": "verification",

        "label": "Background Verification"

      },

      {

        "order": 8,

        "id": "offer",

        "label": "Offer"

      },

      {

        "order": 9,

        "id": "onboarding",

        "label": "Digital Onboarding"

      },

      {

        "order": 10,

        "id": "compliance_check",

        "label": "Pre-Deployment Compliance"

      },

      {

        "order": 11,

        "id": "deployment_ready",

        "label": "Deployment Ready"

      },

      {

        "order": 12,

        "id": "activation",

        "label": "Employee Activation"

      },

      {

        "order": 13,

        "id": "deployment",

        "label": "Client Deployment"

      },

      {

        "order": 14,

        "id": "workforce_management",

        "label": "Workforce Management"

      },

      {

        "order": 15,

        "id": "performance",

        "label": "Performance"

      },

      {

        "order": 16,

        "id": "renewal_exit",

        "label": "Renewal, Transfer or Exit"

      }

    ]

  },

  "modules": {

    "command_center": {

      "route": "/hr",

      "title": "HR Command Center",

      "widgets": [

        "total_workforce",

        "open_vacancies",

        "candidates_in_pipeline",

        "interviews_today",

        "verification_pending",

        "employees_onboarding",

        "deployment_ready",

        "active_deployments",

        "payroll_exceptions",

        "open_hr_requests",

        "compliance_alerts",

        "contracts_expiring"

      ],

      "charts": [

        "workforce_by_client",

        "workforce_by_location",

        "recruitment_pipeline",

        "monthly_hiring_trend"

      ],

      "panels": [

        "pending_approvals",

        "recent_activity",

        "attention_required",

        "sonia_daily_brief"

      ],

      "primary_action": "new_workforce_request"

    },

    "workforce_requests": {

      "route": "/hr/workforce-requests",

      "views": [

        "table",

        "detail",

        "create"

      ],

      "statuses": [

        "draft",

        "submitted",

        "under_review",

        "approved",

        "recruiting",

        "partially_filled",

        "filled",

        "closed"

      ],

      "fields": [

        "request_id",

        "client",

        "job_title",

        "job_description",

        "quantity",

        "location",

        "employment_type",

        "required_skills",

        "experience",

        "salary_budget",

        "target_start_date",

        "special_requirements",

        "priority",

        "assigned_recruiter",

        "documents"

      ],

      "actions": [

        "save_draft",

        "submit",

        "approve",

        "reject",

        "assign_recruiter",

        "activate_vacancy"

      ]

    },

    "vacancies": {

      "route": "/hr/vacancies",

      "views": [

        "cards",

        "table",

        "detail"

      ],

      "statuses": [

        "draft",

        "active",

        "paused",

        "filled",

        "closed"

      ],

      "metrics": [

        "positions_required",

        "applications",

        "screened",

        "shortlisted",

        "interviewed",

        "selected",

        "filled"

      ],

      "actions": [

        "create",

        "publish",

        "pause",

        "edit",

        "assign_recruiter",

        "view_pipeline",

        "close"

      ]

    },

    "candidates": {

      "route": "/hr/candidates",

      "views": [

        "kanban",

        "table",

        "candidate_360"

      ],

      "pipeline": [

        "applied",

        "screening",

        "shortlisted",

        "interview",

        "assessment",

        "client_review",

        "selected",

        "verification",

        "offer",

        "onboarding"

      ],

      "profile_tabs": [

        "overview",

        "cv",

        "interviews",

        "assessments",

        "verification",

        "documents",

        "notes",

        "activity"

      ],

      "fields": [

        "candidate_id",

        "name",

        "email",

        "phone",

        "location",

        "experience",

        "education",

        "skills",

        "cv",

        "source",

        "role_applied",

        "recruiter",

        "current_stage"

      ],

      "actions": [

        "move_stage",

        "schedule_interview",

        "request_verification",

        "add_note",

        "upload_document",

        "reject",

        "move_to_talent_pool"

      ]

    },

    "interviews": {

      "route": "/hr/interviews",

      "views": [

        "calendar",

        "list",

        "scorecard"

      ],

      "fields": [

        "candidate",

        "vacancy",

        "interviewer",

        "date",

        "time",

        "format",

        "meeting_link",

        "status"

      ],

      "scorecard": {

        "criteria": [

          "communication",

          "technical_competence",

          "experience",

          "role_fit",

          "professionalism"

        ],

        "recommendations": [

          "strong_hire",

          "hire",

          "consider",

          "no_hire"

        ]

      },

      "actions": [

        "schedule",

        "reschedule",

        "cancel",

        "submit_scorecard",

        "recommend_candidate"

      ]

    },

    "verification": {

      "route": "/hr/verification",

      "statuses": [

        "awaiting_consent",

        "pending",

        "in_progress",

        "exception",

        "cleared",

        "failed"

      ],

      "checks": [

        "identity",

        "education",

        "employment",

        "references",

        "address",

        "other_required_checks"

      ],

      "case_tabs": [

        "overview",

        "identity",

        "education",

        "employment",

        "references",

        "exceptions",

        "documents",

        "activity"

      ],

      "actions": [

        "request_consent",

        "start_verification",

        "update_check",

        "add_finding",

        "escalate",

        "clear_candidate",

        "fail_verification"

      ]

    },

    "offers": {

      "route": "/hr/offers",

      "statuses": [

        "draft",

        "awaiting_approval",

        "approved",

        "sent",

        "accepted",

        "declined",

        "expired"

      ],

      "fields": [

        "candidate",

        "position",

        "client",

        "salary",

        "employment_type",

        "start_date",

        "offer_date",

        "expiry_date"

      ],

      "actions": [

        "generate_offer",

        "request_approval",

        "approve",

        "send",

        "record_acceptance",

        "record_decline"

      ],

      "accepted_trigger": "create_onboarding_case"

    },

    "onboarding": {

      "route": "/hr/onboarding",

      "views": [

        "dashboard",

        "list",

        "employee_onboarding"

      ],

      "statuses": [

        "not_started",

        "in_progress",

        "blocked",

        "under_review",

        "completed"

      ],

      "checklist": [

        "personal_details",

        "identification",

        "employment_contract",

        "bank_details",

        "tax_information",

        "pension_information",

        "benefits_information",

        "emergency_contact",

        "policy_acknowledgements",

        "certifications",

        "client_documents",

        "induction"

      ],

      "item_statuses": [

        "not_started",

        "submitted",

        "under_review",

        "approved",

        "rejected"

      ],

      "actions": [

        "request_document",

        "review_document",

        "approve_item",

        "reject_item",

        "send_reminder",

        "complete_onboarding"

      ]

    },

    "deployment_readiness": {

      "route": "/hr/deployment-readiness",

      "views": [

        "board",

        "table",

        "readiness_profile"

      ],

      "statuses": [

        "not_cleared",

        "pending_requirements",

        "ready_for_deployment",

        "deployed"

      ],

      "requirements": [

        "contract_signed",

        "identity_verified",

        "background_verification_cleared",

        "required_documents_complete",

        "bank_information_complete",

        "statutory_information_complete",

        "client_requirements_complete",

        "induction_completed",

        "deployment_location_confirmed",

        "reporting_manager_confirmed",

        "start_date_confirmed"

      ],

      "readiness_rule": {

        "type": "all_required_items_complete",

        "success_status": "ready_for_deployment"

      },

      "actions": [

        "view_missing_requirements",

        "send_reminder",

        "review",

        "approve_readiness",

        "activate_employee"

      ]

    },

    "employees": {

      "route": "/hr/employees",

      "views": [

        "directory",

        "employee_360"

      ],

      "statuses": [

        "active",

        "on_leave",

        "suspended",

        "reassignment",

        "exiting",

        "exited"

      ],

      "profile_tabs": [

        "overview",

        "assignment",

        "documents",

        "attendance",

        "timesheets",

        "payroll",

        "performance",

        "leave",

        "hr_requests",

        "compliance",

        "activity",

        "notes"

      ],

      "activation_mapping": {

        "candidate_profile": "employee_profile",

        "candidate_id": "employee_id",

        "client": "client_assignment",

        "role": "employee_role",

        "location": "deployment_location",

        "manager": "reporting_manager",

        "documents": "employee_documents"

      }

    },

    "deployments": {

      "route": "/hr/deployments",

      "views": [

        "client_summary",

        "deployment_board",

        "deployment_detail"

      ],

      "fields": [

        "employee",

        "client",

        "department",

        "location",

        "supervisor",

        "start_date",

        "end_date",

        "contract_type",

        "deployment_status"

      ],

      "actions": [

        "deploy_employee",

        "transfer_employee",

        "replace_employee",

        "extend_assignment",

        "end_assignment"

      ]

    },

    "attendance": {

      "route": "/hr/attendance",

      "views": [

        "daily",

        "weekly",

        "monthly",

        "exceptions"

      ],

      "statuses": [

        "present",

        "absent",

        "late",

        "leave",

        "remote",

        "exception"

      ]

    },

    "timesheets": {

      "route": "/hr/timesheets",

      "statuses": [

        "draft",

        "submitted",

        "pending_approval",

        "approved",

        "rejected",

        "locked"

      ],

      "actions": [

        "submit",

        "approve",

        "reject",

        "query",

        "lock"

      ]

    },

    "leave": {

      "route": "/hr/leave",

      "views": [

        "requests",

        "calendar",

        "balances"

      ],

      "statuses": [

        "draft",

        "submitted",

        "manager_review",

        "hr_review",

        "approved",

        "rejected",

        "cancelled"

      ],

      "workflow": [

        "employee",

        "supervisor",

        "hr",

        "completed"

      ]

    },

    "payroll_operations": {

      "route": "/hr/payroll",

      "type": "workflow_not_calculation_engine",

      "views": [

        "payroll_dashboard",

        "employee_inputs",

        "exceptions",

        "approvals",

        "handoff"

      ],

      "stages": [

        "timesheets",

        "payroll_inputs",

        "allowances",

        "deductions",

        "exception_review",

        "hr_review",

        "client_approval",

        "payroll_handoff",

        "payment_status"

      ],

      "statuses": [

        "not_ready",

        "ready",

        "exception",

        "awaiting_approval",

        "approved",

        "handed_off",

        "processed"

      ]

    },

    "service_desk": {

      "route": "/hr/service-desk",

      "categories": [

        "payroll_issue",

        "benefits",

        "leave",

        "contract",

        "workplace_complaint",

        "document_request",

        "manager_issue",

        "general_hr"

      ],

      "statuses": [

        "open",

        "assigned",

        "investigating",

        "awaiting_response",

        "resolved",

        "closed"

      ],

      "priorities": [

        "low",

        "medium",

        "high",

        "critical"

      ]

    },

    "performance": {

      "route": "/hr/performance",

      "modules": [

        "probation_reviews",

        "performance_reviews",

        "objectives",

        "kpis",

        "client_feedback",

        "improvement_plans",

        "development_actions"

      ],

      "cycle": [

        "objectives_set",

        "check_in",

        "manager_review",

        "employee_feedback",

        "final_review",

        "development_plan"

      ]

    },

    "compliance": {

      "route": "/hr/compliance",

      "categories": [

        "employment_contracts",

        "identity_documents",

        "tax",

        "pension",

        "health_benefits",

        "certifications",

        "background_checks",

        "client_requirements"

      ],

      "statuses": [

        "compliant",

        "expiring",

        "expired",

        "missing",

        "under_review"

      ],

      "alerts": [

        "30_days",

        "14_days",

        "7_days",

        "expired"

      ]

    },

    "client_portal": {

      "route": "/hr/client-portal",

      "visibility": "client_scoped",

      "modules": [

        "dashboard",

        "workforce_requests",

        "candidate_approvals",

        "active_workforce",

        "attendance",

        "timesheet_approvals",

        "payroll_approvals",

        "performance",

        "reports",

        "support_requests"

      ]

    },

    "employee_portal": {

      "route": "/hr/employee-portal",

      "visibility": "employee_scoped",

      "modules": [

        "dashboard",

        "my_assignment",

        "my_tasks",

        "attendance",

        "timesheets",

        "payroll_documents",

        "leave",

        "documents",

        "performance",

        "hr_requests",

        "announcements",

        "sonia"

      ]

    },

    "analytics": {

      "route": "/hr/analytics",

      "categories": {

        "recruitment": [

          "applications",

          "time_to_fill",

          "screening_conversion",

          "interview_conversion",

          "offer_acceptance"

        ],

        "workforce": [

          "headcount",

          "workforce_by_client",

          "workforce_by_location",

          "turnover",

          "absenteeism"

        ],

        "operations": [

          "onboarding_completion",

          "open_hr_cases",

          "case_resolution_time",

          "deployment_readiness"

        ],

        "compliance": [

          "compliance_rate",

          "expiring_documents",

          "expired_documents"

        ],

        "payroll": [

          "payroll_readiness",

          "exceptions",

          "approval_status"

        ]

      }

    },

    "sonia": {

      "route": "/hr/sonia",

      "name": "Sonia",

      "role": "HR Intelligence Assistant",

      "frontend_mode": "demo_assistant",

      "suggested_prompts": [

        "What requires my attention today?",

        "Which candidates are awaiting verification?",

        "Show employees whose onboarding is incomplete.",

        "Who is ready for deployment?",

        "Why are some employees not deployment-ready?",

        "Which client has the most open vacancies?",

        "Which contracts expire within the next 30 days?",

        "Summarize unresolved payroll issues.",

        "Which HR requests are overdue?",

        "Prepare today's HR management briefing."

      ]

    },

    "configuration": {

      "route": "/hr/settings",

      "configurable_items": [

        "recruitment_stages",

        "interview_templates",

        "scorecards",

        "verification_types",

        "onboarding_checklists",

        "deployment_requirements",

        "employee_fields",

        "leave_types",

        "approval_chains",

        "hr_request_categories",

        "compliance_requirements",

        "client_requirements",

        "notifications",

        "roles",

        "permissions"

      ]

    }

  },

  "automation_triggers": [

    {

      "event": "workforce_request_approved",

      "action": "create_vacancy"

    },

    {

      "event": "candidate_shortlisted",

      "action": "enable_interview_scheduling"

    },

    {

      "event": "candidate_selected",

      "action": "create_verification_case"

    },

    {

      "event": "verification_cleared",

      "action": "enable_offer_generation"

    },

    {

      "event": "offer_accepted",

      "action": "create_onboarding_case"

    },

    {

      "event": "onboarding_completed",

      "action": "run_deployment_readiness_check"

    },

    {

      "event": "deployment_requirements_completed",

      "action": "set_ready_for_deployment"

    },

    {

      "event": "employee_activated",

      "action": "create_employee_workspace"

    },

    {

      "event": "contract_nearing_expiry",

      "action": "create_compliance_alert"

    },

    {

      "event": "hr_request_overdue",

      "action": "escalate_request"

    },

    {

      "event": "timesheet_approved",

      "action": "mark_payroll_input_ready"

    }

  ],

  "employee_activation": {

    "trigger": "deployment_readiness_approved",

    "transition": "candidate_to_employee",

    "creates": [

      "employee_profile",

      "employee_id",

      "user_account",

      "client_assignment",

      "workspace_membership",

      "reporting_relationship",

      "role_permissions",

      "compliance_schedule",

      "performance_cycle",

      "payroll_workflow_profile"

    ],

    "handoff": {

      "from": "WoCOS HR Talent & Onboarding",

      "to": "WoCOS Core + WoCOS HR Workforce Operations"

    }

  },

  "frontend_components": [

    "sidebar",

    "top_navigation",

    "global_search",

    "command_center",

    "stat_cards",

    "tables",

    "kanban_boards",

    "profile_360",

    "progress_bars",

    "timeline",

    "status_badges",

    "forms",

    "drawers",

    "modals",

    "approval_panels",

    "document_viewer",

    "checklists",

    "calendars",

    "charts",

    "notifications",

    "activity_feed",

    "comment_threads",

    "filters",

    "saved_views",

    "sonia_panel"

  ],

  "global_status_logic": {

    "success": [

      "approved",

      "cleared",

      "completed",

      "ready_for_deployment",

      "active"

    ],

    "warning": [

      "pending",

      "under_review",

      "expiring",

      "awaiting_approval"

    ],

    "danger": [

      "rejected",

      "failed",

      "expired",

      "blocked",

      "critical"

    ],

    "neutral": [

      "draft",

      "not_started",

      "closed",

      "inactive"

    ]

  },

  "demo_data": {

    "label": "Illustrative Demo Data",

    "organization": "TeamAce",

    "metrics": {

      "total_workforce": 186,

      "open_vacancies": 14,

      "candidates_in_pipeline": 47,

      "onboarding": 11,

      "verification_pending": 8,

      "deployment_ready": 7,

      "payroll_exceptions": 6,

      "contracts_expiring": 12

    },

    "sample_candidate": {

      "name": "Sarah Adeyemi",

      "role": "Customer Service Executive",

      "client": "ABC Company",

      "location": "Lagos",

      "start_date": "2026-09-28",

      "verification": "cleared",

      "onboarding_percentage": 100,

      "documentation": "complete",

      "compliance": "cleared",

      "deployment_status": "ready_for_deployment"

    }

  },

  "frontend_build_priority": {

    "P0_demo_critical": [

      "hr_command_center",

      "workforce_requests",

      "vacancies",

      "candidate_kanban",

      "candidate_360",

      "interviews",

      "verification",

      "offers",

      "onboarding",

      "deployment_readiness",

      "employee_360",

      "client_deployments",

      "sonia"

    ],

    "P1_operational_depth": [

      "attendance",

      "timesheets",

      "payroll_operations",

      "compliance",

      "service_desk",

      "leave",

      "client_portal"

    ],

    "P2_complete_suite": [

      "performance",

      "employee_self_service",

      "analytics",

      "workflow_configuration",

      "advanced_automation"

    ]

  },

  "primary_demo_journey": [

    "HR Command Center",

    "New Workforce Request",

    "Vacancy Activation",

    "Candidate Pipeline",

    "Candidate 360",

    "Interview & Assessment",

    "Candidate Selection",

    "Background Verification",

    "Offer Acceptance",

    "Digital Onboarding",

    "Deployment Readiness",

    "Activate Employee",

    "Employee 360",

    "Client Deployment",

    "Workforce Operations",

    "Sonia Intelligence"

  ],

  "product_boundary": {

    "frontend_scope": "complete",

    "backend_scope": "progressive",

    "native_payroll_calculation_engine": false,

    "payroll_workflow_ui": true,

    "third_party_integrations": "future_or_customer_specific",

    "demo_capabilities": "must_be_identified_as_demo_or_proposed_where_not_operational"

  }

}

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/48932d3c-be52-495c-b9c6-05577ddbb22d).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
