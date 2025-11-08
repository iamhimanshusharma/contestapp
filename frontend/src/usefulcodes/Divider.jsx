import React, { useState, useRef } from "react";

export default function Divider() {
    const [leftWidth, setLeftWidth] = useState(50); // percentage
    const containerRef = useRef(null);
    const isDragging = useRef(false);

    const handleMouseDown = () => {
        isDragging.current = true;
        document.body.style.cursor = "col-resize";
    };

    const handleMouseUp = () => {
        isDragging.current = false;
        document.body.style.cursor = "default";
    };

    const handleMouseMove = (e) => {
        if (!isDragging.current) return;
        const containerWidth = containerRef.current.offsetWidth;
        const newLeftWidth = (e.clientX / containerWidth) * 100;
        if (newLeftWidth > 10 && newLeftWidth < 90) {
            setLeftWidth(newLeftWidth);
        }
    };

    React.useEffect(() => {
        window.addEventListener("mouseup", handleMouseUp);
        window.addEventListener("mousemove", handleMouseMove);
        return () => {
            window.removeEventListener("mouseup", handleMouseUp);
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    return (
        <div ref={containerRef} className="flex h-screen w-full">
            <div
                className="bg-gray-200 flex items-center justify-center"
                style={{ width: `${leftWidth}%` }}
            >
                Left Section
            </div>
            <div
                className="w-1 bg-gray-500 hover:bg-gray-700 cursor-col-resize"
                onMouseDown={handleMouseDown}
            ></div>
            <div className="bg-gray-300 flex-1 flex items-center justify-center">
                Right Section
            </div>
        </div>
    );
}
