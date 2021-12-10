import "./style1.css"
import "./styleForm.scss"
import { Link } from 'react-router-dom'
import { useState } from "react"


function Home(params) {
    const [state, setstate] = useState(0)

    const showload=()=>{
        if(state === 0){
            setstate(1)
            setTimeout(() => {
                setstate(0)
            }, 2000);
        }else{
            setstate(0)
        }
        
    }

    return(
        <>
        <div class="header">
            <div className="gnb" style={{marginBottom:20}}>
                <ul >
                        <li>
                        <Link to="/ticket" title="MUA VÉ" 
                        style={{color:"#000", fontSize:16, fontWeight:400}}>MUA VÉ</Link>
                        <div className="depth">
                        </div>
                        </li>
                        <li>
                        <Link to="/movie" title="PHIM"
                        style={{color:"#000", fontSize:16, fontWeight:400}} >PHIM</Link>
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

           


        
        <button onClick={showload} >acb</button>
        {(state === 0 ? 
        <>
        </>
            :
        // <div className="lds-circle"><div></div></div>
        <div class="skload">
        <div class="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
        </div>
            )}
        </>
    )
}
export default Home