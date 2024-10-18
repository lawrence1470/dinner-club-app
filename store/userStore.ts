import { Session, User } from "@supabase/supabase-js";
import { create } from "zustand";

import { supabase } from "@/config/supabase";

type UserStoreState = {
	user: User | null;
	session: Session | null;
	initialized: boolean;
	signUp: (email: string, password: string) => Promise<void>;
	signInWithPassword: (email: string, password: string) => Promise<void>;
	signOut: () => Promise<void>;
	setUser: (user: User | null) => void;
	setSession: (session: Session | null) => void;
	setInitialized: (initialized: boolean) => void;
};

export const useUserStore = create<UserStoreState>((set) => ({
	user: null,
	session: null,
	initialized: false,
	signUp: async (email: string, password: string) => {
		const { data: user, error } = await supabase.auth.signUp({
			email,
			password,
		});
		if (error) {
			throw error;
		}
	},
	signInWithPassword: async (email: string, password: string) => {
		const { error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});
		if (error) {
			throw error;
		}
	},
	signOut: async () => {
		const { error } = await supabase.auth.signOut();
		if (error) {
			throw error;
		}
	},
	setUser: (user) => set({ user }),
	setSession: (session) => set({ session }),
	setInitialized: (initialized) => set({ initialized }),
}));
