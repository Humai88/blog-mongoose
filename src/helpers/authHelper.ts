
export const parseUserAgent = (userAgent: string): string => {
  if (userAgent.includes("Mozilla/5.0")) {
    if (userAgent.includes("Chrome")) return "Chrome Browser";
    if (userAgent.includes("Firefox")) return "Firefox Browser";
    if (userAgent.includes("Safari")) return "Safari Browser";
    if (userAgent.includes("Edge")) return "Edge Browser";
    if (userAgent.includes("Opera")) return "Opera Browser";
  }
  if (userAgent.includes("Mobile")) return "Mobile Device";
  return "Unknown Device";
  
}
