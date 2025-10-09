import { hasUncaughtExceptionCaptureCallback, threadCpuUsage } from "process";
import UserModel from "../models/user.model.js";
import type { LoginSchemaType, RegisterSchemaType } from "../validators/auth.validator.js";
import { UnauthorizedException } from "../exception/unauthorized.exception.js";
import mongoose from "mongoose";
import ReportSettingModel, { ReportFrequencyEnum } from "../models/report-setting.model.js";
import { calculateNextReportDate } from "../utils/helper.js";
import { NOTFOUND } from "dns";
import { signJwtToken } from "../utils/jwt.js";

export const registerService = async (body: RegisterSchemaType) => {
  const { email } = body;

  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const existingUser = await UserModel.findOne({ email });
      if(existingUser){
        throw new UnauthorizedException("User already exists");
      }

      // const newUser = new UserModel({
      //   ...body,
      // });
      // await newUser.save({session});

      // const reportSetting = new ReportSettingModel({
      //   userId:newUser._id,
      //   frequency:ReportFrequencyEnum.MONTHLY,
      //   isEnabled:true,
      //   lastSentDate:null,
      //   nextReportDate:new Date(),
      // });
      // await reportSetting.save({session});
    });
  } catch (error) {
    throw error;
  }finally{
    await session.endSession();
  }
};

export const loginService = async (body: LoginSchemaType) => {
    const { email, password } = body;
    
    // Find user by email and include the password field
    const user = await UserModel.findOne({ email }).select('+password');
    
    if (!user) {
        throw new UnauthorizedException("Invalid email or password");
    }

    // Compare provided password with hashed password
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
        throw new UnauthorizedException("Invalid email or password");
    }

    // Generate JWT token
    const { token: accessToken, expiredAt } = signJwtToken({ userId: user._id });

    // Get or create report settings
    let reportSetting = await ReportSettingModel.findOne({ userId: user._id });
    
    if (!reportSetting) {
        // For new users, set the first report date to the start of next month
        const now = new Date();
        const nextReportDate = new Date(now.getFullYear(), now.getMonth() + 1, 1); // First day of next month
        
        reportSetting = new ReportSettingModel({
            userId: user._id,
            frequency: ReportFrequencyEnum.MONTHLY,
            isEnabled: true,
            lastSentDate: null,
            nextReportDate: nextReportDate
        });
        await reportSetting.save();
    }

    return {
        user: user.omitPassword(),
        accessToken,
        expiredAt,
        reportSetting: {
            _id: reportSetting._id,
            frequency: reportSetting.frequency,
            isEnabled: reportSetting.isEnabled
        }
    };
};
