import { PassportStatic } from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import { DeepPartial } from "typeorm";
import { User } from "../entity/User";
import { JwtPayload } from "jsonwebtoken";
import UserController from "../controllers/user.controller";

export const setupPassport = (passport: PassportStatic) => {
	passport.use(
		new JwtStrategy(
			{
				jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
                secretOrKey: process.env.JWT_TOKEN!,
			},
			async (payload: DeepPartial<User> & JwtPayload, done) => {
                try {
                    const user = await (new UserController).getUser(payload.email!);
    
                    if (!user) {
                        return done(false, null, "User not found.");
                    }

                    return done(false, user);
                } catch (error) {
                    console.error(error);
                    return done(error, false);                    
                }

            }
		)
	);
};
