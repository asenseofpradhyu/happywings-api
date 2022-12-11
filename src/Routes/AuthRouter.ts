import { Response, Router } from "express";
import { Authenticate } from "../Middlewares/Auth";
import AuthController from "../Controllers/AuthController";

export default function AuthRouter(): Router {
    const router = Router();
    const authController = new AuthController();
    router.get('/auth/', (res: Response)=>{
        console.log('AuthRouter');
        res.send({message: 'Hello'})
    });
    router.post("/auth/login", authController.postLogin);
    router.post("/auth/login_mobile", authController.postLoginMobile);
    router.post("/auth/login_mobile_verify", authController.postLoginMobileVerify);
    router.post('/auth/signup', authController.postSignup);
    router.get('/auth/user', Authenticate, authController.getLoggedUser);
    router.get("/auth/logout", authController.getLogout);
    return router;
}
