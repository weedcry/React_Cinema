import { useEffect, useState } from 'react';
import './style1.scss'
import { Link, useHistory } from 'react-router-dom';
import { get, post } from '../../httpHelper';
import {  toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import swal from 'sweetalert';
import { Input } from "reactstrap";
import imgprev from '../../assets/images/btn_total_prev02.png';


function Login(props) {
    const [isMode, setisMode] = useState(0)
    let history = useHistory();
    const linkgg = 'https://accounts.google.com/o/oauth2/auth?scope=email&redirect_uri=https://api-cinemas.herokuapp.com/api/auth/login-google&response_type=code&client_id=702545572981-cr9lm37odnjhnmg40usu2n5nns8nh6ql.apps.googleusercontent.com&approval_prompt=force';
    const linkfb = 'https://www.facebook.com/dialog/oauth?client_id=1101972766995519&redirect_uri=https://api-cinemas.herokuapp.com/api/auth/login-facebook';   


    useEffect(() => {

        let token = (new URLSearchParams(window.location.search)).get("token")
        let active = (new URLSearchParams(window.location.search)).get("active")
        if(active == "true"  && token !== null ){

            localStorage.setItem("token",token)
                var tokenStr = localStorage.getItem("token");
                console.log("check token "+tokenStr)
                getUser()
        }

        if(active === "false"){
            swal({
                title: "Đăng nhập thất bại",
                text: "",
                icon: "warning",
                button: "OK",
              });
        }

        // if(mode.length > 0){
        //     switch(mode){
        //         case "signin":
        //             setisMode(0)
        //             break;
        //         case "signup":
        //             setisMode(1)
        //             break;
        //     }
        // }
    }, [])

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

    const changeMode = (num) =>{
            setisMode(num)
    }


    const forgotPass = ()=>{
        let email = document.getElementById("email").value
        localStorage.setItem("emailResetPass",email)
        post('/api/user/resetpassword?email='+email)
        .then((Response)=>{
            setisMode(3)
            notifySuc("Nhập code gửi về từ email")
            setTimeout(() => {
                notifySuc("Code có hạn là 1 phút 30s")
            }, 800);
            document.getElementById("codeT").value = ""
        })
        .catch((error) =>{
            console.log("error "+error.response)
            // alert("login error! try again")
            notifyEror("email không chính xác")
        })
        
    }


    const ValidateCode =()=>{
        let email = localStorage.getItem("emailResetPass")
        let code = document.getElementById("codeT").value
        post('/api/user/resetpassword/code?email='+email+'&code='+code)
        .then((Response)=>{
            console.log("validate code success "+Response.data)
            setisMode(4)
            notifySuc("Tiến hành đổi mật khẩu")
            setTimeout(() => {
                notifySuc("Bạn có 5 phút")
            }, 800);
            localStorage.setItem("tokenResetPass",Response.data.token)

            document.getElementById("passNew").value = ""
            document.getElementById("passConfirm").value = ""
        })
        .catch((error) =>{
            console.log("error "+error.response)
            // alert("login error! try again")
            notifyEror("Code không chính xác")
        })
    }


    const newPass=()=>{

        let email = localStorage.getItem("emailResetPass")
        let tokenT = localStorage.getItem("tokenResetPass")
        let passN = document.getElementById("passNew").value
        let passC = document.getElementById("passConfirm").value

        if(passN.length < 3 || passN.length < 3 || passN !== passC ){
            notifyEror("Dữ liệu không chính xác");
			return false;
		}
        
        const bodyParameters = {
            oldpassword:tokenT,
			newpassword:passN,
			confirmpassword:passN
         };

        post('/api/user/resetpassword/new?email='+email,bodyParameters)
        .then((Response)=>{
            console.log("validate code success "+Response.data)
            setisMode(0)
            notifySuc("Đổi mật khẩu thành công")
            localStorage.removeItem("emailResetPass")
            localStorage.removeItem("tokenResetPass")
        })
        .catch((error) =>{
            console.log("error "+error.response)
            // alert("login error! try again")
            notifyEror("Lỗi đổi mật khẩu")
        })
    }


    const loginAccount = () =>{  
      
        var username = document.getElementById("userId");
        var password = document.getElementById("userPassword");

        const bodyParameters = {
            username:username.value,
            password:password.value
         };

        post('/api/auth/signin',bodyParameters)
        .then((Response)=>{
           
            // check admin
            let check = Response.data.roles[0];
            if(check !== "USER"){
                console.log("error")
                // alert("login error! try again")
                notifyEror("Đăng nhập thất bại")
            }else{
                notifySuc("Đăng nhập thành công")
                localStorage.setItem("token",Response.data.token)
                getUser()
            }
        })
        .catch((error) =>{
                console.log("error "+error.response)
                // alert("login error! try again")
                notifyEror("login error! try again")
        })
    }

    const validateEmail = (email) => {
        return String(email)
          .toLowerCase()
          .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          );
      };

    const Signup = ()=>{
        var emailT = document.getElementById("email").value;
        let firstnameT = document.getElementById("firstname").value;
        let lastnameT = document.getElementById("lastname").value;
        let phoneT = document.getElementById("phone").value;
        let passwordT = document.getElementById("userPassword").value;

        if(!validateEmail(emailT)){
            notifyEror("email không hợp lệ")
            return false;
        }

        if(passwordT.length < 3 ){
                notifyEror("mật khẩu ít nhất phải 4 ký tự ")
                return false;
        }

        if(phoneT.length !== 10){
            notifyEror("số điện thoại không chính xác")
            return false;
        }

        if(lastnameT.length < 1){
            notifyEror("họ phải từ 2 ký tự")
            return false;
        }

        if(firstnameT.length < 1){
            notifyEror("tên phải từ 2 ký tự")
            return false;
        }




        let roles = []
        roles.push("USER")
        const bodyParameters = {
            email:emailT,
            password:passwordT,
            firstname:firstnameT,
            lastname:lastnameT,
            phone:phoneT,
            idrap:"none",
            role:roles
         };
        post('/api/auth/signup',bodyParameters)
        .then((response)=>{
            // notifySuc("signup success")
            swal({
                title: "Đăng ký thành công",
                text: "",
                icon: "success",
                button: "OK",
              });
        })
        .catch((error)=>{
            // notifyEror("signup error! try again")
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);

            if(error.response.data.message.indexOf("Email") !== -1){
                swal({
                    title: "Email đã được sử dụng",
                    text: "",
                    icon: "warning",
                    button: "OK",
                  });
            }else{
                swal({
                    title: "Đăng ký thất bại",
                    text: "",
                    icon: "warning",
                    button: "OK",
                  });
            }
        })

    }

    const getUser =() =>{
        // get name
        let tokenStr = localStorage.getItem("token");
            console.log("check token "+tokenStr)

        get('/api/customer/get')
        .then((Response)=>{
            console.log("get customer success")
            let f = Response.data.firstName || "";
            let l = Response.data.lastName || "";
            let str =  l +" "+f
               // Returns 12
            if(str.length > 10){
                let name = str.substring(0, 14)
                localStorage.setItem("nameUser",name)
            }else{
                localStorage.setItem("nameUser",str)
            }
            localStorage.setItem("idcustomer",Response.data.idCustomer)
            props.setlogin(1);
            history.push("/")
            })
        .catch((error) =>{
            notifyEror(" error! try again")
            // alert("error! try again")
        })


        let tokenS = localStorage.getItem("token");
        console.log("check token "+tokenS)

    }


    let jsxSignin =<>
                <div className="login_wrap">
                        <div className="login_inner">
                            <h2 className="login_tit Lang-LBL0005">Đăng nhập</h2>
                            <div className="login_top">
                                <section>
                                    <dl className="tabdl_login" id="jq-tabdl_login">
                                        <dd className="tab_login_con active">
                                            <div className="clear_fix">
                                                <div className="login_left">
                                                    <ul className="etc_list">
                                                        <li className="Lang-LBL5021">Vui lòng đăng nhập để sử dụng dịch vụ</li>
                                                    </ul>
                                                    <div className="login_box">
                                                        <span>
                                                            <label for="userId" >Tài Khoản</label>
                                                            <input type="text" id="userId" name="userId" maxlength="50" 
                                                            placeholder="Vui lòng nhập địa chỉ Email"></input>
                                                        </span>
                                                        <span>  
                                                            <label for="userPassword" className="Lang-LBL0085">Mật khẩu</label>
                                                            <input type="password" id="userPassword" name="userPassword" maxlength="20"  placeholder="Vui lòng nhập mật khẩu" ></input>
                                                        </span>

                                                    </div>
                                                    <div className="login_find">
                                                        <span>
                                                        <input type="button" className="btn_login Lang-LBL0005" value="Đăng nhập" 
                                                        id="btnMember"  onClick={(e)=>loginAccount()} style={{cursor:'pointer'}} title="login" />
                                                        </span>
                                                        <span><a style={{cursor:'pointer'}} onClick={(e)=>changeMode(2)} target="_blank" title="Tìm mật khẩu Đã mở cửa sổ mới" id="aFindPassword" 
                                                        class="Lang-LBL5026">Quên mật khẩu</a></span>
                                                    </div>
                                                </div>
                                                <div className="login_right">
                                                    <div className="row" style={{paddingTop:40,paddingLeft:30}}>
                                                        <div className="col-sm-8">
                                                            <a href={linkgg} className="btn btn-login btn-g">
                                                                <i className="icon-google"></i>
                                                                Login With Google
                                                            </a>
                                                        </div>
                                                    </div>
                                                    <div className="row" style={{paddingTop:40,paddingLeft:30}}>
                                                        <div className="col-sm-8">
                                                        <a href={linkfb} className="btn btn-login btn-f">
                                                            <i className="icon-facebook-f"></i>
                                                                Login With Facebook
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </dd>
                                    </dl>
                                </section>
                            </div>
                            <div className="login_bottom">
                                <p class="login_etxt Lang-LBL5022">Nếu bạn chưa có tài khoản </p>
                                <a style={{cursor:'pointer'}} onClick={(e)=>changeMode(1)} className="btn_join"
                                title="Đăng kí tài khoản">Đăng kí tài khoản</a>
                            </div>
                        
                        </div>
                    </div>
                    </>


        let jsxsignup = <>
                <div className="login_wrap">
                        <div className="login_inner">
                            <h2 className="login_tit Lang-LBL0005">Đăng Kí</h2>
                            <div className="login_top">
                                <section>
                                    <dl className="tabdl_login" id="jq-tabdl_login">
                                        <dd className="tab_login_conSign active">
                                            <div className="clear_fix">
                                                <div className="login_left">
                                                    <ul className="etc_list">
                                                        <li className="Lang-LBL5021">Vui lòng Đăng kí để sử dụng dịch vụ</li>
                                                    </ul>
                                                    <div className="login_box">
                                                        <span>
                                                            <label for="userId" >Gmail</label>
                                                            <input type="text" id="email" name="email" maxlength="50" 
                                                            placeholder="Vui lòng nhập địa chỉ Email"></input>
                                                        </span>
                                                        <span style={{marginTop:10}}>
                                                            <label for="userId" >Họ</label>
                                                            <input type="text" id="lastname" name="lastname" maxlength="20" 
                                                            placeholder="Vui lòng nhập Họ"></input>
                                                        </span>
                                                        <span style={{marginTop:10}}>
                                                            <label for="userId" >Tên</label>
                                                            <input type="text" id="firstname" name="firstname" maxlength="20" 
                                                            placeholder="Vui lòng nhập tên"></input>
                                                        </span>
                                                        <span style={{marginTop:10}}>  
                                                            <label for="userPassword" className="Lang-LBL0085">Sđt</label>
                                                            <input type="text" id="phone" name="phone" maxlength="12" placeholder="Vui lòng nhập sđt" required ></input>
                                                        </span>
                                                        <span style={{marginTop:10}}>  
                                                            <label for="userPassword" className="Lang-LBL0085">Mật khẩu</label>
                                                            <input type="password" id="userPassword" name="userPassword" maxlength="20"  placeholder="Vui lòng nhập mật khẩu"></input>
                                                        </span>

                                                    </div>
                                                    <div className="login_find" >
                                                        <span style={{paddingBottom:50}}>
                                                        <input type="submit" className="btn_login Lang-LBL0005 dangk" value="Đăng Kí" 
                                                        id="btnMember" onClick={(e)=>Signup()} style={{cursor:'pointer'}} title="login" />
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="login_right">
                                                    <div className="row" style={{paddingTop:60,paddingLeft:30}}>
                                                        <div className="col-sm-8">
                                                            <a href={linkgg} className="btn btn-login btn-g">
                                                                <i className="icon-google"></i>
                                                                Login With Google
                                                            </a>
                                                        </div>
                                                    </div>
                                                    <div className="row" style={{paddingTop:40,paddingLeft:30}}>
                                                        <div className="col-sm-8">
                                                        <a href={linkfb} className="btn btn-login btn-f">
                                                            <i className="icon-facebook-f"></i>
                                                                Login With Facebook
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </dd>
                                    </dl>
                                </section>
                            </div>
                            <div className="login_bottom" style={{position:'relative',zIndex:999}}>
                                <p class="login_etxt Lang-LBL5022">Nếu bạn đã có tài khoản </p>
                                <a style={{cursor:'pointer'}} onClick={(e)=>changeMode(0)} className="btn_join" 
                                title="Đăng Nhập tài khoản" >Đăng nhập tài khoản</a>
                            </div>
                        </div>
                    </div>
                        </>

        let jsxForgotPass = <>
                            <div className="login_wrap">
                                <div className="login_inner">
                                    <h2 className="login_tit Lang-LBL0005">Quên mật khẩu</h2>
                                    <div className="forgot_top">
                                        <img src={imgprev} style={{paddingRight:100,cursor:'pointer'}} onClick={(e)=>changeMode(0)} />
                                        <section>
                                            <dl className="tabdl_login" id="jq-tabdl_login">
                                                <dd className="tab_login_conSign active">
                                                    <div className="clear_fix">
                                                    
                                                        <div className="login_left" >
                                                            <ul className="etc_list" style={{paddingLeft:80}}>
                                                                <li className="Lang-LBL5021">Vui lòng nhập email đăng ký tài khoản</li>
                                                            </ul>
                                                            <div className="login_box" style={{display:'flex'}}>
                                                                    <label for="userId" style={{paddingLeft:20,paddingTop:10}} >Email</label>
                                                                    <input type="text" id="email" name="email" maxlength="50" 
                                                                    placeholder="Vui lòng nhập địa chỉ Email"></input>
                                                                <Input  type="button" id="btnmagiamgia" value="Xác nhận" onClick={()=>forgotPass()}
                                                                style={{width:100,height:40,marginLeft:10,color:'black', backgroundColor:'#dad2b4'}} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </dd>
                                            </dl>
                                        </section>
                                    </div>
                                    <div className="login_bottom" style={{position:'relative',zIndex:999}}>
                                        <p class="login_etxt Lang-LBL5022">Nếu bạn đã có tài khoản </p>
                                        <a style={{cursor:'pointer'}} onClick={(e)=>changeMode(0)} className="btn_join" 
                                        title="Đăng Nhập tài khoản" >Đăng nhập tài khoản</a>
                                    </div>
                                </div>
                            </div>
                            </>

