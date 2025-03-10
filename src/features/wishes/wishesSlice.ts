import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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
}

// Начальное состояние
const initialState: WishesState = {
	items: [],
};

// Загрузка сохраненных желаний из localStorage
const loadWishes = (): WishesState => {
	try {
		const savedWishes = localStorage.getItem("wishes");
		if (savedWishes) {
			const parsedWishes = JSON.parse(savedWishes, (key, value) => {
				if (key === "createdAt") {
					return new Date(value);
				}
				return value;
			});
			return { items: parsedWishes };
		}
	} catch (e) {
		console.error("Ошибка при загрузке желаний из localStorage:", e);
	}
	return initialState;
};

// Создание slice
const wishesSlice = createSlice({
	name: "wishes",
	initialState: loadWishes(),
	reducers: {
		// Добавление нового желания
		addWish: {
			reducer: (state, action: PayloadAction<Wish>) => {
				state.items.push(action.payload);
				saveWishesToLocalStorage(state.items);
			},
			prepare: (title: string, description: string) => ({
				payload: {
					id: Date.now().toString(),
					title,
					description,
					completed: false,
					createdAt: new Date(),
				},
			}),
		},

		// Удаление желания
		removeWish: (state, action: PayloadAction<string>) => {
			state.items = state.items.filter((wish) => wish.id !== action.payload);
			saveWishesToLocalStorage(state.items);
		},

		// Обновление статуса "выполнено"
		toggleWishCompleted: (state, action: PayloadAction<string>) => {
			const wish = state.items.find((wish) => wish.id === action.payload);
			if (wish) {
				wish.completed = !wish.completed;
				saveWishesToLocalStorage(state.items);
			}
		},
	},
});

// Функция для сохранения желаний в localStorage
const saveWishesToLocalStorage = (wishes: Wish[]) => {
	localStorage.setItem("wishes", JSON.stringify(wishes));
};

// Экспорт actions и reducer
export const { addWish, removeWish, toggleWishCompleted } = wishesSlice.actions;
export default wishesSlice.reducer;
