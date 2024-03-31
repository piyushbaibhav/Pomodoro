import React, { useLayoutEffect, useRef, useEffect } from "react";
import gsap from "gsap";

export default function Navbar() {
  const comp = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      const t1 = gsap.timeline();
      t1.from("#intro-slider", {
        xPercent: "-100",
        duration: 0.5,
        delay: 0.3,
      })
        .from(["#title-1", "#title-2", "#title-3"], {
          opacity: 0,
          x: "+=30",
          stagger: 0.5,
        })
        // .to(["#title-1", "#title-2", "#title-3"], {
        //   opacity: 0,
        //   y: "-=30",
        //   delay: 0.3,
        //   stagger: 0.5,
        // })
        // .to("#intro-slider", {
        //   xPercent: "-100",
        //   duration: 1.3,
        // })
        // .from("#welcome", {
        //   opacity: 0,
        //   duration: 0.5,
        // });
    }, comp.current);

    return () => ctx.revert();
  }, []);

  return (
    <nav
      className="flex justify-between w-full p-4 h-4 bg-black text-white"
      ref={comp}
    >
      <h1
        className=" text-4xl font-medium underline underline-offset-[10px]"
        style={{ color: "rgb(206 255 252)" }}
        id="title-1"
      >
        Pomodoro{" "}
      </h1>
      <div
        className="flex justify-center pr-11 pb-11 z-10 mt-8"
        style={{ color: "rgb(255 173 212)" }}
        id="title-2"
      >
        <a
          className="mr-4"
          href="https://github.com/piyushbaibhav"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
        <a
          className="mr-4"
          href="https://www.linkedin.com/in/piyushbaibhav/"
          target="_blank"
          rel="noopener noreferrer"
        >
          LinkedIn
        </a>
        <a
          href="https://github.com/piyushbaibhav/Pomodoro"
          target="_blank"
          rel="noopener noreferrer"
        >
          Fork
        </a>
      </div>
    </nav>
  );
}
