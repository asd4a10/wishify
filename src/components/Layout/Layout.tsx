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
			<AppBar position="static">
				<Toolbar>
					<Typography
						variant="h6"
						component="div"
						sx={{ flexGrow: 1, cursor: "pointer" }}
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

			<Container component="main" sx={{ py: 4 }}>
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
