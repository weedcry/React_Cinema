import { useState , useEffect, useRef} from "react";
import { Link, useHistory } from "react-router-dom";
import { get } from "../../httpHelper"; 
import swal from 'sweetalert'; 

function ItemSchedule(props) {
    let history = useHistory();
    let lich = props.lich
    const [listDetail, setlistDetail] = useState(0)

    let clss  = useRef("")


    useEffect(() => {
       
            let listId = [];
            lich.lich.map((l)=>{
                if (listId.indexOf( l.idLich) === -1){
                    listId.push(l.idLich);
                } 
            })
           
            let listTemp = [];
            listId.map((id) => {
                get('/api/customer/lich/detail/'+id)
                .then((Response)=>{
                    console.log("get lich detail with id = "+id+" success ")
                    listTemp.push(Response.data)
                })
                .catch((Error)=>{
                    console.log("get lich detail error")
                })
            })
            setTimeout(() => {
                setlistDetail(listTemp);
            }, 500);

            
            if(lich.doTuoi == "C18"){
                document.getElementById(lich.idPhim).classList.add("grade_18");
            }else{
                if(lich.doTuoi == "C16"){
                    document.getElementById(lich.idPhim).classList.add("grade_16");
                }else{
                    if(lich.doTuoi == "C13"){
                        document.getElementById(lich.idPhim).classList.add("grade_13");
                    }else{
                        document.getElementById(lich.idPhim).classList.add("grade_all");
                    }
                }
            }

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
            // history.push("/ticket/selectseat/"+id)
            window.location.href= "/ticket/selectseat/"+id;
     }


    const getDetail=(id)=>{
        var u ;
        const details = listDetail.filter((detail) => {   
           if(detail.idLich === id){            
                u = detail
               return detail
           }           
        })
        return u;
    }

    let jsxLich = lich.lich.map((l)=>{
        let tempgio = l.gio.split(":")
        let gio = lich.thoiLuong / 60
        let phut = lich.thoiLuong % 60
        if(phut.toString().length === 1) phut = "0"+phut
        let gioBd = tempgio[0]+":"+tempgio[1] 
        let gioKT = (parseInt(tempgio[0])+parseInt(gio)) + ":"+phut

        let detail = 0
        let ghesd = 0
        let tenphong = ""
        let tongghe = 0
        let ghecon = 0
        if(listDetail !== 0){
             detail = getDetail(l.idLich) 
            if(detail){
                ghesd = detail.listVitriSD.length
                tenphong = detail.tenPhong
                tongghe = detail.tongGhe
                ghecon = detail.tongGhe - ghesd;
            }    
        }
        

        return<>
                <li>
                    <a onClick={ ()=>selectseat(l.idLich)} style={{cursor:'pointer'}} class="time_active t2">  
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
         <div class="time_aType time8039">  
            <dl class="time_line movie10714">   
                <dt>
                    <Link to="a"><span id={lich.idPhim} ></span>{lich.tenPhim}</Link> 
                </dt>  
                <dd class="film200"> 
                    <ul class="cineD1">      
                        <li>{lich.loaiPhim}</li>      
                        <li>{lich.phanLoai}</li>   
                    </ul>  
                    <ul class="theater_time list10714" screendiv="100"> 
                       {jsxLich}
                    </ul>
                </dd>
            </dl>
        </div>
        </>
    )
}
export default ItemSchedule;