let jsxValidateCode = <>
                        <div className="login_wrap">
                            <div className="login_inner">
                                <h2 className="login_tit Lang-LBL0005">Xác nhận mã</h2>
                                <div className="forgot_top">
                                    <img src={imgprev} style={{paddingRight:100,cursor:'pointer'}} onClick={(e)=>changeMode(2)} />
                                    <section>
                                        <dl className="tabdl_login" id="jq-tabdl_login">
                                            <dd className="tab_login_conSign active">
                                                <div className="clear_fix">
                                                
                                                    <div className="login_left" >
                                                        <ul className="etc_list" style={{paddingLeft:80}}>
                                                            <li className="Lang-LBL5021">Vui lòng nhập code được gửi tới từ gmail</li>
                                                        </ul>
                                                        <div className="login_box" style={{display:'flex'}}>
                                                                <label for="userId" style={{paddingLeft:20,paddingTop:10}} >Code</label>
                                                                <input type="text" id="codeT" name="codeT" maxlength="4" 
                                                                placeholder="Vui lòng nhập mã code"></input>
                                                            <Input  type="button" id="btnmagiamgia" value="Xác nhận" onClick={()=>ValidateCode()}
                                                            style={{width:100,height:40,marginLeft:10,color:'black', backgroundColor:'#dad2b4'}} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </dd>
                                        </dl>
                                    </section>
                                </div>
                                <div className="login_bottom" style={{position:'relative',zIndex:999}}>
                                    <p class="login_etxt Lang-LBL5022">Nếu bạn đã có tài khoản </p>
                                    <a style={{cursor:'pointer'}} onClick={(e)=>changeMode(0)} className="btn_join" 
                                    title="Đăng Nhập tài khoản" >Đăng nhập tài khoản</a>
                                </div>
                            </div>
                        </div>
                        </>

                        
