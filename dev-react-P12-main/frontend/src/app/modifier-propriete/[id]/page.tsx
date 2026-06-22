"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "../../ajout-propriete/AjoutPropriete.module.css";
import { getApiBaseUrl } from "@/lib/config";
import { formatImageUrl } from "@/lib/galleryLogic";

interface ModifierProprietePageProps {
  params: Promise<{ id: string }>;
}

export default function ModifierProprietePage({ params }: ModifierProprietePageProps) {
  const router = useRouter();
  const { id: propertyId } = React.use(params);

  const [authorized, setAuthorized] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [zip, setZip] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");

  const [hostName, setHostName] = useState("");
  const [hostPictureUrl, setHostPictureUrl] = useState("");
  const [hostPictureName, setHostPictureName] = useState("");
  const [hostPictureUploading, setHostPictureUploading] = useState(false);

  const [coverUrl, setCoverUrl] = useState("");
  const [coverFileName, setCoverFileName] = useState("");
  const [coverUploading, setCoverUploading] = useState(false);

  const [propertyPictures, setPropertyPictures] = useState<Array<{ id: string; url: string; fileName: string; uploading: boolean }>>([
    { id: "1", url: "", fileName: "", uploading: false }
  ]);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedEquipments, setSelectedEquipments] = useState<string[]>([]);
  const [customTagInput, setCustomTagInput] = useState("");

  const [previewModalUrl, setPreviewModalUrl] = useState<string | null>(null);

  useEffect(() => {
    let parsed: any = null;
    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        router.push("/login");
        return;
      }
      parsed = JSON.parse(storedUser);
      if (parsed.role !== "owner" && parsed.role !== "admin") {
        router.push("/login");
        return;
      }
    } catch (e) {
      router.push("/login");
      return;
    }

    const fetchProperty = async () => {
      try {
        const res = await fetch(`${getApiBaseUrl()}/properties/${propertyId}`);
        if (!res.ok) {
          throw new Error("Impossible de charger les informations de cette annonce.");
        }
        const data = await res.json();

        const isAdmin = parsed && parsed.role === "admin";
        const isHost = parsed && data.host && (String(parsed.id) === String(data.host.id) || parsed.name === data.host.name);

        if (!isAdmin && !isHost) {
          router.push("/");
          return;
        }

        setAuthorized(true);

        setTitle(data.title || "");
        setDescription(data.description || "");
        setLocation(data.location || "");
        setPrice(data.price_per_night ? String(data.price_per_night) : "");

        if (data.cover) {
          setCoverUrl(data.cover);
          setCoverFileName(data.cover.split("/").pop() || "");
        }

        if (Array.isArray(data.pictures) && data.pictures.length > 0) {
          setPropertyPictures(
            data.pictures.map((url: string, index: number) => ({
              id: String(index + 1),
              url,
              fileName: url.split("/").pop() || "",
              uploading: false
            }))
          );
        }

        if (data.host) {
          setHostName(data.host.name || "");
          if (data.host.picture) {
            setHostPictureUrl(data.host.picture);
            setHostPictureName(data.host.picture.split("/").pop() || "");
          }
        }

        if (Array.isArray(data.equipments)) {
          setSelectedEquipments(data.equipments);
        }

        if (Array.isArray(data.tags)) {
          setSelectedCategories(data.tags);
        }
      } catch (err: any) {
        setError(err.message || "Impossible de charger le logement.");
      }
    };

    fetchProperty();
  }, [propertyId, router]);

  if (!authorized) {
    return (
      <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        Chargement...
      </div>
    );
  }

  const handleFileUpload = async (
    file: File,
    onSuccess: (url: string, fileName: string) => void,
    onStart: () => void,
    onEnd: () => void
  ) => {
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setError("La taille de l'image ne doit pas dépasser 5 Mo.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setError(null);
    onStart();

    const formData = new FormData();
    formData.append("file", file);
    formData.append("purpose", "property-picture");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${getApiBaseUrl()}/uploads/image`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Échec du téléversement.");
      }

      const data = await res.json();
      onSuccess(data.url, file.name);
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue lors du téléversement.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      onEnd();
    }
  };

  const handleAddPropertyPictureRow = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setPropertyPictures([
      ...propertyPictures,
      { id: Date.now().toString(), url: "", fileName: "", uploading: false }
    ]);
  };

  const handleRemovePropertyPictureRow = (id: string) => {
    if (propertyPictures.length <= 1) return;
    setPropertyPictures(propertyPictures.filter((p) => p.id !== id));
  };

  const handlePropertyPictureUpload = (id: string, file: File) => {
    handleFileUpload(
      file,
      (url, fileName) => {
        setPropertyPictures((prev) =>
          prev.map((p) => (p.id === id ? { ...p, url, fileName, uploading: false } : p))
        );
      },
      () => {
        setPropertyPictures((prev) =>
          prev.map((p) => (p.id === id ? { ...p, uploading: true } : p))
        );
      },
      () => {
        setPropertyPictures((prev) =>
          prev.map((p) => (p.id === id ? { ...p, uploading: false } : p))
        );
      }
    );
  };

  const triggerCoverFile = () => {
    const input = document.getElementById("cover-file-input") as HTMLInputElement;
    if (input) input.click();
  };

  const triggerHostFile = () => {
    const input = document.getElementById("host-file-input") as HTMLInputElement;
    if (input) input.click();
  };

  const toggleCategory = (cat: string) => {
    if (selectedCategories.includes(cat)) {
      setSelectedCategories(selectedCategories.filter((item) => item !== cat));
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  const handleAddCustomTag = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    const tag = customTagInput.trim();
    if (!tag) return;
    if (!selectedCategories.includes(tag)) {
      setSelectedCategories([...selectedCategories, tag]);
    }
    setCustomTagInput("");
  };

  const toggleEquipment = (eq: string) => {
    if (selectedEquipments.includes(eq)) {
      setSelectedEquipments(selectedEquipments.filter((item) => item !== eq));
    } else {
      setSelectedEquipments([...selectedEquipments, eq]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validationErrors: string[] = [];

    if (!title.trim()) validationErrors.push("Titre de la propriété");
    if (!description.trim()) validationErrors.push("Description");
    if (!location.trim()) validationErrors.push("Localisation");

    const parsedPrice = Number(price);
    if (!price || isNaN(parsedPrice) || parsedPrice <= 0) {
      validationErrors.push("Prix par nuit (doit être supérieur à 0 €)");
    }

    if (!coverUrl) {
      validationErrors.push("Image de couverture (requise via le bouton +)");
    }

    const uploadedPics = propertyPictures.map(p => p.url).filter(Boolean);
    if (uploadedPics.length === 0) {
      validationErrors.push("Images du logement (au moins une image requise via le bouton +)");
    }

    if (selectedEquipments.length === 0) {
      validationErrors.push("Équipements (sélectionnez au moins un équipement)");
    }

    if (validationErrors.length > 0) {
      setError(`Veuillez renseigner les champs obligatoires manquants ou invalides : ${validationErrors.join(", ")}.`);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const payload = {
        title: title.trim(),
        description: description.trim(),
        cover: coverUrl,
        location: location.trim(),
        price_per_night: parsedPrice,
        host: {
          name: hostName.trim() || "Hôte",
          picture: hostPictureUrl || null
        },
        equipments: selectedEquipments,
        pictures: uploadedPics,
        tags: selectedCategories
      };

      const res = await fetch(`${getApiBaseUrl()}/properties/${propertyId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Impossible de mettre à jour la propriété.");
      }

      window.location.href = `/logement/${propertyId}`;
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue lors de l'enregistrement de l'annonce.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const equipmentsLeft = [
    "Micro-Ondes", "Douche italienne", "Frigo", "WIFI", "Parking", "Sèche Cheveux",
    "Machine à laver", "Cuisine équipée", "Télévision", "Chambre Séparée", "Climatisation", "Frigo Américain"
  ];

  const equipmentsRight = [
    "Clic-clac", "Four", "Rangements", "Lit", "Bouilloire", "SDB",
    "Toilettes sèches", "Cintres", "Baie vitrée", "Hotte", "Baignoire", "Vue Parc"
  ];

  const categories = [
    "Parc", "Night Life", "Culture", "Nature", "Touristique",
    "Vue sur mer", "Pour les couples", "Famille", "Forêt"
  ];

  return (
    <div className={styles.pageContainer}>
      <main className={styles.mainContent}>

        <div className={styles.navigationRow}>
          <Link href={`/logement/${propertyId}`} className={styles.backButton}>
            &larr; Retour
          </Link>
        </div>

        {submitted ? (
          <div className={styles.successCard}>
            <div className={styles.successIcon}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" width="48" height="48">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0110.5 21a3.745 3.745 0 01-3.068-1.593 3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0110.5 3a3.745 3.745 0 013.068 1.593 3.746 3.746 0 013.296 1.043 3.745 3.745 0 011.043 3.296A3.745 3.745 0 0121 12z" />
              </svg>
            </div>
            <h2>Propriété modifiée avec succès !</h2>
            <p>Votre annonce a bien été mise à jour et est disponible immédiatement dans notre catalogue.</p>

            <div className={styles.successActions}>
              <Link href={`/logement/${propertyId}`} className={styles.viewAdBtn}>
                Voir mon annonce
              </Link>
              <Link href="/" className={styles.resetBtn}>
                Retour à l&apos;accueil
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.formContainer}>

            <div className={styles.titleRow}>
              <h1 className={styles.pageTitle}>Modifier la propriété</h1>
              <button type="submit" className={styles.submitBtn}>
                Enregistrer
              </button>
            </div>

            {error && <div className={styles.errorBanner}>{error}</div>}

            <div className={styles.dashboardGrid}>
              <div className={styles.leftCol}>
                <div className={styles.formCard}>
                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel} htmlFor="title">Titre de la propriété</label>
                    <input
                      type="text"
                      id="title"
                      className={styles.textInput}
                      placeholder="Ex : Appartement cosy au coeur de paris"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel} htmlFor="description">Description</label>
                    <textarea
                      id="description"
                      rows={6}
                      className={styles.textareaInput}
                      placeholder="Décrivez votre propriété en détail..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel} htmlFor="zip">Code postal</label>
                    <input
                      type="text"
                      id="zip"
                      className={styles.textInput}
                      placeholder="Ex : 75001"
                      value={zip}
                      onChange={(e) => setZip(e.target.value)}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel} htmlFor="location">Localisation</label>
                    <input
                      type="text"
                      id="location"
                      className={styles.textInput}
                      placeholder="Ex : Paris, France"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel} htmlFor="price">Prix par nuit (€)</label>
                    <input
                      type="number"
                      id="price"
                      min="1"
                      className={styles.textInput}
                      placeholder="Ex : 85"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </div>
                </div>

                <div className={styles.formCard}>
                  <h2 className={styles.sectionHeading}>Équipements</h2>
                  <div className={styles.checkboxGrid}>
                    <div className={styles.checkboxCol}>
                      {equipmentsLeft.map((eq, idx) => {
                        const inputId = `eq-left-${idx}`;
                        return (
                          <label key={idx} className={styles.checkboxLabel} htmlFor={inputId}>
                            <input
                              type="checkbox"
                              id={inputId}
                              className={styles.checkboxInput}
                              checked={selectedEquipments.includes(eq)}
                              onChange={() => toggleEquipment(eq)}
                            />
                            <span>{eq}</span>
                          </label>
                        );
                      })}
                    </div>
                    <div className={styles.checkboxCol}>
                      {equipmentsRight.map((eq, idx) => {
                        const inputId = `eq-right-${idx}`;
                        return (
                          <label key={idx} className={styles.checkboxLabel} htmlFor={inputId}>
                            <input
                              type="checkbox"
                              id={inputId}
                              className={styles.checkboxInput}
                              checked={selectedEquipments.includes(eq)}
                              onChange={() => toggleEquipment(eq)}
                            />
                            <span>{eq}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.rightCol}>
                <div className={styles.formCardRight}>
                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel} htmlFor="cover-file-input">Image de couverture</label>
                    <div className={styles.inputWithButtonRow}>
                      <input
                        type="text"
                        id="cover-text-input"
                        aria-label="Nom du fichier de l'image de couverture"
                        className={`${styles.textInput} ${coverUrl ? styles.clickableInput : ""}`}
                        readOnly
                        placeholder={coverUploading ? "Téléversement..." : "Cliquez sur + pour charger une image"}
                        value={coverFileName || (coverUrl ? coverUrl.split("/").pop() : "")}
                        onClick={() => coverUrl && setPreviewModalUrl(coverUrl)}
                        title={coverUrl ? "Cliquez pour prévisualiser" : ""}
                      />
                      <input
                        type="file"
                        id="cover-file-input"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleFileUpload(
                              file,
                              (url, fileName) => {
                                setCoverUrl(url);
                                setCoverFileName(fileName);
                              },
                              () => setCoverUploading(true),
                              () => setCoverUploading(false)
                            );
                          }
                        }}
                      />
                      <button
                        type="button"
                        className={styles.plusButton}
                        onClick={triggerCoverFile}
                        disabled={coverUploading}
                      >
                        {coverUploading ? "..." : "+"}
                      </button>
                    </div>
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel} htmlFor={`file-input-${propertyPictures[0]?.id}`}>Images du logement</label>
                    <div className={styles.propertyPicsContainer}>
                      {propertyPictures.map((pic) => (
                        <div key={pic.id} className={styles.inputWithButtonRow}>
                          <input
                            type="text"
                            id={`pic-text-input-${pic.id}`}
                            aria-label={`Nom du fichier de l'image du logement ${pic.id}`}
                            className={`${styles.textInput} ${pic.url ? styles.clickableInput : ""}`}
                            readOnly
                            placeholder={pic.uploading ? "Téléversement..." : "Cliquez sur + pour charger une image"}
                            value={pic.fileName || (pic.url ? pic.url.split("/").pop() : "")}
                            onClick={() => pic.url && setPreviewModalUrl(pic.url)}
                            title={pic.url ? "Cliquez pour prévisualiser" : ""}
                          />
                          <input
                            type="file"
                            id={`file-input-${pic.id}`}
                            aria-label={`Téléverser l'image du logement ${pic.id}`}
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handlePropertyPictureUpload(pic.id, file);
                              }
                            }}
                          />
                          <button
                            type="button"
                            className={styles.plusButton}
                            onClick={() => {
                              const input = document.getElementById(`file-input-${pic.id}`) as HTMLInputElement;
                              if (input) input.click();
                            }}
                            disabled={pic.uploading}
                          >
                            {pic.uploading ? "..." : "+"}
                          </button>
                          {propertyPictures.length > 1 && (
                            <button
                              type="button"
                              className={styles.deleteRowButton}
                              onClick={() => handleRemovePropertyPictureRow(pic.id)}
                              title="Supprimer cette ligne"
                            >
                              &times;
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      className={styles.addPicButton}
                      onClick={handleAddPropertyPictureRow}
                    >
                      + Ajouter une image
                    </button>
                  </div>
                </div>

                <div className={styles.formCardRight}>
                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel} htmlFor="hostName">Nom de l&apos;hôte</label>
                    <input
                      type="text"
                      id="hostName"
                      className={styles.textInput}
                      value={hostName}
                      onChange={(e) => setHostName(e.target.value)}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel} htmlFor="host-file-input">Photo de profil</label>
                    <div className={styles.inputWithButtonRow}>
                      <input
                        type="text"
                        id="host-picture-text-input"
                        aria-label="Nom du fichier de la photo de profil"
                        className={`${styles.textInput} ${hostPictureUrl ? styles.clickableInput : ""}`}
                        readOnly
                        placeholder={hostPictureUploading ? "Téléversement..." : "Cliquez sur + pour charger une image"}
                        value={hostPictureName || (hostPictureUrl ? hostPictureUrl.split("/").pop() : "")}
                        onClick={() => hostPictureUrl && setPreviewModalUrl(hostPictureUrl)}
                        title={hostPictureUrl ? "Cliquez pour prévisualiser" : ""}
                      />
                      <input
                        type="file"
                        id="host-file-input"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleFileUpload(
                              file,
                              (url, fileName) => {
                                setHostPictureUrl(url);
                                setHostPictureName(fileName);
                              },
                              () => setHostPictureUploading(true),
                              () => setHostPictureUploading(false)
                            );
                          }
                        }}
                      />
                      <button
                        type="button"
                        className={styles.plusButton}
                        onClick={triggerHostFile}
                        disabled={hostPictureUploading}
                      >
                        {hostPictureUploading ? "..." : "+"}
                      </button>
                    </div>
                  </div>
                </div>

                <div className={styles.formCard}>
                  <h2 className={styles.sectionHeading}>Catégories</h2>
                  <div className={styles.categoryTagsGrid}>
                    {categories.map((cat, idx) => {
                      const isSelected = selectedCategories.includes(cat);

                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => toggleCategory(cat)}
                          className={`${styles.categoryTag} ${isSelected ? styles.categoryTagActive : ''}`}
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel} htmlFor="custom-tag-input">Ajouter une catégorie personnalisée</label>
                    <div className={styles.inputWithButtonRow}>
                      <input
                        type="text"
                        id="custom-tag-input"
                        className={styles.textInput}
                        placeholder="Nouveau tag"
                        value={customTagInput}
                        onChange={(e) => setCustomTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddCustomTag();
                          }
                        }}
                      />
                      <button
                        type="button"
                        className={styles.plusButton}
                        onClick={handleAddCustomTag}
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      className={styles.addTagButton}
                      onClick={handleAddCustomTag}
                    >
                      + Ajouter un tag
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </form>
        )}

      </main>

      {previewModalUrl && (
        <div
          className={styles.previewModalOverlay}
          onClick={() => setPreviewModalUrl(null)}
        >
          <div className={styles.previewModalContent} onClick={(e) => e.stopPropagation()}>
            <button
              className={styles.previewModalClose}
              onClick={() => setPreviewModalUrl(null)}
            >
              &times;
            </button>
            <img
              src={formatImageUrl(previewModalUrl)}
              alt="Prévisualisation"
              className={styles.previewModalImg}
            />
          </div>
        </div>
      )}
    </div>
  );
}
