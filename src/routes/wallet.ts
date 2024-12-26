import express from "express";

const router = express.Router();

export default () => {
	router.get("/", (req, res) => {
		res.send("Hello World");
	});

	router.post("/fund", async (req, res) => {});

    
	return router;
};
