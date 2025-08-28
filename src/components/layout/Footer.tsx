import { accessibilityRoute, changelogRoute, infographicsRoute } from "@/router";
import { Link } from "@tanstack/react-router";
import { Github, ExternalLink, ArrowUp } from "lucide-react";
import { ShortcutsHelp } from "@/components";

export function Footer() {
    const scrollToTop = (event: React.MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

        const mainElement = document.querySelector('main');

        if (mainElement) {
            mainElement.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    };

    // Get build date from environment variable or fallback to a default
    const buildDate = import.meta.env.VITE_BUILD_DATE
        ? new Date(import.meta.env.VITE_BUILD_DATE).toLocaleDateString("en-GB", {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
        : "Build date not available";

    return (
        <footer className="footer sm:footer-horizontal bg-base-200 text-base-content p-4 relative">
            {/* Top-right button group */}
            <div className="absolute right-4 top-2 flex items-center gap-2 z-50">
                <ShortcutsHelp />
                <button
                    onClick={scrollToTop}
                    className="btn btn-circle btn-sm btn-ghost opacity-60 hover:opacity-100 transition-opacity hover:scale-105"
                    aria-label="Back to top"
                    title="Back to top (Ctrl + Home)"
                >
                    <ArrowUp size={16} />
                </button>
            </div>

            <aside className="flex flex-col gap-2">
                <p>
                    <span className="text-lg font-bold">Edinburgh Decentralisation Index™</span>
                    <br />
                    is a registered trademark in the UK, US, and Switzerland.
                </p>
                <div className="text-[10px] opacity-60">
                    Last updated: {buildDate}
                </div>
            </aside>

            <nav>
                <h6 className="footer-title">Project</h6>
                <Link to={changelogRoute.to} className="link link-hover">
                    Changelog
                </Link>
                <a
                    className="link link-hover flex items-center gap-1"
                    href="https://github.com/Blockchain-Technology-Lab/edi-frontend"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Github size={14} />
                    GitHub
                    <ExternalLink size={10} />
                </a>
            </nav>

            <nav>
                <h6 className="footer-title">BTL</h6>
                <a
                    className="link link-hover flex items-center gap-1"
                    href="https://informatics.ed.ac.uk/blockchain"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    About us
                    <ExternalLink size={10} />
                </a>
                <a className="link link-hover" href="mailto:edi@ed.ac.uk">Contact</a>
                <Link to={infographicsRoute.to} className="link link-hover">Infographics</Link>
            </nav>

            <nav>
                <h6 className="footer-title">Legal</h6>
                <a
                    className="link link-hover flex items-center gap-1"
                    href="https://computing.help.inf.ed.ac.uk/logging-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Privacy
                    <ExternalLink size={10} />
                </a>
                <Link to={accessibilityRoute.to} className="link link-hover">Accessibility</Link>
            </nav>
        </footer>
    );
}
