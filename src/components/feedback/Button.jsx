import React from "react";
import classnames from "classnames";

import { Loading } from "../display";

export default function Button({
	size,
	className,
	outlined = false,
	disabled = false,
	loading = false,
	onClick,
	children,
}) {
	return (
		<button
			disabled={disabled}
			className={classnames(
				" bg-yellow-400 text-black-600 font-bold rounded-full flex justify-center items-center",
				className,
				{
					"w-40 px-4 py-3": size !== "small",
				},
				{
					"w-36 p-2": size === "small",
				},
				{
					"bg-zinc-400": disabled,
				},
				{
					"border-zinc-400 text-zinc-400": disabled && outlined,
				},
				{
					"focus:ring focus:outline-none focus:ring-yellow-300 hover:bg-yellow-500":
						!disabled && !outlined,
				},
				{
					"focus:ring focus:outline-none focus:ring-yellow-300 hover:border-yellow-500 hover:text-yellow-500":
						!disabled && outlined,
				},
				{
					"bg-transparent border-2 border-yellow-400 text-yellow-400": outlined,
				}
			)}
			onClick={onClick}
		>
			{loading ? <Loading /> : children}
		</button>
	);
}
