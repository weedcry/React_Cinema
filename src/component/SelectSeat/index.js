import { Link, useHistory } from "react-router-dom";
import './style1.scss'
import iconSeat from '../../assets/images/icon_seat_d.gif'
import './style.js'
import { get } from "../../httpHelper";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import swal from 'sweetalert';
import  SockJS from 'sockjs-client';
import  Stomp from 'stompjs';
import { onSendT } from "./WebSocket";


function SelectSeat(props) {
    let history = useHistory();
    const [Lich, setLich] = useState({gio:"",ngay:""})
    const [DetailLich, setDetailLich] = useState(0)
    const [Phim, setPhim] = useState(0)
    const [Access, setAccess] = useState(1)
    const [Phong, setPhong] = useState({rapEntityIdRap:""})
    const [showGoiy, setshowGoiy] = useState(0)
    const [Load, setLoad] = useState(0)
    const [price, setprice] = useState(0)
    const [strGhe, setstrGhe] = useState("")
    const [change, setchange] = useState(0)
    
    let { id } = useParams();
    let sldatvemax = 10
    var stompClient = useRef(null);
    var DetailL = useRef(0);
    var Lichs = useRef(0);


    useEffect(() => {
        window.scrollTo(0, 0)

        // check login
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

        animationLoad(2)

        //delete item
        localStorage.removeItem("ghengoi")

        if(id !== null && id > 0  ){
            getLich(id)
            getDetailLich(id)
        }else{
            setAccess(0)
        }

        // let lich = (new URLSearchParams(window.location.search)).get("lich")
        // // let access = (new URLSearchParams(window.location.search)).get("access")
        // if(lich !== null && lich !== "" ){
        //     getLich(lich)
        //     getDetailLich(lich)
        // }else{
        //     setAccess(0)
        // }

        connectWebsocket();
        

    }, [])


    const connectWebsocket =()=>{
        // var socket = new SockJS('https://api-cinemas.herokuapp.com/ws');
        var socket = new SockJS('https://api-cinemas.herokuapp.com/ws');
        stompClient = Stomp.over(socket); 
        stompClient.connect({}, onConnected, onError);
    }


    const onConnected=()=>{
        let id = localStorage.getItem("idcustomer")
        if(id === null){
            swal({
                title: "Lỗi kết nối server, Quý khách vui lòng đăng nhập lại",
                text: "",
                icon: "warning",
                button: "OK",
              });
              return false
        }
        stompClient.subscribe('/message_receive/'+id, ReceMess);
    }

    const ReceMess = (payload)=>{

        animationLoad(0.05)
        console.log("nhận data seat "+ payload.body)
        let obj = DetailL;
        let list = DetailL.listVitriSD;

        //list ghe da dat
        let StrGhe = payload.body
        let partGhe = StrGhe.split(", ")
        
        for(let i = 0; i < partGhe.length - 1; i ++){
            let hangO = partGhe[i].substring(0, 1)
            let cotT = partGhe[i].substring(1,partGhe[i].length)
            let hangT = (parseInt(hangO.charCodeAt(0))) - 64

            let vitri = {
                hang:hangT,
                cot:parseInt(cotT),
            }
            list.push(vitri)
        }


         // ghe da dat cu 
         let ghes = ""
         let StrNew = localStorage.getItem("ghengoi")
         console.log("storage ghe ngoi "+ StrNew)
         if(StrNew !== "" && StrNew !== null){
            let ghevip = [68,69,70]  // D, E, F
            let slghe = StrNew.split(", ")
            let tien = 0;
            for(let i = 0 ; i < slghe.length - 1 ; i++){
                let hangO = slghe[i].substring(0, 1)
                let cot =  slghe[i].substring(1, slghe[i].length)
                let nums =  hangO.charCodeAt(0)

                let kttrung = 0;
                for(let j = 0; j < list.length; j++){
                    if(list[j].hang == (parseInt(nums)-64) && list[j].cot == parseInt(cot)){
                        console.log("ghe da sd "+ list[j].hang+"-"+list[j].cot)
                        kttrung = 1
                    }
                }

                if(kttrung === 1 ) continue

                let checkVip = 0
                for(let i = 0; i < ghevip.length ; i++){
                    if(parseInt(ghevip[i]) === parseInt(nums)){
                        tien += Lichs.gia + 5000;
                        checkVip = 1
                    }
                }

                ghes += hangO + cot + ", "
                
                if (checkVip === 1) continue

                tien += Lichs.gia 
            }

            localStorage.setItem("ghengoi",ghes);

            setstrGhe(ghes)
            setprice(tien)
        }else{
            setstrGhe("")
            setprice(0)
        }

        obj.listVitriSD = list
        setDetailLich(obj)
        DetailL = obj
        let num =  Math.floor(Math.random() * 100);
        setchange(num)
    }

    const onError = () =>{
        // connectingElement.textContent = 'Could not connect to WebSocket server. Please refresh this page to try again!';
        // connectingElement.style.color = 'red';
    }  


    const sendT=()=>{

        let num = Math.floor(Math.random() * (5 - 1 + 1) + 1)

        // let Strghe = "A"+num+", "
        let Strghe = "D9, "

        swal(""+Strghe, {
            buttons: {
              Accept: "Xác nhận",
              No: "no"
            },
          })
          .then((value) => {
            switch (value) {
              case "Accept":
                onSendT(Strghe)
                break;
              case "No":
               
                break;
              default:
                
            }
          });


       
    }

    const animationLoad=(time)=>{
        let mili = time*1000
        setLoad(1)
        setTimeout(() => {
            setLoad(0)
        }, mili);

    }


    const getLich=(id)=>{
        get('/api/customer/lich/'+id)
        .then((Response)=>{
            console.log("get lich with id = "+id+" success")

            // check date 
            var part1 = Response.data.ngay.split('-');
            var part2 = Response.data.gio.split(':');
            var mydate = new Date(part1[0], part1[1] - 1, part1[2],part2[0],part2[1]); 
            let  dt = new Date();

            if(dt.getTime > mydate.getTime){
                return false;
            }
            Lichs = Response.data
            setLich(Response.data)
            getPhim(Response.data.phimEntityIdPhim)
            getPhong(Response.data.phongEntityIdPhong)
        })
        .catch((Error)=>{
            console.log("get lich with id = "+id+" error")
        })
    }

    const getDetailLich=(id)=>{

        get('/api/customer/lich/detail/'+id)
        .then((Response)=>{
            console.log("get detail lich with id = "+id+" success")
            DetailL =Response.data
            setDetailLich(Response.data)
        })
        .catch((Error)=>{
            console.log("get detail lich with id = "+id+" error")
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

    // config ghe
    var ngang = []
    for(let i = 0; i < Phong.soCot; i++){
        ngang.push(i)
    }

    var doc = []
    for(let i = 65; i < (65+Phong.soHang); i++){
        let kitu = String.fromCharCode(i);
        doc.push(kitu)
    }

    const kcday=(value)=>{
        let kc = 0

        if(value > 5){
            kc = 22 + (value*26) + 12
        }else{
            kc = 22 + (value*26)
        }
        return kc
    }

    var checkKCDong = []
    const kcdong=(value)=>{
        let check  = 0 ;
        for(let i = 0 ; i < checkKCDong.length;i++){
            if(checkKCDong[i] == value){
                check = 1
            }
        }

        let kc = 0;
        if(check === 0){
            checkKCDong.push(value)
        }

        kc = 26 * checkKCDong.length
        return kc
    }

    // show ghe
     // ghe 
    
    const Showghe=(hang,cot)=>{

        let StrNew = ""
        let count = 0
        var getGheSelect = document.getElementsByClassName("overSelect")
        for(let i = 0; i < getGheSelect.length; i ++){
            count++
            StrNew+= getGheSelect[i].getAttribute("seat-code") + ", "
        }

        // set select còn lại
        if(  count === parseInt(sldatvemax) ){
            let getGheCanSelect = document.getElementsByClassName("select")
            for(let i = 0; i < getGheCanSelect.length; i ++){
                getGheCanSelect[i].classList.add("no_select")
                getGheCanSelect[i].classList.add("pb")
            }

            return false
        }

         // set select còn lại
         if(  count < parseInt(sldatvemax) && count === 9 ){
            let getGheCanSelect = document.getElementsByClassName("pb")
            for(let i = 0; i < getGheCanSelect.length; i ++){
                getGheCanSelect[i].classList.remove("no_select")
            }
            return false
        }


        //  sl vé dat > cho phép
        if(  count > parseInt(sldatvemax) ){
            return false
        }
       
        
        localStorage.setItem("ghengoi",StrNew);
        let ghevip = [68,69,70] 
        setstrGhe(StrNew)
        let slghe = StrNew.split(", ")
        let tien = 0;
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

        setprice(tien)
        //
    }

    const datlai=()=>{
        let StrNew = ""
        let count = 0
        var getGheSelect = document.getElementsByClassName("overSelect")
        for(let i = 0; i < getGheSelect.length; i ++){
            count++
            StrNew+= getGheSelect[i].getAttribute("seat-code") + ", "
        }

        localStorage.setItem("ghengoi",StrNew);
        setstrGhe(StrNew)
        setprice(0)
    }
    
    // D,E,F
    var ghevip = [68,69,70] 
    const jsxShow =(kt,num)=>{
        let check = 0;
        let nums =  kt.charCodeAt(0) 
        for(let i = 0; i < ghevip.length ; i++){
            if(parseInt(ghevip[i]) === parseInt(nums)){
                check = 1
            }
        }

        for(let j = 0 ; j < DetailLich.listVitriSD.length ; j++){
            let cot = DetailLich.listVitriSD[j].cot - 1;
            let hang = DetailLich.listVitriSD[j].hang
            if(hang === (parseInt(nums)-64)  && cot === num ){
                check = 2
            }
        }

        let setCode = kt+(num+1)
        return(
            <>
                {(check === 0?
                <>
                {/* <span className="seat_tit" style={{left:-30,top:kcdong(kt)}}>{kt}</span> */}
                <a href="javascript:void(0);" className="p0 grNum3 select" data-seat={kt} seat-statuscode={setCode} block-code="p0" 
                seat-group="grNum3" onClick={(e)=>Showghe(kt,num)}  style={{left: kcday(num) , top:kcdong(kt)}}title={setCode} seat-code={setCode}>{num+1}</a>
                </>
                :
                (check === 1 ?
                <>
                {/* <span className="seat_tit" style={{left:-30,top:kcdong(kt)}}>{kt}</span> */}
                <a href="javascript:void(0);" class="special_fee p1 grNum9 select" data-seat={kt} seat-statuscode={setCode} block-code="p1"
                seat-group="grNum10" onClick={(e)=>Showghe(kt,num)} style={{left: kcday(num) ,top:kcdong(kt)}} title={setCode} seat-code={setCode}>{num+1}</a>
                </>    
                    :
                <>
                <a href="javascript:void(0);" class="special_fee p1 grNum9 completed" data-seat={kt} seat-statuscode={setCode} block-code="p1"
                seat-group="grNum10" onClick={(e)=>Showghe(kt,num)} style={{left: kcday(num) ,top:kcdong(kt)}} title={setCode} seat-code={setCode}>{num+1}</a>
                </>    
                )
                )}
            </>
           
        )
    }


    const nextCheckout=()=>{
        if(price === 0){
            swal({
                title: "Bạn phải chọn ghế trước",
                text: "",
                icon: "warning",
                button: "OK",
              });
            return false;
        }
        history.push("/ticket/checkout?IDLich="+Lich.idLich)
    }


    // select
    const getselect = () =>{

        // get ghe da chon
        var getGheSelect = document.getElementsByClassName("overSelect")
        for(let i = 0; i < getGheSelect.length; i ++){
            console.log(getGheSelect[i].getAttribute("seat-code"))
        }

        // disabled ghe ngoai ghe da chon
        var getGheNoSelect = document.getElementsByClassName("select")
        for(let i = 0; i < getGheNoSelect.length; i ++){
            getGheNoSelect[i].classList.add("no_select")
        }

    }

    const changeGoiy=()=>{
        if(showGoiy === 0){
            setshowGoiy(1)
        }else{
            setshowGoiy(0)
        }
    }

    // so luong ve 
    let slve = []
    for(let i = 1 ; i < 9 ; i++){
        slve.push(i)
    }


    return(
        <>
         {(Load === 0?
        <></>
        :
        <div class="skload">
            <div class="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
        </div>
        )}
        <div class="header">
            <div className="gnb" style={{marginBottom:20}}>
                <ul >
                        <li >
                        <Link to="/" title="PHIM" 
                        style={{color:"#000", fontSize:16, fontWeight:400}} >PHIM</Link>
                        <div className="depth">
                        <ul>
                        <li>
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
        <div id="container" className="sub" style={{marginTop:50}}>
        <div id="content">
			<div className="seatwrap">
            <div className="seatArea">
                <div className="seatheader">
				    <h2 className="seatTit Lang-LBL1001">Chọn ghế</h2>
					<ul className="sear_right">
						<li className="layer" style={{display:'none'}}>
							<span className="seat_notice notice_btn"><em className="Lang-LBL1002">Thông báo của rạp chiếu phim</em>
								<a href="j" title="Xem thông tin chi tiết">
                                    <img src={iconSeat} alt="Thông báo của rạp chiếu phim"/>
                                </a>
							</span>
							<div className="layer_seat"  style={{display:'none'}}>
								<div className="seat_in">
									<p></p>
								</div>
							</div>
						</li>
						<li className="reset" id="resetGhe" onClick={(e)=>datlai()}>
                            <a style={{cursor:"pointer"}}  className="Lang-LBL1004"  title="Đặt lại">Đặt lại</a>
                        </li>
					</ul>
				</div>
				<div className="selectbox">
					<div className="seat_Bottom" >
						<dl className="seat_set" style={{display:'flex'}}>
                            <dt className="seat_setup" style={{display:'flex'}}>
								<em className="Lang-LBL1005">Chọn ghế liền nhau</em>
								<a className="hoverDetail" onClick={(e)=>changeGoiy()} style={{cursor:'pointer'}} title="Xem thông tin chi tiết">
                                    <img src={iconSeat} alt="Hướng dẫn cài đặt chỗ ngồi"/></a>
                                {(showGoiy === 0 ?
                                 <div className="layer_seat" style={{display:'none'}}>
                                    <div className="seat_in">
                                        <p className="Lang-LBL1006">Bạn có thể chọn ghế liền nhau bằng cách click chọn vào từng mục bên cạnh.</p>
                                    </div>
                                </div>
                                :
                                <div className="layer_seat" style={{display:'block'}}>
                                    <div className="seat_in">
                                        <p className="Lang-LBL1006">Bạn có thể chọn ghế liền nhau bằng cách click chọn vào từng mục bên cạnh.</p>
                                    </div>
                                </div>
                                )}
                               
							</dt>
                            <dd>
						        <ul className="seat_setting" style={{display:'flex'}}>
                                   
                                   
                                    <li className="per1 on">
                                        <input type="radio" name="radio01" id="per1" value="1" defaultChecked="true"/>
                                        <label for="per1"><em>Một chỗ ngồi</em></label>
                                    </li> 
							        <li className="per2 on">
                                        <input type="radio" name="radio01" id="per2" value="2"   />
                                        <label for="per2"><em>2 ghế liên tiếp</em></label>
                                    </li>
							       
							        {/* <li className="per3">
                                        <input type="radio" name="radio01" id="per3" value="3"/>
                                        <label for="per3"><em>3 chỗ ngồi liên tiếp</em></label>
                                    </li>
							        <li className="per4 on"><input type="radio" name="radio01" id="per4" value="4"/>
                                        <label for="per4"><em>4 chỗ ngồi liên tiếp</em>
                                        </label>
                                    </li> */}
						        </ul>
                            </dd>
                        </dl>
                        <p className="advice" id="pAdvice">Có thể chọn tối đa {sldatvemax} ghế.(Max: {sldatvemax})</p>
					</div>
                    <p className="seat_txt2"  style={{display:'none'}}></p>
				</div>
			  </div>
            </div>
            <div className="mseat_wrap">
				<div className="mseat_inner">
                    <div className="screen_box">
                        <strong className="screen_tit">Screen</strong>
                        <div className="screen_scroll">
						    <div className="screen_Fbox seatSet1">
                                <span className="floor_tit" style={{display:'none'}}>
                                <em>3F</em>
                                </span>
                                <div className="seat_Barea"> 
                                    <div className="seat_area" style={{height:306,marginLeft:238}} >
                                    {doc.map((kt)=>(
                                        <>
                                        <span className="seat_tit" style={{left:-30,top:kcdong(kt)}}>{kt}</span>
                                          {ngang.map((num)=>(
                                            jsxShow(kt,num)
                                            ))}
                                        </>
                                    ))}

                                        {/* <span className="seat_tit" style={{left:-30,top:0}}>A</span>
                                        <span className="seat_tit" style={{left:-30,top:52}}>C</span>
                                        {ngang.map((num)=>(
                                            <a href="javascript:void(0);" class="special_fee p1 grNum9 select" data-seat="C" seat-statuscode="0" block-code="p1"
                                             seat-group="grNum9" style={{left: kcghe(num) ,top:52}} title="Số ghế:C" seat-code="1C">{num+1}</a>
                                        ))}
                                        <span className="seat_tit" style={{left:-30,top:78}}>D</span>
                                        {ngang.map((num)=>(
                                            <a href="javascript:void(0);" class="special_fee p1 grNum9 no_select" data-seat="D" seat-statuscode="0" block-code="p1"
                                             seat-group="grNum10" style={{left: kcghe(num) ,top:78}} title="Số ghế:D" seat-code="1D">{num+1}</a>
                                        ))} */}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="seat_eBox">
                            <ul className="seat_txt">
                              <li className="Lang-LBL1008">Nhấp lại vào chỗ ngồi đã chọn để hủy.</li>
                              <li className="Lang-LBL1008">ghế chọn được cập nhật trực tiếp khi đã được đặt.</li>
                           </ul>
                            <ul className="seat_info">
                                <li className="s2 Lang-LBL1011">Ghế đã chọn</li>
                                <li className="s3 Lang-LBL1012">Ghế có thể chọn</li>
                                <li className="s4 Lang-LBL1013">Ghế đã mua</li>
                                <li className="s5 Lang-LBL1014">Ghế không thể chọn</li>
                            </ul>
                        </div>
                    </div>
                </div>
			</div>
            <div className="info_wrap">
				<div className="info_list">
                    <ul className="list_center">
                        <li className="m01">
                            <a href="j" className="Lang-LBL1039" title="SWEET SPOT">Ghế Thường</a>
                            <div className="layer_seat" style={{display:'none'}}>
                                <div className="seat_in">
                                    <p className="Lang-LBL1015">Đây là nơi bạn có thể thưởng thức hình ảnh và âm thanh tốt nhất được Lotte Cinema giới thiệu.</p>
                                </div>
                            </div>
                        </li>
                        <li className="m03">
							<a href="ja" className="Lang-LBL1040" title="Ghế VIP">Ghế VIP</a>
                            <div className="layer_seat" style={{display:'none'}}>
                                <div className="seat_in">
                                    <p className="Lang-LBL1018">Phòng chiếu riêng biệt với 4•6 phòng với ghế sofa, bàn và hệ thống âm thanh riêng biệt.</p>
                                </div>
                            </div>
						</li>
                    </ul>
				</div>
			</div>
            <div className="btn_wrap" id="btn_wrapid" >
				<div className="btn_inner" >
					<Link to="/ticket" className="btn_prev Lang-LBL1024" title="Các bước trước">Trở lại</Link>
					<a onClick={()=>nextCheckout()} style={{cursor:'pointer'}} className="btn_next Lang-LBL1025" title="Các bước tiếp theo">Bước tiếp theo</a>
				</div>
			</div>
            <div className="total_wrap">
                <div className="total_inner">
                    <div className="total_slide">
                        <ul>
                            <li style={{width:400}}>
                                <dl>
                                    <dt className="total_tit Lang-LBL1026">Phim chiếu rạp</dt> 
                                    <dd>
                                        <dl className="total_data">
                                            <dt id="moviePoster">
                                                <img src={Phim.anh} alt={Phim.tenPhim} />
                                            </dt>
                                            <dd>
                                                <strong className="movie_name">{Phim.tenPhim}</strong>
                                                <em className="movie_sort">{Phim.loaiPhimEntityIdLoaiPhim}</em>
                                                <p className="movie_grade">{Phim.doTuoi} tuổi trở lên</p>
                                            </dd>
                                        </dl>
                                    </dd>
                                </dl>
                            </li>
                            <li>
                                <dl>
                                    <dt className="total_tit Lang-LBL1027">Thông tin vé đã đặt</dt>
                                    <dd>
                                        <dl className="total_data">
                                            <dt className="Lang-LBL1028">Ngày</dt> 
                                            <dd className="day_data">{ngayKC}</dd>
                                            <dt className="Lang-LBL1029">Giờ chiếu</dt> 
                                            <dd className="time_data">{gioBd} ~ {gioKT}</dd>
                                            <dt className="Lang-LBL1030">Rạp chiếu</dt>
                                            <dd className="name_data">{tenRap}, <br/>{DetailLich.tenPhong}</dd>
                                            <dt className="Lang-LBL1031">Ghế ngồi</dt> 
                                            <dd className="seat_data">{strGhe}</dd>
                                        </dl>
                                    </dd>
                                </dl>
                            
                                <strong className="total_sum seatSum" style={{paddingTop:10}}><span>{price.toLocaleString('it-IT', {style : 'currency', currency : 'VND'})}</span><em className="Lang-LBL3037"></em></strong>
                            </li>
                            {/* <li className="carouselView">
                                <dl>
                                    <dt className="total_tit Lang-LBL1032">Thông tin sản phẩm</dt>
                                    <dd className="total_sweet">
                                        <p className="Lang-LBL1033">Vui lòng chọn một sản phẩm.</p> 
                                    </dd>
                                </dl>
                                <strong className="total_sum prodSum prodView" style={{display:'none'}}>
                                    <span>{price.toLocaleString('it-IT', {style : 'currency', currency : 'VND'})}</span><em class="Lang-LBL3037"></em>
                                </strong>
                            </li> */}
                            <li>
                                <dl>
                                    <dt className="total_tit Lang-LBL1034">Tông tiền đơn hàng</dt>
                                    <dd>
                                        <dl className="total_data sum">
                                            <dt className="Lang-LBL1035" style={{fontWeight:400}}>Đặt trước phim</dt>
                                            <dd className="seatSum"><span>{price.toLocaleString('it-IT', {style : 'currency', currency : 'VND'})}</span><em className="Lang-LBL3037"></em></dd>
                                            <dt className="carouselView Lang-LBL1036 prodView" style={{display:'none'}}>Mua hàng</dt> 
                                            <dd className="prodSum carouselView prodView" style={{display:'none'}}>
                                                <span>0</span><em class="Lang-LBL3037">₫</em>
                                            </dd>
                                        </dl>								
                                    </dd>
                                </dl>
                                <strong className="total_sum fixSum"><span>{price.toLocaleString('it-IT', {style : 'currency', currency : 'VND'})}</span><em className="Lang-LBL3037"></em></strong>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        </div>
        {/* <button onClick={(e)=>sendT()}>send</button> */}
        </>
    )
}
export default SelectSeat;