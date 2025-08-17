import * as Cloud from "cloudinary";
import { GlobalEnv } from "./GlobalEnv";

Cloud.v2.config({
    cloud_name: GlobalEnv.CLOUDINARY.CLOUD_NAME,
    api_key: GlobalEnv.CLOUDINARY.API_KEY,
    api_secret: GlobalEnv.CLOUDINARY.SECRET_KEY,
    secure: true
});

export const Cloudinary = Cloud.v2;
