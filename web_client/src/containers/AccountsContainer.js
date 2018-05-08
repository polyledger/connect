import { connect } from "react-redux";
import {
  fetchConnectedExchanges,
  fetchConnectedAddresses,
  fetchExchanges,
  fetchAssets,
  connectExchange,
  connectAddress,
  disconnectExchange,
  disconnectAddress
} from "../actions/accountActions";
import Accounts from "../components/Accounts/Accounts";

const mapStateToProps = state => {
  return state.accounts;
};

const mapDispatchToProps = dispatch => ({
  fetchConnectedExchanges: () => dispatch(fetchConnectedExchanges()),
  fetchConnectedAddresses: () => dispatch(fetchConnectedAddresses()),
  fetchExchanges: () => dispatch(fetchExchanges()),
  fetchAssets: () => dispatch(fetchAssets()),
  connectExchange: (id, apiKey, secret) =>
    dispatch(connectExchange(id, apiKey, secret)),
  disconnectExchange: id => dispatch(disconnectExchange(id)),
  connectAddress: (id, address) => dispatch(connectAddress(id, address)),
  disconnectAddress: id => dispatch(disconnectAddress(id))
});

const AccountsContainer = connect(mapStateToProps, mapDispatchToProps)(
  Accounts
);

export default AccountsContainer;
