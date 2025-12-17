const warnedScopes = new Set<string>();

export function logWarnOnce(scope: string, message: string, error?: unknown) {
  const key = `${scope}:${message}`;
  if (warnedScopes.has(key)) return;
  warnedScopes.add(key);
  if (error) {
    console.warn(`[ACS][${scope}] ${message}`, error);
  } else {
    console.warn(`[ACS][${scope}] ${message}`);
  }
}
