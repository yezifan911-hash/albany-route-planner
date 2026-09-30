const fs = require('fs');
const vm = require('vm');

const html = fs.readFileSync('index.html', 'utf8');
const scripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)];
const appScript = scripts.at(-1)[1];

const elements = new Map();
function element(id) {
  if (!elements.has(id)) elements.set(id, {
    value: id === 'addresses' ? 'Albany, NY' : '',
    textContent: '', disabled: false, innerHTML: '',
    style: { setProperty() {} }, classList: { toggle() {} },
    addEventListener() {}, appendChild() {}, click() {}
  });
  return elements.get(id);
}

const chain = () => ({ addTo() { return this; }, bindPopup() { return this; } });
const context = {
  console,
  setTimeout,
  clearTimeout,
  Blob: global.Blob,
  URL: { createObjectURL: () => 'blob:test', revokeObjectURL() {} },
  localStorage: { getItem: () => null, setItem() {} },
  document: { getElementById: element, createElement: () => element(`created-${Math.random()}`) },
  L: {
    map: () => ({ setView() { return this; }, fitBounds() {} }),
    tileLayer: chain,
    layerGroup: () => ({ addTo() { return { clearLayers() {} }; } }),
    marker: chain,
    divIcon: options => options,
    geoJSON: chain,
    polyline: chain
  }
};

vm.createContext(context);
vm.runInContext(`${appScript}
  (() => {
    const records = parseCsv(DRIVER_TEMPLATE);
    if (records.length !== 8) throw new Error('Template CSV row count failed');
    driverProfiles = buildDriverProfiles(records);
    if (driverProfiles.length !== 4) throw new Error('Driver aggregation failed');
    if (!driverProfiles.every(driver => Number.isFinite(driver.performance))) throw new Error('Driver scoring failed');

    const depot = { lat:42.65, lon:-73.75 };
    const stops = [
      {lat:42.66,lon:-73.76},{lat:42.67,lon:-73.74},{lat:42.72,lon:-73.69},
      {lat:42.73,lon:-73.70},{lat:42.81,lon:-73.94},{lat:42.86,lon:-73.77},
      {lat:42.87,lon:-73.78},{lat:42.80,lon:-73.93}
    ];
    const groups = partition(stops, depot, 4);
    if (groups.length !== 4 || groups.some(group => group.length !== 2)) throw new Error('Balanced partition failed');
    const initial = nearestNeighbor(stops, depot);
    const optimized = twoOpt(initial, depot);
    if (routeLength(optimized, depot) > routeLength(initial, depot) + 1e-6) throw new Error('2-opt worsened route');
    const routes = groups.map(group => ({ stops: group }));
    matchDrivers(routes);
    if (routes.filter(route => route.driver).length !== 4) throw new Error('Driver matching failed');
    if (new Set(routes.map(route => route.driver.id)).size !== 4) throw new Error('Driver assigned more than once');
  })();
`, context);

console.log('Smoke tests passed');
