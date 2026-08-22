import type { NextFunction, Request, Response } from "express";
import { signIn } from "../../bll/auth-bll/signin.bll";
import type { SignInInput } from "../../dtos/user.dto";

/** HTTP layer: accepts sign-in requests and delegates authentication to the BLL. */
const signin = async (
  req: Request<unknown, unknown, SignInInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const auth = await signIn(req.body);
    return res
      .status(200)
      .json({ message: "Signed in successfully", data: auth });
  } catch (error) {
    return next(error);
  }
};

export default signin;
