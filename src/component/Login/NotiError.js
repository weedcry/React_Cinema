import { Button, Modal } from 'react-bootstrap';

function NotiError(props) {
    const handleClose = () =>{
        props.closes(false);
    } 
    return(
        <>
             <Modal className="modal_product"  aria-labelledby="contained-modal-title-vcenter" centered size='s' 
             show={props.shows} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title style={{color:'red',fontSize:20}}>
                        Cảnh báo
                    </Modal.Title>
                </Modal.Header>
                    <Modal.Body>
                        <h1>{props.text}</h1>
                    </Modal.Body>
                <Modal.Footer>
                    <Button variant="warning" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
export default NotiError;