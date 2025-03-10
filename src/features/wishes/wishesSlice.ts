import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

// API URL
const API_URL = "https://wishify.kz/api/v1/wishes";

// Типы
export interface Wish {
	id: string;
	title: string;
	description: string;
	completed: boolean;
	createdAt: Date;
}

interface WishesState {
	items: Wish[];
	status: "idle" | "loading" | "succeeded" | "failed";
	error: string | null;
}

// Начальное состояние
const initialState: WishesState = {
	items: [],
	status: "idle",
	error: null,
};

// Асинхронные действия с использованием createAsyncThunk

// Получение списка желаний
export const fetchWishes = createAsyncThunk("wishes/fetchWishes", async () => {
	console.log("fetchWishes");
	const username = "user_2sXlGpHGyRPAxXXUdOiG24rkUjA";
	const response = await fetch(`${API_URL}?username=${username}`);
	console.log("response", response);
	if (!response.ok) {
		throw new Error("Не удалось загрузить данные");
	}
	const data = await response.json();
	// Преобразуем строки дат в объекты Date
	return data.map((wish: any) => ({
		...wish,
		createdAt: new Date(wish.createdAt),
	}));
});

// Добавление нового желания
export const addWishAsync = createAsyncThunk(
	"wishes/addWish",
	async ({ title, description }: { title: string; description: string }) => {
		const newWish = {
			title,
			description,
			completed: false,
			createdAt: new Date(),
		};

		const response = await fetch(API_URL, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(newWish),
		});

		if (!response.ok) {
			throw new Error("Не удалось добавить желание");
		}

		const data = await response.json();
		return {
			...data,
			createdAt: new Date(data.createdAt),
		};
	}
);

// Удаление желания
export const removeWishAsync = createAsyncThunk(
	"wishes/removeWish",
	async (id: string) => {
		const response = await fetch(`${API_URL}/${id}`, {
			method: "DELETE",
		});

		if (!response.ok) {
			throw new Error("Не удалось удалить желание");
		}

		return id;
	}
);

// Обновление статуса желания
export const toggleWishCompletedAsync = createAsyncThunk(
	"wishes/toggleWishCompleted",
	async ({ id, completed }: { id: string; completed: boolean }) => {
		const response = await fetch(`${API_URL}/${id}`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ completed }),
		});

		if (!response.ok) {
			throw new Error("Не удалось обновить статус желания");
		}

		const data = await response.json();
		return {
			...data,
			createdAt: new Date(data.createdAt),
		};
	}
);

// Создание slice
const wishesSlice = createSlice({
	name: "wishes",
	initialState,
	reducers: {
		// Синхронные действия (будем использовать для оптимистичных обновлений UI)
		addWish: {
			reducer: (state, action: PayloadAction<Wish>) => {
				state.items.push(action.payload);
			},
			prepare: (title: string, description: string) => ({
				payload: {
					id: Date.now().toString(), // Временный ID до ответа от сервера
					title,
					description,
					completed: false,
					createdAt: new Date(),
				},
			}),
		},
		removeWish: (state, action: PayloadAction<string>) => {
			state.items = state.items.filter((wish) => wish.id !== action.payload);
		},
		toggleWishCompleted: (state, action: PayloadAction<string>) => {
			const wish = state.items.find((wish) => wish.id === action.payload);
			if (wish) {
				wish.completed = !wish.completed;
			}
		},
	},
	extraReducers: (builder) => {
		builder
			// Обработка fetchWishes
			.addCase(fetchWishes.pending, (state) => {
				state.status = "loading";
			})
			.addCase(fetchWishes.fulfilled, (state, action) => {
				state.status = "succeeded";
				state.items = action.payload;
			})
			.addCase(fetchWishes.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.error.message || "Неизвестная ошибка";
			})

			// Обработка addWishAsync
			.addCase(addWishAsync.pending, (state) => {
				state.status = "loading";
			})
			.addCase(addWishAsync.fulfilled, (state, action) => {
				state.status = "succeeded";
				state.items.push(action.payload);
			})
			.addCase(addWishAsync.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.error.message || "Не удалось добавить желание";
			})

			// Обработка removeWishAsync
			.addCase(removeWishAsync.pending, (state) => {
				state.status = "loading";
			})
			.addCase(removeWishAsync.fulfilled, (state, action) => {
				state.status = "succeeded";
				state.items = state.items.filter((wish) => wish.id !== action.payload);
			})
			.addCase(removeWishAsync.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.error.message || "Не удалось удалить желание";
			})

			// Обработка toggleWishCompletedAsync
			.addCase(toggleWishCompletedAsync.pending, (state) => {
				state.status = "loading";
			})
			.addCase(toggleWishCompletedAsync.fulfilled, (state, action) => {
				state.status = "succeeded";
				const index = state.items.findIndex(
					(wish) => wish.id === action.payload.id
				);
				if (index !== -1) {
					state.items[index] = action.payload;
				}
			})
			.addCase(toggleWishCompletedAsync.rejected, (state, action) => {
				state.status = "failed";
				state.error =
					action.error.message || "Не удалось обновить статус желания";
			});
	},
});

// Экспорт actions и reducer
export const { addWish, removeWish, toggleWishCompleted } = wishesSlice.actions;
export default wishesSlice.reducer;
