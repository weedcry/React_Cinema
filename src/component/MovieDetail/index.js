import { useParams } from "react-router";
import { Link , useHistory} from "react-router-dom";
import { Player } from 'video-react';

import './style1.css'
import "video-react/dist/video-react.css";
import YouTube from "react-youtube";
import { useEffect } from "react";
import { get } from "../../httpHelper";
import { useState } from "react";
import { RatingView, Rating } from 'react-simple-star-rating'
import { post } from "../../httpHelper";
import Pagination from 'react-bootstrap/Pagination'
import PageItem from 'react-bootstrap/PageItem'
import swal from 'sweetalert';

function MovieDetail(params) {
    let history = useHistory();
    let { id } = useParams();
    const [Phim, setPhim] = useState({ngayKC:"",trailer:""})
    const [rating, setRating] = useState(0) 
    const [checkCMT, setcheckCMT] = useState(0)
    const [listCMT, setlistCMT] = useState({listResult:[]})
    const [pagepresent, setpagepresent] = useState(0)
    const [totalpage, settotalpage] = useState(0)
    const [danhgia, setdanhgia] = useState(0)

    useEffect(() => {
        window.scrollTo(0,0)

        get('/api/customer/phim/'+id)
        .then((response)=>{
            console.log("get phim "+id+" success")
            setPhim(response.data)
            getComment(response.data.idPhim)
            checkCmt(response.data.idPhim)
        })
        .catch((error)=>{
            console.log("get phim "+id+" error")
        })

      

    }, [])

    const handleRating = (rate) => {
        console.log(rate)
        setRating(rate)
        // Some logic
      }

      const checkCmt = (idphim) =>{
        post('/api/customer/comment/check/'+idphim)
        .then((response)=>{
            console.log("check true")
            setcheckCMT(1)
        })
        .catch((error)=>{
            console.log("check failed")
            setcheckCMT(0)
        })
      }



      const getComment=(id)=>{
        let pageT = 1;
        get('/api/customer/comment/page?page='+pageT+'&size=5&idphim='+id)
        .then((response)=>{
            console.log("get list comment success")
            setlistCMT(response.data)
            const data = response.data;
            settotalpage(data.totalpage)
            setpagepresent(data.page)

            // set danh gia
            let tot = 0
            for(let i = 0; i < response.data.listResult.length; i ++){
               tot += response.data.listResult[i].rating
            }

            setdanhgia((tot/response.data.listResult.length))

        })
        .catch((error)=>{
            console.log("get list comment failed")

        })

      }

      const changepage =(e) =>{
        var number = (e.target.text);  
        get('/api/customer/comment/page?page'+number+'&size=5&idphim='+Phim.idPhim)
        .then((Response)=>{
            console.log("get list comment success") 
            const data = Response.data;
            setlistCMT(Response.data)
            settotalpage(data.totalpage)
            setpagepresent(data.page)
            
            })
        .catch((error) =>{
                console.log("error "+error.response)
            })
      }
      
      const nextpage =(e) =>{
        var number = pagepresent + 1;

        get('/api/customer/comment/page?page'+number+'&size=5&idphim='+Phim.idPhim)
        .then((Response)=>{
            console.log("get list comment success") 
            const data = Response.data;
            setlistCMT(Response.data)
            settotalpage(data.totalpage)
            setpagepresent(data.page)
            
            })
        .catch((error) =>{
                console.log("error "+error.response)
            })
        }

        const prevpage =(e) =>{
            var number = pagepresent - 1;
    
            get('/api/customer/comment/page?page'+number+'&size=5&idphim='+Phim.idPhim)
            .then((Response)=>{
                console.log("get list comment success") 
                const data = Response.data;
                setlistCMT(Response.data)
                settotalpage(data.totalpage)
                setpagepresent(data.page)
                
                })
            .catch((error) =>{
                    console.log("error "+error.response)
                })
            }

    const sendComment=()=>{
        if(checkCMT === 0){
            swal({
                title: "B???n ph???i ?????t v?? v?? xem phim m???i c?? th??? ????nh gi?? phim",
                text: "",
                icon: "warning",
                button: "OK",
              });

              return false;
        }

        let cmts = document.getElementById("txtComment").value
        let ratings = rating;
        if(cmts.length < 1){
            swal({
                title: "B???n ph???i nh???p b??nh lu???n",
                text: "",
                icon: "warning",
                button: "OK",
              });

              return false;
        }

        if(cmts.length > 50){
            swal({
                title: "Y??u c???u b??nh lu???n d?????i 50 k?? t???",
                text: "",
                icon: "warning",
                button: "OK",
              });

              return false;
        }

        let timeN = new Date();
        let part = timeN.getDate()+"/"+(timeN.getMonth()+1)+"/"+timeN.getFullYear()+" "+
        timeN.getHours()+":"+timeN.getMinutes()+":"+timeN.getSeconds()

        const bodyParameters = {
            idPhim:Phim.idPhim,
            cmt:cmts,
            rating:ratings,
            dateCreated:part,
         };

         console.log(bodyParameters)
        post('/api/customer/comment',bodyParameters)
        .then((response)=>{
            console.log("get phim "+id+" success")
            getComment(Phim.idPhim)
            setcheckCMT(0)
        })
        .catch((error)=>{
            console.log("get phim "+id+" error")
        })

    }


    let jsxCmt = listCMT.listResult.map((cmt)=>{

        let timeT = cmt.dateCreated.split(" ")
        let part = cmt.email.substring(0, 5)
        let part1 = cmt.email.substring(cmt.email.length - 6, cmt.email.length)
        let mail = part
        for(let i = 0; i < (cmt.email.length - (part.length + part1.length)); i++){
            mail+="*"
        }
        mail+=part1
        return<>
                <li>
                   <div className="score_box">
                        <div className="score_sum" style={{alignItems:'center'}} >
                            <strong className="score_listener">Kh??ch</strong>
                                <RatingView ratingValue={cmt.rating} />
                            </div>
                            <p className="result_txt">{cmt.cmt}</p>
                            <div className="score_clicks">
                                <span className="score_date">{timeT[0]}</span>
                            </div>
                        </div>
                        <div className="score_id"><em className="id_name">{mail}</em>
                    </div>
                </li>
            </>
    })

    let temp = Phim.ngayKC.split("-") || []
    let ngayKC = temp[2]+"/"+ temp[1]+"/"+ temp[0]
    let temp1 = Phim.trailer.split("=") || []
    let Trailer = temp1[1]

    const opts = {
        height: '500',
        width: '800',
        playerVars: {
          // https://developers.google.com/youtube/player_parameters
          autoplay: 1,
        },
      };

      const changeUrl = ()=>{
        history.push("/ticket?IDPhim="+Phim.idPhim)
    }


     //setting pagination
     let actives = pagepresent;
     let items = [];
     for (let number = 1; number <= totalpage; number++) {
         items.push(
             <Pagination.Item onClick={(e) => changepage(e)}  key={number} active={number === actives}>
                 {number}
             </Pagination.Item>,
         );
     }
     let startItem = (actives-1)*8 +1;
    //  let endItem = startItem + products.length - 1;

    return(
        <>
        <div class="header">
            <div className="gnb" style={{marginBottom:20}}>
                <ul >
                       
                        <li className="active">
                        <Link to="/" title="PHIM"
                        style={{color:"#000", fontSize:16, fontWeight:550}} >PHIM</Link>
                        <div className="depth">
                        <ul>
                        <li  >
                        <Link to="/" title="PHIM HOT T???I R???P" >PHIM HOT T???I R???P</Link></li>
                        </ul>
                        </div>
                        </li>
                        <li>
                        <Link to="/ticket" title="MUA V??" 
                        style={{color:"#000", fontSize:16, fontWeight:400}}>MUA V??</Link>
                        <div className="depth">
                        </div>
                        </li>
                        <li>
                        <Link to="/cinema" title="R???P CHI???U PHIM"
                        style={{color:"#000", fontSize:16, fontWeight:400}} >R???P CHI???U PHIM</Link>
                        <div className="depth">
                        </div>
                        </li>
                        <li>
                        <Link to="/voucher" title="KHUY???N M??I"
                        style={{color:"#000", fontSize:16, fontWeight:400}} >KHUY???N M??I</Link>
                        <div className="depth">
                        </div>
                        </li>
                </ul>
            </div>
        </div>
        <div className="mediaplayer" >
            <div className="mediaplayervideo">
            {/* <Player
                fluid ={false}
                width = {800}
                height = {500}
                poster={Slide1}
                // src="http://peach.themazzone.com/durian/movies/sintel-1024-surround.mp4"
                src = "https://www.youtube.com/embed/iB8ZFQQXUUQ"
                >
                <ControlBar autoHide={false}>
                    <ForwardControl seconds={10} order={3.2} />
                </ControlBar>
                </Player> */}
            <YouTube videoId={Trailer} opts={opts}  />;
            </div>
        </div>
        <div class="wide_info_area">
			<div class="wide_inner">
                <div className="wide_top">
			        <div className="thumb">
                        <span className="img">
                        <img src={Phim.anh} alt={Phim.tenPhim}/>
                        </span>
                        <a style={{cursor:'pointer'}} href="javascript:void(0)" onClick={changeUrl} className="btn_reserve Lang-LBL0000" style={{display:'inline-block'}}>?????t v??</a>
                    </div>
					<div claclassNamess="info_main">
                        <div className="info_data"><h2 className="info_tit" style={{fontWeight:600}}>{Phim.tenPhim}</h2></div>
                        <div style={{display:'flex'}}>
                            <dl className="info_spec" id="dSpec0">
                                <dt>X???p h???ng</dt><dd id="dVClass">[Trong n?????c] {Phim.doTuoi} tu???i tr??? l??n</dd>
                            </dl>
                            <dl className="info_spec" id="dSpec1" style={{paddingLeft:30}}>
                                <dt>????nh gi?? ( {listCMT.listResult.length} )</dt>
                                <dd id="dBaseInfo">
                                    <RatingView ratingValue={danhgia} />
                                   
                                </dd>
                            </dl>
                        </div>
                        <div style={{display:'flex'}}>
                            <dl className="info_spec" id="dSpec1">
                                <dt>Ng??y ph??t h??nh</dt><dd id="dReleaseDate">{ngayKC}</dd>
                            </dl>
                            <dl className="info_spec" id="dSpec1" style={{paddingLeft:100}}>
                                <dt>Th??ng tin c?? b???n</dt><dd id="dBaseInfo">{Phim.theLoai} ({Phim.thoiLuong} ph??t)  </dd>
                            </dl>
                        </div>
                        <dl className="info_spec" id="dSpec1">
                            <dt>?????o di???n</dt><dd id="dBaseInfo">{Phim.daoDien}</dd>
                        </dl>
                        <dl className="info_spec" id="dSpec1">
                            <dt>Di???n vi??n</dt><dd id="dBaseInfo">{Phim.dienVien}</dd>
                        </dl>
                        <dl className="info_spec" id="dSpec2">
                            <dt>Lo???i</dt><dd>{Phim.loaiPhimEntityIdLoaiPhim} | {Phim.phanLoai}</dd>
                        </dl>
					</div>
				</div>
                <div classNames="obj_section">
						<h3 className="obj_tit Lang-LBL0000">T??m t???t</h3>
						<p className="obj_txt" id="pSynopsis">{Phim.moTa}</p>
				</div>  
             </div>
        </div> 

        <div className="review_wrap" id="divReview">
				<div className="review_top">
					<h3 className="review_tit Lang-LBL0000">X???p h???ng v?? ????nh gi?? phim</h3>
					
				</div>
                {/* {(checkCMT === 0?
                <></>
                :
                <> */}
				<div className="score_area">
                   
					<fieldset>
						<legend className="Lang-LBL0000">X???p h???ng v?? ????nh gi?? phim</legend>
                        

						<div className="score_star">
							<strong className="star_tit Lang-LBL0000">X???p h???ng</strong>
                            <Rating onClick={handleRating} ratingValue={rating} /* Rating Props */ />
							<em className="star_sum Lang-LBL0000"><span>{rating}</span> ??i???m</em>
						</div>
						<div className="score_textarea">
							<textarea id="txtComment" title="Nh???p ????nh gi?? phim" cols="10" maxLength='50' rows="10"></textarea>
							<a href="javascript:void(0)" style={{cursor:'pointer'}} onClick={(e)=>sendComment()} className="btn_entry Lang-LBL0000" id="btnSave">B??nh lu???n</a>
						</div>
						<p class="score_etc Lang-LBL0000">0/50 K?? T???</p>
					</fieldset>
				</div>
                {/* </>)} */}

				<div className="review_entry">
                    {(checkCMT === 0?
                    <></>
                    :
                    <>
                    <ul class="tab_st05 bottom_line" id="ulTabReview">
                    </ul>
                    </>)}
                    <div class="item_list">
						<ul id="ulOrder">
						</ul>
					</div>
					<ul className="tab_st05 " id="ulTabReview">
                    <div className="tab_cont on">
						<div className="score_result">
							<ul id="ulReviews">
                                {jsxCmt}
                            </ul>
                    </div>
                    {(listCMT.listResult.length !== 0  ?
                        <nav aria-label="Page navigation">
                            <ul className="pagination justify-content-center">
                            {(pagepresent == 1)?
                                <li  id ="btnprev" className="page-item disabled" >
                                     <a className="page-link page-link-prev" style={{cursor:"pointer"}}  onClick={prevpage} aria-label="Previous" tabindex="-1" aria-disabled="true">
                                         <span aria-hidden="true"><i className="icon-long-arrow-left"></i></span>Prev
                                     </a>
                                 </li>
                                 :
                                 <li  id ="btnprev" className="page-item " >
                                    <a className="page-link page-link-prev" style={{cursor:"pointer"}}  onClick={prevpage}  aria-label="Previous" tabindex="-1" aria-disabled="true">
                                        <span aria-hidden="true"><i className="icon-long-arrow-left"></i></span>Prev
                                    </a>
                                 </li>
                            }
                            <div style={{marginTop:20}}>
                                <Pagination>{items}</Pagination>
                            </div>
                            {(pagepresent == totalpage || totalpage == 0)?
                              <li id ="btnnext" className="page-item disabled"   >
                                   <a class="page-link page-link-next" style={{cursor:"pointer"}} onClick={nextpage}  aria-label="Next">
                                       Next <span aria-hidden="true"><i className="icon-long-arrow-right"></i></span>
                                   </a>
                               </li>   
                               :
                               <li id ="btnnext" className="page-item ">
                                 <a class="page-link page-link-next" style={{cursor:"pointer"}} onClick={nextpage}  tabindex="-1" aria-disabled="true" aria-label="Next">
                                     Next <span aria-hidden="true"><i className="icon-long-arrow-right"></i></span>
                                 </a>
                             </li>   
                             }
                                                    
                            </ul>
                        </nav>  
                        :
                        <></>             
						)}
					</div>
					</ul>
				</div>
                <div className="warn_sbox">
                        <strong className="warn_tit">L??u ??</strong>
                            <ul className="warn_list">
                                <li>M???i t??i kho???n ch??? c?? th??? ????nh gi?? m???t l???n.</li>
                                <li>T??i kho???n c???a b???n ph???i mua v?? xem phim m???i c?? th??? tham gia ????nh gi?? phim.</li>
                            </ul>
                        </div>
				
			</div>   
            
           
        </>
        )    
    }
export default MovieDetail;