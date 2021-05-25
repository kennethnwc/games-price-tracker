declare namespace Express {
  interface Request {
    user?: {
      googleID: string;
      email: string;
    };
  }
}
