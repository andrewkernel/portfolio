/* eslint-disable @next/next/no-img-element */
"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { desktopAssets } from "./design-assets";

const aboutAppIcon = "/windows-profile.svg";

const resumeFileIcon = "/adobe-acrobat.svg";

const musicAppIcon = "/groove-music.svg";

const projectsAppIcon = "/windows-file-explorer.png";

const chromeAppIcon = "/chrome-icon.png";

const githubAppIcon = "/github.png";

const mailAppIcon = "/mail.png";

const acknowledgementAppIcon = "/feedback-hub.svg";

const aboutPhotoCandidates = [
  "/mewing.JPG",
  "/mewing.jpg",
  "/dev site.png",
  "/about-me-photo.jpg",
  "/about-me-photo.jpeg",
  "/about-me-photo.png",
  "/about-me-photo.webp",
] as const;

const DESKTOP_SCALE = 0.8;

type WindowId = "portfolio" | "resume" | "music" | "projects" | "mail" | "acknowledgement";

type WindowMeta = {
  open: boolean;
  minimized: boolean;
  maximized: boolean;
  restoreX: number;
  restoreY: number;
  x: number;
  y: number;
  z: number;
};

type WindowMap = Record<WindowId, WindowMeta>;

type DragState = {
  id: WindowId;
  startX: number;
  startY: number;
  originX: number;
  originY: number;
};

const WINDOW_SIZE: Record<WindowId, { width: number; height: number }> = {
  portfolio: { width: 1240, height: 760 },
  resume: { width: 1020, height: 720 },
  music: { width: 960, height: 650 },
  projects: { width: 1120, height: 700 },
  mail: { width: 920, height: 560 },
  acknowledgement: { width: 760, height: 520 },
};

const INITIAL_WINDOWS: WindowMap = {
  portfolio: { open: false, minimized: false, maximized: false, restoreX: 80, restoreY: 28, x: 80, y: 28, z: 3 },
  resume: { open: false, minimized: false, maximized: false, restoreX: 140, restoreY: 44, x: 140, y: 44, z: 2 },
  music: { open: false, minimized: false, maximized: false, restoreX: 200, restoreY: 58, x: 200, y: 58, z: 1 },
  projects: { open: false, minimized: false, maximized: false, restoreX: 240, restoreY: 76, x: 240, y: 76, z: 0 },
  mail: { open: false, minimized: false, maximized: false, restoreX: 260, restoreY: 90, x: 260, y: 90, z: 0 },
  acknowledgement: { open: false, minimized: false, maximized: false, restoreX: 300, restoreY: 104, x: 300, y: 104, z: 0 },
};

