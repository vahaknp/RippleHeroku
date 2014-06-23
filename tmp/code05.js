// Some globals for testing use and use by the web page
var presetDatasets = {};
var presetViews = {};

$(document).ready(function() {
  
  var width = 180,
      height = 120;
  
  var red = [255, 0, 0, 255],
      green = [0, 255, 0, 255],
      blue = [0, 0, 255, 255];
  
  threedee.setPreset('datasets', 'Sphere', [threedee.Geometry.makeShape('sphere', red, [5, 0, 0], 5),
                                            threedee.Geometry.makeShape('sphere', blue, [4, 0, 0], 5)/*,
                                            threedee.Geometry.makeShape('sphere', red, [-50, 0, 0], 11),
                                            threedee.Geometry.makeShape('sphere', green, [0, 50, 0], 10),
                                            threedee.Geometry.makeShape('sphere', green, [0, -50, 0], 9),
                                            threedee.Geometry.makeShape('sphere', blue, [0, 0, 50], 8),
                                            threedee.Geometry.makeShape('sphere', blue, [0, 0, -50], 7),*/
                                            ]);
  threedee.setPreset('datasets', 'Small point cloud', threedee.Geometry.generateRandomCloudOfPointData(5, 1000, 3, red));
  threedee.setPreset('datasets', 'Large point cloud', threedee.Geometry.generateRandomCloudOfPointData(100, 1000, 3, blue));
  threedee.setDefaultPreset('datasets', 'dataset3');

  threedee.setPreset('views', 'viewxp', threedee.Geometry.makeViewPoint({pt1 : [0,0,0], pt2 : [1,0,0]}, width, height));
/*  threedee.setPreset('views', 'viewxn', threedee.Geometry.makeViewPoint([0,0,0], [-1,0,0], 0, width, height));
  threedee.setPreset('views', 'viewyp', threedee.Geometry.makeViewPoint([0,0,0], [0,1,0], 0, width, height));
  threedee.setPreset('views', 'viewyn', threedee.Geometry.makeViewPoint([0,0,0], [0,-1,0], 0, width, height));
  threedee.setPreset('views', 'viewzp', threedee.Geometry.makeViewPoint([0,0,0], [0,0,1], 0, width, height));
  threedee.setPreset('views', 'viewzn', threedee.Geometry.makeViewPoint([0,0,0], [0,0,-1], 0, width, height));*/
  
  threedee.setDefaultPreset('algorithms', 'Greedy search');
  
  // Make page buttons
  threedee.presetsToHTML('datasets', $('#datasets'));
  threedee.presetsToHTML('views', $('#views'));
  threedee.presetsToHTML('algorithms', $('#algorithms'));
  
  threedee.makeRenderer('#viewport', width, height);
  threedee.makeEngine();
  
  //threedee.engine.start();
  threedee.engine.tick();
  
});

// Some globals for testing use and use by the web page
var presetDatasets = {};
var presetViews = {};

