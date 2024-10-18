import { Tabs } from "expo-router";
import { Home, UserRound as Profile } from "lucide-react-native";
import { MotiView, useAnimationState } from "moti";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { colors } from "@/constants/colors";
import { useColorScheme } from "@/lib/useColorScheme";

export default function ProtectedLayout() {
	const { colorScheme } = useColorScheme();
	const bounceAnimation = useAnimationState({
		from: { scale: 1 },
		to: { scale: 1.2 },
		reset: { scale: 1 },
	});

	return (
		<GestureHandlerRootView>
			<Tabs
				screenOptions={{
					headerShown: false,
					tabBarStyle: {
						backgroundColor:
							colorScheme === "dark"
								? colors.dark.background
								: colors.light.background,
					},
					tabBarActiveTintColor:
						colorScheme === "dark"
							? colors.dark.foreground
							: colors.light.foreground,
					tabBarShowLabel: false,
				}}
			>
				<Tabs.Screen
					name="index"
					options={{
						tabBarIcon: ({ focused }) => (
							<MotiView state={focused ? bounceAnimation : undefined}>
								<Home stroke="black" fill={focused ? "black" : "none"} />
							</MotiView>
						),
					}}
				/>
				<Tabs.Screen
					name="settings"
					options={{
						tabBarIcon: ({ focused }) => (
							<MotiView state={focused ? bounceAnimation : undefined}>
								<Profile stroke="black" fill={focused ? "black" : "none"} />
							</MotiView>
						),
					}}
				/>
			</Tabs>
		</GestureHandlerRootView>
	);
}
