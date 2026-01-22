import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "BeeZee Nigeria",
    description: "Financial management for Nigerian informal businesses",
    manifest: "/nigeria/app/manifest.webmanifest",
    themeColor: "#008751",
};

export default function NigeriaLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