$(document).ready(function() {
  
  var width = 180,
      height = 120;
  
  var red = [255, 0, 0, 255],
      green = [0, 255, 0, 255],
      blue = [0, 0, 255, 255];
  
  threedee.setPreset('datasets', 'Sphere', [threedee.Geometry.makeShape('sphere', red, [5, 0, 0], 5),
                                            threedee.Geometry.makeShape('sphere', blue, [4, 0, 0], 5)/*,
                                            threedee.Geometry.makeShape('sphere', red, [-50, 0, 0], 11),
                                            threedee.Geometry.makeShape('sphere', green, [0, 50, 0], 10),
                                            threedee.Geometry.makeShape('sphere', green, [0, -50, 0], 9),
                                            threedee.Geometry.makeShape('sphere', blue, [0, 0, 50], 8),
                                            threedee.Geometry.makeShape('sphere', blue, [0, 0, -50], 7),*/
                                            ]);
  threedee.setPreset('datasets', 'Small point cloud', threedee.Geometry.generateRandomCloudOfPointData(5, 1000, 3, red));
  threedee.setPreset('datasets', 'Large point cloud', threedee.Geometry.generateRandomCloudOfPointData(100, 1000, 3, blue));
  threedee.setDefaultPreset('datasets', 'dataset3');

  threedee.setPreset('views', 'viewxp', threedee.Geometry.makeViewPoint({pt1 : [0,0,0], pt2 : [1,0,0]}, width, height));
/*  threedee.setPreset('views', 'viewxn', threedee.Geometry.makeViewPoint([0,0,0], [-1,0,0], 0, width, height));
  threedee.setPreset('views', 'viewyp', threedee.Geometry.makeViewPoint([0,0,0], [0,1,0], 0, width, height));
  threedee.setPreset('views', 'viewyn', threedee.Geometry.makeViewPoint([0,0,0], [0,-1,0], 0, width, height));
  threedee.setPreset('views', 'viewzp', threedee.Geometry.makeViewPoint([0,0,0], [0,0,1], 0, width, height));
  threedee.setPreset('views', 'viewzn', threedee.Geometry.makeViewPoint([0,0,0], [0,0,-1], 0, width, height));*/
  
  threedee.setDefaultPreset('algorithms', 'Greedy search');
  
  // Make page buttons
  threedee.presetsToHTML('datasets', $('#datasets'));
  threedee.presetsToHTML('views', $('#views'));
  threedee.presetsToHTML('algorithms', $('#algorithms'));
  
  threedee.makeRenderer('#viewport', width, height);
  threedee.makeEngine();
  
  //threedee.engine.start();
  threedee.engine.tick();
  
});

// Some globals for testing use and use by the web page
var presetDatasets = {};
var presetViews = {};

$(document).ready(function() {
  
  var width = 180,
      height = 120;
  
  var red = [255, 0, 0, 255],
      green = [0, 255, 0, 255],
      blue = [0, 0, 255, 255];
  
  threedee.setPreset('datasets', 'Sphere', [threedee.Geometry.makeShape('sphere', red, [5, 0, 0], 5),
                                            threedee.Geometry.makeShape('sphere', blue, [4, 0, 0], 5)/*,
                                            threedee.Geometry.makeShape('sphere', red, [-50, 0, 0], 11),
                                            threedee.Geometry.makeShape('sphere', green, [0, 50, 0], 10),
                                            threedee.Geometry.makeShape('sphere', green, [0, -50, 0], 9),
                                            threedee.Geometry.makeShape('sphere', blue, [0, 0, 50], 8),
                                            threedee.Geometry.makeShape('sphere', blue, [0, 0, -50], 7),*/
                                            ]);
  threedee.setPreset('datasets', 'Small point cloud', threedee.Geometry.generateRandomCloudOfPointData(5, 1000, 3, red));
  threedee.setPreset('datasets', 'Large point cloud', threedee.Geometry.generateRandomCloudOfPointData(100, 1000, 3, blue));
  threedee.setDefaultPreset('datasets', 'dataset3');

  threedee.setPreset('views', 'viewxp', threedee.Geometry.makeViewPoint({pt1 : [0,0,0], pt2 : [1,0,0]}, width, height));
/*  threedee.setPreset('views', 'viewxn', threedee.Geometry.makeViewPoint([0,0,0], [-1,0,0], 0, width, height));
  threedee.setPreset('views', 'viewyp', threedee.Geometry.makeViewPoint([0,0,0], [0,1,0], 0, width, height));
  threedee.setPreset('views', 'viewyn', threedee.Geometry.makeViewPoint([0,0,0], [0,-1,0], 0, width, height));
  threedee.setPreset('views', 'viewzp', threedee.Geometry.makeViewPoint([0,0,0], [0,0,1], 0, width, height));
  threedee.setPreset('views', 'viewzn', threedee.Geometry.makeViewPoint([0,0,0], [0,0,-1], 0, width, height));*/
  
  threedee.setDefaultPreset('algorithms', 'Greedy search');
  
  // Make page buttons
  threedee.presetsToHTML('datasets', $('#datasets'));
  threedee.presetsToHTML('views', $('#views'));
  threedee.presetsToHTML('algorithms', $('#algorithms'));
  
  threedee.makeRenderer('#viewport', width, height);
  threedee.makeEngine();
  
  //threedee.engine.start();
  threedee.engine.tick();
  
});

