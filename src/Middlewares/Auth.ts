import { NextFunction, Request, Response } from 'express';
import jsonwebtoken from 'jsonwebtoken';
import prisma from '../Libraries/prisma';

export async function Authenticate(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      jsonwebtoken.verify(token, "HARSHTESTKEY", async (err: any, decoded: any) => {
        if (err) {
          return res.status(401).json({ message: 'Unauthorized' });
        }
        req.body.user = await prisma.user.findFirst({
          where: {
            id: decoded.sub,
        }
        });;
        console.log(decoded);
        return next();
      });
    } else {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    return false;
  }