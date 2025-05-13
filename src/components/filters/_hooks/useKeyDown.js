import { useState, useEffect } from "react";

export function useKeyDown(key) {
    const [isKeyDown, setKeyDown] = useState(false);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Shift") setKeyDown(true);
        };

        const handleKeyUp = (event) => {
            if (event.key === "Shift") setKeyDown(false);
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, [key]);

    return isKeyDown;
}