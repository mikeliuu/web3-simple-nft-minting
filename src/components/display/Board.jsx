import React from "react";
import classnames from "classnames";

export default function Board({ className, children }) {
	return (
		<section
			className={classnames(
				"max-w-xl container mx-auto rounded-[24px] bg-zinc-800 px-8 py-12",
				className
			)}
		>
			{children}
		</section>
	);
}
