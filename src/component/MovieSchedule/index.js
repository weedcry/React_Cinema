import { Link } from "react-router-dom";
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { useEffect, useState } from "react";
import './style1.scss'
import { get } from "../../httpHelper";
import ItemSchedule from "./ItemSchedule";
import ItemLichRap from "./ItemLichRap";


function MovieSchedule(props) {

    const [listKhuvuc, setlistKhuvuc] = useState([])
    const [ScreenSet, setScreenSet] = useState(0)
    const [numchoice, setnumchoice] = useState(1)
    const [movieChoice, setmovieChoice] = useState(0)
    const [selectRap, setselectRap] = useState({idRap:""})
    const [selectKV, setselectKV] = useState(0)
    const [listLich, setlistLich] = useState([])
    const [listPhim, setlistPhim] = useState({listResult:[]})
    const [selectPhim, setselectPhim] = useState(0)
    const [Load, setLoad] = useState(0)

    useEffect(() => {
        animationLoad(1.5)
        get('/api/customer/khuvuc/get')
        .then((Response)=>{
            console.log("get khuvuc success")
            setlistKhuvuc(Response.data)
            setselectKV(Response.data[0].idKhuVuc)
        })
        .catch((Error)=>{
            console.log("get khuvuc error" + Error.toString())
        })


        
        let status = "dangchieu"
        get('/api/customer/phim/page?status='+status+'&time=0&rap=0')
        .then((response)=>{
            console.log("get list phim "+status+" success")
            setlistPhim(response.data)
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

    const animationLoad=(time)=>{
        let mili = time*1000
        setLoad(1)
        setTimeout(() => {
            setLoad(0)
        }, mili);

    }


    const ChangeScreen = ()=>{
        animationLoad(1)
        if(ScreenSet === 0){
            setScreenSet(1)
        }else{
            setScreenSet(0)
            setselectKV(listKhuvuc[0].idKhuVuc)
        }

        setselectRap({idRap:""})
        setselectPhim({listResult:[]})
        setlistLich([])
    }

    const ChangeRap=(rap)=>{
        animationLoad(1)
        setselectRap(rap)
        let now = new Date(numchoice);
        let dateChoice =  ((now.getDate())+"-"+(now.getMonth()+1)+"-"+now.getFullYear())
        getLichfromDateAndRap(dateChoice,rap.idRap)
    }

    const changeDate=(numb)=>{
        animationLoad(1)
        setnumchoice(numb)
       if(ScreenSet === 0){
           let idRap = selectRap.idRap
            let now = new Date(numb);
            let dateChoice =  ((now.getDate())+"-"+(now.getMonth()+1)+"-"+now.getFullYear())
            getLichfromDateAndRap(dateChoice,idRap)
       }else{

            let idphim = selectPhim.idPhim
            let now = new Date(numb);
            let dateChoice =  ((now.getDate())+"-"+(now.getMonth()+1)+"-"+now.getFullYear())
            let idkhuvuc = selectKV.idKhuVuc
            getLichFromDateAndPhimAndKV(dateChoice,idphim,idkhuvuc);
        }
       
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

    let jsxKhuvuc = listKhuvuc.map((khuvuc,index)=>{
        let sorap = khuvuc.listRap.length;
        let kc = index * 122
        return  <>
                 {(selectKV === khuvuc.idKhuVuc?
                    <li>   
                        <span className="area_zone zone_0" style={{left:kc}}>
                        <a href="javascript:void(0);" className="area_btn on" >{khuvuc.tenKhuVuc} (<em>{sorap}</em>)</a>
                        </span>  
                        <div className="area_cont on" style={{display:'block'}}>     
                            <h3 className="blind">{khuvuc.tenKhuVuc}</h3>      
                            <ul className="area_list d1">  
                                {khuvuc.listRap.map((rap)=>{
                                return  <>
                                    {(rap.idRap === selectRap.idRap ? 
                                        <li>   
                                            <a style={{cursor:'pointer'}} className="118008 on">{rap.tenRap}</a>
                                        </li>
                                    :
                                        <li>   
                                            <a style={{cursor:'pointer'}} onClick={(e)=>ChangeRap(rap)} className="118008">{rap.tenRap}</a>
                                        </li>
                                    )}
                                    </> 
                                })} 
                            </ul>  
                        </div>
                    </li>
                    :
                    <li>   
                        <span className="area_zone zone_0" style={{left:kc}}>
                        <a style={{cursor:'pointer'}} onClick={(e)=>setselectKV(khuvuc.idKhuVuc)} 
                        className="area_btn" >{khuvuc.tenKhuVuc} (<em>{sorap}</em>)</a>
                        </span>  
                        <div className="area_cont on" style={{display:'none'}}>     
                            <h3 className="blind">{khuvuc.tenKhuVuc}</h3>      
                            <ul className="area_list d1">  
                                {khuvuc.listRap.map((rap)=>{
                                return  <>
                                    {(rap.idRap === selectRap.idRap ? 
                                        <li>   
                                            <a style={{cursor:'pointer'}} className="118008 on">{rap.tenRap}</a>
                                        </li>
                                    :
                                        <li>   
                                            <a style={{cursor:'pointer'}} onClick={(e)=>ChangeRap(rap.idRap)} className="118008">{rap.tenRap}</a>
                                        </li>
                                    )}
                                    </> 
                                })} 
                            </ul>  
                        </div>
                    </li>
                    )}
                </>
    })


    // screen 2 

    const ChangePhim=(phim)=>{
        animationLoad(1)
        setselectPhim(phim)
        if(selectKV !== 0){
            let idphim = phim.idPhim
            let now = new Date(numchoice);
            let dateChoice =  ((now.getDate())+"-"+(now.getMonth()+1)+"-"+now.getFullYear())
            let idkhuvuc = selectKV.idKhuVuc
            getLichFromDateAndPhimAndKV(dateChoice,idphim,idkhuvuc);
        }
    }

    const ChangeKv=(kv)=>{
        animationLoad(1)
        setselectKV(kv)
        if(selectPhim !== 0){
            let idphim = selectPhim.idPhim
            let now = new Date(numchoice);
            let dateChoice =  ((now.getDate())+"-"+(now.getMonth()+1)+"-"+now.getFullYear())
            getLichFromDateAndPhimAndKV(dateChoice,idphim,kv.idKhuVuc);
        }
    }

    const getLichFromDateAndPhimAndKV=(date,idPhim,idKhuvuc)=>{
        // time = 16-10-2021 , rap = HCM_QUAN1 , khuvuc = 0
        get('/api/customer/lich/page?time='+date+'&phim='+idPhim+'&rap=0&khuvuc='+idKhuvuc)
        .then((Response)=>{
            console.log("get lich from date (" +date+") and phim("+idPhim+") and kv("+idKhuvuc+")"  +" success");
            setlistLich(Response.data)
        })
        .catch((error)=>{
            console.log("get lich from date (" +date+") and phim("+idPhim+") and kv("+idKhuvuc+")"  +" error");
            setlistLich([])
        })
    }

    let jsxKhuvucScreen2 = listKhuvuc.map((khuvuc,index)=>{
        let sorap = khuvuc.listRap.length;
        return<>
            {(khuvuc.idKhuVuc === selectKV.idKhuVuc?
                <li>  
                    <a style={{cursor:'pointer'}} className="on">{khuvuc.tenKhuVuc} (<em>{sorap}</em>)</a>
                </li>
            :
                <li>  
                     <a style={{cursor:'pointer'}} onClick={(e)=>ChangeKv(khuvuc)} >{khuvuc.tenKhuVuc} (<em>{sorap}</em>)</a>
                </li>
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
          breakpoint: {
            max: 3000,
            min: 1024
          },
          items: 3,
          partialVisibilityGutter: 40
        },
        mobile: {
          breakpoint: {
            max: 464,
            min: 0
          },
          items: 1,
          partialVisibilityGutter: 30
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
        <div className="header">
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
                        <li className="active">
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
                <div className="cont_ticket">
                    <div className="cont_ticket_Area">
                    <div className="calendar" style={{paddingTop:30}}>
                        <fieldset className="month-picker-fieldset">
                           <span class="month" style={{top:'-47px',left:'47px'}} ><em>{monthN}</em><span>{YearN} {getMonthE(monthN)}</span></span>
                        </fieldset>
                        <div class="calendarArea">
                                <Carousel
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
                                    <SlidershowTime number={num} actives={numchoice} choice={changeDate} ></SlidershowTime>
                                    ))}
                                
                                </Carousel>
                            </div>
                        </div>
                        <ul className="tab_st08">
                            {(ScreenSet === 0 ? 
                            <>
                             <li><h2><a  className="on Lang-LBL4001">Lịch chiếu phim theo Rạp</a></h2></li>
                            <li><h2><a style={{cursor:'pointer'}} onClick={(e)=>ChangeScreen()} className="Lang-LBL4002">Danh sách phim chiếu theo Rạp</a></h2></li>
                            </>
                            :
                            <>
                             <li><h2><a style={{cursor:'pointer'}} onClick={(e)=>ChangeScreen()} className="Lang-LBL4001">Lịch chiếu phim theo Rạp</a></h2></li>
                            <li><h2><a  className="on Lang-LBL4002">Danh sách phim chiếu theo Rạp</a></h2></li>
                            </>
                            )}
                           
                        </ul>
                    </div>
                </div>
                {(ScreenSet === 0 ?
                <div className="tab_tCont cinema_twrap" style={{display:'block'}}>
                    <h3 className="sub_tit02 Lang-LBL4003">Rạp phim</h3>
                    <ul className="theater_zone">
                       {jsxKhuvuc}
                    </ul>  
                </div>
                :
                <div className="tab_tCont movie_twrap" style={{display:'block'}}>
                    <h2 className="sub_tit02 Lang-LBL4004">Phim Chiếu Rạp</h2>
                    <div className="mslide_boxs">
                        <h3 className="blind" id="title_h3">Đặt vé trước</h3>
                        <div className="control_navi">
                            <ul className="indicator">
                            </ul>
                        </div>
                        <div className="m_hidden">
                            {/* <ul className="m_List">

                            </ul> */}
                            <Carousel
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
                                    slidesToSlide={1}
                                    swipeable >
                                                                            
                                    {/* {listDate.map((num) => (
                                    <SlidershowMovie number={num} actives={movieChoice} choice={setmovieChoice}   ></SlidershowMovie>
                                    ))} */}

                                    {listPhim.listResult.map((phims,index)=>(
                                        <SlidershowMovie phim={phims} kc={index}  active={selectPhim} setActive={ChangePhim} > </SlidershowMovie>
                                    ))}
                                
                            </Carousel>
                        </div>
                    </div>
                </div>
                )}
                <div className="time_wrap">
                    {(ScreenSet === 0 ?
                    <div className="time_inner listViewCinema" style={{display:'block'}}>
                        <h4  className="sub_tit02"><em className="Lang-LBL4007">Lịch chiếu phim</em>
                            <span className="sub_etc Lang-LBL4008">Thời gian chiếu phim có thể chênh lệch 15 phút do chiếu quảng cáo, giới thiệu phim ra rạp</span>
                        </h4>
                        <h5 className="blind" id="title_h4"></h5>
                        <h6 className="blind" id="title_h5"></h6>
                        
                        <div className="time_line">
                            {(listLich.length ===0 ?
                                <div className="time_noData">
                                    <span className="noData">quý khách chọn Rạp và Ngày để xem lịch chiếu chi tiết tại </span> 
                                </div> 
                            :
                                <div className="time_box time_list02">
                                {listLich.map((lichs)=>(
                                    <ItemSchedule lich={lichs}></ItemSchedule>
                                ))}                    
                                </div>
                            )}

                        </div>
                    </div>
                    :
                    <div className="time_inner listViewMovie" style={{display:'block'}}>
                        <h4 className="sub_tit02"><em className="Lang-LBL4007">Lịch chiếu phim</em>
                            <span className="sub_etc Lang-LBL4008">Thời gian chiếu phim có thể chênh lệch 15 phút do chiếu quảng cáo, giới thiệu phim ra rạp</span>
                        </h4>
                        <ul className="tab_st09" style={{display:'block'}}>
                               {jsxKhuvucScreen2}
                        </ul>
                        <h5 className="blind" id="title_h4_2"></h5>

                        <div className="time_line" style={{paddingTop:50}}>
                            {(listLich.length ===0 ?
                                <div className="time_noData">
                                    <span className="noData">quý khách chọn phim, ngày và khu vực để xem lịch chiếu chi tiết </span> 
                                </div> 
                            :
                                <>
                                 <div className="time_box time_list02">
                                  {listLich.map((lichs)=>(
                                    <ItemLichRap lich={lichs} phim={selectPhim} ></ItemLichRap>
                                    ))}
                                    </div>
                                </>
                            )}           
                            {/* havedata */}
                            <dl className="cine8021">   
                            </dl>
                        </div>
                    </div>
                    )}
                </div>
            </div>
        </div>
        </>
    )
}
export default MovieSchedule;

const SlidershowTime=(props)=>{
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
            <label  for="October3" className="month-picker-label active" id="activecelen" style={{left:0}}>
                <span>{thuVie}</span>
                <em style={{textAlign:'center'}}>{datN}</em>
            </label>
            :
            <label onClick={acti} for="October3" className="month-picker-label sun" style={{left:0}}>
                <span>{thuVie}</span>
                <em style={{textAlign:'center'}}>{datN}</em>
            </label>
            )}
        </>
    )
}

function SlidershowMovie(props){
    let phim = props.phim
    let kc = props.kc * 188
    let phimactive = props.active

    const setAc=()=>{
        props.setActive(phim)
        console.log("v")
    }

    return(
        <>
            {(phimactive.idPhim === phim.idPhim?
                <li className="filterFilm filterFilmon" style={{left:0}}>
                    <span className="img" style={{width:kc}}>
                        <a style={{cursor:'pointer'}}>
                            <img src={phim.anh}  alt={phim.tenPhim} />
                        </a>
                    </span>
                    <p className="list_text" >
                        <a id="limovieshow" style={{cursor:'pointer'}}>
                        <span className="grade_13">13</span>{phim.tenPhim}</a>
                    </p>
                </li>
            :
                <li className="filterFilm " style={{left:0}}>
                    <span className="img" style={{width:kc}}>
                        <a style={{cursor:'pointer'}} onClick={(e)=>setAc()}>
                            <img src={phim.anh}  alt={phim.tenPhim} />
                        </a>
                    </span>
                    <p className="list_text" style={{marginTop:5}}>
                        <a id="limovieshow" style={{cursor:'pointer'}} onClick={(e)=>setAc()}>
                        <span className="grade_13">13</span>{phim.tenPhim}</a>
                    </p>
                </li>
            )}
            
        </>
    )
}