export function Desktop() {
  const [windows, setWindows] = useState<WindowMap>(INITIAL_WINDOWS);
  const [wallpaperLoaded, setWallpaperLoaded] = useState(false);
  const dragRef = useRef<DragState | null>(null);
  const zRef = useRef(3);

  const openChrome = () => {
    window.open("https://www.google.com", "_blank", "noopener,noreferrer");
  };

  const openGithub = () => {
    window.open("https://github.com/andrewdang06", "_blank", "noopener,noreferrer");
  };

  const openAcknowledgement = () => {
    openWindow("acknowledgement");
  };

  const nextZ = () => {
    zRef.current += 1;
    return zRef.current;
  };

  const bringToFront = (id: WindowId) => {
    setWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], z: nextZ() },
    }));
  };

  const openWindow = (id: WindowId) => {
    const viewportWidth = window.innerWidth / DESKTOP_SCALE;
    const viewportHeight = (window.innerHeight - 48) / DESKTOP_SCALE;
    const { width, height } = WINDOW_SIZE[id];

    const centeredX = Math.max(0, (viewportWidth - width) / 2);
    const centeredY = Math.max(0, (viewportHeight - height) / 2);

    setWindows((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        open: true,
        minimized: false,
        x: prev[id].open ? prev[id].x : centeredX,
        y: prev[id].open ? prev[id].y : centeredY,
        maximized: prev[id].open ? prev[id].maximized : false,
        restoreX: prev[id].open ? prev[id].restoreX : centeredX,
        restoreY: prev[id].open ? prev[id].restoreY : centeredY,
        z: nextZ(),
      },
    }));
  };

  const toggleMaximizeWindow = (id: WindowId) => {
    setWindows((prev) => {
      const current = prev[id];
      const nowMaximized = !current.maximized;

      return {
        ...prev,
        [id]: {
          ...current,
          maximized: nowMaximized,
          x: nowMaximized ? 0 : current.restoreX,
          y: nowMaximized ? 0 : current.restoreY,
          restoreX: nowMaximized ? current.x : current.restoreX,
          restoreY: nowMaximized ? current.y : current.restoreY,
          z: nextZ(),
        },
      };
    });
  };

  const minimizeWindow = (id: WindowId) => {
    setWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], minimized: true },
    }));
  };

  const closeWindow = (id: WindowId) => {
    setWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], open: false, minimized: false, maximized: false },
    }));
  };

  const startDrag = (id: WindowId, event: MouseEvent<HTMLDivElement>) => {
    if (event.button !== 0) {
      return;
    }

    const current = windows[id];
    if (current.maximized) {
      return;
    }

    dragRef.current = {
      id,
      startX: event.clientX,
      startY: event.clientY,
      originX: current.x,
      originY: current.y,
    };

    bringToFront(id);
    event.preventDefault();
  };

  useEffect(() => {
    const handleMouseMove = (event: globalThis.MouseEvent) => {
      const drag = dragRef.current;
      if (!drag) {
        return;
      }

      const deltaX = event.clientX - drag.startX;
      const deltaY = event.clientY - drag.startY;

      setWindows((prev) => ({
        ...prev,
        [drag.id]: {
          ...prev[drag.id],
          x: Math.max(-220, drag.originX + deltaX / DESKTOP_SCALE),
          y: Math.max(0, drag.originY + deltaY / DESKTOP_SCALE),
          restoreX: Math.max(-220, drag.originX + deltaX / DESKTOP_SCALE),
          restoreY: Math.max(0, drag.originY + deltaY / DESKTOP_SCALE),
        },
      }));
    };

    const handleMouseUp = () => {
      dragRef.current = null;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <motion.section
      className="absolute inset-0 overflow-hidden bg-[#05070c]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className="absolute left-0 top-0"
        style={{
          width: `${100 / DESKTOP_SCALE}%`,
          height: `${100 / DESKTOP_SCALE}%`,
          transform: `scale(${DESKTOP_SCALE})`,
          transformOrigin: "top left",
        }}
      >
        <img
          alt=""
          className={`pointer-events-none absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
            wallpaperLoaded ? "opacity-100" : "opacity-0"
          }`}
          src="/windows background.jpeg"
          onLoad={() => setWallpaperLoaded(true)}
        />
        <div className="pointer-events-none absolute inset-0 bg-[rgba(5,13,25,0.04)]" />

        <div className="absolute left-[6px] top-[7px] bottom-[56px] z-[3] grid w-[92px] grid-cols-1 justify-items-start gap-[4px]">
          <DesktopIcon
            active={windows.portfolio.open && !windows.portfolio.minimized}
            label="About Me"
            src={aboutAppIcon}
            onClick={() => openWindow("portfolio")}
          />
          <DesktopIcon
            active={windows.resume.open && !windows.resume.minimized}
            label="Resume"
            src={resumeFileIcon}
            onClick={() => openWindow("resume")}
          />
          <DesktopIcon
            active={windows.music.open && !windows.music.minimized}
            label="Music"
            src={musicAppIcon}
            onClick={() => openWindow("music")}
          />
          <DesktopIcon
            active={windows.projects.open && !windows.projects.minimized}
            label="Projects"
            src={projectsAppIcon}
            onClick={() => openWindow("projects")}
          />
          <DesktopIcon
            active={windows.mail.open && !windows.mail.minimized}
            label="Mail"
            src={mailAppIcon}
            onClick={() => openWindow("mail")}
          />
          <DesktopIcon
            active={windows.acknowledgement.open && !windows.acknowledgement.minimized}
            label="Acknowledgement"
            src={acknowledgementAppIcon}
            onClick={() => openWindow("acknowledgement")}
          />
          <DesktopIcon
            label="Chrome"
            src={chromeAppIcon}
            onClick={openChrome}
          />
          <DesktopIcon
            label="GitHub"
            src={githubAppIcon}
            onClick={openGithub}
          />
        </div>

        <div className="pointer-events-none absolute inset-0 bottom-[48px] z-[8]">
          {windows.portfolio.open && !windows.portfolio.minimized ? (
            <div
              className={`pointer-events-auto absolute ${windows.portfolio.maximized ? "[&>*]:!h-full [&>*]:!w-full" : ""}`}
              style={{
                left: windows.portfolio.maximized ? 0 : windows.portfolio.x,
                top: windows.portfolio.maximized ? 0 : windows.portfolio.y,
                width: windows.portfolio.maximized ? "100%" : undefined,
                height: windows.portfolio.maximized ? "100%" : undefined,
                zIndex: windows.portfolio.z,
              }}
              onMouseDown={() => bringToFront("portfolio")}
            >
              <PortfolioWindow
                onClose={() => closeWindow("portfolio")}
                onMinimize={() => minimizeWindow("portfolio")}
                onMaximize={() => toggleMaximizeWindow("portfolio")}
                isMaximized={windows.portfolio.maximized}
                onTitleMouseDown={(event) => startDrag("portfolio", event)}
              />
            </div>
          ) : null}

          {windows.resume.open && !windows.resume.minimized ? (
            <div
              className={`pointer-events-auto absolute ${windows.resume.maximized ? "[&>*]:!h-full [&>*]:!w-full" : ""}`}
              style={{
                left: windows.resume.maximized ? 0 : windows.resume.x,
                top: windows.resume.maximized ? 0 : windows.resume.y,
                width: windows.resume.maximized ? "100%" : undefined,
                height: windows.resume.maximized ? "100%" : undefined,
                zIndex: windows.resume.z,
              }}
              onMouseDown={() => bringToFront("resume")}
            >
              <ResumeWindow
                onClose={() => closeWindow("resume")}
                onMinimize={() => minimizeWindow("resume")}
                onMaximize={() => toggleMaximizeWindow("resume")}
                isMaximized={windows.resume.maximized}
                onTitleMouseDown={(event) => startDrag("resume", event)}
              />
            </div>
          ) : null}

          {windows.music.open && !windows.music.minimized ? (
            <div
              className={`pointer-events-auto absolute ${windows.music.maximized ? "[&>*]:!h-full [&>*]:!w-full" : ""}`}
              style={{
                left: windows.music.maximized ? 0 : windows.music.x,
                top: windows.music.maximized ? 0 : windows.music.y,
                width: windows.music.maximized ? "100%" : undefined,
                height: windows.music.maximized ? "100%" : undefined,
                zIndex: windows.music.z,
              }}
              onMouseDown={() => bringToFront("music")}
            >
              <MusicWindow
                onClose={() => closeWindow("music")}
                onMinimize={() => minimizeWindow("music")}
                onMaximize={() => toggleMaximizeWindow("music")}
                isMaximized={windows.music.maximized}
                onTitleMouseDown={(event) => startDrag("music", event)}
              />
            </div>
          ) : null}

          {windows.projects.open && !windows.projects.minimized ? (
            <div
              className={`pointer-events-auto absolute ${windows.projects.maximized ? "[&>*]:!h-full [&>*]:!w-full" : ""}`}
              style={{
                left: windows.projects.maximized ? 0 : windows.projects.x,
                top: windows.projects.maximized ? 0 : windows.projects.y,
                width: windows.projects.maximized ? "100%" : undefined,
                height: windows.projects.maximized ? "100%" : undefined,
                zIndex: windows.projects.z,
              }}
              onMouseDown={() => bringToFront("projects")}
            >
              <ProjectsWindow
                onClose={() => closeWindow("projects")}
                onMinimize={() => minimizeWindow("projects")}
                onMaximize={() => toggleMaximizeWindow("projects")}
                isMaximized={windows.projects.maximized}
                onTitleMouseDown={(event) => startDrag("projects", event)}
              />
            </div>
          ) : null}

          {windows.mail.open && !windows.mail.minimized ? (
            <div
              className={`pointer-events-auto absolute ${windows.mail.maximized ? "[&>*]:!h-full [&>*]:!w-full" : ""}`}
              style={{
                left: windows.mail.maximized ? 0 : windows.mail.x,
                top: windows.mail.maximized ? 0 : windows.mail.y,
                width: windows.mail.maximized ? "100%" : undefined,
                height: windows.mail.maximized ? "100%" : undefined,
                zIndex: windows.mail.z,
              }}
              onMouseDown={() => bringToFront("mail")}
            >
              <MailWindow
                onClose={() => closeWindow("mail")}
                onMinimize={() => minimizeWindow("mail")}
                onMaximize={() => toggleMaximizeWindow("mail")}
                isMaximized={windows.mail.maximized}
                onTitleMouseDown={(event) => startDrag("mail", event)}
              />
            </div>
          ) : null}

          {windows.acknowledgement.open && !windows.acknowledgement.minimized ? (
            <div
              className={`pointer-events-auto absolute ${windows.acknowledgement.maximized ? "[&>*]:!h-full [&>*]:!w-full" : ""}`}
              style={{
                left: windows.acknowledgement.maximized ? 0 : windows.acknowledgement.x,
                top: windows.acknowledgement.maximized ? 0 : windows.acknowledgement.y,
                width: windows.acknowledgement.maximized ? "100%" : undefined,
                height: windows.acknowledgement.maximized ? "100%" : undefined,
                zIndex: windows.acknowledgement.z,
              }}
              onMouseDown={() => bringToFront("acknowledgement")}
            >
              <AcknowledgementWindow
                onClose={() => closeWindow("acknowledgement")}
                onMinimize={() => minimizeWindow("acknowledgement")}
                onMaximize={() => toggleMaximizeWindow("acknowledgement")}
                isMaximized={windows.acknowledgement.maximized}
                onTitleMouseDown={(event: MouseEvent<HTMLDivElement>) => startDrag("acknowledgement", event)}
              />
            </div>
          ) : null}
        </div>

        <DesktopTaskbar
          windows={windows}
          onOpenPortfolio={() => openWindow("portfolio")}
          onOpenResume={() => openWindow("resume")}
          onOpenMusic={() => openWindow("music")}
          onOpenProjects={() => openWindow("projects")}
          onOpenMail={() => openWindow("mail")}
          onOpenAcknowledgement={openAcknowledgement}
          onOpenChrome={openChrome}
          onOpenGithub={openGithub}
        />
      </div>
    </motion.section>
  );
}

type MailWindowProps = {
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  isMaximized: boolean;
  onTitleMouseDown: (event: MouseEvent<HTMLDivElement>) => void;
};

type AcknowledgementWindowProps = {
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  isMaximized: boolean;
  onTitleMouseDown: (event: MouseEvent<HTMLDivElement>) => void;
};

function AcknowledgementWindow({
  onClose,
  onMinimize,
  onMaximize,
  isMaximized,
  onTitleMouseDown,
}: AcknowledgementWindowProps) {
  const [ackCount, setAckCount] = useState(0);
  const [hasAcknowledged, setHasAcknowledged] = useState(false);

  return (
    <div className="relative h-[min(58vh,520px)] w-[min(760px,calc(125vw-80px))] overflow-hidden border border-[#434a56] bg-[#1f232a] shadow-[0_28px_72px_rgba(0,0,0,0.46)]">
      <div
        className="relative z-[2] flex h-[34px] cursor-grab select-none items-center justify-between border-b border-[#3b414c] bg-[#2a2f36] px-[10px] active:cursor-grabbing"
        onMouseDown={onTitleMouseDown}
      >
        <div className="flex items-center gap-[8px] text-[11px] uppercase tracking-[0.5px] text-[#e8edf5]">
          <img alt="" className="size-[13px] object-contain" src={acknowledgementAppIcon} />
          Acknowledgement.app
        </div>

        <div className="flex h-full items-stretch">
          <button
            type="button"
            className="flex w-[45px] items-center justify-center text-[#dbe3ef] transition-colors hover:bg-[#3a404a]"
            aria-label="Minimize"
            onMouseDown={(event) => event.stopPropagation()}
            onClick={onMinimize}
          >
            <span className="mb-[1px] text-[12px] leading-none">−</span>
          </button>
          <button
            type="button"
            className="flex w-[45px] items-center justify-center text-[#dbe3ef] transition-colors hover:bg-[#3a404a]"
            aria-label={isMaximized ? "Restore" : "Maximize"}
            onMouseDown={(event) => event.stopPropagation()}
            onClick={onMaximize}
          >
            <span className="text-[11px] leading-none">{isMaximized ? "❐" : "□"}</span>
          </button>
          <button
            type="button"
            className="flex w-[45px] items-center justify-center transition-colors hover:bg-[#e81123]"
            aria-label="Close"
            onMouseDown={(event) => event.stopPropagation()}
            onClick={onClose}
          >
            <span className="text-[11px] leading-none text-[#dbe3ef]">×</span>
          </button>
        </div>
      </div>

      <div className="relative z-[1] grid h-[calc(100%-34px)] grid-cols-[210px_1fr] bg-[#f4f4f4] text-[#222]">
        <aside className="border-r border-[#d4d4d4] bg-[#ededed] p-[16px] text-[13px] leading-[2.6] text-[#444]"><p className="text-[18px] font-semibold text-[#222]">Feedback Hub</p><p className="text-[#0067b8]">Home</p><p>Feedback</p><p>Quests</p><p>Achievements</p></aside>
        <div className="overflow-auto p-[28px]">
          <div className="mx-auto max-w-[520px]">
          <h2 className="text-[28px] font-semibold text-[#222]">Send feedback</h2>
          <p className="pt-[6px] text-[14px] text-[#555]">Let me know that you enjoyed the portfolio.</p>

          <button
            type="button"
            className="mt-[22px] w-full border border-[#0067b8] bg-[#0078d4] px-[18px] py-[14px] text-left text-[16px] font-semibold text-white hover:bg-[#106ebe]"
            onClick={() => {
              setAckCount((value) => value + 1);
              setHasAcknowledged(true);
            }}
          >
            I like this project
          </button>

          <div className="mt-[18px] flex w-full items-center justify-between border border-[#d4d4d4] bg-white px-[16px] py-[12px] text-[14px]">
            <span>Feedback submitted</span>
            <span className="text-[18px] font-semibold text-[#0067b8]">{ackCount}</span>
          </div>

          <div className="mt-[14px] min-h-[44px] w-full border border-[#b7d7bd] bg-[#eaf5ec] px-[16px] py-[12px] text-[14px] text-[#22662d]">
            {hasAcknowledged ? "You like the project/portfolio." : "Click the button above to show your support."}
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MailWindow({ onClose, onMinimize, onMaximize, isMaximized, onTitleMouseDown }: MailWindowProps) {
  const [fromEmail, setFromEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<{ type: "idle" | "success" | "error"; message: string }>({
    type: "idle",
    message: "",
  });

  const handleSend = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSending(true);
    setStatus({ type: "idle", message: "" });

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fromEmail, subject, message }),
      });

      const data = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !data.ok) {
        setStatus({ type: "error", message: data.error || "Failed to send email." });
        return;
      }

      setStatus({ type: "success", message: "Email sent successfully." });
      setSubject("");
      setMessage("");
    } catch {
      setStatus({ type: "error", message: "Unable to send. Please try again." });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="relative h-[min(64vh,560px)] w-[min(920px,calc(125vw-80px))] overflow-hidden border border-[#8a8a8a] bg-white shadow-[0_18px_48px_rgba(0,0,0,0.38)]">
      <div
        className="relative z-[2] flex h-[30px] cursor-grab select-none items-center justify-between border-b border-[#c8c8c8] bg-white px-[8px] active:cursor-grabbing"
        onMouseDown={onTitleMouseDown}
      >
        <div className="flex items-center gap-[6px] text-[11px] text-[#262626]">
          <img alt="" className="size-[13px] object-contain" src={mailAppIcon} />
          <span>New mail</span>
        </div>

        <div className="flex items-center gap-[2px]">
          <button
            type="button"
            className="flex h-[17px] w-[25px] items-center justify-center text-[#333] hover:bg-[#ededed]"
            aria-label="Minimize"
            onMouseDown={(event) => event.stopPropagation()}
            onClick={onMinimize}
          >
            <span className="mb-[2px] text-[12px] leading-none">-</span>
          </button>
          <button
            type="button"
            className="flex h-[17px] w-[25px] items-center justify-center text-[#333] hover:bg-[#ededed]"
            aria-label={isMaximized ? "Restore" : "Maximize"}
            onMouseDown={(event) => event.stopPropagation()}
            onClick={onMaximize}
          >
            <span className="text-[11px] leading-none">{isMaximized ? "❐" : "□"}</span>
          </button>
          <button
            type="button"
            className="flex h-[17px] w-[25px] items-center justify-center hover:bg-[#e81123] hover:text-white"
            aria-label="Close"
            onMouseDown={(event) => event.stopPropagation()}
            onClick={onClose}
          >
            <span className="text-[10px] leading-none">x</span>
          </button>
        </div>
      </div>

      <form className="h-[calc(100%-30px)]" onSubmit={handleSend}>
        <div className="border-b border-[#dedede] bg-[#f6f6f6] px-[10px] py-[7px]">
          <div className="flex items-center gap-[8px]">
            <button
              type="submit"
              disabled={sending}
              className="inline-flex items-center gap-[6px] bg-[#106ebe] px-[12px] py-[4px] text-[12px] text-white disabled:opacity-60"
            >
              <span className="text-[12px]">▶</span>
              {sending ? "Sending..." : "Send"}
            </button>
            <span className="text-[12px] text-[#666]">From:</span>
            <input
              type="email"
              value={fromEmail}
              onChange={(event) => setFromEmail(event.target.value)}
              placeholder="your@email.com"
              className="h-[24px] w-[280px] border border-[#c8c8c8] bg-white px-[8px] text-[12px] text-[#222] outline-none"
              required
            />
          </div>
        </div>

        <div className="border-b border-[#dedede] bg-white text-[#222]">
          <div className="flex items-center border-b border-[#dedede] px-[10px] py-[7px]">
            <span className="w-[48px] text-[12px] text-[#666]">To</span>
            <span className="text-[12px] text-[#222]">andrewdangbusiness@gmail.com</span>
            <div className="ml-auto flex gap-[10px] text-[11px] text-[#0078d4]">
              <span>Cc</span>
              <span>Bcc</span>
            </div>
          </div>
          <div className="flex items-center border-b border-[#dedede] px-[10px] py-[7px]">
            <label htmlFor="mail-subject" className="w-[78px] text-[12px] text-[#666]">
              Add a subject
            </label>
            <input
              id="mail-subject"
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              className="w-full bg-transparent px-[4px] py-[2px] text-[12px] text-[#222] outline-none"
              required
            />
          </div>
        </div>

        <div className="h-[calc(100%-140px)] bg-white p-[10px]">
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Write your message"
            className="h-full w-full resize-none border border-[#d3d3d3] bg-white p-[8px] text-[13px] text-[#222] outline-none"
            required
          />
        </div>

        {status.type !== "idle" ? (
          <div
            className={`border-t px-[10px] py-[6px] text-[12px] ${
              status.type === "success"
                ? "border-[#cfead7] bg-[#edf9f1] text-[#136f2f]"
                : "border-[#f3d2d2] bg-[#fdf0f0] text-[#a61d24]"
            }`}
          >
            {status.message}
          </div>
        ) : null}
      </form>
    </div>
  );
}

