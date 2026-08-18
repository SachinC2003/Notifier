import type { Request, Response, NextFunction } from "express";
import type { SignUpInput } from "../../dtos/user.dto";
import { signUp } from "../../bll/auth-bll/signup.bll";

/** HTTP layer: delegates business work and shapes the successful response. */
const signup = async (
  req: Request<unknown, unknown, SignUpInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await signUp(req.body);
    return res.status(201).json({ message: "Account created successfully", data: user });
  } catch (error) {
    return next(error);
  }
};

export default signup;
