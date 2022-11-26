import { Button,Image, ModalContent,Container} from "semantic-ui-react";
import   "../../assests/CSS/main.css";
import Logo from "../../assests/Images/lexx logo.webp";

const HeaderBar = (_props: any) => (
    
        <Container id='header'>
            <div className="logo-placer-left">
              <Image className="logo" src={Logo} />
            </div>
            <div className="project">
              <b>PFDS</b> Quick Search
            </div>
          <div className="logo-placer-right">
                <Button primary>FeedBack</Button>
        </div>
          <div id="footer">
            <div className="disclaimer">
              <ModalContent className="Footer">Powerd by @ 1Ansah Pvt Ltd</ModalContent>
            </div>
          </div>
          </Container>
        
  );
export default HeaderBar;