type ProjectsWindowProps = {
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  isMaximized: boolean;
  onTitleMouseDown: (event: MouseEvent<HTMLDivElement>) => void;
};

function ProjectsWindow({ onClose, onMinimize, onMaximize, isMaximized, onTitleMouseDown }: ProjectsWindowProps) {
  const projects = [
    {
      name: "EleSynth",
      stack: "Claude, Codex, Next.js, FastAPI, SciPy, Librosa, Gemini API",
      repo: "",
      image: "/project-elesynth.png",
      bullets: [
        "Built a full-stack bioacoustics workbench to isolate elephant vocalizations from noisy field recordings using STFT and harmonic-percussive separation.",
        "Designed a FastAPI backend with DSP pipelines (NumPy, SciPy, Librosa) to process WAV inputs into cleaned audio, spectrogram visualizations, and structured metadata outputs.",
      ],
    },
    {
      name: "Network Optimization Agent",
      stack: "Batch, PowerShell, WMI, iPerf, Test Agents, Codex",
      repo: "",
      image: "/project-network-optimization-agent.png",
      bullets: [
        "Developed an automated diagnostic agent using Batch and PowerShell to scan local environments and safely evaluate optimization settings for latency reduction.",
        "Engineered network test agents using WMI and iPerf to continuously monitor packet flow, validate configuration improvements, and support reliable real-time data transmission.",
      ],
    },
  ];

  return (
    <div className="relative h-[min(74vh,700px)] w-[min(1120px,calc(125vw-80px))] overflow-hidden border border-[#8a8a8a] bg-white shadow-[0_18px_48px_rgba(0,0,0,0.38)]">

      <div
        className="relative z-[2] flex h-[30px] cursor-grab select-none items-center justify-between border-b border-[#c8c8c8] bg-white px-[8px] active:cursor-grabbing"
        onMouseDown={onTitleMouseDown}
      >
        <div className="flex items-center gap-[7px] text-[11px] text-[#222]">
          <img alt="" className="size-[13px] object-contain" src={projectsAppIcon} />
          Projects - File Explorer
        </div>

        <div className="flex h-full items-stretch">
          <button
            type="button"
            className="flex w-[45px] items-center justify-center text-[#dbe3ef] transition-colors hover:bg-[#3a404a]"
            aria-label="Minimize"
            onMouseDown={(event) => event.stopPropagation()}
            onClick={onMinimize}
          >
            <span className="mb-[1px] text-[12px] leading-none">−</span>
          </button>
          <button
            type="button"
            className="flex w-[45px] items-center justify-center text-[#dbe3ef] transition-colors hover:bg-[#3a404a]"
            aria-label={isMaximized ? "Restore" : "Maximize"}
            onMouseDown={(event) => event.stopPropagation()}
            onClick={onMaximize}
          >
            <span className="text-[11px] leading-none">{isMaximized ? "❐" : "□"}</span>
          </button>
          <button
            type="button"
            className="flex w-[45px] items-center justify-center transition-colors hover:bg-[#e81123]"
            aria-label="Close"
            onMouseDown={(event) => event.stopPropagation()}
            onClick={onClose}
          >
            <span className="text-[11px] leading-none text-[#dbe3ef]">×</span>
          </button>
        </div>
      </div>

      <div className="relative z-[1] h-[calc(100%-30px)] bg-white text-[#222]">
        <div className="flex h-[34px] items-center gap-[14px] border-b border-[#dedede] bg-[#fafafa] px-[12px] text-[12px] text-[#444]">
          <span className="text-[#1b78bf]">File</span><span>Home</span><span>Share</span><span>View</span>
        </div>
        <div className="flex h-[34px] items-center border-b border-[#dedede] px-[12px] text-[12px] text-[#555]">
          This PC &gt; Portfolio &gt; Projects
        </div>
        <div className="grid h-[calc(100%-68px)] grid-cols-[170px_1fr]">
          <div className="border-r border-[#dedede] bg-[#f7f7f7] px-[12px] py-[12px] text-[12px] leading-[2] text-[#444]">
            <p className="font-semibold">Quick access</p>
            <p>Desktop</p><p>Documents</p><p>Downloads</p><p className="font-semibold">This PC</p><p>Projects</p>
          </div>
          <div className="overflow-auto p-[18px]">
        <div className="mx-auto grid max-w-[860px] gap-[14px]">
          {projects.map((project) => (
            <section
              key={project.name}
              className="overflow-hidden border border-[#d5d5d5] bg-white"
            >
              <div className="grid min-h-[250px] grid-cols-[48%_1fr]">
                <div className="relative border-r border-[#dedede] bg-[#f4f4f4]">
                  <img
                    alt={`${project.name} project preview`}
                    className="h-full w-full object-cover"
                    src={project.image}
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,8,14,0)_45%,rgba(5,8,14,0.42)_100%)]" />
                </div>

                <div className="p-[18px]">
                  <div className="flex flex-wrap items-center justify-between gap-[10px]">
                    <h3 className="text-[20px] text-[#222]">{project.name}</h3>
                    {project.repo ? (
                      <a
                        href={project.repo}
                        target="_blank"
                        rel="noreferrer"
                        className="border border-[#5aa7dc] px-[10px] py-[5px] text-[11px] uppercase tracking-[0.7px] text-[#9fd9ff] hover:bg-[rgba(90,167,220,0.16)]"
                      >
                        View Repo
                      </a>
                    ) : null}
                  </div>

                  <p className="pt-[8px] text-[12px] text-[#3676a6]">{project.stack}</p>

                  <ul className="list-disc space-y-[8px] pl-[18px] pt-[14px] text-[13px] leading-[1.58] text-[#555]">
                    {project.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          ))}
        </div>
          </div>
        </div>
      </div>
    </div>
  );
}

