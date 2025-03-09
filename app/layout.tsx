import type { Metadata, Viewport } from "next";
import { Rubik } from "next/font/google";
import Icon from "@mdi/react";
import { mdiGithub, mdiHeart } from "@mdi/js";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import Link from "@/components/Link";

import "./globals.css";
import styles from "./Layout.module.scss";
import themeStyles from "@/theme/theme.module.scss";
import clsx from "clsx";
import Providers from "@/components/Providers";

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
    <html lang="en" className={themeStyles.theme} data-theme="default">
      <Providers>
        <body className={clsx([styles.body, rubik.variable])}>
          {children}
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
