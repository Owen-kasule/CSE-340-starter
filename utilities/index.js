function formatNumberWithCommas(n) {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function toUSDollars(n) {
  return '$' + formatNumberWithCommas(n.toFixed(0));
}

function renderVehicleDetailHTML(v) {
  return `
<div class="vehicle-detail">
  <img src="${v.inv_image}"
       alt="${v.inv_make} ${v.inv_model}"
       class="vehicle-img" />
  <div class="vehicle-info">
    <h2>${v.inv_make} ${v.inv_model} (${v.inv_year})</h2>
    <p class="price">${toUSDollars(v.inv_price)}</p>
    <ul>
      <li><strong>Mileage:</strong> ${formatNumberWithCommas(v.inv_miles)} miles</li>
      <li><strong>Color:</strong> ${v.inv_color}</li>
      <li><strong>Description:</strong> ${v.inv_description}</li>
    </ul>
  </div>
</div>`;
}

module.exports = {
  formatNumberWithCommas,
  toUSDollars,
  renderVehicleDetailHTML,
};