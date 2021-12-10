import { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { Input } from "reactstrap";
import { get } from '../../httpHelper';

function GiaVe(props) {

    const [list, setlist] = useState([])

    const [listHoliday, setlistHoliday] = useState([])

    useEffect(() => {
        get('/api/customer/loaiphim/get')
        .then((Response)=>{
            console.log("get loai phim success")
            setlist(Response.data)
        })
        .catch((Error)=>{
            console.log("get loai phim error " + Error.toString())
        })

        get('/api/customer/holiday/get')
        .then((Response)=>{
            console.log("get holiday success")
            setlistHoliday(Response.data)
        })
        .catch((Error)=>{
            console.log("get loai phim error " + Error.toString())
        })
    }, [])

    const handleClose = () =>{
        props.closes(false);
    } 


    let jsxPL = list.map((pl)=>{
           
        let ghevip = pl.giaTien + 5000

        return <>
                <tr>
                    <th rowspan="2">
                        <p style={{fontSize:22, padding: 10}}>{pl.tenLoai}</p>    
                    </th>
                    <th scrope="row">
                        <p style={{fontSize:14}}>Các ngày trong tuần<br/>Thứ Hai - Chủ nhật</p>    
                    </th>
                    <td><p style={{fontSize:12}}>{pl.giaTien} VNĐ</p></td>
                    <td><p style={{fontSize:12}}>{ghevip} VNĐ</p></td>
                </tr>
                <tr>
                    <th scope="row" style={{borderLeft:'block'}}>
                        <p style={{fontSize:14}}>Ngày Lễ</p>  
                    </th>
                    <td><p style={{fontSize:12}}>({pl.giaTien} + bonus lễ)  VNĐ</p></td>
                    <td><p style={{fontSize:12}}>({ghevip} + bonus lễ)  VNĐ</p></td>
                </tr>
                </>
    })

    let jsxHL = listHoliday.map((hl)=>{

        return <>
                <tr>
                    <th rowspan="2">
                        <p style={{fontSize:14}}>{hl.holidayName}</p>    
                    </th>
                </tr>
                <tr>
                    <td >
                    <p style={{fontSize:12}}>{hl.gia} VNĐ</p>
                    </td>
                </tr>
                </>
    })


    return(
        <>
             <Modal className="modal_product" size='m' show={props.shows} onHide={handleClose}  
             aria-labelledby="contained-modal-title-vcenter" centered>
                <Modal.Header closeButton>
                    <Modal.Title style={{color:'black',fontSize:20}}>
                       Giá Vé
                    </Modal.Title>
                </Modal.Header>
                    <Modal.Body>
                    <div className="tab_contTT on">
                        <h3>
                        <strong className="blind">Phòng Chiếu Phim</strong>
                        </h3>
                        <div class="wrap_con_lr">
                            <h4><strong class="film_tit">Giá Vé Tiêu Chuẩn</strong></h4>
                            <span class="con_right feeinfo">Giá vé ngày lễ được tính khác ngày bình thường</span>
                        </div>
                        <table border="1" class="tbl_style02">
                            <caption>2D Ghế Tiêu Chuẩn</caption>
                            <thead>
                                <tr>
                                <th scope="col" colspan="2" class="bl-none">Phân loại</th>
                                <th scope="col">Ghế Thường</th>
                                <th scope="col">Ghế VIP</th>
                                </tr>
                            </thead>
                            <tbody>
                                {jsxPL}
                            </tbody>
                        </table>

                        <div class="wrap_con_lr" style={{marginTop:5}}>
                            <h4><strong class="film_tit">Giá Vé Tăng Thêm Ngày Lễ</strong></h4>
                            <span class="con_right feeinfo">Chưa cộng dồn với giá vé tiêu chuẩn</span>
                        </div>
                        <table border="1" class="tbl_style02">
                            <caption>Lễ Trong Năm</caption>
                            <thead>
                                <tr><th scope="col"  class="bl-none">Ngày Lễ</th>
                                <th scope="col">Bonus</th>
                                </tr>
                            </thead>
                            <tbody>
                                {jsxHL}
                            </tbody>
                        </table>
                    </div>
                    </Modal.Body>
                <Modal.Footer>
                    <Input  type="button" id="btnmagiamgia" onClick={()=>handleClose()} value="OK" 
                    style={{width:100,height:40,marginLeft:10, marginBottom:0,color:'black', backgroundColor:'#dad2b4'}} />
                </Modal.Footer>
            </Modal>
        </>
    )
}
export default GiaVe;