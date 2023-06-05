import React from "react";
import classnames from "classnames";

export default function Label({ className, children }) {
	return (
		<label className={classnames("block text-zinc-200 font-bold mb-2", className)}>
			{children}
		</label>
	);
}
