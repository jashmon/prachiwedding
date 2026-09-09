"use client";

import { useCallback, useEffect, useRef } from "react";

type CharacterAction = "idle" | "wave" | "namaste" | "nod" | "celebrate";
type CharacterLook = "wedding" | "haldi" | "casual" | "gym";

export function CharacterPair({
  action,
  look = "wedding",
  className = "",
}: {
  action: CharacterAction;
  look?: CharacterLook;
  className?: string;
}) {
  const prachi = useRef<HTMLObjectElement>(null);
  const pratik = useRef<HTMLObjectElement>(null);

  const setPose = useCallback((object: HTMLObjectElement | null) => {
    const svg = object?.contentDocument?.documentElement;
    svg?.setAttribute("data-action", action);
    svg?.setAttribute("data-look", look);
  }, [action, look]);

  useEffect(() => {
    setPose(prachi.current);
    setPose(pratik.current);
  }, [setPose]);

  return (
    <div className={`character-pair ${className}`.trim()} aria-label={`Prachi and Pratik in a ${action} pose`}>
      <object ref={prachi} data="/characters/prachi.svg" type="image/svg+xml" onLoad={(event) => setPose(event.currentTarget)} tabIndex={-1} aria-hidden="true" />
      <object ref={pratik} data="/characters/pratik.svg" type="image/svg+xml" onLoad={(event) => setPose(event.currentTarget)} tabIndex={-1} aria-hidden="true" />
    </div>
  );
}
