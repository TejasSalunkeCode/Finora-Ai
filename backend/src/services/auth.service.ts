import { hasUncaughtExceptionCaptureCallback, threadCpuUsage } from "process";
import UserModel from "../models/user.model.js";
import type { RegisterSchemaType } from "../validators/auth.validator.js";
import { UnauthorizedException } from "../exception/unauthorized.exception.js";
import mongoose from "mongoose";
import ReportSettingModel, { ReportFrequencyEnum } from "../models/report-setting.model.js";
import { calculateNextReportDate } from "../utils/helper.js";

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


