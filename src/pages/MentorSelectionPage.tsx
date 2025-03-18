import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	Box,
	Typography,
	Grid,
	Paper,
	Button,
	Container,
	Radio,
	Card,
	CardContent,
	CardActionArea,
} from "@mui/material";

// Mentor types
export type MentorType = "friend" | "warrior" | "strategist";

// Mentor interface
interface Mentor {
	id: MentorType;
	name: string;
	description: string;
	traits: string[];
	quote: string;
	imageUrl: string;
}

// Mentor data
const mentors: Mentor[] = [
	{
		id: "friend",
		name: "Supportive Friend",
		description:
			"A kind and encouraging mentor who believes in your potential.",
		traits: ["Supportive", "Patient", "Understanding"],
		quote: "I believe in you! We'll achieve your goals together!",
		imageUrl:
			"https://cdn.vox-cdn.com/uploads/chorus_image/image/70412073/0377c76083423a1414e4001161e0cdffb0b36e1f_760x427.0.png",
	},
	{
		id: "warrior",
		name: "Determined Warrior",
		description: "A disciplined mentor who pushes you beyond your limits.",
		traits: ["Disciplined", "Determined", "Focused"],
		quote: "Overcome yourself! Each step is a victory over weakness!",
		imageUrl:
			"https://static.wikia.nocookie.net/dragonball/images/e/e5/VegetaItsOver9000-02.png/revision/latest/scale-to-width-down/800?cb=20211127222707",
	},
	{
		id: "strategist",
		name: "Strategic Thinker",
		description: "An analytical mentor who helps you create effective plans.",
		traits: ["Analytical", "Methodical", "Organized"],
		quote:
			"The right strategy is the key to success. Let's break down your goals step by step.",
		imageUrl:
			"https://cdn.vox-cdn.com/thumbor/IkFXS-gWpkOrvaSKr8hNAA1i5bY=/0x0:720x480/1400x1050/filters:focal(0x0:720x480):format(jpeg)/cdn.vox-cdn.com/uploads/chorus_image/image/30661345/death_note_l.0.jpg",
	},
];

const MentorSelectionPage = () => {
	const [selectedMentor, setSelectedMentor] = useState<MentorType | null>(null);
	const navigate = useNavigate();

	const handleSelectMentor = (mentorId: MentorType) => {
		setSelectedMentor(mentorId);
	};

	const handleConfirm = () => {
		if (selectedMentor) {
			// Save mentor choice to localStorage
			localStorage.setItem("selectedMentor", selectedMentor);
			// Go to goal tracker page
			navigate("/goal-tracker");
		}
	};

	return (
		<Container maxWidth="md">
			<Box textAlign="center" my={4}>
				<Typography variant="h4" component="h1" gutterBottom>
					Choose Your Mentor
				</Typography>
				<Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
					Select a mentor style that fits your motivational needs
				</Typography>
			</Box>

			<Paper elevation={2} sx={{ p: 3, mb: 4 }}>
				<Grid container spacing={3}>
					{mentors.map((mentor) => (
						<Grid item xs={12} key={mentor.id}>
							<Card
								variant="outlined"
								sx={{
									transition: "all 0.2s ease",
									border:
										selectedMentor === mentor.id
											? "2px solid #3f51b5"
											: "1px solid rgba(0,0,0,0.12)",
									bgcolor:
										selectedMentor === mentor.id
											? "rgba(63,81,181,0.05)"
											: "transparent",
									"&:hover": {
										borderColor: "primary.main",
										bgcolor: "rgba(63,81,181,0.02)",
										cursor: "pointer",
									},
								}}
							>
								<CardActionArea onClick={() => handleSelectMentor(mentor.id)}>
									<CardContent>
										<Box display="flex" alignItems="flex-start">
											<Radio
												checked={selectedMentor === mentor.id}
												onChange={() => {}} // Empty handler since we handle click on the card
												onClick={(e) => e.stopPropagation()} // Prevent double triggering
												sx={{ mr: 1, mt: -1 }}
											/>
											<Box>
												<Typography variant="h6">{mentor.name}</Typography>
												<Typography
													variant="body2"
													color="text.secondary"
													paragraph
												>
													{mentor.description}
												</Typography>

												<Box
													sx={{
														display: "flex",
														flexWrap: "wrap",
														mb: 1,
														gap: 1,
													}}
												>
													{mentor.traits.map((trait, index) => (
														<Typography
															key={index}
															variant="caption"
															component="span"
															sx={{
																px: 1,
																py: 0.5,
																bgcolor: "background.paper",
																border: "1px solid",
																borderColor: "divider",
																borderRadius: 1,
																fontWeight: 500,
															}}
														>
															{trait}
														</Typography>
													))}
												</Box>

												<Typography
													variant="body2"
													sx={{
														fontStyle: "italic",
														color:
															selectedMentor === mentor.id
																? "primary.main"
																: "text.secondary",
														mt: 1,
													}}
												>
													"{mentor.quote}"
												</Typography>
											</Box>
										</Box>
									</CardContent>
								</CardActionArea>
							</Card>
						</Grid>
					))}
				</Grid>
			</Paper>

			<Box textAlign="center" mt={4} mb={2}>
				<Button
					variant="contained"
					size="large"
					onClick={handleConfirm}
					disabled={!selectedMentor}
				>
					Confirm Selection
				</Button>
			</Box>
		</Container>
	);
};

export default MentorSelectionPage;
