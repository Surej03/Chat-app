import express from 'express';
import {signup, login, logout, updateProfile, checkauth } from '../controllers/userController.js';
import { protectRoute } from '../middleware/auth.js';
import loginLimit from '../config/rateLimiter.js';
import validate from '../middleware/validate.js';
import { loginSchema, registerSchema } from '../validation/validation.js';

const authRoutes = express.Router();

//Routes
authRoutes.post("/signup",validate(registerSchema), signup)
authRoutes.post("/login", validate(loginSchema) ,loginLimit, login )
authRoutes.post("/logout", logout)
authRoutes.put("/update-profile",protectRoute ,updateProfile)
authRoutes.get("/check", protectRoute, checkauth)
export default authRoutes;