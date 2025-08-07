"use client";

import styles from "./hero.module.css";
import Link from "next/link";
import { track } from "@vercel/analytics";
import {
  ImageSquare,
  ArrowLeft,
  ArrowSquareOut,
  Calendar,
  NavigationArrow
} from "phosphor-react";

const ICONS = {
  ImageSquare,
  ArrowLeft,
  ArrowSquareOut,
  Calendar,
  NavigationArrow
};

export default function AbstractHeroClient({ tagline, description, cta, seasonInfo }) {
  return (
    <div className={styles.cover}>
      <div className={styles.top}>
        <h1 className={styles.tagline}>{tagline}</h1>
        <div>
          <p className={styles.description}>{description}</p>
        </div>
      </div>

      <div className={styles.bottom}>
        {cta && (
          <div className={styles.cta}>
            {cta.description && <p>{cta.description}</p>}
            {Array.isArray(cta.buttons) && (
              <div className={styles.buttons}>
                {cta.buttons.map((button, index) => {
                  const href = typeof button.href === "string" ? button.href : "#";
                  const isExternal = href.startsWith("http");

                  const IconComp =
                    typeof button.icon === "string" ? ICONS[button.icon] : undefined;

                  const handleClick = () => {
                    if (button.trackEvent?.name) {
                      track(button.trackEvent.name, button.trackEvent.props || {});
                    }
                  };

                  return (
                    <Link
                      key={index}
                      href={href}
                      onClick={handleClick}
                      target={isExternal ? "_blank" : undefined}
                    >
                      {IconComp && <IconComp size={24} weight="bold" />}
                      {button.label}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {seasonInfo && (
          <div className={styles.seasonInfo}>
            <div className={styles.card}>
              {seasonInfo.title && <h2>{seasonInfo.title}</h2>}
              {seasonInfo.content && <p>{seasonInfo.content}</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
