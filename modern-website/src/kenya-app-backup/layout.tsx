import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "BeeZee Kenya",
    description: "Financial management for Kenyan informal businesses",
    manifest: "/kenya/app/manifest.webmanifest",
};

export default function KenyaLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
