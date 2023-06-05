import React from "react";
import classnames from "classnames";

import Button from "./Button";

export default function EditActions({
	isEdit = false,
	className,
	loading = false,
	closeText = "Cancel",
	submitText = "Confirm",
	onClose,
	onSubmit,
	disabled,
}) {
	return (
		isEdit && (
			<div className={classnames("flex flex-row", className)}>
				<Button
					className="p-1 w-24 h-10"
					loading={loading}
					onClick={onSubmit}
					disabled={disabled}
				>
					{submitText}
				</Button>

				<Button
					outlined
					className="ml-6 p-1 w-24 h-10"
					disabled={disabled || loading}
					onClick={onClose}
				>
					{closeText}
				</Button>
			</div>
		)
	);
}
