import React from "react";

const UserAvatar = ({ user, size = "md" }) => {
    const dimension = size === "sm" ? "h-8 w-8 text-sm" : "h-10 w-10 text-base";
    const label = user?.username || user?.email || "User";
    const initials = (user?.username || user?.email || "U")
        .slice(0, 2)
        .toUpperCase();

    return (
        <div
            title={label}
            aria-label={label}
            className={`${dimension} flex items-center justify-center rounded-full bg-green-500 font-bold text-white shadow ring-2 ring-white`}
        >
            {initials}
        </div>
    );
};

export default UserAvatar;
