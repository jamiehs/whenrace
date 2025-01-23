const SUN = 0;
const MON = 1;
const TUE = 2;
const WED = 3;
const THU = 4;
const FRI = 5;
const SAT = 6;

// session notes
const SOF = "SOF Session"
const BROADCAST = "Broadcasted"

const officials = [
    {
        seriesId: 'kamel',
        shortLabel: 'IMSA Vintage',
        label: 'IMSA Vintage Series',
        cars: ["Audi 90 GTO", "Nissan ZX-Turbo GTP"],
        links: {
            website: 'https://kamelgt.com',
            discord: 'https://discord.gg/6arPQbNMbt',
        },
        sessions: [
            {
                sessionDay: WED,
                sessionTimeGmt: '19:00',
            },
            {
                sessionDay: THU,
                sessionTimeGmt: '01:00',
            },
            {
                sessionDay: FRI,
                sessionTimeGmt: '21:00',
            },
            {
                sessionDay: SAT,
                sessionTimeGmt: '03:00',
            },
            {
                sessionDay: SAT,
                sessionTimeGmt: '17:00',
                notes: [BROADCAST, SOF]
            },
            {
                sessionDay: SUN,
                sessionTimeGmt: '09:00',
            },
        ]
    },
    {
        seriesId: 'gtc',
        shortLabel: 'Proto-GT Challenge',
        label: 'Proto-GT Thrustmaster Challenge',
        cars: ["HPD ARX 01c", "Aston Martin DBR9 GT1", "Corvette C6.R GT1", "Ford GT GT2"],
        links: {
            discord: 'https://discord.gg/jWCPZ8dtnB',
        },
        sessions: [
            {
                sessionDay: THU,
                sessionTimeGmt: '19:45',
            },
            {
                sessionDay: SUN,
                sessionTimeGmt: '19:45',
            },
        ]
    },
    {
        seriesId: 'clio',
        shortLabel: 'Clio Cup',
        label: 'Clio Cup - Fixed',
        cars: ["Renault Clio"],
        links: {
            discord: 'https://discord.gg/SJtRvbMByA',
        },
        sessions: [
            {
                sessionDay: WED,
                sessionTimeGmt: '19:00',
                notes: [SOF]
            },
        ]
    },
    {
        seriesId: 'mission',
        shortLabel: 'Mission R',
        label: 'Mission R Challenge',
        cars: ["Porsche Mission R"],
        links: {
            discord: 'https://discord.gg/Wazet8mNeR',
            broadcast: 'https://youtube.com/playlist?list=PLlCIL8qLkBnzquG5CV1tyM-2wFpGKvnMG',
        },
        sessions: [
            {
                sessionDay: THU,
                sessionTimeGmt: '21:00',
            },
            {
                sessionDay: SUN,
                sessionTimeGmt: '19:00',
                notes: [SOF, BROADCAST]
            },
        ]
    },
    {
        seriesId: 'usac-sprint',
        shortLabel: 'USAC Sprint Car',
        label: 'AMSOIL USAC Sprint Car - Fixed',
        cars: ["Dirt Sprint Car - Non-Winged"],
        sessions: [
            {
                sessionDay: TUE,
                sessionTimeGmt: '01:45',
            },
            {
                sessionDay: WED,
                sessionTimeGmt: '01:45',
            },
        ]
    },
    {
        seriesId: '360-sprint',
        shortLabel: 'USAC 360 Sprint Car',
        label: 'USAC 360 Sprint Car Series',
        cars: ["Dirt Sprint Car - Non-Winged"],
        sessions: [
            {
                sessionDay: TUE,
                sessionTimeGmt: '00:45',
            },
        ]
    },
    {
        seriesId: 'srf',
        shortLabel: 'SRF Challenge',
        label: 'Spec Racer Ford Challenge',
        cars: ["SCCA Spec Racer Ford"],
        links: {
            discord: 'https://discord.gg/m8MKZA7bhK'
        },
        sessions: [
            {
                sessionDay: TUE,
                sessionTimeGmt: '00:45',
                notes: [SOF]
            },
            {
                sessionDay: THU,
                sessionTimeGmt: '18:45',
            },
            {
                sessionDay: THU,
                sessionTimeGmt: '20:45',
                notes: [SOF]
            },
        ]
    },
    {
        seriesId: 'scb',
        shortLabel: 'Stock Car Brasil',
        label: 'Stock Car Brasil',
        cars: ["Chevrolet Cruze", "Toyota Corolla"],
        links: {
            discord: 'https://discord.gg/45ZhNm6NRc'
        },
        sessions: [
            {
                sessionDay: SUN,
                sessionTimeGmt: '17:45',
            },
            {
                sessionDay: MON,
                sessionTimeGmt: '19:45',
                notes: [SOF],
            },
        ]
    },
    {
        seriesId: 'ir18',
        shortLabel: 'Open Wheel B',
        label: 'US Open Wheel B Dallara IR-18',
        cars: ["Dallara IR-18"],
        links: {
            discord: 'https://discord.gg/cPFQy98AqM'
        },
        sessions: [
            {
                sessionDay: TUE,
                sessionTimeGmt: '00:00',
            },
            {
                sessionDay: SAT,
                sessionTimeGmt: '18:00',
            },
            {
                sessionDay: SUN,
                sessionTimeGmt: '20:00',
            },
        ]
    },
    {
        seriesId: 'ir01',
        shortLabel: 'Formula IR',
        label: 'Dallara Formula IR',
        cars: ["Dallara IR-01"],
        sessions: [
            {
                sessionDay: TUE,
                sessionTimeGmt: '18:00',
            },
        ]
    },
    {
        seriesId: 'lotus49',
        shortLabel: 'Lotus 49',
        label: 'Grand Prix Legends',
        cars: ["Lotus 49"],
        links: {
            discord: 'https://discord.gg/YnXPTatwzd',
            broadcast: 'https://youtube.com/playlist?list=PL2b2Wswly5Jl8f3IxSXJLzaWoEA1T5p84',
        },
        sessions: [
            {
                sessionDay: WED,
                sessionTimeGmt: '23:30',
            },
            {
                sessionDay: THU,
                sessionTimeGmt: '19:30',
            },
            {
                sessionDay: FRI,
                sessionTimeGmt: '23:30',
            },
            {
                sessionDay: SAT,
                sessionTimeGmt: '13:30',
                notes: [BROADCAST]
            },
        ]
    },
    {
        seriesId: 'lotus79',
        shortLabel: 'Lotus 79',
        label: 'Classic Lotus Grand Prix',
        cars: ["Lotus 79"],
        links: {
            discord: 'https://discord.gg/Yt5YJy62Tx'
        },
        sessions: [
            {
                sessionDay: SAT,
                sessionTimeGmt: '14:30',
            },
            {
                sessionDay: SAT,
                sessionTimeGmt: '16:30',
            },
            {
                sessionDay: SUN,
                sessionTimeGmt: '14:30',
            },
            {
                sessionDay: SUN,
                sessionTimeGmt: '16:30',
                notes: [BROADCAST]
            },
        ]
    },
    {
        seriesId: 'v8sc',
        shortLabel: 'Supercars',
        label: 'Supercars Series',
        cars: ["V8 Supercars"],
        sessions: [
            {
                sessionDay: TUE,
                sessionTimeGmt: '07:15',
            },
            {
                sessionDay: FRI,
                sessionTimeGmt: '01:15',
                notes: [SOF]
            },
            {
                sessionDay: SAT,
                sessionTimeGmt: '01:15',
            },
        ]
    },
    {
        seriesId: 'v8sc-au',
        shortLabel: 'Supercars AU',
        label: 'Supercars Series Australian Server Only',
        cars: ["V8 Supercars"],
        sessions: [
            {
                sessionDay: SUN,
                sessionTimeGmt: '10:15',
            },
            {
                sessionDay: MON,
                sessionTimeGmt: '10:15',
                notes: [SOF],
            },
            {
                sessionDay: TUE,
                sessionTimeGmt: '10:15',
            },
            {
                sessionDay: WED,
                sessionTimeGmt: '10:15',
            },
            {
                sessionDay: THU,
                sessionTimeGmt: '10:15',
            },
            {
                sessionDay: FRI,
                sessionTimeGmt: '10:15',
            },
            {
                sessionDay: SAT,
                sessionTimeGmt: '10:15',
            },
        ]
    },
    {
        seriesId: 'spcc',
        shortLabel: 'Sprint Car Cup',
        label: 'Sprint Car Cup',
        cars: ["Sprint Car"],
        links: {
            discord: 'https://discord.gg/22UBJ5j',
        },
        sessions: [
            {
                sessionDay: MON,
                sessionTimeGmt: '01:00',
            },
            {
                sessionDay: WED,
                sessionTimeGmt: '01:00',
                notes: [SOF]
            },
            {
                sessionDay: FRI,
                sessionTimeGmt: '01:00',
            },
            {
                sessionDay: SUN,
                sessionTimeGmt: '23:00',
                notes: ["European SOF Session"]
            },
        ]
    },
    {
        seriesId: 'silcc',
        shortLabel: 'Silver Crown Cup',
        label: 'Silver Crown Cup',
        cars: ["Silver Crown"],
        links: {
            discord: 'https://discord.gg/6P4HknQKZ8',
            broadcast: 'https://www.youtube.com/@NationalRacingNetwork/streams',
        },
        sessions: [
            {
                sessionDay: TUE,
                sessionTimeGmt: '01:45',
                notes: [BROADCAST, SOF]
            },
        ]
    },
    {
        seriesId: 'gt4-fixed',
        shortLabel: 'GT4 Fixed',
        label: 'GT4 Falken Tyre Challenge - Fixed',
        cars: ["Mercedes-AMG GT4", "Porsche 718 Cayman GT4 Clubsport", "BMW M4 GT4", "McLaren 570S GT4", "Aston Martin Vantage GT4"],
        links: {
            discord: 'https://discord.gg/eeredmcx8G',
        },
        sessions: []
    },
]

export {
    officials,
}
