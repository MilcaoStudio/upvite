import type { ComponentType, SvelteComponent } from 'svelte';
import { writable } from 'svelte/store';
import Boundary from './Boundary.svelte';
const GUARDED_BLOCK_FNS = ['c', 'l', 'h', 'm', 'p', 'a', 'i', 'o', 'd'];

function guard(fn: Function, onError: (err: any)=>void) {
    return function guarded(...args: any[]) {
      try {
        return fn(...args);
      } catch (err) {
        onError(err);
      }
    };
}
 
export function createBoundary(Component: any) {
  if (Component.$$render) {
    let render = Component.$$render;
    Component.$$render = (result: any, props: any, bindings: any, slots: any) => {
      const error = writable(undefined);

      try {
        return render(result, { error, ...props }, bindings, slots);
      } catch (e: any) {
        error.set(e);
        return render(result, { error, ...props }, bindings, {});
      }
    };

    return Component;
  }

  return class ErrorBoundaryComponent extends Component {
    constructor(config: any) {
      const error = writable(undefined);

      config.props.$$slots.default = config.props.$$slots.default.map(
        (slot: ComponentType) => (...args: any[]) => {
          let guarded = guard(slot, error.set);
          let block = guarded(...args);

          if (block) {
            for (let fn of GUARDED_BLOCK_FNS) {
              if (block[fn]) block[fn] = guard(block[fn], error.set);
            }
          }

          return block;
        }
      );

      super(config);

      this.$$set({ error });
    }
  };
}

export const ErrorBoundary: ComponentType<SvelteComponent<{section: string}>> = createBoundary(Boundary);