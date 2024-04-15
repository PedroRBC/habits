import { MMKV } from "react-native-mmkv";

import { expo as config } from "@/../app.json";

export const mmkvStorage = new MMKV({ id: config.slug });
