import { Link } from 'react-router-dom';
import { FooterLink2 } from '../../data/footer-links';
const FooterCard = (
    {title}
) => {
    const result = FooterLink2.filter((value) => title === value.title);
    const links = result[0].links;

  return (
    <div className='flex flex-col font-inter gap-3'>
        <div className='text-richblack-50 font-semibold text-[16px]'>
            {title}
        </div>
        <div className='flex flex-col gap-2'>
            {
                links.map((element,index) => {
                    return(
                        <div key={index}>
                            <Link to={element.link} className='text-[14px] font-medium cursor-pointer hover:text-richblack-50 transition-all duration-150 text-richblack-400 '>{element.title}</Link>
                        </div>
                    );
                })
            }
        </div>
    </div>
  )
}

export default FooterCard
