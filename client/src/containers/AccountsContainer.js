import { connect } from "react-redux";
import {
  fetchConnectedExchanges,
  fetchExchanges,
  connectExchange
} from "../actions/accountActions";
import Accounts from "../components/Accounts/Accounts";

const mapStateToProps = state => {
  return state.accounts;
};

const mapDispatchToProps = dispatch => ({
  fetchConnectedExchanges: () => dispatch(fetchConnectedExchanges()),
  fetchExchanges: () => dispatch(fetchExchanges()),
  connectExchange: id => dispatch(connectExchange(id))
});

const AccountsContainer = connect(mapStateToProps, mapDispatchToProps)(
  Accounts
);

export default AccountsContainer;
