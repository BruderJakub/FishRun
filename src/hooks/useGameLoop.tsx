import { useEffect, useRef, useState } from "react";

export default function useGameLoop() {
    const [tick, setTick] = useState(0);

    const obstacleX = useRef(800);
    const fishY = useRef(0);
    const velocityY = useRef(0);

    const jump = () => {
        if (fishY.current === 0) {
            velocityY.current = 500;
        }
    };

    useEffect(() => {
        let animationFrame: number;
        let lastTime = Date.now();

        const loop = () => {
            const now = Date.now();
            const delta = (now - lastTime) / 1000;

            lastTime = now;

            obstacleX.current -= 300 * delta;

            if (obstacleX.current < -50) {
                obstacleX.current = 800;
            }

            velocityY.current -= 1200 * delta;

            fishY.current += velocityY.current * delta;

            if (fishY.current < 0) {
                fishY.current = 0;
                velocityY.current = 0;
            }

            setTick(t => t + 1);

            animationFrame = requestAnimationFrame(loop);
        };

        animationFrame = requestAnimationFrame(loop);

        return () => cancelAnimationFrame(animationFrame);
    }, []);

    return {
        obstacleX: obstacleX.current,
        fishY: fishY.current,
        jump,
        tick,
    };
}