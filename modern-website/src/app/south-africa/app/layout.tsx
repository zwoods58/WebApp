import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "BeeZee South Africa",
    description: "Financial management for South African informal businesses",
    manifest: "/south-africa/app/manifest.webmanifest",
};

export default function SouthAfricaLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
