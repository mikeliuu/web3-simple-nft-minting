import React from "react";
import classnames from "classnames";

import { Label } from "../display";

export default function TextInput({
	className,
	labelClass,
	label,
	name,
	value,
	onChange,
	disabled = false,
	min,
	type = "text",
	...rest
}) {
	return (
		<div className={className}>
			{label && <Label className={labelClass}>{label}</Label>}

			<input
				className={classnames(
					"w-full rounded-full bg-zinc-600 text-zinc-200 font-bold focus:ring focus:outline-none focus:ring-zinc-500 py-2 px-3",
					{
						"bg-zinc-800 text-zinc-400": disabled,
					}
				)}
				type={type}
				name={name}
				min={min}
				value={value}
				onChange={onChange}
				disabled={disabled}
				{...rest}
			/>
		</div>
	);
}
