import { useState } from "react";
import { useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { Input } from "reactstrap";
import { get, post } from "../../httpHelper";
import './style1.scss'
import swal from 'sweetalert';
import { onSendT } from "../SelectSeat/WebSocket";

function Checkout(props) {
    // let hostname = "https://api-cinemas.herokuapp.com"
    let hostname = "https://api-cinemas.herokuapp.com"
    let history = useHistory();
    const [Lich, setLich] = useState({gio:"",ngay:""})
    const [Phim, setPhim] = useState(0)
    const [Access, setAccess] = useState(1)
    const [Phong, setPhong] = useState({rapEntityIdRap:""})
    const [totalpay, settotalpay] = useState(0)
    const [Customer, setCustomer] = useState(0)
    const [acGiam, setacGiam] = useState(0)
    const [acCoin, setacCoin] = useState(0)

    useEffect(() => {
      
        window.scrollTo(0, 0)
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
                    history.push("/login") 
                }
              });
              return false;
        }


        let success = (new URLSearchParams(window.location.search)).get("success")
        let paymentid = (new URLSearchParams(window.location.search)).get("paymentid")
        if(success === "true" && paymentid !== null && paymentid !==""){
            let body = JSON.parse(localStorage.getItem("order"))
            body.hinhThuc = "PAYPAL"
            body.motaThanhtoan = paymentid
            
            console.log(body)
            CreateHoadon(body)
            return false
        }

        if(success == "fail"){
            swal("Đặt vé thất bại !!!", {
                buttons: {
                  Accept: "OK",
                },
              })
              .then((value) => {
                switch (value) {
                  case "Accept":
                    history.push("/ticket")
                    break;
                  default:
                    history.push("/ticket") 
                }
              });
            return false
        }


        let lich = (new URLSearchParams(window.location.search)).get("IDLich")
        if( lich !== null && lich !== "" ){
            getLich(lich)
            getCustomer()
        }else{
            setAccess(0)
        }
        

    }, [])


  

    
    const getLich=(id)=>{
        get('/api/customer/lich/'+id)
        .then((Response)=>{
            console.log("get lich with id = "+id+" success")
            setLich(Response.data)
            getPhim(Response.data.phimEntityIdPhim)
            getPhong(Response.data.phongEntityIdPhong)

            let slghe = (localStorage.getItem("ghengoi")).split(", ")
            let tien = 0;
            let ghevip = [68,69,70] 
            for(let i = 0 ; i < slghe.length - 1 ; i++){
                let hangO = slghe[i].substring(0, 1)
                let nums =  hangO.charCodeAt(0) 
                let check = 0
                for(let i = 0; i < ghevip.length ; i++){
                    if(parseInt(ghevip[i]) === parseInt(nums)){
                        tien += Response.data.gia + 5000;
                        check = 1
                    }
                }
                if (check === 1) continue
                tien += Response.data.gia 
            }

            settotalpay(tien)
        })
        .catch((Error)=>{
            console.log("get lich with id = "+id+" error")
        })
    }

    const getCustomer=()=>{
          // customer
          get('/api/customer/get')
          .then((Response)=>{
              console.log(" get customer success")
              setCustomer(Response.data)



              })
          .catch((error) =>{
             console.log(" get customer error")
          })
    }

    const getPhim=(id)=>{
        
        get('/api/customer/phim/'+id)
        .then((Response)=>{
            console.log("get phim success")
            setPhim(Response.data)
        })
        .catch((Error)=>{
            console.log("get phim error" + Error.toString())
        })
    }

    const getPhong=(id)=>{
        
        get('/api/customer/phong/'+id)
        .then((Response)=>{
            console.log("get phong success")
            setPhong(Response.data)
        })
        .catch((Error)=>{
            console.log("get phong error" + Error.toString())
        })
    }

    let tenRap = (Phong.rapEntityIdRap.split("_"))[1]
    let tempgio = Lich.gio.split(":")
    let gio = Phim.thoiLuong / 60
    let phut = Phim.thoiLuong % 60
    if(phut.toString().length === 1) phut = "0"+phut
    let gioBd = tempgio[0]+":"+tempgio[1] 
    let gioKT = (parseInt(tempgio[0])+parseInt(gio)) + ":"+phut
    let tempNgay = Lich.ngay.split("-")
    let ngayKC = tempNgay[2]+"/"+tempNgay[1]+"/"+tempNgay[0]


    
    // ghe dat
    let StrGhe = (localStorage.getItem("ghengoi")) || ""
    let totalLS = localStorage.getItem("totalpay") || 0
    let ghedatLS = (localStorage.getItem("ghengoi")).split(", ")
    let slghe = (ghedatLS.length -1 ) || 0

        let total = 0  
        if(Lich.gia){
            let slghe = (localStorage.getItem("ghengoi")).split(", ")
            let tien = 0;
            let ghevip = [68,69,70] 
            for(let i = 0 ; i < slghe.length - 1 ; i++){
                let hangO = slghe[i].substring(0, 1)
                let nums =  hangO.charCodeAt(0) 
                let check = 0
                for(let i = 0; i < ghevip.length ; i++){
                    if(parseInt(ghevip[i]) === parseInt(nums)){
                        tien += Lich.gia + 5000;
                        check = 1
                    }
                }
                if (check === 1) continue
                tien += Lich.gia 
            }
            total = tien
        }
 
         const clickTT=()=>{

            let timeN = new Date();
            let part = timeN.getDate()+"/"+(timeN.getMonth()+1)+"/"+timeN.getFullYear()+" "+timeN.getHours()+":"+timeN.getMinutes()+":"+timeN.getSeconds()
            let idvoucher = localStorage.getItem("idvoucher") || ""

            //list ct hoa don
            let StrGhe = (localStorage.getItem("ghengoi"))
            console.log(StrGhe)
            let partGhe = StrGhe.split(", ")
            let list = []
            for(let i = 0; i < partGhe.length - 1; i ++){
                let hangO = partGhe[i].substring(0, 1)
                let cotT = partGhe[i].substring(1,partGhe[i].length)
                let hangT = (parseInt(hangO.charCodeAt(0))) - 64


                let tien = 0;
                let ghevip = [68,69,70] 
                    for(let i = 0; i < ghevip.length ; i++){
                        if((parseInt(ghevip[i]) - 64 ) === hangT){
                            tien = Lich.gia + 5000;
                        }
                    }
                    if (tien === 0){
                        tien = Lich.gia 
                    }

                let vitri = {
                    hang:hangT,
                    cot:parseInt(cotT),
                    gia:tien
                }
                list.push(vitri)
            }


            const bodyParameters = {
                idUser:0,
                createdAt:part,
                usedPoint:acCoin,
                idVoucher:idvoucher,
                hinhThuc:"",
                motaThanhtoan:"",
                idlich:Lich.idLich,
                listCTHoadon:list
             };
             console.log(JSON.stringify(bodyParameters))
             if(totalpay === 0){
                console.log("thanh toán qua coin")
                bodyParameters.hinhThuc = "Coin"
                bodyParameters.motaThanhtoan = "coin"

                CreateHoadon(bodyParameters)
             }else{
                console.log("thanh toán qua paypal")
                let price = (totalpay) / (22790)  // vnd to usd
                price = Math.round(price * 100) / 100
                localStorage.setItem("order",JSON.stringify(bodyParameters))
                window.location.href= hostname+"/api/payment/pay?price="+price;
             }
         }

         const CreateHoadon=(body)=>{
            console.log(JSON.stringify(body))

            post("/api/customer/hoadon/create", body)
            .then((Response)=>{
                console.log("create hoa don success")
                let Strghe = (localStorage.getItem("ghengoi"))

                setTimeout(() => {
                        onSendT(Strghe)
                }, 1000);

                swal("Đặt vé thành công !!!", {
                    buttons: {
                      Accept: "OK",
                    },
                  })
                  .then((value) => {
                    switch (value) {
                      case "Accept":
                        history.push("/myaccount")
                        break;
                      default:
                        history.push("/myaccount") 
                    }
                  });
            })
            .catch((Error)=>{
                console.log("create hoa don failed")
                console.log(Error.response.data);
                console.log(Error.response.status);
                console.log(Error.response.headers);

                swal("Đặt vé thất bại !!!", {
                    buttons: {
                      Accept: "OK",
                    },
                  })
                  .then((value) => {
                    switch (value) {
                      case "Accept":
                        history.push("/ticket")
                        break;
                      default:
                        history.push("/ticket") 
                    }
                  });
            })
         }

         const giammgia=()=>{
             
            let id = document.getElementById("magiamgia").value
            if(id.length <2){
                return false
            }

            post('/api/customer/voucher/check?idVoucher='+id)
            .then((Response)=>{
                console.log("check idvoucher "+id +" success")
                document.getElementById("magiamgia").setAttribute("disabled","disabled");
                document.getElementById("btnmagiamgia").setAttribute("disabled","disabled");
                document.getElementById("huymagiamgia").style.display = 'block'

                localStorage.setItem("idvoucher",Response.data.idVoucher)

                swal({
                    title: "Áp dụng code "+id +" thành công",
                    text: "",
                    icon: "success",
                    button: "OK",
                  });

                  let giamN = (total*Response.data.percentageOff)/100
                  let giamold = acGiam;
                  setacGiam((giamold + giamN))
                  let totalpayold = totalpay;
                  let tongN = totalpayold - (giamold + giamN)
                  if(totalpay === 0){

                  }else{
                      settotalpay(tongN)
                  }
                  
            })
            .catch((Error)=>{
                console.log("get lich with id = "+id+" error")
                localStorage.removeItem("idvoucher")
                swal({
                    title: "Áp dụng code "+id +" thất bại",
                    text: "",
                    icon: "warning",
                    button: "OK",
                  });
            })
        }


        const Huygiamgia=()=>{
            document.getElementById("magiamgia").removeAttribute("disabled");
            document.getElementById("btnmagiamgia").removeAttribute("disabled");
            document.getElementById("huymagiamgia").style.display = 'none'

            localStorage.removeItem("idvoucher")

            setacGiam(0)

            let giam = acGiam
            let tong = totalpay

            if(total - acCoin === 0){
                settotalpay(0)
            }else{
                settotalpay(tong + giam)
            }

        }


         const HuyCoinClick=()=>{
            document.getElementById("btncoin").removeAttribute("disabled");
            document.getElementById("huycoin").style.display = 'none'

            setacCoin(0)

            let giam = acCoin
            let tong = totalpay

            settotalpay(tong + giam)
         }

         const CoinClick=()=>{
            //  alert("coin")
             if(Customer.promoPoint < Lich.gia){
                swal({
                    title: "Áp dụng coin thất bại",
                    text: "",
                    icon: "warning",
                    button: "OK",
                  });
                return false;
             }

             document.getElementById("btncoin").setAttribute("disabled","disabled");
             document.getElementById("huycoin").style.display = 'block'

             swal({
                title: "Áp dụng coin thành công",
                text: "",
                icon: "success",
                button: "OK",
              });

            let slghe = (localStorage.getItem("ghengoi")).split(", ")
            let slghethuong = 0
            let slghevip = 0
            let ghevip = [68,69,70] 
            for(let i = 0 ; i < slghe.length - 1 ; i++){
                let hangO = slghe[i].substring(0, 1)
                let nums =  hangO.charCodeAt(0) 

                let check = 0
                for(let i = 0; i < ghevip.length ; i++){
                    if(parseInt(ghevip[i]) === parseInt(nums)){
                        slghevip ++;
                        check = 1
                    }   
                }

                if(check === 1 ) continue
                slghethuong++
            }

            console.log("chekc ghe "+slghethuong + "-"+ slghevip)
            let temp = 0


            //check ghe thuong
            if(slghethuong > 0 ){
                let checkSLTh = 0
                while((temp + Lich.gia) < Customer.promoPoint ){
                    temp+=Lich.gia
                    checkSLTh++
                    if(checkSLTh = slghethuong) break;
                }
            }
            
              //check ghe vip
              if(slghevip > 0){
                let checkSLVi = 0
                while( (temp + Lich.gia) <= Customer.promoPoint ){
                    temp+= (Lich.gia + 5000)
                    checkSLVi++
                    if(checkSLVi = slghevip) break;
                }
            }
          

            setacCoin(temp)
            let tong = totalpay;
            let tongN = tong - temp
            if(tongN < 0){
                settotalpay(0)
            }else{
                settotalpay(tongN)
            }

         }


         const trolai=()=>{
             console.log("tro lai")
            // history.push("/ticket/selectseat/"+Lich.idLich)
            window.location.href= "/ticket/selectseat/"+Lich.idLich;
        }

    return(
        <>
        <div class="header">
            <div className="gnb" style={{marginBottom:20}}>
                <ul >
                       
                        <li >
                        <Link to="/" title="PHIM" 
                        style={{color:"#000", fontSize:16, fontWeight:400}} >PHIM</Link>
                        <div className="depth">
                        <ul>
                        <li  class="active">
                        <Link to="/" title="PHIM HOT TẠI RẠP" >PHIM HOT TẠI RẠP</Link></li>
                        </ul>
                        </div>
                        </li>
                        <li className="active">
                        <a  title="MUA VÉ" 
                        style={{color:"#000", fontSize:16, fontWeight:550}}>MUA VÉ</a>
                        <div className="depth">
                        <ul>
                        <li >
                        <Link to="/ticket" title="PHIM HOT TẠI RẠP" >MUA VÉ XEM PHIM</Link></li>
                        <li>
                        <Link to="/ticket/movie-schedule" title="PHIM HOT TẠI RẠP" >LỊCH CHIẾU PHIM</Link></li>
                        </ul> 
                        </div>
                        </li>
                        <li>
                        <Link to="/cinema" title="RẠP CHIẾU PHIM"
                        style={{color:"#000", fontSize:16, fontWeight:400}} >RẠP CHIẾU PHIM</Link>
                        <div className="depth">
                        </div>
                        </li>
                        <li >
                        <Link to="/voucher" title="KHUYẾN MÃI"
                        style={{color:"#000", fontSize:16, fontWeight:400}} >KHUYẾN MÃI</Link>
                        <div className="depth">
                        </div>
                        </li>
                </ul>
            </div>
        </div>
        <div id="container" className="sub" style={{marginTop:43}}>
        <div id="content">
            <div className="orderPayment">
                <div className="orderCont">
                    <h2 className="order_tit Lang-LBL0037">Thanh toán</h2>
                    <fieldset>
                        <legend>Thanh toán</legend>
                        <table border="1" className="tableRet table_typeC">
                            <colgroup>
                                <col style={{width:784}} />
                                <col style={{width: 196}} />
                            </colgroup>
                            <tfoot>
                                <tr>
                                    <td colspan="2">
                                        <dl className="mount">
                                            <dt className="Lang-LBL0039">Tổng số tiền đặt trước phim</dt>
                                            <dd className="sum"><em><strong>{total.toLocaleString('it-IT', {style : 'currency', currency : 'VND'})}</strong></em></dd>
                                        </dl>
                                    </td>
                                </tr>
                            </tfoot>
                            <tbody>
                                <tr>
                                    <td>
                                        <span className="thumImg"> 
                                        <img src={Phim.anh} alt={Phim.tenPhim} />
                                        </span>
                                        <div class="order_Lbox2">
                                            <strong class="order_title">{Phim.tenPhim}({Phim.loaiPhimEntityIdLoaiPhim} {Phim.phanLoai})</strong>
                                            <ul class="order_tList">
                                                <li class="bg_none">
                                                    <em class="Lang-LBL0055">Ngày chiếu </em>{ngayKC}
                                                </li>
                                                <li>
                                                    <em class="Lang-LBL1029">Lịch chiếu phim</em> &nbsp;{gioBd} ~ {gioKT}
                                                </li>
                                                <li>
                                                    <em class="Lang-LBL1030">Rạp chiếu</em> &nbsp;{tenRap}
                                                </li>
                                                <li>
                                                    <em class="Lang-LBL1037">Phòng chiếu</em> &nbsp;{Phong.tenPhong}
                                                </li>
                                                <li>
                                                    <em class="Lang-LBL0038">Số vé</em> &nbsp;{slghe}
                                                </li>
                                                <li>
                                                    <em class="Lang-LBL0033">Ghế ngồi </em>&nbsp;&nbsp;&nbsp;{StrGhe}
                                                </li>
                                            </ul>
                                        </div>
                                    </td>
                                    <td class="sum">
                                         <em><strong>{total.toLocaleString('it-IT', {style : 'currency', currency : 'VND'})}</strong></em>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </fieldset>
                </div>
            </div>
            <div className="dcPayment">
                <div className="dcPayment_inner">
                    <h3 className="dc_tit Lang-LBL0040">Phương thức thanh toán</h3>
                </div>
                <div style={{paddingLeft:15,marginTop:5}}>
                    <form name="demo">
                        <label>
                            <input type="radio" value="PAYPAL" name="radioPay"  id="radioPay" defaultChecked='true'/>
                            <span>Paypal</span>
                        </label>
                        <br/>
                    </form>

                </div>
                <div className="dcPayment_inner">
                    <h3 className="dc_tit Lang-LBL0040">Coin cinema</h3>
                </div>
                <div style={{paddingLeft:15}}>
                        <label style={{paddingLeft:15}}>
                            <span>Số dư: {Customer.promoPoint} coin</span>
                        </label>
                        <br/>
                        <label style={{paddingLeft:15}}>
                            <span>(lưu ý : cinema coin được áp dụng thanh toán thay thế khi số điểm dư lớn hơn hoặc bằng số điểm tất cả vé. Mặc định được áp dụng giảm hóa đơn</span>
                        </label>
                        <br/>
                        <label style={{paddingLeft:15}}>
                            <span>1.000 coin = 1.000 vnđ)</span>
                        </label>
                        <br/>
                        <div style={{display:'flex'}}>
                        <Input  type="button" id="btncoin" onClick={()=>CoinClick()} value="Áp dụng" 
                        style={{width:100,height:40,marginLeft:10,color:'black', backgroundColor:'#dad2b4'}} />
                        <Input  type="button" id="huycoin" onClick={()=>HuyCoinClick()} value="Hủy" 
                        style={{width:50,height:40,marginLeft:10,color:'black', backgroundColor:'red',display:'none'}} />
                        </div>
                </div>
                <div className="dcPayment_inner">
                    <h3 className="dc_tit Lang-LBL0040">Giảm giá</h3>
                </div>
                <div style={{paddingLeft:15}}>
                    <p>Nhập mã giảm giá</p>
                    <div style={{display:'flex'}}>
                        <Input type="text" id="magiamgia" placeholder="mã giảm" autoComplete="off" style={{fontSize:16,width:200}} required />
                        <Input  type="button" id="btnmagiamgia" onClick={()=>giammgia()} value="Áp dụng" style={{width:100,height:40,marginLeft:10,color:'black', backgroundColor:'#dad2b4'}} />
                        <Input  type="button" id="huymagiamgia" onClick={()=>Huygiamgia()} value="Hủy" style={{width:50,height:40,marginLeft:10,color:'black', backgroundColor:'red',display:'none'}} />
                    </div>
                </div>
            </div>
            <div className="btn_wrap">
                <div className="btn_inner">
                    <a style={{cursor:'pointer'}} onclick={()=>trolai()} className="btn_prev Lang-LBL0029">Trở lại</a>
                </div>
            </div>
            <div className="paymentBar">
                <div className="paymentCont">
                    <dl className="paymentPrice">
                        <dt className="total_tit Lang-LBL0043">Thành tiền</dt>
                        <dd>
                            <ul className="order_List">
                                <li>
                                    <strong className="Lang-LBL0035">Đặt trước phim</strong><p>{total.toLocaleString('it-IT', {style : 'currency', currency : 'VND'})}</p>
                                </li>
                                <li>
                                    <strong className="Lang-LBL0035"></strong><p></p>
                                </li>
                            </ul>
                            <p className="price" style={{marginTop:20}}><strong>{total.toLocaleString('it-IT', {style : 'currency', currency : 'VND'})}</strong><span className="Lang-LBL3037"></span></p>
                            <em className="icon minus">Trừ</em>
                        </dd>
                    </dl>
                    <dl className="discount">
                        <dt className="total_tit Lang-LBL0044">Số tiền được giảm</dt>
                        <dd>
                        <ul className="order_List">
                                <li>
                                    <strong className="Lang-LBL0035">coin</strong><p>{acCoin}</p>
                                </li>
                                <li>
                                    <strong className="Lang-LBL0035">mã giảm</strong><p>{acGiam.toLocaleString('it-IT', {style : 'currency', currency : 'VND'})}</p>
                                </li>
                            </ul>
                            <p className="price" style={{marginTop:10}}><strong>{(acGiam + acCoin).toLocaleString('it-IT', {style : 'currency', currency : 'VND'})}</strong><span className="Lang-LBL3037"></span></p>
                            <em className="icon equal">Bằng</em>
                        </dd>
                    </dl>
                    <dl className="shop_mount">
                        <dt className="total_tit Lang-LBL0045">Tông tiền đơn hàng</dt>
                        <dd className="price" style={{marginTop:80}}>
                            <strong>{totalpay.toLocaleString('it-IT', {style : 'currency', currency : 'VND'})}</strong><span className="Lang-LBL3037"></span>
                        </dd>
                        <dd>
                            <a className="btn_purchase Lang-LBL0046" onClick={()=>clickTT()} style={{cursor:'pointer'}} title="Xem thông tin chi tiết phim">Thanh toán</a>
                        </dd>
                    </dl>
                </div>
            </div>
        </div>
        </div>
        </>
    )
}
export default Checkout;