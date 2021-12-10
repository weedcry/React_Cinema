import { useEffect, useRef, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import './style1.scss'
import { get } from "../../httpHelper";
import ItemHoadon from "./ItemHoadon";
import { post } from "../../httpHelper";
import {  toast } from 'react-toastify'
import swal from 'sweetalert';
import { Input } from "reactstrap";

function Account(props) {
    let history = useHistory();
    const [Option, setOption] = useState(0)
    const [Myaccount, setMyaccount] = useState(0)
    const [listHoadon, setlistHoadon] = useState([])
    const [showDetail, setshowDetail] = useState(0)
    const [listPhim, setlistPhim] = useState([])
    const [Load, setLoad] = useState(0)
    const [Voucher, setVoucher] = useState([])
    const [listVeHuy, setlistVeHuy] = useState([])
    const [mode, setmode] = useState(0)
    const [modeInfo, setmodeInfo] = useState(0)

    useEffect(() => {
         //animation load
         animationLoad(2)

        var tokenStr = localStorage.getItem("token");
        console.log("check token "+tokenStr)
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

        // customer
        get('/api/customer/get')
        .then((Response)=>{
            console.log(" get customer success")
            setMyaccount(Response.data)
            })
        .catch((error) =>{
           console.log(" get customer error")
        })

        // hoa don
        get('/api/customer/hoadon/get')
        .then((Response)=>{
            console.log(" get hoadon success")
            setlistHoadon(Response.data)
            })
        .catch((error) =>{
            console.log(" get hoadon error")
        })

        getVoucher()
    }, [])


    const getVoucher=()=>{
        
        get('/api/customer/voucher/get')
        .then((Response)=>{
            console.log("get voucher success")
            setVoucher(Response.data)
        })
        .catch((Error)=>{
            console.log("get voucher error" + Error.toString())
        })
    }

    const animationLoad=(time)=>{
        let mili = time*1000
        setLoad(1)
        setTimeout(() => {
            setLoad(0)
        }, mili);

    }


    toast.configure()
    const notifyEror = (text) =>{
        toast.error(text, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
            });
      }

      const notifySuc = (text) =>{
        toast.success(text, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
            });
      }

    const ChangeOption=(number)=>{
        setOption(number)
        animationLoad(1)
    }
    
    const isInitialMount = useRef(true);
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            let listId = [];
            listHoadon.map((hoadon) => {
                if (listId.indexOf( hoadon.lich.phimEntityIdPhim) === -1){
                    listId.push(hoadon.lich.phimEntityIdPhim);
                } 
            })
            let listTemp = [];
            listId.map((id) => {
                get(`/api/customer/phim/${id}`)
                    .then((response => {
                        console.log("get phim id "+id +" success")
                        listTemp.push(response.data);
                    }))
                    .catch((error) => console.log("error "+error.response))
            })
            setTimeout(() => {
                setlistPhim(listTemp);
            }, 1000);
        }
    }, [listHoadon])

    var name = localStorage.getItem("nameUser") || "";

    // value option (sl ve đã đặt, điểm sd)
    let slveDasd = 0;
    let slDiemDasd  = 0;
    if(listHoadon.length > 0){
        for(let i = 0; i < listHoadon.length; i++){
            slveDasd+=listHoadon[i].listCTHoadon.length;
            slDiemDasd+=listHoadon[i].usedPoint
        }
    }
    
    const ChangeVehuy=()=>{       
        let listve = []

        for(let i = 0 ; i < listHoadon.length; i++)

        if(listHoadon[i].tinhTrang == "Huy"){

            listve.push(listHoadon[i])
        }
        
        setlistVeHuy(listve)
        setmode(1)
    }

    const changePass = () =>{
		var oldpass = document.getElementById("pass1").value
		var newpass = document.getElementById("pass2").value
		var confirm = document.getElementById("pass3").value


		if(oldpass.length < 3 || newpass.length < 3 || confirm.length < 3 ){
            notifyEror("Dữ liệu không chính xác");
			return false;
		}

		const bodyParameters = {
            oldpassword:oldpass,
			newpassword:newpass,
			confirmpassword:confirm
         };

         swal("Bạn có muốn thay đổi mật khẩu này ?", {
            buttons: {
              cancel: "Hủy",
              Accept: "Xác nhận",
            },
          })

          .then((value) => {
            switch (value) {
           
              case "Accept":
                  console.log(bodyParameters)
                post('/api/customer/password',bodyParameters)
                .then((Response)=>{
                    console.log("change pass success")  
                    swal({
                        title: "đổi mật khẩu thành công",
                        text: "",
                        icon: "success",
                        button: "OK",
                      });
                    })
                .catch((error) =>{
                    console.log("error "+error.response)
                    if(error.response){
                        console.log(error.response.data);
                        console.log(error.response.status);
                        console.log(error.response.headers);
                    }
                    
        
                    document.getElementById("pass1").focus();
                    swal({
                        title: "mật khẩu cũ không chính xác",
                        text: "",
                        icon: "warning",
                        button: "OK",
                      });
                    // setTimeout(() => {
                    //     notifyEror("mật khẩu cũ không chính xác")
                    // }, 500);
                })	

                break;
           
              default:
            }
          });

	}


    const ChangeInfo=()=>{
        // let mail = document.getElementById("emailC").value
        let ho = document.getElementById("lastnameC").value
		let ten = document.getElementById("firstnameC").value
		let sdt = document.getElementById("phoneC").value

        // if(!validateEmail(mail)){
        //     notifyEror("email không hợp lệ")
        //     return false;
        // }

        if(sdt.length !== 10){
            notifyEror("số điện thoại không chính xác")
            return false;
        }

        if(ho.length < 1){
            notifyEror("họ phải từ 2 ký tự")
            return false;
        }

        if(ten.length < 1){
            notifyEror("tên phải từ 2 ký tự")
            return false;
        }


        Myaccount.firstName = ten
        Myaccount.lastName = ho
        Myaccount.phoneNumber = sdt
        // Myaccount.email = mail

        swal("Bạn có muốn thay đổi thông tin này ?", {
            buttons: {
              cancel: "Hủy",
              Accept: "Xác nhận",
            },
          })
          .then((value) => {
            switch (value) {
           
              case "Accept":

                post('/api/customer/update',Myaccount)
                .then((response)=>{
                    swal({
                        title: "Cập nhật thông tin thành công",
                        text: "",
                        icon: "success",
                        button: "OK",
                      });
                })
                .catch((error)=>{
                    if(error.response){
                        console.log(error.response.data);
                        console.log(error.response.status);
                        console.log(error.response.headers);
                    }
              
                    swal({
                        title: "Cập nhật thông tin thất bại",
                        text: "",
                        icon: "warning",
                        button: "OK",
                      });
                })

                break;
           
              default:
            }
          });
        
    }

    const logout = () =>{
        localStorage.removeItem("token");
        localStorage.setItem("nameUser","")
        props.setlogin(0);
        history.push("/");
        window.scrollTo(0, 0)
    }

    let jsxInfo = <>
                     <div style={{width:500}}>
                        <form class="urpForm urpForm_stacked">
                            <fieldset class="urpForm_group">
                                <legend></legend>
                                <label class="urpLabel" for="full-name">Email</label>
                                <input type="text" id="emailC" class="urpInput" value={Myaccount.email} disabled="true" />
                                <label class="urpLabel" for="address">Họ</label>
                                <input type="text" id="lastnameC"  name="lastnameC" class="urpInput" defaultValue={Myaccount.lastName} />
                                <label class="urpLabel" for="address-2">Tên</label>
                                <input type="text" id="firstnameC" class="urpInput" defaultValue={Myaccount.firstName} min="1" required />
                                <label class="urpLabel" for="city" >Số điện thoại</label>
                                <input type="text" id="phoneC"  class="urpInput" defaultValue={Myaccount.phoneNumber}  />
                            </fieldset>
                        </form>
                        <Input  type="button" id="btnmagiamgia" onClick={()=>ChangeInfo()} value="Thay Đổi" 
                    style={{width:100,height:40,marginBottom:0,color:'black', backgroundColor:'#dad2b4'}} />
                    </div>
                </>

    let jsxPass = <>
                    <div style={{width:500}}>
                    <form class="urpForm urpForm_stacked" >
                        <fieldset class="urpForm_group">
                            <legend></legend>
                            <label class="urpLabel" for="full-name">Mật Khẩu cũ</label>
                            <input type="password" id="pass1" class="urpInput"  />
                            <label class="urpLabel" for="full-name">Mật Khẩu Mới</label>
                            <input type="password" id="pass2" class="urpInput"  />
                            <label class="urpLabel" for="full-name">Xác nhận mật khẩu</label>
                            <input type="password" id="pass3" class="urpInput"  />
                        </fieldset>
                    </form>
                    <Input  type="button" id="btnmagiamgia" onClick={()=>changePass()} value="Thay Đổi" 
                    style={{width:100,height:40, marginBottom:0,color:'black', backgroundColor:'#dad2b4'}} />
                    </div>
                    </>


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
                <ul>
                        
                        <li >
                        <Link to="/" title="PHIM" 
                        style={{color:"#000", fontSize:16, fontWeight:400}} >PHIM</Link>
                        <div className="depth">
                        </div>
                        </li>
                        <li>
                        <Link  to="/ticket" title="MUA VÉ">MUA VÉ</Link>
                        <div className="depth">
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
        <div id="container" className="subGnbNo" style={{marginTop:50}}>
        <div id="content">
            <div className="myCinema">
                <div className="myInfo">
                    <h2 className="order_tit02 Lang-LBL0000">Thông tin cá nhân</h2>
                    <div className="myInfoTit">
                        <em>Xin chào <span className="userName" id="spnUserName">{name}</span>!</em>
                    </div>
                    <div className="pointCont" style={{height:150}}>
                        <dl className="lpoint">
                            <dt>
                                <a style={{cursor:'pointer'}} id="aHistoryCinemaCoin">Cinema COIN</a>                                
                                <strong id="strAccountCCoin">{Myaccount.promoPoint}<span className="icon_c"></span></strong>
                            </dt>
                            <dd className="note">
                                <ul>
                                    <li>Áp dụng thanh toán bằng Coin</li>
                                    <li>Cinema Coin sẽ được cộng vào khi đặt thành công vé</li>
                                </ul>
                            </dd>
                        </dl>

                        <dl className="coupon">
                            <dt>
                                Thông tin chung của thành viên
                            </dt>
                            <dd>
                                <dl>
                                    <dt>Số lượng vé đã đặt</dt>
                                    <dd >
                                        <p>{slveDasd}</p>
                                    </dd>
                                    <dt>Số lượng điểm đã sử dụng</dt>
                                    <dd >
                                        <p>{slDiemDasd}</p>
                                    </dd>
                                </dl>
                            </dd>
                        </dl>
                    </div>
                </div>
            </div>
            <div className="myCinemaCont">
                <ul className="tab_st03" id="ulTab">
                   {(Option === 0 ?
                   <>
                    <li className="active">
                        <p  className="Lang-LBL3001">Đặt vé</p>
                        <ul className="tabDep2" style={{marginTop:10}}>
                            {(mode === 0?
                            <>
                            <li className="on"><a style={{cursor:'pointer'}} className="Lang-LBL3016">Đặt vé</a></li>
                            <li><a onClick={(e)=>ChangeVehuy()} className="Lang-LBL3002" id="aCancle">Chi tiết vé hủy</a></li>
                            </>
                            :
                            <>
                             <li ><a style={{cursor:'pointer'}} onClick={(e)=>setmode(0)} className="Lang-LBL3016">Đặt vé</a></li>
                            <li className="on"><a  className="Lang-LBL3002" id="aCancle">Chi tiết vé hủy</a></li>
                            </>
                            )}
                           
                        </ul>
                    </li>
                    <li >
                        <p style={{cursor:'pointer'}} onClick={(e)=>ChangeOption(1)} href="javascript:void(0)">Thông tin tài khoản</p>
                    </li>
                    </>
                    :
                    <>
                    <li>
                        <p style={{cursor:'pointer'}}  onClick={(e)=>ChangeOption(0)} className="Lang-LBL3001">Đặt vé</p>
                    </li>
                    <li className="active">
                        <p>Thông tin tài khoản</p>
                    </li>
                    </>
                   )}
                </ul>

                {(Option === 0?
                <>  
                  {/* Hoa Don */}
                    <div className="tabCont" id="divTabContent">
                        <ol className="myCinema_list" id="myCinemaList">
                        {(mode === 0?
                            <>
                             {listHoadon.map((Hoadon)=>(
                                <ItemHoadon hoadon={Hoadon}  setShow={setshowDetail} shows={showDetail} 
                                listphim={listPhim}  notyError={notifyEror} notySuc={notifySuc} voucher={Voucher} ></ItemHoadon>
                            ))}
                            </>
                            :
                            <>
                             {listVeHuy.map((Hoadon)=>(
                                <ItemHoadon hoadon={Hoadon}  setShow={setshowDetail} shows={showDetail} 
                                listphim={listPhim}  notyError={notifyEror} notySuc={notifySuc} voucher={Voucher} ></ItemHoadon>
                            ))}
                            </>
                            )}
                           
                        </ol>
                    </div>
                </>
                :
                <>
                {/* thông tin */}
                <div className="tabCont my_manage" id="divTabContent">
                <ol className="manage_step">
                    {(modeInfo === 0 ?
                    <>
                    <li className="on first"><a style={{cursor:'pointer',marginTop:10}} id="aInformationChange">Thay đổi thông tin</a></li>
                    <li className="second"><a style={{cursor:'pointer'}}  onClick={(e)=>setmodeInfo(1)} id="aPasswordChange">Thay đổi mật khẩu</a></li>
                    <li className="last"><a style={{cursor:'pointer'}} onClick={()=>logout()} id="aMemberDelete">Đăng Xuất</a></li>
                    </>    
                    :
                    <>
                    <li className="first"><a style={{cursor:'pointer',marginTop:10}}  onClick={(e)=>setmodeInfo(0)}  id="aInformationChange">Thay đổi thông tin</a></li>
                    <li className="on second"><a style={{cursor:'pointer'}}  id="aPasswordChange">Thay đổi mật khẩu</a></li>
                    <li className="last"><a style={{cursor:'pointer'}} onClick={()=>logout()} id="aMemberDelete">Đăng Xuất</a></li>
                    </>
                    )}
                    
                </ol>
                </div>
                    {(modeInfo === 0 ?
                     <>   {jsxInfo} </>
                    :
                    <>
                    {jsxPass}
                    </>
                    )}
                </>
                )}
            </div>
        </div>
        </div>
        </>
    )
}
export default Account;