// Some globals for testing use and use by the web page
var presetDatasets = {};
var presetViews = {};

$(document).ready(function() {
  
  var width = 180,
      height = 120;
  
  var red = [255, 0, 0, 255],
      green = [0, 255, 0, 255],
      blue = [0, 0, 255, 255];
  
  threedee.setPreset('datasets', 'Sphere', [threedee.Geometry.makeShape('sphere', red, [5, 0, 0], 5),
                                            threedee.Geometry.makeShape('sphere', blue, [4, 0, 0], 5)/*,
                                            threedee.Geometry.makeShape('sphere', red, [-50, 0, 0], 11),
                                            threedee.Geometry.makeShape('sphere', green, [0, 50, 0], 10),
                                            threedee.Geometry.makeShape('sphere', green, [0, -50, 0], 9),
                                            threedee.Geometry.makeShape('sphere', blue, [0, 0, 50], 8),
                                            threedee.Geometry.makeShape('sphere', blue, [0, 0, -50], 7),*/
                                            ]);
  threedee.setPreset('datasets', 'Small point cloud', threedee.Geometry.generateRandomCloudOfPointData(5, 1000, 3, red));
  threedee.setPreset('datasets', 'Large point cloud', threedee.Geometry.generateRandomCloudOfPointData(100, 1000, 3, blue));
  threedee.setDefaultPreset('datasets', 'dataset3');

  threedee.setPreset('views', 'viewxp', threedee.Geometry.makeViewPoint({pt1 : [0,0,0], pt2 : [1,0,0]}, width, height));
/*  threedee.setPreset('views', 'viewxn', threedee.Geometry.makeViewPoint([0,0,0], [-1,0,0], 0, width, height));
  threedee.setPreset('views', 'viewyp', threedee.Geometry.makeViewPoint([0,0,0], [0,1,0], 0, width, height));
  threedee.setPreset('views', 'viewyn', threedee.Geometry.makeViewPoint([0,0,0], [0,-1,0], 0, width, height));
  threedee.setPreset('views', 'viewzp', threedee.Geometry.makeViewPoint([0,0,0], [0,0,1], 0, width, height));
  threedee.setPreset('views', 'viewzn', threedee.Geometry.makeViewPoint([0,0,0], [0,0,-1], 0, width, height));*/
  
  threedee.setDefaultPreset('algorithms', 'Greedy search');
  
  // Make page buttons
  threedee.presetsToHTML('datasets', $('#datasets'));
  threedee.presetsToHTML('views', $('#views'));
  threedee.presetsToHTML('algorithms', $('#algorithms'));
  
  threedee.makeRenderer('#viewport', width, height);
  threedee.makeEngine();
  
  //threedee.engine.start();
  threedee.engine.tick();
  
});

// Some globals for testing use and use by the web page
var presetDatasets = {};
var presetViews = {};

