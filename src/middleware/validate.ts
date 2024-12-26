import { Handler } from "express";
import { Schema } from "joi";

export const validateSchema = (
	schema: Schema,
	allowUnknown?: boolean
): Handler => {
	return (req, res, next) => {
		const errors = schema.validate(req.body, {
			allowUnknown,
		});
		if (!errors.error) {
			return next();
		}

		res.status(400).json({
			error: errors.error.message,
		});

		return;
	};
};
