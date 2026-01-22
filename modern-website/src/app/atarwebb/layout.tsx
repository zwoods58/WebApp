import { Metadata } from "next";

export const metadata: Metadata = {
    title: "AtarWebb | Precision in Motion",
    description: "Experience the next generation of web animations.",
};

export default function AtarWebbLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="atarwebb-theme min-h-screen bg-black selection:bg-white selection:text-black">
            {children}
        </div>
    );
}
