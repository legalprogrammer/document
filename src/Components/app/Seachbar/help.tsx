import React from 'react';
import { Button,Image,Modal, ModalContent } from "semantic-ui-react";
import Img1 from "../../assests/Images/Help/image1.png";
import Img2 from "../../assests/Images/Help/image2.png";
import Img3 from "../../assests/Images/Help/image3.png";
import Img4 from "../../assests/Images/Help/image4.png";

function Helpbar() {
  const [open, setOpen] = React.useState(false)

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={<Button className="help_button"> Help ?</Button>}
    >
      
        <h1 className='heading'>Welcome</h1>
          <hr/><br/>
      <Modal.Description>
          <Modal.Content>
          Document Retriver combines machine learning with intelligent information extraction to provide a fast,       easy-to-use platform to handle all your business’ documents in one place.
         With a tailor-made pathfinder solution, documents can be sorted and indexed into an intelligent database,
          allowing users to quickly and accurately search for specific documents, wherever they may be.
          </Modal.Content>
          <br/>
          <h1 className='heading'>How to Use</h1>
                    <hr/><br/>
          <ModalContent>
          The user enters a query to search for documents. The query may be simple (eg. "travel") or complex (eg. "how to apply for parental leave?").
          The relevant documents are retrieved, and the results are displayed in a clear, easy to read manner.
          When applicable a snippet of relevant document content is displayed.
      </ModalContent>
      <br/>
      <Image className='image' src={Img1}/>
      <br/>
      <ModalContent>
        If required, or the initial query was very broad (e.g. "manual"), the user can further refine searches using document categories.
        Categories are listed down the left hand side, with a number indicating the number of relevant results within that category.
          </ModalContent>
          <br/>
          <Image className='image' src={Img2} />
          <br/>
          <ModalContent>Multiple filters can be chosen, and they are applied in conjunction.
       </ModalContent>
       <br/>
       <Image className='image' src={Img3} />
       <br/>
       <ModalContent>
        Powerful spellchecking techniques are employed, attempting to ensure the user is never left at a dead end.
       If a search results in no results, the best suggestion is automatically searched and returned.
        </ModalContent>
        <br/>
        <Image className='image' src={Img4} />
        <br/>
        <ModalContent>
                 Document Retriver learns over time, boosting documents that are more popular in general as well as boosting documents popular to the specific user.      
        </ModalContent>
        </Modal.Description>
        <br/>
        <hr/>
      <Modal.Actions>
        <Button className='help_popup_close_btn' 
          content="Close"
          labelPosition='right'
          icon='checkmark'
          onClick={() => setOpen(false)}
          positive
        /> 
      </Modal.Actions>
    </Modal>
  )
}

export default Helpbar
