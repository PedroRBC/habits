import { useNavigation } from "@react-navigation/native";

import { Button } from "./ui/button";

import { ArrowLeft, ArrowRight } from "@/components/Icons";

export function Return({
  direction = "left",
}: {
  direction?: "left" | "right";
}) {
  const { goBack } = useNavigation();

  return (
    <Button
      onPress={goBack}
      className="rounded-full"
      variant="ghost"
      size="icon"
    >
      {direction === "left" ? (
        <ArrowLeft
          size={24}
          strokeWidth={2.5}
          className="text-primary-foreground"
        />
      ) : (
        <ArrowRight
          size={24}
          strokeWidth={2.5}
          className="text-primary-foreground"
        />
      )}
    </Button>
  );
}