$(document).ready(function() {
  
  var width = 180,
      height = 120;
  
  var red = [255, 0, 0, 255],
      green = [0, 255, 0, 255],
      blue = [0, 0, 255, 255];
  
  threedee.setPreset('datasets', 'Sphere', [threedee.Geometry.makeShape('sphere', red, [5, 0, 0], 5),
                                            threedee.Geometry.makeShape('sphere', blue, [4, 0, 0], 5)/*,
                                            threedee.Geometry.makeShape('sphere', red, [-50, 0, 0], 11),
                                            threedee.Geometry.makeShape('sphere', green, [0, 50, 0], 10),
                                            threedee.Geometry.makeShape('sphere', green, [0, -50, 0], 9),
                                            threedee.Geometry.makeShape('sphere', blue, [0, 0, 50], 8),
                                            threedee.Geometry.makeShape('sphere', blue, [0, 0, -50], 7),*/
                                            ]);
  threedee.setPreset('datasets', 'Small point cloud', threedee.Geometry.generateRandomCloudOfPointData(5, 1000, 3, red));
  threedee.setPreset('datasets', 'Large point cloud', threedee.Geometry.generateRandomCloudOfPointData(100, 1000, 3, blue));
  threedee.setDefaultPreset('datasets', 'dataset3');

  threedee.setPreset('views', 'viewxp', threedee.Geometry.makeViewPoint({pt1 : [0,0,0], pt2 : [1,0,0]}, width, height));
/*  threedee.setPreset('views', 'viewxn', threedee.Geometry.makeViewPoint([0,0,0], [-1,0,0], 0, width, height));
  threedee.setPreset('views', 'viewyp', threedee.Geometry.makeViewPoint([0,0,0], [0,1,0], 0, width, height));
  threedee.setPreset('views', 'viewyn', threedee.Geometry.makeViewPoint([0,0,0], [0,-1,0], 0, width, height));
  threedee.setPreset('views', 'viewzp', threedee.Geometry.makeViewPoint([0,0,0], [0,0,1], 0, width, height));
  threedee.setPreset('views', 'viewzn', threedee.Geometry.makeViewPoint([0,0,0], [0,0,-1], 0, width, height));*/
  
  threedee.setDefaultPreset('algorithms', 'Greedy search');
  
  // Make page buttons
  threedee.presetsToHTML('datasets', $('#datasets'));
  threedee.presetsToHTML('views', $('#views'));
  threedee.presetsToHTML('algorithms', $('#algorithms'));
  
  threedee.makeRenderer('#viewport', width, height);
  threedee.makeEngine();
  
  //threedee.engine.start();
  threedee.engine.tick();
  
});

// Some globals for testing use and use by the web page
var presetDatasets = {};
var presetViews = {};

$(document).ready(function() {
  
  var width = 180,
      height = 120;
  
  var red = [255, 0, 0, 255],
      green = [0, 255, 0, 255],
      blue = [0, 0, 255, 255];
  
  threedee.setPreset('datasets', 'Sphere', [threedee.Geometry.makeShape('sphere', red, [5, 0, 0], 5),
                                            threedee.Geometry.makeShape('sphere', blue, [4, 0, 0], 5)/*,
                                            threedee.Geometry.makeShape('sphere', red, [-50, 0, 0], 11),
                                            threedee.Geometry.makeShape('sphere', green, [0, 50, 0], 10),
                                            threedee.Geometry.makeShape('sphere', green, [0, -50, 0], 9),
                                            threedee.Geometry.makeShape('sphere', blue, [0, 0, 50], 8),
                                            threedee.Geometry.makeShape('sphere', blue, [0, 0, -50], 7),*/
                                            ]);
  threedee.setPreset('datasets', 'Small point cloud', threedee.Geometry.generateRandomCloudOfPointData(5, 1000, 3, red));
  threedee.setPreset('datasets', 'Large point cloud', threedee.Geometry.generateRandomCloudOfPointData(100, 1000, 3, blue));
  threedee.setDefaultPreset('datasets', 'dataset3');

  threedee.setPreset('views', 'viewxp', threedee.Geometry.makeViewPoint({pt1 : [0,0,0], pt2 : [1,0,0]}, width, height));
/*  threedee.setPreset('views', 'viewxn', threedee.Geometry.makeViewPoint([0,0,0], [-1,0,0], 0, width, height));
  threedee.setPreset('views', 'viewyp', threedee.Geometry.makeViewPoint([0,0,0], [0,1,0], 0, width, height));
  threedee.setPreset('views', 'viewyn', threedee.Geometry.makeViewPoint([0,0,0], [0,-1,0], 0, width, height));
  threedee.setPreset('views', 'viewzp', threedee.Geometry.makeViewPoint([0,0,0], [0,0,1], 0, width, height));
  threedee.setPreset('views', 'viewzn', threedee.Geometry.makeViewPoint([0,0,0], [0,0,-1], 0, width, height));*/
  
  threedee.setDefaultPreset('algorithms', 'Greedy search');
  
  // Make page buttons
  threedee.presetsToHTML('datasets', $('#datasets'));
  threedee.presetsToHTML('views', $('#views'));
  threedee.presetsToHTML('algorithms', $('#algorithms'));
  
  threedee.makeRenderer('#viewport', width, height);
  threedee.makeEngine();
  
  //threedee.engine.start();
  threedee.engine.tick();
  
});

