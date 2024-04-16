import {
  Check,
  ArrowLeft,
  ArrowRight,
  CirclePlus,
  LucideIcon,
  LogOut,
  ChevronRight,
  Bell,
  AlertTriangle,
  CheckSquare,
  Info,
  BatteryWarning,
  Globe,
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
interopIcon(LogOut);
interopIcon(ChevronRight);
interopIcon(Bell);
interopIcon(AlertTriangle);
interopIcon(CheckSquare);
interopIcon(Info);
interopIcon(BatteryWarning);
interopIcon(Globe);

export {
  Check,
  ArrowLeft,
  ArrowRight,
  CirclePlus,
  LogOut,
  ChevronRight,
  Bell,
  AlertTriangle,
  CheckSquare,
  Info,
  BatteryWarning,
  Globe,
};
