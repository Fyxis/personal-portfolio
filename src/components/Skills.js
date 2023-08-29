import meter70 from "../assets/img/meter70.svg"
import meter83 from "../assets/img/meter83.svg"
import meter87 from "../assets/img/meter87.svg"
import meter95 from "../assets/img/meter95.svg"
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import colorSharp from "../assets/img/color-sharp.png"

export const Skills = () => {
  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 5
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1
    }
  };

  return (
    <section className="skill" id="skills">
        <div className="container">
            <div className="row">
                <div className="col-12">
                    <div className="skill-bx wow zoomIn">
                        <h2>Skills</h2>
                        <p>In this section you can see all the skills that i have.</p>
                        <Carousel responsive={responsive} infinite={true} className="owl-carousel owl-theme skill-slider">
                            <div className="item">
                                <img src={meter95} alt="Image" />
                                <h5>UI/UX Designer</h5>
                            </div>
                            <div className="item">
                                <img src={meter83} alt="Image" />
                                <h5>React Frontend</h5>
                            </div>
                            <div className="item">
                                <img src={meter70} alt="Image" />
                                <h5>Backend</h5>
                            </div>
                            <div className="item">
                                <img src={meter87} alt="Image" />
                                <h5>Copywriting</h5>
                            </div>
                        </Carousel>
                    </div>
                </div>
            </div>
        </div>
        <img className="background-image-left" src={colorSharp} alt="Image" />
    </section>
  )
}
