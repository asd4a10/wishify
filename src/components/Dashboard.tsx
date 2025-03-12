import { UserButton } from "@clerk/clerk-react";
import WishList from "./Wishes/WishList";

interface DashboardProps {
	userId: string;
}

const Dashboard = ({ userId }: DashboardProps) => {
	return (
		<div className="wishify-container">
			<header>
				<div className="header-content">
					<div>
						<h1>Wishify</h1>
						<p>Храните и отслеживайте свои цели и мечты</p>
					</div>
					<div className="user-section">
						<UserButton />
					</div>
				</div>
			</header>

			<WishList userId={userId} />
		</div>
	);
};

export default Dashboard;
