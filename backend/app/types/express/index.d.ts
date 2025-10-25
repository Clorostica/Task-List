import "express";
import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    export interface Request {
      auth?: JwtPayload & {
        sub: string;
        email?: string;
      };
    }
  }
}
