var points = {
  mairie: {
    name: 'Mairie',
    latlng: [(48 + 6/60 + 41/3600), (-1 + -40/60 + -48/3600)]
  },
  tnb: {
    name: 'TNB',
    latlng: [(48 + 6/60 + 29/3600), (-1 + -40/60 + -21/3600)]
  },
  liberte: {
    name: 'Le liberté',
    latlng: [(48 + 6/60 + 24/3600), (-1 + -40/60 + -36/3600)]
  },
};

var lines = [
  {
    from: points.mairie,
    to: points.tnb,
    time: 21
  }, {
    from: points.mairie,
    to: points.liberte,
    time: 19
  }, {
    from: points.liberte,
    to: points.tnb,
    time: 7
  },
];
