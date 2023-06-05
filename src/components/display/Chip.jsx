import React from "react";
import classnames from "classnames";

export default function Chip({
	className,
	success = false,
	error = false,
	primary = false,
	children,
}) {
	return (
		<div
			className={classnames(
				"rounded-[18px] text-black uppercase px-1.5 py-1 text-xs font-bold",
				{
					"bg-gray-400": !success && !error && !primary,
					"bg-green-400": success,
					"bg-red-400": error,
					"bg-blue-400": primary,
				},
				className
			)}
		>
			{children}
		</div>
	);
}
