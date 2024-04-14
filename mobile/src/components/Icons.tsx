import {
  Check,
  ArrowLeft,
  ArrowRight,
  CirclePlus,
  LucideIcon,
} from "lucide-react-native";
import { cssInterop } from "nativewind";

function interopIcon(icon: LucideIcon) {
  cssInterop(icon, {
    className: {
      target: "style",
      nativeStyleToProp: {
        color: true,
        opacity: true,
      },
    },
  });
}

interopIcon(Check);
interopIcon(ArrowLeft);
interopIcon(ArrowRight);
interopIcon(CirclePlus);

export { Check, ArrowLeft, ArrowRight, CirclePlus };
