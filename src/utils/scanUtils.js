export const getIssuesFoundCount = (scan) => {
  if (!Array.isArray(scan.checks)) return 0;

  return scan.checks.filter(check => {
    const status = String(check.status).toLowerCase();

    return status === "failed" || status === "warning";
  }).length;
};

export const getPassedChecksCount = (scan) => {
  if (!Array.isArray(scan.checks)) return 0;

  return scan.checks.filter(check =>
    String(check.status).toLowerCase() === "passed"
  ).length;
};