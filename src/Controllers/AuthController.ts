import { Request } from "express";
import { Response } from "express";
import prisma from "../Libraries/prisma";
// import { NextFunction } from "express";
import "argon2";
import { hash, verify } from "argon2";
import { createAndSendOtp, issueJWT, verifyOtp } from "../Libraries/authenticate";


export default class AuthController {

  public async postLogin(req: Request, res: Response) {
    console.log('hit at the right spot');
    console.log(prisma.user);
    const User = await prisma.user.findFirst({
      where: {
        email: req.body.email,
      },
    });
    console.log(User);
    if (!User) {
      return res.status(401).json({ message: "Incorrect email." }); // 401 Unauthorized
    }
    if (await verify(User.password, req.body.password)) {
      return res.status(200).json({
        token: issueJWT({
          _id: User.id,
          email: User.email,
          password: User.password,
          mobile: User.mobile,
          otp: 0,
          name: User.name
        }),
      });
    } else {
      return res.status(401).json({ message: "Incorrect password." }); // 401 Unauthorized
    }
  }

  public getLogout(req: Request, res: Response) {
    console.log(req.headers);
    return res.json({ "message": "logout" });
  }

  public async postSignup(req: Request, res: Response) {
    await prisma.user.create({
      data: {
        email: req.body.email,
        password: await hash(req.body.password),
        mobile: req.body.mobile,
        otp: 0,
        name: req.body.name,
      },
    });
    // console.log(prisma);

    return res.json({ "message": "signup" });
  }

  public async getLoggedUser(req: Request, res: Response) {
    console.log(req.body.user);
    return res.json({ "message": "getLoggedUser", user: req.body.user });
  }

  public async postLoginMobile(req: Request, res: Response) {
    let mobile = req.body.mobile;
    createAndSendOtp(mobile);
    return res.json({ "message": "Otp sent on your mobile" });
  }

  public async postLoginMobileVerify(req: Request, res: Response) {
    let mobile = req.body.mobile;
    let otp = req.body.otp;
    let verified = verifyOtp(mobile, otp);
    let return_data = { "message": "Otp not Verified", user: {} };
    if (await verified) {
      await prisma.user.update({
        where: {
          mobile: mobile
        },
        data: {
          otp: 0
        }
      }).then(user => {
        return_data = { "message": "Otp verified", user: user };
      }).catch(err => {
        console.log(err);
      });
    }
    return res.json(return_data);
  }
}
