import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

function RoleBasedRoute({ children, allowedRoles }) {
    const role = useSelector((state) => state.user.role)
    
    if(allowedRoles.includes(role)){
        return children
    }else{
        
        // invalidate access
        if(role==="Author"){
            // console.log(userRole)
            return <Navigate to="/" />
        }else if (role==="Reviewer"){
            return <Navigate to="/reviewer" />
        }else if (role==="Editor"){
            return <Navigate to="/editor" />
        }
    }
    
}

export {RoleBasedRoute}
