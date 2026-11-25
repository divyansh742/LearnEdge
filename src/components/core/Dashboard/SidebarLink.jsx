import * as Icons from "react-icons/vsc";
import { NavLink,matchPath,useLocation } from "react-router-dom";
//import resetCourseState from "../../../slices/" implement later


const SidebarLink = ({link,iconName}) => {
  const Icon = Icons[iconName];
  const location = useLocation();
  const matchRoute = (route) => {
    return matchPath({path:route},location.pathname);
  }
  return (
    <NavLink
      to={link.path}
      className={`relative md:px-8 py-2 w-full text-sm font-medium ${matchRoute(link.path) ? "bg-yellow-800 text-yellow-50":"bg-opacity-0 text-richblack-300"} transition-all duration-200`}
    >
       {/* leftborder */}
      <span className={`absolute  left-0 md:top-0  bottom-0  md:h-full md:w-[0.15rem] bg-yellow-50 h-1 w-full ${
          matchRoute(link.path) ? "opacity-100" : "opacity-0"
        }`}></span>

        <div className="flex items-center gap-3 md:flex-row flex-col" title={link.name}>
          <Icon className="text-lg"/>
          <span className="hidden md:block">{link.name}</span>
        </div>

    </NavLink>
  )
}

export default SidebarLink