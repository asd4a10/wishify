import { Box, Typography, Button, Paper, Grid, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

const HomePage = () => {
	const navigate = useNavigate();
	const { isSignedIn } = useUser();

	return (
		<Container>
			<Box py={6} textAlign="center">
				<Typography variant="h2" component="h1" gutterBottom>
					Wishify
				</Typography>
				<Typography variant="h5" color="text.secondary" paragraph>
					Организуйте свои желания и достигайте целей с помощью персонального
					наставника
				</Typography>

				{!isSignedIn && (
					<Button
						variant="contained"
						size="large"
						sx={{ mt: 4 }}
						onClick={() =>
							(
								document.querySelector(
									".cl-rootBox button"
								) as HTMLButtonElement
							)?.click()
						}
					>
						Начать сейчас
					</Button>
				)}

				{isSignedIn && (
					<Grid container spacing={4} mt={4} justifyContent="center">
						<Grid item xs={12} md={6}>
							<Paper
								sx={{
									p: 4,
									height: "100%",
									display: "flex",
									flexDirection: "column",
								}}
							>
								<Typography variant="h5" gutterBottom>
									Мои желания
								</Typography>
								<Typography paragraph>
									Организуйте свой список желаний и мечтаний.
								</Typography>
								<Button
									variant="contained"
									sx={{ mt: "auto" }}
									onClick={() => navigate("/wishes")}
								>
									Перейти к желаниям
								</Button>
							</Paper>
						</Grid>
						<Grid item xs={12} md={6}>
							<Paper
								sx={{
									p: 4,
									height: "100%",
									display: "flex",
									flexDirection: "column",
								}}
							>
								<Typography variant="h5" gutterBottom>
									Трекер целей
								</Typography>
								<Typography paragraph>
									Выберите персонального наставника и достигайте своих целей.
								</Typography>
								<Button
									variant="contained"
									sx={{ mt: "auto" }}
									onClick={() => navigate("/goal-tracker")}
								>
									Перейти к целям
								</Button>
							</Paper>
						</Grid>
					</Grid>
				)}
			</Box>
		</Container>
	);
};

export default HomePage;
