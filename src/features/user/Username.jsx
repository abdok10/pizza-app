import { useSelector } from "react-redux"

function Username() {
    const { username } = useSelector(store => store.user)
    
    if (!username) return null;

    return (
        <div className="text-sm font-semibold hidden md:block">
            {username}
        </div>
    )
}
export default Username
