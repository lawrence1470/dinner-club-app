import BottomSheet, {
	BottomSheetBackdrop,
	BottomSheetFooter,
} from "@gorhom/bottom-sheet";
import { BottomSheetDefaultBackdropProps } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types";
import { BottomSheetDefaultFooterProps } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetFooter/types";
import { X as CloseIcon } from "lucide-react-native";
import { JSX, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
	Image,
	View,
	FlatList,
	SafeAreaView,
	ImageBackground,
	Pressable,
	Text,
	TouchableOpacity,
	StyleSheet,
} from "react-native";
import { MapPin, Aperture, DollarSign } from "react-native-feather";

import { useEvents } from "@/hooks/supabase/useEvents";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Muted, H2, Small, H3, H4 } from "@/components/ui/typography";
import { supabase } from "@/config/supabase";
import { Database } from "@/database.types";
import { cn, truncateString } from "@/lib/utils";
import { Event } from "@/typesHelper";

type Cuisine = Omit<
	Database["public"]["Tables"]["cuisines"]["Row"],
	"created_at"
>;

function ImageCover({ coverURL }: { coverURL: string }) {
	const [isLoading, setLoading] = useState(true);

	return (
		<View className="relative w-[128] h-[128]">
			{isLoading ? (
				<Skeleton className="rounded-xl w-[128] h-[128] absolute top-0 left-0" />
			) : null}
			<Image
				className={cn(
					"rounded-xl absolute top-0 left-0",
					isLoading ? "invisible" : "visible",
				)}
				height={128}
				width={128}
				source={{ uri: coverURL }}
				onLoadStart={() => setLoading(true)}
				onLoadEnd={() => setLoading(false)}
			/>
		</View>
	);
}

