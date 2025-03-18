import { Outlet } from "react-router-dom";
import {
	AppBar,
	Toolbar,
	Typography,
	Button,
	Box,
	Container,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useUser, UserButton, SignInButton } from "@clerk/clerk-react";

const Layout = () => {
	const navigate = useNavigate();
	const { isSignedIn } = useUser();

	return (
		<>
			<AppBar position="static" sx={{ mb: 0 }}>
				<Toolbar sx={{ justifyContent: "space-between" }}>
					<Typography
						variant="h6"
						component="div"
						sx={{
							cursor: "pointer",
							textAlign: "left",
							marginRight: "auto",
						}}
						onClick={() => navigate("/")}
					>
						Wishify
					</Typography>
					<Box sx={{ display: "flex", gap: 2 }}>
						{isSignedIn && (
							<>
								<Button color="inherit" onClick={() => navigate("/wishes")}>
									Мои желания
								</Button>
								<Button
									color="inherit"
									onClick={() => navigate("/goal-tracker")}
								>
									Трекер целей
								</Button>
							</>
						)}
						{isSignedIn ? <UserButton /> : <SignInButton />}
					</Box>
				</Toolbar>
			</AppBar>

			<Container component="main" sx={{ px: 4 }}>
				<Outlet />
			</Container>

			<Box
				component="footer"
				sx={{ mt: 4, py: 3, bgcolor: "background.paper", textAlign: "center" }}
			>
				<Typography variant="body2" color="text.secondary">
					© {new Date().getFullYear()} Wishify. Все права защищены.
				</Typography>
			</Box>
		</>
	);
};

export default Layout;
