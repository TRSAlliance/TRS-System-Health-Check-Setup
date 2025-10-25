module.exports = {
  endpoints: [
    { name: "TRS Alliance API", url: "https://trsalliance.org/api/health" },
    { name: "GhostShift Dashboard", url: "https://ghostshift.trsalliance.org/health" },
    { name: "Supabase", url: "https://your-supabase.supabase.co/rest/v1/", auth: "SUPABASE_SERVICE_KEY" },
    { name: "Firebase", url: "https://firestore.googleapis.com/v1/projects/trsalliance-d8c4c/databases/(default)/documents" }
  ],
  ignoreComponents: [
    "legacy-component",
    "tmp",
    "drafts"
  ],
  timeout: 20000,
  retries: 2,
  alerts: {
    enableEmail: false,
    enableSlack: false,
    recipients: []
  }
};
