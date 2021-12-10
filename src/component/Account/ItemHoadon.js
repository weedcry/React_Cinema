import { useEffect, useState } from "react";
import { get, post } from "../../httpHelper";
import swal from 'sweetalert';
import imgC from '../../assets/images/icon_c.png'

function ItemHoadon(props) {
    const [showDetail, setshowDetail] = useState(0)
    const [load, setload] = useState(0)
    const [Rap, setRap] = useState(0)
    let idHoadon = props.hoadon.idHoaDon || 1
    let hoadon = props.hoadon || 0
    let thanhtoan = hoadon.thanhToan || 0

    const changeShow=()=>{
        if(props.shows === idHoadon){
            props.setShow(0)
        }else{
            props.setShow(idHoadon)
        }
    }

    useEffect(() => {
        let temp = props.hoadon.lich.phongEntityIdPhong.split("_")
        let idrap = temp[0]+"_"+temp[1]
        get(`/api/customer/rap/${idrap}`)
        .then((response => {
            console.log("get rap id "+idrap +" success")
           setRap(response.data);
        }))
        .catch((error) => console.log("error "+error.response))
    }, [])



    const Huyve=()=>{
        swal("Bạn có chắc muốn hủy vé này không ?", {
            buttons: {
              cancel: "Hủy",
              Accept: "Xác nhận",
            },
          })
          .then((value) => {
            switch (value) {
              case "Accept":
                post('/api/customer/hoadon/cancel/'+hoadon.idHoaDon)
                .then((response)=>{
                    swal({
                        title: "Hủy vé thành công",
                        text: "",
                        icon: "success",
                        button: "OK",
                      });

                    hoadon.tinhTrang = "Huy"
                    setload(1)
                })
                .catch((error)=>{
                    swal({
                        title: "Hủy vé không thành công",
                        text: "",
                        icon: "warning",
                        button: "OK",
                      });
                })
                break;
                case "cancel":

                break;
              default:
            }
          });

    }

    

    var phim = ""
    for(let i = 0 ; i < props.listphim.length; i++){
        if(props.listphim[i].idPhim === hoadon.lich.phimEntityIdPhim ){
            phim = props.listphim[i]
        }
    }

    let temp = hoadon.lich.ngay.split("-")
    let ngaykc = temp[2] + "/"+temp[1]+"/"+temp[0]
    let tempgio = hoadon.lich.gio.split(":")
    let gio = phim.thoiLuong / 60
    let phut = phim.thoiLuong % 60
    if(phut.toString().length === 1) phut = "0"+phut
    let gioKc = tempgio[0]+":"+tempgio[1] + " ~ " + (parseInt(tempgio[0])+parseInt(gio)) + ":"+phut

    let ghe = ""
    for(let i = 0; i<hoadon.listCTHoadon.length;i++){
        let hang =  String.fromCharCode(64+hoadon.listCTHoadon[i].hang)
        let cot = hoadon.listCTHoadon[i].cot.toString()
        ghe += (hang+cot)+","
    }
    let total = hoadon.total.toLocaleString('it-IT', {style : 'currency', currency : 'VND'})

    let tienGG = 0
    for(let i=0;i<  hoadon.listCTHoadon.length ;i++){
        tienGG+=hoadon.listCTHoadon[i].gia
    }

    let giagoc =  (tienGG).toLocaleString('it-IT', {style : 'currency', currency : 'VND'})
    
    let Giamgia = 0
    let coinsd = hoadon.usedPoint
    if(hoadon.voucherEntityIdVoucher){
        for(let i = 0 ; i < props.voucher.length ; i++)
        {
            if(hoadon.voucherEntityIdVoucher === props.voucher[i].idVoucher){
                Giamgia = (props.voucher[i].percentageOff*((tienGG)))/100
                break;
            }
        }
    }

    let tongct = (tienGG - (coinsd + Giamgia)).toLocaleString('it-IT', {style : 'currency', currency : 'VND'})

    // check huy ve  
    let checkHuy = 0  
    let mydate = new Date(temp[0], temp[1] - 1, temp[2],tempgio[0],tempgio[1]);
    let dateN = new Date(); 
    if((mydate.getTime() - dateN.getTime()) > (86400000/4) && thanhtoan.hinhThuc === "PAYPAL" && props.hoadon.usedPoint === 0 ){  // hủy trước 6 tiếng
        checkHuy = 1
    }
    
    return(
        <>
                <li>
                  <div className="myCinema_box">
                        <span className="thum">
                            <img src={phim.anh}  alt={phim.tenPhim} />
                        </span>
                       <dl className="myCimema_cont">			
                            <dt className="Lang-LBL3015">Số vé (ngày đặt)</dt>
                            <dd>{hoadon.listCTHoadon.length} ( {hoadon.createdAt})</dd>				
                            <dt className="Lang-LBL3019">Trạng thái</dt>
                            {(thanhtoan.hinhThuc === "PAYPAL"?
                            <>
                                {(hoadon.tinhTrang === "thanhCong"?
                                <>
                                <dd><span className=" icon_off">Thành Công</span></dd>                               
                                </>
                                :
                                <>
                                 <dd><span className=" icon_on">Đã Hủy</span></dd>
                                </>
                                )}
                            
                            </>
                            :
                            <>
                                <dd><span className=" icon_off">Không thể hủy</span></dd>
                            </>
                            )}	
                           
                            {/* <dd><span className=" icon_on">Không thể hủy</span></dd> */}
                            <dt className="Lang-LBL3016">Đặt vé</dt>						
                            <dd>{phim.tenPhim}({phim.loaiPhimEntityIdLoaiPhim} {phim.phanLoai})</dd>
                            <dt className="Lang-LBL0045">Tổng số tiền Thanh toán</dt>			
                            <dd>{total}</dd>			
                        </dl>	
                        {(checkHuy === 0 || hoadon.tinhTrang == "Huy"?
                            <>
                            </>
                            :
                            <>
                                <a style={{cursor:'pointer'}} onClick={(e)=>Huyve()}  className="btn_h_view"><span style={{marginRight:8}}>Hủy Vé</span></a>                      
                            </>
                            )}				
                           
                            <a style={{cursor:'pointer'}} onClick={(e)=>changeShow()} className="btn_s_view"><span>Thêm</span></a>
                    </div>
                     {(props.shows === idHoadon ?      
                    <div className="myCinema_answer on" id="answer_803121042990001357">	
                        <div className="myCinema_inner">
                            <h3 className="answerTit Lang-LBL3024">Chi tiết</h3>
                                <div className="order_cancle">
                                    <ul className="sendingDetailReservation">   
                                        <li>			
                                            <span className="title" style={{fontSize:16}}>Thời Gian: </span>		
                                            <span className="desc">{hoadon.createdAt}</span>		
                                        </li>	
                                    </ul>
                                </div>		
                                <ul className="myCinema_order">		
                                    <li>			
                                        <div className="clear_fix">
                                            <span className="thum">
                                            <img src={phim.anh}  alt={phim.tenPhim} />
                                        </span>		                
                                            <div className="thum_cont">				                
                                                <h4 className="answersTit">{phim.tenPhim}({phim.loaiPhimEntityIdLoaiPhim} {phim.phanLoai})</h4>                
                                                <ul className="mycont_list">                    
                                                    <li>                        
                                                        <ul className="mycont_slist">                            
                                                            <li>
                                                                <strong className="mycont_tit Lang-LBL1028">Ngày chiếu </strong>{ngaykc}
                                                            </li>                           
                                                            <li>
                                                                <strong className="mycont_tit Lang-LBL1029">Lịch chiếu phim </strong>{gioKc}
                                                                </li>                            
                                                            <li>
                                                                <strong className="mycont_tit Lang-LBL1030">Rạp chiếu </strong>{Rap.tenRap}, 
                                                            </li>                        
                                                        </ul>                    
                                                    </li>                    
                                                    <li>                       
                                                        <ul className="mycont_slist">                            
                                                            <li>
                                                                <strong className="mycont_tit Lang-LBL3021">Số vé  </strong>{hoadon.listCTHoadon.length}
                                                            </li> 
                                                            <li>
                                                                <strong className="mycont_tit Lang-LBL1031">Ghế ngồi </strong>{ghe}
                                                            </li>                        
                                                        </ul>                   
                                                    </li>                    
                                                    <li>
                                                        <strong className="mycont_tit Lang-LBL3022">Tổng hóa đơn </strong>{total}
                                                    </li> 
                                                    <li>
                                                        <strong className="mycont_tit Lang-LBL3022">Hình thức thanh toán </strong>{hoadon.thanhToan.hinhThuc}
                                                    </li>
                                                </ul>		               
                                            </div>			
                                        </div>		
                                    </li>	
                                </ul>
                            </div>		
                            <div className="myCinema_bill">		
                                <div className="orderAmount">				
                                    <dl>					
                                        <dt className="Lang-LBL3022">Tổng Giá vé</dt>		
                                        <dd className="sum" style={{marginTop:20}}><strong>{giagoc}</strong></dd>		
                                </dl>
                                </div>			
                                <div className="discount">				
                                    <em className="icon minus">Trừ</em>			
                                    <dl>
                                        <dt className="Lang-LBL0044">Giảm</dt>					
                                        <dd className="sum" style={{marginTop:20}}>
                                            <strong>{Giamgia.toLocaleString('it-IT', {style : 'currency', currency : 'VND'})}</strong><br></br>
                                            {/* <strong id="strAccountCCoin" style={{marginTop:20}}>{coinsd}<span className="icon_c"></span></strong> */}
                                            <div style={{display:'flex',alignItems:'center',minHeight:0, padding:0,justifyContent:'end'}} >
                                            <strong >{coinsd} </strong>
                                            <img src={imgC} style={{width:16,height:16}} />
                                            </div>
                                        </dd>	
                                    </dl>			
                                </div>			
                                <div className="total">				
                                    <em className="icon equal">Bình đẳng</em>				
                                    <dl>					
                                        <dt className="Lang-LBL0045">Tổng số tiền Thanh toán</dt>					
                                        <dd className="sum">
                                            <strong>{total}</strong></dd>					
                                    </dl>			
                                </div>		
                            </div>		
                            <div className="btn_box">

                            </div>
                    </div>
                    : 
                    <div className="myCinema_answer" id="answer_803121042990001357">	
                    <div className="myCinema_inner">
                        <h3 className="answerTit Lang-LBL3024">Chi tiết</h3>
                            <div className="order_cancle">
                                <ul className="sendingDetailReservation">   
                                    <li>			
                                        <span className="title" style={{fontSize:16}}>Thời Gian: </span>		
                                        <span className="desc">{hoadon.createdAt}</span>		
                                    </li>	
                                </ul>
                            </div>		
                            <ul className="myCinema_order">		
                                <li>			
                                    <div className="clear_fix">
                                        <span className="thum">
                                        <img src={phim.anh}  alt={phim.tenPhim} />
                                    </span>		                
                                        <div className="thum_cont">				                
                                            <h4 className="answersTit">{phim.tenPhim}({phim.loaiPhimEntityIdLoaiPhim} {phim.phanLoai})</h4>                
                                            <ul className="mycont_list">                    
                                                <li>                        
                                                    <ul className="mycont_slist">                            
                                                        <li>
                                                            <strong className="mycont_tit Lang-LBL1028">Ngày chiếu </strong>{ngaykc}
                                                        </li>                           
                                                        <li>
                                                            <strong className="mycont_tit Lang-LBL1029">Lịch chiếu phim </strong>{gioKc}
                                                            </li>                            
                                                        <li>
                                                            <strong className="mycont_tit Lang-LBL1030">Rạp chiếu </strong>{Rap.tenRap}, 
                                                        </li>                        
                                                    </ul>                    
                                                </li>                    
                                                <li>                       
                                                    <ul className="mycont_slist">                            
                                                        <li>
                                                            <strong className="mycont_tit Lang-LBL3021">Số vé  </strong>{hoadon.listCTHoadon.length}
                                                        </li> 
                                                        <li>
                                                            <strong className="mycont_tit Lang-LBL1031">Ghế ngồi </strong>{ghe}
                                                        </li>                        
                                                    </ul>                   
                                                </li>                    
                                                <li>
                                                    <strong className="mycont_tit Lang-LBL3022">Tổng hóa đơn </strong>{total}
                                                </li> 
                                                <li>
                                                    <strong className="mycont_tit Lang-LBL3022">Hình thức thanh toán </strong>{hoadon.thanhToan.hinhThuc}
                                                </li>
                                            </ul>		               
                                        </div>			
                                    </div>		
                                </li>	
                            </ul>
                        </div>		
                        <div className="myCinema_bill">		
                            <div className="orderAmount">				
                                <dl>					
                                    <dt className="Lang-LBL3022">Tổng Giá vé</dt>		
                                    <dd className="sum" style={{marginTop:20}}><strong>{giagoc}</strong></dd>		
                            </dl>
                            </div>			
                            <div className="discount">				
                                <em className="icon minus">Trừ</em>			
                                <dl>
                                    <dt className="Lang-LBL0044">Giảm</dt>					
                                    <dd className="sum" style={{marginTop:20}}>
                                        <strong>{Giamgia.toLocaleString('it-IT', {style : 'currency', currency : 'VND'})}</strong><br></br>
                                        {/* <strong id="strAccountCCoin" style={{marginTop:20}}>{coinsd}<span className="icon_c"></span></strong> */}
                                        <strong  style={{marginTop:20}}>{coinsd}</strong>
                                        <span class="icon_c"></span>
                                    </dd>	
                                </dl>			
                            </div>			
                            <div className="total">				
                                <em className="icon equal">Bình đẳng</em>				
                                <dl>					
                                    <dt className="Lang-LBL0045">Tổng số tiền Thanh toán</dt>					
                                    <dd className="sum">
                                        <strong>{tongct}</strong></dd>					
                                </dl>			
                            </div>		
                        </div>		
                        <div className="btn_box">

                        </div>
                </div>
                    )} 
            </li>
        </>
    )
}
export default ItemHoadon;