import { Request } from "express";
import { Response } from "express";
import prisma from "../../utils/prisma";
// import { NextFunction } from "express";
import "argon2";
import { hash, verify } from "argon2";
import { issueJWT } from "../../utils/authenticate";


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
    if(await verify(User.password, req.body.password)) {
      return res.status(200).json({
        token: issueJWT({
          _id: User.id,
          email: User.email,
          password: User.password,
          name: User.name
        }),
      });
    }else{
      return res.status(401).json({ message: "Incorrect password." }); // 401 Unauthorized
    }
  }

  public getLogout(req: Request, res: Response) {
    console.log(req.headers);
    res.json({ "message": "logout" });
  }

  public async postSignup(req: Request, res: Response) {
    await prisma.user.create({
      data: {
        email: req.body.email,
        password: await hash(req.body.password),
        name: req.body.name,
      },
    });
    console.log(prisma);

    res.json({ "message": "signup" });
  }

  public async getLoggedUser(req:Request, res:Response) {
    console.log(req.body.user);
    res.json({ "message": "getLoggedUser" });
  }
}
