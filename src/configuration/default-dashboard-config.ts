export const DEFAULT_USER_UUID = '00000000-0000-0000-0000-000000000000'

export const DEFAULT_DASHBOARD = JSON.stringify({
  gridHeight: 9,
  gridWidth: 16,
  widgets: [
    {
      args: { levelOfDetail: 0, timeFormat: 'seconds' },
      height: 1,
      id: 'w@4-1',
      positionX: 4,
      positionY: 1,
      signature: { lowerHalf: 1698439168, upperHalf: 2373142500 },
      type: 'time',
      width: 3,
    },
    {
      args: {
        availableStations: [],
        latitude: 48.992392,
        levelOfDetail: 0,
        longitude: 8.400856,
        maxDepartures: 10,
        selectedStation: { stopPointName: 'Karlsruhe, Hauptbahnhof', stopPointRef: 'de:08212:90' },
        showPlatform: true,
        transportType: ['BUS', 'TRAIN', 'OTHER'],
      },
      height: 5,
      id: 'w@12-1',
      positionX: 12,
      positionY: 1,
      signature: { lowerHalf: 3893059584, upperHalf: 4240206457 },
      type: 'publicTransport',
      width: 5,
    },
    {
      args: {
        availableStations: [
          { stopPointName: 'Karlsruhe, Studentenhaus', stopPointRef: 'de:08212:3002' },
          { stopPointName: 'Karlsruhe,Durlacher Tor/KIT-Campus Süd', stopPointRef: 'de:08212:3' },
          { stopPointName: 'Karlsruhe, Emil-Gött-Straße', stopPointRef: 'de:08212:3014' },
          { stopPointName: 'Karlsruhe,Durlacher Tor/KIT-Campus Süd (U)', stopPointRef: 'de:08212:1001' },
        ],
        latitude: 49.01208,
        levelOfDetail: 0,
        longitude: 8.415424,
        maxDepartures: 6,
        selectedStation: { stopPointName: 'Karlsruhe,Durlacher Tor/KIT-Campus Süd (U)', stopPointRef: 'de:08212:1001' },
        showPlatform: true,
        transportType: ['BUS', 'TRAIN', 'OTHER'],
      },
      height: 5,
      id: 'w@7-1',
      positionX: 7,
      positionY: 1,
      signature: { lowerHalf: 2825863168, upperHalf: 2808465555 },
      type: 'publicTransport',
      width: 5,
    },
    {
      args: { forecastDays: 5, latitude: 49.01258806984499, levelOfDetail: 1, longitude: 8.41542287541877, unit: 'CELSIUS' },
      height: 4,
      id: 'w@1-2',
      positionX: 1,
      positionY: 2,
      signature: { lowerHalf: 4245127168, upperHalf: 208045136 },
      type: 'weather',
      width: 6,
    },
    {
      args: {
        canteenType: 'MENSA_AM_ADENAUERRING',
        levelOfDetail: 0,
        lineId: 'cf1992cd-ccfa-4a86-9800-7c9d41dfff52',
        priceType: 'STUDENT',
      },
      height: 4,
      id: 'w@5-6',
      positionX: 5,
      positionY: 6,
      signature: { lowerHalf: 4061265920, upperHalf: 3006494572 },
      type: 'mensa',
      width: 4,
    },
    {
      args: {
        canteenType: 'MENSA_AM_ADENAUERRING',
        levelOfDetail: 0,
        lineId: 'c7b4427c-dec6-435d-ad18-93f2b01a0451',
        priceType: 'STUDENT',
      },
      height: 4,
      id: 'w@9-6',
      positionX: 9,
      positionY: 6,
      signature: { lowerHalf: 1209139200, upperHalf: 1819565601 },
      type: 'mensa',
      width: 4,
    },
    {
      args: {
        canteenType: 'MENSA_AM_ADENAUERRING',
        levelOfDetail: 0,
        lineId: 'ea16e729-27b3-4f1a-831b-a282e21ecf7f',
        priceType: 'STUDENT',
      },
      height: 4,
      id: 'w@13-6',
      positionX: 13,
      positionY: 6,
      signature: { lowerHalf: 1405288448, upperHalf: 2776870592 },
      type: 'mensa',
      width: 4,
    },
    {
      args: {
        destination: { latitude: 49.0087571, longitude: 8.4179367 },
        levelOfDetail: 1,
        origin: { latitude: 49.0149948, longitude: 8.41838 },
      },
      height: 4,
      id: 'w@1-6',
      positionX: 1,
      positionY: 6,
      signature: { lowerHalf: 1663172608, upperHalf: 55121866 },
      type: 'routing',
      width: 4,
    },
    {
      args: {
        adaptiveCard:
          '{\n    "type": "AdaptiveCard",\n    "body": [\n        {\n            "type": "TextBlock",\n            "size": "extraLarge",\n            "weight": "bolder",\n            "horizontalAlignment": "center",\n            "text": "Dashboard",\n            "height": "stretch",\n            "maxLines": 1,\n            "style": "heading",\n            "fontType": "Monospace",\n            "isSubtle": false\n        }\n    ],\n    "version": "1.6",\n    "verticalContentAlignment": "Center",\n    "$schema": "http://adaptivecards.io/schemas/adaptive-card.json"\n}',
        adaptiveCardData: '',
        levelOfDetail: 0,
      },
      height: 1,
      id: 'w@1-1',
      positionX: 1,
      positionY: 1,
      signature: { lowerHalf: 509706240, upperHalf: 3133130556 },
      type: 'adaptiveCard',
      width: 3,
    },
  ],
  signature: { upperHalf: 2087968850, lowerHalf: 4074700800 },
})
