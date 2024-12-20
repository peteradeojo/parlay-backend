import { Handler } from "express";
import { Schema } from "joi";

export const validateSchema = (schema: Schema): Handler => {
	return (req, res, next) => {
		const errors = schema.validate(req.body);
		if (!errors.error) {
			return next();
		}

		res.status(400).json({
			error: errors.error.message,
		});

		return;
	};
};
