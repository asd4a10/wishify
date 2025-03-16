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
	targetDate?: Date; // Делаем targetDate опциональным полем
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

// Асинхронный thunk для обновления желания на сервере
export const editWishAsync = createAsyncThunk(
	"wishes/editWishAsync",
	async (
		{ id, changes }: { id: string; changes: Partial<Wish> },
		{ getState }
	) => {
		try {
			// Получаем текущее состояние
			const state = getState() as { wishes: WishesState };

			// Находим текущее желание
			const currentWish = state.wishes.items.find((wish) => wish.id === id);

			if (!currentWish) {
				throw new Error("Желание не найдено");
			}

			// Создаем полный обновленный объект
			const updatedWish = {
				...currentWish,
				...changes,
			};

			// Отправляем запрос на сервер
			const response = await fetch(`${API_URL}/${id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(updatedWish),
			});

			if (!response.ok) {
				throw new Error("Не удалось обновить желание");
			}

			// Возвращаем ответ сервера или информацию об обновлении
			const data = await response.json();
			return {
				id,
				changes: data, // Возвращаем полученные с сервера данные
			};
		} catch (error) {
			console.error("Error updating wish:", error);
			throw error;
		}
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
			const existingWish = state.items.find((wish) => wish.id === id);
			if (existingWish) {
				// Обновляем существующее желание всеми предоставленными изменениями
				Object.assign(existingWish, changes);
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

				// Обновляем локальное состояние только после успешного ответа сервера
				const index = state.items.findIndex(
					(wish) => wish.id === action.payload.id
				);

				if (index !== -1) {
					// Если получаем полный объект с сервера
					if (
						typeof action.payload.changes === "object" &&
						action.payload.changes !== null
					) {
						state.items[index] = {
							...state.items[index],
							...action.payload.changes,
						};
					}
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
