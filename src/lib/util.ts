import { SignOptions, sign } from "jsonwebtoken";

export const generateToken = (data: any, options: SignOptions = {}) => {
	return sign(data, process.env.JWT_TOKEN, {
		expiresIn: "12h",
		...options,
	});
};
