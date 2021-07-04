import { Game } from "../entity/game";
import { User } from "../entity/user";
import { WishList } from "../entity/whislist";
import { getConnection } from "typeorm";
import { sendNotification } from "./expoPushService";

export const sendPushNotification = async (store_ids: string[]) => {
  const rawExpoPushTokens = await getConnection()
    .createQueryBuilder(Game, "game")
    .select("expo_push_token")
    .distinct(true)
    .innerJoin(WishList, "wl", "wl.game_id = game.id")
    .innerJoin(User, "u", "u.id = wl.user_id")
    .where("game.store_id IN (:...store_ids)", {
      store_ids: store_ids,
    })
    .getRawMany();

  const expoPushTokens = rawExpoPushTokens.map(
    ({ expo_push_token }) => expo_push_token
  );

  console.log(expoPushTokens);

  sendNotification(expoPushTokens);
};