type MusicWindowProps = {
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  isMaximized: boolean;
  onTitleMouseDown: (event: MouseEvent<HTMLDivElement>) => void;
};

type SpotifyTrack = {
  title: string;
  artist: string;
  query: string;
  trackId: string | null;
  durationMs: number | null;
};

function getSpotifyOpenUrl(track: SpotifyTrack | null) {
  if (!track) {
    return null;
  }

  if (track.trackId) {
    return `https://open.spotify.com/track/${track.trackId}`;
  }

  const searchTerm = encodeURIComponent(`${track.title} ${track.artist}`);
  return `https://open.spotify.com/search/${searchTerm}`;
}

function formatDuration(durationMs: number | null) {
  if (!durationMs || durationMs <= 0) {
    return "--:--";
  }

  const totalSeconds = Math.floor(durationMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function MusicWindow({ onClose, onMinimize, onMaximize, isMaximized, onTitleMouseDown }: MusicWindowProps) {
  const [tracks, setTracks] = useState<SpotifyTrack[]>([]);
  const [selectedTrack, setSelectedTrack] = useState<SpotifyTrack | null>(null);
  const [isLoadingTracks, setIsLoadingTracks] = useState(true);

  useEffect(() => {
    const loadTracks = async () => {
      try {
        const response = await fetch("/api/spotify/tracks", { cache: "no-store" });
        const payload = (await response.json()) as {
          ok?: boolean;
          tracks?: SpotifyTrack[];
          error?: string;
        };

        if (!response.ok || !payload.ok || !payload.tracks) {
          setIsLoadingTracks(false);
          return;
        }

        setTracks(payload.tracks);
        setSelectedTrack(payload.tracks[0] || null);
      } catch {
        setTracks([]);
      } finally {
        setIsLoadingTracks(false);
      }
    };

    void loadTracks();
  }, []);

  return (
    <div className="relative h-[min(72vh,650px)] w-[min(960px,calc(125vw-80px))] overflow-hidden border border-[#161616] bg-[#121212] shadow-[0_18px_48px_rgba(0,0,0,0.48)]">

      <div
        className="relative z-[2] flex h-[34px] cursor-grab select-none items-center justify-between border-b border-[#2a2a2a] bg-[#191919] px-[10px] active:cursor-grabbing"
        onMouseDown={onTitleMouseDown}
      >
        <div className="flex items-center gap-[8px] text-[11px] text-white">
          <img alt="" className="size-[13px] object-contain" src={musicAppIcon} />
          Spotify
        </div>

        <div className="flex h-full items-stretch">
          <button
            type="button"
            className="flex w-[45px] items-center justify-center text-[#dbe3ef] transition-colors hover:bg-[#3a404a]"
            aria-label="Minimize"
            onMouseDown={(event) => event.stopPropagation()}
            onClick={onMinimize}
          >
            <span className="mb-[1px] text-[12px] leading-none">−</span>
          </button>
          <button
            type="button"
            className="flex w-[45px] items-center justify-center text-[#dbe3ef] transition-colors hover:bg-[#3a404a]"
            aria-label={isMaximized ? "Restore" : "Maximize"}
            onMouseDown={(event) => event.stopPropagation()}
            onClick={onMaximize}
          >
            <span className="text-[11px] leading-none">{isMaximized ? "❐" : "□"}</span>
          </button>
          <button
            type="button"
            className="flex w-[45px] items-center justify-center transition-colors hover:bg-[#e81123]"
            aria-label="Close"
            onMouseDown={(event) => event.stopPropagation()}
            onClick={onClose}
          >
            <span className="text-[11px] leading-none text-[#dbe3ef]">×</span>
          </button>
        </div>
      </div>

      <div className="relative z-[1] grid h-[calc(100%-34px)] grid-cols-[190px_1fr] bg-[#121212]">
        <aside className="border-r border-[#252525] bg-[#090909] p-[16px] text-[13px] text-[#b3b3b3]">
          <div className="flex items-center gap-[8px] text-[20px] font-semibold text-white"><span className="text-[#1ed760]">●</span> Spotify</div>
          <div className="mt-[26px] space-y-[14px]"><p className="text-white">⌂ Home</p><p>⌕ Search</p><p>▤ Your Library</p></div>
          <div className="mt-[28px] space-y-[10px] border-t border-[#282828] pt-[16px] text-[12px]"><p>Liked Songs</p><p>Discover Weekly</p><p>Andrew&apos;s picks</p></div>
        </aside>
        <div className="flex min-h-0 flex-col">
          <div className="bg-[linear-gradient(180deg,#263b2d_0%,#181818_100%)] px-[24px] pb-[18px] pt-[22px]">
            <p className="text-[12px] font-semibold text-white">PLAYLIST</p>
            <h2 className="pt-[4px] text-[36px] font-bold text-white">Andrew&apos;s top picks</h2>
            <p className="pt-[4px] text-[13px] text-[#b3b3b3]">A few tracks I keep coming back to.</p>
            {!isLoadingTracks && selectedTrack ? (
              <a href={getSpotifyOpenUrl(selectedTrack) || undefined} target="_blank" rel="noreferrer" className="mt-[14px] inline-flex rounded-full bg-[#1ed760] px-[18px] py-[8px] text-[12px] font-semibold text-black hover:bg-[#2ee56f]">Play in Spotify</a>
            ) : null}
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto px-[20px] py-[12px]">
            <div className="grid grid-cols-[34px_1fr_100px] border-b border-[#343434] px-[10px] pb-[8px] text-[11px] uppercase text-[#b3b3b3]"><span>#</span><span>Title</span><span>Duration</span></div>
            {tracks.map((song, index) => (
              <button
                key={song.query}
                type="button"
                className={`grid w-full grid-cols-[34px_1fr_100px] items-center px-[10px] py-[10px] text-left transition-colors ${
                  selectedTrack?.query === song.query
                    ? "bg-[#2a2a2a]"
                    : "hover:bg-[#242424]"
                }`}
                onClick={() => setSelectedTrack(song)}
              >
                <span className="text-[12px] text-[#b3b3b3]">{index + 1}</span>
                <div className="min-w-0">
                  <div className="min-w-0">
                    <p className="truncate text-[14px] text-white">{song.title}</p>
                    <p className="truncate text-[12px] text-[#b3b3b3]">{song.artist}</p>
                  </div>
                </div>
                <span className="text-[12px] text-[#b3b3b3]">{formatDuration(song.durationMs)}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

type PortfolioWindowProps = {
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  isMaximized: boolean;
  onTitleMouseDown: (event: MouseEvent<HTMLDivElement>) => void;
};

function PortfolioWindow({ onClose, onMinimize, onMaximize, isMaximized, onTitleMouseDown }: PortfolioWindowProps) {
  const [photoIndex, setPhotoIndex] = useState(0);
  const activePhotoSrc = aboutPhotoCandidates[photoIndex] ?? null;

  const handlePhotoError = () => {
    setPhotoIndex((prev) => prev + 1);
  };

  return (
    <div className="relative h-[min(78vh,760px)] w-[min(1240px,calc(125vw-80px))] overflow-hidden border border-[#434a56] bg-[#1f232a] shadow-[0_28px_72px_rgba(0,0,0,0.46)]">

      <div
        className="relative z-[2] flex h-[34px] cursor-grab select-none items-center justify-between border-b border-[#3b414c] bg-[#2a2f36] px-[10px] active:cursor-grabbing"
        onMouseDown={onTitleMouseDown}
      >
        <div className="flex items-center gap-[8px] text-[11px] uppercase tracking-[0.5px] text-[#e8edf5]">
          <img alt="" className="size-[12px]" src={desktopAssets.windowTitleIcon} />
          Portfolio.exe
        </div>

        <div className="flex h-full items-stretch">
          <button
            type="button"
            className="flex w-[45px] items-center justify-center text-[#dbe3ef] transition-colors hover:bg-[#3a404a]"
            aria-label="Minimize"
            onMouseDown={(event) => event.stopPropagation()}
            onClick={onMinimize}
          >
            <span className="mb-[1px] text-[12px] leading-none">−</span>
          </button>
          <button
            type="button"
            className="flex w-[45px] items-center justify-center text-[#dbe3ef] transition-colors hover:bg-[#3a404a]"
            aria-label={isMaximized ? "Restore" : "Maximize"}
            onMouseDown={(event) => event.stopPropagation()}
            onClick={onMaximize}
          >
            <span className="text-[11px] leading-none">{isMaximized ? "❐" : "□"}</span>
          </button>
          <button
            type="button"
            className="flex w-[45px] items-center justify-center transition-colors hover:bg-[#e81123]"
            aria-label="Close"
            onMouseDown={(event) => event.stopPropagation()}
            onClick={onClose}
          >
            <span className="text-[11px] leading-none text-[#dbe3ef]">×</span>
          </button>
        </div>
      </div>

      <div className="relative z-[1] grid h-[calc(100%-34px)] grid-cols-[360px_1fr]">
        <div className="relative border-r border-[rgba(255,255,255,0.06)] bg-[rgba(15,19,29,0.7)] p-[30px]">
          <div className="pointer-events-none absolute -bottom-[78px] -left-[88px] size-[240px] rounded-full bg-[rgba(0,120,215,0.18)] blur-[64px]" />

          <div className="relative h-full rounded-[4px] border border-[rgba(255,255,255,0.1)] bg-[rgba(11,17,30,0.65)] p-[14px]">
            <div className="relative flex h-full items-center justify-center overflow-hidden border border-[rgba(164,201,255,0.16)] bg-[linear-gradient(160deg,#0a1324_0%,#0e1c34_100%)]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_62%_38%,rgba(77,173,255,0.12)_0%,transparent_56%)]" />
              {activePhotoSrc ? (
                <img
                  alt="Andrew Dang"
                  className="relative h-full w-full object-cover object-[52%_24%] grayscale"
                  src={activePhotoSrc}
                  onError={handlePhotoError}
                />
              ) : (
                <div className="relative flex h-[78%] w-[78%] items-center justify-center border border-dashed border-[rgba(192,199,212,0.28)] bg-[rgba(255,255,255,0.02)]">
                  <div className="text-center text-[11px] font-thin uppercase tracking-[1.2px] text-[rgba(192,199,212,0.72)]">
                    <p>PHOTO NOT FOUND</p>
                    <p className="pt-[6px] text-[10px] text-[rgba(192,199,212,0.48)]">
                      add /public/about-me-photo.jpg
                    </p>
                  </div>
                </div>
              )}
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,8,14,0)_0%,rgba(5,8,14,0.24)_100%)]" />
            </div>
          </div>
        </div>

        <div className="relative flex flex-col justify-start overflow-auto bg-[linear-gradient(132deg,rgba(44,53,73,0.42)_0%,rgba(20,26,37,0.22)_100%)] p-[44px]">
          <div className="max-w-[780px]">
            <p className="text-[11px] font-thin uppercase tracking-[3px] text-[#43d8f1]">IDENT_PROFILE</p>
            <h1 className="pt-[12px] text-[64px] font-thin tracking-[-2.2px] text-[#e5e2e1] leading-[1]">
              Andrew Dang
            </h1>
            <p className="max-w-[700px] pt-[22px] text-[22px] font-thin text-[#c0c7d4] leading-[1.45]">
              Computer Science student, founder, and software engineer building practical tools across systems optimization, data pipelines, and AI-assisted full-stack applications.
            </p>
            <p className="max-w-[700px] pt-[14px] text-[17px] font-thin text-[rgba(192,199,212,0.86)] leading-[1.55]">
              My recent work spans bioacoustics signal processing, network diagnostics, real-time sports data engineering, and low-end PC optimization. I like turning messy technical problems into clean, usable systems.
            </p>

            <div className="max-w-[760px] pt-[34px]">
              <div className="flex flex-wrap gap-[8px]">
                <ColorTag bg="#146eb4" text="Python" />
                <ColorTag bg="#3f6d96" text="C++/C" />
                <ColorTag bg="#3178c6" text="TypeScript" />
                <ColorTag bg="#d1a618" text="JavaScript" textColor="#1f1600" />
                <ColorTag bg="#8b8b8b" text="SQL" />
                <ColorTag bg="#557c9b" text="Batch" />
                <ColorTag bg="#d76448" text="Git" />
                <ColorTag bg="#1278c8" text="React" />
                <ColorTag bg="#1f7a53" text="Next.js" />
                <ColorTag bg="#3f6d96" text="FastAPI" />
                <ColorTag bg="#2f8a43" text="Node.js" />
                <ColorTag bg="#5f4fb5" text="Electron" />
                <ColorTag bg="#4f8db7" text="FFmpeg" />
                <ColorTag bg="#7350d0" text="OpenCV" />
                <ColorTag bg="#2f8f5a" text="Pandas" />
                <ColorTag bg="#3f79c4" text="NumPy" />
                <ColorTag bg="#6d53c7" text="SciPy" />
                <ColorTag bg="#a453c7" text="Librosa" />
                <ColorTag bg="#47658f" text="Linux" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

type ResumeWindowProps = {
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  isMaximized: boolean;
  onTitleMouseDown: (event: MouseEvent<HTMLDivElement>) => void;
};

function ResumeWindow({ onClose, onMinimize, onMaximize, isMaximized, onTitleMouseDown }: ResumeWindowProps) {
  return (
    <div className="relative h-[min(76vh,720px)] w-[min(1020px,calc(125vw-80px))] overflow-hidden border border-[#8a8a8a] bg-[#e6e6e6] shadow-[0_18px_48px_rgba(0,0,0,0.38)]">

      <div
        className="relative z-[2] flex h-[34px] cursor-grab select-none items-center justify-between border-b border-[#3b414c] bg-[#2a2f36] px-[10px] active:cursor-grabbing"
        onMouseDown={onTitleMouseDown}
      >
        <div className="flex items-center gap-[8px] text-[11px] uppercase tracking-[0.5px] text-[#e8edf5]">
          <img alt="" className="size-[13px] object-contain" src={resumeFileIcon} />
          Resume.pdf - File Viewer
        </div>

        <div className="flex h-full items-stretch">
          <button
            type="button"
            className="flex w-[45px] items-center justify-center text-[#dbe3ef] transition-colors hover:bg-[#3a404a]"
            aria-label="Minimize"
            onMouseDown={(event) => event.stopPropagation()}
            onClick={onMinimize}
          >
            <span className="mb-[1px] text-[12px] leading-none">−</span>
          </button>
          <button
            type="button"
            className="flex w-[45px] items-center justify-center text-[#dbe3ef] transition-colors hover:bg-[#3a404a]"
            aria-label={isMaximized ? "Restore" : "Maximize"}
            onMouseDown={(event) => event.stopPropagation()}
            onClick={onMaximize}
          >
            <span className="text-[11px] leading-none">{isMaximized ? "❐" : "□"}</span>
          </button>
          <button
            type="button"
            className="flex w-[45px] items-center justify-center transition-colors hover:bg-[#e81123]"
            aria-label="Close"
            onMouseDown={(event) => event.stopPropagation()}
            onClick={onClose}
          >
            <span className="text-[11px] leading-none text-[#dbe3ef]">×</span>
          </button>
        </div>
      </div>

      <div className="relative z-[1] h-[calc(100%-34px)]">
        <div className="flex h-[40px] items-center gap-[18px] border-b border-[#ccc] bg-[#f7f7f7] px-[14px] text-[12px] text-[#444]"><span>☰</span><span>Resume.pdf</span><span className="ml-auto">−</span><span>100%</span><span>+</span><span>⤓</span><span>🖨</span></div>
        <div className="h-[calc(100%-40px)] overflow-auto bg-[#d7d7d7] p-[26px]">
          <div className="mx-auto max-w-[760px] bg-white p-[34px] text-[#333] shadow-[0_2px_8px_rgba(0,0,0,0.24)]">
            <p className="text-[11px] uppercase tracking-[2px] text-[#b3261e]">Resume</p>
            <h2 className="pt-[10px] text-[40px] font-thin tracking-[-1.2px] text-[#222]">
              Andrew Dang
            </h2>
            <p className="pt-[6px] text-[14px] font-thin text-[#666]">
              (682) 300-1386 | andrewdangbusiness@gmail.com | github.com/andrewdang06 | portfolio-psi-ten-qk0ppj3f0c.vercel.app
            </p>
            <a
              href="/andrew-dang-resume.pdf"
              target="_blank"
              rel="noreferrer"
              className="mt-[14px] inline-flex border border-[#b3261e] px-[10px] py-[5px] text-[11px] uppercase tracking-[0.7px] text-[#b3261e] hover:bg-[#f8eceb]"
            >
              Open PDF
            </a>

            <div className="mt-[24px] space-y-[22px] text-[14px] font-thin leading-[1.65] text-[#555] [&_h3]:!text-[#b3261e] [&_p]:!text-[#444] [&_li]:!text-[#555]">
              <section>
                <h3 className="text-[12px] uppercase tracking-[1.2px] text-[#a4c9ff]">Education</h3>
                <p className="pt-[6px] text-[#e5e2e1]">
                  University of Texas at Arlington - Arlington, TX
                </p>
                <p>
                  B.S. in Computer Science, Minor in Business (Expected May 2028)
                </p>
                <ul className="list-disc space-y-[4px] pl-[18px] pt-[6px] text-[rgba(192,199,212,0.92)]">
                  <li>GPA: 3.84/4.0</li>
                </ul>
              </section>

              <section>
                <h3 className="text-[12px] uppercase tracking-[1.2px] text-[#a4c9ff]">Experience</h3>

                <div className="pt-[6px]">
                  <p className="text-[#e5e2e1]">Peak Systems - Fort Worth, TX</p>
                  <p className="text-[rgba(192,199,212,0.76)]">
                    Founder &amp; Software Engineer | May 2025 - Present
                  </p>
                  <ul className="list-disc space-y-[4px] pl-[18px] pt-[4px] text-[rgba(192,199,212,0.92)]">
                    <li>
                      Founded and bootstrapped a system optimization startup, building an organic distribution channel via Discord that scaled to over 800 community members.
                    </li>
                    <li>
                      Engineered core system tuning workflows primarily using Batch scripting, integrated with custom user authentication for secure account management and service delivery.
                    </li>
                  </ul>
                </div>

                <div className="pt-[10px]">
                  <p className="text-[#e5e2e1]">Premier Soccer Services - Katy, TX</p>
                  <p className="text-[rgba(192,199,212,0.76)]">
                    Data Analyst Intern | May 2025 - Present
                  </p>
                  <ul className="list-disc space-y-[4px] pl-[18px] pt-[4px] text-[rgba(192,199,212,0.92)]">
                    <li>
                      Developed robust data engineering pipelines to ingest and process real-time match statistics across 300+ games, implementing automated cleaning protocols for raw inputs.
                    </li>
                    <li>
                      Engineered validation frameworks to detect anomalies and mitigate data poisoning risks from decentralized entry points, ensuring high-fidelity datasets for downstream reporting.
                    </li>
                  </ul>
                </div>

                <div className="pt-[10px]">
                  <p className="text-[#e5e2e1]">Tomorrow&apos;s Leaders Today - Dallas, TX</p>
                  <p className="text-[rgba(192,199,212,0.76)]">
                    Data Research Intern | May 2025 - Aug. 2025
                  </p>
                  <ul className="list-disc space-y-[4px] pl-[18px] pt-[4px] text-[rgba(192,199,212,0.92)]">
                    <li>
                      Spearheaded regional labor market and job search trend analysis, using Python (Pandas) to synthesize complex employment datasets into actionable reports.
                    </li>
                    <li>
                      Designed automated tracking workflows using SQL queries and relational databases to map regional job availability, improving reporting efficiency by 60%.
                    </li>
                  </ul>
                </div>

                <div className="pt-[10px]">
                  <p className="text-[#e5e2e1]">Edikt Studios - Fort Worth, TX</p>
                  <p className="text-[rgba(192,199,212,0.76)]">
                    Software Engineering Intern (Optimization Team) | Aug. 2023 - May 2024
                  </p>
                  <ul className="list-disc space-y-[4px] pl-[18px] pt-[4px] text-[rgba(192,199,212,0.92)]">
                    <li>
                      Developed a 3D fighting game designed for low-end PCs, reducing RAM and CPU usage by 30% through Unity Profiler analysis of excessive draw calls.
                    </li>
                    <li>
                      Refactored core systems to reduce code duplication and streamline feature development, improving iteration speed on gameplay mechanics by 50%.
                    </li>
                  </ul>
                </div>
              </section>

              <section>
                <h3 className="text-[12px] uppercase tracking-[1.2px] text-[#a4c9ff]">Projects</h3>

                <div className="pt-[6px]">
                  <p className="text-[#e5e2e1]">EleSynth | Claude, Codex, Next.js, FastAPI, SciPy, Librosa, Gemini API</p>
                  <ul className="list-disc space-y-[4px] pl-[18px] pt-[4px] text-[rgba(192,199,212,0.92)]">
                    <li>
                      Built a full-stack bioacoustics workbench to isolate elephant vocalizations from noisy field recordings using STFT and harmonic-percussive separation.
                    </li>
                    <li>
                      Designed a FastAPI backend with DSP pipelines (NumPy, SciPy, Librosa) to process WAV inputs into cleaned audio, spectrogram visualizations, and structured metadata outputs.
                    </li>
                  </ul>
                </div>

                <div className="pt-[10px]">
                  <p className="text-[#e5e2e1]">Network Optimization Agent | Batch, PowerShell, WMI, iPerf, Test Agents, Codex</p>
                  <ul className="list-disc space-y-[4px] pl-[18px] pt-[4px] text-[rgba(192,199,212,0.92)]">
                    <li>
                      Developed an automated diagnostic agent using Batch and PowerShell to scan local environments and safely evaluate system settings for latency reduction.
                    </li>
                    <li>
                      Engineered network test agents using WMI and iPerf to continuously monitor packet flow, validate configuration improvements, and support reliable real-time data transmission.
                    </li>
                  </ul>
                </div>
              </section>

              <section>
                <h3 className="text-[12px] uppercase tracking-[1.2px] text-[#a4c9ff]">Technical Skills</h3>
                <ul className="list-disc space-y-[4px] pl-[18px] pt-[6px] text-[rgba(192,199,212,0.92)]">
                  <li>Languages: Python, C++/C, TypeScript, Java, SQL, Batch</li>
                  <li>Frameworks &amp; Platforms: .NET, Node.js, Next.js, React, FastAPI, Electron, Unity</li>
                  <li>Libraries &amp; Systems: NumPy, Pandas, SciPy, Librosa, OpenCV, scikit-learn, FFmpeg</li>
                  <li>Tools &amp; Infrastructure: Git, GitHub, Firebase, PostgreSQL, REST APIs, Linux</li>
                </ul>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

type DesktopIconProps = {
  active?: boolean;
  label: string;
  src: string;
  onClick?: () => void;
};

function DesktopIcon({ active = false, label, src, onClick }: DesktopIconProps) {
  return (
    <button
      type="button"
      className={`group flex h-[92px] w-[84px] flex-col items-center justify-start gap-[4px] border border-transparent bg-transparent px-[3px] pt-[5px] text-center ${
        active ? "border-[rgba(126,186,232,0.72)] bg-[rgba(0,90,158,0.42)]" : "hover:border-[rgba(126,186,232,0.52)] hover:bg-[rgba(0,90,158,0.28)]"
      }`}
      onClick={onClick}
    >
      <div className="flex h-[52px] w-full items-center justify-center">
        <img alt="" className="size-[44px] object-contain drop-shadow-[0_1px_1px_rgba(0,0,0,0.32)]" src={src} />
      </div>
      <span
        className="w-full text-center text-[11px] font-normal leading-[1.12] text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.95)]"
      >
        {label}
      </span>
    </button>
  );
}

type ColorTagProps = {
  bg: string;
  text: string;
  textColor?: string;
};

function ColorTag({ bg, text, textColor = "#f7f8fc" }: ColorTagProps) {
  return (
    <span
      className="rounded-[4px] px-[10px] py-[4px] text-[12px] font-thin tracking-[0.2px]"
      style={{ backgroundColor: bg, color: textColor }}
    >
      {text}
    </span>
  );
}

type DesktopTaskbarProps = {
  windows: WindowMap;
  onOpenPortfolio: () => void;
  onOpenResume: () => void;
  onOpenMusic: () => void;
  onOpenProjects: () => void;
  onOpenMail: () => void;
  onOpenAcknowledgement: () => void;
  onOpenChrome: () => void;
  onOpenGithub: () => void;
};

function DesktopTaskbar({
  windows,
  onOpenPortfolio,
  onOpenResume,
  onOpenMusic,
  onOpenProjects,
  onOpenMail,
  onOpenAcknowledgement,
  onOpenChrome,
  onOpenGithub,
}: DesktopTaskbarProps) {
  const taskbarPalette = {
    shellBg: "rgba(16,23,33,0.93)",
    shellBorder: "rgba(255,255,255,0.05)",
    startBg: "transparent",
    startHover: "rgba(255,255,255,0.1)",
    searchBg: "rgba(255,255,255,0.9)",
    searchBorder: "rgba(0,0,0,0.16)",
    searchFocusBg: "#ffffff",
    searchFocusBorder: "rgba(0,120,215,0.9)",
  } as const;

  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [startOpen, setStartOpen] = useState(false);
  const [now, setNow] = useState(() => new Date());
  const searchRef = useRef<HTMLDivElement | null>(null);

  const quickApps = [
    { id: "about", label: "About Me", type: "App", icon: aboutAppIcon, action: onOpenPortfolio },
    { id: "resume", label: "Resume.pdf", type: "Document", icon: resumeFileIcon, action: onOpenResume },
    { id: "music", label: "Music", type: "App", icon: musicAppIcon, action: onOpenMusic },
    { id: "projects", label: "Projects", type: "App", icon: projectsAppIcon, action: onOpenProjects },
    { id: "mail", label: "Mail", type: "App", icon: mailAppIcon, action: onOpenMail },
    {
      id: "acknowledgement",
      label: "Acknowledgement",
      type: "App",
      icon: acknowledgementAppIcon,
      action: onOpenAcknowledgement,
    },
    { id: "chrome", label: "Chrome", type: "Web", icon: chromeAppIcon, action: onOpenChrome },
    { id: "github", label: "GitHub", type: "Web", icon: githubAppIcon, action: onOpenGithub },
  ] as const;

  const taskbarAppButtonClass = (active: boolean) =>
    `flex h-full w-[48px] items-center justify-center border-b-2 ${
      active
        ? "border-[#76b9ed] bg-[rgba(255,255,255,0.13)]"
        : "border-transparent hover:bg-[rgba(255,255,255,0.08)]"
    }`;

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const appResults = normalizedQuery
    ? quickApps.filter((item) => item.label.toLowerCase().includes(normalizedQuery))
    : quickApps.slice(0, 5);

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (!searchRef.current) {
        return;
      }
      if (!searchRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
        setStartOpen(false);
      }
    };

    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, []);

  useEffect(() => {
    const tick = window.setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => window.clearInterval(tick);
  }, []);

  const timeText = now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  const dateText = now.toLocaleDateString([], { year: "numeric", month: "2-digit", day: "2-digit" });

  const runBestMatch = () => {
    if (appResults[0]) {
      appResults[0].action();
      setSearchOpen(false);
      return;
    }

    if (normalizedQuery) {
      const encoded = encodeURIComponent(searchQuery.trim());
      window.open(`https://www.google.com/search?q=${encoded}`, "_blank", "noopener,noreferrer");
      setSearchOpen(false);
    }
  };

  return (
    <div
      className="absolute inset-x-0 bottom-0 z-[10] h-[48px] border-t"
      style={{
        borderTopColor: taskbarPalette.shellBorder,
        backgroundColor: taskbarPalette.shellBg,
      }}
    >
      <div className="relative h-full w-full">
        <div className="relative z-[2] flex h-full items-center" ref={searchRef}>
          <button
            type="button"
            className="flex h-full w-[48px] items-center justify-center"
            style={{ backgroundColor: taskbarPalette.startBg }}
            onMouseEnter={(event) => {
              event.currentTarget.style.backgroundColor = taskbarPalette.startHover;
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style.backgroundColor = taskbarPalette.startBg;
            }}
            aria-label="Start"
            onClick={() => {
              setStartOpen((value) => !value);
              setSearchOpen(false);
            }}
          >
            <img alt="" className="size-[16px] object-contain" src={desktopAssets.taskbarStart} />
          </button>
          <div
            className="flex h-[40px] w-[292px] items-center gap-[10px] border px-[12px]"
            style={{
              borderColor: searchOpen ? taskbarPalette.searchFocusBorder : taskbarPalette.searchBorder,
              backgroundColor: searchOpen ? taskbarPalette.searchFocusBg : taskbarPalette.searchBg,
            }}
          >
            <img alt="" className="size-[11px]" src={desktopAssets.taskbarSearch} />
            <input
              value={searchQuery}
              onFocus={() => {
                setSearchOpen(true);
                setStartOpen(false);
              }}
              onChange={(event) => {
                setSearchQuery(event.target.value);
                setSearchOpen(true);
                setStartOpen(false);
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  runBestMatch();
                }
                if (event.key === "Escape") {
                  setSearchOpen(false);
                }
              }}
              placeholder="Type here to search"
              className="w-full bg-transparent text-[13px] text-[#1f1f1f] outline-none placeholder:text-[rgba(31,31,31,0.78)]"
              style={{
                boxShadow: "none",
              }}
              aria-label="Search"
            />
          </div>

          {startOpen && !searchOpen ? (
            <div className="absolute bottom-[48px] left-0 z-[40] flex h-[520px] w-[620px] border border-[rgba(0,0,0,0.48)] bg-[rgba(22,29,39,0.98)] shadow-[4px_-4px_18px_rgba(0,0,0,0.28)]">
              <div className="flex w-[52px] flex-col justify-between bg-[rgba(10,15,22,0.58)] py-[10px]">
                <div className="space-y-[4px]">
                  <div className="flex h-[44px] items-center justify-center">
                    <img alt="" className="size-[24px] object-contain" src={aboutAppIcon} />
                  </div>
                </div>
                <div className="space-y-[2px] text-[18px] text-white">
                  <button type="button" className="flex h-[44px] w-full items-center justify-center hover:bg-[rgba(255,255,255,0.1)]" aria-label="Settings">
                    ⚙
                  </button>
                  <button type="button" className="flex h-[44px] w-full items-center justify-center hover:bg-[rgba(255,255,255,0.1)]" aria-label="Power">
                    ⏻
                  </button>
                </div>
              </div>

              <div className="w-[258px] overflow-auto px-[10px] py-[12px] text-white">
                <p className="pb-[8px] text-[12px] text-[rgba(255,255,255,0.74)]">Recently added</p>
                {quickApps.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className="flex h-[42px] w-full items-center gap-[10px] px-[6px] text-left text-[13px] hover:bg-[rgba(255,255,255,0.1)]"
                    onClick={() => {
                      item.action();
                      setStartOpen(false);
                    }}
                  >
                    <img alt="" className="size-[22px] object-contain" src={item.icon} />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>

              <div className="flex-1 px-[8px] py-[12px] text-white">
                <p className="pb-[8px] text-[12px] text-[rgba(255,255,255,0.74)]">Life at a glance</p>
                <div className="grid grid-cols-2 gap-[4px]">
                  {quickApps.slice(0, 6).map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className="flex aspect-square flex-col items-start justify-between bg-[#1f78b8] p-[10px] text-left hover:bg-[#2586c7]"
                      onClick={() => {
                        item.action();
                        setStartOpen(false);
                      }}
                    >
                      <img alt="" className="size-[32px] object-contain" src={item.icon} />
                      <span className="text-[12px]">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          {searchOpen ? (
            <div className="absolute bottom-[48px] left-[49px] z-[40] h-[420px] w-[600px] border border-[rgba(145,145,145,0.6)] bg-[#f4f4f4] shadow-[0_18px_56px_rgba(0,0,0,0.45)]">
              <div className="border-b border-[#d7d7d7] bg-white px-[16px] py-[12px]">
                <p className="text-[11px] uppercase tracking-[1.2px] text-[#6a6a6a]">Search</p>
                <p className="pt-[4px] text-[15px] text-[#1f1f1f]">
                  {searchQuery.trim() || "Start typing to search apps, files, and web"}
                </p>
              </div>

              <div className="grid h-[calc(100%-68px)] grid-cols-[1fr_200px]">
                <div className="overflow-auto border-r border-[#d8d8d8] bg-white p-[12px]">
                  <p className="px-[6px] pb-[8px] text-[10px] uppercase tracking-[1px] text-[#6f6f6f]">
                    Best match
                  </p>
                  {appResults.length > 0 ? (
                    appResults.map((item, index) => (
                      <button
                        key={item.id}
                        type="button"
                        className={`flex w-full items-center gap-[10px] rounded-[4px] border px-[8px] py-[8px] text-left transition-colors ${
                          index === 0
                            ? "border-[#b3d7f5] bg-[#eaf4fd]"
                            : "border-transparent hover:border-[#d1e6f8] hover:bg-[#f3f8fd]"
                        }`}
                        onClick={() => {
                          item.action();
                          setSearchOpen(false);
                        }}
                      >
                        <img alt="" className="size-[16px] object-contain" src={item.icon} />
                        <div>
                          <p className="text-[12px] text-[#111111]">{item.label}</p>
                          <p className="text-[10px] uppercase tracking-[0.8px] text-[#6f6f6f]">
                            {item.type}
                          </p>
                        </div>
                      </button>
                    ))
                  ) : (
                    <p className="px-[6px] pt-[10px] text-[12px] text-[#5d5d5d]">No matching apps found.</p>
                  )}
                </div>

                <div className="bg-[#f2f2f2] p-[12px]">
                  <p className="pb-[8px] text-[10px] uppercase tracking-[1px] text-[#6f6f6f]">Quick actions</p>
                  <button
                    type="button"
                    className="w-full border border-[#c8dceb] bg-white px-[10px] py-[8px] text-left text-[11px] uppercase tracking-[1px] text-[#1f5f8b] hover:bg-[#edf6fd]"
                    onClick={runBestMatch}
                  >
                    Open best match
                  </button>
                  <button
                    type="button"
                    className="mt-[8px] w-full border border-[#c8dceb] bg-white px-[10px] py-[8px] text-left text-[11px] uppercase tracking-[1px] text-[#1f5f8b] hover:bg-[#edf6fd]"
                    onClick={() => {
                      const q = encodeURIComponent((searchQuery.trim() || "Andrew Dang portfolio").trim());
                      window.open(`https://www.google.com/search?q=${q}`, "_blank", "noopener,noreferrer");
                      setSearchOpen(false);
                    }}
                  >
                    Search web
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        <div className="absolute left-[340px] top-0 z-[1] flex h-full items-center gap-[1px]">
          <button
            type="button"
            className={taskbarAppButtonClass(windows.portfolio.open && !windows.portfolio.minimized)}
            aria-label="Open about me"
            onClick={onOpenPortfolio}
          >
            <img alt="" className="size-[20px] object-contain" src={aboutAppIcon} />
          </button>
          <button
            type="button"
            className={taskbarAppButtonClass(windows.resume.open && !windows.resume.minimized)}
            aria-label="Open resume viewer"
            onClick={onOpenResume}
          >
            <img alt="" className="size-[20px] object-contain" src={resumeFileIcon} />
          </button>
          <button
            type="button"
            className={taskbarAppButtonClass(windows.music.open && !windows.music.minimized)}
            aria-label="Open music app"
            onClick={onOpenMusic}
          >
            <img alt="" className="size-[20px] object-contain" src={musicAppIcon} />
          </button>
          <button
            type="button"
            className={taskbarAppButtonClass(windows.projects.open && !windows.projects.minimized)}
            aria-label="Open projects app"
            onClick={onOpenProjects}
          >
            <img alt="" className="size-[20px] object-contain" src={projectsAppIcon} />
          </button>
          <button
            type="button"
            className={taskbarAppButtonClass(false)}
            aria-label="Chrome"
            onClick={onOpenChrome}
          >
            <img alt="" className="size-[20px] object-contain" src={chromeAppIcon} />
          </button>
          <button
            type="button"
            className={taskbarAppButtonClass(false)}
            aria-label="GitHub"
            onClick={onOpenGithub}
          >
            <img alt="" className="size-[20px] object-contain" src={githubAppIcon} />
          </button>
          <button
            type="button"
            className={taskbarAppButtonClass(windows.mail.open && !windows.mail.minimized)}
            aria-label="Mail"
            onClick={onOpenMail}
          >
            <img alt="" className="size-[20px] object-contain" src={mailAppIcon} />
          </button>
          <button
            type="button"
            className={taskbarAppButtonClass(windows.acknowledgement.open && !windows.acknowledgement.minimized)}
            aria-label="Acknowledgement"
            onClick={onOpenAcknowledgement}
          >
            <img alt="" className="size-[20px] object-contain" src={acknowledgementAppIcon} />
          </button>
        </div>

        <div className="absolute right-[8px] top-0 flex h-full items-center gap-[12px] text-[11px] text-[#f1f1f1]">
          <img alt="" className="h-[10px] w-[14px]" src={desktopAssets.taskbarWifi} />
          <img alt="" className="h-[10px] w-[10px]" src={desktopAssets.taskbarVolume} />
          <div className="text-right leading-[14px]">
            <p>{timeText}</p>
            <p>{dateText}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
