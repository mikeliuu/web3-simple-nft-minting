import React from "react";
import classnames from "classnames";

import { Label } from "../display";

export default function Switch({
	className,
	labelClass,
	label,
	id,
	name,
	checked = false,
	disabled = false,
	onChange,
	...rest
}) {
	return (
		<div className={classnames("block", className)}>
			{label && <Label className={labelClass}>{label}</Label>}

			<div className="relative inline-block w-14 align-middle select-none transition duration-200 ease-in">
				<input
					className={classnames(
						"toggle-checkbox absolute block w-8 h-8 rounded-full  border-4 appearance-none",
						{
							"cursor-pointer": !disabled,
						},
						{
							"bg-zinc-200  border-zinc-600": !disabled && !checked,
						},
						{
							"bg-zinc-500 border-zinc-700": disabled && !checked,
						},
						{
							"bg-zinc-400 border-green-400 right-0": disabled && checked,
						},
						{
							"border-green-500 bg-zinc-200 right-0": !disabled && checked,
						}
					)}
					type="checkbox"
					name={name}
					id={id}
					checked={checked}
					onChange={onChange}
					disabled={disabled}
					{...rest}
				/>
				<label
					htmlFor={id}
					className={classnames(
						"toggle-label block overflow-hidden h-8 rounded-full",
						{
							"cursor-pointer": !disabled,
						},
						{
							"bg-zinc-600": !disabled && !checked,
						},
						{
							"bg-zinc-700": disabled && !checked,
						},
						{
							"bg-green-400": disabled && checked,
						},
						{
							"bg-green-500": !disabled && checked,
						}
					)}
				></label>
			</div>
		</div>
	);
}
