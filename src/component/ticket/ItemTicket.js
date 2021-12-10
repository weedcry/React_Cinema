import { useState , useEffect, useRef} from "react";
import { Link, useHistory } from "react-router-dom";
import { get } from "../../httpHelper"; 
import swal from 'sweetalert'; 

function ItemTicket(props) {
    let history = useHistory();
    let lich = props.lich || []
    const [listDetail, setlistDetail] = useState(0)

    useEffect(() => {
           console.log(" vào ")
            getDetailLich()
     }, [])


     const selectseat = (id) =>{
        var tokenStr = localStorage.getItem("token");
        if(tokenStr == "0" || tokenStr == null){
            swal("Bạn phải đăng nhập vào hệ thống !!!", {
                buttons: {
                  Accept: "Xác nhận",
                },
              })
              .then((value) => {
                switch (value) {
                  case "Accept":
                    history.push("/login")
                    break;
                  default:
                }
              });
              return false;
            }
            // history.push("ticket/selectseat/"+id)
            window.location.href= "/ticket/selectseat/"+id;
     }

     const getDetailLich=()=>{
        let listTemp = [];
        props.lich.map((l)=>{
            get('/api/customer/lich/detail/'+l.idLich)
            .then((Response)=>{
                console.log("get lich detail with id = "+l.idLich+" success ")
                listTemp.push(Response.data)
            })
            .catch((Error)=>{
                console.log("get lich detail error")
            })
        })
        setTimeout(() => {
            setlistDetail(listTemp);
        }, 500);
     }

     const AddDetailLich=(id)=>{
        let result = 0
            get('/api/customer/lich/detail/'+id)
            .then((Response)=>{
                console.log("get lich detail with id = "+id+" success ")
                result = Response.data
                return result;
            })
            .catch((Error)=>{
                console.log("get lich detail error")
            })
     }


    const getDetail=(id)=>{
        var u  = 0;
        const details = listDetail.filter((detail) => {  
           if(detail.idLich === id){            
                u = detail
               return detail
           }           
        })
        if(u === 0){
            console.log(" need get")
             u = AddDetailLich(id);
            // getDetailLich()
        }

        return u;
    }

    let jsxLich = lich.map((l)=>{
        let tempgio = l.gio.split(":")
        let gio = props.tl / 60
        let phut = props.tl % 60
        if(phut.toString().length === 1) phut = "0"+phut
        let gioBd = tempgio[0]+":"+tempgio[1] 
        let gioKT = (parseInt(tempgio[0])+parseInt(gio)) + ":"+phut

        let ghesd = 0
        let tenphong = ""
        let tongghe = 0
        let ghecon =  0
        if(listDetail !== 0){
           
            let detail = getDetail(l.idLich) 
            if(detail){
                ghesd = detail.listVitriSD.length
                tenphong = detail.tenPhong
                tongghe = detail.tongGhe 
                ghecon = (detail.tongGhe - ghesd)
            }    
        }

       

        return<>
                <li>
                    <a  onClick={ ()=>selectseat(l.idLich)} style={{cursor:'pointer'}}  class="time_active t2">  
                        <span class="cineD2">
                            <em>{tenphong}</em>
                       </span>
                        <span class="clock">{gioBd}
                            <span> ~ {gioKT}</span>
                        </span>
                        <span class="ppNum">
                            <em class="color_brown" title="Kiểm tra chỗ ngồi của bạn">{ghecon}</em> / {tongghe} Ghế ngồi
                        </span>
                    </a>
               </li>
            </>
    })

    let dotuoi = lich.doTuoi || 0 

    return(
        <>
            {jsxLich}
        </>
    )
}
export default ItemTicket;