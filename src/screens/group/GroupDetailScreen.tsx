import Icon from '@/components/Icon';
import Text from '@/components/Text';
import Calendar from '@/components/calendar/Calendar';
import ScheduleListModal from '@/components/calendar/ScheduleListModal';
import Week from '@/components/calendar/Week';
import GroupSettingSidebar from '@/components/group/GroupSettingSidebar';
import MainLayout from '@/components/layouts/MainLayout';
import { useAppNavigation } from '@/hooks/useAppNavigation';
import { useGroup } from '@/hooks/useGroup';
import { useSchedule } from '@/hooks/useSchedule';
import { getGroupFeed, getGroupMember } from '@/services/group';
import { DEFAULT_SCALE_FACTOR } from '@/styles/createScaleFactor';
import useHeaderStyle from '@/styles/useHeaderStyle';
import { IGroupFeed } from '@/types/group';
import { Routes } from '@/types/navigation';
import { PagedResponse } from '@/types/page';
import { ISchedule } from '@/types/schedule';
import { fDate, parseAxiosError } from '@/utils/factory';
import { format, getMonth, getYear, isSameMinute } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import { Modalize } from 'react-native-modalize';

const GroupDetailScreen = () => {
  const { HeaderComponent } = useHeaderStyle();
  const { scheduleState } = useSchedule();
  const { navigation } = useAppNavigation<Routes.GroupDetailScreen>();
  const { group, setCurrentGroupUsers } = useGroup();

  const scheduleListModalRef = useRef<Modalize>(null);

  const [groupFeed, setGroupFeed] = useState<PagedResponse<IGroupFeed>>();
  const [currentYear, setCurrentYear] = useState(getYear(new Date()));
  const [currentMonth, setCurrentMonth] = useState(getMonth(new Date()));
  const [selectDay, setSelectDay] = useState<Date>();

  const [isShowSidebar, setIsShowSidebar] = useState(false);

  useLayoutEffect(() => {
    (async () => {
      try {
        if (!group.currentGroup) return;

        const [members, feed] = await Promise.all([
          getGroupMember(group.currentGroup?.groupId),
          getGroupFeed(group.currentGroup?.groupId),
        ]);

        setCurrentGroupUsers(members);
        setGroupFeed(feed);
      } catch (err) {
        parseAxiosError(err);
      }
    })();
  }, []);

  const onFeedEndReached = async () => {
    try {
      if (groupFeed?.last || !group.currentGroup) return;

      const feed = await getGroupFeed(group.currentGroup.groupId, (groupFeed?.number || 0) + 1);
      setGroupFeed((prev) => {
        if (!prev) return prev;

        return {
          ...feed,
          content: [...(prev?.content || []), ...feed.content],
        };
      });
    } catch (err) {
      parseAxiosError(err);
    }
  };

  const handlePressDay = (date: Date) => {
    setSelectDay(date);

    scheduleListModalRef.current?.open();
  };

  const handleMonthChange = useCallback(async (year: number, month: number) => {
    setCurrentYear(year);
    setCurrentMonth(month);
  }, []);

  const filterScheduleList = () => {
    const currentGroupId = group.currentGroup?.groupId;

    if (!currentGroupId) {
      return [];
    }

    return (scheduleState.scheduleByGroupId[currentGroupId]?.[fDate(selectDay)] || []).filter(
      (v) => v !== null,
    ) as ISchedule[];
  };

  const handlePressFeed = async (feed: IGroupFeed) => {
    navigation.navigate(Routes.ScheduleDetailScreen, {
      scheduleId: feed.scheduleId,
      selectDate: fDate(feed.startDate),
    });
  };

  const renderItem = useCallback(
    ({ item }: { item: IGroupFeed }) => {
      const isAllDay = isSameMinute(new Date(item.startDate), new Date(item.endDate));

      return (
        <TouchableOpacity
          onPress={() => handlePressFeed(item)}
          style={{
            paddingHorizontal: 16,
            paddingVertical: 8,
            backgroundColor: '#f1f0f3',
            margin: 8,
            borderRadius: 8,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <View
              style={{
                width: 5,
                height: '100%',
                backgroundColor: group.currentGroup?.color || 'lightblue',
                borderRadius: 100,
                marginRight: 12,
              }}
            />
            <View>
              <Text h1>{item.scheduleName}</Text>
              <Text subtitle3>
                {isAllDay
                  ? format(item.startDate, 'M월 d일 (eee) a h:mm', { locale: ko })
                  : `${format(item.startDate, 'M월 d일 (eee) a h:mm', { locale: ko })} ~ ${format(
                      item.endDate,
                      'M월 d일 a h:mm',
                      { locale: ko },
                    )}`}
              </Text>
            </View>
          </View>

          <Text body3>{`${item.nickname}님이 일정을 작성했습니다.`}</Text>
          <Text body3>{format(item.createDate, 'M월 d일 (eee) a h:mm', { locale: ko })}</Text>
        </TouchableOpacity>
      );
    },
    [group.currentGroup],
  );

  return (
    <MainLayout>
      <HeaderComponent
        left={<Icon icon="Ionicons" name="chevron-back" />}
        onPressLeft={() => navigation.goBack()}
        title={group.currentGroup?.name}
        right={<Icon icon="Ionicons" name="reorder-three" />}
        onPressRight={() => setIsShowSidebar(true)}
      />

      <FlatList
        data={groupFeed?.content}
        renderItem={renderItem}
        keyExtractor={(_, index) => String(index)}
        onEndReached={onFeedEndReached}
        onEndReachedThreshold={32}
        ListHeaderComponent={
          <View style={{ paddingHorizontal: 16, height: 600 }}>
            <Text
              h1
              style={{ fontSize: DEFAULT_SCALE_FACTOR(20), marginBottom: 6, textAlign: 'center' }}
            >
              {`${currentYear}년 ${currentMonth + 1}월`}
            </Text>

            <Week />
            <Calendar
              groupId={group.currentGroup?.groupId}
              handlePressDay={handlePressDay}
              handleMonthChange={handleMonthChange}
              type="dot"
            />
          </View>
        }
      />

      <GroupSettingSidebar
        isVisible={isShowSidebar}
        onClose={() => setIsShowSidebar(false)}
        groupMember={group.currentGroupUsers}
        groupInfo={group.currentGroup}
      />

      <ScheduleListModal
        ref={scheduleListModalRef}
        selectDay={selectDay}
        scheduleList={filterScheduleList()}
      />
    </MainLayout>
  );
};

export default GroupDetailScreen;
