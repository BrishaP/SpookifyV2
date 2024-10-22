"use client"; 

import React from "react";
import Image from "next/image";
import { Creepster } from 'next/font/google';
import Link from "next/link";
import styles from "../components/landing.module.css";

function Landing() {
  return (
    <div className={styles.container}>

      
        <h1 className={styles.spookifyTitle}>Spookify</h1>
        <p className={styles.tagline}>
          Eerie Engineers are here to help you this Halloween!
        </p>
        <h2 className={styles.fright}>Fright Done Right!</h2>
        <p className={styles.description}>
          Elevate your Halloween with our app, featuring AI as your expert advisor! 
          Discover tailored spooky recipes, fun DIY activities, and effortless party planning tips for a truly unforgettable celebration!
        </p>
        <Link href="/auth">
        <button className={styles.button}>Get Started</button>
      </Link>
      </div>
  );
}

export default Landing;
