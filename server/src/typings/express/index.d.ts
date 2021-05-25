import { GoogleVerifyResponse, UserInRequest } from "..";

declare global {
  namespace Express {
    interface Request {
      user?: UserInRequest;
      googleVerifyResponse?: GoogleVerifyResponse;
    }
  }
}
