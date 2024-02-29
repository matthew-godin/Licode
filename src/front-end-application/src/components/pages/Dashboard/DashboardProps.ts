import User from "../../common/interfaces/User/User";

export default interface DashboardProps {
    user?: User,
    fetchUser: Function
}
