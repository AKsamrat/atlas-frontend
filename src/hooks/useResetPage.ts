import { useState, useRef } from "react";

/**
 * Returns [page, setPage] that auto-resets to page 1
 * whenever `deps` change — without using an effect.
 *
 * Uses the React-recommended "adjust state during rendering" pattern:
 * https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
 */
export function useResetPage(
  deps: unknown[],
): [number, React.Dispatch<React.SetStateAction<number>>] {
  const [page, setPage] = useState(1);
  const prevDeps = useRef(deps);

  if (deps.some((d, i) => d !== prevDeps.current[i])) {
    setPage(1);
    prevDeps.current = deps;
  }

  return [page, setPage];
}
