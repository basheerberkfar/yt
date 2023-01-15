import { create, StateCreator } from "zustand";
import { devtools, persist } from "zustand/middleware";
import createSelectors from "./selectedValues";

type IStyle = {
  ability: {
    is_hidden: boolean;
    slot: number;
  };
};

export type IUseBearStore = {
  bears: number;
  increasePopulation?: () => void;
  removeAllBears?: () => void;
};
export const sss = create<IUseBearStore>()(
  devtools(
    persist(
      (set) => ({
        bears: 0,
        increase: (by: number) => set((state) => ({ bears: state.bears + by })),
      }),
      {
        name: "bear-storage",
      }
    )
  )
);

const CreateBearStore: StateCreator<IUseBearStore> = (set) => ({
  bears: 0,
  increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  removeAllBears: () => set(() => ({ bears: 0 })),
});

export const useBoundStore = create<IUseBearStore>()(
  devtools((...a) => ({
    ...CreateBearStore(...a),
  }))
);

export default createSelectors(useBoundStore);
