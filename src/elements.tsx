import React from "react";

export const SvgElement = ({svg, className}: { svg: string, className?: string }) => {
    return <span className={className} dangerouslySetInnerHTML={{ __html: svg }} />
}