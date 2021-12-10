import { Link, useHistory } from 'react-router-dom'
import Slide1 from '../../assets/images/bg_1.png';
import Slide2 from '../../assets/images/background-shoes-2.jpg';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css'
import { get } from "../../httpHelper"; 
import { useState, useEffect} from 'react';

import '../../assets/css/demo-11.css'
import './style1.css'
import './style2.css'
import 'react-slideshow-image/dist/styles.css'
import './style.js'
import './nouislider.css'
import './style3.scss'

function Movie(props) {
    const [mode, setmode] = useState(0)
    const [listPhim, setlistPhim] = useState({listResult:[],page:0,totalpage:0})
    const [Load, setLoad] = useState(0)
    const [listimg, setlistimg] = useState([])
    let history = useHistory();

    useEffect(() => {
        animationLoad(1.5)
       getListPhim(mode)

       var tokenStr = localStorage.getItem("token");
       console.log("check token "+tokenStr)
    }, [])


    const animationLoad=(time)=>{
        let mili = time*1000
        setLoad(1)
        setTimeout(() => {
            setLoad(0)
        }, mili);

    }

    const resetMode=()=>{
        animationLoad(1)
        if(mode === 0){
            getListPhim(1)
            setmode(1)
        }else{
            getListPhim(0)
            setmode(0)
        }
    }

    const loadmore=()=>{
        let status = ""
        if(mode === 0){
            status = "dangchieu"
        }else{
            status = "sapchieu"
        }

        // get('/api/customer/phim/page?status='+status+'&time=0&rap=0')
        // .then((response)=>{
        //     console.log("get list phim "+status+" success")
        //     setlistPhim(response.data)
        //     let listtemp = []
        //     for(let i = 0 ; i < listPhim.listResult.length ; i ++){
        //         console.log("anh "+ i)
        //         listtemp.push(response.data.listResult[i].thumbnail)
        //     }

        //     setlistimg(listtemp)
        // })
        // .catch((error)=>{
        //     console.log("get list phim  "+status+" error")
        // })
    }
    

    const getListPhim=(value)=>{
        let status = ""
        if(value === 0){
            status = "dangchieu"
        }else{
            status = "sapchieu"
        }
        get('/api/customer/phim/page?page=1&size=8&status='+status+'&time=0&rap=0')
        .then((response)=>{
            console.log("get list phim "+status+" success")
            setlistPhim(response.data)
            let listtemp = []
            for(let i = 0 ; i < response.data.listResult.length ; i ++){
                listtemp.push(response.data.listResult[i].thumbnail)
            }

            setlistimg(listtemp)
        })
        .catch((error)=>{
            console.log("get list phim  "+status+" error")
            setlistPhim({listResult:[],page:0,totalpage:0})
        })
       
    }

    const morePhim=()=>{
        let status = ""
        if(mode === 0){
            status = "sapchieu"
        }else{
            status = "dangchieu"
        }
        let pag = listPhim.page+1;
        get('/api/customer/phim/page?page='+pag+'&size=8&status='+status+'&time=0&rap=0')
        .then((response)=>{
            console.log("get list phim "+status+" success")
            let list = listPhim;
            for(let i = 0 ; i < response.data.listResult.length; i ++){
                list.listResult.push(response.data.listResult[i])
            }

            setlistPhim(list)
        })
        .catch((error)=>{

            console.log("get list phim  "+status+" error")
        })
    }

    const changeUrl = (id)=>{
        history.push("/ticket?IDPhim="+id)
    }


    let jsxPhim = listPhim.listResult.map((phim,num)=>{
        let temp = phim.ngayKC.split("-")
        let ngayKC = temp[2]+"/"+ temp[1]+"/"+ temp[0]
        return<>
                <li class="">
                    <div class="curr_box" >
                            <span class="num">{num+1}</span>
                            <span class="img">
                            <a style={{cursor:'pointer'}} id="aFocusItem0">
                            <img src={phim.anh} alt={phim.tenPhim}/>
                            </a>
                            </span>
                    </div>
                    <div class="layer_hover" >
                            <a href="javascript:void(0)" onClick={()=>changeUrl(phim.idPhim)} style={{cursor:'pointer'}} class="btn_reserve" style={{marginTop:30}}>Đặt vé</a>
                            <Link to={{pathname:`movie/movie-detail/${phim.idPhim}`}}  class="btn_View" style={{marginTop:10}}>Chi tiết</Link>
                        </div>
                        <dl class="list_text"><dt>
                        <a href="a.html" ><span class="grade_13"></span>{phim.tenPhim}</a>
                        </dt><dd><span class="rate">{phim.thoiLuong} Phút</span><span class="grade"><em>{ngayKC}</em></span></dd></dl>
                    </li>
            </>
    })

    let sizeT = listPhim.listResult.length || 0

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
                        
                        <li className="active">
                        <Link to="/" title="PHIM" 
                        style={{color:"#000", fontSize:16, fontWeight:550}} >PHIM</Link>
                        <div className="depth">
                        <ul>
                        <li  class="active">
                        <Link to="/" title="PHIM HOT TẠI RẠP" >PHIM HOT TẠI RẠP</Link></li>
                        </ul>
                        </div>
                        </li>
                        <li>
                        <Link to="/ticket" title="MUA VÉ" 
                        style={{color:"#000", fontSize:16, fontWeight:400}}>MUA VÉ</Link>
                        <div className="depth">
                        </div>
                        </li>
                        <li>
                        <Link to="/cinema" title="RẠP CHIẾU PHIM"
                        style={{color:"#000", fontSize:16, fontWeight:400}} >RẠP CHIẾU PHIM</Link>
                        <div className="depth">
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
        {/* slide */}
        <div style={{marginTop:80}}>

        <Slideshow img ={listimg}></Slideshow>
        </div>

        <div className="screen_cwrap">
                <ul className="tab_st02">
                    {(mode === 0 ? 
                        <>
                        <li><span style={{cursor:'pointer'}} class="on Lang-LBL0000" id="aNow">Phim đang chiếu</span></li>
                        <li style={{marginLeft:5}}><span style={{cursor:'pointer'}} onClick={resetMode} style={{cursor:"pointer"}} class="Lang-LBL0000" id="aSoon">Phim sắp chiếu</span></li>
                        </>
                        :
                        <>
                        <li><span style={{cursor:'pointer'}} onClick={resetMode} style={{cursor:"pointer"}} class="Lang-LBL0000" id="aNow">Phim đang chiếu</span></li>
                        <li style={{marginLeft:5}}><span style={{cursor:'pointer'}} class="on Lang-LBL0000" id="aSoon">Phim sắp chiếu</span></li>
                        </>
                        )}
                </ul>
                
            <div class="tab_content on">
            {(sizeT > 0 ? 
                <>
                <ul class="curr_list movie_clist" id="ulMovieList">
                    {jsxPhim}
                </ul>
                    {(listPhim.page == listPhim.totalpage?
                    <></>
                    :
                    <>
                    <a style={{cursor:'pointer'}} onClick={()=>morePhim()} class="btn_view" id="aMore2" style={{display:'block'}}>
                            <span class="Lang-LBL0000">Thêm</span>
                    </a>
                    </>
                    )}
                </>
                :
                <div style={{marginBottom:500}}></div>
                )}
            </div>
        </div>

        </>
    )
}
export default Movie;



const Slideshow = (props) => {
    // const imgs = [
    //     Slide1,Slide2
    //   ];
    var imgs = props.img
    return (
        <div>
        <Slide easing="ease">
        {imgs.map((each, index) =>(
            <>
            <div className="each-slide">
            <div>
                <img src={each}></img>
            </div>
          </div>
          </>
        ))
        }
        </Slide>
      </div>
    )
}
