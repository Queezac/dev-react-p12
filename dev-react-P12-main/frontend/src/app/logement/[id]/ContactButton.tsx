"use client";

import React from "react";
import { useRouter } from "next/navigation";
import styles from "./Logement.module.css";

export default function ContactButton() {
  const router = useRouter();

  const handleContact = () => {
    const user = localStorage.getItem("user");
    if (!user) {
      router.push("/login");
    } else {
      router.push("/messagerie");
    }
  };

  return (
    <button onClick={handleContact} className={styles.ctaButton}>
      Contacter l'hôte
    </button>
  );
}