// Some globals for testing use and use by the web page
var presetDatasets = {};
var presetViews = {};

$(document).ready(function() {
  
  var width = 180,
      height = 120;
  
  var red = [255, 0, 0, 255],
      green = [0, 255, 0, 255],
      blue = [0, 0, 255, 255];
  
  threedee.setPreset('datasets', 'Sphere', [threedee.Geometry.makeShape('sphere', red, [5, 0, 0], 5),
                                            threedee.Geometry.makeShape('sphere', blue, [4, 0, 0], 5)/*,
                                            threedee.Geometry.makeShape('sphere', red, [-50, 0, 0], 11),
                                            threedee.Geometry.makeShape('sphere', green, [0, 50, 0], 10),
                                            threedee.Geometry.makeShape('sphere', green, [0, -50, 0], 9),
                                            threedee.Geometry.makeShape('sphere', blue, [0, 0, 50], 8),
                                            threedee.Geometry.makeShape('sphere', blue, [0, 0, -50], 7),*/
                                            ]);
  threedee.setPreset('datasets', 'Small point cloud', threedee.Geometry.generateRandomCloudOfPointData(5, 1000, 3, red));
  threedee.setPreset('datasets', 'Large point cloud', threedee.Geometry.generateRandomCloudOfPointData(100, 1000, 3, blue));
  threedee.setDefaultPreset('datasets', 'dataset3');

  threedee.setPreset('views', 'viewxp', threedee.Geometry.makeViewPoint({pt1 : [0,0,0], pt2 : [1,0,0]}, width, height));
/*  threedee.setPreset('views', 'viewxn', threedee.Geometry.makeViewPoint([0,0,0], [-1,0,0], 0, width, height));
  threedee.setPreset('views', 'viewyp', threedee.Geometry.makeViewPoint([0,0,0], [0,1,0], 0, width, height));
  threedee.setPreset('views', 'viewyn', threedee.Geometry.makeViewPoint([0,0,0], [0,-1,0], 0, width, height));
  threedee.setPreset('views', 'viewzp', threedee.Geometry.makeViewPoint([0,0,0], [0,0,1], 0, width, height));
  threedee.setPreset('views', 'viewzn', threedee.Geometry.makeViewPoint([0,0,0], [0,0,-1], 0, width, height));*/
  
  threedee.setDefaultPreset('algorithms', 'Greedy search');
  
  // Make page buttons
  threedee.presetsToHTML('datasets', $('#datasets'));
  threedee.presetsToHTML('views', $('#views'));
  threedee.presetsToHTML('algorithms', $('#algorithms'));
  
  threedee.makeRenderer('#viewport', width, height);
  threedee.makeEngine();
  
  //threedee.engine.start();
  threedee.engine.tick();
  
});

// Some globals for testing use and use by the web page
var presetDatasets = {};
var presetViews = {};

