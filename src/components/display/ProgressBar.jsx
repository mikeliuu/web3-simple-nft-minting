import React from "react";
import classnames from "classnames";

export default function ProgressBar({ className, ratio = 0 }) {
	return (
		<div className={classnames("rounded-full h-3 bg-zinc-600", className)}>
			<div
				className="rounded-full h-3 w-full bg-zinc-200"
				style={{
					width: `${ratio}%`,
				}}
			></div>
		</div>
	);
}
