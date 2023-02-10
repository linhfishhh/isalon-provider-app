/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from "react";
import { createStackNavigator } from "react-navigation";
import WelcomeScreen from "./src/screens/WelcomeScreen";
import AccessScreen from "./src/screens/AccessScreen";
import LoginMethodsScreen from "./src/screens/LoginMethodsScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import LoginScreen from "./src/screens/LoginScreen";
import ResetPassScreen from "./src/screens/ResetPassScreen";
import ResetPassVerifyScreen from "./src/screens/ResetPassVerifyScreen";
import NewPassScreen from "./src/screens/NewPassScreen";
import VerifyPhoneScreen from "./src/screens/VerifyPhoneScreen";
import HomeScreen from "./src/screens/MemberSectionScreen";
import MemberAccountFAQScreen from "./src/screens/MemberAccountFAQScreen";
import MemberAccountFAQDetailScreen from "./src/screens/MemberAccountFAQDetailScreen";
import MemberAccountSettingScreen from "./src/screens/MemberAccountSettingScreen";
import MemberProfileScreen from "./src/screens/MemberProfileScreen";
import MemberTestScreen from "./src/screens/MemberTestScreen";
import MemberAccountNotificationScreen from "./src/screens/MemberAccountNotificationScreen";
import MemberOrderDetailScreen from "./src/screens/MemberOrderDetailScreen";
import IntroScreen from "./src/screens/IntroScreen";
import HomeNewsScreen from "./src/screens/HomeNewsScreen";
import HomeBookingListScreen from "./src/screens/HomeBookingListScreen";
import NewBookingScreen from "./src/screens/NewBookingScreen";
import CancelBookingScreen from "./src/screens/CancelBookingScreen";
import DealBookingScreen from "./src/screens/DealBookingScreen";
import MemberBookingHistoryScreen from "./src/screens/MemberBookingHistoryScreen";
import { FormattedProvider } from "react-native-globalize";
import MemberBookingDetailScreen from "./src/screens/MemberBookingDetailScreen";
import MemberRatingDetailScreen from "./src/screens/MemberRatingDetailScreen";
import MemberRatingDescScreen from "./src/screens/MemberRatingDescScreen";
import MemberReviewListScreen from "./src/screens/MemberReviewListScreen";
import MemberBadgeScreen from "./src/screens/MemberBadgeScreen";
import MemberMapScreen from "./src/screens/MemberMapScreen";
import MemberTimeScreen from "./src/screens/MemberTimeScreen";
import MemberEditBasicInfoScreen from "./src/screens/MemberEditBasicInfoScreen";
import MemberEditStylistScreen from "./src/screens/MemberEditStylistScreen";
import MemberEditBrandScreen from "./src/screens/MemberEditBrandScreen";
import MemberEditShowcaseScreen from "./src/screens/MemberEditShowcaseScreen";
import MemberEditShowcaseDetailScreen from "./src/screens/MemberEditShowcaseDetailScreen";
import MemberCatsScreen from "./src/screens/MemberCatsScreen";
import MemberEditCatScreen from "./src/screens/MemberEditCatScreen";
import MemberCustomerListScreen from "./src/screens/MemberCustomerListScreen";
import MemberPaymentScreen from "./src/screens/MemberPaymentScreen";
import MemberPaymentMethodScreen from "./src/screens/MemberPaymentMethodScreen";
import MemberBankInfoScreen from "./src/screens/MemberBankInfoScreen";
import MemberSalonIntroScreen from "./src/screens/MemberSalonIntroScreen";
import accountReducer from "./src/redux/account/reducer";
import tabHomeReducer from "./src/redux/tabHome/reducer";
import tabIncomeReducer from "./src/redux/tabIncome/reducer";
import homeReducer from "./src/redux/home/reducer";
import ratingReducer from "./src/redux/tabRating/reducer";
import locationReducer from "./src/redux/location/reducer";
import notifyReducer from "./src/redux/notify/reducer";
import thunk from "redux-thunk";
import { applyMiddleware, combineReducers, createStore } from "redux";
import { Provider } from "react-redux";
import AccountCheckingScreen from "./src/screens/AccountCheckingScreen";
import MemberBookingListScreen from "./src/screens/MemberBookingListScreen";
import MemberBookingHistoryListScreen from "./src/screens/MemberBookingHistoryListScreen";
import MemberBookingHistoryDetailScreen from "./src/screens/MemberBookingHistoryDetailScreen";
import MemberBookingListAltScreen from "./src/screens/MemberBookingListAltScreen";
import MemberBookingListAltFScreen from "./src/screens/MemberBookingListAltFScreen";
import MemberEditCatServiceScreen from "./src/screens/MemberEditCatServiceScreen";
import MemberEditSaleScreen from "./src/screens/MemberEditSaleScreen";
import MemberEditSaleSelectServiceScreen from "./src/screens/MemberEditSaleSelectServiceScreen";
import MemberEditSaleDetailScreen from "./src/screens/MemberEditSaleDetailScreen";
import MemberAddressEditorScreen from "./src/screens/MemberAddressEditorScreen";
import MemberHtmlEditorScreen from "./src/screens/MemberHtmlEditorScreen";
import MemberCustomerScreen from "./src/screens/MemberCustomerScreen";
import MemberAccountChangePasswordScreen from "./src/screens/MemberAccountChangePasswordScreen";
import MemberAccountDefaultScreen from "./src/screens/MemberAccountDefaultScreen";
import MemberAccountTOSScreen from "./src/screens/MemberAccountTOSScreen";
import NavigationService from "./src/NavigationService";
import SplashScreen from "react-native-splash-screen";
import ApproveChangeTimeScreen from "./src/screens/ApproveChangeTimeScreen";
import MemberBookingStatsScreen from "./src/screens/MemberBookingStatsScreen";
import MemberEditCatOptionsScreen from "./src/screens/MemberEditCatOptionsScreen";
import MemberEditOptionScreen from "./src/screens/MemberEditOptionScreen";
import WalletScreen from "./src/screens/WalletScreen";
import codePush from "react-native-code-push";

