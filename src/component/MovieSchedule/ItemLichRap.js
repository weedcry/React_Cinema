import { useState , useEffect, useRef} from "react";
import { Link, useHistory } from "react-router-dom";
import { get } from "../../httpHelper"; 
import swal from 'sweetalert'; 

function ItemLichRap(props) {
    let history = useHistory();
    const [listDetail, setlistDetail] = useState(0)

    useEffect(() => {
           
            let listTemp = [];
            lich.lich.map((l)=>{
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

     }, [])

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

    let lich = props.lich
    let phim = props.phim
    let dotuoi = phim.doTuoi || 0 

    let jsxLich = lich.lich.map((l)=>{
        let tempgio = l.gio.split(":")
        let gio = phim.thoiLuong / 60
        let phut = phim.thoiLuong % 60
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

  

    return(
        <>
         <div class="time_aType time8039">  
            <dl class="time_line movie10714">   
                <dt>
                    <Link to="a"><span ></span>{lich.tenRap}</Link> 
                </dt>  
                <dd class="film200"> 
                    <ul class="cineD1">      
                        <li>{phim.loaiPhimEntityIdLoaiPhim}</li>      
                        <li>{phim.phanLoai}</li>   
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
export default ItemLichRap;