import { useEffect } from "react";

export default function useViewportHeight() {

    useEffect(() => {

        const setHeight = () => {

            const height = window.visualViewport
                ? window.visualViewport.height
                : window.innerHeight;

            document.documentElement.style.setProperty(
                "--app-height",
                `${height}px`
            );

        };

        setHeight();

        window.addEventListener("resize", setHeight);

        window.visualViewport?.addEventListener("resize", setHeight);

        window.visualViewport?.addEventListener("scroll", setHeight);

        return () => {

            window.removeEventListener("resize", setHeight);

            window.visualViewport?.removeEventListener(
                "resize",
                setHeight
            );

            window.visualViewport?.removeEventListener(
                "scroll",
                setHeight
            );

        };

    }, []);

}