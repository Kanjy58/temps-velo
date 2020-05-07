var points = {
  // Rennes POI
  mairie: {
    name: 'Mairie',
    latlng: [(48 + 6/60 + 41/3600), (-1 + -40/60 + -48/3600)]
  },
  // tnb: {
  //   name: 'TNB',
  //   latlng: [(48 + 6/60 + 29/3600), (-1 + -40/60 + -21/3600)]
  // },
  liberte: {
    name: 'Le liberté',
    latlng: [(48 + 6/60 + 24/3600), (-1 + -40/60 + -36/3600)]
  },
  beaulieu: {
    name: 'Campus Beaulieu',
    latlng: [(48 + 7/60 + 7/3600), (-1 + -38/60 + -24/3600)]
  },


  // Rennes métros
  lapoterie: {
    name: 'La Poterie',
    latlng: [(48 + 5/60 + 15/3600), (-1 + -38/60 + -40/3600)]
  },
  republique: {
    name: 'République',
    latlng: [(48 + 6/60 + 35/3600), (-1 + -40/60 + -45/3600)]
  },

  // Gares
  lapoteriesncf: {
    name: 'La Poterie (SNCF)',
    latlng: [(48 + 5/60 + 32/3600), (-1 + -37/60 + -51/3600)]
  },

  // Villes
  nouvoitou: {
    name: 'Nouvoitou',
    latlng: [(48 + 2/60 + 26/3600), (-1 + -32/60 + -45/3600)]
  },
  vernsurseiche: {
    name: 'Vern-sur-Seiche',
    latlng: [(48 + 2/60 + 44/3600), (-1 + -35/60 + -56/3600)]
  },
  starmel: {
    name: 'Saint Armel',
    latlng: [(48 + 0/60 + 42/3600), (-1 + -35/60 + -26/3600)]
  },
};

// Attention: pour que le temps s'affiche dans le bon sens, il faut mettre le
// point le plus à l'est dans `to' et celui le plus à l'ouest dans `from'
var lines = [
  {
    from: points.mairie,
    to: points.republique,
    time: 3
  }, {
    from: points.republique,
    to: points.liberte,
    time: 6
  }, {
    from: points.lapoterie,
    to: points.vernsurseiche,
    time: 17
  }, {
    from: points.vernsurseiche,
    to: points.starmel,
    time: 10
  }, {
    from: points.starmel,
    to: points.nouvoitou,
    time: 15
  }, {
    from: points.vernsurseiche,
    to: points.nouvoitou,
    time: 15
  }, {
    from: points.beaulieu,
    to: points.lapoteriesncf,
    time: 15
  }, {
    from: points.republique,
    to: points.beaulieu,
    time: 14
  }, {
    from: points.lapoterie,
    to: points.lapoteriesncf,
    time: 8
  },
];
