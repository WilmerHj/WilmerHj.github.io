/* tslint:disable */
/* eslint-disable */
export class FemSolver1D {
  free(): void;
  constructor(x_start: number, x_end: number, num_elements: number);
  assemble_poisson(): void;
  apply_dirichlet_zero(): void;
  solve_system(): void;
  assemble_pressure_problem(eta: number, u_velocity: number): void;
  solve_pressure_problem(eta: number, u_velocity: number): void;
  get_nodes(): Float64Array;
  get_solution(): Float64Array;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_femsolver1d_free: (a: number, b: number) => void;
  readonly femsolver1d_new: (a: number, b: number, c: number) => number;
  readonly femsolver1d_assemble_poisson: (a: number) => void;
  readonly femsolver1d_apply_dirichlet_zero: (a: number) => void;
  readonly femsolver1d_solve_system: (a: number) => void;
  readonly femsolver1d_assemble_pressure_problem: (a: number, b: number, c: number) => void;
  readonly femsolver1d_solve_pressure_problem: (a: number, b: number, c: number) => void;
  readonly femsolver1d_get_nodes: (a: number) => any;
  readonly femsolver1d_get_solution: (a: number) => any;
  readonly __wbindgen_export_0: WebAssembly.Table;
  readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
*
* @returns {InitOutput}
*/
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