$(document).ready(function() {
  
  var width = 180,
      height = 120;
  
  var red = [255, 0, 0, 255],
      green = [0, 255, 0, 255],
      blue = [0, 0, 255, 255];
  
  threedee.setPreset('datasets', 'Sphere', [threedee.Geometry.makeShape('sphere', red, [5, 0, 0], 5),
                                            threedee.Geometry.makeShape('sphere', blue, [4, 0, 0], 5)/*,
                                            threedee.Geometry.makeShape('sphere', red, [-50, 0, 0], 11),
                                            threedee.Geometry.makeShape('sphere', green, [0, 50, 0], 10),
                                            threedee.Geometry.makeShape('sphere', green, [0, -50, 0], 9),
                                            threedee.Geometry.makeShape('sphere', blue, [0, 0, 50], 8),
                                            threedee.Geometry.makeShape('sphere', blue, [0, 0, -50], 7),*/
                                            ]);
  threedee.setPreset('datasets', 'Small point cloud', threedee.Geometry.generateRandomCloudOfPointData(5, 1000, 3, red));
  threedee.setPreset('datasets', 'Large point cloud', threedee.Geometry.generateRandomCloudOfPointData(100, 1000, 3, blue));
  threedee.setDefaultPreset('datasets', 'dataset3');

  threedee.setPreset('views', 'viewxp', threedee.Geometry.makeViewPoint({pt1 : [0,0,0], pt2 : [1,0,0]}, width, height));
/*  threedee.setPreset('views', 'viewxn', threedee.Geometry.makeViewPoint([0,0,0], [-1,0,0], 0, width, height));
  threedee.setPreset('views', 'viewyp', threedee.Geometry.makeViewPoint([0,0,0], [0,1,0], 0, width, height));
  threedee.setPreset('views', 'viewyn', threedee.Geometry.makeViewPoint([0,0,0], [0,-1,0], 0, width, height));
  threedee.setPreset('views', 'viewzp', threedee.Geometry.makeViewPoint([0,0,0], [0,0,1], 0, width, height));
  threedee.setPreset('views', 'viewzn', threedee.Geometry.makeViewPoint([0,0,0], [0,0,-1], 0, width, height));*/
  
  threedee.setDefaultPreset('algorithms', 'Greedy search');
  
  // Make page buttons
  threedee.presetsToHTML('datasets', $('#datasets'));
  threedee.presetsToHTML('views', $('#views'));
  threedee.presetsToHTML('algorithms', $('#algorithms'));
  
  threedee.makeRenderer('#viewport', width, height);
  threedee.makeEngine();
  
  //threedee.engine.start();
  threedee.engine.tick();
  
});

// Some globals for testing use and use by the web page
var presetDatasets = {};
var presetViews = {};

$(document).ready(function() {
  
  var width = 180,
      height = 120;
  
  var red = [255, 0, 0, 255],
      green = [0, 255, 0, 255],
      blue = [0, 0, 255, 255];
  
  threedee.setPreset('datasets', 'Sphere', [threedee.Geometry.makeShape('sphere', red, [5, 0, 0], 5),
                                            threedee.Geometry.makeShape('sphere', blue, [4, 0, 0], 5)/*,
                                            threedee.Geometry.makeShape('sphere', red, [-50, 0, 0], 11),
                                            threedee.Geometry.makeShape('sphere', green, [0, 50, 0], 10),
                                            threedee.Geometry.makeShape('sphere', green, [0, -50, 0], 9),
                                            threedee.Geometry.makeShape('sphere', blue, [0, 0, 50], 8),
                                            threedee.Geometry.makeShape('sphere', blue, [0, 0, -50], 7),*/
                                            ]);
  threedee.setPreset('datasets', 'Small point cloud', threedee.Geometry.generateRandomCloudOfPointData(5, 1000, 3, red));
  threedee.setPreset('datasets', 'Large point cloud', threedee.Geometry.generateRandomCloudOfPointData(100, 1000, 3, blue));
  threedee.setDefaultPreset('datasets', 'dataset3');

  threedee.setPreset('views', 'viewxp', threedee.Geometry.makeViewPoint({pt1 : [0,0,0], pt2 : [1,0,0]}, width, height));
/*  threedee.setPreset('views', 'viewxn', threedee.Geometry.makeViewPoint([0,0,0], [-1,0,0], 0, width, height));
  threedee.setPreset('views', 'viewyp', threedee.Geometry.makeViewPoint([0,0,0], [0,1,0], 0, width, height));
  threedee.setPreset('views', 'viewyn', threedee.Geometry.makeViewPoint([0,0,0], [0,-1,0], 0, width, height));
  threedee.setPreset('views', 'viewzp', threedee.Geometry.makeViewPoint([0,0,0], [0,0,1], 0, width, height));
  threedee.setPreset('views', 'viewzn', threedee.Geometry.makeViewPoint([0,0,0], [0,0,-1], 0, width, height));*/
  
  threedee.setDefaultPreset('algorithms', 'Greedy search');
  
  // Make page buttons
  threedee.presetsToHTML('datasets', $('#datasets'));
  threedee.presetsToHTML('views', $('#views'));
  threedee.presetsToHTML('algorithms', $('#algorithms'));
  
  threedee.makeRenderer('#viewport', width, height);
  threedee.makeEngine();
  
  //threedee.engine.start();
  threedee.engine.tick();
  
});

