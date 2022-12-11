import jsonwebtoken from 'jsonwebtoken';
import { user } from '../types/user';
import { WebServices } from './AWS';
import { generateDigits } from './CommonFunction';
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

  const signedToken = jsonwebtoken.sign(payload, "HARSHTESTKEY", { expiresIn: expiresIn });

  return {
    token: "Bearer " + signedToken,
    expires: expiresIn
  }
}

// make function to create otp and send to user

export async function createAndSendOtp(mobile: string) {
  // create 6 digit string
  let otp = generateDigits();
  await prisma.user.findFirst({
    where: {
      mobile: mobile
    }
  }).then(user => {
    if (user) {
      prisma.user.update({
        where: {
          mobile: mobile
        },
        data: {
          otp: otp
        }
      }).then(user => {
        let sendSMS = new WebServices();
        sendSMS.sendSMS(user.mobile, `Your OTP is ${otp}`);
        console.log(user);
      }).catch(err => {
        console.log(err);
      });
    }
  });
}

export async function verifyOtp(mobile: string, otp: string | null): Promise<boolean> {
  let return_data = false;
  await prisma.user.findFirst({
    where: {
      mobile: mobile
    }
  }).then(user => {
    if (user) {
      if (user.otp == otp) {
        console.log(user);
        console.log(otp);
        return_data = true;
      }
    }
  });
  console.log(return_data);
  return return_data;
}

