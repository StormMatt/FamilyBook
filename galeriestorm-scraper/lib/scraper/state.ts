// Neutral singleton so both server.ts (cron) and API routes share the same flag
// without circular imports.

let _isRunning = false;
let _triggerFn: (() => Promise<void>) | null = null;

export function setIsRunning(val: boolean): void {
  _isRunning = val;
}

export function getIsRunning(): boolean {
  return _isRunning;
}

export function registerTrigger(fn: () => Promise<void>): void {
  _triggerFn = fn;
}

export async function triggerScrape(): Promise<void> {
  if (_triggerFn) await _triggerFn();
}
