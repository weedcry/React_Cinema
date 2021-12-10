import { Link } from "react-router-dom"
import './style.scss'
import bg1 from '../../assets/images/cinema.jpg'
import dv from '../../assets/images/gg.svg'
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { useEffect, useState } from "react";
import { get } from "../../httpHelper";
import ItemSchedule from "./ItemSchedule";
import GoogleMapReact from 'google-map-react';
import GiaVe from "./GiaVe";

function Cinema(props) {

    const [numchoice, setnumchoice] = useState(1)
    const AnyReactComponent = () => <img style={{width:50,height:50}} src={dv} />;
    const [listKhuvuc, setlistKhuvuc] = useState([])
    const [listLich, setlistLich] = useState([])
    const [Rap, setRap] = useState({idRap:""})
    const [listPhong, setlistPhong] = useState([])
    const [show, setshow] = useState(false)
    const [Load, setLoad] = useState(0)

    useEffect(() => {
        animationLoad(2)

        get('/api/customer/khuvuc/get')
        .then((Response)=>{
            console.log("get khuvuc success")
            setlistKhuvuc(Response.data)
            setRap(Response.data[0].listRap[0])
            // loadCinema()
            // get time now

            setTimeout(() => {
                let now = new Date();
                let dateChoice =  ((now.getDate())+"-"+(now.getMonth()+1)+"-"+now.getFullYear())
                getLichfromDateAndRap(dateChoice,Response.data[0].listRap[0].idRap)
                getPhongFromRap(Response.data[0].listRap[0].idRap)
            }, 500);

        })
        .catch((Error)=>{
            console.log("get khuvuc error" + Error.toString())
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

    const handleShow = (e) =>{
        setshow(true);
      } 


    const loadCinema=()=>{
         // set id
         let rap = (new URLSearchParams(window.location.search)).get("rap")
         if(rap !== null && rap !== "" ){
             setTimeout(() => {
                 loadCinema(rap)
             }, 500);
         }else{
 
         }

        console.log("vào "+rap +"-"+ listKhuvuc.length)
        for(let i = 0 ; i < listKhuvuc.length ; i++){
            console.log("list "+i)
            for(let j = 0 ; j < listKhuvuc[i].listRap.length; i++){
                if(listKhuvuc[i].listRap[j].idRap == rap){
                    setRap(listKhuvuc[i].listRap[j])
                    setTimeout(() => {
                        let now = new Date(numchoice);
                        let dateChoice =  ((now.getDate())+"-"+(now.getMonth()+1)+"-"+now.getFullYear())
                        getLichfromDateAndRap(dateChoice,listKhuvuc[i].listRap[j].idRap)
                        getPhongFromRap(listKhuvuc[i].listRap[j].idRap)
                }, 500);
                }
            }
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

    const changeRap=(rap)=>{
        animationLoad(2)
        setRap(rap)
        setTimeout(() => {
            let now = new Date(numchoice);
            let dateChoice =  ((now.getDate())+"-"+(now.getMonth()+1)+"-"+now.getFullYear())
            getLichfromDateAndRap(dateChoice,rap.idRap)
            getPhongFromRap(rap.idRap)
        }, 1000);
    }

    const changeDate=(numb)=>{
        animationLoad(2)
        setnumchoice(numb)
       
        setTimeout(() => {
            let now = new Date(numb);
            let dateChoice =  ((now.getDate())+"-"+(now.getMonth()+1)+"-"+now.getFullYear())
            getLichfromDateAndRap(dateChoice,Rap.idRap)
        }, 1000);
    }


    var number = []
    for(var i = 1; i < 10; i++){
        number.push(i)
    }

    // month , year
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

    // sl phong , sl ghe
    let slPhong = listPhong.length
    let slGhe = 0
    for(let i = 0 ; i < slPhong; i++){
        slGhe = slGhe + listPhong[i].soHang*listPhong[i].soCot
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

    

      let jsxKhuvuc = listKhuvuc.map((khuvuc)=>{
            let id = Rap.idRap.split("_") || ""
          return <>
                    {(id[0] === khuvuc.idKhuVuc ?
                    <li className="active">
                        <a  style={{cursor:'pointer'}} title="TPHCM" class="nonactive">{khuvuc.tenKhuVuc}</a>
                        <div class="depth_03" >
                            <ul>
                                {khuvuc.listRap.map((rap)=>{
                                return  <>
                                    {(rap.idRap === Rap.idRap ? 
                                     <li className="active"><a style={{cursor:'pointer'}} title={rap.tenRap} >{rap.tenRap}</a></li>
                                    :
                                    <li><a style={{cursor:'pointer'}}  onClick={(e)=>changeRap(rap)}  title={rap.tenRap} >{rap.tenRap}</a></li>
                                    )}
                                    </> 
                                })}
                            </ul>
                        </div>
                    </li>
                    :
                    <li>
                        <a  style={{cursor:'pointer'}} title="TPHCM" class="nonactive">{khuvuc.tenKhuVuc}</a>
                        <div class="depth_03" >
                            <ul>
                                {khuvuc.listRap.map((rap)=>{
                                return  <li><a style={{cursor:'pointer'}}  onClick={(e)=>changeRap(rap)} 
                                title={rap.tenRap} >{rap.tenRap}</a></li>
                                })}
                            </ul>
                        </div>
                    </li>
                    )}
                </>
      })

    //   info Rap 
    // let longitude =  106.69936 
    // let latitude =  10.77011
    let longitude =  Rap.longitude || 106.69936 
    let latitude =  Rap.latitude || 10.77011

    const defaultProps = {
        center: {
          lat: latitude,
          lng: longitude
        },
        zoom: 19
      };

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
                        </div>
                        </li>
                        <li>
                        <Link to="/ticket" title="MUA VÉ" 
                        style={{color:"#000", fontSize:16, fontWeight:400}}>MUA VÉ</Link>
                        <div className="depth">
                        </div>
                        </li>
                        <li className="active">
                        <Link to="/cinema" title="RẠP CHIẾU PHIM"
                        style={{color:"#000", fontSize:16, fontWeight:550}} >RẠP CHIẾU PHIM</Link>
                        <div class="depth">
                            <ul>
                                {jsxKhuvuc}
                            </ul>
                        </div>
                        </li>
                        <li>
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
                <div className="sub_visual">
                    <div className="tab_mwrap">
                        <ul className="tab_st01" id="ulCinemaByArea">
                        </ul>
                    </div>
                    <span id="spanSubVisual">
                        <img src={Rap.anh} alt={Rap.tenRap} width="1920" height="420"/>
                    </span>
                </div>
                <div className="cont_cinema" id="a_cont_cinema">
                    <div className="cont_cinema_Area">
                        <div className="m_theader">
                            <div className="m_inner_new">
                                <div className="clear_fix">
                                    <div className="fl" style={{display:'flex'}}>
                                        <h2 className="sub_tit" id="cinemaName1">{Rap.tenRap}</h2>
                                        <a style={{cursor:'pointer'}} onClick={(e)=>handleShow()} className="btn_fee" id="aFeeGuideOpen" title="Xem thông tin chi tiết">Bảng Giá Vé</a>
                                        {/* <ul className="m_etc">
                                            <li><a style={{cursor:'pointer'}} className="btn_fee" id="aFeeGuideOpen" title="Xem thông tin chi tiết">Bảng Giá Vé</a></li>
                                        </ul> */}
                                    </div>
                                    <div className="btns_box" id="btnBox" style={{display:'none'}}>
                                    </div>
                                </div>
                                <p className="sub_txt2" id="cinemaIntroduction"></p>
                        	
                                <p className="sub_addr2" id="spanAddress">{Rap.diaChi}<br></br>
                                <span className="p_theater">Tổng số phòng chiếu <em id="emTotalScreenCount">{slPhong}</em> phòng</span>
								<span className="p_seat">Tổng số chỗ ngồi <em id="emTotalSeatCount">{slGhe}</em> ghế</span> 
							    </p>
                            </div>
                        </div>
                        <div className="c_fixed">
                            <div className="bg_fixed">
                                <ul className="tab_st07" id="ulSubTap">
                                    <li><a href="#a_cont_cinema" onclick="setSelectedNavi(this);">Lịch chiếu phim</a></li> 
                                    <li><a href="#a_map_cont" onclick="setSelectedNavi(this);">Vị trí của rạp</a></li> 
                                </ul>
                            </div>
                        </div>
                        <div className="blind"><h3>Lịch chiếu phim</h3></div> 
                        <div className="calendar">
                            <fieldset className="month-picker-fieldset">
                                <span class="month" style={{top:'-47px',left:'47px'}} ><em>{monthN}</em><span>{YearN} {getMonthE(monthN)}</span></span>
                            </fieldset>
                            <div style={{paddingTop:10}}>

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
                        <ul class="cinema_grad">
                            <li><span className="grade_all">All</span> Mọi đối tượng</li>
                            <li><span className="grade_13">13</span> 13 tuổi trở lên</li>
                            <li><span className="grade_16">16</span> 16 tuổi trở lên</li>
                            <li><span className="grade_18">18</span> 18 tuổi trở lên</li>
                        </ul>
                       
                        <div className="time_inner">
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
                        <ul className="supInfo">
                            <li>Lịch chiếu phim có thể thay đổi mà không báo trước</li> 
                        </ul>
                    </div>
                </div>
                <div className="map_cont" id="a_map_cont">
                    <h3 className="map_tit">Vị trí rạp <span id="cinemaName3"></span>  </h3> 
                    <div className="contectmap">
                        <div id="cinemaMap"></div>
                        <div className="site" style={{position:'relative'}}>
                            <span id="cinemaAddress"></span>
                            <div style={{ height: '60vh', width: '100%' }}>
                                  <GoogleMapReact
                                    //  bootstrapURLKeys={{ key: '123' }}
                                    center={defaultProps.center}
                                    defaultZoom={defaultProps.zoom}
                                    >
                                    <AnyReactComponent
                                        lat={latitude}
                                        lng={longitude}
                                    />
                                </GoogleMapReact>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                </div>                            
            </div>
        </div>
        <GiaVe shows={show} closes={setshow} ></GiaVe>
        </>
    )
}
export default Cinema

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