type Props = {};

const reducers = combineReducers({
  account: accountReducer,
  tabHome: tabHomeReducer,
  tabIncome: tabIncomeReducer,
  home: homeReducer,
  tabRating: ratingReducer,
  location: locationReducer,
  notify: notifyReducer,
});

const store = createStore(reducers, applyMiddleware(thunk));

class App extends Component<Props> {
  componentDidMount() {
    SplashScreen.hide();
  }

  render() {
    return (
      <Provider store={store}>
        <FormattedProvider locale="vi">
          <RootStack
            ref={(navigatorRef) => {
              NavigationService.setTopLevelNavigator(navigatorRef);
            }}
          />
        </FormattedProvider>
      </Provider>
    );
  }
}

export default codePush(App);

const RootStack = createStackNavigator(
  {
    welcome: {
      screen: WelcomeScreen,
    },
    intro: {
      screen: IntroScreen,
    },
    access: {
      screen: AccessScreen,
    },
    login_methods: {
      screen: LoginMethodsScreen,
    },
    login: {
      screen: LoginScreen,
    },
    register: {
      screen: RegisterScreen,
    },
    reset_pass: {
      screen: ResetPassScreen,
    },
    reset_pass_verify: {
      screen: ResetPassVerifyScreen,
    },
    new_pass: {
      screen: NewPassScreen,
    },
    verify_phone: {
      screen: VerifyPhoneScreen,
    },
    home: HomeScreen,
    home_account_faq: MemberAccountFAQScreen,
    home_account_faq_detail: MemberAccountFAQDetailScreen,
    home_account_setting: MemberAccountSettingScreen,
    home_account_profile: MemberProfileScreen,
    home_account_notification: MemberAccountNotificationScreen,
    home_order_detail: MemberOrderDetailScreen,
    home_test: MemberTestScreen,
    home_news: HomeNewsScreen,
    home_booking: HomeBookingListScreen,
    home_booking_list: MemberBookingListScreen,
    home_booking_list_alt: MemberBookingListAltScreen,
    home_booking_list_alt_f: MemberBookingListAltFScreen,
    new_booking: NewBookingScreen,
    cancel_booking: CancelBookingScreen,
    deal_booking: DealBookingScreen,
    booking_history: MemberBookingHistoryScreen,
    booking_history_list: MemberBookingHistoryListScreen,
    booking_stats: MemberBookingStatsScreen,
    booking_detail: MemberBookingDetailScreen,
    booking_detail_history: MemberBookingHistoryDetailScreen,
    rating_detail: MemberRatingDetailScreen,
    rating_desc: MemberRatingDescScreen,
    review_list: MemberReviewListScreen,
    badges: MemberBadgeScreen,
    salon_map: MemberMapScreen,
    salon_time: MemberTimeScreen,
    edit_basic_info: MemberEditBasicInfoScreen,
    edit_stylist: MemberEditStylistScreen,
    edit_brand: MemberEditBrandScreen,
    edit_showcase: MemberEditShowcaseScreen,
    edit_showcase_detail: MemberEditShowcaseDetailScreen,
    list_cats: MemberCatsScreen,
    edit_cat: MemberEditCatScreen,
    edit_options: MemberEditCatOptionsScreen,
    edit_option: MemberEditOptionScreen,
    edit_sale: MemberEditSaleScreen,
    edit_sale_detail: MemberEditSaleDetailScreen,
    edit_sale_select: MemberEditSaleSelectServiceScreen,
    edit_cat_service: MemberEditCatServiceScreen,
    address_editor: MemberAddressEditorScreen,
    html_editor: MemberHtmlEditorScreen,
    customer_list: MemberCustomerListScreen,
    customer: MemberCustomerScreen,
    home_account_change_pass: MemberAccountChangePasswordScreen,
    home_account_default: MemberAccountDefaultScreen,
    home_account_tos: MemberAccountTOSScreen,
    payment: MemberPaymentScreen,
    payment_method: MemberPaymentMethodScreen,
    bank: MemberBankInfoScreen,
    app_intro: MemberSalonIntroScreen,
    accountChecking: AccountCheckingScreen,
    approve_change: ApproveChangeTimeScreen,
    wallet: WalletScreen,
  },

  {
    navigationOptions: {
      header: null,
    },
    initialRouteName: "accountChecking",
    //transitionConfig: () => fromLeft(),
  }
);
