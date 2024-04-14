import { AppStackParamList } from "@/router/app.routes";

declare global {
  namespace ReactNavigation {
    interface RootParamList extends AppStackParamList {}
  }
}
