"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./Messagerie.module.css";

interface ChatItem {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: boolean;
}

interface Message {
  id: string;
  sender: "user" | "host";
  text: string;
  time: string;
  type?: "message" | "divider";
  dividerText?: string;
}

export default function MessageriePage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login");
      return;
    }
    try {
      const parsed = JSON.parse(storedUser);
      if (parsed) {
        setAuthorized(true);
      } else {
        router.push("/login");
      }
    } catch (e) {
      router.push("/login");
    }
  }, [router]);

  const [chats, setChats] = useState<ChatItem[]>([
    { id: "1", name: "Utilisateur", lastMessage: "Bonjour, votre appartement est-il disp...", time: "11:04 am", unread: true },
    { id: "2", name: "Utilisateur", lastMessage: "Bonjour, votre appartement est-il disp...", time: "11:04 am", unread: true },
    { id: "3", name: "Utilisateur", lastMessage: "Bonjour, votre appartement est-il disp...", time: "11:04 am", unread: true },
    { id: "4", name: "Utilisateur", lastMessage: "Bonjour, votre appartement est-il disp...", time: "11:04 am", unread: false },
    { id: "5", name: "Utilisateur", lastMessage: "Bonjour, votre appartement est-il disp...", time: "11:04 am", unread: false },
    { id: "6", name: "Utilisateur", lastMessage: "Bonjour, votre appartement est-il disp...", time: "11:04 am", unread: false },
    { id: "7", name: "Utilisateur", lastMessage: "Bonjour, votre appartement est-il disp...", time: "11:04 am", unread: false },
    { id: "8", name: "Utilisateur", lastMessage: "Bonjour, votre appartement est-il disp...", time: "11:04 am", unread: false },
  ]);

  const [activeChatId, setActiveChatId] = useState("1");

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "m1",
      sender: "host",
      text: "Bonjour, votre appartement est-il disponible pour le week-end du 12 au 14 octobre ?",
      time: "11:04 pm",
      type: "message"
    },
    {
      id: "m2",
      sender: "host",
      text: "Bonjour, votre appartement est-il disponible pour le week-end du 12 au 14 octobre ?",
      time: "11:04 pm",
      type: "message"
    },
    {
      id: "m3",
      sender: "user",
      text: "Bonjour, votre appartement est-il disponible pour le week-end du 12 au 14 octobre ?",
      time: "11:04 pm",
      type: "message"
    },
    {
      id: "div1",
      sender: "host",
      text: "",
      time: "",
      type: "divider",
      dividerText: "03 Septembre 2025"
    },
    {
      id: "m4",
      sender: "host",
      text: "Bonjour, votre appartement est-il disponible pour le week-end du 12 au 14 octobre ?",
      time: "11:04 pm",
      type: "message"
    },
    {
      id: "m5",
      sender: "user",
      text: "Bonjour, votre appartement est-il disponible pour le week-end du 12 au 14 octobre ?",
      time: "11:04 pm",
      type: "message"
    },
    {
      id: "m6",
      sender: "host",
      text: "Bonjour, votre appartement est-il disponible pour le week-end du 12 au 14 octobre ?",
      time: "11:04 pm",
      type: "message"
    }
  ]);

  const [inputText, setInputText] = useState("");

  if (!authorized) {
    return (
      <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        Chargement...
      </div>
    );
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg: Message = {
      id: Math.random().toString(),
      sender: "user",
      text: inputText,
      time: "11:04 pm",
      type: "message"
    };

    setMessages([...messages, newMsg]);
    setInputText("");
  };

  return (
    <div className={styles.container}>
      <main className={styles.inboxLayout}>

        <section className={styles.sidebar}>

          <div className={styles.sidebarHeader}>
            <Link href="/" className={styles.backButton}>
              ← Retour
            </Link>
            <h1 className={styles.mainTitle}>Messages</h1>
          </div>

          <div className={styles.chatList}>
            {chats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => setActiveChatId(chat.id)}
                className={`${styles.chatItem} ${chat.id === activeChatId ? styles.chatItemActive : ""}`}
              >
                <div className={styles.avatarSquare}></div>

                <div className={styles.chatMeta}>
                  <div className={styles.chatNameRow}>
                    <span className={styles.chatName}>{chat.name}</span>
                    <span className={styles.chatTime}>{chat.time}</span>
                  </div>

                  <div className={styles.chatPreviewRow}>
                    <p className={styles.lastMessage} title={chat.lastMessage}>
                      {chat.lastMessage}
                    </p>
                    {chat.unread && <span className={styles.unreadDot}></span>}
                  </div>
                </div>
              </button>
            ))}
          </div>

        </section>

        <section className={styles.chatWindow}>

          <div className={styles.messageArea}>
            {messages.map((msg) => {
              if (msg.type === "divider") {
                return (
                  <div key={msg.id} className={styles.dateDividerRow}>
                    <div className={styles.dividerLine}></div>
                    <span className={styles.dividerText}>{msg.dividerText}</span>
                    <div className={styles.dividerLine}></div>
                  </div>
                );
              }

              const isUser = msg.sender === "user";
              return (
                <div
                  key={msg.id}
                  className={`${styles.messageRow} ${isUser ? styles.rowUser : styles.rowHost}`}
                >
                  {!isUser && <div className={styles.chatAvatarSquare}></div>}

                  <div className={styles.bubbleContainer}>
                    <div className={`${styles.bubbleHeader} ${isUser ? styles.headerUser : styles.headerHost}`}>
                      <span className={styles.senderLabel}>Utilisateur</span>
                      <span className={styles.timeLabel}>• {msg.time}</span>
                    </div>

                    <div className={`${styles.bubble} ${isUser ? styles.bubbleUser : styles.bubbleHost}`}>
                      <p className={styles.bubbleText}>{msg.text}</p>
                    </div>
                  </div>

                  {isUser && <div className={styles.chatAvatarSquare}></div>}
                </div>
              );
            })}
          </div>

          <div className={styles.inputAreaContainer}>
            <form onSubmit={handleSendMessage} className={styles.inputFormBox}>
              <textarea
                placeholder="Envoyer un message"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className={styles.textAreaField}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
              />

              <button type="submit" className={styles.sendSquareBtn} aria-label="Envoyer">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={styles.arrowIcon}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
                </svg>
              </button>
            </form>
          </div>

        </section>

      </main>
    </div>
  );
}