export default function Screen() {
	const snapPoints = useMemo(() => ["90%"], []);
	const bottomSheetRef = useRef<BottomSheet>(null);
	const [cuisines, setCuisines] = useState<Cuisine[] | null>(null);
	const [selectedCuisines, setSelectedCuisines] = useState<number[]>([]);
	const events = useEvents();

	useEffect(() => {
		const fetchCuisines = async () => {
			const { data, error } = await supabase
				.from("cuisines")
				.select("id, name");
			if (error) {
				//TODO: handle error
				console.log("error", error);
			}
			setCuisines(data);
		};
		fetchCuisines();
	}, []);

	const renderBackdrop = useCallback(
		(props: JSX.IntrinsicAttributes & BottomSheetDefaultBackdropProps) => {
			return (
				<BottomSheetBackdrop
					{...props}
					appearsOnIndex={0}
					disappearsOnIndex={-1}
					pressBehavior="close"
				/>
			);
		},
		[],
	);

	const renderFooter = useCallback(
		(props: JSX.IntrinsicAttributes & BottomSheetDefaultFooterProps) => (
			<BottomSheetFooter {...props} bottomInset={24}>
				<View style={styles.footerContainer}>
					<Text style={styles.footerText}>Footer</Text>
				</View>
			</BottomSheetFooter>
		),
		[],
	);

	function handleOpenSheet() {
		bottomSheetRef.current?.snapToIndex(0);
	}

	function handleCloseSheet() {
		bottomSheetRef.current?.close();
	}

	function handleCuisines(id: number) {
		const index = selectedCuisines.indexOf(id);
		if (index === -1) {
			setSelectedCuisines([...selectedCuisines, id]);
		} else {
			const newCuisines = selectedCuisines.filter((cuisine) => cuisine !== id);
			setSelectedCuisines(newCuisines);
		}
	}

	return (
		<View className="flex bg-background">
			<ImageBackground className="bg-black py-2 justify-end">
				<SafeAreaView>
					<View className="px-4">
						<View className="mb-3">
							<Input placeholder="Search for a cafe" />
						</View>
						<View className="flex-row gap-x-2">
							<Pressable
								onPress={handleOpenSheet}
								className="flex-row bg-gray-600 items-center py-2 px-2 w-auto rounded-md"
							>
								<Aperture stroke="white" height={16} width={16} />
								<Small className="color-white leading-normal ml-1">test</Small>
							</Pressable>
							<View className="flex-row bg-gray-600 items-center py-2 px-2 w-auto rounded-md">
								<DollarSign stroke="white" height={16} width={16} />
								<Small className="color-white leading-normal ml-1">Price</Small>
							</View>
							<Pressable>
								<View className="flex-row bg-gray-600 items-center py-2 px-2 w-auto rounded-md z-50">
									<Aperture stroke="white" height={16} width={16} />
									<Small className="color-white leading-normal ml-1">
										test
									</Small>
								</View>
							</Pressable>
							<View className="flex-row bg-gray-600 items-center py-2 px-2 w-auto rounded-md">
								<Aperture stroke="white" height={16} width={16} />
								<Small className="color-white leading-normal ml-1">Sort</Small>
							</View>
						</View>
					</View>
				</SafeAreaView>
			</ImageBackground>
			<View className="p-4 basis-3/12">
				<View className="w-full">
					<H2 className="text-left">Nearby</H2>
				</View>
			</View>
			<View className="p-4 relative basis-full">
				<View className="w-full">
					<H2 className="text-left">All Cafes</H2>
				</View>
				{events.data && (
					<FlatList<Event>
						className="w-full"
						data={events.data}
						renderItem={({ item }) => {
							return (
								<Card key={item.id} className="w-full border-0">
									<View className="flex-row">
										<CardHeader className="justify-center pl-0 relative">
											<ImageCover coverURL={item.coverURL} />
										</CardHeader>
										<View>
											<CardHeader>
												<CardTitle>{item.event_name}</CardTitle>
												<CardDescription>Bakery</CardDescription>
											</CardHeader>
											<CardContent>
												<Muted>
													{truncateString(
														"This is a highly acclaimed coffee shop in New York City, specializing in italian coffees and traditional baked goods from the Emilia-Romagna region. Known for its authentic flavors and cozy atmosphere, it has quickly become a favorite among food enthusiasts and critics alike.",
														100,
													)}
												</Muted>
											</CardContent>
											<CardFooter>
												<View className="flex-row items-center border-gray-100 border-2 p-1 px-2 bg-gray-50 rounded-2xl">
													<MapPin height={16} stroke="gray" />
													<Muted>{item.neighborhood}</Muted>
												</View>
											</CardFooter>
										</View>
									</View>
								</Card>
							);
						}}
					/>
				)}
			</View>
			<BottomSheet
				enablePanDownToClose
				ref={bottomSheetRef}
				index={-1}
				snapPoints={snapPoints}
				backdropComponent={renderBackdrop}
				footerComponent={renderFooter}
			>
				<View className="p-4">
					<TouchableOpacity
						onPress={handleCloseSheet}
						className="absolute top-0 right-4"
					>
						<CloseIcon />
					</TouchableOpacity>
					<H3 className="text-left w-full py-2">Filter by Cuisine </H3>
					{cuisines?.length ? (
						<FlatList
							ItemSeparatorComponent={() => (
								<View className="border-b border-gray-300" />
							)}
							className="w-full"
							data={cuisines}
							renderItem={({ item }) => (
								<View
									className="flex-row items-center py-4 w-auto rounded-md"
									key={item.id}
								>
									<H4 className="leading-normal ml-1">{item.name}</H4>
									<Checkbox
										className="ml-auto"
										checked={selectedCuisines.includes(item.id)}
										onPress={() => handleCuisines(item.id)}
									/>
								</View>
							)}
						/>
					) : null}
				</View>
			</BottomSheet>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 24,
		backgroundColor: "grey",
	},
	contentContainer: {
		flex: 1,
		alignItems: "center",
	},
	footerContainer: {
		padding: 12,
		margin: 12,
		borderRadius: 12,
		backgroundColor: "#80f",
	},
	footerText: {
		textAlign: "center",
		color: "white",
		fontWeight: "800",
	},
});
