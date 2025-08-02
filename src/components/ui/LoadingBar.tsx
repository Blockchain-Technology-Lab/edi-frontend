import { useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";

export function LoadingBar() {
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const { isLoading: routerLoading } = useRouterState();

    useEffect(() => {
        if (routerLoading) {
            setIsLoading(true);
            setProgress(30);

            const timer = setTimeout(() => {
                setProgress(70);
            }, 100);

            const completeTimer = setTimeout(() => {
                setProgress(100);
                setTimeout(() => {
                    setIsLoading(false);
                    setProgress(0);
                }, 200);
            }, 500);

            return () => {
                clearTimeout(timer);
                clearTimeout(completeTimer);
            };
        }
    }, [routerLoading]);

    if (!isLoading) return null;

    return (
        <div className="fixed top-16 left-0 right-0 z-50 h-1 bg-base-300">
            <div
                className="h-full bg-primary transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
            />
        </div>
    );
}