import { Link } from "react-router-dom";
import './style1.scss'

import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { useEffect, useState } from "react";

import btnclose from '../../assets/images/btn_mv_close.gif'
import { Button } from "bootstrap";
import { get } from "../../httpHelper";
import ItemTicket from "./ItemTicket";

function Ticket(props) {

    const [listKhuvuc, setlistKhuvuc] = useState([])
    const [selectkv, setselectkv] = useState(0)
    const [selectPhim, setselectPhim] = useState(0)
    const [Rap, setRap] = useState({idRap:""})
    const [numchoice, setnumchoice] = useState(1)
    const [listLich, setlistLich] = useState([])
    const [listPhong, setlistPhong] = useState([])
    const [listPhim, setlistPhim] = useState({listResult:[]})
    const [listPhimActive, setlistPhimActive] = useState([])
    const [listRapActive, setlistRapActive] = useState([])
    const [Test, setTest] = useState([])
    const [Load, setLoad] = useState(0)


    window.scrollTo(0, 0)

    useEffect(() => {
        animationLoad(1.5)
        get('/api/customer/khuvuc/get')
        .then((Response)=>{
            console.log("get khuvuc success")
            setlistKhuvuc(Response.data)
            setselectkv(Response.data[0].idKhuVuc)
            // get time now

            setTimeout(() => {
                let now = new Date();
                let dateChoice =  ((now.getDate())+"-"+(now.getMonth()+1)+"-"+now.getFullYear())

            }, 500);

        })
        .catch((Error)=>{
            console.log("get khuvuc error" + Error.toString())
        })

        let status = "dangchieu"
        get('/api/customer/phim/page?status='+status+'&time=0&rap=0')
        .then((response)=>{
            console.log("get list phim "+status+" success")
            setlistPhim(response.data)
                let IDPhim = (new URLSearchParams(window.location.search)).get("IDPhim")
                if(IDPhim !== null && parseInt(IDPhim) > 0){
                    LoadPhim(IDPhim,response.data)
                }
        })
        .catch((error)=>{
            console.log("get list phim  "+status+" error")
        })


        // set day now
        let DateN = new Date();
        var timenowU = new Date(DateN.getFullYear(),(DateN.getMonth()),DateN.getDate());
        let dayN = timenowU.getTime()
        setnumchoice(dayN)  

        
    }, [])


    const LoadPhim = (id,list) =>{
        console.log("vào "+ list.listResult.length)
        let phim = ''
        for(let i = 0 ; i < list.listResult.length; i++){
            console.log()
            if(list.listResult[i].idPhim == id){
                phim = list.listResult[i];
            }
        }
        ChangePhim(phim)
    }
    
    const animationLoad=(time)=>{
        let mili = time*1000
        setLoad(1)
        setTimeout(() => {
            setLoad(0)
        }, mili);

    }


    const getLichfromDateAndRap=(date,idRap)=>{
        // time = 16-10-2021 , rap = HCM_QUAN1 , khuvuc = 0
        get('/api/customer/lich/page?time='+date+'&phim=0&rap='+idRap+'&khuvuc=0')
        .then((Response)=>{
            console.log("get lich from date (" +date+") and rap("+idRap+")" +" success");
            setlistLich(Response.data)
        })
        .catch((error)=>{
            console.log("get lich from date (" +date+") and rap("+idRap+")" +" error");
            setlistLich([])
        })
    }

    const getPhongFromRap=(idrap)=>{
        get('/api/customer/phong/rap/'+idrap)
        .then((Response)=>{
            console.log("get phong from rap success");
            setlistPhong(Response.data)
        })
        .catch((error)=>{
            console.log("get phong from rap error");
            setlistPhong([])
        })
    }


    const getLichFromDateAndRapAndPhim=(date,idRap,idPhim)=>{
        // time = 16-10-2021 , rap = HCM_QUAN1 , khuvuc = 0
        get('/api/customer/lich/page?time='+date+'&phim='+idPhim+'&rap='+idRap+'&khuvuc=0')
        .then((Response)=>{
            console.log("get lich from date (" +date+")  and phim("+idPhim+") and rap("+idRap+")" +" success");
            setlistLich(Response.data)
        })
        .catch((error)=>{
            console.log("get lich from date (" +date+") and phim("+idPhim+")rap("+idRap+")" +" error");
            setlistLich([])
        })
    }

    const getLichFromDateAndRap=(date,idRap)=>{
        // time = 16-10-2021 , rap = HCM_QUAN1 , khuvuc = 0
        get('/api/customer/lich/page?time='+date+'&phim=0&rap='+idRap+'&khuvuc=0')
        .then((Response)=>{
            console.log("get lich from date (" +date+") and rap("+idRap+")" +" success");
            setlistPhimActive(Response.data)
        })
        .catch((error)=>{
            console.log("get lich from date (" +date+") and rap("+idRap+")" +" error");
            setlistPhimActive([])
            setselectPhim(0)
        })
    }

    const getRapFromDateAndPhim=(date,idPhim)=>{
        // time = 16-10-2021 , rap = HCM_QUAN1 , khuvuc = 0
        get('/api/customer/rap/active?time='+date+'&phim='+idPhim)
        .then((Response)=>{
            console.log("get rap from date (" +date+") and phim("+idPhim+")" +" success");
            setlistRapActive(Response.data)
        })
        .catch((error)=>{
            console.log("get rap from date (" +date+") and phim("+idPhim+")" +" error");
            setlistRapActive([])
            setRap({idRap:""})
        })
    }


    const changeRap=(rap)=>{
        
        setRap(rap)

        let idphim = selectPhim.idPhim;
        let idRap = rap.idRap
        let DateNoNum =  new Date(numchoice)
        let dayNo = DateNoNum.getDate()
        var strDate = dayNo+"-"+(DateNoNum.getMonth()+1)+"-"+DateNoNum.getFullYear()

       if(selectPhim === 0){
            animationLoad(1)
            getLichFromDateAndRap(strDate,idRap)
       }else{
            animationLoad(1.5)
            getLichFromDateAndRap(strDate,idRap)
            getLichFromDateAndRapAndPhim(strDate,idRap,idphim)
       }
      
    }


    const closeRap=()=>{
        animationLoad(1)
        setRap({idRap:""})
        setlistLich([])
    }

    const ChangePhim=(value)=>{
        setselectPhim(value)
        let idRap = Rap.idRap
        let idphim = value.idPhim
        let DateNoNum =  new Date(numchoice)
        let dayNo = DateNoNum.getDate()
        var strDate = dayNo+"-"+(DateNoNum.getMonth()+1)+"-"+DateNoNum.getFullYear()
        if(Rap.idRap === ""){
            animationLoad(1)
            getRapFromDateAndPhim(strDate,idphim)
        }else{
            animationLoad(1.5)
            getRapFromDateAndPhim(strDate,idphim)
            getLichFromDateAndRapAndPhim(strDate,idRap,idphim)
        }
        
    }

    const closePhim=()=>{
        animationLoad(1)
        setselectPhim(0)
        setlistLich([])
    }


    const changeDate=(numb)=>{
        animationLoad(1.5)
        setnumchoice(numb)
       if(Rap.idRap !== "" && selectPhim !== 0 ){
            setTimeout(() => {
                let now = new Date(numb);
                let dateChoice =  ((now.getDate())+"-"+(now.getMonth()+1)+"-"+now.getFullYear())
                let idphim = selectPhim.idPhim;
                let idRap = Rap.idRap
                getLichFromDateAndRapAndPhim(dateChoice,idRap,idphim)
            }, 1000);
       }else{
            let now = new Date(numb);
            let dateChoice =  ((now.getDate())+"-"+(now.getMonth()+1)+"-"+now.getFullYear())
            if(Rap.idRap === ""){
                let idphim = selectPhim.idPhim;
                getRapFromDateAndPhim(dateChoice,idphim)
            }else{
                // selectPhim === 0
                let idRap = Rap.idRap
                getLichFromDateAndRap(dateChoice,idRap)
            }
       }
       
    }


    const checkRapFromList = (id)=>{
        let result = 0
        if(selectPhim === 0){
            result = 1
            return result
        }
        listRapActive.filter((rap) => {   
            if(rap.idRap === id){            
                 result = 1
                return result
            }           
         })
         return result;
    }

    let jsxKhuvuc = listKhuvuc.map((khuvuc)=>{
        let sorap = khuvuc.listRap.length;
        
        return <>
                <li className="area0001">   
                    {(selectkv === khuvuc.idKhuVuc?
                    <>
                    <span className="area_zone" >
                     <a style={{cursor:'pointer'}} className="on">
                            <h4 style={{ paddingTop: 10 }}>{khuvuc.tenKhuVuc}(<em>{sorap}</em>)</h4>
                            <div className="blind">Đã chọn</div>
                    </a>
                    </span>
                    <div className="area_cont on ">      
                        <ul className="area_list d0001">      
                            {khuvuc.listRap.map((rap)=>{
                                let check = checkRapFromList(rap.idRap)
                                return  <>
                                        {(rap.idRap === Rap.idRap ? 
                                        <li>  
                                            <a style={{cursor:'pointer'}} className="100018009 on">{rap.tenRap}</a>
                                        </li>
                                        :
                                        <>
                                        {(check === 0?
                                            <li>  
                                                <a  class="100018008 disabled">{rap.tenRap}</a>
                                            </li>   
                                        :
                                            <li>  
                                                <a style={{cursor:'pointer'}}  onClick={(e)=>changeRap(rap)}  claclassNamess="100018009">{rap.tenRap}</a>
                                            </li>
                                            )}
                                        </>
                                       )}
                                        </> 
                            })}
                            {/* <li>  
                                <a href="javascript:void(0);" class="100018009 on">C</a>
                            </li>
                                <li>  
                                <a href="javascript:void(0);" class="100018008 ">D</a>
                            </li>
                            <li>  
                                <a href="javascript:void(0);" class="100018008 disabled">D</a>
                            </li> */}
                        </ul>
                    </div>
                     </>
                     :
                     <>
                    <span className="area_zone" >
                     <a style={{cursor:'pointer'}} onClick={(e)=>setselectkv(khuvuc.idKhuVuc)} >
                            <h4 style={{ paddingTop: 10 }}>{khuvuc.tenKhuVuc}(<em>{sorap}</em>)</h4>
                    </a>
                    </span>
                    <div className="area_cont">      
                        <ul className="area_list d0001">      
                            {khuvuc.listRap.map((rap)=>{
                                return  <>
                                        {(rap.idRap === Rap.idRap ? 
                                        <li>  
                                            <a style={{cursor:'pointer'}} className="100018009 on">{rap.tenRap}</a>
                                        </li>
                                        :
                                        <li>  
                                            <a style={{cursor:'pointer'}}  onClick={(e)=>changeRap(rap)}  claclassNamess="100018009">{rap.tenRap}</a>
                                         </li>
                                       )}
                                        </> 
                            })}
                        </ul>
                    </div>
                     </>
                     )}
                </li>
                </>
    })



    const checkPhimFromList = (id)=>{
        let result = 0
        if(Rap.idRap === ""){
            result = 1
            return result
        }
        listPhimActive.filter((phim) => {   
            if(phim.idPhim === id){            
                 result = 1
                return result
            }           
         })
         return result;
    }

    let jsxPhim = listPhim.listResult.map((phim)=>{
        let check = checkPhimFromList(phim.idPhim);

        let clss = ""
        if(phim.doTuoi == "C18"){
            // document.getElementById(phim.idPhim).classList.add("grade_18");
            clss = "grade_18"
        }else{
            if(phim.doTuoi == "C16"){
                // document.getElementById(phim.idPhim).classList.add("grade_16");
                clss = "grade_16"
            }else{
                if(phim.doTuoi == "C13"){
                    // document.getElementById(phim.idPhim).classList.add("grade_13");
                    clss = "grade_13"
                }else{
                    // document.getElementById(phim.idPhim).classList.add("grade_all");
                    clss = "grade_all"
                }
            }
        }

        return<>
                {(phim.idPhim === selectPhim.idPhim?
                    <li>
                        <a  class="mov10708 on ">
                            <span id={phim.idPhim} className={clss}></span><em>{phim.tenPhim}</em>
                            <div class="blind">Đã chọn</div>
                        </a>
                    </li>
                :
                <>
                {(check === 0?
                    <li>
                        <a  class="mov10717 disabled" > 
                             <span  id={phim.idPhim} className={clss}></span><em>{phim.tenPhim}</em>
                             <div class="blind">Đã chọn</div>
                       </a>
                     </li>
                     :
                    <li>
                        <a  class="mov107174" onClick={(e)=>ChangePhim(phim)}> 
                           <span id={phim.idPhim} className={clss}></span><em>{phim.tenPhim}</em>
                          <div class="blind">Đã chọn</div>
                         </a>
                    </li>
                    )}
                    </>
                )}
               
            </>
        })


    // month , year
    let numi= numchoice || 1
    let DateNoNum =  new Date(numi)
    let dayNo =  ''
    if(DateNoNum.getDate().toString().length === 1){
        dayNo = "0"+DateNoNum.getDate()
    }else{
        dayNo = DateNoNum.getDate()
    }
    var stringDate = dayNo+"/"+(DateNoNum.getMonth()+1)+"/"+DateNoNum.getFullYear()
    let DateNo = new Date();
    var timenow = new Date(DateNo.getFullYear(),(DateNo.getMonth()),DateNo.getDate());
    let YearN = timenow.getFullYear()
    let monthN = DateNo.getMonth()+1
    var listDate = []
    for(let i = 0; i < 10;i++){
        let numN = timenow.getTime();
        listDate.push(numN+86400000*i)
    }

    // get month english

    const getMonthE=(value)=>{
        const monthE = [ 'January', 'February' , 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        let n = ""
        for(let i = 0 ; i<12;i++){
            if(i === value-1){
                n = monthE[i]
                return monthE[i];
            }
        }
        return n
    }

    const responsive={
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 4
          },
        
          mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 2
          },
        tablet: {
          breakpoint: {
            max: 1024,
            min: 464
          },
          items: 2,
          partialVisibilityGutter: 30
        }
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
                        <li  class="active">
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
        <div id="contentTic" className="ticket_booking">
            <div className="cont_ticket">
                <div className="cont_ticket_Area">
                    <div className="calendar" style={{paddingTop:30}}>
                        <fieldset className="month-picker-fieldset">
                           <span class="month" style={{top:'-47px',left:'47px'}} ><em>{monthN}</em><span>{YearN} {getMonthE(monthN)}</span></span>
                        </fieldset>
                        <div class="calendarArea">
                                {/* <Carousel
                                    ssr={true} // means to render carousel on server-side.
                                    // infinite={true}
                                    centerMode={true}
                                    customTransition="all .5"
                                    containerClass="carousel-container"
                                    dotListClass="custom-dot-list-style"
                                    itemClass="carousel-item-padding-10-px"
                                    additionalTransfrom={0}
                                    arrows
                                    autoPlaySpeed={3000}
                                    className=""
                                    containerClass="container"
                                    dotListClass=""
                                    draggable
                                    focusOnSelect={false}
                                    infinite={false}
                                    keyBoardControl
                                    minimumTouchDrag={80}
                                    renderButtonGroupOutside={false}
                                    renderDotsOutside={false}
                                    responsive={responsive}
                                    showDots={false}
                                    sliderClass=""
                                    slidesToSlide={4}
                                    swipeable >
                                        
                                    {listDate.map((num) => (
                                    <Slidershow number={num} actives={numchoice} choice={changeDate} ></Slidershow>
                                    ))}
                                
                                </Carousel> */}

                                <Carousel  className='categories__slider' draggable={false} containerClass="carousel-container"  infinite={false} responsive={responsive}>
                                {listDate.map((num) => (
                                    <Slidershow number={num} actives={numchoice} choice={changeDate} ></Slidershow>
                                    ))}   
                            </Carousel>
                        </div>
                        
                    </div>
                    <div className="ticket_inner">
                        <div className="ticket_step">
                            <div className="ticket_left">
                                <div className="blind">
                                    <h3>Rạp chiếu phim</h3> 
                                </div>
                                <dl className="theater_header">
                                    <dt className="Lang-LBL0001">Rạp</dt>
                                    <dd className="txt_add"></dd> 
                                </dl>
                                <div className="theater_cont">
                                    <div className="theater_top">
                                        <ul className="theater_list">
                                            <li><a href="javascript:void(0);" className="tab01 on"><span className="Lang-LBL0009"></span>Tất Cả</a></li>
                                            <li><a href="javascript:void(0);" className="tab02"><span className="Lang-LBL0010"></span></a></li>
                                        </ul>
                                    </div>
                                    <div className="tab_srcoll">
                                        <h4 className="blind" id="cinema_title_h4">Tất cả các rạp</h4>
                                        <div class="tab_cont on">
                                            <ul class="theater_zone screen1">
                                                {jsxKhuvuc}
                                            </ul>
                                        </div>
                                        <div className="tab_cont">
                                            <ul className="theater_zone screen2">
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="ticket_right">
                                <dl className="theater_header">
                                    <dt className="Lang-LBL0011">Phim</dt>
                                    <dd className="txt_add"></dd> 
                                </dl>
                                <div className="movie_cont">
                                    <div className="scroll_bar">
                                        <div className="blind">
                                            <h4 id="title_h4">Đặt vé trước</h4> 
                                        </div>
                                        <ul className="movie_list">
                                            {jsxPhim}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="selectMv">
                <div className="selectMv_Area">
                   <dl className="txtdate">
                       <dt className="Lang-LBL0015">Ngày</dt>
                            <dd className="viewCinemaDate">{stringDate}</dd>
                    </dl>
                    <dl className="txtCin">
                        <dt className="Lang-LBL0001">Rạp</dt>
                        <dd>
                        {(Rap.idRap === "" ? 
                            <span className="Lang-LBL0017" style={{display:'inline'}}>Vui lòng chọn phòng chiếu</span>
                        :
                            <ul className="listMv viewCinemaList">
                                <li className="100038039">{Rap.tenRap}<a style={{cursor:'pointer'}} onClick={(e)=>closeRap()}>
                                    <img src={btnclose} alt="close"/></a>
                                </li>
                            </ul>
                        )}
                        </dd>
                    </dl>
                    <dl className="txtName">
                        <dt className="Lang-LBL0011">Phim</dt>
                        <dd>
                            {(selectPhim === 0 ?
                             <span className="Lang-LBL0019" style={{display:'inline'}}>Vui lòng chọn phim</span>
                            :
                            <ul className="listMv viewMovieList">
                                <li className="mov10708">{selectPhim.tenPhim}<a style={{cursor:'pointer'}} onClick={(e)=>closePhim()}>
                                    <img src={btnclose} alt="close"/></a>
                                </li>
                            </ul>
                            )}
                        </dd>
                    </dl>
                </div>
             </div>   
             <div className="time_inner">
                <div className="time_stop">
                    <h3 className="sub_tit02"><span className="Lang-LBL0020">Giờ chiếu</span>
                    <span className="sub_etc Lang-LBL0021">Thời gian chiếu phim có thể chênh lệch 15 phút do chiếu quảng cáo, giới thiệu phim ra rạp</span></h3>
                </div>
                <strong className="blind" id="time_tab_title">Xem theo rạp chiếu phim</strong> 
                {(listLich.length === 0?
                <>
                 {/* nodata */}
                <div className="time_noData">
                    <span className="noData Lang-LBL0027">quý khách chọn phim, Ngày và Rạp để xem lịch chiếu chi tiết</span>
                </div>
                </>    
                :
                <>
                {/* co data */}
                <div className="time_box time_list01">
                    <div className="time_aType movie10708">
                        <h4 className="time_tit"> <span className="grade"></span><em>{listLich[0].tenPhim}</em>   
                         </h4>   
                        <dl className="time_line cinema8039">     
                        <dt>{Rap.tenRap}</dt>   
                            <dd className="screen200100100100100 film200">  
                                 <ul className="cineD1">     
                                     <li>{listLich[0].loaiPhim}</li>      
                                      <li>{listLich[0].phanLoai}</li>   
                                 </ul> 
                                <ul className="theater_time list10708" screendiv="100">  
                                    <ItemTicket lich={listLich[0].lich}  tl = {listLich[0].thoiLuong}></ItemTicket>
                                </ul>
                            </dd>
                         </dl>
                    </div>
                </div>  
                </>                
                )}            
            </div>                                   
        </div>
        </>
    )
}
export default Ticket;


const Slidershow=(props)=>{
    let dateN = new Date(props.number)
    let numb = props.number
    let datN = dateN.getDate()
    let thu = dateN.toString().split(' ')
    let thuVie  = ''
    const thuV = [{e:'Mon',v:'Hai'},{e:'Tue',v:'Ba'},{e:'Wed',v:'Tư'},{e:'Thu',v:'Năm'},{e:'Fri',v:'Sáu'}
        ,{e:'Sat',v:'Bảy'},{e:'Sun',v:'CN'}]
    for(let i = 0 ; i < 7 ; i++){
        if(thu[0] == thuV[i].e){
            thuVie = thuV[i].v
        }
    }
    const acti =()=>{
        props.choice(numb)
    }

    return(
        <>
            {( props.actives === numb ?
            <label  for="October3" className="month-picker-label active" id="activecelen" style={{left:0, paddingLeft:100}}>
                <span>{thuVie}</span>
                <em style={{textAlign:'center'}}>{datN}</em>
            </label>
            :
            <label onClick={acti} for="October3" className="month-picker-label sun" style={{left:0, paddingLeft:100}}>
                <span>{thuVie}</span>
                <em style={{textAlign:'center'}}>{datN}</em>
            </label>
            )}
        </>
    )
}
