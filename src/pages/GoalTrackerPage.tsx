import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
	Box,
	Container,
	Typography,
	Button,
	List,
	ListItem,
	ListItemText,
	Paper,
	TextField,
	Grid,
	Chip,
	IconButton,
	Avatar,
	LinearProgress,
	Divider,
	Card,
	CardContent,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	MenuItem,
	Select,
	FormControl,
	InputLabel,
	FormHelperText,
	Tooltip,
} from "@mui/material";
import {
	Add as AddIcon,
	Delete as DeleteIcon,
	Edit as EditIcon,
	Check as CheckIcon,
	EmojiEvents as TrophyIcon,
	ArrowForward as ArrowIcon,
} from "@mui/icons-material";
import { MentorType } from "./MentorSelectionPage";

// Интерфейс для цели
interface Goal {
	id: string;
	title: string;
	description: string;
	dueDate?: Date;
	steps: {
		id: string;
		title: string;
		completed: boolean;
	}[];
	category: string;
	priority: "low" | "medium" | "high";
	completed: boolean;
	progress: number;
}

// Интерфейс для наставника
interface MentorFeedback {
	greeting: string;
	encouragement: string[];
	completion: string[];
	newGoal: string[];
}

// Словарь сообщений для разных типов наставников
const mentorFeedbacks: Record<MentorType, MentorFeedback> = {
	friend: {
		greeting: "Hi there! Ready to achieve some goals today?",
		encouragement: [
			"You're doing great! Keep going!",
			"I believe in you! You can do this!",
			"Every step counts. I'm proud of your progress!",
		],
		completion: [
			"Awesome job completing your goal! 🎉",
			"You did it! I knew you could!",
			"What an achievement! You should be proud!",
		],
		newGoal: [
			"That's an excellent goal to set!",
			"I'll help you achieve this new goal!",
			"Let's break down this goal into manageable steps!",
		],
	},
	warrior: {
		greeting: "Time to conquer your challenges.",
		encouragement: [
			"Push through! Victory awaits those who persevere!",
			"Pain is temporary, achievement lasts forever!",
			"No excuses. Only results matter!",
		],
		completion: [
			"Mission accomplished. But the war continues.",
			"One battle won. Prepare for the next.",
			"Victory is yours. Well earned.",
		],
		newGoal: [
			"A worthy challenge. We will conquer it.",
			"This goal will test your limits. Good.",
			"Every obstacle is an opportunity for growth.",
		],
	},
	strategist: {
		greeting: "Let's review your strategy for success today.",
		encouragement: [
			"Your progress indicates a 73% higher chance of success.",
			"Analyzing your pattern: consistent effort leads to results.",
			"Statistically speaking, you're on the optimal path.",
		],
		completion: [
			"Goal achieved with optimal efficiency.",
			"Analysis complete: Success rate 100%. Excellent execution.",
			"Objective completed. Planning next phase...",
		],
		newGoal: [
			"I've analyzed this goal. It's challenging but achievable.",
			"Breaking this down into steps will increase success probability by 86%.",
			"A strategic approach will be essential for this objective.",
		],
	},
};

// Изображения для наставников
const mentorImages: Record<MentorType, string> = {
	friend:
		"https://img.freepik.com/free-photo/3d-illustration-cartoon-character-with-glasses-jacket_1142-32498.jpg?w=996&t=st=1700924558~exp=1700925158~hmac=6f3f7f3b9f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f",
	warrior:
		"https://img.freepik.com/free-photo/3d-illustration-cartoon-muscular-character-with-beard-glasses_1142-41887.jpg?w=996&t=st=1700924668~exp=1700925268~hmac=6f3f7f3b9f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f",
	strategist:
		"https://img.freepik.com/free-photo/3d-illustration-cartoon-character-with-glasses-bow-tie_1142-32490.jpg?w=996&t=st=1700924758~exp=1700925358~hmac=6f3f7f3b9f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f",
};

