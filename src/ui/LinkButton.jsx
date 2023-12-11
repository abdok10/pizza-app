import { Link } from "react-router-dom"
import { useNavigate } from 'react-router-dom';

function LinkButton({ children, to }) {
    const className = 'text-sm text-blue-500 hover:text-blue-600';
    const navigate = useNavigate();

    if (to === "-1") return (
        <Link to={to} onClick={() => navigate(-1)} className={className}>
            {children}
        </Link>
    )
    return (
        <Link to={to} className={className}>
            {children}
        </Link>
    )
}
export default LinkButton;
