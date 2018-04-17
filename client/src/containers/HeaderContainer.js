import { connect } from "react-redux";
import Header from "../components/Header/Header";

const mapStateToProps = state => {
  return state;
};

const HeaderContainer = connect(mapStateToProps)(Header);

export default HeaderContainer;
