function formatNumberWithCommas(n) {
  const num = Number(n);
  return num.toLocaleString();
}
function toUSDollars(n) {
  const num = Number(n);
  return '$' + num.toLocaleString(undefined, { maximumFractionDigits: 0 });
}

function renderVehicleDetailHTML(v) {
  // Build thumbnail gallery array
  const thumbs = v.inv_thumbnail
    ? v.inv_thumbnail.split(',').map(fn =>
        fn.trim().startsWith('/') ? fn.trim() : `/img/vehicles/${fn.trim()}`
      )
    : [];

  // Main image path
  const mainImg = v.inv_image.startsWith('/') ? v.inv_image : `/img/vehicles/${v.inv_image}`;

  return `
  <div class="vehicle-detail">
    <!-- LEFT: Image + Gallery -->
    <div class="detail-gallery">
      <img src="${mainImg}" alt="${v.inv_make} ${v.inv_model}" class="main-img"/>
      <div class="thumbs">
        ${thumbs.map(t => `<img src="${t}" class="thumb" />`).join('')}
      </div>
    </div>

    <!-- RIGHT: Specs & Actions -->
    <div class="detail-info">
      <h2>${v.inv_make} ${v.inv_model} (${v.inv_year})</h2>

      <!-- Price & Mileage strip -->
      <div class="strip">
        <div class="strip-item">
          <span class="label">Mileage</span>
          <span class="value">${formatNumberWithCommas(v.inv_miles)}</span>
        </div>
        <div class="strip-item stripe-right">
          <span class="label">Price</span>
          <span class="value">${toUSDollars(v.inv_price)}</span>
        </div>
      </div>

      <!-- Detail list -->
      <ul class="spec-list">
        <li><strong>Color:</strong> ${v.inv_color}</li>
        <li><strong>Fuel Type:</strong> ${v.inv_fuel}</li>
        <li><strong>Drivetrain:</strong> ${v.inv_drivetrain}</li>
        <li><strong>Transmission:</strong> ${v.inv_transmission}</li>
        <li><strong>Stock #:</strong> ${v.inv_stock}</li>
        <li><strong>VIN:</strong> ${v.inv_vin}</li>
        <li><strong>Description:</strong> ${v.inv_description}</li>
      </ul>

      <!-- Call-to-action buttons -->
      <div class="actions">
        <button class="btn primary">Start My Purchase</button>
        <button class="btn outline">Contact Us</button>
        <button class="btn outline">Schedule Test Drive</button>
        <button class="btn outline">Apply for Financing</button>
      </div>
    </div>
  </div>`;
}

async function buildClassificationList(classification_id = null) {
  const invModel = require('../models/inventoryModel');
  let data = await invModel.getClassifications();
  let classificationList =
    '<select name="classification_id" id="classificationList" required>';
  classificationList += "<option value=''>Choose a Classification</option>";
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"';
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected ";
    }
    classificationList += ">" + row.classification_name + "</option>";
  });
  classificationList += "</select>";
  return classificationList;
}

// Export the function!
module.exports = {
  formatNumberWithCommas,
  toUSDollars,
  renderVehicleDetailHTML,
  buildClassificationList,
};