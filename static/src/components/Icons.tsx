import React from "react";
import {token} from "@atlaskit/tokens";

interface IconProps {
    size?: string;
    colorType?: string;
    isDisabled?: boolean;
}

interface IconSize {
    width: string;
    height: string;
}

const iconSize: { [key: string]: IconSize } = {
    xs: {
        width: "16",
        height: "16",
    },
    s: {
        width: "20",
        height: "20",
    },
    m: {
        width: "24",
        height: "24",
    },
    l: {
        width: "32",
        height: "32",
    },
};

export const UserIcon: React.FC<IconProps> = ({
    size = "m",
    colorType = token("color.text.subtle"),
    isDisabled = false,
}) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={iconSize[size].width}
            height={iconSize[size].height}
            viewBox="0 0 24 24"
            fill="none"
        >
            <path
                d="M15.7501 6.00684C15.7501 8.0779 14.0712 9.75684 12.0001 9.75684C9.92902 9.75684 8.25009 8.0779 8.25009 6.00684C8.25009 3.93577 9.92902 2.25684 12.0001 2.25684C14.0712 2.25684 15.7501 3.93577 15.7501 6.00684Z"
                stroke={colorType}
                strokeOpacity={isDisabled ? "0.31" : "1"}
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
            <path
                d="M4.50122 20.1251C4.57153 16.0437 7.90196 12.7568 12.0001 12.7568C16.0983 12.7568 19.4288 16.0439 19.499 20.1254C17.2162 21.1729 14.6765 21.7568 12.0004 21.7568C9.32408 21.7568 6.78418 21.1727 4.50122 20.1251Z"
                stroke={colorType}
                strokeOpacity={isDisabled ? "0.31" : "1"}
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
        </svg>
    );
};
