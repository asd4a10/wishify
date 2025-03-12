import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

// API URL
const API_URL = "https://wishify.kz/api/v1/wishes";

// Обновленный тип Wish
export interface Wish {
	id: string;
	title: string;
	description: string;
	isPurchased: boolean; // было completed
	username: string;
	price: number;
	targetDate: Date;
	imageUrl: string;
	productUrl: string;
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

// Обновленный тип для параметров запроса
type AddWishParams = {
	title: string;
	description: string;
	username: string; // было userId
	price?: number;
	targetDate?: Date;
	imageUrl?: string;
	productUrl?: string;
};

// Асинхронные действия с использованием createAsyncThunk

// Получение списка желаний
export const fetchWishes = createAsyncThunk(
	"wishes/fetchWishes",
	async (username: string) => {
		console.log("fetchWishes for user", username);
		const response = await fetch(`${API_URL}?username=${username}`);

		if (!response.ok) {
			throw new Error("Не удалось загрузить данные");
		}

		const data = await response.json();
		return data.map((wish: any) => ({
			...wish,
			createdAt: new Date(wish.createdAt),
			targetDate: wish.targetDate ? new Date(wish.targetDate) : null,
		}));
	}
);

// Добавление нового желания
export const addWishAsync = createAsyncThunk(
	"wishes/addWish",
	async ({
		title,
		description,
		username,
		price,
		targetDate,
		imageUrl,
		productUrl,
	}: AddWishParams) => {
		const newWish = {
			title,
			description,
			username,
			isPurchased: false, // было completed
			price: price || 0,
			targetDate: targetDate || null,
			imageUrl: imageUrl || "",
			productUrl: productUrl || "",
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
			targetDate: data.targetDate ? new Date(data.targetDate) : null,
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
export const editWishAsync = createAsyncThunk(
	"wishes/editWishAsync",
	async (
		{ id, changes }: { id: string; changes: Partial<Wish> },
		{ getState }
	) => {
		// Получаем текущее состояние
		const state = getState() as { wishes: WishesState };

		// Находим текущее желание
		const currentWish = state.wishes.items.find((wish) => wish.id === id);

		if (!currentWish) {
			throw new Error("Желание не найдено");
		}

		// Создаем полный объект, объединяя текущее желание с изменениями
		const updatedWish = {
			...currentWish,
			...changes,
		};

		// Отправляем полный объект в PUT запросе
		const response = await fetch(`${API_URL}/${id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(updatedWish),
		});

		if (!response.ok) {
			throw new Error("Failed to edit wish");
		}

		// Возвращаем только id и изменения для обновления Redux-состояния
		return { id, changes };
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
			prepare: (
				title: string,
				description: string,
				price: number,
				targetDate: Date,
				productUrl: string,
				imageUrl: string
			) => ({
				payload: {
					id: Date.now().toString(), // Временный ID до ответа от сервера
					title,
					description,
					isPurchased: false, // было completed
					username: "",
					price: price || 0,
					targetDate: targetDate || null,
					imageUrl: imageUrl || "",
					productUrl: productUrl || "",
					createdAt: new Date(),
				},
			}),
		},
		removeWish: (state, action: PayloadAction<string>) => {
			state.items = state.items.filter((wish) => wish.id !== action.payload);
		},
		editWish: (
			state,
			action: PayloadAction<{ id: string; changes: Partial<Wish> }>
		) => {
			const { id, changes } = action.payload;
			const wishIndex = state.items.findIndex((wish) => wish.id === id);

			if (wishIndex !== -1) {
				// Обновляем только указанные поля
				state.items[wishIndex] = {
					...state.items[wishIndex],
					...changes,
				};
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

			// Обработка editWishAsync
			.addCase(editWishAsync.pending, (state) => {
				state.status = "loading";
			})
			.addCase(editWishAsync.fulfilled, (state, action) => {
				state.status = "succeeded";
				const index = state.items.findIndex(
					(wish) => wish.id === action.payload.id
				);
				if (index !== -1) {
					state.items[index] = {
						...state.items[index],
						...action.payload.changes,
					};
				}
			})
			.addCase(editWishAsync.rejected, (state, action) => {
				state.status = "failed";
				state.error =
					action.error.message || "Не удалось редактировать желание";
			});
	},
});

// Экспорт actions и reducer
export const { addWish, removeWish, editWish } = wishesSlice.actions;
export default wishesSlice.reducer;