let jsxNewpass = <>
                    <div className="login_wrap">
                        <div className="login_inner">
                            <h2 className="login_tit Lang-LBL0005">Mật khẩu mới</h2>
                            <div className="newpass_top">
                                <img src={imgprev} style={{paddingRight:100,cursor:'pointer'}} onClick={(e)=>changeMode(3)} />
                                <section>
                                    <dl className="tabdl_login" id="jq-tabdl_login">
                                        <dd className="tab_login_conSign active">
                                            <div className="clear_fix">
                                            
                                                <div className="login_left" >
                                                    <ul className="etc_list" style={{paddingLeft:80}}>
                                                        <li className="Lang-LBL5021">Vui lòng nhập mật khẩu mới</li>
                                                    </ul>
                                                    <div className="login_box" style={{display:'flex'}}>
                                                            <label for="userId" style={{paddingLeft:20}} >Mật khẩu mới</label>
                                                            <input type="password" id="passNew" name="passNew" maxlength="20" 
                                                            placeholder="Vui lòng nhập mật khẩu mới"></input>
                                                    </div>
                                                    <div className="login_box" style={{display:'flex'}}>
                                                            <label for="userId" style={{paddingLeft:20}} >Xác nhận mật khẩu</label>
                                                            <input type="password" id="passConfirm" name="passConfirm" maxlength="20" 
                                                            placeholder="Vui lòng xác nhận mật khẩu"></input>
                                                    </div>
                                                    <Input  type="button" id="btnmagiamgia" value="Xác nhận" onClick={()=>newPass()}
                                                            style={{width:100,height:40,marginLeft:150,color:'black', backgroundColor:'#dad2b4'}} />
                                                </div>
                                            </div>
                                        </dd>
                                    </dl>
                                </section>
                            </div>
                            <div className="login_bottom" style={{position:'relative',zIndex:999}}>
                                <p class="login_etxt Lang-LBL5022">Nếu bạn đã có tài khoản </p>
                                <a style={{cursor:'pointer'}} onClick={(e)=>changeMode(0)} className="btn_join" 
                                title="Đăng Nhập tài khoản" >Đăng nhập tài khoản</a>
                            </div>
                        </div>
                    </div>
                    </>


    return(
        <>
        <div class="header">
            <div className="gnb" style={{marginBottom:20}}>
                <ul >
                        
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
        <div id="container" style={{marginTop:50}}>
        <div id="content">
            {(isMode === 0 ?
            <>
            {/* signin */}
                {jsxSignin}
            </>
            :
            (isMode === 1?
                <>
                {/* singup */}
                    {jsxsignup}
                </>
                :
                (isMode === 2?
                    <>
                    {/* forgot pass */}
                        {jsxForgotPass}
                    </> 
                :
                    (isMode === 3?
                        <>
                        {/* validate code */}
                            {jsxValidateCode}
                        </> 
                    :
                    <>
                    {/* new pass */}
                        {jsxNewpass}
                    </>
                )))
            )}
        </div>
    </div>
        </>
    )
}
export default Login;