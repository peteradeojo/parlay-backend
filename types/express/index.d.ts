import {User as IUser} from "../../src/entity/User";

declare global {
	namespace Express {
		interface User extends IUser {}
	}
}
