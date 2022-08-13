import "dotenv/config";

export default ({ config }) => ({
  ...config,
  extra: {
    API_URL: process.env.API_URL ?? "http://localhost:4000",
    IOS_CLIENT_ID: process.env.IOS_CLIENT_ID ?? "",
    AN_CLIENT_ID: process.env.AN_CLIENT_ID ?? "",
    AN_STANDALONE_ID: process.env.AN_STANDALONE_ID ?? "",
  },
});
