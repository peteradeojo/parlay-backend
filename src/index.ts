import { AppDataSource } from "./data-source";
import Database from "./lib/database";

import passport from "passport";
import app from "./server";
import { setupPassport } from "./lib/passport";
import { NextFunction, Request, Response } from "express";
import Paystack from "./services/paystack";
import { ServiceManager } from "./lib/util";
import CacheManager from "./lib/cache";

AppDataSource.initialize()
	.then(async (source) => {
		const port = process.env.PORT || 3000;

		Database.setDatasource(source);

		ServiceManager.initialize();

		setupPassport(passport);
		
		app.use(passport.initialize());
		app.use((err: any, req: Request, res: Response, next: NextFunction) => {
			console.log(err);
			res.status(500).json({
				message: err,
			});
		});

		app.listen(port, () => console.log(`Server running on: ${port}`));
	})
	.catch((error) => console.error(error));
