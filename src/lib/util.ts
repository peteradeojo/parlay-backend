import { SignOptions, sign } from "jsonwebtoken";
import BettingService from "../services/bets.service";
import Paystack from "../services/paystack";
import CacheManager from "./cache";

export const generateToken = (data: any, options: SignOptions = {}) => {
	return sign(data, process.env.JWT_TOKEN!, {
		expiresIn: "12h",
		...options,
	});
};

export const ServiceManager: {
	services: { bootstrap(): void }[];
	initialize: Function;
} = {
	services: [Paystack, BettingService, CacheManager],
	initialize: function () {
		this.services.forEach((s) => s.bootstrap());
	},
};
