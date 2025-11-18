import { dummyProjects } from "./dummyProject";
import { dummyUsers } from "./dummyUsers";

export const dummyCalendar = [
    {
        id: '1',
        title: 'Team Meeting',
        createdBy: dummyUsers[0],
        eventFor: [
            dummyProjects[0]  
        ],
        start: new Date(2025, 10, 10, 9, 0),
        end: new Date(2025, 10, 10, 10, 0),
    },
    {
        id: '2',
        title: 'Lunch with Client',
        createdBy: dummyUsers[0],
        eventFor: [
            "All Users"  
        ],
        start: new Date(2025, 10, 10, 12, 30),
        end: new Date(2025, 10, 10, 13, 30),
    },
    {
        id: '3',
        title: 'Design Review',
        createdBy: dummyUsers[0],
        eventFor: [
            dummyProjects[1],
            dummyProjects[2],  
        ],
        start: new Date(2025, 10, 10, 14, 0),
        end: new Date(2025, 10, 10, 15, 30),
    },
    {
        id: '4',
        title: 'Project Kickoff',
        start: new Date(2025, 10, 10, 16, 0),
        end: new Date(2025, 10, 10, 17, 0),
    },
    {
        id: '5',
        title: 'Code Review',
        start: new Date(2025, 10, 11, 10, 0),
        end: new Date(2025, 10, 11, 11, 0),
    },
    {
        id: '6',
        title: 'Client Presentation',
        start: new Date(2025, 10, 11, 14, 0),
        end: new Date(2025, 10, 11, 15, 30),
    },
    {
        id: '7',
        title: 'Sprint Planning',
        start: new Date(2025, 10, 12, 9, 0),
        end: new Date(2025, 10, 12, 11, 0),
    },
    {
        id: '8',
        title: 'Design Workshop',
        start: new Date(2025, 10, 13, 13, 0),
        end: new Date(2025, 10, 13, 15, 0),
    },
    {
        id: '9',
        title: 'Team Standup',
        start: new Date(2025, 10, 14, 9, 30),
        end: new Date(2025, 10, 14, 10, 0),
    },
    {
        id: '10',
        title: 'Product Demo',
        start: new Date(2025, 10, 15, 11, 0),
        end: new Date(2025, 10, 15, 12, 0),
    }
];