"use client";

import React, { useState, useEffect } from "react";
import styles from "./Logement.module.css";

interface DeletePropertyButtonProps {
  propertyId: string;
  hostName?: string;
  hostId?: string | number;
}

export default function DeletePropertyButton({ propertyId, hostName, hostId }: DeletePropertyButtonProps) {
  const [isOwner, setIsOwner] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return;
    try {
      const user = JSON.parse(storedUser);
      const matchesId = hostId && String(user.id) === String(hostId);
      const matchesName = hostName && user.name === hostName;
      const isAdmin = user.role === "admin";

      if (matchesId || matchesName || isAdmin) {
        setIsOwner(true);
      }
    } catch (_) { }
  }, [hostName, hostId]);

  if (!isOwner) return null;

  const handleDelete = async () => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette annonce définitivement ?")) {
      return;
    }
    setDeleting(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3001/api/properties/${propertyId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Impossible de supprimer le logement.");
      }

      alert("L'annonce a été supprimée avec succès.");
      window.location.href = "/";
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue lors de la suppression.");
      setDeleting(false);
    }
  };

  const handleEdit = () => {
    window.location.href = `/modifier-propriete/${propertyId}`;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
      <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
        <button
          onClick={handleEdit}
          className={styles.editAdBtn}
          title="Modifier les détails de cette annonce"
        >
          Modifier l'annonce
        </button>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className={styles.deleteAdBtn}
          title="Supprimer cette annonce définitivement"
        >
          {deleting ? "Suppression..." : "Supprimer l'annonce"}
        </button>
      </div>
      {error && <span className={styles.deleteErrorText}>{error}</span>}
    </div>
  );
}
