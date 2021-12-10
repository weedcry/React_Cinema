import React, {useState} from 'react';
import './App.css';
import {BrowserRouter as Router,Switch,Route} from "react-router-dom";

//user
import Header from './component/header';
import Footer from "./component/footer";
import Home from "./component/home";
import Movie from './component/Movie';
import Ticket from './component/ticket';
import MovieDetail from './component/MovieDetail';
import Cinema from './component/Cinema';
import Voucher from './component/Voucher';
import SelectSeat from './component/SelectSeat';
import MovieSchedule from './component/MovieSchedule';
import Checkout from './component/Checkout';
import Account from './component/Account';
import Login from './component/Login';



function App() {
  const [isLogin, setisLogin] = useState(0)
  return (
    <>
        <Router>  
        <Header login={isLogin} setlogin={setisLogin}  ></Header>
        <Switch>
          <Route exact path="/login">
            <Login setlogin={setisLogin} ></Login>
          </Route>
          <Route exact path="/">
            <Movie ></Movie>
          </Route>
          <Route exact path="/ticket">
            <Ticket ></Ticket>
          </Route>
          <Route exact path="/cinema">
            <Cinema ></Cinema>
          </Route>
          <Route exact path="/voucher">
            <Voucher ></Voucher>
          </Route>
          <Route exact path="/voucher">
            <Voucher ></Voucher>
          </Route>
          <Route exact path="/ticket/movie-schedule">
            <MovieSchedule ></MovieSchedule>
          </Route>
          <Route exact path="/ticket/checkout">
            <Checkout></Checkout>
          </Route>
          <Route exact path="/myaccount">
            <Account login={isLogin} setlogin={setisLogin}  ></Account>
          </Route>
          <Route path="/movie/movie-detail/:id" children={<MovieDetail />}/>
          <Route path="/ticket/selectseat/:id" children={<SelectSeat />}/>
         
        </Switch>
        <Footer></Footer>
        </Router>
    </>
  );
}

export default App;
