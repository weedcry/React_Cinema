import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import './style1.scss'
import { get } from "../../httpHelper";


function Voucher(props) {
    const [listVoucher, setlistVoucher] = useState([])
    const [Voucher, setVoucher] = useState(0)
    const [Load, setLoad] = useState(0)
    const [value, setvalue] = useState(0)
    // var stompClient = null

   

    useEffect(() => {
        animationLoad(1.5)
        get('/api/customer/voucher/get')
        .then((Response)=>{
            console.log("get voucher success")
            setlistVoucher(Response.data)
        })
        .catch((Error)=>{
            console.log("error get voucher")
        })

    }, [])

    const animationLoad=(time)=>{
        let mili = time*1000
        setLoad(1)
        setTimeout(() => {
            setLoad(0)
        }, mili);

    }


    let jsxVoucher = listVoucher.map((voucher)=>{
        let startDate = voucher.startDate
        let endDate = voucher.endDate

        return  <>
                    <li>
                        <a style={{cursor:'pointer'}} onClick={(e)=>setVoucher(voucher)} >
                          <img src={voucher.anh} alt={voucher.tenVoucher}/>
                        </a>
                        <p  style={{fontSize:15,textAlign:"center"}}>{voucher.tenVoucher}</p>
                        <p className="evt_period" style={{fontSize:10,color:'black',fontWeight:550}}>{startDate} ~ {endDate}</p>
                     </li>
                </>
    })

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
                        <li  className="active">
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
                        <li className="active">
                        <Link to="/voucher" title="KHUY???N M??I"
                        style={{color:"#000", fontSize:16, fontWeight:550}} >KHUY???N M??I</Link>
                        <div className="depth">
                        <ul>
                            {Voucher === 0?
                             <li className="active">
                             <a  title="KHUY???N M??I TRONG N??M" >KHUY???N M??I TRONG N??M</a>
                             </li>
                            :
                            <li>
                            <a style={{cursor:'pointer'}} onClick={(e)=>setVoucher(0)} title="KHUY???N M??I TRONG N??M" >KHUY???N M??I TRONG N??M</a>
                            </li>
                            }
                        </ul>
                        </div>
                        </li>
                </ul>
            </div>
        </div>
        <div id="content" style={{paddingTop:60}}>

        {( Voucher === 0 ?
            <div className="event_Hwrap allevPg">
                <ul id="emovie_list_10" className="emovie_list">
                  {jsxVoucher}
                </ul>
            </div>
        :
            <DetailVoucher voucher={Voucher} ></DetailVoucher>
        )}
            </div>
        </>
    )
}
export default Voucher;

const DetailVoucher =(props)=>{

    let voucher = props.voucher || 0

    return(
        <>
        {/* detailVoucher */}
        <div className="eventWrap" style={{paddingTop:60}}>
                <div className="event_sinner">
                    <h2 className="sub_tit02">{voucher.tenVoucher}</h2>
                    <h3 className="sub_tit03" style={{textAlign:'center',marginBottom:10}}>{voucher.startDate} ~ {voucher.endDate}</h3>
                    <div id="img" >
                        <img style={{textAlign:'center',width:'100%'}} src={voucher.anh}  alt={voucher.tenVoucher}/>
                    </div>
                    <div className="event_release">
                        <p><strong>{voucher.tenVoucher}</strong></p>
                        <p>{voucher.moTa} </p>
                    </div>
                </div>
            </div>
        </>
    )
}