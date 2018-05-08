import { connect } from "react-redux";
import {
  fetchSettings,
  updatePersonalDetails,
  updatePassword
} from "../actions/settingsActions";
import Settings from "../components/Settings/Settings";

const mapStateToProps = state => {
  return state;
};

const mapDispatchToProps = dispatch => ({
  fetchSettings: () => dispatch(fetchSettings()),
  updatePersonalDetails: personalDetails =>
    dispatch(updatePersonalDetails(personalDetails)),
  updatePassword: passwords => dispatch(updatePassword(passwords))
});

const SettingsContainer = connect(mapStateToProps, mapDispatchToProps)(
  Settings
);

export default SettingsContainer;
