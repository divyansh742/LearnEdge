import mainImg from "../assets/Images/signup.webp"
import Footer from "../components/common/Footer"
import Template from "../components/core/Auth/Template"

const SignUp = () => {
  return (
    <>
      <Template      
        title="Join the millions learning to code with StudyNotion for free"
        description1="Build skills for today, tomorrow, and beyond."
        description2="Education to future-proof your career."
        image={mainImg}
        formType="signup"
      />
      <Footer/>
    </>

  )
}

export default SignUp
