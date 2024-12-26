import { AppDataSource } from "./data-source";
import Database from "./lib/database";

import passport from 'passport';
import app from "./server";
import { setupPassport } from "./lib/passport";

AppDataSource.initialize()
	.then(async (source) => {
		const port = process.env.PORT || 3000;

		Database.setDatasource(source);
        
        setupPassport(passport);

        app.use(passport.initialize());
		app.use((err, req, res, next) => {
			console.log(err);
			res.status(500).json({
				message: err,
			});
		});

		app.listen(port, () => console.log(`Server running on: ${port}`));
	})
	.catch((error) => console.log(error));
	
