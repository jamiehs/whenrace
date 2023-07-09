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
        shortLabel: 'Kamel GT',
        label: 'Kamel GT Championship',
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
        shortLabel: 'GT Challenge',
        label: 'GT Challenge',
        cars: ["Aston Martin DBR9 GT1", "Corvette C6.R GT1", "Ford GT GT2"],
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
        seriesId: 'mission',
        shortLabel: 'Mission R',
        label: 'Mission R Challenge',
        cars: ["Porsche Mission R"],
        sessions: [
            {
                sessionDay: THU,
                sessionTimeGmt: '19:00',
            },
            {
                sessionDay: SUN,
                sessionTimeGmt: '19:00',
            },
        ]
    },
    {
        seriesId: 'srf',
        shortLabel: 'SRF Challenge',
        label: 'Spec Racer Ford Challenge',
        cars: ["SCCA Spec Racer Ford"],
        sessions: [
            {
                sessionDay: TUE,
                sessionTimeGmt: '00:45',
                notes: [SOF]
            },
            {
                sessionDay: THU,
                sessionTimeGmt: '20:45',
            },
            {
                sessionDay: THU,
                sessionTimeGmt: '22:45',
            },
        ]
    },
    {
        seriesId: 'scb',
        shortLabel: 'Stock Car Brasil',
        label: 'Stock Car Brasil',
        cars: ["Chevrolet Cruze", "Toyota Corolla"],
        sessions: [
            {
                sessionDay: MON,
                sessionTimeGmt: '19:45',
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
        ]
    },
    {
        seriesId: 'usf2k',
        shortLabel: 'Open Wheel D',
        label: 'US Open Wheel D USF 2000',
        cars: ["USF 2000"],
        sessions: [
            {
                sessionDay: FRI,
                sessionTimeGmt: '02:00',
                notes: [BROADCAST, SOF]
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
        sessions: [
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
        sessions: [
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
                sessionDay: FRI,
                sessionTimeGmt: '01:15',
            },
            {
                sessionDay: SAT,
                sessionTimeGmt: '01:15',
            },
        ]
    },
]

export {
    officials,
}