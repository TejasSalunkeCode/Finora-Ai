import type { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middlerware.js";
import { HTTPSTATUS } from "../config/http.config.js";
import { registerSchema } from "../validators/auth.validator.js";
import UserModel from "../models/user.model.js";
import { registerService } from "../services/auth.service.js";

export const RegisterController = asyncHandler(async (req: Request, res: Response) => {
    // Validate request body
    const validatedData = registerSchema.parse(req.body);
    const result =  await registerService(validatedData);
    console.log("result",result)
    
    // Check if user already exists
    const existingUser = await UserModel.findOne({ email: req.body.email });
    console.log("dtaa")
    if (existingUser) {
        return res.status(HTTPSTATUS.CONFLICT).json({
            success: false,
            message: 'Email already registered',
            data:result,
        });
    }

    // Create new user
    const user = await UserModel.create({
        name: validatedData.name,
        email: validatedData.email,
        password: validatedData.password
    });

    // Omit password from response
    const userResponse = user.omitPassword();


    return res.status(HTTPSTATUS.CREATED).json({
        success: true,
        message: 'User registered successfully',
        data: userResponse
    });
});