import { View } from "react-native";

import { cn } from "@/lib/utils";

function Skeleton({
	className,
	...props
}: React.ComponentPropsWithoutRef<typeof View>) {
	return (
		<View
			className={cn("animate-pulse rounded-md bg-muted", className)}
			{...props}
		/>
	);
}

export { Skeleton };
