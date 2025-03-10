import clsx from "clsx";
import type { Metadata, Viewport } from "next";
import { Rubik } from "next/font/google";
import Icon from "@mdi/react";
import { mdiGithub, mdiHeart } from "@mdi/js";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import Link from "@/components/Link";
import Providers from "@/components/Providers";
import ThemeToggle from "@/components/ThemeToggle/ThemeToggle";
import themeStyles from "@/theme/theme.module.scss";

import "./globals.css";
import styles from "./Layout.module.scss";
import { Suspense } from "react";

const STAGE: string | undefined = process.env.STAGE;

const rubik = Rubik({
  variable: "--font-rubik-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PointDeck",
  description:
    "PointDeck is a free, real-time planning poker tool. Collaborate on estimates with interactive voting and instant results.",
};

export const viewport: Viewport = {
  initialScale: 1,
  width: "device-width",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={themeStyles.theme} data-theme="light">
      <Providers>
        <body className={clsx([styles.body, rubik.variable])}>
          <header className={styles.header}>
            <Suspense>
              <ThemeToggle />
            </Suspense>
          </header>
          <main>{children}</main>
          <footer className={styles.footer}>
            <Link href="https://github.com/TimMartin8745/pointdeck">
              <Icon
                path={mdiGithub}
                size={1.25}
                title={"View source code on Github"}
              />
            </Link>
            <Link
              className={styles.sponsor}
              href="https://github.com/sponsors/TimMartin8745"
            >
              <Icon path={mdiHeart} size={1.25} title={"Support me"} />
            </Link>
          </footer>
          {STAGE === "dev" && <ReactQueryDevtools initialIsOpen={false} />}
        </body>
      </Providers>
    </html>
  );
}
