(function attachDemoDataSeeder(root) {
  const DEMO_SEEDED_BY = "nextmove-demo-data-seeder";
  const DEMO_VERSION = "demo-data-v1";
  const DEMO_BATCH_ID = "nextmove-demo-data-v1";

  function loadSampleData() {
    const existingJobs = RightForMeJobsAppliedStorage.getJobApplications();
    const realJobs = existingJobs.filter((job) => !isDemoRecord(job));
    const sampleJobs = createSampleJobs();

    RightForMeJobsAppliedStorage.replaceJobApplications([...realJobs, ...sampleJobs]);

    const vaultSeeded = seedProfileIfSafe();

    return {
      jobsAdded: sampleJobs.length,
      realJobsPreserved: realJobs.length,
      vaultSeeded,
    };
  }

  function clearDemoData() {
    const existingJobs = RightForMeJobsAppliedStorage.getJobApplications();
    const realJobs = existingJobs.filter((job) => !isDemoRecord(job));
    const removedJobs = existingJobs.length - realJobs.length;

    RightForMeJobsAppliedStorage.replaceJobApplications(realJobs);

    const vault = RightForMeCareerVault.getVault();
    const vaultCleared = isDemoRecord(vault);
    if (vaultCleared) {
      RightForMeCareerVault.replaceVault(RightForMeCareerVaultStorage.createDefaultVault());
    }

    return {
      jobsRemoved: removedJobs,
      realJobsPreserved: realJobs.length,
      vaultCleared,
    };
  }

  function createSampleJobs() {
    return [
      strongFitJob(),
      healthyStretchJob(),
      manufacturingContinuousImprovementJob(),
    ];
  }

  function createSampleProfile() {
    return {
      person: {
        name: "Mike Thompson",
        location: "Milwaukee, WI",
        email: "mike.thompson@example.com",
        phone: "414-555-0138",
      },
      roles: [
        {
          company: "Northstar Manufacturing",
          title: "Operations Transformation Lead",
          start: "2021",
          end: "Present",
          summary: "Led cross-functional transformation roadmap, improved delivery cadence, and coached plant leaders through process change.",
          demoData: demoMarker(),
        },
        {
          company: "Lakeview Systems",
          title: "Technical Program Manager",
          start: "2018",
          end: "2021",
          summary: "Coordinated software delivery, reporting workflows, stakeholder communication, and operational metrics across distributed teams.",
          demoData: demoMarker(),
        },
      ],
      skills: [
        "Operations transformation",
        "Change management",
        "Stakeholder communication",
        "Agile delivery",
        "Process improvement",
        "Metrics storytelling",
      ],
      tools: ["Power BI", "Jira", "SQL", "Excel", "Miro"],
      accomplishments: [
        "Improved delivery cadence by 30% by redesigning weekly operating reviews.",
        "Built Power BI dashboards that helped leaders identify bottlenecks and follow-up actions.",
        "Coached frontline managers through a plant-wide change management rollout.",
      ],
      demoData: demoMarker(),
    };
  }

  function strongFitJob() {
    return {
      id: "demo-job-operations-transformation-lead",
      company: "Atlas Components",
      roleTitle: "Agile Delivery Transformation Lead",
      jobUrl: "https://example.com/jobs/agile-delivery-transformation-lead",
      location: "Milwaukee, WI",
      salaryRange: "$118,000 - $142,000",
      workArrangement: "Hybrid",
      status: "Apply",
      fitScore: 88,
      fitRecommendation: "Apply",
      dateFound: "2026-07-01",
      dateApplied: "",
      followUpDate: "2026-07-10",
      resumeVersionPath: "",
      coverLetterPath: "",
      notes: "Strong fit. Follow up with metrics, transformation roadmap, and manufacturing leadership examples.",
      responsibilities: [
        "Lead operations transformation roadmap across manufacturing sites.",
        "Improve operating rhythm, delivery cadence, and KPI visibility.",
        "Coach plant leaders through process and behavior change.",
      ],
      requiredSkills: [
        "Operations transformation",
        "Change management",
        "Stakeholder communication",
        "Metrics-driven leadership",
      ],
      preferredSkills: ["Manufacturing operations", "Lean continuous improvement", "Agile delivery"],
      technologies: ["Power BI", "Jira", "Excel"],
      leadershipExpectations: ["Lead cross-functional teams", "Influence senior operations leaders"],
      certifications: ["Lean Six Sigma preferred"],
      yearsExperience: "7+ years",
      sourcePostingText: "Atlas Components is hiring an Agile Delivery Transformation Lead to guide manufacturing transformation, operating metrics, leader coaching, change management, Power BI reporting, Jira portfolio rhythms, and cross-functional execution.",
      fitAnalysis: fitAnalysis(88, "Apply", [
        "Strong match on transformation, operations, metrics, and change leadership.",
        "Profile / Story Bank includes manufacturing and Power BI evidence.",
      ], [
        "Prepare a concise Six Sigma certification answer if asked.",
      ], [
        "Role may expect formal Lean Six Sigma credentials.",
      ], "Lead with transformation roadmap, operating cadence, and measurable delivery improvements."),
      resumeDraft: resumeDraft("Atlas Components"),
      coverLetterDraft: coverLetterDraft("Atlas Components", "Agile Delivery Transformation Lead"),
      interviewPrep: {
        likelyQuestions: [
          "Tell us about a transformation roadmap you led.",
          "How do you handle leader resistance during operational change?",
        ],
        storiesToPrepare: ["Delivery cadence improvement", "Power BI operating dashboard", "Plant change rollout"],
        riskAreas: ["Formal Lean Six Sigma credential expectations"],
        salaryNotes: "Target range appears aligned with senior transformation work.",
        generatedAt: "2026-07-01T12:00:00.000Z",
        promptVersion: "demo-data-v1",
        modelName: "demo",
        userApproved: false,
      },
      demoData: demoMarker(),
    };
  }

  function healthyStretchJob() {
    return {
      id: "demo-job-ai-enablement-product-operations",
      company: "BrightForge AI",
      roleTitle: "AI Enablement Product Operations Manager",
      jobUrl: "https://example.com/jobs/ai-enablement-product-operations-manager",
      location: "Remote - US",
      salaryRange: "$130,000 - $160,000",
      workArrangement: "Remote",
      status: "Reviewing",
      fitScore: 66,
      fitRecommendation: "Maybe",
      dateFound: "2026-07-02",
      dateApplied: "",
      followUpDate: "",
      resumeVersionPath: "",
      coverLetterPath: "",
      notes: "Healthy stretch. Good operations and delivery match, but needs careful AI product positioning.",
      responsibilities: [
        "Coordinate AI product operating rhythms and launch readiness.",
        "Translate product, engineering, and customer feedback into execution plans.",
        "Build reporting for adoption, quality, and release health.",
      ],
      requiredSkills: ["Product operations", "Agile delivery", "Stakeholder management", "Data analysis"],
      preferredSkills: ["AI tooling", "Prompt evaluation", "SaaS product experience"],
      technologies: ["Jira", "SQL", "Looker", "LLM tools"],
      leadershipExpectations: ["Partner with product and engineering leaders", "Create clarity from ambiguity"],
      certifications: [],
      yearsExperience: "5+ years",
      sourcePostingText: "BrightForge AI seeks an AI Product Operations Manager to connect product, engineering, customer feedback, release readiness, Jira workflows, SQL reporting, AI tooling, and adoption metrics.",
      fitAnalysis: fitAnalysis(66, "Maybe", [
        "Strong match on operating rhythms, stakeholder management, delivery, and metrics.",
        "Technical delivery background can support product operations responsibilities.",
      ], [
        "AI product depth and prompt evaluation examples need preparation.",
        "SaaS product operations language should be sharpened.",
      ], [
        "Could be a stretch if they require deep AI product ownership.",
      ], "Position as an operations and delivery leader who can bring structure to AI product execution while learning product-specific depth quickly."),
      resumeDraft: resumeDraft("BrightForge AI"),
      coverLetterDraft: coverLetterDraft("BrightForge AI", "AI Enablement Product Operations Manager"),
      interviewPrep: {
        likelyQuestions: [
          "How have you supported product or engineering delivery?",
          "What AI tools have you used and how do you evaluate quality?",
        ],
        storiesToPrepare: ["Technical delivery coordination", "Metrics dashboard", "Ambiguous stakeholder alignment"],
        riskAreas: ["AI product operations vocabulary", "Direct SaaS ownership"],
        salaryNotes: "Compensation is attractive; verify expectations before investing heavily.",
        generatedAt: "2026-07-02T12:00:00.000Z",
        promptVersion: "demo-data-v1",
        modelName: "demo",
        userApproved: false,
      },
      demoData: demoMarker(),
    };
  }

  function manufacturingContinuousImprovementJob() {
    return {
      id: "demo-job-manufacturing-continuous-improvement-manager",
      company: "HarborWorks Precision",
      roleTitle: "Manufacturing Operations Continuous Improvement Manager",
      jobUrl: "https://example.com/jobs/manufacturing-continuous-improvement-manager",
      location: "Green Bay, WI",
      salaryRange: "$105,000 - $132,000",
      workArrangement: "On-site",
      status: "Applied",
      fitScore: 73,
      fitRecommendation: "Apply",
      dateFound: "2026-07-03",
      dateApplied: "2026-07-05",
      followUpDate: "2026-07-12",
      resumeVersionPath: "",
      coverLetterPath: "",
      notes: "Applied after tailoring the packet toward manufacturing operations, CI facilitation, and visible operating metrics. Follow up with plant director if no response.",
      responsibilities: [
        "Lead continuous improvement projects across machining and assembly lines.",
        "Coach supervisors on daily management, root cause problem solving, and KPI review.",
        "Partner with operations, quality, and maintenance to reduce downtime and rework.",
      ],
      requiredSkills: ["Manufacturing operations", "Lean continuous improvement", "Root cause analysis", "Frontline leader coaching"],
      preferredSkills: ["Value stream mapping", "OEE improvement", "Lean Six Sigma Green Belt"],
      technologies: ["Power BI", "Excel", "ERP reporting"],
      leadershipExpectations: ["Influence plant leaders", "Coach supervisors", "Coordinate cross-functional improvement teams"],
      certifications: ["Lean Six Sigma Green Belt preferred"],
      yearsExperience: "6+ years",
      sourcePostingText: "HarborWorks Precision needs a Manufacturing Operations Continuous Improvement Manager to lead Lean projects, coach supervisors, improve OEE, reduce rework, run daily management routines, use Power BI and Excel reporting, and partner across operations, quality, and maintenance.",
      fitAnalysis: fitAnalysis(73, "Apply", [
        "Strong operating rhythm, dashboard, and leader coaching evidence.",
        "Manufacturing transformation stories map well to CI facilitation and KPI review.",
      ], [
        "Prepare deeper examples around formal Lean tools and shop-floor problem solving.",
      ], [
        "On-site cadence may limit flexibility; verify travel and shift expectations.",
      ], "Position Mike as an operations transformation leader who makes improvement routines visible, measurable, and sustainable with frontline supervisors."),
      resumeDraft: resumeDraft("HarborWorks Precision"),
      coverLetterDraft: coverLetterDraft("HarborWorks Precision", "Manufacturing Operations Continuous Improvement Manager"),
      interviewPrep: {
        likelyQuestions: [
          "Tell us about a CI project that changed frontline behavior.",
          "How do you use metrics without turning daily management into a reporting exercise?",
        ],
        storiesToPrepare: ["Plant change rollout", "Power BI operating dashboard", "Supervisor coaching cadence"],
        riskAreas: ["Formal Lean tool depth", "On-site schedule expectations"],
        salaryNotes: "Range is reasonable for plant-facing CI leadership; clarify bonus and relocation expectations.",
        generatedAt: "2026-07-03T12:00:00.000Z",
        promptVersion: "demo-data-v1",
        modelName: "demo",
        userApproved: false,
      },
      demoData: demoMarker(),
    };
  }

  function fitAnalysis(score, recommendation, strengths, gaps, concerns, suggestedPositioning) {
    return {
      fitScore: score,
      recommendation,
      fitRecommendation: recommendation,
      strengths,
      gaps,
      concerns,
      suggestedPositioning,
      generatedAt: "2026-07-03T12:00:00.000Z",
      promptVersion: "demo-data-v1",
      modelName: "demo",
      userApproved: false,
    };
  }

  function resumeDraft(company) {
    return {
      tailoredSummary: `Operations and transformation leader positioned for ${company} with evidence in change management, metrics, and cross-functional delivery.`,
      tailoredSkills: ["Operations transformation", "Change management", "Stakeholder communication", "Power BI", "Agile delivery"],
      tailoredExperienceBullets: [
        "Led transformation roadmap and improved delivery cadence across cross-functional teams.",
        "Built reporting rhythms that made operational bottlenecks and follow-up actions visible.",
        "Coached leaders through process change while keeping work grounded in measurable outcomes.",
      ],
      markdownContent: `# Mike Thompson\n\nMilwaukee, WI | mike.thompson@example.com | 414-555-0138\n\n## Professional Summary\nOperations and transformation leader with experience in change management, metrics, stakeholder communication, and practical delivery improvement. Tailored for ${company} using demo Profile / Story Bank evidence only.\n\n## Skills & Tools\n- Operations transformation\n- Change management\n- Stakeholder communication\n- Power BI\n- Jira\n\n## Selected Accomplishments\n- Improved delivery cadence by 30% by redesigning weekly operating reviews.\n- Built Power BI dashboards that helped leaders identify bottlenecks and follow-up actions.\n`,
      markdownPreview: "",
      generatedAt: "2026-07-03T12:00:00.000Z",
      promptVersion: "demo-data-v1",
      modelName: "demo",
      userApproved: false,
    };
  }

  function coverLetterDraft(company, roleTitle) {
    return {
      coverLetterContent: `Dear ${company} team,\n\nI am interested in the ${roleTitle} role because it connects directly to my work leading transformation, improving operating rhythms, and helping teams turn metrics into practical action. My background includes change management, stakeholder communication, Power BI reporting, and cross-functional delivery improvement.\n\nI would welcome the chance to discuss how this experience could support ${company}'s goals.\n\nSincerely,\nMike Thompson`,
      draftText: "",
      toneNote: "Warm, friendly, confident, and practical.",
      generatedAt: "2026-07-03T12:00:00.000Z",
      promptVersion: "demo-data-v1",
      modelName: "demo",
      userApproved: false,
    };
  }

  function seedProfileIfSafe() {
    const vault = RightForMeCareerVault.getVault();
    if (!isVaultEmpty(vault) && !isDemoRecord(vault)) {
      return false;
    }

    RightForMeCareerVault.replaceVault(createSampleProfile());
    return true;
  }

  function isVaultEmpty(vault = {}) {
    return !String(vault.person?.name || "").trim()
      && !String(vault.person?.email || "").trim()
      && !(vault.roles || []).length
      && !(vault.skills || []).length
      && !(vault.tools || []).length
      && !(vault.accomplishments || []).length;
  }

  function demoMarker() {
    return {
      seededBy: DEMO_SEEDED_BY,
      version: DEMO_VERSION,
      batchId: DEMO_BATCH_ID,
      source: "demo",
    };
  }

  function isDemoRecord(record = {}) {
    return record.demoData?.seededBy === DEMO_SEEDED_BY
      || String(record.id || "").startsWith("demo-job-");
  }

  const api = {
    DEMO_SEEDED_BY,
    clearDemoData,
    createSampleJobs,
    createSampleProfile,
    isDemoRecord,
    loadSampleData,
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }

  root.NextMoveDemoDataSeeder = api;
})(typeof window !== "undefined" ? window : globalThis);
