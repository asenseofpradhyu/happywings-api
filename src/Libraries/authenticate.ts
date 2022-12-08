import { NextFunction, Request, Response } from 'express';
import jsonwebtoken from 'jsonwebtoken';
import { user } from '../types/user';
import prisma from './prisma';

/**
 * @param {*} user - The user object.  We need this to set the JWT `sub` payload property to the MongoDB user ID
 */
 export function issueJWT(user: user) {

  const _id = user._id;
  const expiresIn = '1d';

  const payload = {
    sub: _id,
    iat: Date.now()
  };

  const signedToken = jsonwebtoken.sign(payload, 'HARSHTESTKEY', { expiresIn: expiresIn });

  return {
    token: "Bearer " + signedToken,
    expires: expiresIn
  }
}

export async function Authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jsonwebtoken.verify(token, 'HARSHTESTKEY', async (err: any, decoded: any) => {
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