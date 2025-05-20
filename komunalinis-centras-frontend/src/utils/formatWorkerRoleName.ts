export function formatWorkerRoleName(roleName: string): string {
  if (!roleName) return "";

  const cleanName = roleName.startsWith("worker_") 
    ? roleName.replace("worker_", "") 
    : roleName;

  return cleanName
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .trim();
}
