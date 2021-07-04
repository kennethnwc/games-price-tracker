import { Expo, ExpoPushMessage, ExpoPushTicket } from "expo-server-sdk";

// Create a new Expo SDK client
// optionally providing an access token if you have enabled push security
let expo = new Expo();

export const sendNotification = async (pushTokens: string[]) => {
  let messages = pushTokens.map(
    (token) =>
      ({
        to: token,
        sound: "default",
        body: "Games on sale  遊戲特價中",
      } as ExpoPushMessage)
  );

  let tickets: ExpoPushTicket[] = [];
  let chunks = expo.chunkPushNotifications(messages);
  for (let chunk of chunks) {
    try {
      let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      console.log(ticketChunk);
      tickets.push(...ticketChunk);
      // NOTE: If a ticket contains an error code in ticket.details.error, you
      // must handle it appropriately. The error codes are listed in the Expo
      // documentation:
      // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
    } catch (error) {
      console.error(error);
    }
  }
};
