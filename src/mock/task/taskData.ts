const taskData = {
    create: {
        name: 'Task 1',
        projectNumber: 1,
        hoursAvailableToWork: 100,
        hoursWorked: 10,
        hoursRemaining: 90,
        notes: 'Here are some notes',
        numberOfReviews: 0,
        reviewHours: 0,
        hoursRequiredByBim: 0,
        dateAssigned: '2021-08-01 15:00:00',
        dueDate: '2022-08-01 15:00:00',
        UserId: 1,
    },
    put: {
        name: 'Task 1',
        projectNumber: 1,
        hoursAvailableToWork: 100,
        hoursWorked: 20,
        hoursRemaining: 80,
        notes: 'Here are some notes',
        numberOfReviews: 0,
        reviewHours: 5,
        hoursRequiredByBim: 5,
        dateAssigned: '2021-08-01 15:00:00',
        dueDate: '2022-08-01 15:00:00',
        UserId: 1,
    },
    success: {
        name: 'Task 2',
        projectNumber: 2,
        hoursAvailableToWork: 100,
        hoursWorked: 0,
        notes: 'Here are some notes',
        numberOfReviews: 0,
        reviewHours: 0,
        hoursRequiredByBim: 0,
        dateAssigned: '2021-08-01 15:00:00',
        dueDate: '2022-08-01 15:00:00',
        UserId: 1,
    },
    update: {
        name: 'Task 2',
        projectNumber: 2,
        hoursAvailableToWork: 100,
        hoursWorked: 10,
        notes: 'Here are some notes',
        numberOfReviews: 0,
        reviewHours: 0,
        hoursRequiredByBim: 0,
        dateAssigned: '2021-08-01 15:00:00',
        dueDate: '2022-08-01 15:00:00',
        UserId: 1,
    },
    invalid: {
        name: 'Task 2',
        hoursAvailableToWork: 100,
        hoursWorked: 0,
        notes: 'Here are some notes',
        numberOfReviews: 0,
        reviewHours: 0,
        hoursRequiredByBim: 0,
        dateAssigned: '2021-08-01 15:00:00',
        dueDate: '2022-08-01 15:00:00',
        UserId: 1,
    },
    addHours: {
        hours: 10,
    },
};

export default taskData;
