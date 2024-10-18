import { PostgrestError } from "@supabase/supabase-js";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

import { supabase } from "@/config/supabase";
import { Event } from "@/typesHelper";

export function useEvents(): UseQueryResult<Event[], PostgrestError> {
	return useQuery<Event[], PostgrestError>({
		queryKey: ["open-todos"],
		queryFn: async (): Promise<Event[]> => {
			const { data, error } = await supabase.from("events").select("*");
			if (error) {
				throw error;
			}
			return data;
		},
	});
}
