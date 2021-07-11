import dotenv from "dotenv";
import moment from "moment-timezone";
dotenv.config();

export const RABBITMQ_HOST = process.env.RABBITMQ_HOST || "amqp://localhost";
export const scheduleInterval =
  process.env.NODE_ENV === "development" ? "1 * * * * *" : "0 9,12,19 * * *";

export const getHongKongTimeISOString = () => {
  return moment(new Date()).tz("Asia/Hong_Kong").format();
};
