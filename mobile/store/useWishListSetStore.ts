import create from "zustand";
import { combine } from "zustand/middleware";

export const useWishListSetStore = create(
  combine(
    {
      wishListSet: new Set<string>(),
    },
    (set) => ({
      setWishListSet: (store_id: string, actions?: "ADD" | "REMOVE") =>
        set((state) => {
          switch (actions) {
            case "ADD":
              return {
                wishListSet: state.wishListSet.add(store_id),
              };
            default:
              if (state.wishListSet.has(store_id)) {
                state.wishListSet.delete(store_id);
                return { wishListSet: state.wishListSet };
              } else {
                return { wishListSet: state.wishListSet.add(store_id) };
              }
          }
        }),
    })
  )
);
