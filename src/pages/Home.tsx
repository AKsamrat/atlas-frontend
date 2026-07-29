
import EntraHero from '../components/home/Hero'
import Services from '../components/home/Service'
import WhyChooseUs from '../components/home/WhyChooseUs'
import Testimonials from '../components/home/Testimonials'
import Process from "../components/home/Process";
import TrustedBy from "../components/home/TrustedBy";
import FinalCTA from "../components/home/FinalCTA";


const Home = () => {
    return (
        <div>
            <EntraHero />
            <Services />
            <WhyChooseUs />
            <Process />
            <TrustedBy />
            <Testimonials />
            <FinalCTA />
        </div>
    )
}

export default Home
