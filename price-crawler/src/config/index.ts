import dotenv from "dotenv";
dotenv.config();

export const RABBITMQ_HOST = process.env.RABBITMQ_HOST || "amqp://localhost";
export const scheduleInterval =
  process.env.NODE_ENV === "development" ? "1 * * * * *" : "0 9,12,19 * * *";
