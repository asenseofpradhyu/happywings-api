import { Router } from "express";
import { Authenticate } from "../../utils/authenticate";
import AuthController from "./AuthController";

export default function AuthRouter(): Router {
    const router = Router();
    const authController = new AuthController();
    router.get('/', ()=>{
        console.log('AuthRouter');
    });
    router.post("/auth/login", authController.postLogin);
    router.post('/auth/signup', authController.postSignup);
    router.get('/auth/user', Authenticate, authController.getLoggedUser);
    router.get("/auth/logout", authController.getLogout);
    return router;
}
