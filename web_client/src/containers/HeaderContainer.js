import { connect } from "react-redux";
import { logout } from "../actions/authActions";
import Header from "../components/App/Header/Header";

const mapStateToProps = state => {
  return state;
};

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout())
});

const HeaderContainer = connect(mapStateToProps, mapDispatchToProps)(Header);

export default HeaderContainer;
