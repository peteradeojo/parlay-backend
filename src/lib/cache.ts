import { Redis } from "ioredis";

export default class CacheManager {
	static instance: Redis;

	static bootstrap() {
		this.instance = new Redis(process.env.REDIS_URL!);
		this.instance.on("connect", () => console.log("Redis server connected"));
	}
}
