import mainImg from "../assets/Images/login.webp"
import Footer from "../components/common/Footer"
import Template from "../components/core/Auth/Template"

const Login = () => {
  return (
    <div>
        <Template
        title = "Welcome Back"
        description1 = "Built Skills for today, tommarow, and beyond."
        description2 = "Education to future-proof your career."
        image = {mainImg}
        formType = "login"
    />
    <Footer/>
    </div>

  )
}

export default Login
