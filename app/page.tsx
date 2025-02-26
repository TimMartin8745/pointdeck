import React from 'react';
import Link from 'next/link';
import styles from './Home.module.scss';

export default function Home() {
  return (
    <div className={styles.container}>
      <h1>Welcome to PointDeck</h1>
      <p>Your planning poker tool.</p>
      <Link href="/new">
      Create New Room
      </Link>
    </div>
  );
}
