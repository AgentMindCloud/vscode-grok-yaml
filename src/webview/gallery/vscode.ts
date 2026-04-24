export interface VsCodeApi {
  postMessage: (msg: unknown) => void;
}

declare function acquireVsCodeApi(): VsCodeApi;

let cached: VsCodeApi | undefined;

export function getVsCodeApi(): VsCodeApi {
  if (!cached) {
    cached = acquireVsCodeApi();
  }
  return cached;
}
