import icon from '../../assets/logo.png'
import '../../assets/css/style.css'
import './style1.css'
import { Link , useHistory} from 'react-router-dom'
import { useEffect, useState } from 'react';
import { get } from '../../httpHelper';
import iconlogout from '../../assets/images/icon_logout.png'
// import "../../assets/css/bootstrap.min.css"
// import React, { useState, useEffect } from 'react'

function Header(props) {
    let history = useHistory();

    useEffect(() => {

        var tokenStr = localStorage.getItem("token");
        //  check login 
            if(tokenStr == "0"){
                props.setlogin(0);
            }
            console.log("token "+tokenStr)
            if(tokenStr !== null){
                get('/api/customer/get')
                .then((Response)=>{
                        console.log(" get customer success") 
                        localStorage.setItem("idcustomer",Response.data.idCustomer)
                        props.setlogin(1);

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

                    })
                .catch((error) =>{
                        console.log(" get customer error "+error.response)
                        localStorage.removeItem("token");
                        localStorage.removeItem("idcustomer")
                        localStorage.setItem("nameUser","")
                        props.setlogin(0);
                        // history.push("/login")
                    })
            }
       
    }, [])


    const logout=()=>{
        localStorage.removeItem("token");
        localStorage.setItem("nameUser","")
        props.setlogin(0);
        history.push("/");
        window.scrollTo(0, 0)
    }

    var login = localStorage.getItem("token") || "";
    var name = localStorage.getItem("nameUser") || "";


   
    let jsx = <>      
         <Link to="/login" className="wishlist-link">
                <p style={{fontSize:14}} className="dangnhap">Đăng Nhập</p>
                <i className="icon-user"></i>
         </Link>
            </>
    
    let jsx1 = <>      
            <Link to="/myaccount" className="wishlist-link">
                
                    <div style={{textAlign:'center',fontSize:15,display:'flex'}}>
                        <p  className="dangnhap1">Chào {name}</p>
                    </div>
                    <i className="icon-user"></i>
                
            </Link>
            <div className="thoat" style={{textAlign:'center',fontSize:15,display:'flex',cursor:'pointer'}} onClick={(e)=>logout()}>  
            <div >
                    <p  className="dangnhap1">Thoát</p>
                </div>
                {/* <img className="headerLogout" src={iconlogout} style={{width:20,height:20,marginLeft:10,marginTop:10}} /> */}
                <div className="anhdiv" style={{marginLeft:10,marginTop:10}} />
            </div>
            </>

    return (
            <>
            <header className="header header-7" style={{height:80}} > 
                    <div className="header-middle sticky-header">
                        <div className="container">
                            <div className="header-left">
                                <button className="mobile-menu-toggler">
                                    <span className="sr-only">Toggle mobile menu</span>
                                    <i className="icon-bars"></i>
                                </button>
                                <Link to="/" className="logo" >
                                    <img src={icon} alt="Molla Logo" width="60" height="200"/>
                                </Link>
                            </div>
                            <div className="header-right" >
                                {
                                    ( props.login === 1) ? jsx1:jsx
                                }
                            </div>
                        </div>
                    </div>   
            </header>

        </>
    )
}
export default Header