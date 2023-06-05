import React from "react";
import classnames from "classnames";

export default function Bold({ className, children }) {
	return <span className={classnames("font-bold", className)}>{children}</span>;
}
