import { Check } from "lucide-react-native";
import React from "react";
import { TouchableOpacity, View } from "react-native";

import { cn } from "@/lib/utils";

const Checkbox = ({
	className,
	checked,
	...props
}: React.ComponentPropsWithoutRef<typeof TouchableOpacity> & {
	checked?: boolean;
}) => (
	<TouchableOpacity
		className={cn(
			"peer h-8 w-8 shrink-0 border rounded-md",
			checked
				? "bg-black border-black"
				: "bg-transparent border-gray-200 bg-gray-200",
			className,
		)}
		{...props}
	>
		{checked && (
			<View className="flex-row items-center justify-center text-current">
				<Check className="h-4 w-4" stroke="white" />
			</View>
		)}
	</TouchableOpacity>
);

export { Checkbox };
