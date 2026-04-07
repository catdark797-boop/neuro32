"use client";

import { useEffect, useRef, useState } from "react";

interface TypewriterProps {
  texts: string[];
  speed?: number;
  className?: string;
}

export function Typewriter({ texts, speed = 70, className = "" }: TypewriterProps) {
  const [display, setDisplay] = useState("");
  const state = useRef({ ti: 0, ci: 0, del: false });

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    function tick() {
      const { ti, ci, del } = state.current;
      const t = texts[ti];

      if (!del) {
        setDisplay(t.slice(0, ci + 1));
        state.current.ci++;
        if (state.current.ci === t.length) {
          state.current.del = true;
          timeout = setTimeout(tick, 2000);
          return;
        }
      } else {
        setDisplay(t.slice(0, ci - 1));
        state.current.ci--;
        if (state.current.ci === 0) {
          state.current.del = false;
          state.current.ti = (ti + 1) % texts.length;
        }
      }
      timeout = setTimeout(tick, del ? speed / 2 : speed);
    }

    tick();
    return () => clearTimeout(timeout);
  }, [texts, speed]);

  return (
    <span className={className}>
      {display}
      <span
        style={{
          display: "inline-block", width: 2, height: "1em",
          background: "var(--blue)", marginLeft: 4,
          animation: "blink 1s step-end infinite",
          verticalAlign: "text-bottom",
        }}
      />
    </span>
  );
}
