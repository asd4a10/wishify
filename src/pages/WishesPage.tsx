import { Box, Typography, Container } from "@mui/material";
import { useUser } from "@clerk/clerk-react";
import WishList from "../components/Wishes/WishList";

const WishesPage = () => {
	const { user } = useUser();

	return (
		<Container>
			<Box mb={4}>
				<Typography variant="h4" component="h1" gutterBottom>
					Мои желания
				</Typography>
				<Typography variant="subtitle1" color="text.secondary">
					Управляйте списком своих желаний
				</Typography>
			</Box>

			{user && <WishList userId={user.id} />}
		</Container>
	);
};

export default WishesPage;
