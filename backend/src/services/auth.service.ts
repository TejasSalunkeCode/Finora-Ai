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

export const loginService = async(body:LoginSchemaType)=>{
const {email,password}=body;;
const user = await UserModel.findOne({email})
if(!user) throw new UnauthorizedException("Email/Passwword not found");

const isPasswordValid = await user.comparePassword(password);

if(!isPasswordValid) 
  throw new UnauthorizedException("Invalid email/password");

const {token,expiredAt} = signJwtToken({userId:user.id});

const reportSetting=await ReportSettingModel.findOne({
  userId:user.id,
},
{_id:1,frequency:1,isEnabled:1}
).lean();
  return{
    user:user.omitPassword(),
    accessToken:token,
    expiredAt,
    reportSetting,
  }
}


