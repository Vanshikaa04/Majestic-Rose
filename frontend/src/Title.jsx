import PropTypes from "prop-types";
import {motion} from "framer-motion"
import { fadeIn } from "../../variants"
import "./title.css"

const Title = ({text1, text2}) => {
  return (
    <>
    <motion.div
     variants={fadeIn("right",0.0001)}
     initial ="hidden"          
     whileInView={"show"}
     viewport={{once: false, amount: 0.7}} 
     className="title-container">
      <span className="title-text1" >{text1}</span>
      <span className="title-text2"> {text2}</span>
    </motion.div> 
</>
  )

}

// Validating Prop types 
Title.propTypes = {
  text1: PropTypes.string.isRequired,  // Ensures text1 is a required string
  text2: PropTypes.string.isRequired,  // Ensures text2 is a required string
};

export default Title
