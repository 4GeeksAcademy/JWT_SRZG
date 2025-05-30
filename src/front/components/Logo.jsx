import React from "react";
import MichisSvg from '../assets/img/michis.svg?react';

export const Logo = ({ width = "250px", height = "auto", className = "" }) => {
    return (
        <MichisSvg
            width={width}
            height={height}
            className={className}
            style={{ display: "block" }}
            aria-label="Logo Michis"
            role="img"
        />
    );
};