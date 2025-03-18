import { UserButton } from "@clerk/clerk-react";
import WishList from "./Wishes/WishList";

interface DashboardProps {
	userId: string;
}

const Dashboard = ({ userId }: DashboardProps) => {
	return (
		<div className="max-w-5xl mx-auto px-5">
			<header className="mb-8">
				<div className="flex justify-between items-center">
					<div className="flex flex-col items-start">
						<h1 className="text-4xl font-bold text-primary mb-2">Wishify</h1>
						<p className="text-text-secondary">
							Храните и отслеживайте свои цели и мечты
						</p>
					</div>
					<div>
						<UserButton />
					</div>
				</div>
			</header>

			<WishList userId={userId} />
		</div>
	);
};

export default Dashboard;