const initialGoals: Goal[] = [
	{
		id: "goal-1",
		title: "Выучить React и TypeScript",
		description:
			"Освоить основы React и TypeScript для создания современных веб-приложений",
		steps: [
			{ id: "step-1-1", title: "Изучить основы React", completed: true },
			{ id: "step-1-2", title: "Изучить основы TypeScript", completed: false },
			{ id: "step-1-3", title: "Создать простое приложение", completed: false },
		],
		category: "Обучение",
		priority: "high",
		completed: false,
		progress: 33,
	},
	{
		id: "goal-2",
		title: "Заниматься спортом регулярно",
		description:
			"Установить регулярный режим тренировок для улучшения физической формы",
		steps: [
			{ id: "step-2-1", title: "Составить план тренировок", completed: true },
			{ id: "step-2-2", title: "Заниматься 3 раза в неделю", completed: false },
		],
		category: "Здоровье",
		priority: "medium",
		completed: false,
		progress: 50,
	},
];

const GoalTrackerPage = () => {
	const navigate = useNavigate();
	const [selectedMentor, setSelectedMentor] = useState<MentorType | null>(null);
	const [goals, setGoals] = useState<Goal[]>([]);
	const [openDialog, setOpenDialog] = useState(false);
	const [editMode, setEditMode] = useState(false);
	const [mentorMessage, setMentorMessage] = useState("");
	const [newStep, setNewStep] = useState("");
	const [newGoal, setNewGoal] = useState<Partial<Goal>>({
		title: "",
		description: "",
		category: "personal",
		priority: "medium",
		steps: [],
		completed: false,
		progress: 0,
	});

	// Check if mentor is selected
	useEffect(() => {
		const mentor = localStorage.getItem("selectedMentor") as MentorType | null;

		if (!mentor) {
			navigate("/select-mentor");
		} else {
			setSelectedMentor(mentor);
			// Set initial greeting
			if (mentorFeedbacks[mentor]) {
				setMentorMessage(mentorFeedbacks[mentor].greeting);
			}
		}

		// Load goals from localStorage
		const savedGoals = localStorage.getItem("goals");
		if (savedGoals) {
			setGoals(JSON.parse(savedGoals));
		} else {
			// Set some initial goals for demo purposes
			setGoals(initialGoals);
		}
	}, [navigate]);

	// Save goals to localStorage when changed
	useEffect(() => {
		if (goals.length > 0) {
			localStorage.setItem("goals", JSON.stringify(goals));
		}
	}, [goals]);

	// Generate random encouragement message
	const getRandomMessage = (messageType: keyof MentorFeedback) => {
		if (!selectedMentor) return "";

		const messages = mentorFeedbacks[selectedMentor][messageType];
		const randomIndex = Math.floor(Math.random() * messages.length);
		return messages[randomIndex];
	};

	// Handle adding a new step
	const handleAddStep = () => {
		if (!newStep.trim()) return;

		const newStepObj = {
			id: Date.now().toString(),
			title: newStep,
			completed: false,
		};

		setNewGoal({
			...newGoal,
			steps: [...(newGoal.steps || []), newStepObj],
		});

		setNewStep("");
	};

	// Handle removing a step
	const handleRemoveStep = (stepId: string) => {
		setNewGoal({
			...newGoal,
			steps: (newGoal.steps || []).filter((step) => step.id !== stepId),
		});
	};

	// Handle saving a goal
	const handleSaveGoal = () => {
		if (!newGoal.title?.trim()) return;

		if (editMode && newGoal.id) {
			// Update existing goal
			setGoals(
				goals.map((goal) =>
					goal.id === newGoal.id ? { ...(newGoal as Goal) } : goal
				)
			);
			setMentorMessage(getRandomMessage("encouragement"));
		} else {
			// Add new goal
			const goal: Goal = {
				...(newGoal as Goal),
				id: Date.now().toString(),
				completed: false,
				progress: 0,
			};
			setGoals([...goals, goal]);
			setMentorMessage(getRandomMessage("newGoal"));
		}

		setOpenDialog(false);
		setNewGoal({
			title: "",
			description: "",
			category: "personal",
			priority: "medium",
			steps: [],
			completed: false,
			progress: 0,
		});
		setEditMode(false);
	};

	// Handle editing a goal
	const handleEditGoal = (goalId: string) => {
		const goalToEdit = goals.find((goal) => goal.id === goalId);
		if (goalToEdit) {
			setNewGoal(goalToEdit);
			setEditMode(true);
			setOpenDialog(true);
		}
	};

	// Handle deleting a goal
	const handleDeleteGoal = (goalId: string) => {
		setGoals(goals.filter((goal) => goal.id !== goalId));
	};

	// Handle toggling a step
	const handleToggleStep = (goalId: string, stepId: string) => {
		setGoals(
			goals.map((goal) => {
				if (goal.id === goalId) {
					const updatedSteps = goal.steps.map((step) =>
						step.id === stepId ? { ...step, completed: !step.completed } : step
					);

					// Calculate progress
					const totalSteps = updatedSteps.length;
					const completedSteps = updatedSteps.filter(
						(step) => step.completed
					).length;
					const progress =
						totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

					// Check if all steps are completed
					const allCompleted = totalSteps > 0 && completedSteps === totalSteps;

					if (allCompleted && !goal.completed) {
						// Goal just completed
						setMentorMessage(getRandomMessage("completion"));
					} else if (!allCompleted && goal.completed) {
						// Goal uncompleted
						setMentorMessage(getRandomMessage("encouragement"));
					}

					return {
						...goal,
						steps: updatedSteps,
						progress,
						completed: allCompleted,
					};
				}
				return goal;
			})
		);
	};

	return (
		<Container maxWidth="md" sx={{ py: 2 }}>
			{/* Mentor Section */}
			{selectedMentor && (
				<Paper
					elevation={0}
					sx={{
						p: 3,
						mb: 4,
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						border: "1px solid #e0e0e0",
						borderRadius: 2,
						boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
					}}
				>
					<Box display="flex" alignItems="center">
						<Avatar
							src={mentorImages[selectedMentor]}
							sx={{
								width: 60,
								height: 60,
								mr: 2,
								boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
							}}
							alt={selectedMentor}
						/>
						<Box>
							<Typography variant="subtitle1" fontWeight="500">
								{selectedMentor === "friend"
									? "Supportive Friend"
									: selectedMentor === "warrior"
									? "Determined Warrior"
									: "Strategic Thinker"}
							</Typography>
							<Typography variant="body1">{mentorMessage}</Typography>
						</Box>
					</Box>

					<Button
						variant="outlined"
						size="small"
						onClick={() => navigate("/select-mentor")}
						sx={{
							minWidth: "auto",
							ml: 2,
						}}
					>
						Change Mentor
					</Button>
				</Paper>
			)}

			{/* Header and Add Button */}
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					mb: 3,
				}}
			>
				<Typography variant="h5" component="h1">
					Your Goals
				</Typography>
				<Button
					variant="contained"
					color="primary"
					startIcon={<AddIcon />}
					onClick={() => {
						setEditMode(false);
						setOpenDialog(true);
					}}
					sx={{
						borderRadius: 2,
						textTransform: "none",
						boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
					}}
				>
					Add Goal
				</Button>
			</Box>

			{/* Goals Grid */}
			{goals.length > 0 ? (
				<Grid container spacing={3}>
					{goals.map((goal) => (
						<Grid item xs={12} key={goal.id}>
							<Card
								elevation={0}
								sx={{
									borderRadius: 2,
									border: "1px solid #e0e0e0",
									boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
									transition: "transform 0.2s",
									"&:hover": {
										transform: "translateY(-2px)",
										boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
									},
								}}
							>
								<CardContent>
									<Box
										sx={{
											display: "flex",
											justifyContent: "space-between",
											mb: 2,
										}}
									>
										<Box>
											<Typography variant="h6" component="h2">
												{goal.title}
											</Typography>
											{goal.description && (
												<Typography
													variant="body2"
													color="text.secondary"
													sx={{ mb: 1 }}
												>
													{goal.description}
												</Typography>
											)}
											<Box sx={{ display: "flex", gap: 1, mt: 1 }}>
												<Chip
													size="small"
													label={goal.category}
													variant="outlined"
													sx={{ borderRadius: 1 }}
												/>
												<Chip
													size="small"
													label={goal.priority}
													color={
														goal.priority === "high"
															? "error"
															: goal.priority === "medium"
															? "warning"
															: "default"
													}
													variant="outlined"
													sx={{ borderRadius: 1 }}
												/>
												{goal.completed && (
													<Chip
														size="small"
														label="Completed"
														color="success"
														icon={<CheckIcon />}
														sx={{ borderRadius: 1 }}
													/>
												)}
											</Box>
										</Box>
										<Box>
											<Tooltip title="Edit">
												<IconButton
													size="small"
													onClick={() => handleEditGoal(goal.id)}
													sx={{ color: "primary.main" }}
												>
													<EditIcon fontSize="small" />
												</IconButton>
											</Tooltip>
											<Tooltip title="Delete">
												<IconButton
													size="small"
													onClick={() => handleDeleteGoal(goal.id)}
													sx={{ color: "error.light" }}
												>
													<DeleteIcon fontSize="small" />
												</IconButton>
											</Tooltip>
										</Box>
									</Box>

									{/* Progress bar */}
									<Box sx={{ mt: 1, mb: 2 }}>
										<Box
											sx={{
												display: "flex",
												justifyContent: "space-between",
												mb: 0.5,
											}}
										>
											<Typography variant="body2" color="text.secondary">
												Progress
											</Typography>
											<Typography variant="body2" color="text.secondary">
												{Math.round(goal.progress)}%
											</Typography>
										</Box>
										<LinearProgress
											variant="determinate"
											value={goal.progress}
											sx={{
												height: 6,
												borderRadius: 3,
												bgcolor: "rgba(0,0,0,0.05)",
											}}
										/>
									</Box>

									{/* Steps */}
									<Typography variant="subtitle2" gutterBottom>
										Steps:
									</Typography>
									<List dense disablePadding>
										{goal.steps.map((step) => (
											<ListItem
												key={step.id}
												disablePadding
												sx={{
													py: 0.5,
													opacity: step.completed ? 0.7 : 1,
												}}
											>
												<Chip
													icon={step.completed ? <CheckIcon /> : undefined}
													label={step.title}
													onClick={() => handleToggleStep(goal.id, step.id)}
													color={step.completed ? "success" : "default"}
													variant={step.completed ? "filled" : "outlined"}
													sx={{
														borderRadius: 1,
														textDecoration: step.completed
															? "line-through"
															: "none",
														cursor: "pointer",
														"&:hover": {
															bgcolor: step.completed
																? "success.light"
																: "primary.light",
															color: "white",
														},
													}}
												/>
											</ListItem>
										))}
									</List>
								</CardContent>
							</Card>
						</Grid>
					))}
				</Grid>
			) : (
				<Paper
					elevation={0}
					sx={{
						p: 4,
						textAlign: "center",
						borderRadius: 2,
						border: "1px dashed #ccc",
					}}
				>
					<Typography variant="h6" color="text.secondary" gutterBottom>
						No goals yet
					</Typography>
					<Typography variant="body2" color="text.secondary" paragraph>
						Start by adding your first goal
					</Typography>
					<Button
						variant="outlined"
						startIcon={<AddIcon />}
						onClick={() => {
							setEditMode(false);
							setOpenDialog(true);
						}}
					>
						Add Goal
					</Button>
				</Paper>
			)}

			{/* Dialog for adding/editing goals */}
			<Dialog
				open={openDialog}
				onClose={() => setOpenDialog(false)}
				maxWidth="sm"
				fullWidth
				PaperProps={{
					elevation: 8,
					sx: { borderRadius: 2 },
				}}
			>
				<DialogTitle>{editMode ? "Edit Goal" : "Add New Goal"}</DialogTitle>
				<DialogContent dividers>
					<Grid container spacing={2} sx={{ pt: 1 }}>
						<Grid item xs={12}>
							<TextField
								label="Goal Title"
								value={newGoal.title || ""}
								onChange={(e) =>
									setNewGoal({ ...newGoal, title: e.target.value })
								}
								fullWidth
								variant="outlined"
								placeholder="What do you want to achieve?"
								required
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								label="Description"
								value={newGoal.description || ""}
								onChange={(e) =>
									setNewGoal({ ...newGoal, description: e.target.value })
								}
								fullWidth
								multiline
								rows={2}
								variant="outlined"
								placeholder="Add some details about your goal"
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<FormControl fullWidth variant="outlined">
								<InputLabel>Category</InputLabel>
								<Select
									value={newGoal.category || "personal"}
									onChange={(e) =>
										setNewGoal({ ...newGoal, category: e.target.value })
									}
									label="Category"
								>
									<MenuItem value="personal">Personal</MenuItem>
									<MenuItem value="work">Work</MenuItem>
									<MenuItem value="health">Health</MenuItem>
									<MenuItem value="education">Education</MenuItem>
									<MenuItem value="finance">Finance</MenuItem>
								</Select>
							</FormControl>
						</Grid>
						<Grid item xs={12} sm={6}>
							<FormControl fullWidth variant="outlined">
								<InputLabel>Priority</InputLabel>
								<Select
									value={newGoal.priority || "medium"}
									onChange={(e) =>
										setNewGoal({ ...newGoal, priority: e.target.value as any })
									}
									label="Priority"
								>
									<MenuItem value="low">Low</MenuItem>
									<MenuItem value="medium">Medium</MenuItem>
									<MenuItem value="high">High</MenuItem>
								</Select>
							</FormControl>
						</Grid>
						<Grid item xs={12}>
							<Divider sx={{ my: 1 }} />
							<Typography variant="subtitle1" gutterBottom>
								Steps to achieve this goal
							</Typography>

							{/* List of steps */}
							<List sx={{ bgcolor: "#f9f9f9", borderRadius: 1, mb: 2 }}>
								{(newGoal.steps || []).length > 0 ? (
									(newGoal.steps || []).map((step, index) => (
										<ListItem
											key={step.id}
											secondaryAction={
												<IconButton
													edge="end"
													onClick={() => handleRemoveStep(step.id)}
													size="small"
												>
													<DeleteIcon fontSize="small" />
												</IconButton>
											}
										>
											<ListItemText primary={`${index + 1}. ${step.title}`} />
										</ListItem>
									))
								) : (
									<ListItem>
										<ListItemText
											primary="No steps added yet"
											primaryTypographyProps={{
												color: "text.secondary",
												fontStyle: "italic",
											}}
										/>
									</ListItem>
								)}
							</List>

							{/* Add step input */}
							<Box sx={{ display: "flex", gap: 1 }}>
								<TextField
									label="New Step"
									value={newStep}
									onChange={(e) => setNewStep(e.target.value)}
									fullWidth
									variant="outlined"
									placeholder="Add a step to achieve your goal"
									size="small"
									onKeyPress={(e) => {
										if (e.key === "Enter") {
											handleAddStep();
										}
									}}
								/>
								<Button
									variant="outlined"
									onClick={handleAddStep}
									disabled={!newStep.trim()}
									sx={{ whiteSpace: "nowrap" }}
								>
									Add Step
								</Button>
							</Box>
							<FormHelperText>Press Enter to quickly add a step</FormHelperText>
						</Grid>
					</Grid>
				</DialogContent>
				<DialogActions sx={{ px: 3, py: 2 }}>
					<Button
						onClick={() => setOpenDialog(false)}
						sx={{ color: "text.secondary" }}
					>
						Cancel
					</Button>
					<Button
						onClick={handleSaveGoal}
						variant="contained"
						disabled={!newGoal.title?.trim()}
						endIcon={<ArrowIcon />}
					>
						{editMode ? "Update Goal" : "Create Goal"}
					</Button>
				</DialogActions>
			</Dialog>
		</Container>
	);
};

export default GoalTrackerPage;
