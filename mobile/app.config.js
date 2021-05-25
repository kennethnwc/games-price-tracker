import "dotenv/config"

export default ({ config }) => {
    return {
        ...config,
        "extra": {
            API_URL: process.env.API_URL,
            IOS_CLIENT_ID: process.env.IOS_CLIENT_ID,
            AN_CLIENT_ID: process.env.AN_CLIENT_ID
        }
    };
};