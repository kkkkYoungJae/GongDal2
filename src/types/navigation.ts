import { Route, StackActions, createNavigationContainerRef } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { IGetScheduleComment } from './comment';
import { groupRole } from './group';
import { IScheduleDetail } from './schedule';

export enum Routes {
  Tabs = 'Tabs',
  CalendarScreen = 'CalendarScreen',
  GroupScreen = 'GroupScreen',
  NotificationScreen = 'NotificationScreen',
  SettingScreen = 'SettingScreen',

  // shared
  TermsScreen = 'TermsScreen',
  PlayGroundScreen = 'PlayGroundScreen',

  // auth
  OnboardingScreen = 'OnboardingScreen',
  SignInScreen = 'SignInScreen',
  SignUpTermsScreen = 'SignUpTermsScreen',
  SignUpEmailScreen = 'SignUpEmailScreen',

  // schedule
  ScheduleCreateScreen = 'ScheduleCreateScreen',
  ScheduleDetailScreen = 'ScheduleDetailScreen',
  ScheduleReplyScreen = 'ScheduleReplyScreen',

  // group
  GroupDetailScreen = 'GroupDetailScreen',
  GroupCreateScreen = 'GroupCreateScreen',
  GroupSearchScreen = 'GroupSearchScreen',
  GroupInviteScreen = 'GroupInviteScreen',
  GroupFrontDoorScreen = 'GroupFrontDoorScreen',
  GroupSettingScreen = 'GroupSettingScreen',
  ChangeGroupInfoScreen = 'ChangeGroupInfoScreen',
  GroupSubLeaderScreen = 'GroupSubLeaderScreen',
  AssignLeaderScreen = 'AssignLeaderScreen',

  // setting
  AppVersionScreen = 'AppVersionScreen',
  LanguageScreen = 'LanguageScreen',
  MyInfoScreen = 'MyInfoScreen',
  NoticesScreen = 'NoticesScreen',
  NotificationSettingScreen = 'NotificationsSetting',
  TermsListScreen = 'TermsListScreen',
  ChangeNicknameScreen = 'ChangeNicknameScreen',
  ChangeBirthScreen = 'ChangeBirthScreen',
}

export type RouteParamsUnion =
  /** Shared screens **/
  | {
      route: Routes.Tabs;
      params: { screen?: Routes };
    }
  | {
      route: Routes.CalendarScreen;
      params: undefined;
    }
  | {
      route: Routes.GroupScreen;
      params: undefined;
    }
  | {
      route: Routes.NotificationScreen;
      params: undefined;
    }
  | {
      route: Routes.SettingScreen;
      params: undefined;
    }

  /** Shared screens **/
  | {
      route: Routes.PlayGroundScreen;
      params: undefined;
    }
  | {
      route: Routes.TermsScreen;
      params: {
        title: '개인정보 처리방침' | '서비스 이용약관';
        type: 'privacy' | 'service';
      };
    }

  /** Auth screens **/
  | {
      route: Routes.OnboardingScreen;
      params: undefined;
    }
  | {
      route: Routes.SignInScreen;
      params: undefined;
    }
  | {
      route: Routes.SignUpTermsScreen;
      params: undefined;
    }
  | {
      route: Routes.SignUpEmailScreen;
      params: undefined;
    }

  /** Schedule screens **/
  | {
      route: Routes.ScheduleCreateScreen;
      params: { schedule?: IScheduleDetail; selectDate?: string; groupId?: number };
    }
  | {
      route: Routes.ScheduleDetailScreen;
      params: { scheduleId: number; selectDate?: string };
    }
  | {
      route: Routes.ScheduleReplyScreen;
      params: { comment: IGetScheduleComment; scheduleId: number };
    }

  /** Group screens **/
  | {
      route: Routes.GroupDetailScreen;
      params: undefined;
    }
  | {
      route: Routes.GroupCreateScreen;
      params: undefined;
    }
  | {
      route: Routes.GroupSearchScreen;
      params: undefined;
    }
  | {
      route: Routes.GroupInviteScreen;
      params: { name: string; key: string };
    }
  | {
      route: Routes.GroupFrontDoorScreen;
      params: { groupKey: string };
    }
  | {
      route: Routes.GroupSettingScreen;
      params: undefined;
    }
  | {
      route: Routes.ChangeGroupInfoScreen;
      params: { type: 'name' | 'description' };
    }
  | {
      route: Routes.GroupSubLeaderScreen;
      params: undefined;
    }
  | {
      route: Routes.AssignLeaderScreen;
      params: { type: groupRole };
    }

  /** Setting screens **/
  | {
      route: Routes.AppVersionScreen;
      params: undefined;
    }
  | {
      route: Routes.LanguageScreen;
      params: undefined;
    }
  | {
      route: Routes.MyInfoScreen;
      params: undefined;
    }
  | {
      route: Routes.NoticesScreen;
      params: undefined;
    }
  | {
      route: Routes.NotificationSettingScreen;
      params: undefined;
    }
  | {
      route: Routes.TermsListScreen;
      params: undefined;
    }
  | {
      route: Routes.ChangeNicknameScreen;
      params: undefined;
    }
  | {
      route: Routes.ChangeBirthScreen;
      params: undefined;
    };

type ExtractParams<R extends Routes, U extends RouteParamsUnion> = U extends {
  route: R;
  params: infer P;
}
  ? P
  : never;

export type RouteParams<R extends Routes> = ExtractParams<R, RouteParamsUnion>;
export type ParamListBase<T extends RouteParamsUnion = RouteParamsUnion> = {
  [k in T['route']]: T extends { route: k; params: infer P } ? P : never;
};

export type RouteProps<
  T extends Routes,
  P extends Record<string, unknown> = Record<string, string>,
> = {
  navigation: NativeStackNavigationProp<ParamListBase, T>;
  route: Route<T, RouteParams<T>>;
} & P;

export type ScreenPropsNavigation<T extends Routes> = RouteProps<T>['navigation'];
export type ScreenPropsRoute<T extends Routes> = RouteProps<T>['route'];

export const navigationRef = createNavigationContainerRef<ParamListBase>();
export const navigationActions = {
  navigate<T extends Routes>(name: T, params: RouteParams<T>) {
    if (navigationRef.isReady()) {
      const currentRoute = navigationRef.getCurrentRoute();
      if (currentRoute?.name === name) {
        navigationRef.dispatch(StackActions.replace(name, params));
      } else {
        // @ts-ignore
        navigationRef.navigate<Routes>(name, params);
      }
    }
  },
  push<T extends Routes>(name: T, params: RouteParams<T>) {
    if (navigationRef.isReady()) {
      navigationRef.dispatch(StackActions.push(name, params));
    }
  },
  goBack() {
    if (navigationRef.isReady()) {
      navigationRef.goBack();
    }
  },
};
