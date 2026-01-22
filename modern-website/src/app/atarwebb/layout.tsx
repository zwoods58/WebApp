import { Metadata } from "next";

export const metadata: Metadata = {
    title: "AtarWebb | The Invisible Architect - Enterprise Software Development",
    description: "Experience the next generation of web development. We build the silent infrastructures that power the world's most complex ambitions. Enterprise-grade software development, cloud architecture, and digital transformation solutions.",
    keywords: "AtarWebb, software development, cloud architecture, enterprise solutions, digital transformation, web development, mobile apps, infrastructure, technology consulting, web animations",
    authors: [{ name: 'AtarWebb' }],
    creator: 'AtarWebb',
    publisher: 'AtarWebb',
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://atarwebb.com'),
    alternates: {
        canonical: '/atarwebb',
    },
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: '/atarwebb',
        title: 'AtarWebb | The Invisible Architect',
        description: 'We build the silent infrastructures that power the world\'s most complex ambitions. Enterprise-grade software development and cloud architecture solutions.',
        siteName: 'AtarWebb',
        images: [
            {
                url: '/atarwebb-favicon-white.png',
                width: 512,
                height: 512,
                alt: 'AtarWebb Logo',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'AtarWebb | The Invisible Architect',
        description: 'We build the silent infrastructures that power the world\'s most complex ambitions.',
        images: ['/atarwebb-favicon-white.png'],
        creator: '@atarwebb',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
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
