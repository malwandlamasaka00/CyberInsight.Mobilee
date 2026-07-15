

import { api } from "../api/api";

const getSecurityStatus = (score, rating) => {
  const numericScore = Number(score);

  
  if (!isNaN(numericScore) && numericScore > 0) {
    if (numericScore >= 90) {
      return "Excellent";
    }
    if (numericScore >= 75) {
      return "Secure";
    }
    if (numericScore >= 60) {
      return "Fair";
    }
    if (numericScore >= 40) {
      return "Needs Improvement";
    }
    return "Critical";
  }

  
  const value = String(rating || "").toLowerCase();

  if (
    value.includes("secure") ||
    value.includes("safe") ||
    value.includes("good") ||
    value.includes("excellent")
  ) {
    return "Secure";
  }

  if (
    value.includes("warning") ||
    value.includes("medium") ||
    value.includes("improvement") ||
    value.includes("fair")
  ) {
    return "Needs Improvement";
  }

  if (
    value.includes("critical") ||
    value.includes("high") ||
    value.includes("danger") ||
    value.includes("poor")
  ) {
    return "Critical";
  }

  return "Unknown";
};

export const scanService = {
  async scan(url) {
    try { 
      console.log("URL SENT TO API:", url);
      const response = await api.post("/scans/", {
        url,
      });

      const data = response.data;

      // Helper function to normalize status
      const normalizeCheckStatus = (success, fallbackStatus = "Warning") => {
        if (success === true) return "Passed";
        if (success === false) return "Failed";
        return fallbackStatus;
      };

      // Helper function to get color based on status
      const getStatusColor = (status) => {
        switch(status) {
          case "Passed": return "#22c55e";
          case "Failed": return "#ef4444";
          case "Warning": return "#eab308";
          default: return "#64748b";
        }
      };

      const score = Number(data.security?.score ?? 0);
      const overallStatus = getSecurityStatus(
        data.security?.score,
        data.security?.rating
      );

      return {
        overallScore: score,
        overallStatus: overallStatus,

        checks: [
          {
            name: "URL Validation",
            icon: "security",
            status: data.url?.success ? "Passed" : "Failed",
            color: getStatusColor(data.url?.success ? "Passed" : "Failed"),
            details: data.url?.success
              ? `Valid URL: ${data.url.domain || "N/A"}`
              : "URL validation failed"
          },

          {
            name: "DNS",
            icon: "dns",
            status: data.dns?.success ? "Passed" : "Failed",
            color: getStatusColor(data.dns?.success ? "Passed" : "Failed"),
            details: data.dns?.success
              ? `IP Address: ${data.dns.ip_address || "N/A"}`
              : "DNS lookup failed"
          },

          {
            name: "SSL/TLS",
            icon: "security",
            status: data.ssl?.valid ? "Passed" : "Failed",
            color: getStatusColor(data.ssl?.valid ? "Passed" : "Failed"),
            details: data.ssl?.valid
              ? `Certificate valid. Expires in ${data.ssl.days_remaining || 0} days`
              : "SSL certificate invalid"
          },

          {
            name: "TLS Intelligence",
            icon: "security",
            status: data.tls_intelligence?.success ? "Passed" : "Warning",
            color: getStatusColor(data.tls_intelligence?.success ? "Passed" : "Warning"),
            details: data.tls_intelligence?.success
              ? data.tls_intelligence?.protocols?.tls13
                ? "TLS 1.3 supported"
                : "TLS 1.3 not supported"
              : "TLS intelligence check failed"
          },

          {
            name: "Security Headers",
            icon: "http",
            status: data.headers?.success ? "Passed" : "Warning",
            color: getStatusColor(data.headers?.success ? "Passed" : "Warning"),
            details: data.headers?.success
              ? "Security headers analysed"
              : "Security headers analysis failed"
          },

          {
            name: "Technologies",
            icon: "code",
            status: data.technology?.success ? "Passed" : "Warning",
            color: getStatusColor(data.technology?.success ? "Passed" : "Warning"),
            details: data.technology?.technologies?.length
              ? `${data.technology.technologies.length} technologies detected`
              : "No technologies detected"
          }
        ],

        raw: data
      };

    } catch (error) {
      console.error(
        "Scan failed:",
        error.response?.data || error.message
      );
      throw error;
    }
  },
};