"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const FRAME_COUNT = 240;
const FRAME_PATH = "/atarwebb/ezgif-576d7e632e23bdd6-jpg/ezgif-frame-";

export default function HeroSequence() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Preload images
    useEffect(() => {
        let loadedCount = 0;
        const loadedImages: HTMLImageElement[] = [];

        for (let i = 1; i <= FRAME_COUNT; i++) {
            const img = new Image();
            const frameNum = i.toString().padStart(3, '0');
            img.src = `${FRAME_PATH}${frameNum}.jpg`;
            img.onload = () => {
                loadedCount++;
                if (loadedCount === FRAME_COUNT) {
                    setImages(loadedImages);
                    setIsLoaded(true);
                }
            };
            loadedImages[i - 1] = img;
        }
    }, []);

    useEffect(() => {
        if (!isLoaded || !canvasRef.current || !containerRef.current) return;

        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        if (!context) return;

        // Responsive canvas size
        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            renderFrame(0);
        };

        const renderFrame = (index: number) => {
            const img = images[Math.floor(index)];
            if (!img) return;

            context.clearRect(0, 0, canvas.width, canvas.height);

            // Center and cover
            const canvasAspect = canvas.width / canvas.height;
            const imgAspect = img.width / img.height;
            let drawW, drawH, offsetX, offsetY;

            if (canvasAspect > imgAspect) {
                drawW = canvas.width;
                drawH = canvas.width / imgAspect;
                offsetX = 0;
                offsetY = (canvas.height - drawH) / 2;
            } else {
                drawW = canvas.height * imgAspect;
                drawH = canvas.height;
                offsetX = (canvas.width - drawW) / 2;
                offsetY = 0;
            }

            context.drawImage(img, offsetX, offsetY, drawW, drawH);
        };

        window.addEventListener('resize', resize);
        resize();

        // GSAP ScrollTrigger for frame scrubbing
        const sequenceObj = { frame: 0 };

        gsap.to(sequenceObj, {
            frame: FRAME_COUNT - 1,
            ease: "none",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "+=300%", // Scroll distance
                scrub: 1.5, // Smoothness
                pin: true,
                markers: false
            },
            onUpdate: () => renderFrame(sequenceObj.frame)
        });

        return () => {
            window.removeEventListener('resize', resize);
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, [isLoaded, images]);

    return (
        <div ref={containerRef} className="relative w-full h-screen bg-black">
            <canvas
                ref={canvasRef}
                className="fixed inset-0 w-full h-full object-cover"
            />

            <div className="relative z-10 flex flex-col items-center justify-center h-full pointer-events-none">
                <div className="hero-text opacity-100">
                    <h1 className="text-6xl md:text-9xl font-black tracking-tighter text-white animate-pulse">
                        ATARWEBB
                    </h1>
                    <p className="text-white/40 text-sm md:text-base mt-4 font-mono tracking-widest text-center">
                        SCROLL TO IMMERSE
                    </p>
                </div>
            </div>

            {!isLoaded && (
                <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
                    <div className="text-white font-mono text-sm animate-pulse">
                        LOADING EXPERIENCE...
                    </div>
                </div>
            )}
        </div>
    );
}
