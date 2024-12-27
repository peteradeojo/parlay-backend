import express from "express";

import auth from "./auth";
import parlays from "./parlays";
import passport from "passport";
import wallet from "./wallet";

const router = express.Router();

export default () => {
	router.get("/", (req, res) => {
		res.send("Hello World");
	});

	router.use("/auth", auth());
	router.use(
		"/parlays",
		passport.authenticate("jwt", { session: false }),
		parlays()
	);
	router.use(
		"/wallet",
		passport.authenticate("jwt", { session: false }),
		wallet()
	);

	return router;
};
