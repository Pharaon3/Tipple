export const storeTime = {
    intervalMinutes: 30,
    days: [
        {
            label: 'Today',
            isToday: true,
            isTomorrow: false,
            dayOfWeek: 'Wednesday',
            date: '2019-05-01T00:00:00Z',
            dateWithoutTime: '2019-05-01',
            startTime: '12:00:00',
            endTime: '23:00:00',
            hours: [
                { minutes: -1, label: 'ASAP' },
                { minutes: 900, label: '3:00PM - 3:30PM' },
                { minutes: 930, label: '3:30PM - 4:00PM' },
                { minutes: 960, label: '4:00PM - 4:30PM' },
                { minutes: 990, label: '4:30PM - 5:00PM' },
                { minutes: 1020, label: '5:00PM - 5:30PM' },
                { minutes: 1050, label: '5:30PM - 6:00PM' },
                { minutes: 1080, label: '6:00PM - 6:30PM' },
                { minutes: 1110, label: '6:30PM - 7:00PM' },
                { minutes: 1140, label: '7:00PM - 7:30PM' },
                { minutes: 1170, label: '7:30PM - 8:00PM' },
                { minutes: 1200, label: '8:00PM - 8:30PM' },
                { minutes: 1230, label: '8:30PM - 9:00PM' },
                { minutes: 1260, label: '9:00PM - 9:30PM' },
                { minutes: 1290, label: '9:30PM - 10:00PM' },
                { minutes: 1320, label: '10:00PM - 10:30PM' },
                { minutes: 1350, label: '10:30PM - 11:00PM' }
            ]
        },
        {
            label: 'Tomorrow',
            isToday: false,
            isTomorrow: true,
            dayOfWeek: 'Thursday',
            date: '2019-05-02T00:00:00Z',
            dateWithoutTime: '2019-05-02',
            startTime: '12:00:00',
            endTime: '23:00:00',
            hours: [
                { minutes: 720, label: '12:00PM - 12:30PM' },
                { minutes: 750, label: '12:30PM - 1:00PM' },
                { minutes: 780, label: '1:00PM - 1:30PM' },
                { minutes: 810, label: '1:30PM - 2:00PM' },
                { minutes: 840, label: '2:00PM - 2:30PM' },
                { minutes: 870, label: '2:30PM - 3:00PM' },
                { minutes: 900, label: '3:00PM - 3:30PM' },
                { minutes: 930, label: '3:30PM - 4:00PM' },
                { minutes: 960, label: '4:00PM - 4:30PM' },
                { minutes: 990, label: '4:30PM - 5:00PM' },
                { minutes: 1020, label: '5:00PM - 5:30PM' },
                { minutes: 1050, label: '5:30PM - 6:00PM' },
                { minutes: 1080, label: '6:00PM - 6:30PM' },
                { minutes: 1110, label: '6:30PM - 7:00PM' },
                { minutes: 1140, label: '7:00PM - 7:30PM' },
                { minutes: 1170, label: '7:30PM - 8:00PM' },
                { minutes: 1200, label: '8:00PM - 8:30PM' },
                { minutes: 1230, label: '8:30PM - 9:00PM' },
                { minutes: 1260, label: '9:00PM - 9:30PM' },
                { minutes: 1290, label: '9:30PM - 10:00PM' },
                { minutes: 1320, label: '10:00PM - 10:30PM' },
                { minutes: 1350, label: '10:30PM - 11:00PM' }
            ]
        },
        {
            label: 'Friday, 3rd May',
            isToday: false,
            isTomorrow: false,
            dayOfWeek: 'Friday',
            date: '2019-05-03T00:00:00Z',
            dateWithoutTime: '2019-05-03',
            startTime: '12:00:00',
            endTime: '23:00:00',
            hours: [
                { minutes: 720, label: '12:00PM - 12:30PM' },
                { minutes: 750, label: '12:30PM - 1:00PM' },
                { minutes: 780, label: '1:00PM - 1:30PM' },
                { minutes: 810, label: '1:30PM - 2:00PM' },
                { minutes: 840, label: '2:00PM - 2:30PM' },
                { minutes: 870, label: '2:30PM - 3:00PM' },
                { minutes: 900, label: '3:00PM - 3:30PM' },
                { minutes: 930, label: '3:30PM - 4:00PM' },
                { minutes: 960, label: '4:00PM - 4:30PM' },
                { minutes: 990, label: '4:30PM - 5:00PM' },
                { minutes: 1020, label: '5:00PM - 5:30PM' },
                { minutes: 1050, label: '5:30PM - 6:00PM' },
                { minutes: 1080, label: '6:00PM - 6:30PM' },
                { minutes: 1110, label: '6:30PM - 7:00PM' },
                { minutes: 1140, label: '7:00PM - 7:30PM' },
                { minutes: 1170, label: '7:30PM - 8:00PM' },
                { minutes: 1200, label: '8:00PM - 8:30PM' },
                { minutes: 1230, label: '8:30PM - 9:00PM' },
                { minutes: 1260, label: '9:00PM - 9:30PM' },
                { minutes: 1290, label: '9:30PM - 10:00PM' },
                { minutes: 1320, label: '10:00PM - 10:30PM' },
                { minutes: 1350, label: '10:30PM - 11:00PM' }
            ]
        }
    ]
};

export default {
    storeTime
};